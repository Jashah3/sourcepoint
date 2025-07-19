import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useSecurityContext } from './SecurityProvider';
import { Shield, AlertTriangle, CheckCircle, RefreshCw, Trash2 } from 'lucide-react';

export const SecurityDashboard: React.FC = () => {
  const {
    securityLevel,
    isEncryptionEnabled,
    lastSecurityCheck,
    performSecurityCheck,
    upgradeSecurityLevel,
    clearSecurityData
  } = useSecurityContext();

  const getSecurityScore = (): number => {
    switch (securityLevel) {
      case 'high': return 95;
      case 'medium': return 70;
      case 'low': return 35;
      default: return 50;
    }
  };

  const getSecurityBadgeColor = () => {
    switch (securityLevel) {
      case 'high': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'low': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getSecurityIcon = () => {
    switch (securityLevel) {
      case 'high': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'medium': return <Shield className="h-5 w-5 text-yellow-600" />;
      case 'low': return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default: return <Shield className="h-5 w-5 text-gray-600" />;
    }
  };

  const formatLastCheck = (): string => {
    const now = Date.now();
    const diff = now - lastSecurityCheck;
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minutes ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    
    const days = Math.floor(hours / 24);
    return `${days} days ago`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Security Level */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getSecurityIcon()}
              <div>
                <h3 className="font-medium">Security Level</h3>
                <p className="text-sm text-muted-foreground">Overall security assessment</p>
              </div>
            </div>
            <Badge className={getSecurityBadgeColor()}>
              {securityLevel.charAt(0).toUpperCase() + securityLevel.slice(1)}
            </Badge>
          </div>

          {/* Security Score */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Security Score</span>
              <span className="text-sm text-muted-foreground">{getSecurityScore()}/100</span>
            </div>
            <Progress value={getSecurityScore()} className="h-2" />
          </div>

          {/* Encryption Status */}
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="text-sm font-medium">Data Encryption</span>
            </div>
            <div className="flex items-center gap-2">
              {isEncryptionEnabled ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">Enabled</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <span className="text-sm text-red-600">Disabled</span>
                </>
              )}
            </div>
          </div>

          {/* Last Security Check */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Last security check:</span>
            <span>{formatLastCheck()}</span>
          </div>

          {/* Security Actions */}
          <div className="flex gap-2">
            <Button 
              onClick={performSecurityCheck}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Check Now
            </Button>
            
            {securityLevel === 'low' && (
              <Button 
                onClick={upgradeSecurityLevel}
                variant="default"
                size="sm"
                className="flex items-center gap-2"
              >
                <Shield className="h-4 w-4" />
                Upgrade Security
              </Button>
            )}
            
            <Button 
              onClick={clearSecurityData}
              variant="destructive"
              size="sm"
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Clear Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Security Recommendations */}
      {securityLevel !== 'high' && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {securityLevel === 'low' ? (
              "Your security level is low. Consider upgrading to secure storage and enabling additional security measures."
            ) : (
              "Your security is good but can be improved. Regular security checks and updates are recommended."
            )}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};