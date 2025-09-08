import { supabase } from '@/integrations/supabase/client';
import { GoogleAPIService } from './googleAPI';
import CryptoJS from 'crypto-js';

export interface HealthData {
  steps?: number;
  calories?: number;
  heartRate?: number;
  weight?: number;
  waterIntake?: number;
  sleepHours?: number;
  distance?: number;
}

export interface HealthIntegration {
  id: string;
  user_id: string;
  service_name: string;
  is_connected: boolean;
  last_sync_at: string | null;
}

class EnhancedHealthIntegrations {
  private static instance: EnhancedHealthIntegrations;
  private encryptionKey = 'health-integration-key-2024'; // In production, use a secure key

  static getInstance(): EnhancedHealthIntegrations {
    if (!EnhancedHealthIntegrations.instance) {
      EnhancedHealthIntegrations.instance = new EnhancedHealthIntegrations();
    }
    return EnhancedHealthIntegrations.instance;
  }

  private encrypt(text: string): string {
    return CryptoJS.AES.encrypt(text, this.encryptionKey).toString();
  }

  private decrypt(ciphertext: string): string {
    const bytes = CryptoJS.AES.decrypt(ciphertext, this.encryptionKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  async getHealthIntegrations(): Promise<HealthIntegration[]> {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session?.user) return [];

    const { data, error } = await supabase
      .from('health_integrations')
      .select('*')
      .eq('user_id', session.session.user.id);

    if (error) {
      console.error('Error fetching health integrations:', error);
      return [];
    }

    return data || [];
  }

  async updateIntegrationStatus(serviceName: string, isConnected: boolean, accessToken?: string, refreshToken?: string): Promise<boolean> {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session?.user) return false;

    const integrationData: any = {
      user_id: session.session.user.id,
      service_name: serviceName,
      is_connected: isConnected,
      last_sync_at: isConnected ? new Date().toISOString() : null,
    };

    if (accessToken) {
      integrationData.access_token_encrypted = this.encrypt(accessToken);
    }
    if (refreshToken) {
      integrationData.refresh_token_encrypted = this.encrypt(refreshToken);
    }

    const { error } = await supabase
      .from('health_integrations')
      .upsert(integrationData, {
        onConflict: 'user_id,service_name'
      });

    if (error) {
      console.error('Error updating integration status:', error);
      return false;
    }

    return true;
  }

  async connectGoogleFit(): Promise<boolean> {
    try {
      const googleAPI = GoogleAPIService.getInstance();
      
      // Initialize with config from secure storage or environment
      const config = {
        apiKey: localStorage.getItem('google_api_key') || '',
        clientId: localStorage.getItem('google_client_id') || '',
        scope: 'https://www.googleapis.com/auth/fitness.activity.read https://www.googleapis.com/auth/fitness.body.read'
      };

      const isInitialized = await googleAPI.initialize(config);
      if (!isInitialized) {
        console.error('Failed to initialize Google API');
        return false;
      }

      const isSignedIn = await googleAPI.signIn();
      if (!isSignedIn) {
        console.error('Failed to sign in to Google');
        return false;
      }

      // Get access token for storage
      const authInstance = googleAPI.getAuthInstance();
      const user = authInstance.currentUser.get();
      const accessToken = user.getAuthResponse().access_token;
      
      // Update integration status in database
      const success = await this.updateIntegrationStatus('google_fit', true, accessToken);
      
      if (success) {
        await this.syncGoogleFitData();
      }

      return success;
    } catch (error) {
      console.error('Error connecting Google Fit:', error);
      return false;
    }
  }

  async connectAppleHealth(): Promise<boolean> {
    try {
      // Check if running on iOS Safari
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      if (!isIOS) {
        console.log('Apple Health is only available on iOS devices');
        return false;
      }

      // In a real implementation, you would use the HealthKit API
      // For now, we'll simulate the connection
      const success = await this.updateIntegrationStatus('apple_health', true);
      
      if (success) {
        await this.syncAppleHealthData();
      }

      return success;
    } catch (error) {
      console.error('Error connecting Apple Health:', error);
      return false;
    }
  }

