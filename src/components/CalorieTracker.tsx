import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Camera, Mic } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { CameraFoodRecognition } from "./CameraFoodRecognition";

export const CalorieTracker = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFood, setSelectedFood] = useState<any>(null);
  const [quantity, setQuantity] = useState('1');

  const mockFoods = [
    { id: 1, name: 'Banana', calories_per_100g: 89, protein: 1.1, carbs: 22.8, fat: 0.3 },
    { id: 2, name: 'Chicken Breast', calories_per_100g: 165, protein: 31, carbs: 0, fat: 3.6 },
    { id: 3, name: 'Brown Rice', calories_per_100g: 111, protein: 2.6, carbs: 23, fat: 0.9 },
    { id: 4, name: 'Avocado', calories_per_100g: 160, protein: 2, carbs: 8.5, fat: 14.7 },
  ];

  const todaysMeals = [
    { id: 1, meal: 'Breakfast', food: 'Oatmeal with berries', calories: 350, protein: 12, carbs: 65, fat: 8 },
    { id: 2, meal: 'Lunch', food: 'Chicken salad', calories: 450, protein: 35, carbs: 25, fat: 18 },
  ];

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

  const handleAddFood = () => {
    if (selectedFood && quantity) {
      const calories = (selectedFood.calories_per_100g * parseFloat(quantity)) / 100;
      toast({
        title: "Food Added! 🎉",
        description: `${selectedFood.name} (${quantity}g) - ${calories.toFixed(0)} calories`,
        className: "animate-fade-in"
      });
      setSelectedFood(null);
      setQuantity('1');
      setSearchQuery('');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🍎 Daily Nutrition Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-700">
              <div className="text-3xl font-bold text-green-600 mb-1">
                {currentTotals.calories}
              </div>
              <div className="text-sm text-muted-foreground mb-3">
                / {dailyGoals.calories} cal
              </div>
              <Progress 
                value={(currentTotals.calories / dailyGoals.calories) * 100} 
                className="h-2"
              />
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200 dark:border-blue-700">
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {currentTotals.protein}g
              </div>
              <div className="text-sm text-muted-foreground mb-3">
                / {dailyGoals.protein}g protein
              </div>
              <Progress 
                value={(currentTotals.protein / dailyGoals.protein) * 100} 
                className="h-2"
              />
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl border border-orange-200 dark:border-orange-700">
              <div className="text-3xl font-bold text-orange-600 mb-1">
                {currentTotals.carbs}g
              </div>
              <div className="text-sm text-muted-foreground mb-3">
                / {dailyGoals.carbs}g carbs
              </div>
              <Progress 
                value={(currentTotals.carbs / dailyGoals.carbs) * 100} 
                className="h-2"
              />
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-xl border border-purple-200 dark:border-purple-700">
              <div className="text-3xl font-bold text-purple-600 mb-1">
                {currentTotals.fat}g
              </div>
              <div className="text-sm text-muted-foreground mb-3">
                / {dailyGoals.fat}g fat
              </div>
              <Progress 
                value={(currentTotals.fat / dailyGoals.fat) * 100} 
                className="h-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="add-food" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
          <TabsTrigger value="add-food" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white">Add Food</TabsTrigger>
          <TabsTrigger value="meal-log" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-600 data-[state=active]:text-white">Meal Log</TabsTrigger>
        </TabsList>

        <TabsContent value="add-food" className="space-y-4">
          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Add Food to Your Day</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    placeholder="Search for food..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-white/50 dark:bg-slate-700/50"
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

              <div className="space-y-2">
                {mockFoods
                  .filter(food => 
                    food.name.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map(food => (
                    <div
                      key={food.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedFood?.id === food.id ? 'bg-green-50 border-green-200' : 'hover:bg-gray-50 dark:hover:bg-slate-700/20 dark:border-slate-700'
                      }`}
                      onClick={() => setSelectedFood(food)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{food.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {food.calories_per_100g} cal per 100g
                          </p>
                        </div>
                        <div className="text-right text-sm">
                          <p>P: {food.protein}g</p>
                          <p>C: {food.carbs}g</p>
                          <p>F: {food.fat}g</p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

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
                        className="bg-white/50 dark:bg-slate-700/50"
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
        </TabsContent>

        <TabsContent value="meal-log" className="space-y-4">
          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Today's Meals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todaysMeals.map((meal) => (
                  <div key={meal.id} className="p-4 border rounded-lg bg-gradient-to-r from-white/50 to-gray-50/50 dark:from-slate-700/50 dark:to-slate-600/50 hover:shadow-md transition-all duration-200">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <Badge variant="secondary" className="mb-2">
                          {meal.meal}
                        </Badge>
                        <p className="font-medium">{meal.food}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">{meal.calories} cal</p>
                      </div>
                    </div>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span>Protein: {meal.protein}g</span>
                      <span>Carbs: {meal.carbs}g</span>
                      <span>Fat: {meal.fat}g</span>
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
