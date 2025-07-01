
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Timer, Award, Activity, TrendingUp, Flame, Zap } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export const WorkoutTracker = () => {
  const [activeWorkout, setActiveWorkout] = useState<any>(null);
  const [expandedStat, setExpandedStat] = useState<string | null>(null);
  
  const workoutPlans = [
    {
      id: 1,
      name: 'Upper Body Push',
      duration: 45,
      difficulty: 'Intermediate',
      targetMuscles: ['Chest', 'Shoulders', 'Triceps'],
      exercises: [
        { name: 'Push-ups', sets: 3, reps: '12-15', rest: 60, primaryMuscle: 'Chest' },
        { name: 'Shoulder Press', sets: 3, reps: '10-12', rest: 60, primaryMuscle: 'Shoulders' },
        { name: 'Dips', sets: 3, reps: '8-10', rest: 90, primaryMuscle: 'Triceps' },
        { name: 'Incline Push-ups', sets: 3, reps: '12-15', rest: 45, primaryMuscle: 'Upper Chest' }
      ]
    },
    {
      id: 2,
      name: 'Upper Body Pull',
      duration: 40,
      difficulty: 'Intermediate',
      targetMuscles: ['Back', 'Biceps', 'Rear Delts'],
      exercises: [
        { name: 'Pull-ups', sets: 3, reps: '6-10', rest: 90, primaryMuscle: 'Lats' },
        { name: 'Bent-over Rows', sets: 3, reps: '10-12', rest: 60, primaryMuscle: 'Mid Back' },
        { name: 'Bicep Curls', sets: 3, reps: '12-15', rest: 45, primaryMuscle: 'Biceps' },
        { name: 'Face Pulls', sets: 3, reps: '15-20', rest: 45, primaryMuscle: 'Rear Delts' }
      ]
    },
    {
      id: 3,
      name: 'Lower Body Power',
      duration: 50,
      difficulty: 'Advanced',
      targetMuscles: ['Quads', 'Glutes', 'Hamstrings', 'Calves'],
      exercises: [
        { name: 'Squats', sets: 4, reps: '10-12', rest: 90, primaryMuscle: 'Quads' },
        { name: 'Deadlifts', sets: 4, reps: '8-10', rest: 120, primaryMuscle: 'Hamstrings' },
        { name: 'Walking Lunges', sets: 3, reps: '20 total', rest: 60, primaryMuscle: 'Glutes' },
        { name: 'Calf Raises', sets: 3, reps: '15-20', rest: 45, primaryMuscle: 'Calves' }
      ]
    },
    {
      id: 4,
      name: 'HIIT Cardio Blast',
      duration: 25,
      difficulty: 'High',
      targetMuscles: ['Full Body', 'Cardiovascular'],
      exercises: [
        { name: 'Burpees', sets: 4, reps: '30s on/30s off', rest: 60, primaryMuscle: 'Full Body' },
        { name: 'Mountain Climbers', sets: 4, reps: '30s on/30s off', rest: 60, primaryMuscle: 'Core' },
        { name: 'Jump Squats', sets: 4, reps: '30s on/30s off', rest: 60, primaryMuscle: 'Legs' },
        { name: 'High Knees', sets: 4, reps: '30s on/30s off', rest: 60, primaryMuscle: 'Cardio' }
      ]
    },
    {
      id: 5,
      name: 'Core & Stability',
      duration: 30,
      difficulty: 'Beginner',
      targetMuscles: ['Abs', 'Core', 'Lower Back'],
      exercises: [
        { name: 'Plank', sets: 3, reps: '30-60s hold', rest: 45, primaryMuscle: 'Core' },
        { name: 'Russian Twists', sets: 3, reps: '20 each side', rest: 45, primaryMuscle: 'Obliques' },
        { name: 'Dead Bug', sets: 3, reps: '10 each side', rest: 45, primaryMuscle: 'Deep Core' },
        { name: 'Bird Dog', sets: 3, reps: '10 each side', rest: 45, primaryMuscle: 'Lower Back' }
      ]
    },
    {
      id: 6,
      name: 'Kegel Exercises',
      duration: 15,
      difficulty: 'Beginner',
      targetMuscles: ['Pelvic Floor'],
      exercises: [
        { name: 'Basic Kegels', sets: 3, reps: '10 contractions', rest: 30, primaryMuscle: 'Pelvic Floor' },
        { name: 'Long Hold Kegels', sets: 2, reps: '10s holds x 5', rest: 60, primaryMuscle: 'Pelvic Floor' },
        { name: 'Quick Pulse Kegels', sets: 3, reps: '10 quick pulses', rest: 30, primaryMuscle: 'Pelvic Floor' }
      ]
    }
  ];

  const weeklyStats = {
    workoutsCompleted: 4,
    totalMinutes: 180,
    caloriesBurned: 850,
    streak: 7,
    completedWorkouts: [
      { name: 'Upper Body Push', date: 'Today', bodyParts: ['Chest', 'Shoulders'], intensity: 'High' },
      { name: 'Lower Body Power', date: 'Yesterday', bodyParts: ['Legs', 'Glutes'], intensity: 'Very High' },
      { name: 'HIIT Cardio', date: '2 days ago', bodyParts: ['Full Body'], intensity: 'Extreme' },
      { name: 'Core & Stability', date: '3 days ago', bodyParts: ['Core'], intensity: 'Moderate' }
    ],
    remainingWorkouts: ['Upper Body Pull', 'Kegel Exercises'],
    motivationalMessages: [
      "🔥 You're on fire! 4 workouts this week!",
      "💪 Your consistency is paying off!",
      "🎯 Just 2 more workouts to hit your weekly goal!",
      "⚡ Your streak is building momentum!"
    ],
    calorieMotivation: [
      "🎉 850 calories burned = 3.5 donuts avoided!",
      "🏃‍♂️ That's like running 8.5 miles!",
      "💥 You've earned that post-workout meal!",
      "🌟 Your metabolism is thanking you!"
    ]
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Collapsible open={expandedStat === 'workouts'} onOpenChange={(open) => setExpandedStat(open ? 'workouts' : null)}>
          <CollapsibleTrigger asChild>
            <Card className="cursor-pointer hover:shadow-md transition-all duration-200 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 flex items-center justify-center gap-2">
                    <Activity className="h-6 w-6" />
                    {weeklyStats.workoutsCompleted}
                  </div>
                  <p className="text-sm text-muted-foreground">Workouts This Week</p>
                </div>
              </CardContent>
            </Card>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <Card className="mt-2 bg-green-50 dark:bg-green-900/20">
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <h4 className="font-medium text-green-800 dark:text-green-200">✅ Completed Workouts</h4>
                  {weeklyStats.completedWorkouts.map((workout, index) => (
                    <div key={index} className="flex justify-between items-center text-sm p-2 bg-white/50 dark:bg-gray-800/50 rounded">
                      <div>
                        <p className="font-medium">{workout.name}</p>
                        <p className="text-xs text-muted-foreground">{workout.bodyParts.join(', ')}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={workout.intensity === 'Extreme' ? 'destructive' : 'secondary'}>
                          {workout.intensity}
                        </Badge>
                        <p className="text-xs text-muted-foreground">{workout.date}</p>
                      </div>
                    </div>
                  ))}
                  <div className="mt-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                    <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">🎯 Remaining:</p>
                    <p className="text-xs text-yellow-600 dark:text-yellow-400">
                      {weeklyStats.remainingWorkouts.join(', ')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible open={expandedStat === 'minutes'} onOpenChange={(open) => setExpandedStat(open ? 'minutes' : null)}>
          <CollapsibleTrigger asChild>
            <Card className="cursor-pointer hover:shadow-md transition-all duration-200 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 flex items-center justify-center gap-2">
                    <Timer className="h-6 w-6" />
                    {weeklyStats.totalMinutes}
                  </div>
                  <p className="text-sm text-muted-foreground">Minutes Exercised</p>
                </div>
              </CardContent>
            </Card>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <Card className="mt-2 bg-blue-50 dark:bg-blue-900/20">
              <CardContent className="pt-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-blue-800 dark:text-blue-200">💪 Motivation Boost</h4>
                  {weeklyStats.motivationalMessages.map((message, index) => (
                    <p key={index} className="text-sm text-blue-600 dark:text-blue-400 p-2 bg-white/50 dark:bg-gray-800/50 rounded">
                      {message}
                    </p>
                  ))}
                  <div className="mt-3 p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded">
                    <p className="text-sm font-medium text-indigo-800 dark:text-indigo-200">🎯 Goal: 300 min/week</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${(weeklyStats.totalMinutes / 300) * 100}%` }}></div>
                    </div>
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-1">
                      {300 - weeklyStats.totalMinutes} minutes to go!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible open={expandedStat === 'calories'} onOpenChange={(open) => setExpandedStat(open ? 'calories' : null)}>
          <CollapsibleTrigger asChild>
            <Card className="cursor-pointer hover:shadow-md transition-all duration-200 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600 flex items-center justify-center gap-2">
                    <Zap className="h-6 w-6" />
                    {weeklyStats.caloriesBurned}
                  </div>
                  <p className="text-sm text-muted-foreground">Calories Burned</p>
                </div>
              </CardContent>
            </Card>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <Card className="mt-2 bg-orange-50 dark:bg-orange-900/20">
              <CardContent className="pt-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-orange-800 dark:text-orange-200">🎉 You've Burned:</h4>
                  {weeklyStats.calorieMotivation.map((message, index) => (
                    <p key={index} className="text-sm text-orange-600 dark:text-orange-400 p-2 bg-white/50 dark:bg-gray-800/50 rounded">
                      {message}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 flex items-center justify-center gap-2">
                <Flame className="h-6 w-6" />
                {weeklyStats.streak}
              </div>
              <p className="text-sm text-muted-foreground">Day Streak 🔥</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="workouts" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="workouts">Available Workouts</TabsTrigger>
          <TabsTrigger value="active">Active Workout</TabsTrigger>
          <TabsTrigger value="history">Workout History</TabsTrigger>
        </TabsList>

        <TabsContent value="workouts" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {workoutPlans.map((workout) => (
              <Card key={workout.id} className="hover:shadow-lg transition-all duration-200">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{workout.name}</CardTitle>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        <Badge variant="secondary">
                          <Timer className="h-3 w-3 mr-1" />
                          {workout.duration} min
                        </Badge>
                        <Badge variant={workout.difficulty === 'High' || workout.difficulty === 'Advanced' ? 'destructive' : 'default'}>
                          {workout.difficulty}
                        </Badge>
                      </div>
                      <div className="mt-2">
                        <p className="text-xs text-muted-foreground">Target: {workout.targetMuscles.join(', ')}</p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    {workout.exercises.slice(0, 3).map((exercise, index) => (
                      <div key={index} className="text-sm">
                        <span className="font-medium">{exercise.name}</span>
                        <span className="text-muted-foreground ml-2">
                          {exercise.sets} sets × {exercise.reps}
                        </span>
                        <span className="text-xs text-blue-600 ml-2">
                          ({exercise.primaryMuscle})
                        </span>
                      </div>
                    ))}
                    {workout.exercises.length > 3 && (
                      <p className="text-sm text-muted-foreground">
                        +{workout.exercises.length - 3} more exercises
                      </p>
                    )}
                  </div>
                  <Button 
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    onClick={() => setActiveWorkout(workout)}
                  >
                    Start Workout
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          {activeWorkout ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  {activeWorkout.name}
                </CardTitle>
                <div className="flex gap-2 mt-2">
                  {activeWorkout.targetMuscles.map((muscle: string, index: number) => (
                    <Badge key={index} variant="outline">{muscle}</Badge>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeWorkout.exercises.map((exercise: any, index: number) => (
                    <div key={index} className="p-4 border rounded-lg bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-800 dark:to-slate-800">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">{exercise.name}</h4>
                        <Badge variant="outline">{exercise.sets} sets</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {exercise.reps} reps • {exercise.rest}s rest • Target: {exercise.primaryMuscle}
                      </p>
                      <div className="flex gap-2">
                        {Array.from({ length: exercise.sets }).map((_, setIndex) => (
                          <Button key={setIndex} variant="outline" size="sm">
                            Set {setIndex + 1}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" className="flex-1">
                      Pause Workout
                    </Button>
                    <Button className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                      Complete Workout
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Active Workout</h3>
                  <p className="text-muted-foreground">
                    Start a workout from the Available Workouts tab
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Workouts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weeklyStats.completedWorkouts.map((session, index) => (
                  <div key={index} className="flex justify-between items-center p-4 border rounded-lg hover:bg-gradient-to-r hover:from-gray-50 hover:to-slate-50 dark:hover:from-gray-800 dark:hover:to-slate-800 transition-all duration-200">
                    <div>
                      <p className="font-medium">{session.name}</p>
                      <p className="text-sm text-muted-foreground">{session.date}</p>
                      <p className="text-xs text-blue-600">{session.bodyParts.join(', ')}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={session.intensity === 'Extreme' ? 'destructive' : session.intensity === 'Very High' ? 'default' : 'secondary'}>
                        {session.intensity}
                      </Badge>
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
