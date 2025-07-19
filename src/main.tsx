import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { SecurityProvider } from './components/SecurityProvider.tsx'
import SecurityHeader from './components/SecurityHeader.tsx'
import { getSecureHeaders } from './utils/securityUtils'

// Apply security headers for enhanced protection
const headers = getSecureHeaders();
Object.entries(headers).forEach(([key, value]) => {
  if (typeof value === 'string') {
    const meta = document.createElement('meta');
    meta.setAttribute('http-equiv', key);
    meta.setAttribute('content', value);
    document.head.appendChild(meta);
  }
});

createRoot(document.getElementById("root")!).render(
  <SecurityProvider>
    <SecurityHeader />
    <App />
  </SecurityProvider>
);
