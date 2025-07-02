
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { User, TrendingUp, Award, Flame, Scale, Dumbbell } from "lucide-react";
import { useHealthData } from "@/contexts/HealthDataContext";

export const ProfileDashboard = () => {
  const { healthData } = useHealthData();
  
  const profileStats = {
    currentStreak: healthData.streak,
    longestStreak: 23,
    weightLost: 5.2,
    weightGoal: 10,
    muscleGained: healthData.muscleGained,
    muscleGoal: 5,
    totalWorkouts: healthData.workoutsCompleted * 11, // Simulated total
    totalMeals: healthData.mealsLogged * 52 // Simulated total
  };

  const recentBadges = healthData.badges.slice(-4).map((badge, index) => ({
    name: badge,
    icon: index === 0 ? "🗓️" : index === 1 ? "💧" : index === 2 ? "💪" : "👑",
    earned: index === 0 ? "Today" : index === 1 ? "2 days ago" : index === 2 ? "3 days ago" : "1 week ago"
  }));

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
            Recent Achievements ({healthData.achievements} Total)
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Today's Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Calories</span>
                  <span className="text-sm text-muted-foreground">{healthData.dailyCalories}/{healthData.calorieGoal}</span>
                </div>
                <Progress value={(healthData.dailyCalories / healthData.calorieGoal) * 100} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Water Intake</span>
                  <span className="text-sm text-muted-foreground">{healthData.waterIntake}/{healthData.waterGoal} glasses</span>
                </div>
                <Progress value={(healthData.waterIntake / healthData.waterGoal) * 100} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Protein</span>
                  <span className="text-sm text-muted-foreground">{healthData.proteinIntake}g/{healthData.proteinGoal}g</span>
                </div>
                <Progress value={(healthData.proteinIntake / healthData.proteinGoal) * 100} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Steps</span>
                  <span className="text-sm text-muted-foreground">{healthData.steps.toLocaleString()}/{healthData.stepGoal.toLocaleString()}</span>
                </div>
                <Progress value={(healthData.steps / healthData.stepGoal) * 100} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Health Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">{healthData.healthScore}%</div>
                <p className="text-sm text-muted-foreground">Overall Health Score</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span>Weekly Workouts:</span>
                  <Badge variant="secondary">{healthData.workoutsCompleted}/7</Badge>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Supplements Taken:</span>
                  <Badge variant="secondary">{healthData.supplementsTaken.length}/8</Badge>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Sleep Quality:</span>
                  <Badge variant="secondary">{healthData.sleepHours}h avg</Badge>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Active Streak:</span>
                  <Badge variant="default">{healthData.streak} days</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
