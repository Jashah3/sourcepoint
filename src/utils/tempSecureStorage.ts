// Temporary localStorage-based secure storage to maintain interface compatibility
// This will be replaced by SupabaseSecureStorage once migration is applied

export class TempSecureStorage {
  static async setApiKey(provider: string, apiKey: string): Promise<boolean> {
    try {
      if (!apiKey || apiKey.trim() === '') {
        localStorage.removeItem(`secure_api_${provider}`);
      } else {
        localStorage.setItem(`secure_api_${provider}`, apiKey);
      }
      return true;
    } catch (error) {
      console.error('Failed to store API key:', error);
      return false;
    }
  }

  static async getApiKey(provider: string): Promise<string | null> {
    try {
      return localStorage.getItem(`secure_api_${provider}`);
    } catch (error) {
      console.error('Failed to retrieve API key:', error);
      return null;
    }
  }

  static async setSensitiveData(key: string, data: string): Promise<boolean> {
    try {
      if (!data || data.trim() === '') {
        localStorage.removeItem(`secure_data_${key}`);
      } else {
        localStorage.setItem(`secure_data_${key}`, data);
      }
      return true;
    } catch (error) {
      console.error('Failed to store sensitive data:', error);
      return false;
    }
  }

  static async getSensitiveData(key: string): Promise<string | null> {
    try {
      return localStorage.getItem(`secure_data_${key}`);
    } catch (error) {
      console.error('Failed to retrieve sensitive data:', error);
      return null;
    }
  }

  static async clearAllData(): Promise<boolean> {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('secure_')) {
          localStorage.removeItem(key);
        }
      });
      return true;
    } catch (error) {
      console.error('Failed to clear all data:', error);
      return false;
    }
  }
}