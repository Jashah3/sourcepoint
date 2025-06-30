import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { GoogleCalendarService } from "@/services/googleCalendar";
import { toast } from "@/hooks/use-toast";
import { Calendar, Droplets, ChefHat, TrendingUp, Clock, Heart, Utensils, Target } from "lucide-react";

export const EnhancedDashboardCards = () => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const calendarService = GoogleCalendarService.getInstance();

  // Enhanced mock data
  const dailyStats = {
    calories: { consumed: 1450, target: 2000, foods: ['Greek Yogurt with Berries', 'Grilled Chicken Salad', 'Apple with Almond Butter'] },
    protein: { 
      consumed: 65, 
      target: 150,
      sources: [
        { food: 'Greek Yogurt', amount: '20g', tips: 'Add protein powder for extra boost' },
        { food: 'Chicken Breast', amount: '35g', tips: 'Grill with herbs for better taste' },
        { food: 'Almond Butter', amount: '8g', tips: 'Pair with apple for complete nutrition' },
        { food: 'Eggs (pending)', amount: '12g', tips: 'Perfect breakfast protein source' }
      ],
      recommendations: [
        'Add protein shake post-workout (+25g)',
        'Include fish for omega-3 (+30g)',
        'Snack on Greek yogurt (+15g)',
        'Try quinoa as protein-rich carb (+8g)'
      ]
    },
    carbs: { consumed: 180, target: 250 },
    fats: { consumed: 55, target: 67 },
    water: { consumed: 2.1, target: 3.5 },
    steps: { count: 8500, target: 10000 }
  };

  const enhancedTodaysMenu = {
    breakfast: { 
      name: "Greek Yogurt Parfait", 
      steps: ["Layer 200g Greek yogurt", "Add mixed berries", "Sprinkle granola", "Drizzle honey"], 
      drink: "Green Tea with Lemon", 
      snack: "Handful of almonds",
      benefits: "High in probiotics, protein, and antioxidants. Supports digestive health and provides sustained energy.",
      digestive: "Add fresh ginger to tea for better digestion"
    },
    lunch: { 
      name: "Quinoa Power Bowl", 
      steps: ["Cook quinoa with vegetable broth", "Roast seasonal vegetables", "Add grilled protein", "Top with tahini dressing"], 
      drink: "Cucumber Mint Water", 
      snack: "Carrot sticks with hummus",
      benefits: "Complete protein source with essential amino acids. Rich in fiber and minerals.",
      digestive: "Cucumber water aids hydration and reduces bloating"
    },
    dinner: { 
      name: "Herb-Crusted Salmon", 
      steps: ["Season salmon with herbs", "Bake at 400°F for 15 min", "Steam broccoli and asparagus", "Serve with sweet potato"], 
      drink: "Chamomile Tea", 
      snack: "Dark chocolate square (85%)",
      benefits: "Rich in omega-3 fatty acids, supports heart and brain health.",
      digestive: "Chamomile tea promotes relaxation and better sleep"
    }
  };

  const weeklyProgress = {
    weightGoal: { current: 75, target: 70, progress: 60 },
    workoutConsistency: { completed: 6, target: 7, progress: 85 },
    nutritionGoals: { achieved: 9, target: 10, progress: 90 },
    motivationalMessages: [
      "You're crushing your goals! 🔥",
      "Consistency is key - keep going! 💪",
      "Small steps lead to big changes! ⭐",
      "Your dedication is inspiring! 🌟"
    ],
    workoutTypes: [
      "Upper Body Strength - Focus on push/pull movements",
      "HIIT Cardio - Boost metabolism and endurance", 
      "Core & Flexibility - Improve posture and mobility",
      "Lower Body Power - Build strength and stability"
    ]
  };

  const healthHabits = {
    bowelMovements: { frequency: "1-2 times daily", consistency: "Normal", recommendation: "Increase fiber intake" },
    energyLevels: { morning: "High", afternoon: "Moderate", evening: "Low", recommendation: "Consider B-complex vitamins" },
    sleepQuality: { hours: 7, quality: "Good", recommendation: "Maintain consistent sleep schedule" },
    stressLevel: { current: "Moderate", triggers: ["Work deadlines", "Traffic"], remedies: ["Deep breathing", "Short walks"] }
  };

  const handleAddCalendarReminder = async (type: string) => {
    try {
      if (!calendarService.isConnected()) {
        toast({
          title: "Calendar Not Connected",
          description: "Please connect Google Calendar in Settings first.",
          variant: "destructive"
        });
        return;
      }

      let success = false;
      if (type === 'meals') {
        const breakfast = new Date();
        breakfast.setHours(8, 0, 0, 0);
        const lunch = new Date();
        lunch.setHours(12, 30, 0, 0);
        const dinner = new Date();
        dinner.setHours(19, 0, 0, 0);

        success = await calendarService.createMealReminder('Breakfast', breakfast) &&
                 await calendarService.createMealReminder('Lunch', lunch) &&
                 await calendarService.createMealReminder('Dinner', dinner);
      } else if (type === 'water') {
        success = await calendarService.createWaterReminder();
      }

      if (success) {
        toast({
          title: "Reminders Added! 📅",
          description: `${type === 'meals' ? 'Meal' : 'Water'} reminders added to your calendar.`,
        });
      }
    } catch (error) {
      toast({
        title: "Failed to Add Reminders",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Enhanced Daily Calories Card */}
        <Card 
          className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-500 transform hover:scale-105 cursor-pointer"
          onMouseEnter={() => setHoveredCard('calories')}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Utensils className="h-4 w-4" />
              Daily Calories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-1">
              {dailyStats.calories.consumed}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              of {dailyStats.calories.target} cal
            </p>
            <Progress 
              value={(dailyStats.calories.consumed / dailyStats.calories.target) * 100} 
              className="h-2 mb-3"
            />
            
            {hoveredCard === 'calories' && (
              <div className="space-y-3 animate-fade-in">
                <div>
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Today's meals:</p>
                  {dailyStats.calories.foods.map((food, idx) => (
                    <Badge key={idx} variant="secondary" className="mr-1 mb-1 text-xs">
                      {food}
                    </Badge>
                  ))}
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded text-xs">
                  <p className="font-medium">Daily Habits Check:</p>
                  <p>Energy: {healthHabits.energyLevels.afternoon}</p>
                  <p>Hydration: {dailyStats.water.consumed}L / {dailyStats.water.target}L</p>
                  <p>Bowel: {healthHabits.bowelMovements.frequency}</p>
                </div>
                <Button 
                  size="sm" 
                  onClick={() => handleAddCalendarReminder('meals')}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white"
                >
                  <Calendar className="h-3 w-3 mr-1" />
                  Add Meal Reminders
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Enhanced Water Intake Card */}
        <Card 
          className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-500 transform hover:scale-105 cursor-pointer"
          onMouseEnter={() => setHoveredCard('water')}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Droplets className="h-4 w-4" />
              Hydration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-1">
              {dailyStats.water.consumed}L
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              of {dailyStats.water.target}L daily
            </p>
            <Progress 
              value={(dailyStats.water.consumed / dailyStats.water.target) * 100} 
              className="h-2 mb-3"
            />
            
            {hoveredCard === 'water' && (
              <div className="space-y-3 animate-fade-in">
                <div className="bg-cyan-50 dark:bg-cyan-900/20 p-2 rounded text-xs">
                  <p className="font-medium">Digestive Health:</p>
                  <p>Bowel frequency: {healthHabits.bowelMovements.frequency}</p>
                  <p>Consistency: {healthHabits.bowelMovements.consistency}</p>
                  <p className="text-cyan-600 dark:text-cyan-400 font-medium mt-1">
                    💡 {healthHabits.bowelMovements.recommendation}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium mb-1">Cleansing drinks:</p>
                  <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                    <p>• Warm lemon water (morning)</p>
                    <p>• Green tea with ginger</p>
                    <p>• Cucumber mint water</p>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  onClick={() => handleAddCalendarReminder('water')}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white"
                >
                  <Calendar className="h-3 w-3 mr-1" />
                  Add Water Reminders
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Enhanced Protein Card */}
        <Card 
          className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-500 transform hover:scale-105 cursor-pointer"
          onMouseEnter={() => setHoveredCard('protein')}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Protein Intake
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-1">
              {dailyStats.protein.consumed}g
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              of {dailyStats.protein.target}g
            </p>
            <Progress 
              value={(dailyStats.protein.consumed / dailyStats.protein.target) * 100} 
              className="h-2 mb-3"
            />
            
            {hoveredCard === 'protein' && (
              <div className="space-y-3 animate-fade-in">
                <div>
                  <p className="text-xs font-medium mb-2">Today's protein sources:</p>
                  {dailyStats.protein.sources.map((source, idx) => (
                    <div key={idx} className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded mb-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium">{source.food}</span>
                        <Badge variant="outline" className="text-xs">{source.amount}</Badge>
                      </div>
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">💡 {source.tips}</p>
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-xs font-medium mb-1">To reach your goal:</p>
                  <div className="space-y-1">
                    {dailyStats.protein.recommendations.slice(0, 2).map((rec, idx) => (
                      <p key={idx} className="text-xs text-green-600 dark:text-green-400">• {rec}</p>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Enhanced Steps Card */}
        <Card 
          className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-500 transform hover:scale-105 cursor-pointer"
          onMouseEnter={() => setHoveredCard('steps')}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Daily Steps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-1">
              {dailyStats.steps.count.toLocaleString()}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              of {dailyStats.steps.target.toLocaleString()} steps
            </p>
            <Progress 
              value={(dailyStats.steps.count / dailyStats.steps.target) * 100} 
              className="h-2 mb-3"
            />
            
            {hoveredCard === 'steps' && (
              <div className="space-y-3 animate-fade-in">
                <div className="bg-purple-50 dark:bg-purple-900/20 p-2 rounded text-xs">
                  <p className="font-medium">Energy Levels Today:</p>
                  <p>Morning: {healthHabits.energyLevels.morning}</p>
                  <p>Afternoon: {healthHabits.energyLevels.afternoon}</p>
                  <p>Evening: {healthHabits.energyLevels.evening}</p>
                  <p className="text-purple-600 dark:text-purple-400 font-medium mt-1">
                    💡 {healthHabits.energyLevels.recommendation}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium mb-1">Remaining: {(dailyStats.steps.target - dailyStats.steps.count).toLocaleString()} steps</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">About 15 min walk</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Enhanced Today's Menu Card */}
        <Card 
          className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 border-gray-200 dark:border-gray-700"
          onMouseEnter={() => setHoveredCard('menu')}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
              <ChefHat className="h-5 w-5 text-gray-600" />
              Today's Complete Menu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {Object.entries(enhancedTodaysMenu).map(([mealType, meal]) => (
                <div key={mealType} className="p-4 bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-700 dark:to-slate-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all duration-300">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 dark:text-gray-200 capitalize text-lg">{mealType}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{meal.name}</p>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          🍹 {meal.drink}
                        </Badge>
                        <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                          🥜 {meal.snack}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  {hoveredCard === 'menu' && (
                    <div className="space-y-3 animate-fade-in">
                      <div>
                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Preparation steps:</p>
                        {meal.steps.map((step, idx) => (
                          <div key={idx} className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-2 mb-1">
                            <span className="bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-full w-4 h-4 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{idx + 1}</span>
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded text-xs">
                        <p className="font-medium text-blue-800 dark:text-blue-200 mb-1">Health Benefits:</p>
                        <p className="text-blue-700 dark:text-blue-300">{meal.benefits}</p>
                      </div>
                      <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded text-xs">
                        <p className="font-medium text-green-800 dark:text-green-200 mb-1">Digestive Support:</p>
                        <p className="text-green-700 dark:text-green-300">{meal.digestive}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Weekly Progress Card */}
        <Card 
          className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 border-gray-200 dark:border-gray-700"
          onMouseEnter={() => setHoveredCard('progress')}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
              <TrendingUp className="h-5 w-5 text-gray-600" />
              Weekly Progress & Motivation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Weight Goal Progress</span>
                  <span className="font-bold text-gray-800 dark:text-gray-200">{weeklyProgress.weightGoal.progress}%</span>
                </div>
                <div className="relative">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3"></div>
                  <div className="absolute top-0 left-0 bg-gradient-to-r from-gray-500 to-gray-700 h-3 rounded-full transition-all duration-1000" style={{width: `${weeklyProgress.weightGoal.progress}%`}}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Workout Consistency</span>
                  <span className="font-bold text-gray-800 dark:text-gray-200">{weeklyProgress.workoutConsistency.progress}%</span>
                </div>
                <div className="relative">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3"></div>
                  <div className="absolute top-0 left-0 bg-gradient-to-r from-gray-400 to-gray-600 h-3 rounded-full transition-all duration-1000" style={{width: `${weeklyProgress.workoutConsistency.progress}%`}}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Nutrition Goals</span>
                  <span className="font-bold text-gray-800 dark:text-gray-200">{weeklyProgress.nutritionGoals.progress}%</span>
                </div>
                <div className="relative">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3"></div>
                  <div className="absolute top-0 left-0 bg-gradient-to-r from-gray-500 to-gray-800 h-3 rounded-full transition-all duration-1000" style={{width: `${weeklyProgress.nutritionGoals.progress}%`}}></div>
                </div>
              </div>

              {hoveredCard === 'progress' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                    <p className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">🌟 Motivation Boost:</p>
                    <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                      {weeklyProgress.motivationalMessages[Math.floor(Math.random() * weeklyProgress.motivationalMessages.length)]}
                    </p>
                  </div>
                  
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                    <p className="font-medium text-purple-800 dark:text-purple-200 mb-2">💪 Recommended Workouts:</p>
                    <div className="space-y-1">
                      {weeklyProgress.workoutTypes.slice(0, 2).map((workout, idx) => (
                        <p key={idx} className="text-purple-700 dark:text-purple-300 text-xs">• {workout}</p>
                      ))}
                    </div>
                  </div>

                  <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                    <p className="font-medium text-red-800 dark:text-red-200 mb-2">🎯 Stress Management:</p>
                    <p className="text-red-700 dark:text-red-300 text-xs mb-1">Level: {healthHabits.stressLevel.current}</p>
                    <div className="space-y-1">
                      {healthHabits.stressLevel.remedies.map((remedy, idx) => (
                        <p key={idx} className="text-red-700 dark:text-red-300 text-xs">• {remedy}</p>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
