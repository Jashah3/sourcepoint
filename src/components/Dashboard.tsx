
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
import { EnhancedDashboardCards } from "@/components/EnhancedDashboardCards";
import { useTheme } from "./ThemeProvider";
import { Activity, Award, Calendar, Heart, Settings as SettingsIcon, User, Moon, Sun, Zap } from "lucide-react";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-500">
      <div className="container mx-auto p-4 max-w-7xl">
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-gradient-to-r from-gray-600 to-gray-800 rounded-xl flex items-center justify-center shadow-lg">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
              SourcePoint
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <CameraFoodRecognition />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Badge variant="secondary" className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 animate-pulse">
              Day 7 Streak 🔥
            </Badge>
            <Button variant="ghost" size="icon" className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300">
              <User className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setActiveTab("settings")}
              className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
            >
              <SettingsIcon className="h-5 w-5" />
            </Button>
          </div>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-7 mb-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg">
            <TabsTrigger value="dashboard" className="flex items-center gap-2 data-[state=active]:bg-gray-600 data-[state=active]:text-white transition-all duration-300">
              <Activity className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="calories" className="flex items-center gap-2 data-[state=active]:bg-gray-600 data-[state=active]:text-white transition-all duration-300">
              🍎 Calories
            </TabsTrigger>
            <TabsTrigger value="meals" className="flex items-center gap-2 data-[state=active]:bg-gray-600 data-[state=active]:text-white transition-all duration-300">
              <Calendar className="h-4 w-4" />
              Meals
            </TabsTrigger>
            <TabsTrigger value="workouts" className="flex items-center gap-2 data-[state=active]:bg-gray-600 data-[state=active]:text-white transition-all duration-300">
              <Award className="h-4 w-4" />
              Workouts
            </TabsTrigger>
            <TabsTrigger value="supplements" className="flex items-center gap-2 data-[state=active]:bg-gray-600 data-[state=active]:text-white transition-all duration-300">
              💊 Supplements
            </TabsTrigger>
            <TabsTrigger value="coach" className="flex items-center gap-2 data-[state=active]:bg-gray-600 data-[state=active]:text-white transition-all duration-300">
              🤖 AI Coach
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2 data-[state=active]:bg-gray-600 data-[state=active]:text-white transition-all duration-300">
              <SettingsIcon className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-8 animate-fade-in">
            <EnhancedDashboardCards />
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
