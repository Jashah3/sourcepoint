
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Bot, Send, TrendingUp, Heart, Target, Loader2 } from "lucide-react";
import { useHealthData } from "@/contexts/HealthDataContext";

export const EnhancedAICoach = () => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    {
      type: 'ai',
      content: "Hello! I'm your AI health coach. I can help you with nutrition, workout tips, recovery strategies, and personalized health advice. What would you like to know?",
      timestamp: '9:00 AM'
    }
  ]);
  
  const { healthData } = useHealthData();

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage = {
      type: 'user',
      content: message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate AI response with health context
    try {
      const aiResponse = await generateAIResponse(message, healthData);
      const aiMessage = {
        type: 'ai',
        content: aiResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatHistory(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage = {
        type: 'ai',
        content: "I'm having trouble processing your request right now. Please try again in a moment.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatHistory(prev => [...prev, errorMessage]);
    }

    setIsLoading(false);
    setMessage('');
  };

  const generateAIResponse = async (userMessage: string, healthData: any): Promise<string> => {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const contextualResponses: { [key: string]: string } = {
      workout: `Based on your current progress (${healthData.workoutsCompleted} workouts this week), I recommend focusing on consistency. Your health score of ${healthData.healthScore}% shows great progress! Try adding more rest between sets if you're feeling fatigued.`,
      nutrition: `You've consumed ${healthData.dailyCalories} calories today out of your ${healthData.calorieGoal} goal. Your protein intake of ${healthData.proteinIntake}g is good! Consider adding more vegetables for micronutrients.`,
      water: `Great hydration progress! You've had ${healthData.waterIntake} glasses today. Try to reach ${healthData.waterGoal} glasses for optimal performance.`,
      sleep: `With ${healthData.sleepHours} hours of sleep, you're doing well! Quality sleep is crucial for muscle recovery and overall health.`,
      supplements: `You're taking ${healthData.supplementsTaken.length} supplements regularly. That's a solid foundation for your health stack!`,
      default: `Based on your current health score of ${healthData.healthScore}%, you're doing great! Keep up the consistency with your workouts and nutrition.`
    };

    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('workout') || lowerMessage.includes('exercise')) {
      return contextualResponses.workout;
    } else if (lowerMessage.includes('nutrition') || lowerMessage.includes('food') || lowerMessage.includes('eat')) {
      return contextualResponses.nutrition;
    } else if (lowerMessage.includes('water') || lowerMessage.includes('hydration')) {
      return contextualResponses.water;
    } else if (lowerMessage.includes('sleep')) {
      return contextualResponses.sleep;
    } else if (lowerMessage.includes('supplement')) {
      return contextualResponses.supplements;
    } else {
      return contextualResponses.default;
    }
  };

  const weeklyReport = {
    score: healthData.healthScore,
    improvements: [
      `Increased workout consistency by ${Math.round((healthData.workoutsCompleted / 7) * 100)}%`,
      `Met protein goals ${Math.round((healthData.proteinIntake / healthData.proteinGoal) * 100)}% of the time`,
      `Maintained ${healthData.streak}-day streak`
    ],
    recommendations: [
      `Add ${healthData.waterGoal - healthData.waterIntake} more glasses of water daily`,
      'Include more variety in your cardio routine',
      'Consider meditation for stress management'
    ]
  };

  const quickPrompts = [
    "How can I improve my sleep?",
    "What should I eat pre-workout?",
    "How to increase protein intake?",
    "Best recovery strategies?"
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <div className="text-3xl">💪</div>
              <h4 className="font-medium">Workout Progress</h4>
              <p className="text-sm text-muted-foreground">{healthData.workoutsCompleted} workouts this week</p>
              <Badge variant="default">
                {Math.round((healthData.workoutsCompleted / 7) * 100)}% complete
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <div className="text-3xl">🥗</div>
              <h4 className="font-medium">Nutrition Score</h4>
              <p className="text-sm text-muted-foreground">{healthData.dailyCalories}/{healthData.calorieGoal} calories</p>
              <Badge variant="secondary">
                {Math.round((healthData.dailyCalories / healthData.calorieGoal) * 100)}% of goal
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <div className="text-3xl">💧</div>
              <h4 className="font-medium">Hydration</h4>
              <p className="text-sm text-muted-foreground">{healthData.waterIntake}/{healthData.waterGoal} glasses</p>
              <Badge variant={healthData.waterIntake >= healthData.waterGoal ? 'default' : 'destructive'}>
                {Math.round((healthData.waterIntake / healthData.waterGoal) * 100)}% complete
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Dynamic Health Report
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {weeklyReport.score}
                </div>
                <p className="text-muted-foreground">Live Health Score</p>
              </div>

              <div>
                <h5 className="font-medium mb-2 text-green-600">✅ Current Progress</h5>
                <ul className="space-y-1 text-sm">
                  {weeklyReport.improvements.map((item, index) => (
                    <li key={index}>• {item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h5 className="font-medium mb-2 text-blue-600">💡 Personalized Tips</h5>
                <ul className="space-y-1 text-sm">
                  {weeklyReport.recommendations.map((item, index) => (
                    <li key={index}>• {item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              AI Health Assistant
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="h-64 overflow-y-auto space-y-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                {chatHistory.map((chat, index) => (
                  <div key={index} className={`flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs p-3 rounded-lg ${
                      chat.type === 'user' 
                        ? 'bg-green-600 text-white' 
                        : 'bg-white dark:bg-gray-800 border'
                    }`}>
                      <p className="text-sm">{chat.content}</p>
                      <p className={`text-xs mt-1 ${
                        chat.type === 'user' ? 'text-green-100' : 'text-muted-foreground'
                      }`}>
                        {chat.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white dark:bg-gray-800 border p-3 rounded-lg">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask me about health, nutrition, workouts..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  disabled={isLoading}
                />
                <Button onClick={handleSendMessage} size="icon" disabled={isLoading}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {quickPrompts.slice(0, 4).map((prompt, index) => (
                  <Button 
                    key={index}
                    variant="outline" 
                    size="sm" 
                    onClick={() => setMessage(prompt)}
                    disabled={isLoading}
                  >
                    {prompt.split(' ').slice(0, 2).join(' ')}...
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
