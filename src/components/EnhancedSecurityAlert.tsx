import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SecureStorage } from "@/utils/securityUtils";
import { toast } from "@/hooks/use-toast";
import { Shield, AlertTriangle, CheckCircle, X, Lock, Key } from "lucide-react";

export const EnhancedSecurityAlert: React.FC = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [migrationCompleted, setMigrationCompleted] = useState(false);
  const [detectedIssues, setDetectedIssues] = useState<string[]>([]);

  useEffect(() => {
    checkSecurityStatus();
  }, []);

  const checkSecurityStatus = () => {
    const issues: string[] = [];
    
    // Check for old unencrypted API keys
    const oldKeys = ['openai_api_key', 'anthropic_api_key', 'perplexity_api_key', 'elevenlabs_api_key'];
    const foundOldKeys = oldKeys.filter(key => localStorage.getItem(key));
    
    if (foundOldKeys.length > 0) {
      issues.push(`${foundOldKeys.length} unencrypted API keys found`);
    }

    // Check for sensitive data in localStorage
    const sensitivePatterns = ['password', 'secret', 'token', 'credential'];
    const sensitiveKeys = Object.keys(localStorage).filter(key =>
      sensitivePatterns.some(pattern => key.toLowerCase().includes(pattern))
    );
    
    if (sensitiveKeys.length > 0) {
      issues.push(`${sensitiveKeys.length} potentially sensitive items in storage`);
    }

    // Check if running on insecure connection
    if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
      issues.push('Insecure connection detected');
    }

    // Check browser security features
    if (!window.crypto || !window.crypto.subtle) {
      issues.push('Browser security features unavailable');
    }

    setDetectedIssues(issues);
    
    const migrationDone = localStorage.getItem('security_migration_completed') === 'true';
    setMigrationCompleted(migrationDone);
    
    if (issues.length > 0 && !migrationDone) {
      setShowAlert(true);
    }
  };

  const performSecurityMigration = async () => {
    try {
      // Migrate API keys
      const apiKeyMappings = {
        'openai_api_key': 'openai',
        'anthropic_api_key': 'anthropic', 
        'perplexity_api_key': 'perplexity',
        'elevenlabs_api_key': 'elevenlabs'
      };

      Object.entries(apiKeyMappings).forEach(([oldKey, provider]) => {
        const value = localStorage.getItem(oldKey);
        if (value) {
          SecureStorage.setApiKey(provider, value);
          localStorage.removeItem(oldKey);
        }
      });

      // Migrate other sensitive data
      const sensitiveKeys = Object.keys(localStorage).filter(key =>
        key.includes('google_') || key.includes('health_') || key.includes('api_')
      );

      sensitiveKeys.forEach(key => {
        const value = localStorage.getItem(key);
        if (value && !key.includes('_encrypted')) {
          SecureStorage.setSensitiveData(key, value);
          localStorage.removeItem(key);
        }
      });

      // Mark migration as completed
      localStorage.setItem('security_migration_completed', 'true');
      localStorage.setItem('security_upgrade_timestamp', Date.now().toString());
      
      setMigrationCompleted(true);
      setShowAlert(false);
      
      toast({
        title: "Security Upgrade Complete",
        description: "Your data has been migrated to secure encrypted storage.",
        duration: 5000,
      });

      // Recheck security status
      setTimeout(checkSecurityStatus, 1000);
      
    } catch (error) {
      console.error('Security migration failed:', error);
      toast({
        title: "Security Migration Failed",
        description: "There was an error upgrading your security. Please try again.",
        variant: "destructive"
      });
    }
  };

  const dismissAlert = () => {
    setShowAlert(false);
    localStorage.setItem('security_alert_dismissed', 'true');
    localStorage.setItem('security_alert_dismissed_timestamp', Date.now().toString());
  };

  if (migrationCompleted && detectedIssues.length === 0) {
    return (
      <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800 dark:text-green-200">
          <div className="flex items-center justify-between">
            <span>Security upgrade completed successfully. Your data is now encrypted and secure.</span>
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200">
              Secure
            </Badge>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  if (!showAlert) return null;

  return (
    <Card className="border-amber-200 bg-amber-50 dark:bg-amber-900/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <Shield className="h-5 w-5" />
          Security Enhancement Available
          <Button
            variant="ghost"
            size="sm"
            onClick={dismissAlert}
            className="ml-auto h-6 w-6 p-0 text-amber-600 hover:text-amber-800"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-amber-800 dark:text-amber-200">
          <p className="mb-3">We've detected security improvements that can be applied to your health data:</p>
          
          <div className="space-y-2 mb-4">
            {detectedIssues.map((issue, index) => (
              <div key={index} className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <span className="text-sm">{issue}</span>
              </div>
            ))}
          </div>

          <div className="bg-white/60 dark:bg-gray-800/60 p-3 rounded-lg mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Lock className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-800 dark:text-blue-200">Security Improvements:</span>
            </div>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>• Encrypt all API keys and sensitive data</li>
              <li>• Migrate to secure browser storage</li>
              <li>• Enable automatic security monitoring</li>
              <li>• Add data integrity verification</li>
            </ul>
          </div>
        </div>

        <div className="flex gap-3">
          <Button 
            onClick={performSecurityMigration}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Key className="h-4 w-4" />
            Upgrade Security Now
          </Button>
          
          <Button 
            variant="outline" 
            onClick={dismissAlert}
            className="text-amber-700 border-amber-300 hover:bg-amber-100 dark:text-amber-200 dark:border-amber-700 dark:hover:bg-amber-900/20"
          >
            Remind Me Later
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};