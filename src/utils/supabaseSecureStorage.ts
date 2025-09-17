// Supabase-based secure storage for API keys and sensitive data
import { supabase } from "@/integrations/supabase/client";

export interface SecureStorageItem {
  id?: string;
  user_id: string;
  key_name: string;
  encrypted_value: text;
  created_at?: string;
  updated_at?: string;
}

// Secure storage interface using Supabase backend
export class SupabaseSecureStorage {
  private static readonly TABLE_NAME = 'secure_storage';

  static async setApiKey(provider: string, apiKey: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      if (!apiKey || apiKey.trim() === '') {
        // Delete the key if empty
        const { error } = await supabase
          .from(this.TABLE_NAME)
          .delete()
          .eq('user_id', user.id)
          .eq('key_name', `api_${provider}`);
        
        return !error;
      }

      // Upsert the API key
      const { error } = await supabase
        .from(this.TABLE_NAME)
        .upsert({
          user_id: user.id,
          key_name: `api_${provider}`,
          encrypted_value: apiKey
        }, {
          onConflict: 'user_id,key_name'
        });

      return !error;
    } catch (error) {
      console.error('Failed to store API key:', error);
      return false;
    }
  }

  static async getApiKey(provider: string): Promise<string | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from(this.TABLE_NAME)
        .select('encrypted_value')
        .eq('user_id', user.id)
        .eq('key_name', `api_${provider}`)
        .maybeSingle();

      if (error || !data) return null;
      return data.encrypted_value;
    } catch (error) {
      console.error('Failed to retrieve API key:', error);
      return null;
    }
  }

  static async setSensitiveData(key: string, data: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      if (!data || data.trim() === '') {
        // Delete the data if empty
        const { error } = await supabase
          .from(this.TABLE_NAME)
          .delete()
          .eq('user_id', user.id)
          .eq('key_name', `data_${key}`);
        
        return !error;
      }

      // Upsert the sensitive data
      const { error } = await supabase
        .from(this.TABLE_NAME)
        .upsert({
          user_id: user.id,
          key_name: `data_${key}`,
          encrypted_value: data
        }, {
          onConflict: 'user_id,key_name'
        });

      return !error;
    } catch (error) {
      console.error('Failed to store sensitive data:', error);
      return false;
    }
  }

  static async getSensitiveData(key: string): Promise<string | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from(this.TABLE_NAME)
        .select('encrypted_value')
        .eq('user_id', user.id)
        .eq('key_name', `data_${key}`)
        .maybeSingle();

      if (error || !data) return null;
      return data.encrypted_value;
    } catch (error) {
      console.error('Failed to retrieve sensitive data:', error);
      return null;
    }
  }

  static async clearAllData(): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { error } = await supabase
        .from(this.TABLE_NAME)
        .delete()
        .eq('user_id', user.id);

      return !error;
    } catch (error) {
      console.error('Failed to clear all data:', error);
      return false;
    }
  }
}

// Input validation utilities (keeping these as they're still secure)
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
    .replace(/[<>'\"&]/g, (char) => {
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
