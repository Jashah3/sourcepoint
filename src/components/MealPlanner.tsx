
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, ShoppingCart, ChefHat } from "lucide-react";

export const MealPlanner = () => {
  const [selectedDay, setSelectedDay] = useState(0);
  
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  const mealPlan = {
    monday: {
      breakfast: { name: 'Greek Yogurt with Berries', calories: 300, prep_time: 5 },
      lunch: { name: 'Quinoa Buddha Bowl', calories: 550, prep_time: 15 },
      dinner: { name: 'Grilled Salmon with Vegetables', calories: 650, prep_time: 25 },
      snack: { name: 'Almonds & Apple', calories: 200, prep_time: 0 }
    },
    tuesday: {
      breakfast: { name: 'Oatmeal with Banana', calories: 350, prep_time: 10 },
      lunch: { name: 'Chicken Caesar Salad', calories: 450, prep_time: 15 },
      dinner: { name: 'Turkey Meatballs with Pasta', calories: 700, prep_time: 30 },
      snack: { name: 'Protein Smoothie', calories: 250, prep_time: 5 }
    }
  };

  const groceryList = [
    { category: 'Proteins', items: ['Salmon fillets', 'Chicken breast', 'Greek yogurt', 'Eggs'] },
    { category: 'Carbs', items: ['Quinoa', 'Brown rice', 'Oats', 'Sweet potatoes'] },
    { category: 'Vegetables', items: ['Broccoli', 'Spinach', 'Bell peppers', 'Carrots'] },
    { category: 'Fruits', items: ['Berries', 'Bananas', 'Apples', 'Oranges'] },
    { category: 'Others', items: ['Olive oil', 'Almonds', 'Herbs & spices'] }
  ];

  return (
    <div className="space-y-6">
      <Tabs defaultValue="weekly-plan" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="weekly-plan">Weekly Plan</TabsTrigger>
          <TabsTrigger value="meal-prep">Meal Prep</TabsTrigger>
          <TabsTrigger value="grocery-list">Grocery List</TabsTrigger>
        </TabsList>

        <TabsContent value="weekly-plan" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Weekly Meal Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-6 overflow-x-auto">
                {weekDays.map((day, index) => (
                  <Button
                    key={day}
                    variant={selectedDay === index ? "default" : "outline"}
                    onClick={() => setSelectedDay(index)}
                    className="min-w-16"
                  >
                    {day}
                  </Button>
                ))}
              </div>

              <div className="space-y-4">
                {Object.entries(mealPlan.monday).map(([mealType, meal]) => (
                  <div key={mealType} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <Badge variant="secondary" className="mb-2 capitalize">
                          {mealType}
                        </Badge>
                        <h4 className="font-medium">{meal.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Prep time: {meal.prep_time} min
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">{meal.calories} cal</p>
                        <Button variant="outline" size="sm" className="mt-2">
                          View Recipe
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h4 className="font-medium mb-2">Daily Summary</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Total Calories</p>
                    <p className="font-bold">1,750</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Prep Time</p>
                    <p className="font-bold">55 min</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Protein</p>
                    <p className="font-bold">145g</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Fiber</p>
                    <p className="font-bold">32g</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="meal-prep" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChefHat className="h-5 w-5" />
                Sunday Meal Prep Guide
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="font-medium mb-2">Prep Schedule (2.5 hours total)</h4>
                  <div className="space-y-2 text-sm">
                    <p>• 9:00 AM - Start quinoa and brown rice (45 min)</p>
                    <p>• 9:15 AM - Prep vegetables and proteins (30 min)</p>
                    <p>• 10:00 AM - Cook proteins (salmon, chicken) (45 min)</p>
                    <p>• 10:45 AM - Prepare mason jar salads (30 min)</p>
                    <p>• 11:15 AM - Portion and store meals (20 min)</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h5 className="font-medium mb-3">Proteins to Cook</h5>
                    <ul className="space-y-2 text-sm">
                      <li>• 4 salmon fillets (season & bake)</li>
                      <li>• 2 lbs chicken breast (grill & slice)</li>
                      <li>• Hard boil 12 eggs</li>
                    </ul>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h5 className="font-medium mb-3">Vegetables to Prep</h5>
                    <ul className="space-y-2 text-sm">
                      <li>• Wash and chop broccoli, peppers</li>
                      <li>• Roast sweet potatoes</li>
                      <li>• Prepare salad greens</li>
                    </ul>
                  </div>
                </div>

                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <h5 className="font-medium mb-2">Storage Tips</h5>
                  <ul className="space-y-1 text-sm">
                    <li>• Store proteins in glass containers (3-4 days)</li>
                    <li>• Keep dressings separate until ready to eat</li>
                    <li>• Freeze half the portions for week 2</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="grocery-list" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Smart Grocery List
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {groceryList.map((category) => (
                  <div key={category.category} className="space-y-3">
                    <h4 className="font-medium text-lg border-b pb-2">
                      {category.category}
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {category.items.map((item) => (
                        <div key={item} className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <h5 className="font-medium mb-2">Shopping Tips</h5>
                  <ul className="space-y-1 text-sm">
                    <li>• Estimated total cost: $85-95</li>
                    <li>• Shop for proteins first, then frozen items last</li>
                    <li>• Buy seasonal vegetables for better prices</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
