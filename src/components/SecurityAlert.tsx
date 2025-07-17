import { useState, useEffect } from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Shield, X, CheckCircle } from "lucide-react";
import { SecureStorage } from "@/utils/securityUtils";

export const SecurityAlert = () => {
  const [showMigrationAlert, setShowMigrationAlert] = useState(false);
  const [migrationCompleted, setMigrationCompleted] = useState(false);

  useEffect(() => {
    // Check if user has old unencrypted API keys
    const hasOldKeys = 
      localStorage.getItem('openai_api_key') ||
      localStorage.getItem('anthropic_api_key') ||
      localStorage.getItem('perplexity_api_key') ||
      localStorage.getItem('elevenlabs_api_key');

    if (hasOldKeys && !localStorage.getItem('security_migration_completed')) {
      setShowMigrationAlert(true);
    }
  }, []);

  const migrateToSecureStorage = () => {
    // Migrate existing API keys to secure storage
    const providers = ['openai', 'anthropic', 'perplexity', 'elevenlabs'];
    
    providers.forEach(provider => {
      const oldKey = localStorage.getItem(`${provider}_api_key`);
      if (oldKey) {
        SecureStorage.setApiKey(provider, oldKey);
        localStorage.removeItem(`${provider}_api_key`);
      }
    });

    // Migrate Google credentials
    const googleApiKey = localStorage.getItem('google_api_key');
    const googleClientId = localStorage.getItem('google_client_id');
    
    if (googleApiKey) {
      SecureStorage.setSensitiveData('google_api_key', googleApiKey);
      localStorage.removeItem('google_api_key');
    }
    
    if (googleClientId) {
      SecureStorage.setSensitiveData('google_client_id', googleClientId);
      localStorage.removeItem('google_client_id');
    }

    localStorage.setItem('security_migration_completed', 'true');
    setMigrationCompleted(true);
    setShowMigrationAlert(false);
  };

  const dismissAlert = () => {
    setShowMigrationAlert(false);
    localStorage.setItem('security_migration_dismissed', 'true');
  };

  if (migrationCompleted) {
    return (
      <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800 dark:text-green-200">
          Security migration completed! Your API keys are now encrypted and stored securely.
        </AlertDescription>
      </Alert>
    );
  }

  if (!showMigrationAlert) {
    return null;
  }

  return (
    <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-900/20">
      <Shield className="h-4 w-4 text-orange-600" />
      <AlertDescription className="text-orange-800 dark:text-orange-200">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="font-medium mb-2">Security Upgrade Available</p>
            <p className="text-sm mb-3">
              We've improved security for API key storage. Click "Upgrade Now" to encrypt your existing API keys.
            </p>
            <div className="flex gap-2">
              <Button
                onClick={migrateToSecureStorage}
                size="sm"
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                Upgrade Now
              </Button>
              <Button
                onClick={dismissAlert}
                size="sm"
                variant="outline"
                className="border-orange-300 text-orange-700 hover:bg-orange-100"
              >
                Later
              </Button>
            </div>
          </div>
          <Button
            onClick={dismissAlert}
            size="sm"
            variant="ghost"
            className="text-orange-600 hover:text-orange-700"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};