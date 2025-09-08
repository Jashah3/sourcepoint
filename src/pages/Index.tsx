
import { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import { ThemeProvider } from "@/components/ThemeProvider";
import Dashboard from "@/components/Dashboard";
import Onboarding from "@/components/Onboarding";
import { VoiceAssistant } from "@/components/VoiceAssistant";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user, profile, updateProfile } = useAuth();
  const [isOnboarded, setIsOnboarded] = useState(false);

  useEffect(() => {
    // Check both localStorage and profile for onboarding status
    const localOnboardingStatus = localStorage.getItem('sourcePoint_onboarded');
    const profileOnboardingStatus = profile?.onboarding_completed;
    
    const isCompleted = localOnboardingStatus === 'true' || profileOnboardingStatus === true;
    setIsOnboarded(isCompleted);
  }, [profile]);

  const handleOnboardingComplete = async () => {
    localStorage.setItem('sourcePoint_onboarded', 'true');
    
    // Update profile in database
    if (user) {
      await updateProfile({ onboarding_completed: true });
    }
    
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
