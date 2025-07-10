// Enhanced Google API Service for better integration management
export interface GoogleAPIConfig {
  clientId?: string;
  apiKey?: string;
  discoveryDocs?: string[];
  scope?: string;
}

export class GoogleAPIService {
  private static instance: GoogleAPIService;
  private isInitialized = false;
  private gapi: any = null;

  static getInstance(): GoogleAPIService {
    if (!GoogleAPIService.instance) {
      GoogleAPIService.instance = new GoogleAPIService();
    }
    return GoogleAPIService.instance;
  }

  async initialize(config: GoogleAPIConfig): Promise<boolean> {
    try {
      if (this.isInitialized) return true;

      // Load Google API if not already loaded
      if (!window.gapi) {
        await this.loadGoogleAPI();
      }

      this.gapi = window.gapi;

      // Initialize the API
      await new Promise<void>((resolve, reject) => {
        this.gapi.load('client:auth2', async () => {
          try {
            await this.gapi.client.init({
              apiKey: config.apiKey,
              clientId: config.clientId,
              discoveryDocs: config.discoveryDocs || [
                'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
                'https://www.googleapis.com/discovery/v1/apis/fitness/v1/rest'
              ],
              scope: config.scope || 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/fitness.activity.read https://www.googleapis.com/auth/fitness.body.read'
            });

            this.isInitialized = true;
            resolve();
          } catch (error) {
            reject(error);
          }
        });
      });

      return true;
    } catch (error) {
      console.error('Failed to initialize Google API:', error);
      return false;
    }
  }

  private loadGoogleAPI(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.gapi) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Google API'));
      document.head.appendChild(script);
    });
  }

  async signIn(): Promise<boolean> {
    try {
      if (!this.isInitialized) {
        throw new Error('Google API not initialized');
      }

      const authInstance = this.gapi.auth2.getAuthInstance();
      const user = await authInstance.signIn();
      
      // Store auth info
      localStorage.setItem('google_access_token', user.getAuthResponse().access_token);
      localStorage.setItem('google_signed_in', 'true');
      
      return true;
    } catch (error) {
      console.error('Google Sign-In failed:', error);
      return false;
    }
  }

  async signOut(): Promise<void> {
    try {
      if (this.isInitialized) {
        const authInstance = this.gapi.auth2.getAuthInstance();
        await authInstance.signOut();
      }
      
      // Clear stored auth info
      localStorage.removeItem('google_access_token');
      localStorage.removeItem('google_signed_in');
    } catch (error) {
      console.error('Google Sign-Out failed:', error);
    }
  }

  isSignedIn(): boolean {
    return localStorage.getItem('google_signed_in') === 'true';
  }

  getClient() {
    return this.gapi?.client;
  }

  getAuthInstance() {
    return this.gapi?.auth2?.getAuthInstance();
  }
}

// Global declaration for TypeScript
declare global {
  interface Window {
    gapi: any;
  }
}