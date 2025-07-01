
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle, Circle, Zap, Target } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export const DailySummary = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const today = new Date();
  const dayName = today.toLocaleDateString('en-US', { weekday: 'long' });
  const dayDate = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  
  const todaysTasks = {
    meals: [
      { name: 'Greek Yogurt Bowl', time: '8:00 AM', completed: true },
      { name: 'Quinoa Power Salad', time: '1:00 PM', completed: false },
      { name: 'Grilled Salmon', time: '7:00 PM', completed: false }
    ],
    supplements: [
      { name: 'Vitamin D3', time: '9:00 AM', completed: true },
      { name: 'Omega-3', time: '1:00 PM', completed: false },
      { name: 'CoQ10', time: '8:00 PM', completed: false }
    ],
    workouts: [
      { name: 'Upper Body Push', duration: '45 min', completed: false }
    ],
    water: { target: 8, completed: 5 }
  };

  const completionRate = () => {
    const totalTasks = todaysTasks.meals.length + todaysTasks.supplements.length + todaysTasks.workouts.length;
    const completedTasks = [...todaysTasks.meals, ...todaysTasks.supplements, ...todaysTasks.workouts]
      .filter(task => task.completed).length;
    return Math.round((completedTasks / totalTasks) * 100);
  };

  return (
    <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-emerald-200 dark:border-emerald-800">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2 text-emerald-800 dark:text-emerald-200">
              <Calendar className="h-5 w-5" />
              {dayName}, {dayDate}
            </CardTitle>
            <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-1">
              Daily Progress: {completionRate()}% Complete
            </p>
          </div>
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" size="sm" className="border-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-800">
                {isOpen ? 'Hide' : 'Show'} Summary
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
                      🍽️ Meals Today
                    </h4>
                    {todaysTasks.meals.map((meal, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        {meal.completed ? 
                          <CheckCircle className="h-4 w-4 text-green-600" /> : 
                          <Circle className="h-4 w-4 text-gray-400" />
                        }
                        <span className={meal.completed ? 'line-through text-gray-500' : ''}>
                          {meal.name} ({meal.time})
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
                      💊 Supplements
                    </h4>
                    {todaysTasks.supplements.map((supplement, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        {supplement.completed ? 
                          <CheckCircle className="h-4 w-4 text-green-600" /> : 
                          <Circle className="h-4 w-4 text-gray-400" />
                        }
                        <span className={supplement.completed ? 'line-through text-gray-500' : ''}>
                          {supplement.name} ({supplement.time})
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
                      🏋️ Workouts
                    </h4>
                    {todaysTasks.workouts.map((workout, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        {workout.completed ? 
                          <CheckCircle className="h-4 w-4 text-green-600" /> : 
                          <Circle className="h-4 w-4 text-gray-400" />
                        }
                        <span className={workout.completed ? 'line-through text-gray-500' : ''}>
                          {workout.name} ({workout.duration})
                        </span>
                      </div>
                    ))}
                    
                    <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                      <p className="text-xs text-blue-700 dark:text-blue-300">
                        💧 Water: {todaysTasks.water.completed}/{todaysTasks.water.target} glasses
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </CardHeader>
    </Card>
  );
};
