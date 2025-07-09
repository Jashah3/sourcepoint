
import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { toast } from "@/hooks/use-toast";

// Type declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export const VoiceAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [response, setResponse] = useState('');
  const { theme } = useTheme();
  const recognitionRef = useRef<any>(null);
  const speechSynthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    // Initialize speech recognition if available
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        handleVoiceInput(transcript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast({
          title: "Voice Recognition Error",
          description: "Please try again or check microphone permissions.",
          variant: "destructive"
        });
      };
    }

    // Initialize speech synthesis
    speechSynthRef.current = window.speechSynthesis;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const handleVoiceInput = async (transcript: string) => {
    setResponse(`Processing: "${transcript}"`);
    
    try {
      const apiResponse = await generateAIResponse(transcript);
      setResponse(apiResponse);
      
      // Text-to-speech response
      const elevenLabsKey = localStorage.getItem('elevenlabs_api_key');
      if (elevenLabsKey) {
        await speakWithElevenLabs(apiResponse, elevenLabsKey);
      } else {
        speakWithBrowser(apiResponse);
      }
    } catch (error) {
      console.error('Error processing voice input:', error);
      const errorMsg = "I'm having trouble processing that request. Please try again.";
      setResponse(errorMsg);
      speakWithBrowser(errorMsg);
    }
  };

  const generateAIResponse = async (input: string): Promise<string> => {
    const openaiKey = localStorage.getItem('openai_api_key');
    const anthropicKey = localStorage.getItem('anthropic_api_key');
    
    if (openaiKey) {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openaiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4.1-2025-04-14',
            messages: [
              {
                role: 'system',
                content: 'You are a health and fitness assistant. Provide concise, helpful responses about nutrition, workouts, and wellness. Keep responses under 50 words.'
              },
              {
                role: 'user',
                content: input
              }
            ],
            max_tokens: 150,
            temperature: 0.7
          })
        });

        if (response.ok) {
          const data = await response.json();
          return data.choices[0].message.content;
        }
      } catch (error) {
        console.error('OpenAI API error:', error);
      }
    }

    // Fallback responses
    const fallbackResponses = {
      workout: "Great question about workouts! Focus on consistency and proper form. Aim for 3-4 sessions per week.",
      nutrition: "For nutrition, aim for balanced meals with protein, healthy fats, and complex carbs. Stay hydrated!",
      sleep: "Quality sleep is crucial for recovery. Aim for 7-9 hours and maintain a consistent schedule.",
      default: "I'd love to help with your health questions! Try asking about workouts, nutrition, or wellness tips."
    };

    const lowerInput = input.toLowerCase();
    if (lowerInput.includes('workout') || lowerInput.includes('exercise')) {
      return fallbackResponses.workout;
    } else if (lowerInput.includes('food') || lowerInput.includes('nutrition') || lowerInput.includes('eat')) {
      return fallbackResponses.nutrition;
    } else if (lowerInput.includes('sleep')) {
      return fallbackResponses.sleep;
    }
    
    return fallbackResponses.default;
  };

  const speakWithElevenLabs = async (text: string, apiKey: string) => {
    try {
      setIsSpeaking(true);
      const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/pNczCjzI2devNBz1zQrb', {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': apiKey
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5
          }
        })
      });

      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        
        audio.onended = () => {
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl);
        };
        
        await audio.play();
      } else {
        speakWithBrowser(text);
      }
    } catch (error) {
      console.error('ElevenLabs TTS error:', error);
      speakWithBrowser(text);
    }
  };

  const speakWithBrowser = (text: string) => {
    if (speechSynthRef.current) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      speechSynthRef.current.speak(utterance);
    }
  };

  const toggleListening = () => {
    if (!isListening) {
      if (recognitionRef.current) {
        setIsListening(true);
        setIsExpanded(true);
        setResponse('');
        recognitionRef.current.start();
      } else {
        toast({
          title: "Voice Recognition Not Available",
          description: "Please use a supported browser for voice features.",
          variant: "destructive"
        });
      }
    } else {
      setIsListening(false);
      setIsExpanded(false);
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    }
  };

  const stopSpeaking = () => {
    if (speechSynthRef.current) {
      speechSynthRef.current.cancel();
      setIsSpeaking(false);
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
              {response && (
                <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded border">
                  <p className="text-xs text-blue-800 dark:text-blue-200">{response}</p>
                  {isSpeaking && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={stopSpeaking}
                      className="mt-2 text-xs"
                    >
                      <VolumeX className="h-3 w-3 mr-1" />
                      Stop Speaking
                    </Button>
                  )}
                </div>
              )}
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
