// Security utilities for handling sensitive data
// DEPRECATED: Client-side encryption methods removed for security reasons
// Use SupabaseSecureStorage instead for secure server-side storage

import { SupabaseSecureStorage } from './supabaseSecureStorage';

// Legacy SecureStorage class - deprecated, use TempSecureStorage instead
import { TempSecureStorage } from './tempSecureStorage';

export class SecureStorage {
  static async setApiKey(provider: string, apiKey: string): Promise<void> {
    await TempSecureStorage.setApiKey(provider, apiKey);
  }

  static async getApiKey(provider: string): Promise<string | null> {
    return await TempSecureStorage.getApiKey(provider);
  }

  static async setSensitiveData(key: string, data: string): Promise<void> {
    await TempSecureStorage.setSensitiveData(key, data);
  }

  static async getSensitiveData(key: string): Promise<string | null> {
    return await TempSecureStorage.getSensitiveData(key);
  }

  static async clearAllApiKeys(): Promise<void> {
    await TempSecureStorage.clearAllData();
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