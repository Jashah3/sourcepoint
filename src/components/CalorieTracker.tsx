
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Camera, Mic, TrendingUp, Target } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { CameraFoodRecognition } from "./CameraFoodRecognition";
import { FoodRecommendations } from "./FoodRecommendations";
import { useHealthData } from "@/contexts/HealthDataContext";

export const CalorieTracker = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFood, setSelectedFood] = useState<any>(null);
  const [quantity, setQuantity] = useState('1');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [hoveredNutrient, setHoveredNutrient] = useState<string | null>(null);
  const [todaysMeals, setTodaysMeals] = useState([
    { 
      id: 1, 
      meal: 'Breakfast', 
      food: 'Greek Yogurt with Berries', 
      calories: 350, 
      protein: 20, 
      carbs: 30, 
      fat: 12,
      time: '8:00 AM',
      recipe: {
        ingredients: ['200g Greek yogurt', '100g mixed berries', '1 tbsp honey', '30g granola'],
        steps: ['Add yogurt to bowl', 'Top with berries', 'Drizzle honey', 'Sprinkle granola'],
        prepTime: '5 minutes'
      }
    },
    { 
      id: 2, 
      meal: 'Lunch', 
      food: 'Grilled Chicken Salad', 
      calories: 450, 
      protein: 35, 
      carbs: 25, 
      fat: 18,
      time: '12:30 PM',
      recipe: {
        ingredients: ['150g chicken breast', '100g mixed greens', '1 medium avocado', '50g cherry tomatoes'],
        steps: ['Grill seasoned chicken', 'Prepare salad base', 'Slice avocado', 'Combine with dressing'],
        prepTime: '15 minutes'
      }
    },
    { 
      id: 3, 
      meal: 'Snack', 
      food: 'Apple with Almond Butter', 
      calories: 200, 
      protein: 8, 
      carbs: 25, 
      fat: 12,
      time: '3:30 PM',
      recipe: {
        ingredients: ['1 medium apple', '2 tbsp almond butter'],
        steps: ['Slice apple', 'Serve with almond butter'],
        prepTime: '2 minutes'
      }
    }
  ]);
  
  const { incrementCalories, incrementProtein, logMeal } = useHealthData();

  const foodCategories = {
    meats: [
      { id: 1, name: 'Chicken Breast', calories_per_100g: 165, protein: 31, carbs: 0, fat: 3.6, vitamins: { B6: '0.6mg', B12: '0.3mcg', Niacin: '14mg' }, minerals: { Iron: '1mg', Zinc: '1mg' } },
      { id: 2, name: 'Salmon', calories_per_100g: 208, protein: 25, carbs: 0, fat: 12, vitamins: { D: '360IU', B12: '4.9mcg', B6: '0.6mg' }, minerals: { Iron: '0.8mg', Magnesium: '30mg' } },
      { id: 3, name: 'Lean Beef', calories_per_100g: 250, protein: 26, carbs: 0, fat: 15, vitamins: { B12: '2.6mcg', B6: '0.4mg', Niacin: '4.2mg' }, minerals: { Iron: '2.6mg', Zinc: '4.8mg' } },
    ],
    vegetables: [
      { id: 4, name: 'Broccoli', calories_per_100g: 34, protein: 2.8, carbs: 7, fat: 0.4, vitamins: { C: '89mg', K: '102mcg', Folate: '63mcg' }, minerals: { Iron: '0.7mg', Calcium: '47mg' } },
      { id: 5, name: 'Spinach', calories_per_100g: 23, protein: 2.9, carbs: 3.6, fat: 0.4, vitamins: { K: '483mcg', A: '469mcg', Folate: '194mcg' }, minerals: { Iron: '2.7mg', Magnesium: '79mg' } },
      { id: 6, name: 'Bell Peppers', calories_per_100g: 31, protein: 1, carbs: 7, fat: 0.3, vitamins: { C: '190mg', A: '157mcg', B6: '0.3mg' }, minerals: { Potassium: '211mg' } },
    ],
    fruits: [
      { id: 7, name: 'Banana', calories_per_100g: 89, protein: 1.1, carbs: 22.8, fat: 0.3, vitamins: { C: '8.7mg', B6: '0.4mg', Folate: '20mcg' }, minerals: { Potassium: '358mg', Magnesium: '27mg' } },
      { id: 8, name: 'Apple', calories_per_100g: 52, protein: 0.3, carbs: 14, fat: 0.2, vitamins: { C: '4.6mg', K: '2.2mcg' }, minerals: { Potassium: '107mg' } },
      { id: 9, name: 'Berries Mix', calories_per_100g: 57, protein: 0.7, carbs: 14, fat: 0.3, vitamins: { C: '60mg', K: '19mcg', Folate: '6mcg' }, minerals: { Manganese: '0.4mg' } },
    ],
    grains: [
      { id: 10, name: 'Brown Rice', calories_per_100g: 111, protein: 2.6, carbs: 23, fat: 0.9, vitamins: { B1: '0.1mg', B3: '1.5mg' }, minerals: { Magnesium: '44mg', Phosphorus: '83mg' } },
      { id: 11, name: 'Quinoa', calories_per_100g: 120, protein: 4.4, carbs: 22, fat: 1.9, vitamins: { Folate: '42mcg', B6: '0.1mg' }, minerals: { Iron: '1.5mg', Magnesium: '64mg' } },
      { id: 12, name: 'Oats', calories_per_100g: 389, protein: 16.9, carbs: 66, fat: 6.9, vitamins: { B1: '0.8mg', Folate: '56mcg' }, minerals: { Iron: '4.7mg', Zinc: '4mg' } },
    ]
  };

  const allFoods = Object.values(foodCategories).flat();

  const dailyGoals = {
    calories: 2000,
    protein: 150,
    carbs: 250,
    fat: 67
  };

  const currentTotals = todaysMeals.reduce((acc, meal) => ({
    calories: acc.calories + meal.calories,
    protein: acc.protein + meal.protein,
    carbs: acc.carbs + meal.carbs,
    fat: acc.fat + meal.fat
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  const filteredFoods = selectedCategory === 'all' 
    ? allFoods.filter(food => food.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : foodCategories[selectedCategory as keyof typeof foodCategories]?.filter(food => 
        food.name.toLowerCase().includes(searchQuery.toLowerCase())
      ) || [];

  const handleAddFood = () => {
    if (selectedFood && quantity) {
      const quantityNum = parseFloat(quantity);
      const calories = (selectedFood.calories_per_100g * quantityNum) / 100;
      const protein = (selectedFood.protein * quantityNum) / 100;
      const carbs = (selectedFood.carbs * quantityNum) / 100;
      const fat = (selectedFood.fat * quantityNum) / 100;

      // Add to today's meals
      const newMeal = {
        id: todaysMeals.length + 1,
        meal: 'Snack', // Default to snack, could be made selectable
        food: selectedFood.name,
        calories: Math.round(calories),
        protein: Math.round(protein * 10) / 10,
        carbs: Math.round(carbs * 10) / 10,
        fat: Math.round(fat * 10) / 10,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        recipe: {
          ingredients: [`${quantityNum}g ${selectedFood.name}`],
          steps: ['Consume as per quantity'],
          prepTime: '1 minute'
        }
      };

      setTodaysMeals(prev => [...prev, newMeal]);

      // Update health data context
      incrementCalories(Math.round(calories));
      incrementProtein(Math.round(protein * 10) / 10);
      logMeal();

      toast({
        title: "Food Added! 🎉",
        description: `${selectedFood.name} (${quantity}g) added to your meal plan - ${calories.toFixed(0)} calories`,
        className: "animate-fade-in"
      });

      setSelectedFood(null);
      setQuantity('100');
      setSearchQuery('');
    }
  };

  const getNutrientAdvice = (nutrient: string, current: number, target: number) => {
    const percentage = (current / target) * 100;
    if (percentage < 50) {
      return {
        status: "Low intake - consider adding more nutrient-rich foods",
        color: "text-red-600",
        suggestion: nutrient === 'protein' ? "Add lean meats, eggs, or legumes" : 
                   nutrient === 'carbs' ? "Include whole grains or fruits" : 
                   "Add healthy fats like avocado or nuts"
      };
    } else if (percentage < 80) {
      return {
        status: "Good progress - you're on track",
        color: "text-yellow-600",
        suggestion: "Continue with current eating pattern"
      };
    } else {
      return {
        status: "Excellent - goal nearly reached!",
        color: "text-green-600",
        suggestion: "Maintain this great balance"
      };
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Daily Summary - Moved to Top */}
      <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/40 dark:border-gray-700/40 shadow-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Target className="h-6 w-6" />
            Daily Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl">
              <p className="text-2xl font-bold text-green-600">{currentTotals.calories}</p>
              <p className="text-sm text-muted-foreground">Total Calories</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl">
              <p className="text-2xl font-bold text-blue-600">{currentTotals.protein}g</p>
              <p className="text-sm text-muted-foreground">Protein</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl">
              <p className="text-2xl font-bold text-orange-600">{currentTotals.carbs}g</p>
              <p className="text-sm text-muted-foreground">Carbs</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-xl">
              <p className="text-2xl font-bold text-purple-600">{currentTotals.fat}g</p>
              <p className="text-sm text-muted-foreground">Fat</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Daily Nutrition Overview */}
      <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/40 dark:border-gray-700/40 shadow-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🍎 Daily Nutrition Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Object.entries({
              calories: { current: currentTotals.calories, target: dailyGoals.calories, color: 'green' },
              protein: { current: currentTotals.protein, target: dailyGoals.protein, color: 'blue' },
              carbs: { current: currentTotals.carbs, target: dailyGoals.carbs, color: 'orange' },
              fat: { current: currentTotals.fat, target: dailyGoals.fat, color: 'purple' }
            }).map(([nutrient, data]) => {
              const advice = getNutrientAdvice(nutrient, data.current, data.target);
              return (
                <div 
                  key={nutrient}
                  className={`text-center p-4 bg-gradient-to-br from-${data.color}-50 to-${data.color}-100 dark:from-${data.color}-900/20 dark:to-${data.color}-800/20 rounded-xl border border-${data.color}-200 dark:border-${data.color}-700 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg`}
                  onMouseEnter={() => setHoveredNutrient(nutrient)}
                  onMouseLeave={() => setHoveredNutrient(null)}
                >
                  <div className={`text-3xl font-bold text-${data.color}-600 mb-1`}>
                    {nutrient === 'calories' ? data.current : `${data.current}${nutrient === 'calories' ? '' : 'g'}`}
                  </div>
                  <div className="text-sm text-muted-foreground mb-3">
                    / {data.target}{nutrient === 'calories' ? ' cal' : 'g'} {nutrient}
                  </div>
                  <Progress 
                    value={(data.current / data.target) * 100} 
                    className="h-2 mb-2"
                  />
                  
                  {hoveredNutrient === nutrient && (
                    <div className="animate-fade-in space-y-2 mt-3">
                      <p className={`text-xs font-medium ${advice.color}`}>
                        {advice.status}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {advice.suggestion}
                      </p>
                      <div className="text-xs">
                        <p>Remaining: {data.target - data.current}{nutrient === 'calories' ? ' cal' : 'g'}</p>
                        <p>Progress: {Math.round((data.current / data.target) * 100)}%</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="add-food" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
          <TabsTrigger value="add-food" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white">Add Food</TabsTrigger>
          <TabsTrigger value="meal-log" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-600 data-[state=active]:text-white">Meal Log</TabsTrigger>
        </TabsList>

        <TabsContent value="add-food" className="space-y-4">
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Add Food to Your Day</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Food Categories */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                <Button
                  variant={selectedCategory === 'all' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory('all')}
                  className="min-w-fit"
                >
                  All Foods
                </Button>
                {Object.keys(foodCategories).map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="min-w-fit capitalize"
                  >
                    {category}
                  </Button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    placeholder="Search for food..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-white/50 dark:bg-gray-700/50"
                  />
                </div>
                <Button variant="outline" size="icon" className="hover:bg-blue-100 dark:hover:bg-blue-900/20">
                  <Search className="h-4 w-4" />
                </Button>
                <CameraFoodRecognition />
                <Button variant="outline" size="icon" className="hover:bg-purple-100 dark:hover:bg-purple-900/20">
                  <Mic className="h-4 w-4" />
                </Button>
              </div>

              {/* Food List */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredFoods.map(food => (
                  <div
                    key={food.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all duration-300 hover:shadow-md ${
                      selectedFood?.id === food.id ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-700' : 'hover:bg-gray-50 dark:hover:bg-gray-700/20 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50'
                    }`}
                    onClick={() => setSelectedFood(food)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <p className="font-medium">{food.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {food.calories_per_100g} cal per 100g
                        </p>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">P: {food.protein}g</Badge>
                          <Badge variant="secondary" className="text-xs">C: {food.carbs}g</Badge>
                          <Badge variant="secondary" className="text-xs">F: {food.fat}g</Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3 space-y-2">
                      <div>
                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Vitamins:</p>
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(food.vitamins).map(([vitamin, amount]) => (
                            <Badge key={vitamin} variant="outline" className="text-xs bg-blue-50 dark:bg-blue-900/20">
                              {vitamin}: {amount}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Minerals:</p>
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(food.minerals).map(([mineral, amount]) => (
                            <Badge key={mineral} variant="outline" className="text-xs bg-green-50 dark:bg-green-900/20">
                              {mineral}: {amount}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Food Section */}
              {selectedFood && (
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-700 space-y-3 animate-fade-in">
                  <h4 className="font-medium">Add {selectedFood.name}</h4>
                  <div className="flex gap-2 items-end">
                    <div className="flex-1">
                      <Label htmlFor="quantity">Quantity (grams)</Label>
                      <Input
                        id="quantity"
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        placeholder="100"
                        className="bg-white/50 dark:bg-gray-700/50"
                      />
                    </div>
                    <Button 
                      onClick={handleAddFood} 
                      className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 transform hover:scale-105 transition-all duration-200"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Food
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Food Recommendations */}
          <FoodRecommendations />
        </TabsContent>

        <TabsContent value="meal-log" className="space-y-4">
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Today's Meals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todaysMeals.map((meal) => (
                  <div key={meal.id} className="group p-4 border rounded-lg bg-white/60 dark:bg-gray-800/60 hover:shadow-lg transition-all duration-300 cursor-pointer">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary">{meal.meal}</Badge>
                          <span className="text-sm text-muted-foreground">{meal.time}</span>
                        </div>
                        <p className="font-medium">{meal.food}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">{meal.calories} cal</p>
                      </div>
                    </div>
                    <div className="flex gap-4 text-sm text-muted-foreground mb-3">
                      <span>Protein: {meal.protein}g</span>
                      <span>Carbs: {meal.carbs}g</span>
                      <span>Fat: {meal.fat}g</span>
                    </div>
                    
                    <div className="hidden group-hover:block animate-fade-in bg-gray-50 dark:bg-gray-700 p-3 rounded-lg mt-3">
                      <h5 className="font-medium mb-2">Recipe Details</h5>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm font-medium">Prep Time: {meal.recipe.prepTime}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-1">Ingredients:</p>
                          <ul className="text-sm text-muted-foreground list-disc list-inside">
                            {meal.recipe.ingredients.map((ingredient, idx) => (
                              <li key={idx}>{ingredient}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-1">Steps:</p>
                          <ol className="text-sm text-muted-foreground list-decimal list-inside">
                            {meal.recipe.steps.map((step, idx) => (
                              <li key={idx}>{step}</li>
                            ))}
                          </ol>
                        </div>
                        <Button size="sm" variant="outline" className="mt-2">
                          View Full Recipe
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
