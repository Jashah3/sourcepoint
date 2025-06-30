
// Health integrations service for Google Fit, Apple Health, and Fitbit
declare global {
  interface Window {
    gapi: any;
    AppleHealthKit: any;
  }
}

export interface HealthData {
  steps: number;
  calories: number;
  heartRate?: number;
  weight?: number;
  waterIntake?: number;
}

export class HealthIntegrations {
  private static instance: HealthIntegrations;
  
  public static getInstance(): HealthIntegrations {
    if (!HealthIntegrations.instance) {
      HealthIntegrations.instance = new HealthIntegrations();
    }
    return HealthIntegrations.instance;
  }

  // Google Fit Integration
  async connectGoogleFit(): Promise<boolean> {
    try {
      if (!window.gapi) {
        await this.loadGoogleAPI();
      }
      
      await window.gapi.load('auth2', () => {
        window.gapi.auth2.init({
          client_id: 'your-google-client-id.apps.googleusercontent.com'
        });
      });

      const authInstance = window.gapi.auth2.getAuthInstance();
      const user = await authInstance.signIn({
        scope: 'https://www.googleapis.com/auth/fitness.activity.read https://www.googleapis.com/auth/fitness.body.read'
      });

      localStorage.setItem('googleFit_connected', 'true');
      localStorage.setItem('googleFit_token', user.getAuthResponse().access_token);
      return true;
    } catch (error) {
      console.error('Google Fit connection failed:', error);
      return false;
    }
  }

  async getGoogleFitData(): Promise<HealthData | null> {
    try {
      const token = localStorage.getItem('googleFit_token');
      if (!token) return null;

      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0)).getTime();
      const endOfDay = new Date(today.setHours(23, 59, 59, 999)).getTime();

      const response = await fetch(`https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          aggregateBy: [
            { dataTypeName: 'com.google.step_count.delta' },
            { dataTypeName: 'com.google.calories.expended' }
          ],
          bucketByTime: { durationMillis: 86400000 },
          startTimeMillis: startOfDay,
          endTimeMillis: endOfDay
        })
      });

      const data = await response.json();
      return this.parseGoogleFitData(data);
    } catch (error) {
      console.error('Failed to fetch Google Fit data:', error);
      return null;
    }
  }

  // Apple Health Integration
  async connectAppleHealth(): Promise<boolean> {
    try {
      if (!window.AppleHealthKit) {
        console.warn('Apple HealthKit not available on this platform');
        return false;
      }

      return new Promise((resolve) => {
        const permissions = {
          permissions: {
            read: ['Steps', 'Weight', 'HeartRate', 'ActiveEnergyBurned']
          }
        };

        window.AppleHealthKit.initHealthKit(permissions, (error: any) => {
          if (error) {
            console.error('Apple Health connection failed:', error);
            resolve(false);
          } else {
            localStorage.setItem('appleHealth_connected', 'true');
            resolve(true);
          }
        });
      });
    } catch (error) {
      console.error('Apple Health connection failed:', error);
      return false;
    }
  }

  async getAppleHealthData(): Promise<HealthData | null> {
    try {
      if (!window.AppleHealthKit || !localStorage.getItem('appleHealth_connected')) {
        return null;
      }

      return new Promise((resolve) => {
        const today = new Date();
        const options = {
          startDate: new Date(today.setHours(0, 0, 0, 0)).toISOString(),
          endDate: new Date().toISOString()
        };

        window.AppleHealthKit.getStepCount(options, (err: any, results: any) => {
          if (err) {
            resolve(null);
            return;
          }
          
          resolve({
            steps: results.value || 0,
            calories: 0 // Would need additional calls for calories
          });
        });
      });
    } catch (error) {
      console.error('Failed to fetch Apple Health data:', error);
      return null;
    }
  }

  // Fitbit Integration
  async connectFitbit(): Promise<boolean> {
    try {
      const clientId = 'your-fitbit-client-id';
      const redirectUri = encodeURIComponent(window.location.origin);
      const scope = 'activity heartrate nutrition profile sleep social weight';
      
      const authUrl = `https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
      
      window.location.href = authUrl;
      return true;
    } catch (error) {
      console.error('Fitbit connection failed:', error);
      return false;
    }
  }

  async getFitbitData(): Promise<HealthData | null> {
    try {
      const token = localStorage.getItem('fitbit_token');
      if (!token) return null;

      const response = await fetch('https://api.fitbit.com/1/user/-/activities/date/today.json', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      return {
        steps: data.summary?.steps || 0,
        calories: data.summary?.caloriesOut || 0,
        heartRate: data.summary?.restingHeartRate
      };
    } catch (error) {
      console.error('Failed to fetch Fitbit data:', error);
      return null;
    }
  }

  // Utility methods
  private async loadGoogleAPI(): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => resolve();
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  private parseGoogleFitData(data: any): HealthData {
    let steps = 0;
    let calories = 0;

    data.bucket?.forEach((bucket: any) => {
      bucket.dataset?.forEach((dataset: any) => {
        dataset.point?.forEach((point: any) => {
          if (point.dataTypeName === 'com.google.step_count.delta') {
            steps += point.value?.[0]?.intVal || 0;
          }
          if (point.dataTypeName === 'com.google.calories.expended') {
            calories += point.value?.[0]?.fpVal || 0;
          }
        });
      });
    });

    return { steps, calories };
  }

  // Check connection status
  isGoogleFitConnected(): boolean {
    return localStorage.getItem('googleFit_connected') === 'true';
  }

  isAppleHealthConnected(): boolean {
    return localStorage.getItem('appleHealth_connected') === 'true';
  }

  isFitbitConnected(): boolean {
    return localStorage.getItem('fitbit_connected') === 'true';
  }
}
