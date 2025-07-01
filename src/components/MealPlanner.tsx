
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, ShoppingCart, ChefHat, Clock, Info } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export const MealPlanner = () => {
  const [selectedDay, setSelectedDay] = useState(0);
  const [expandedMeal, setExpandedMeal] = useState<string | null>(null);
  
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  const weeklyMealPlan = {
    monday: {
      breakfast: { 
        name: 'Greek Yogurt Berry Bowl', 
        calories: 300, 
        prep_time: 5,
        protein: '20g',
        vitamins: 'C, K, Folate',
        recipe: 'Mix 1 cup Greek yogurt with mixed berries, honey, and granola. Add chia seeds for extra nutrition.',
        ingredients: ['Greek yogurt', 'Mixed berries', 'Honey', 'Granola', 'Chia seeds']
      },
      lunch: { 
        name: 'Quinoa Buddha Bowl', 
        calories: 550, 
        prep_time: 15,
        protein: '18g',
        vitamins: 'A, C, Iron',
        recipe: 'Cook quinoa, roast vegetables (sweet potato, broccoli), add chickpeas and tahini dressing.',
        ingredients: ['Quinoa', 'Sweet potato', 'Broccoli', 'Chickpeas', 'Tahini']
      },
      dinner: { 
        name: 'Grilled Salmon with Asparagus', 
        calories: 650, 
        prep_time: 25,
        protein: '35g',
        vitamins: 'D, B12, Omega-3',
        recipe: 'Season salmon with herbs, grill for 6-8 minutes. Steam asparagus and serve with lemon.',
        ingredients: ['Salmon fillet', 'Asparagus', 'Lemon', 'Herbs', 'Olive oil']
      },
      snack: { 
        name: 'Almond Apple Slices', 
        calories: 200, 
        prep_time: 2,
        protein: '6g',
        vitamins: 'C, E',
        recipe: 'Slice apple and serve with almond butter.',
        ingredients: ['Apple', 'Almond butter']
      }
    },
    tuesday: {
      breakfast: { 
        name: 'Avocado Toast with Eggs', 
        calories: 380, 
        prep_time: 8,
        protein: '15g',
        vitamins: 'K, Folate, B12',
        recipe: 'Toast whole wheat bread, mash avocado with lime, top with poached egg.',
        ingredients: ['Whole wheat bread', 'Avocado', 'Eggs', 'Lime', 'Salt']
      },
      lunch: { 
        name: 'Mediterranean Chicken Wrap', 
        calories: 480, 
        prep_time: 12,
        protein: '28g',
        vitamins: 'A, C, Iron',
        recipe: 'Grill chicken, add to wrap with hummus, cucumber, tomatoes, and feta.',
        ingredients: ['Chicken breast', 'Tortilla', 'Hummus', 'Cucumber', 'Feta']
      },
      dinner: { 
        name: 'Beef Stir-fry with Brown Rice', 
        calories: 720, 
        prep_time: 20,
        protein: '32g',
        vitamins: 'Iron, B6, C',
        recipe: 'Stir-fry lean beef with mixed vegetables, serve over brown rice with soy-ginger sauce.',
        ingredients: ['Lean beef', 'Mixed vegetables', 'Brown rice', 'Soy sauce', 'Ginger']
      },
      snack: { 
        name: 'Protein Smoothie', 
        calories: 250, 
        prep_time: 3,
        protein: '25g',
        vitamins: 'C, B vitamins',
        recipe: 'Blend protein powder, banana, spinach, and almond milk.',
        ingredients: ['Protein powder', 'Banana', 'Spinach', 'Almond milk']
      }
    },
    wednesday: {
      breakfast: { 
        name: 'Overnight Oats with Berries', 
        calories: 320, 
        prep_time: 5,
        protein: '12g',
        vitamins: 'B1, Magnesium, C',
        recipe: 'Mix oats with milk, chia seeds, and berries. Refrigerate overnight.',
        ingredients: ['Rolled oats', 'Milk', 'Chia seeds', 'Berries', 'Honey']
      },
      lunch: { 
        name: 'Lentil Vegetable Soup', 
        calories: 420, 
        prep_time: 25,
        protein: '20g',
        vitamins: 'Iron, Folate, A',
        recipe: 'Simmer lentils with vegetables, herbs, and vegetable broth.',
        ingredients: ['Red lentils', 'Carrots', 'Celery', 'Onion', 'Vegetable broth']
      },
      dinner: { 
        name: 'Baked Cod with Sweet Potato', 
        calories: 580, 
        prep_time: 30,
        protein: '30g',
        vitamins: 'A, D, B6',
        recipe: 'Bake cod with herbs, roast sweet potato wedges with rosemary.',
        ingredients: ['Cod fillet', 'Sweet potato', 'Rosemary', 'Lemon', 'Olive oil']
      },
      snack: { 
        name: 'Greek Yogurt with Nuts', 
        calories: 180, 
        prep_time: 1,
        protein: '15g',
        vitamins: 'E, Magnesium',
        recipe: 'Top Greek yogurt with mixed nuts and a drizzle of honey.',
        ingredients: ['Greek yogurt', 'Mixed nuts', 'Honey']
      }
    }
  };

  const currentDayMeals = selectedDay === 0 ? weeklyMealPlan.monday : 
                         selectedDay === 1 ? weeklyMealPlan.tuesday : 
                         weeklyMealPlan.wednesday;

  const prepSchedule = {
    sunday: [
      { time: '9:00 AM', task: 'Cook quinoa and brown rice in bulk (45 min)', dishes: ['Buddha Bowl', 'Stir-fry'] },
      { time: '9:45 AM', task: 'Prep overnight oats for 3 days', dishes: ['Wednesday breakfast'] },
      { time: '10:15 AM', task: 'Wash and chop all vegetables', dishes: ['All meals'] },
      { time: '11:00 AM', task: 'Marinate chicken and beef', dishes: ['Tuesday lunch & dinner'] },
      { time: '11:30 AM', task: 'Cook lentil soup base', dishes: ['Wednesday lunch'] },
      { time: '12:00 PM', task: 'Portion and store proteins', dishes: ['All week'] }
    ]
  };

  const dailyGroceries = {
    monday: {
      items: ['Greek yogurt', 'Mixed berries', 'Salmon fillet', 'Asparagus'],
      prep: 'Buy fresh salmon day-of for best quality',
      advance: 'Prepare quinoa and roast vegetables night before'
    },
    tuesday: {
      items: ['Avocado', 'Eggs', 'Chicken breast', 'Lean beef', 'Tortilla'],
      prep: 'Check avocado ripeness, buy 2 days prior',
      advance: 'Marinate chicken and beef on Monday evening'
    },
    wednesday: {
      items: ['Cod fillet', 'Sweet potato', 'Red lentils', 'Fresh herbs'],
      prep: 'Buy fish day-of, sweet potatoes can be bought in advance',
      advance: 'Prepare lentil soup base on Tuesday evening'
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="weekly-plan" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="weekly-plan">Weekly Plan</TabsTrigger>
          <TabsTrigger value="meal-prep">Meal Prep</TabsTrigger>
          <TabsTrigger value="grocery-list">Grocery List</TabsTrigger>
        </TabsList>

        <TabsContent value="weekly-plan" className="space-y-4">
          <Card className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20">
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
                {Object.entries(currentDayMeals).map(([mealType, meal]) => (
                  <div key={mealType} className="group">
                    <Collapsible 
                      open={expandedMeal === `${selectedDay}-${mealType}`}
                      onOpenChange={(open) => setExpandedMeal(open ? `${selectedDay}-${mealType}` : null)}
                    >
                      <CollapsibleTrigger asChild>
                        <div className="p-4 border rounded-lg cursor-pointer hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 dark:hover:from-green-900/20 dark:hover:to-emerald-900/20 transition-all duration-200">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <Badge variant="secondary" className="mb-2 capitalize">
                                {mealType}
                              </Badge>
                              <h4 className="font-medium">{meal.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                <Clock className="inline h-3 w-3 mr-1" />
                                Prep time: {meal.prep_time} min
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-green-600">{meal.calories} cal</p>
                              <div className="flex gap-1 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {meal.protein} protein
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="px-4 pb-4">
                        <div className="mt-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h5 className="font-medium mb-2 text-blue-800 dark:text-blue-200">🧬 Nutrition</h5>
                              <p className="text-sm mb-1"><strong>Protein:</strong> {meal.protein}</p>
                              <p className="text-sm"><strong>Key Vitamins:</strong> {meal.vitamins}</p>
                            </div>
                            <div>
                              <h5 className="font-medium mb-2 text-blue-800 dark:text-blue-200">🥘 Recipe</h5>
                              <p className="text-sm">{meal.recipe}</p>
                            </div>
                          </div>
                          <div className="mt-3">
                            <h5 className="font-medium mb-2 text-blue-800 dark:text-blue-200">🛒 Ingredients</h5>
                            <div className="flex flex-wrap gap-1">
                              {meal.ingredients.map((ingredient, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {ingredient}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-lg">
                <h4 className="font-medium mb-2">Daily Summary</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Total Calories</p>
                    <p className="font-bold">{Object.values(currentDayMeals).reduce((acc, meal) => acc + meal.calories, 0)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Prep Time</p>
                    <p className="font-bold">{Object.values(currentDayMeals).reduce((acc, meal) => acc + meal.prep_time, 0)} min</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total Protein</p>
                    <p className="font-bold">~95g</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Key Focus</p>
                    <p className="font-bold">Balanced</p>
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
                Advanced Meal Prep Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
                  <h4 className="font-medium mb-3">📅 Sunday Prep Day Schedule</h4>
                  <div className="space-y-3">
                    {prepSchedule.sunday.map((step, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                        <Badge variant="outline" className="min-w-fit">
                          {step.time}
                        </Badge>
                        <div className="flex-1">
                          <p className="font-medium">{step.task}</p>
                          <p className="text-sm text-muted-foreground">
                            For: {step.dishes.join(', ')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 border rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                    <h5 className="font-medium mb-3">🥘 Batch Cooking Tips</h5>
                    <ul className="space-y-2 text-sm">
                      <li>• Cook grains in large batches (quinoa, rice)</li>
                      <li>• Pre-cut vegetables for 3-4 days max</li>
                      <li>• Marinate proteins 24 hours ahead</li>
                      <li>• Prepare sauces and dressings separately</li>
                    </ul>
                  </div>
                  <div className="p-4 border rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
                    <h5 className="font-medium mb-3">❄️ Storage Guidelines</h5>
                    <ul className="space-y-2 text-sm">
                      <li>• Cooked proteins: 3-4 days refrigerated</li>
                      <li>• Prepared vegetables: 2-3 days maximum</li>
                      <li>• Cooked grains: 4-5 days sealed container</li>
                      <li>• Fresh herbs: wrap in damp paper towel</li>
                    </ul>
                  </div>
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
                Daily Grocery Planning
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(dailyGroceries).map(([day, groceryPlan]) => (
                  <div key={day} className="p-4 border rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20">
                    <h4 className="font-medium text-lg mb-3 capitalize flex items-center gap-2">
                      📅 {day}
                      <Badge variant="secondary">{groceryPlan.items.length} items</Badge>
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h5 className="font-medium mb-2 text-green-700 dark:text-green-300">🛒 Shopping List</h5>
                        <div className="space-y-1">
                          {groceryPlan.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <input type="checkbox" className="rounded" />
                              <span className="text-sm">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="font-medium mb-2 text-blue-700 dark:text-blue-300">⏰ Prep Instructions</h5>
                        <p className="text-sm text-blue-600 dark:text-blue-400">
                          {groceryPlan.prep}
                        </p>
                      </div>
                      
                      <div>
                        <h5 className="font-medium mb-2 text-purple-700 dark:text-purple-300">🎯 Advance Prep</h5>
                        <p className="text-sm text-purple-600 dark:text-purple-400">
                          {groceryPlan.advance}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg">
                  <h5 className="font-medium mb-2">💡 Smart Shopping Tips</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <ul className="space-y-1">
                      <li>• Buy proteins 1-2 days before cooking</li>
                      <li>• Purchase vegetables 2-3 days in advance</li>
                      <li>• Stock up on pantry items weekly</li>
                    </ul>
                    <ul className="space-y-1">
                      <li>• Shop early morning for best selection</li>
                      <li>• Check expiration dates carefully</li>
                      <li>• Bring insulated bags for frozen items</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