  async connectFitbit(): Promise<boolean> {
    try {
      // Get Fitbit client ID from secure storage
      const clientId = localStorage.getItem('fitbit_client_id');
      if (!clientId) {
        console.error('Fitbit Client ID not configured');
        return false;
      }

      const redirectUri = `${window.location.origin}/auth/fitbit/callback`;
      const scope = 'activity heartrate nutrition profile sleep weight';
      const authUrl = `https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;

      // Open Fitbit authorization in a new window
      const authWindow = window.open(authUrl, 'fitbit-auth', 'width=600,height=600');
      
      return new Promise((resolve) => {
        const checkClosed = setInterval(() => {
          if (authWindow?.closed) {
            clearInterval(checkClosed);
            // Check if authorization was successful
            this.checkFitbitConnection().then(resolve);
          }
        }, 1000);
      });
    } catch (error) {
      console.error('Error connecting Fitbit:', error);
      return false;
    }
  }

  private async checkFitbitConnection(): Promise<boolean> {
    // This would normally check for the callback result
    // For now, simulate a successful connection
    return await this.updateIntegrationStatus('fitbit', true);
  }

  async syncGoogleFitData(): Promise<HealthData | null> {
    try {
      const googleAPI = GoogleAPIService.getInstance();
      const client = googleAPI.getClient();
      
      if (!client) {
        console.error('Google API client not initialized');
        return null;
      }

      const endTime = new Date();
      const startTime = new Date();
      startTime.setDate(startTime.getDate() - 1); // Last 24 hours

      // Fetch steps data
      const stepsResponse = await client.fitness.users.dataSources.dataPointChanges.list({
        userId: 'me',
        dataSourceId: 'derived:com.google.step_count.delta:com.google.android.gms:estimated_steps',
        startTime: {
          timeMillis: startTime.getTime().toString()
        },
        endTime: {
          timeMillis: endTime.getTime().toString()
        }
      });

      // Process and store the data
      const healthData = this.parseGoogleFitData(stepsResponse);
      await this.storeHealthData('google_fit', healthData);
      
      return healthData;
    } catch (error) {
      console.error('Error syncing Google Fit data:', error);
      return null;
    }
  }

  async syncAppleHealthData(): Promise<HealthData | null> {
    try {
      // Simulate Apple Health data sync
      const healthData: HealthData = {
        steps: Math.floor(Math.random() * 10000) + 5000,
        calories: Math.floor(Math.random() * 500) + 1800,
        heartRate: Math.floor(Math.random() * 40) + 60,
        sleepHours: Math.floor(Math.random() * 3) + 6,
      };

      await this.storeHealthData('apple_health', healthData);
      return healthData;
    } catch (error) {
      console.error('Error syncing Apple Health data:', error);
      return null;
    }
  }

  private parseGoogleFitData(response: any): HealthData {
    const healthData: HealthData = {};

    if (response.point && response.point.length > 0) {
      let totalSteps = 0;
      response.point.forEach((point: any) => {
        if (point.value && point.value.length > 0) {
          totalSteps += point.value[0].intVal || 0;
        }
      });
      healthData.steps = totalSteps;
    }

    return healthData;
  }

  async storeHealthData(source: string, data: HealthData): Promise<void> {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session?.user) return;

    const healthDataEntries = Object.entries(data).map(([dataType, value]) => ({
      user_id: session.session!.user.id,
      source_service: source,
      data_type: dataType,
      data_value: { value },
      recorded_at: new Date().toISOString(),
    }));

    const { error } = await supabase
      .from('health_data')
      .insert(healthDataEntries);

    if (error) {
      console.error('Error storing health data:', error);
    }
  }

  async getHealthData(days: number = 7): Promise<HealthData> {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session?.user) return {};

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from('health_data')
      .select('*')
      .eq('user_id', session.session.user.id)
      .gte('recorded_at', startDate.toISOString())
      .order('recorded_at', { ascending: false });

    if (error) {
      console.error('Error fetching health data:', error);
      return {};
    }

    // Aggregate the data by type
    const aggregatedData: HealthData = {};
    const dataByType: { [key: string]: number[] } = {};

    data?.forEach((entry) => {
      const dataType = entry.data_type;
      const dataValue = entry.data_value as any;
      const value = (dataValue?.value) || 0;
      
      if (!dataByType[dataType]) {
        dataByType[dataType] = [];
      }
      dataByType[dataType].push(value);
    });

    // Calculate averages or sums based on data type
    Object.entries(dataByType).forEach(([dataType, values]) => {
      if (dataType === 'steps' || dataType === 'calories') {
        // Sum for cumulative data
        (aggregatedData as any)[dataType] = values.reduce((sum, val) => sum + val, 0);
      } else {
        // Average for other metrics
        (aggregatedData as any)[dataType] = values.reduce((sum, val) => sum + val, 0) / values.length;
      }
    });

    return aggregatedData;
  }

  async disconnectService(serviceName: string): Promise<boolean> {
    const success = await this.updateIntegrationStatus(serviceName, false);
    
    if (success && serviceName === 'google_fit') {
      const googleAPI = GoogleAPIService.getInstance();
      await googleAPI.signOut();
    }

    return success;
  }

  async isServiceConnected(serviceName: string): Promise<boolean> {
    const integrations = await this.getHealthIntegrations();
    const integration = integrations.find(i => i.service_name === serviceName);
    return integration?.is_connected || false;
  }
}

export default EnhancedHealthIntegrations;