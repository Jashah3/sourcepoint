
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Bot, Send, TrendingUp, Heart, Target } from "lucide-react";

export const AICoach = () => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    {
      type: 'ai',
      content: "Hello! I'm your AI health coach. I've analyzed your progress and have some insights to share. How can I help you today?",
      timestamp: '9:00 AM'
    }
  ]);

  const dailyTips = [
    {
      icon: '💪',
      title: 'Strength Progress',
      message: "You've increased your push-up reps by 20% this week! Keep focusing on progressive overload.",
      type: 'achievement'
    },
    {
      icon: '🥗',
      title: 'Nutrition Insight',
      message: "Your protein intake is consistent, but try adding more fiber-rich vegetables to improve digestion.",
      type: 'suggestion'
    },
    {
      icon: '😴',
      title: 'Recovery Alert',
      message: "Your workout intensity is high but recovery time seems low. Consider adding a rest day this week.",
      type: 'warning'
    }
  ];

  const weeklyReport = {
    score: 85,
    improvements: [
      'Increased workout consistency by 15%',
      'Met protein goals 6/7 days',
      'Improved sleep quality scores'
    ],
    recommendations: [
      'Add 2 more glasses of water daily',
      'Include more variety in your cardio routine',
      'Consider meditation for stress management'
    ]
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      type: 'user',
      content: message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory(prev => [...prev, newMessage]);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        type: 'ai',
        content: "That's a great question! Based on your current progress and goals, I'd recommend focusing on consistency rather than intensity. Your body needs time to adapt to new routines.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatHistory(prev => [...prev, aiResponse]);
    }, 1000);

    setMessage('');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {dailyTips.map((tip, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <div className="text-3xl">{tip.icon}</div>
                <h4 className="font-medium">{tip.title}</h4>
                <p className="text-sm text-muted-foreground">{tip.message}</p>
                <Badge variant={tip.type === 'achievement' ? 'default' : tip.type === 'warning' ? 'destructive' : 'secondary'}>
                  {tip.type}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Weekly Health Report
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {weeklyReport.score}
                </div>
                <p className="text-muted-foreground">Overall Health Score</p>
              </div>

              <div>
                <h5 className="font-medium mb-2 text-green-600">✅ Improvements</h5>
                <ul className="space-y-1 text-sm">
                  {weeklyReport.improvements.map((item, index) => (
                    <li key={index}>• {item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h5 className="font-medium mb-2 text-blue-600">💡 Recommendations</h5>
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
              Chat with Your AI Coach
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
              </div>

              <div className="flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask me about nutrition, workouts, or health tips..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button onClick={handleSendMessage} size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" onClick={() => setMessage("How can I improve my sleep?")}>
                  Sleep Tips
                </Button>
                <Button variant="outline" size="sm" onClick={() => setMessage("What should I eat pre-workout?")}>
                  Pre-workout Nutrition
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
