import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SecureStorage, RateLimiter } from '@/utils/securityUtils';
import { toast } from '@/hooks/use-toast';

interface SecurityContextType {
  isSecurityAlertVisible: boolean;
  securityLevel: 'low' | 'medium' | 'high';
  isEncryptionEnabled: boolean;
  lastSecurityCheck: number;
  performSecurityCheck: () => void;
  upgradeSecurityLevel: () => void;
  clearSecurityData: () => void;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export const useSecurityContext = () => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurityContext must be used within SecurityProvider');
  }
  return context;
};

interface SecurityProviderProps {
  children: ReactNode;
}

export const SecurityProvider: React.FC<SecurityProviderProps> = ({ children }) => {
  const [isSecurityAlertVisible, setIsSecurityAlertVisible] = useState(false);
  const [securityLevel, setSecurityLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [isEncryptionEnabled, setIsEncryptionEnabled] = useState(true);
  const [lastSecurityCheck, setLastSecurityCheck] = useState(Date.now());

  const performSecurityCheck = async () => {
    try {
      // Check for unsecured API keys
      const hasUnsecuredKeys = checkForUnsecuredApiKeys();
      
      // Check encryption status
      const encryptionStatus = await checkEncryptionStatus();
      
      // Check for security vulnerabilities
      const vulnerabilities = checkSecurityVulnerabilities();
      
      // Update security level based on findings
      let level: 'low' | 'medium' | 'high' = 'high';
      
      if (hasUnsecuredKeys || !encryptionStatus || vulnerabilities > 2) {
        level = 'low';
        setIsSecurityAlertVisible(true);
      } else if (vulnerabilities > 0) {
        level = 'medium';
      }
      
      setSecurityLevel(level);
      setLastSecurityCheck(Date.now());
      
      // Store security check result
      await SecureStorage.setSensitiveData('security_check_result', JSON.stringify({
        level,
        timestamp: Date.now(),
        hasUnsecuredKeys,
        encryptionStatus,
        vulnerabilities
      }));
      
    } catch (error) {
      console.error('Security check failed:', error);
      toast({
        title: "Security Check Failed",
        description: "Unable to perform security assessment. Please check manually.",
        variant: "destructive"
      });
    }
  };

  const checkForUnsecuredApiKeys = (): boolean => {
    const providers = ['openai', 'anthropic', 'perplexity', 'elevenlabs'];
    return providers.some(provider => {
      const key = localStorage.getItem(`${provider}_api_key`);
      return key && key.length > 0; // Unsecured key found
    });
  };

  const checkEncryptionStatus = async (): Promise<boolean> => {
    try {
      // Test encryption/decryption
      const testData = 'security_test';
      await SecureStorage.setSensitiveData('test_encryption', testData);
      const retrieved = await SecureStorage.getSensitiveData('test_encryption');
      await SecureStorage.setSensitiveData('test_encryption', ''); // Clean up
      return retrieved === testData;
    } catch {
      return false;
    }
  };

  const checkSecurityVulnerabilities = (): number => {
    let vulnerabilities = 0;
    
    // Check for weak browser security
    if (!window.crypto || !window.crypto.subtle) {
      vulnerabilities++;
    }
    
    // Check for insecure context (non-HTTPS in production)
    if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
      vulnerabilities++;
    }
    
    // Check for exposed sensitive data in localStorage
    const sensitiveKeys = Object.keys(localStorage).filter(key => 
      key.includes('password') || key.includes('secret') || key.includes('token')
    );
    vulnerabilities += sensitiveKeys.length;
    
    // Check rate limiting setup
    if (!RateLimiter.checkRateLimit('security_test', 1, 1000)) {
      vulnerabilities++;
    }
    
    return vulnerabilities;
  };

  const upgradeSecurityLevel = async () => {
    try {
      // Migrate any unsecured data
      const providers = ['openai', 'anthropic', 'perplexity', 'elevenlabs'];
      for (const provider of providers) {
        const unsecuredKey = localStorage.getItem(`${provider}_api_key`);
        if (unsecuredKey) {
          await SecureStorage.setApiKey(provider, unsecuredKey);
          localStorage.removeItem(`${provider}_api_key`);
        }
      }
      
      setIsSecurityAlertVisible(false);
      await performSecurityCheck();
      
      toast({
        title: "Security Upgraded",
        description: "Your data has been migrated to secure storage.",
      });
    } catch (error) {
      console.error('Security upgrade failed:', error);
      toast({
        title: "Security Upgrade Failed",
        description: "Unable to upgrade security. Please try again.",
        variant: "destructive"
      });
    }
  };

  const clearSecurityData = async () => {
    try {
      await SecureStorage.clearAllApiKeys();
      localStorage.removeItem('security_check_result');
      setSecurityLevel('medium');
      setLastSecurityCheck(Date.now());
      
      toast({
        title: "Security Data Cleared",
        description: "All security data has been removed.",
      });
    } catch (error) {
      console.error('Failed to clear security data:', error);
    }
  };

  // Perform security check on mount and periodically
  useEffect(() => {
    performSecurityCheck();
    
    // Periodic security checks every 30 minutes
    const interval = setInterval(performSecurityCheck, 30 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const contextValue: SecurityContextType = {
    isSecurityAlertVisible,
    securityLevel,
    isEncryptionEnabled,
    lastSecurityCheck,
    performSecurityCheck,
    upgradeSecurityLevel,
    clearSecurityData
  };

  return (
    <SecurityContext.Provider value={contextValue}>
      {children}
    </SecurityContext.Provider>
  );
};