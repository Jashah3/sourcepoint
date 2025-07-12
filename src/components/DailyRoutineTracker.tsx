import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Clock, Droplets, Dumbbell, Book, Utensils, Moon, Sun } from "lucide-react";

interface RoutineItem {
  id: string;
  time: string;
  title: string;
  description: string;
  category: 'detox' | 'supplements' | 'movement' | 'study' | 'meal' | 'workout' | 'recovery';
  duration?: string;
  calories?: number;
  protein?: string;
  completed: boolean;
}

const routineData: Record<string, RoutineItem[]> = {
  monday: [
    {
      id: 'detox-1',
      time: '6:30 AM',
      title: 'Lemon-Ginger-Turmeric Detox Drink',
      description: '1 cup warm water, 1/2 lemon juice, 1 tsp ginger, 1/2 tsp turmeric, pinch black pepper, 1 tsp honey',
      category: 'detox',
      completed: false
    },
    {
      id: 'ice-1',
      time: '7:05 AM',
      title: 'Ice Therapy + Wim Hof Breathing',
      description: 'Cold shower/ice bath for 2-3 minutes, 3 rounds Wim Hof breathing',
      category: 'recovery',
      duration: '3 mins',
      completed: false
    },
    {
      id: 'supplements-1',
      time: '7:15 AM',
      title: 'Morning Supplement Stack',
      description: 'CoQ10 (100-200mg), Vitamin D3+K2, Shilajit, L-Tyrosine, B12, Biotin, Silica, Astaxanthin',
      category: 'supplements',
      completed: false
    },
    {
      id: 'movement-1',
      time: '7:30 AM',
      title: 'Morning Movement Routine',
      description: 'Yoga Flow (15min), Core Activation (10min), Kegels (5min)',
      category: 'movement',
      duration: '35 mins',
      completed: false
    },
    {
      id: 'breakfast-1',
      time: '8:15 AM',
      title: 'Enhanced Breakfast with Dry Fruits & Seeds',
      description: 'Power Oats Bowl with protein, dry fruits mix, healthy seeds, vitamin C boost',
      category: 'meal',
      calories: 650,
      protein: '35g',
      completed: false
    },
    {
      id: 'study-1',
      time: '9:00 AM',
      title: 'Deep Work Session 1',
      description: 'High-focus tasks (math, technical subjects) - L-Tyrosine peak',
      category: 'study',
      duration: '90 mins',
      completed: false
    },
    {
      id: 'study-break-1',
      time: '10:30 AM',
      title: 'Study Break',
      description: '10-minute walk + hydration + light stretching',
      category: 'recovery',
      duration: '10 mins',
      completed: false
    },
    {
      id: 'study-2',
      time: '11:00 AM',
      title: 'Study Session 2',
      description: 'Continue focused work',
      category: 'study',
      duration: '90 mins',
      completed: false
    },
    {
      id: 'lunch-1',
      time: '12:30 PM',
      title: 'Nutritionally Complete Lunch',
      description: 'High-Protein Rajma Bowl, Spinach-Paneer Sabzi, Quinoa Tabbouleh, Greek Yogurt Raita',
      category: 'meal',
      calories: 750,
      protein: '42g',
      completed: false
    },
    {
      id: 'supplements-2',
      time: '1:00 PM',
      title: 'Midday Supplements',
      description: 'Alpha Lipoic Acid, Iron with Vitamin C, Vitamin B-Complex',
      category: 'supplements',
      completed: false
    },
    {
      id: 'walk-1',
      time: '1:15 PM',
      title: 'Post-Lunch Walk',
      description: '15-minute easy walk for digestion',
      category: 'recovery',
      duration: '15 mins',
      completed: false
    },
    {
      id: 'study-3',
      time: '2:00 PM',
      title: 'Study Session 3',
      description: 'Review/lighter subjects',
      category: 'study',
      duration: '90 mins',
      completed: false
    },
    {
      id: 'snack-1',
      time: '3:30 PM',
      title: 'Balanced Snack Break',
      description: 'Protein Energy Mix: buttermilk + chia seeds, fig + almond butter, spirulina powder',
      category: 'meal',
      calories: 280,
      protein: '12g',
      completed: false
    },
    {
      id: 'study-4',
      time: '4:00 PM',
      title: 'Study Session 4',
      description: 'Final study block of the day',
      category: 'study',
      duration: '90 mins',
      completed: false
    },
    {
      id: 'workout-1',
      time: '6:15 PM',
      title: 'PUSH DAY WORKOUT',
      description: 'Incline Push-ups, DB Chest Press, Overhead Press, Lateral Raises, Triceps Dips',
      category: 'workout',
      duration: '60 mins',
      completed: false
    },
    {
      id: 'protein-1',
      time: '7:15 PM',
      title: 'Post-Workout Plant Protein Shake',
      description: 'Plant protein powder, almond milk, banana, chia seeds, almond butter, creatine',
      category: 'meal',
      calories: 420,
      protein: '30g',
      completed: false
    },
    {
      id: 'dinner-1',
      time: '7:30 PM',
      title: 'Complete Nutritional Dinner',
      description: 'Tofu Stir-Fry, Lentil-Stuffed Roti, Sprout Salad, Roasted Edamame',
      category: 'meal',
      calories: 680,
      protein: '38g',
      completed: false
    },
    {
      id: 'supplements-3',
      time: '8:00 PM',
      title: 'Evening Supplements',
      description: 'Omega-3, Curcumin + Black Pepper, Vitamin E',
      category: 'supplements',
      completed: false
    },
    {
      id: 'night-supplements',
      time: '10:00 PM',
      title: 'Night Supplement Stack',
      description: 'Ashwagandha, Zinc, Magnesium Glycinate, Casein Protein, Inositol, Glycine',
      category: 'supplements',
      completed: false
    }
  ]
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'detox': return <Droplets className="h-4 w-4" />;
    case 'supplements': return <div className="h-4 w-4 rounded-full bg-primary" />;
    case 'movement': case 'workout': return <Dumbbell className="h-4 w-4" />;
    case 'study': return <Book className="h-4 w-4" />;
    case 'meal': return <Utensils className="h-4 w-4" />;
    case 'recovery': return <Moon className="h-4 w-4" />;
    default: return <Sun className="h-4 w-4" />;
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'detox': return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300';
    case 'supplements': return 'bg-purple-500/10 text-purple-700 dark:text-purple-300';
    case 'movement': case 'workout': return 'bg-orange-500/10 text-orange-700 dark:text-orange-300';
    case 'study': return 'bg-blue-500/10 text-blue-700 dark:text-blue-300';
    case 'meal': return 'bg-green-500/10 text-green-700 dark:text-green-300';
    case 'recovery': return 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300';
    default: return 'bg-gray-500/10 text-gray-700 dark:text-gray-300';
  }
};

