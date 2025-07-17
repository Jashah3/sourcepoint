// Security utilities for handling sensitive data
import CryptoJS from 'crypto-js';

// Generate a browser-specific encryption key
const getEncryptionKey = (): string => {
  const browserFingerprint = navigator.userAgent + navigator.language + screen.width + screen.height;
  return CryptoJS.SHA256(browserFingerprint).toString();
};

// Encrypt sensitive data before storing
export const encryptData = (data: string): string => {
  try {
    const key = getEncryptionKey();
    return CryptoJS.AES.encrypt(data, key).toString();
  } catch (error) {
    console.error('Encryption failed:', error);
    return data; // Fallback to unencrypted in case of error
  }
};

// Decrypt sensitive data after retrieving
export const decryptData = (encryptedData: string): string => {
  try {
    const key = getEncryptionKey();
    const bytes = CryptoJS.AES.decrypt(encryptedData, key);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Decryption failed:', error);
    return encryptedData; // Return as-is if decryption fails
  }
};

// Secure storage interface
export class SecureStorage {
  private static readonly API_KEY_PREFIX = 'enc_api_';
  private static readonly SENSITIVE_DATA_PREFIX = 'enc_data_';

  static setApiKey(provider: string, apiKey: string): void {
    if (!apiKey || apiKey.trim() === '') {
      localStorage.removeItem(`${this.API_KEY_PREFIX}${provider}`);
      return;
    }
    
    const encrypted = encryptData(apiKey);
    localStorage.setItem(`${this.API_KEY_PREFIX}${provider}`, encrypted);
  }

  static getApiKey(provider: string): string | null {
    const encrypted = localStorage.getItem(`${this.API_KEY_PREFIX}${provider}`);
    if (!encrypted) return null;
    
    const decrypted = decryptData(encrypted);
    return decrypted || null;
  }

  static setSensitiveData(key: string, data: string): void {
    if (!data || data.trim() === '') {
      localStorage.removeItem(`${this.SENSITIVE_DATA_PREFIX}${key}`);
      return;
    }
    
    const encrypted = encryptData(data);
    localStorage.setItem(`${this.SENSITIVE_DATA_PREFIX}${key}`, encrypted);
  }

  static getSensitiveData(key: string): string | null {
    const encrypted = localStorage.getItem(`${this.SENSITIVE_DATA_PREFIX}${key}`);
    if (!encrypted) return null;
    
    const decrypted = decryptData(encrypted);
    return decrypted || null;
  }

  static clearAllApiKeys(): void {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(this.API_KEY_PREFIX) || key.startsWith(this.SENSITIVE_DATA_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  }
}

// Input validation utilities
export const validateApiKey = (provider: string, apiKey: string): { isValid: boolean; error?: string } => {
  if (!apiKey || apiKey.trim() === '') {
    return { isValid: false, error: 'API key cannot be empty' };
  }

  const patterns = {
    openai: /^sk-[A-Za-z0-9]{20,}$/,
    anthropic: /^sk-ant-[A-Za-z0-9\-_]{20,}$/,
    perplexity: /^pplx-[A-Za-z0-9]{20,}$/,
    elevenlabs: /^[A-Za-z0-9]{32}$/,
    google: /^[A-Za-z0-9\-_]{20,}$/
  };

  const pattern = patterns[provider.toLowerCase() as keyof typeof patterns];
  if (!pattern) {
    return { isValid: true }; // Allow unknown providers for future compatibility
  }

  if (!pattern.test(apiKey)) {
    return { 
      isValid: false, 
      error: `Invalid ${provider} API key format. Please check your key.` 
    };
  }

  return { isValid: true };
};

// Sanitize user input to prevent XSS
export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/[<>'"&]/g, (char) => {
      const entities: { [key: string]: string } = {
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '&': '&amp;'
      };
      return entities[char] || char;
    })
    .trim()
    .slice(0, 1000); // Limit input length
};

// Rate limiting utility
export class RateLimiter {
  private static requests = new Map<string, number[]>();

  static checkRateLimit(key: string, maxRequests: number = 10, windowMs: number = 60000): boolean {
    const now = Date.now();
    const windowStart = now - windowMs;
    
    if (!this.requests.has(key)) {
      this.requests.set(key, []);
    }
    
    const timestamps = this.requests.get(key)!.filter(timestamp => timestamp > windowStart);
    
    if (timestamps.length >= maxRequests) {
      return false; // Rate limit exceeded
    }
    
    timestamps.push(now);
    this.requests.set(key, timestamps);
    
    return true;
  }
}

// Content Security Policy helpers
export const getSecureHeaders = (): HeadersInit => ({
  'Content-Type': 'application/json',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
});