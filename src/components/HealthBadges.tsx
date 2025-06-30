
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, TrendingUp, Zap, Target, Calendar, Star } from "lucide-react";

export const HealthBadges = () => {
  const [unlockedBadges] = useState([
    { id: 1, name: "First Steps", description: "Completed your first workout", icon: "🏃", unlocked: true, color: "bg-green-500" },
    { id: 2, name: "Consistency King", description: "7 day workout streak", icon: "🔥", unlocked: true, color: "bg-orange-500" },
    { id: 3, name: "Protein Power", description: "Hit protein goal 5 days in a row", icon: "💪", unlocked: true, color: "bg-blue-500" },
    { id: 4, name: "Weight Warrior", description: "Lost 5kg", icon: "⚖️", unlocked: false, color: "bg-purple-500" },
    { id: 5, name: "Muscle Maker", description: "Gained 10% muscle mass", icon: "🦾", unlocked: false, color: "bg-red-500" },
    { id: 6, name: "Hydration Hero", description: "Drank 3L water for 10 days", icon: "💧", unlocked: true, color: "bg-cyan-500" },
    { id: 7, name: "Nutrition Ninja", description: "Perfect macro balance for a week", icon: "🥗", unlocked: false, color: "bg-emerald-500" },
    { id: 8, name: "Cardio Champion", description: "Completed 20 cardio sessions", icon: "❤️", unlocked: false, color: "bg-pink-500" },
    { id: 9, name: "Strength Seeker", description: "Lifted 1000kg total volume", icon: "🏋️", unlocked: false, color: "bg-yellow-500" },
    { id: 10, name: "Wellness Warrior", description: "30 days of consistent tracking", icon: "🌟", unlocked: false, color: "bg-indigo-500" }
  ]);

  return (
    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          Achievement Badges
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {unlockedBadges.map((badge) => (
            <div
              key={badge.id}
              className={`relative p-3 rounded-lg border-2 text-center transition-all duration-300 hover:scale-105 ${
                badge.unlocked 
                  ? `${badge.color} border-gray-300 text-white shadow-lg` 
                  : 'bg-gray-100 dark:bg-gray-700 border-dashed border-gray-400 opacity-60'
              }`}
            >
              <div className="text-2xl mb-2">{badge.icon}</div>
              <p className="text-xs font-medium mb-1">{badge.name}</p>
              <p className="text-xs opacity-80">{badge.description}</p>
              {badge.unlocked && (
                <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1">
                  <Star className="h-3 w-3 text-yellow-800" />
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
