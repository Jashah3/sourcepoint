
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
import { CameraFoodRecognition } from "@/components/CameraFoodRecognition";
import { useTheme } from "./ThemeProvider";
import { Activity, Award, Calendar, Heart, Settings as SettingsIcon, User, Moon, Sun, Zap } from "lucide-react";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { theme, setTheme } = useTheme();

  // Mock data - in real app, this would come from localStorage/API
  const dailyStats = {
    calories: { consumed: 1450, target: 2000 },
    protein: { consumed: 65, target: 150 },
    carbs: { consumed: 180, target: 250 },
    fats: { consumed: 55, target: 67 },
    water: { consumed: 6, target: 8 },
    steps: { count: 8500, target: 10000 }
  };

  // Daily menu changes based on day of week
  const getDailyMenu = () => {
    const today = new Date().getDay();
    const menus = [
      { breakfast: "Greek Yogurt with Granola", lunch: "Quinoa Buddha Bowl", dinner: "Baked Cod with Vegetables" },
      { breakfast: "Avocado Toast with Eggs", lunch: "Turkey Wrap", dinner: "Grilled Chicken Stir-fry" },
      { breakfast: "Protein Smoothie Bowl", lunch: "Mediterranean Salad", dinner: "Salmon with Sweet Potato" },
      { breakfast: "Oatmeal with Berries", lunch: "Chicken Caesar Salad", dinner: "Beef Tacos with Black Beans" },
      { breakfast: "Chia Pudding", lunch: "Veggie Sushi Bowl", dinner: "Pork Tenderloin with Quinoa" },
      { breakfast: "French Toast (Healthy)", lunch: "Grilled Portobello Burger", dinner: "Shrimp Pasta Primavera" },
      { breakfast: "Pancakes with Fruit", lunch: "BBQ Chicken Salad", dinner: "Vegetarian Chili" }
    ];
    return menus[today];
  };

  const todaysMenu = getDailyMenu();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-all duration-300">
      <div className="container mx-auto p-4 max-w-7xl">
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              SourcePoint
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <CameraFoodRecognition />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="hover:bg-purple-100 dark:hover:bg-purple-900/20"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Badge variant="secondary" className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 dark:from-green-900/20 dark:to-emerald-900/20 dark:text-green-300 animate-pulse">
              Day 7 Streak 🔥
            </Badge>
            <Button variant="ghost" size="icon" className="hover:bg-purple-100 dark:hover:bg-purple-900/20">
              <User className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setActiveTab("settings")}
              className="hover:bg-purple-100 dark:hover:bg-purple-900/20"
            >
              <SettingsIcon className="h-5 w-5" />
            </Button>
          </div>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-7 mb-8 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-purple-200 dark:border-purple-700">
            <TabsTrigger value="dashboard" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white">
              <Activity className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="calories" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white">
              🍎 Calories
            </TabsTrigger>
            <TabsTrigger value="meals" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-600 data-[state=active]:text-white">
              <Calendar className="h-4 w-4" />
              Meals
            </TabsTrigger>
            <TabsTrigger value="workouts" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-600 data-[state=active]:text-white">
              <Award className="h-4 w-4" />
              Workouts
            </TabsTrigger>
            <TabsTrigger value="supplements" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-rose-600 data-[state=active]:text-white">
              💊 Supplements
            </TabsTrigger>
            <TabsTrigger value="coach" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-purple-600 data-[state=active]:text-white">
              🤖 AI Coach
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-gray-500 data-[state=active]:to-slate-600 data-[state=active]:text-white">
              <SettingsIcon className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-700 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Daily Calories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600 mb-1">
                    {dailyStats.calories.consumed}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    of {dailyStats.calories.target} cal
                  </p>
                  <Progress 
                    value={(dailyStats.calories.consumed / dailyStats.calories.target) * 100} 
                    className="h-2"
                  />
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-700 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Protein</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600 mb-1">
                    {dailyStats.protein.consumed}g
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    of {dailyStats.protein.target}g
                  </p>
                  <Progress 
                    value={(dailyStats.protein.consumed / dailyStats.protein.target) * 100} 
                    className="h-2"
                  />
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-cyan-50 to-teal-50 dark:from-cyan-900/20 dark:to-teal-900/20 border-cyan-200 dark:border-cyan-700 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-cyan-700 dark:text-cyan-300">Water Intake</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-cyan-600 mb-1">
                    {dailyStats.water.consumed}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    of {dailyStats.water.target} glasses
                  </p>
                  <Progress 
                    value={(dailyStats.water.consumed / dailyStats.water.target) * 100} 
                    className="h-2"
                  />
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 border-purple-200 dark:border-purple-700 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">Steps</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600 mb-1">
                    {dailyStats.steps.count.toLocaleString()}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    of {dailyStats.steps.target.toLocaleString()} steps
                  </p>
                  <Progress 
                    value={(dailyStats.steps.count / dailyStats.steps.target) * 100} 
                    className="h-2"
                  />
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-orange-600" />
                    Today's Menu
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-lg border border-orange-200 dark:border-orange-700">
                      <div>
                        <p className="font-semibold text-orange-800 dark:text-orange-300">Breakfast</p>
                        <p className="text-sm text-muted-foreground">{todaysMenu.breakfast}</p>
                      </div>
                      <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300">350 cal</Badge>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-700">
                      <div>
                        <p className="font-semibold text-green-800 dark:text-green-300">Lunch</p>
                        <p className="text-sm text-muted-foreground">{todaysMenu.lunch}</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">450 cal</Badge>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                      <div>
                        <p className="font-semibold text-blue-800 dark:text-blue-300">Dinner</p>
                        <p className="text-sm text-muted-foreground">{todaysMenu.dinner}</p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">650 cal</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-purple-600" />
                    Weekly Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="relative">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium">Weight Goal Progress</span>
                        <span className="font-bold text-purple-600">75%</span>
                      </div>
                      <Progress value={75} className="h-3 bg-purple-100 dark:bg-purple-900/20" />
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full h-3 animate-scale-in" style={{width: '75%'}} />
                    </div>
                    <div className="relative">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium">Workout Consistency</span>
                        <span className="font-bold text-blue-600">85%</span>
                      </div>
                      <Progress value={85} className="h-3 bg-blue-100 dark:bg-blue-900/20" />
                    </div>
                    <div className="relative">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium">Nutrition Goals</span>
                        <span className="font-bold text-green-600">90%</span>
                      </div>
                      <Progress value={90} className="h-3 bg-green-100 dark:bg-green-900/20" />
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

          <TabsContent value="settings">
            <Settings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
