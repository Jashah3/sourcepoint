
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useTheme } from "./ThemeProvider";
import { HealthIntegrations } from "@/services/healthIntegrations";
import { GoogleCalendarService } from "@/services/googleCalendar";
import { toast } from "@/hooks/use-toast";
import { CheckCircle, Circle, Smartphone, Watch, Calendar, Key, Bot, Cpu } from "lucide-react";

export const Settings = () => {
  const { theme, setTheme } = useTheme();
  const [connecting, setConnecting] = useState<string | null>(null);
  const [apiKeys, setApiKeys] = useState({
    openai: localStorage.getItem('openai_api_key') || '',
    anthropic: localStorage.getItem('anthropic_api_key') || '',
    perplexity: localStorage.getItem('perplexity_api_key') || '',
    elevenlabs: localStorage.getItem('elevenlabs_api_key') || ''
  });
  const healthService = HealthIntegrations.getInstance();
  const calendarService = GoogleCalendarService.getInstance();

  const handleHealthIntegration = async (service: string) => {
    setConnecting(service);
    let success = false;

    try {
      switch (service) {
        case 'googleFit':
          success = await healthService.connectGoogleFit();
          break;
        case 'appleHealth':
          success = await healthService.connectAppleHealth();
          break;
        case 'fitbit':
          success = await healthService.connectFitbit();
          break;
        case 'googleCalendar':
          success = await calendarService.signIn();
          break;
      }

      if (success) {
        toast({
          title: "Connection Successful! ✅",
          description: `${service === 'googleFit' ? 'Google Fit' : service === 'appleHealth' ? 'Apple Health' : service === 'fitbit' ? 'Fitbit' : 'Google Calendar'} connected successfully.`,
        });
      } else {
        toast({
          title: "Connection Failed ❌",
          description: "Failed to connect. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error(`${service} connection error:`, error);
      toast({
        title: "Connection Error ❌",
        description: "An error occurred while connecting.",
        variant: "destructive"
      });
    } finally {
      setConnecting(null);
    }
  };

  const resetOnboarding = () => {
    localStorage.removeItem('sourcePoint_onboarded');
    window.location.reload();
  };

  const handleApiKeyChange = (service: string, value: string) => {
    setApiKeys(prev => ({ ...prev, [service]: value }));
    localStorage.setItem(`${service}_api_key`, value);
    toast({
      title: "API Key Updated",
      description: `${service.charAt(0).toUpperCase() + service.slice(1)} API key has been saved.`
    });
  };

  const clearAllData = () => {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
            ⚙️ App Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
            <Label htmlFor="dark-mode" className="text-gray-700 dark:text-gray-300">Dark Mode</Label>
            <Switch
              id="dark-mode"
              checked={theme === 'dark'}
              onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
              className="data-[state=checked]:bg-gray-600"
            />
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
            <Label htmlFor="notifications" className="text-gray-700 dark:text-gray-300">Push Notifications</Label>
            <Switch id="notifications" className="data-[state=checked]:bg-gray-600" />
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
            <Label htmlFor="voice-commands" className="text-gray-700 dark:text-gray-300">Voice Commands</Label>
            <Switch id="voice-commands" className="data-[state=checked]:bg-gray-600" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
            <Calendar className="h-5 w-5 text-gray-600" />
            Calendar Integration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {calendarService.isConnected() ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <Circle className="h-5 w-5 text-gray-400" />
                )}
                <span className="font-medium text-gray-700 dark:text-gray-300">Google Calendar</span>
              </div>
              {calendarService.isConnected() && (
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                  Connected
                </Badge>
              )}
            </div>
            <Button
              onClick={() => handleHealthIntegration('googleCalendar')}
              disabled={connecting === 'googleCalendar' || calendarService.isConnected()}
              className="bg-gray-600 hover:bg-gray-700 text-white"
            >
              {connecting === 'googleCalendar' ? 'Connecting...' : calendarService.isConnected() ? '✓ Connected' : 'Connect'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
            <Smartphone className="h-5 w-5 text-gray-600" />
            Health Data Integrations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {healthService.isGoogleFitConnected() ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <Circle className="h-5 w-5 text-gray-400" />
                )}
                <span className="font-medium text-gray-700 dark:text-gray-300">Google Fit</span>
              </div>
              {healthService.isGoogleFitConnected() && (
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                  Connected
                </Badge>
              )}
            </div>
            <Button
              onClick={() => handleHealthIntegration('googleFit')}
              disabled={connecting === 'googleFit' || healthService.isGoogleFitConnected()}
              className="bg-gray-600 hover:bg-gray-700 text-white"
            >
              {connecting === 'googleFit' ? 'Connecting...' : healthService.isGoogleFitConnected() ? '✓ Connected' : 'Connect'}
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {healthService.isAppleHealthConnected() ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <Circle className="h-5 w-5 text-gray-400" />
                )}
                <span className="font-medium text-gray-700 dark:text-gray-300">Apple Health</span>
              </div>
              {healthService.isAppleHealthConnected() && (
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                  Connected
                </Badge>
              )}
            </div>
            <Button
              onClick={() => handleHealthIntegration('appleHealth')}
              disabled={connecting === 'appleHealth' || healthService.isAppleHealthConnected()}
              className="bg-gray-600 hover:bg-gray-700 text-white"
            >
              {connecting === 'appleHealth' ? 'Connecting...' : healthService.isAppleHealthConnected() ? '✓ Connected' : 'Connect'}
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {healthService.isFitbitConnected() ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <Circle className="h-5 w-5 text-gray-400" />
                )}
                <span className="font-medium text-gray-700 dark:text-gray-300">Fitbit</span>
              </div>
              {healthService.isFitbitConnected() && (
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                  Connected
                </Badge>
              )}
            </div>
            <Button
              onClick={() => handleHealthIntegration('fitbit')}
              disabled={connecting === 'fitbit' || healthService.isFitbitConnected()}
              className="bg-gray-600 hover:bg-gray-700 text-white"
            >
              {connecting === 'fitbit' ? 'Connecting...' : healthService.isFitbitConnected() ? '✓ Connected' : 'Connect'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
            <Bot className="h-5 w-5 text-gray-600" />
            AI Services Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Cpu className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-800 dark:text-blue-200">OpenAI API</span>
            </div>
            <Input
              placeholder="Enter your OpenAI API key"
              type="password"
              value={apiKeys.openai}
              onChange={(e) => handleApiKeyChange('openai', e.target.value)}
              className="bg-white/50 dark:bg-gray-700/50"
            />
            <p className="text-xs text-muted-foreground mt-2">Used for AI health coach responses</p>
          </div>

          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Key className="h-4 w-4 text-purple-600" />
              <span className="font-medium text-purple-800 dark:text-purple-200">Anthropic API</span>
            </div>
            <Input
              placeholder="Enter your Anthropic API key"
              type="password"
              value={apiKeys.anthropic}
              onChange={(e) => handleApiKeyChange('anthropic', e.target.value)}
              className="bg-white/50 dark:bg-gray-700/50"
            />
            <p className="text-xs text-muted-foreground mt-2">Alternative AI provider for enhanced responses</p>
          </div>

          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Bot className="h-4 w-4 text-green-600" />
              <span className="font-medium text-green-800 dark:text-green-200">Perplexity API</span>
            </div>
            <Input
              placeholder="Enter your Perplexity API key"
              type="password"
              value={apiKeys.perplexity}
              onChange={(e) => handleApiKeyChange('perplexity', e.target.value)}
              className="bg-white/50 dark:bg-gray-700/50"
            />
            <p className="text-xs text-muted-foreground mt-2">Real-time health research and information</p>
          </div>

          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Smartphone className="h-4 w-4 text-orange-600" />
              <span className="font-medium text-orange-800 dark:text-orange-200">ElevenLabs API</span>
            </div>
            <Input
              placeholder="Enter your ElevenLabs API key"
              type="password"
              value={apiKeys.elevenlabs}
              onChange={(e) => handleApiKeyChange('elevenlabs', e.target.value)}
              className="bg-white/50 dark:bg-gray-700/50"
            />
            <p className="text-xs text-muted-foreground mt-2">Voice assistant and text-to-speech functionality</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
            <Key className="h-5 w-5 text-gray-600" />
            Google API Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Key className="h-4 w-4 text-red-600" />
              <span className="font-medium text-red-800 dark:text-red-200">Google API Key</span>
            </div>
            <Input
              placeholder="Enter your Google API key"
              type="password"
              value={localStorage.getItem('google_api_key') || ''}
              onChange={(e) => {
                localStorage.setItem('google_api_key', e.target.value);
                toast({
                  title: "Google API Key Updated",
                  description: "Google API key has been saved."
                });
              }}
              className="bg-white/50 dark:bg-gray-700/50"
            />
            <p className="text-xs text-muted-foreground mt-2">Required for Google Calendar and Fit integration</p>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Cpu className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-800 dark:text-blue-200">Google Client ID</span>
            </div>
            <Input
              placeholder="Enter your Google OAuth Client ID"
              type="password"
              value={localStorage.getItem('google_client_id') || ''}
              onChange={(e) => {
                localStorage.setItem('google_client_id', e.target.value);
                toast({
                  title: "Google Client ID Updated",
                  description: "Google Client ID has been saved."
                });
              }}
              className="bg-white/50 dark:bg-gray-700/50"
            />
            <p className="text-xs text-muted-foreground mt-2">OAuth Client ID for Google services authentication</p>
          </div>

          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Setup Instructions:</strong>
              <br />1. Go to Google Cloud Console
              <br />2. Create/select a project
              <br />3. Enable Calendar API and Fitness API
              <br />4. Create credentials (API Key + OAuth 2.0 Client ID)
              <br />5. Add your domain to authorized origins
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-gray-800 dark:text-gray-200">Account Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={resetOnboarding} 
            variant="outline" 
            className="w-full border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Reset Onboarding
          </Button>
          <Button 
            onClick={clearAllData} 
            variant="destructive" 
            className="w-full bg-red-500 hover:bg-red-600 text-white"
          >
            Clear All Data
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
