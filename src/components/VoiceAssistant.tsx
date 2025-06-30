
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mic, MicOff } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export const VoiceAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { theme } = useTheme();

  const toggleListening = () => {
    setIsListening(!isListening);
    if (!isListening) {
      setIsExpanded(true);
      // Here you would integrate with speech recognition API
      console.log('Starting voice assistant...');
    } else {
      setIsExpanded(false);
      console.log('Stopping voice assistant...');
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className={`transition-all duration-300 ${isExpanded ? 'mb-4' : ''}`}>
        {isExpanded && (
          <Card className="mb-4 w-80 animate-fade-in bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border-purple-200 dark:border-purple-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-3 h-3 rounded-full ${isListening ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
                <span className="text-sm font-medium">
                  {isListening ? 'Listening...' : 'Voice Assistant'}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {isListening 
                  ? 'Speak now to log food, ask questions, or get recommendations' 
                  : 'Click the microphone to start'
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
      
      <Button
        onClick={toggleListening}
        size="icon"
        className={`h-14 w-14 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 ${
          isListening 
            ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 animate-pulse' 
            : 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700'
        }`}
      >
        {isListening ? (
          <MicOff className="h-6 w-6 text-white" />
        ) : (
          <Mic className="h-6 w-6 text-white" />
        )}
      </Button>
    </div>
  );
};
