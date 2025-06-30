
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { GoogleCalendarService } from "@/services/googleCalendar";
import { toast } from "@/hooks/use-toast";
import { Calendar, Droplets, ChefHat, TrendingUp, Clock, Heart, Utensils } from "lucide-react";

export const EnhancedDashboardCards = () => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const calendarService = GoogleCalendarService.getInstance();

  // Mock data - in real app, this would come from localStorage/API
  const dailyStats = {
    calories: { consumed: 1450, target: 2000, foods: ['Oatmeal with berries', 'Chicken salad', 'Apple'] },
    protein: { consumed: 65, target: 150 },
    carbs: { consumed: 180, target: 250 },
    fats: { consumed: 55, target: 67 },
    water: { consumed: 2.1, target: 3.5 }, // 3.5L target
    steps: { count: 8500, target: 10000 }
  };

  const remainingMeals = [
    { name: 'Afternoon Snack', time: '3:00 PM', calories: 200 },
    { name: 'Dinner', time: '7:00 PM', calories: 650 }
  ];

  const getDailyMenu = () => {
    const today = new Date().getDay();
    const menus = [
      { 
        breakfast: { name: "Greek Yogurt with Granola", steps: ["Mix 200g Greek yogurt", "Add 50g granola", "Top with berries"], drink: "Green Tea", benefits: "High in protein and probiotics for digestive health" },
        lunch: { name: "Quinoa Buddha Bowl", steps: ["Cook 100g quinoa", "Add roasted vegetables", "Drizzle tahini dressing"], drink: "Lemon Water", benefits: "Complete protein source with essential amino acids" },
        dinner: { name: "Baked Cod with Vegetables", steps: ["Season cod fillet", "Bake at 400°F for 15 min", "Serve with steamed broccoli"], drink: "Herbal Tea", benefits: "Lean protein rich in omega-3 fatty acids" }
      },
      { 
        breakfast: { name: "Avocado Toast with Eggs", steps: ["Toast whole grain bread", "Mash 1/2 avocado", "Top with poached egg"], drink: "Coffee", benefits: "Healthy fats and protein for sustained energy" },
        lunch: { name: "Turkey Wrap", steps: ["Spread hummus on tortilla", "Add turkey and vegetables", "Roll tightly"], drink: "Sparkling Water", benefits: "Lean protein with complex carbohydrates" },
        dinner: { name: "Grilled Chicken Stir-fry", steps: ["Marinate chicken", "Stir-fry with vegetables", "Serve over brown rice"], drink: "Chamomile Tea", benefits: "Balanced macronutrients with antioxidants" }
      }
    ];
    return menus[today] || menus[0];
  };

  const todaysMenu = getDailyMenu();

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

  const postWorkoutDrinks = [
    "Protein shake with banana",
    "Chocolate milk",
    "Coconut water",
    "BCAA drink",
    "Green smoothie"
  ];

  const healthyCarbs = ["Quinoa", "Sweet potato", "Oats", "Brown rice", "Berries"];
  const healthyFats = ["Avocado", "Nuts", "Olive oil", "Salmon", "Seeds"];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Daily Calories Card */}
        <Card 
          className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-500 transform hover:scale-105 cursor-pointer"
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
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Foods eaten today:</p>
                  {dailyStats.calories.foods.map((food, idx) => (
                    <Badge key={idx} variant="secondary" className="mr-1 mb-1 text-xs bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                      {food}
                    </Badge>
                  ))}
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Remaining meals:</p>
                  {remainingMeals.map((meal, idx) => (
                    <div key={idx} className="text-xs text-gray-600 dark:text-gray-400">
                      {meal.name} - {meal.time} ({meal.calories} cal)
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Healthy Carbs & Fats:</p>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Carbs:</span> {healthyCarbs.slice(0, 3).join(', ')}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Fats:</span> {healthyFats.slice(0, 3).join(', ')}
                  </div>
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

        {/* Water Intake Card */}
        <Card 
          className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-500 transform hover:scale-105 cursor-pointer"
          onMouseEnter={() => setHoveredCard('water')}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Droplets className="h-4 w-4" />
              Water Intake
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
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Remaining: {(dailyStats.water.target - dailyStats.water.consumed).toFixed(1)}L
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Glasses left: {Math.ceil((dailyStats.water.target - dailyStats.water.consumed) * 4)} (250ml each)
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Post-workout drinks:</p>
                  {postWorkoutDrinks.slice(0, 3).map((drink, idx) => (
                    <div key={idx} className="text-xs text-gray-600 dark:text-gray-400">• {drink}</div>
                  ))}
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

        {/* Protein Card */}
        <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-500 transform hover:scale-105">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Protein
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
              className="h-2"
            />
          </CardContent>
        </Card>

        {/* Steps Card */}
        <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-500 transform hover:scale-105">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Steps
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
              className="h-2"
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Today's Menu Card */}
        <Card 
          className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:shadow-xl transition-all duration-500 border-gray-200 dark:border-gray-700"
          onMouseEnter={() => setHoveredCard('menu')}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
              <ChefHat className="h-5 w-5 text-gray-600" />
              Today's Menu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {Object.entries(todaysMenu).map(([mealType, meal]) => (
                <div key={mealType} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-300">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 dark:text-gray-200 capitalize">{mealType}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{meal.name}</p>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200">
                          {meal.drink}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  {hoveredCard === 'menu' && (
                    <div className="space-y-2 animate-fade-in">
                      <div>
                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Preparation steps:</p>
                        {meal.steps.map((step, idx) => (
                          <div key={idx} className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-2">
                            <span className="bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-full w-4 h-4 flex items-center justify-center text-xs font-bold">{idx + 1}</span>
                            {step}
                          </div>
                        ))}
                      </div>
                      <div className="bg-gray-100 dark:bg-gray-600 p-2 rounded text-xs">
                        <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">Health Benefits:</p>
                        <p className="text-gray-600 dark:text-gray-400">{meal.benefits}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Weekly Progress Card */}
        <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:shadow-xl transition-all duration-500 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
              <TrendingUp className="h-5 w-5 text-gray-600" />
              Weekly Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Weight Goal Progress</span>
                  <span className="font-bold text-gray-800 dark:text-gray-200">75%</span>
                </div>
                <div className="relative">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3"></div>
                  <div className="absolute top-0 left-0 bg-gradient-to-r from-gray-500 to-gray-700 h-3 rounded-full transition-all duration-1000 animate-scale-in" style={{width: '75%'}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Workout Consistency</span>
                  <span className="font-bold text-gray-800 dark:text-gray-200">85%</span>
                </div>
                <div className="relative">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3"></div>
                  <div className="absolute top-0 left-0 bg-gradient-to-r from-gray-400 to-gray-600 h-3 rounded-full transition-all duration-1000" style={{width: '85%'}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Nutrition Goals</span>
                  <span className="font-bold text-gray-800 dark:text-gray-200">90%</span>
                </div>
                <div className="relative">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3"></div>
                  <div className="absolute top-0 left-0 bg-gradient-to-r from-gray-500 to-gray-800 h-3 rounded-full transition-all duration-1000" style={{width: '90%'}}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