export const DailyRoutineTracker = () => {
  const [routineState, setRoutineState] = useState(routineData);
  const [selectedDay, setSelectedDay] = useState('monday');

  const toggleItemCompletion = (day: string, itemId: string) => {
    setRoutineState(prev => ({
      ...prev,
      [day]: prev[day].map(item => 
        item.id === itemId ? { ...item, completed: !item.completed } : item
      )
    }));
  };

  const currentDayData = routineState[selectedDay] || [];
  const completedItems = currentDayData.filter(item => item.completed).length;
  const totalItems = currentDayData.length;
  const completionPercentage = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

  const getDaysOfWeek = () => [
    { key: 'monday', label: 'Monday', description: 'Push Day + Test Boost' },
    { key: 'tuesday', label: 'Tuesday', description: 'Pull Day + Boxing' },
    { key: 'wednesday', label: 'Wednesday', description: 'Legs + Core + Recovery' },
    { key: 'thursday', label: 'Thursday', description: 'Active Recovery + Mobility' },
    { key: 'friday', label: 'Friday', description: 'Arms + Boxing Power' },
    { key: 'saturday', label: 'Saturday', description: 'Full Boxing + HIIT' },
    { key: 'sunday', label: 'Sunday', description: 'Recovery + Reset' }
  ];

  return (
    <Card className="w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-white/30 dark:border-gray-700/30 shadow-xl">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-emerald-700 via-teal-800 to-emerald-900 dark:from-emerald-200 dark:via-teal-300 dark:to-emerald-100 bg-clip-text text-transparent">
            Daily Routine Tracker
          </CardTitle>
          <Badge variant="outline" className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-0">
            <Clock className="h-3 w-3 mr-1" />
            {completedItems}/{totalItems} Complete
          </Badge>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Daily Progress</span>
            <span>{Math.round(completionPercentage)}%</span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={selectedDay} onValueChange={setSelectedDay} className="w-full">
          <TabsList className="grid w-full grid-cols-7 mb-6 bg-white/30 dark:bg-gray-800/30 backdrop-blur-md">
            {getDaysOfWeek().map((day) => (
              <TabsTrigger 
                key={day.key}
                value={day.key} 
                className="text-xs data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-teal-600 data-[state=active]:text-white"
              >
                {day.label.slice(0, 3)}
              </TabsTrigger>
            ))}
          </TabsList>

          {getDaysOfWeek().map((day) => (
            <TabsContent key={day.key} value={day.key} className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-foreground">{day.label}</h3>
                <p className="text-sm text-muted-foreground">{day.description}</p>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {currentDayData.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 rounded-xl border transition-all duration-300 ${
                      item.completed 
                        ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-700' 
                        : 'bg-background border-border hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        checked={item.completed}
                        onCheckedChange={() => toggleItemCompletion(selectedDay, item.id)}
                        className="mt-1"
                      />
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className={getCategoryColor(item.category)}>
                              {getCategoryIcon(item.category)}
                              <span className="ml-1 text-xs">{item.category}</span>
                            </Badge>
                            <span className="text-sm font-medium text-primary">{item.time}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                            {item.duration && (
                              <Badge variant="secondary" className="text-xs">
                                <Clock className="h-3 w-3 mr-1" />
                                {item.duration}
                              </Badge>
                            )}
                            {item.calories && (
                              <Badge variant="secondary" className="text-xs">
                                🔥 {item.calories} cal
                              </Badge>
                            )}
                            {item.protein && (
                              <Badge variant="secondary" className="text-xs">
                                💪 {item.protein}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className={`font-medium ${item.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                            {item.title}
                          </h4>
                          <p className={`text-sm mt-1 ${item.completed ? 'line-through text-muted-foreground' : 'text-muted-foreground'}`}>
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};