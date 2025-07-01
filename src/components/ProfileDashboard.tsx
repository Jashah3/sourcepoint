
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { User, TrendingUp, Award, Flame, Scale, Dumbbell } from "lucide-react";

export const ProfileDashboard = () => {
  const profileStats = {
    currentStreak: 7,
    longestStreak: 23,
    weightLost: 5.2,
    weightGoal: 10,
    muscleGained: 2.1,
    muscleGoal: 5,
    totalWorkouts: 45,
    totalMeals: 156
  };

  const recentBadges = [
    { name: "Week Warrior", icon: "🗓️", earned: "Today" },
    { name: "Hydration Hero", icon: "💧", earned: "2 days ago" },
    { name: "Protein Power", icon: "💪", earned: "3 days ago" },
    { name: "Consistency King", icon: "👑", earned: "1 week ago" }
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 flex items-center justify-center gap-1">
                <Flame className="h-6 w-6" />
                {profileStats.currentStreak}
              </div>
              <p className="text-sm text-muted-foreground">Current Streak</p>
              <p className="text-xs text-green-600">🎯 Best: {profileStats.longestStreak} days</p>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 flex items-center justify-center gap-1">
                <Scale className="h-6 w-6" />
                {profileStats.weightLost}kg
              </div>
              <p className="text-sm text-muted-foreground">Weight Lost</p>
              <Progress value={(profileStats.weightLost / profileStats.weightGoal) * 100} className="h-2 mt-1" />
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 flex items-center justify-center gap-1">
                <Dumbbell className="h-6 w-6" />
                {profileStats.muscleGained}kg
              </div>
              <p className="text-sm text-muted-foreground">Muscle Gained</p>
              <Progress value={(profileStats.muscleGained / profileStats.muscleGoal) * 100} className="h-2 mt-1" />
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 flex items-center justify-center gap-1">
                <TrendingUp className="h-6 w-6" />
                {profileStats.totalWorkouts}
              </div>
              <p className="text-sm text-muted-foreground">Total Workouts</p>
              <p className="text-xs text-purple-600">📊 {profileStats.totalMeals} meals tracked</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Recent Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {recentBadges.map((badge, index) => (
              <div key={index} className="p-3 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800 text-center">
                <div className="text-2xl mb-1">{badge.icon}</div>
                <p className="font-medium text-sm">{badge.name}</p>
                <Badge variant="secondary" className="text-xs mt-1">
                  {badge.earned}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
