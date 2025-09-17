
// Google Calendar integration service
import { GoogleAPIService } from './googleAPI';
import { SecureStorage } from '@/utils/securityUtils';

declare global {
  interface Window {
    gapi: any;
  }
}

export interface CalendarEvent {
  id?: string;
  summary: string;
  description?: string;
  start: {
    dateTime: string;
    timeZone?: string;
  };
  end: {
    dateTime: string;
    timeZone?: string;
  };
  reminders?: {
    useDefault: boolean;
    overrides?: Array<{
      method: string;
      minutes: number;
    }>;
  };
}

export class GoogleCalendarService {
  private static instance: GoogleCalendarService;
  private googleAPI: GoogleAPIService;

  constructor() {
    this.googleAPI = GoogleAPIService.getInstance();
  }

  public static getInstance(): GoogleCalendarService {
    if (!GoogleCalendarService.instance) {
      GoogleCalendarService.instance = new GoogleCalendarService();
    }
    return GoogleCalendarService.instance;
  }

  async initialize(): Promise<boolean> {
    try {
      // Get API credentials from secure storage
      const apiKey = await SecureStorage.getSensitiveData('google_api_key');
      const clientId = await SecureStorage.getSensitiveData('google_client_id');
      
      if (!apiKey || !clientId) {
        console.warn('Google API credentials not found. Please configure them in Settings.');
        return false;
      }

      return await this.googleAPI.initialize({
        apiKey,
        clientId,
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
        scope: 'https://www.googleapis.com/auth/calendar'
      });
    } catch (error) {
      console.error('Failed to initialize Google Calendar API:', error);
      return false;
    }
  }

  async signIn(): Promise<boolean> {
    try {
      const initialized = await this.initialize();
      if (!initialized) return false;
      
      const success = await this.googleAPI.signIn();
      if (success) {
        localStorage.setItem('googleCalendar_connected', 'true');
      }
      
      return success;
    } catch (error) {
      console.error('Google Calendar sign-in failed:', error);
      return false;
    }
  }

  async createMealReminder(mealName: string, dateTime: Date): Promise<boolean> {
    try {
      const event: CalendarEvent = {
        summary: `🍽️ ${mealName} Time`,
        description: `Time for your ${mealName.toLowerCase()}! Check your meal plan in SourcePoint.`,
        start: {
          dateTime: dateTime.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        end: {
          dateTime: new Date(dateTime.getTime() + 15 * 60000).toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'notification', minutes: 10 },
            { method: 'popup', minutes: 5 }
          ]
        }
      };

      const client = this.googleAPI.getClient();
      if (!client) throw new Error('Google API client not available');

      const response = await client.calendar.events.insert({
        calendarId: 'primary',
        resource: event
      });

      return response.status === 200;
    } catch (error) {
      console.error('Failed to create meal reminder:', error);
      return false;
    }
  }

  async createWaterReminder(): Promise<boolean> {
    try {
      const now = new Date();
      const events = [];

      // Create hourly water reminders from 8 AM to 10 PM
      for (let hour = 8; hour <= 22; hour += 2) {
        const reminderTime = new Date(now);
        reminderTime.setHours(hour, 0, 0, 0);

        if (reminderTime > now) {
          events.push({
            summary: '💧 Water Break',
            description: 'Time to drink water! Stay hydrated for optimal health.',
            start: {
              dateTime: reminderTime.toISOString(),
              timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
            },
            end: {
              dateTime: new Date(reminderTime.getTime() + 5 * 60000).toISOString(),
              timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
            },
            reminders: {
              useDefault: false,
              overrides: [{ method: 'notification', minutes: 0 }]
            }
          });
        }
      }

      for (const event of events) {
        await window.gapi.client.calendar.events.insert({
          calendarId: 'primary',
          resource: event
        });
      }

      return true;
    } catch (error) {
      console.error('Failed to create water reminders:', error);
      return false;
    }
  }

  async createWorkoutReminder(workoutType: string, dateTime: Date): Promise<boolean> {
    try {
      const event: CalendarEvent = {
        summary: `💪 ${workoutType} Workout`,
        description: `Time for your ${workoutType.toLowerCase()} workout! Don't forget to hydrate and fuel properly.`,
        start: {
          dateTime: dateTime.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        end: {
          dateTime: new Date(dateTime.getTime() + 60 * 60000).toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'notification', minutes: 15 },
            { method: 'popup', minutes: 5 }
          ]
        }
      };

      const response = await window.gapi.client.calendar.events.insert({
        calendarId: 'primary',
        resource: event
      });

      return response.status === 200;
    } catch (error) {
      console.error('Failed to create workout reminder:', error);
      return false;
    }
  }

  private async loadGoogleAPI(): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => resolve();
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  isConnected(): boolean {
    return localStorage.getItem('googleCalendar_connected') === 'true';
  }
}
