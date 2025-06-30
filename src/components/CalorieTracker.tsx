
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
        title: "Food Added!",
        description: `${selectedFood.name} (${quantity}g) - ${calories.toFixed(0)} calories`,
      });
      setSelectedFood(null);
      setQuantity('1');
      setSearchQuery('');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🍎 Daily Nutrition Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {currentTotals.calories}
              </div>
              <div className="text-sm text-muted-foreground">
                / {dailyGoals.calories} cal
              </div>
              <Progress 
                value={(currentTotals.calories / dailyGoals.calories) * 100} 
                className="mt-2"
              />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {currentTotals.protein}g
              </div>
              <div className="text-sm text-muted-foreground">
                / {dailyGoals.protein}g protein
              </div>
              <Progress 
                value={(currentTotals.protein / dailyGoals.protein) * 100} 
                className="mt-2"
              />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {currentTotals.carbs}g
              </div>
              <div className="text-sm text-muted-foreground">
                / {dailyGoals.carbs}g carbs
              </div>
              <Progress 
                value={(currentTotals.carbs / dailyGoals.carbs) * 100} 
                className="mt-2"
              />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {currentTotals.fat}g
              </div>
              <div className="text-sm text-muted-foreground">
                / {dailyGoals.fat}g fat
              </div>
              <Progress 
                value={(currentTotals.fat / dailyGoals.fat) * 100} 
                className="mt-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="add-food" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="add-food">Add Food</TabsTrigger>
          <TabsTrigger value="meal-log">Meal Log</TabsTrigger>
        </TabsList>

        <TabsContent value="add-food" className="space-y-4">
          <Card>
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
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Search className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Camera className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
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
                        selectedFood?.id === food.id ? 'bg-green-50 border-green-200' : 'hover:bg-gray-50'
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
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg space-y-3">
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
                      />
                    </div>
                    <Button onClick={handleAddFood} className="bg-green-600 hover:bg-green-700">
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
          <Card>
            <CardHeader>
              <CardTitle>Today's Meals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todaysMeals.map((meal) => (
                  <div key={meal.id} className="p-4 border rounded-lg">
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
