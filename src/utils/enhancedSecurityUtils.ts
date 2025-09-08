import { SecureStorage, sanitizeInput, RateLimiter } from './securityUtils';

// Enhanced security utilities for health data protection
export class HealthDataSecurity {
  private static readonly HEALTH_DATA_PREFIX = 'health_';
  private static readonly MAX_DATA_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days
  
  // Encrypt and store health data with expiration
  static storeHealthData(key: string, data: any, expirationMs?: number): void {
    try {
      const timestamp = Date.now();
      const expiration = expirationMs ? timestamp + expirationMs : timestamp + this.MAX_DATA_AGE;
      
      const dataWithMetadata = {
        data: sanitizeInput(JSON.stringify(data)),
        timestamp,
        expiration,
        checksum: this.generateChecksum(data)
      };
      
      SecureStorage.setSensitiveData(
        `${this.HEALTH_DATA_PREFIX}${key}`,
        JSON.stringify(dataWithMetadata)
      );
    } catch (error) {
      console.error('Failed to store health data securely:', error);
      throw new Error('Health data storage failed');
    }
  }
  
  // Retrieve and verify health data
  static getHealthData(key: string): any | null {
    try {
      const storedData = SecureStorage.getSensitiveData(`${this.HEALTH_DATA_PREFIX}${key}`);
      if (!storedData) return null;
      
      const metadata = JSON.parse(storedData);
      
      // Check expiration
      if (Date.now() > metadata.expiration) {
        this.removeHealthData(key);
        return null;
      }
      
      const data = JSON.parse(metadata.data);
      
      // Verify data integrity
      if (this.generateChecksum(data) !== metadata.checksum) {
        console.warn('Health data integrity check failed');
        this.removeHealthData(key);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Failed to retrieve health data:', error);
      return null;
    }
  }
  
  // Remove health data
  static removeHealthData(key: string): void {
    SecureStorage.setSensitiveData(`${this.HEALTH_DATA_PREFIX}${key}`, '');
  }
  
  // Generate checksum for data integrity
  private static generateChecksum(data: any): string {
    const str = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString();
  }
  
  // Clean expired health data
  static cleanExpiredData(): number {
    let cleaned = 0;
    const keys = Object.keys(localStorage);
    
    keys.forEach(key => {
      if (key.includes(`${this.HEALTH_DATA_PREFIX}`)) {
        try {
          const storedData = SecureStorage.getSensitiveData(key.replace('encrypted_', ''));
          if (storedData) {
            const metadata = JSON.parse(storedData);
            if (Date.now() > metadata.expiration) {
              SecureStorage.setSensitiveData(key.replace('encrypted_', ''), '');
              cleaned++;
            }
          }
        } catch (error) {
          // Remove corrupted data
          SecureStorage.setSensitiveData(key.replace('encrypted_', ''), '');
          cleaned++;
        }
      }
    });
    
    return cleaned;
  }
}

// API Security Manager
export class APISecurityManager {
  private static readonly API_RATE_LIMITS = {
    openai: { requests: 60, window: 60000 }, // 60 requests per minute
    anthropic: { requests: 50, window: 60000 },
    perplexity: { requests: 100, window: 60000 },
    elevenlabs: { requests: 30, window: 60000 }
  };
  
  // Check if API call is allowed (rate limiting)
  static canMakeAPICall(provider: string, userId?: string): boolean {
    const key = `api_${provider}_${userId || 'default'}`;
    const limits = this.API_RATE_LIMITS[provider as keyof typeof this.API_RATE_LIMITS];
    
    if (!limits) return true;
    
    return RateLimiter.checkRateLimit(key, limits.requests, limits.window);
  }
  
  // Validate API response for security
  static validateAPIResponse(response: any, expectedSchema?: any): boolean {
    try {
      // Basic validation
      if (!response || typeof response !== 'object') return false;
      
      // Check for potential XSS in response
      const responseStr = JSON.stringify(response);
      const xssPatterns = [
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        /javascript:/gi,
        /on\w+\s*=/gi
      ];
      
      if (xssPatterns.some(pattern => pattern.test(responseStr))) {
        console.warn('Potential XSS detected in API response');
        return false;
      }
      
      // Schema validation if provided
      if (expectedSchema) {
        return this.validateSchema(response, expectedSchema);
      }
      
      return true;
    } catch (error) {
      console.error('API response validation failed:', error);
      return false;
    }
  }
  
  // Simple schema validation
  private static validateSchema(data: any, schema: any): boolean {
    if (typeof schema !== 'object' || typeof data !== 'object') {
      return typeof data === typeof schema;
    }
    
    for (const key in schema) {
      if (!(key in data)) return false;
      if (!this.validateSchema(data[key], schema[key])) return false;
    }
    
    return true;
  }
  
  // Sanitize API request data
  static sanitizeAPIRequest(data: any): any {
    if (typeof data === 'string') {
      return sanitizeInput(data);
    }
    
    if (Array.isArray(data)) {
      return data.map(item => this.sanitizeAPIRequest(item));
    }
    
    if (typeof data === 'object' && data !== null) {
      const sanitized: any = {};
      for (const key in data) {
        sanitized[sanitizeInput(key)] = this.sanitizeAPIRequest(data[key]);
      }
      return sanitized;
    }
    
    return data;
  }
}

// Content Security Policy helper
export class CSPManager {
  static getCSPHeader(): string {
    return [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Needed for React dev
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://api.openai.com https://api.anthropic.com https://api.perplexity.ai https://api.elevenlabs.io https://*.googleapis.com",
      "media-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests"
    ].join('; ');
  }
  
  static applyCSP(): void {
    const meta = document.createElement('meta');
    meta.setAttribute('http-equiv', 'Content-Security-Policy');
    meta.setAttribute('content', this.getCSPHeader());
    document.head.appendChild(meta);
  }
}

// Session Security Manager
export class SessionSecurity {
  private static readonly SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  private static readonly ACTIVITY_CHECK_INTERVAL = 60 * 1000; // 1 minute
  
  private static lastActivity = Date.now();
  private static timeoutWarningShown = false;
  
  static initializeSessionSecurity(): void {
    this.updateLastActivity();
    this.startActivityMonitoring();
    this.addActivityListeners();
  }
  
  static updateLastActivity(): void {
    this.lastActivity = Date.now();
    this.timeoutWarningShown = false;
  }
  
  private static startActivityMonitoring(): void {
    setInterval(() => {
      const timeSinceLastActivity = Date.now() - this.lastActivity;
      
      // Show warning at 25 minutes
      if (timeSinceLastActivity > (25 * 60 * 1000) && !this.timeoutWarningShown) {
        this.showTimeoutWarning();
        this.timeoutWarningShown = true;
      }
      
      // Auto-logout at 30 minutes
      if (timeSinceLastActivity > this.SESSION_TIMEOUT) {
        this.handleSessionTimeout();
      }
    }, this.ACTIVITY_CHECK_INTERVAL);
  }
  
  private static addActivityListeners(): void {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
      document.addEventListener(event, () => this.updateLastActivity(), true);
    });
  }
  
  private static showTimeoutWarning(): void {
    // This would typically show a toast or modal warning
    console.warn('Session will expire soon due to inactivity');
  }
  
  private static handleSessionTimeout(): void {
    // Clear sensitive data and redirect
    SecureStorage.clearAllApiKeys();
    HealthDataSecurity.cleanExpiredData();
    window.location.reload();
  }
}