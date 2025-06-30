
import { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import { ThemeProvider } from "@/components/ThemeProvider";
import Dashboard from "@/components/Dashboard";
import Onboarding from "@/components/Onboarding";

const Index = () => {
  const [isOnboarded, setIsOnboarded] = useState(false);

  useEffect(() => {
    const onboardingStatus = localStorage.getItem('healthApp_onboarded');
    setIsOnboarded(onboardingStatus === 'true');
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem('healthApp_onboarded', 'true');
    setIsOnboarded(true);
  };

  return (
    <ThemeProvider defaultTheme="light" storageKey="health-app-theme">
      <div className="min-h-screen bg-background">
        {!isOnboarded ? (
          <Onboarding onComplete={handleOnboardingComplete} />
        ) : (
          <Dashboard />
        )}
        <Toaster />
      </div>
    </ThemeProvider>
  );
};

export default Index;
