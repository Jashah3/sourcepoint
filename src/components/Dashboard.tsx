
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalorieTracker } from "@/components/CalorieTracker";
import { MealPlanner } from "@/components/MealPlanner";
import { WorkoutTracker } from "@/components/WorkoutTracker";
import { SupplementTracker } from "@/components/SupplementTracker";
import { AICoach } from "@/components/AICoach";
import { Settings } from "@/components/Settings";
import { CameraFoodRecognition } from "@/components/CameraFoodRecognition";
import { EnhancedDashboardCards } from "@/components/EnhancedDashboardCards";
import { DynamicBackground } from "@/components/DynamicBackground";
import { AnimatedFoodBackground } from "@/components/AnimatedFoodBackground";
import { HealthBadges } from "@/components/HealthBadges";
import { DailySummary } from "@/components/DailySummary";
import { ProfileDashboard } from "@/components/ProfileDashboard";
import { useTheme } from "./ThemeProvider";
import { Activity, Award, Calendar, Heart, Settings as SettingsIcon, User, Moon, Sun, Zap } from "lucide-react";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen relative">
      <DynamicBackground />
      <AnimatedFoodBackground />
      
      <div className="relative z-10 container mx-auto p-4 max-w-7xl">
        <header className="flex justify-between items-center mb-8 bg-white/20 dark:bg-gray-800/20 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-white/30 dark:border-gray-700/30">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 rounded-2xl flex items-center justify-center shadow-xl animate-bounce-in">
              <Zap className="h-7 w-7 text-white animate-pulse" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-700 via-teal-800 to-emerald-900 dark:from-emerald-200 dark:via-teal-300 dark:to-emerald-100 bg-clip-text text-transparent">
                SourcePoint
              </h1>
              <p className="text-sm text-emerald-600 dark:text-emerald-400">Your Health & Wellness Companion</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <CameraFoodRecognition />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="hover:bg-white/20 dark:hover:bg-gray-800/20 backdrop-blur-sm transition-all duration-300 rounded-xl"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Badge variant="secondary" className="bg-gradient-to-r from-orange-500 to-red-500 text-white animate-pulse shadow-lg">
              Day 7 Streak 🔥
            </Badge>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setActiveTab("profile")}
              className="hover:bg-white/20 dark:hover:bg-gray-800/20 backdrop-blur-sm transition-all duration-300 rounded-xl"
            >
              <User className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setActiveTab("settings")}
              className="hover:bg-white/20 dark:hover:bg-gray-800/20 backdrop-blur-sm transition-all duration-300 rounded-xl"
            >
              <SettingsIcon className="h-5 w-5" />
            </Button>
          </div>
        </header>

        <DailySummary />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-6">
          <TabsList className="grid w-full grid-cols-8 mb-8 bg-white/30 dark:bg-gray-800/30 backdrop-blur-md border border-white/40 dark:border-gray-700/40 shadow-2xl rounded-2xl p-1">
            <TabsTrigger value="dashboard" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-teal-600 data-[state=active]:text-white transition-all duration-300 rounded-xl">
              <Activity className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="calories" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-teal-600 data-[state=active]:text-white transition-all duration-300 rounded-xl">
              🍎 Calories
            </TabsTrigger>
            <TabsTrigger value="meals" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-teal-600 data-[state=active]:text-white transition-all duration-300 rounded-xl">
              <Calendar className="h-4 w-4" />
              Meals
            </TabsTrigger>
            <TabsTrigger value="workouts" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-teal-600 data-[state=active]:text-white transition-all duration-300 rounded-xl">
              <Award className="h-4 w-4" />
              Workouts
            </TabsTrigger>
            <TabsTrigger value="supplements" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-teal-600 data-[state=active]:text-white transition-all duration-300 rounded-xl">
              💊 Supplements
            </TabsTrigger>
            <TabsTrigger value="coach" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-teal-600 data-[state=active]:text-white transition-all duration-300 rounded-xl">
              🤖 AI Coach
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-teal-600 data-[state=active]:text-white transition-all duration-300 rounded-xl">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-teal-600 data-[state=active]:text-white transition-all duration-300 rounded-xl">
              <SettingsIcon className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-8 animate-fade-in">
            <HealthBadges />
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

          <TabsContent value="profile">
            <ProfileDashboard />
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
