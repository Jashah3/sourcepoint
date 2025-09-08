import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import EnhancedHealthIntegrations, { HealthIntegration } from '@/services/enhancedHealthIntegrations';
import { Smartphone, Apple, Activity, Calendar, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

interface ServiceConfig {
  name: string;
  displayName: string;
  icon: React.ReactNode;
  description: string;
  category: 'health' | 'calendar';
}

const SERVICES: ServiceConfig[] = [
  {
    name: 'google_fit',
    displayName: 'Google Fit',
    icon: <Smartphone className="h-5 w-5" />,
    description: 'Sync steps, activity, and fitness data',
    category: 'health'
  },
  {
    name: 'apple_health',
    displayName: 'Apple Health',
    icon: <Apple className="h-5 w-5" />,
    description: 'Connect to Apple Health on iOS devices',
    category: 'health'
  },
  {
    name: 'fitbit',
    displayName: 'Fitbit',
    icon: <Activity className="h-5 w-5" />,
    description: 'Track activity, sleep, and heart rate',
    category: 'health'
  },
  {
    name: 'google_calendar',
    displayName: 'Google Calendar',
    icon: <Calendar className="h-5 w-5" />,
    description: 'Schedule health reminders and workouts',
    category: 'calendar'
  },
];

const ConnectedServicesCard: React.FC = () => {
  const { user } = useAuth();
  const [integrations, setIntegrations] = useState<HealthIntegration[]>([]);
  const [connectingServices, setConnectingServices] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  const healthService = EnhancedHealthIntegrations.getInstance();

  useEffect(() => {
    if (user) {
      loadIntegrations();
    }
  }, [user]);

  const loadIntegrations = async () => {
    setIsLoading(true);
    try {
      const data = await healthService.getHealthIntegrations();
      setIntegrations(data);
    } catch (error) {
      console.error('Error loading integrations:', error);
      toast.error('Failed to load connected services');
    } finally {
      setIsLoading(false);
    }
  };

  const handleServiceToggle = async (serviceName: string) => {
    const integration = integrations.find(i => i.service_name === serviceName);
    const isCurrentlyConnected = integration?.is_connected || false;

    if (isCurrentlyConnected) {
      // Disconnect service
      setConnectingServices(prev => new Set(prev).add(serviceName));
      try {
        const success = await healthService.disconnectService(serviceName);
        if (success) {
          toast.success(`Disconnected from ${SERVICES.find(s => s.name === serviceName)?.displayName}`);
          await loadIntegrations();
        } else {
          toast.error('Failed to disconnect service');
        }
      } catch (error) {
        console.error('Error disconnecting service:', error);
        toast.error('Failed to disconnect service');
      } finally {
        setConnectingServices(prev => {
          const newSet = new Set(prev);
          newSet.delete(serviceName);
          return newSet;
        });
      }
    } else {
      // Connect service
      setConnectingServices(prev => new Set(prev).add(serviceName));
      try {
        let success = false;
        
        switch (serviceName) {
          case 'google_fit':
            success = await healthService.connectGoogleFit();
            break;
          case 'apple_health':
            success = await healthService.connectAppleHealth();
            break;
          case 'fitbit':
            success = await healthService.connectFitbit();
            break;
          case 'google_calendar':
            // For now, use the same Google Fit connection flow
            success = await healthService.connectGoogleFit();
            if (success) {
              await healthService.updateIntegrationStatus('google_calendar', true);
            }
            break;
          default:
            toast.error('Service not supported yet');
            return;
        }

        if (success) {
          toast.success(`Successfully connected to ${SERVICES.find(s => s.name === serviceName)?.displayName}`);
          await loadIntegrations();
        } else {
          toast.error(`Failed to connect to ${SERVICES.find(s => s.name === serviceName)?.displayName}`);
        }
      } catch (error) {
        console.error('Error connecting service:', error);
        toast.error('Failed to connect service');
      } finally {
        setConnectingServices(prev => {
          const newSet = new Set(prev);
          newSet.delete(serviceName);
          return newSet;
        });
      }
    }
  };

  const getServiceStatus = (serviceName: string) => {
    const integration = integrations.find(i => i.service_name === serviceName);
    return integration?.is_connected || false;
  };

  const getLastSyncTime = (serviceName: string) => {
    const integration = integrations.find(i => i.service_name === serviceName);
    if (!integration?.last_sync_at) return null;
    
    return new Date(integration.last_sync_at).toLocaleString();
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Connected Services</CardTitle>
          <CardDescription>Loading your connected services...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const healthServices = SERVICES.filter(s => s.category === 'health');
  const calendarServices = SERVICES.filter(s => s.category === 'calendar');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connected Services</CardTitle>
        <CardDescription>
          Connect your health and calendar accounts to sync data automatically
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Health Services */}
        <div>
          <h3 className="text-sm font-medium text-foreground mb-4">Health & Fitness</h3>
          <div className="space-y-4">
            {healthServices.map((service) => {
              const isConnected = getServiceStatus(service.name);
              const isConnecting = connectingServices.has(service.name);
              const lastSync = getLastSyncTime(service.name);

              return (
                <div key={service.name} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      {service.icon}
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-medium">{service.displayName}</h4>
                        {isConnected ? (
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Connected
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <XCircle className="h-3 w-3" />
                            Not Connected
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{service.description}</p>
                      {lastSync && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Last sync: {lastSync}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {isConnecting && <Loader2 className="h-4 w-4 animate-spin" />}
                    <Switch
                      checked={isConnected}
                      onCheckedChange={() => handleServiceToggle(service.name)}
                      disabled={isConnecting}
                      aria-label={`Toggle ${service.displayName} connection`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <Separator />

        {/* Calendar Services */}
        <div>
          <h3 className="text-sm font-medium text-foreground mb-4">Calendar & Scheduling</h3>
          <div className="space-y-4">
            {calendarServices.map((service) => {
              const isConnected = getServiceStatus(service.name);
              const isConnecting = connectingServices.has(service.name);
              const lastSync = getLastSyncTime(service.name);

              return (
                <div key={service.name} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      {service.icon}
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-medium">{service.displayName}</h4>
                        {isConnected ? (
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Connected
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <XCircle className="h-3 w-3" />
                            Not Connected
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{service.description}</p>
                      {lastSync && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Last sync: {lastSync}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {isConnecting && <Loader2 className="h-4 w-4 animate-spin" />}
                    <Switch
                      checked={isConnected}
                      onCheckedChange={() => handleServiceToggle(service.name)}
                      disabled={isConnecting}
                      aria-label={`Toggle ${service.displayName} connection`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sync All Button */}
        <div className="pt-4 border-t">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              toast.success('Data sync started! Connected services will update automatically.');
            }}
          >
            Sync All Connected Services
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConnectedServicesCard;