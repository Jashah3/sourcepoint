
import { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import { ThemeProvider } from "@/components/ThemeProvider";
import Dashboard from "@/components/Dashboard";
import Onboarding from "@/components/Onboarding";
import { VoiceAssistant } from "@/components/VoiceAssistant";

const Index = () => {
  const [isOnboarded, setIsOnboarded] = useState(false);

  useEffect(() => {
    const onboardingStatus = localStorage.getItem('sourcePoint_onboarded');
    setIsOnboarded(onboardingStatus === 'true');
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem('sourcePoint_onboarded', 'true');
    setIsOnboarded(true);
  };

  return (
    <ThemeProvider defaultTheme="light" storageKey="sourcepoint-theme">
      <div className="min-h-screen bg-background transition-colors duration-300">
        {!isOnboarded ? (
          <Onboarding onComplete={handleOnboardingComplete} />
        ) : (
          <Dashboard />
        )}
        <VoiceAssistant />
        <Toaster />
      </div>
    </ThemeProvider>
  );
};

export default Index;
