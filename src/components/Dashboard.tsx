
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CalorieTracker } from "@/components/CalorieTracker";
import { MealPlanner } from "@/components/MealPlanner";
import { WorkoutTracker } from "@/components/WorkoutTracker";
import { SupplementTracker } from "@/components/SupplementTracker";
import { AICoach } from "@/components/AICoach";
import { Settings } from "@/components/Settings";
import { Activity, Award, Calendar, Heart, Settings as SettingsIcon, User } from "lucide-react";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  // Mock data - in real app, this would come from localStorage/API
  const dailyStats = {
    calories: { consumed: 1450, target: 2000 },
    protein: { consumed: 65, target: 150 },
    carbs: { consumed: 180, target: 250 },
    fats: { consumed: 55, target: 67 },
    water: { consumed: 6, target: 8 },
    steps: { count: 8500, target: 10000 }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 max-w-7xl">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-green-600">🌱 Thrive Today</h1>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Day 7 Streak 🔥
            </Badge>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-6">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="calories" className="flex items-center gap-2">
              🍎 Calories
            </TabsTrigger>
            <TabsTrigger value="meals" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Meals
            </TabsTrigger>
            <TabsTrigger value="workouts" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              Workouts
            </TabsTrigger>
            <TabsTrigger value="supplements" className="flex items-center gap-2">
              💊 Supplements
            </TabsTrigger>
            <TabsTrigger value="coach" className="flex items-center gap-2">
              🤖 AI Coach
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Daily Calories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {dailyStats.calories.consumed}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    of {dailyStats.calories.target} cal
                  </p>
                  <Progress 
                    value={(dailyStats.calories.consumed / dailyStats.calories.target) * 100} 
                    className="mt-2"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Protein</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {dailyStats.protein.consumed}g
                  </div>
                  <p className="text-xs text-muted-foreground">
                    of {dailyStats.protein.target}g
                  </p>
                  <Progress 
                    value={(dailyStats.protein.consumed / dailyStats.protein.target) * 100} 
                    className="mt-2"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Water Intake</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-cyan-600">
                    {dailyStats.water.consumed}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    of {dailyStats.water.target} glasses
                  </p>
                  <Progress 
                    value={(dailyStats.water.consumed / dailyStats.water.target) * 100} 
                    className="mt-2"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Steps</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">
                    {dailyStats.steps.count.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    of {dailyStats.steps.target.toLocaleString()} steps
                  </p>
                  <Progress 
                    value={(dailyStats.steps.count / dailyStats.steps.target) * 100} 
                    className="mt-2"
                  />
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Today's Meals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div>
                        <p className="font-medium">Breakfast</p>
                        <p className="text-sm text-muted-foreground">Oatmeal with berries</p>
                      </div>
                      <Badge>350 cal</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <div>
                        <p className="font-medium">Lunch</p>
                        <p className="text-sm text-muted-foreground">Chicken salad</p>
                      </div>
                      <Badge>450 cal</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <div>
                        <p className="font-medium">Dinner</p>
                        <p className="text-sm text-muted-foreground">Salmon with quinoa</p>
                      </div>
                      <Badge>650 cal</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Weekly Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Weight Goal Progress</span>
                        <span>75%</span>
                      </div>
                      <Progress value={75} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Workout Consistency</span>
                        <span>85%</span>
                      </div>
                      <Progress value={85} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Nutrition Goals</span>
                        <span>90%</span>
                      </div>
                      <Progress value={90} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="calories">
            <CalorieTracker />
          </TabsContent>

          <TabsContent value="meals">
            <MealPlanner />
          </TabsContent>

          <TabsContent value="workouts">
            <WorkoutTracker />
          </TabsContent>

          <TabsContent value="supplements">
            <SupplementTracker />
          </TabsContent>

          <TabsContent value="coach">
            <AICoach />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
