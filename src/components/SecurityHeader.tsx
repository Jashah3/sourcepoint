import React, { useEffect } from 'react';
import { CSPManager, SessionSecurity } from '@/utils/enhancedSecurityUtils';

export const SecurityHeader: React.FC = () => {
  useEffect(() => {
    // Apply Content Security Policy
    CSPManager.applyCSP();
    
    // Initialize session security
    SessionSecurity.initializeSessionSecurity();
    
    // Apply additional security headers via meta tags (excluding those that require HTTP headers)
    const securityHeaders = [
      { name: 'X-Content-Type-Options', content: 'nosniff' },
      { name: 'X-XSS-Protection', content: '1; mode=block' },
      { name: 'Referrer-Policy', content: 'strict-origin-when-cross-origin' },
      { name: 'Permissions-Policy', content: 'geolocation=(), microphone=(), camera=()' }
    ];
    
    securityHeaders.forEach(header => {
      const meta = document.createElement('meta');
      meta.setAttribute('http-equiv', header.name);
      meta.setAttribute('content', header.content);
      document.head.appendChild(meta);
    });
    
    // Add security-related viewport meta tag
    if (!document.querySelector('meta[name="viewport"]')) {
      const viewport = document.createElement('meta');
      viewport.setAttribute('name', 'viewport');
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, user-scalable=no');
      document.head.appendChild(viewport);
    }
    
  }, []);

  return null; // This component doesn't render anything visible
};

export default SecurityHeader;