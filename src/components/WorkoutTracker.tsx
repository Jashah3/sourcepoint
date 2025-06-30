
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Timer, Award, Activity } from "lucide-react";

export const WorkoutTracker = () => {
  const [activeWorkout, setActiveWorkout] = useState<any>(null);
  
  const workoutPlans = [
    {
      id: 1,
      name: 'Upper Body Strength',
      duration: 45,
      difficulty: 'Intermediate',
      exercises: [
        { name: 'Push-ups', sets: 3, reps: '12-15', rest: 60 },
        { name: 'Pull-ups', sets: 3, reps: '8-10', rest: 90 },
        { name: 'Shoulder Press', sets: 3, reps: '10-12', rest: 60 },
        { name: 'Bicep Curls', sets: 3, reps: '12-15', rest: 45 }
      ]
    },
    {
      id: 2,
      name: 'Cardio HIIT',
      duration: 30,
      difficulty: 'High',
      exercises: [
        { name: 'Burpees', sets: 4, reps: '30s on/30s off', rest: 60 },
        { name: 'Mountain Climbers', sets: 4, reps: '30s on/30s off', rest: 60 },
        { name: 'Jump Squats', sets: 4, reps: '30s on/30s off', rest: 60 },
        { name: 'High Knees', sets: 4, reps: '30s on/30s off', rest: 60 }
      ]
    }
  ];

  const weeklyStats = {
    workoutsCompleted: 4,
    totalMinutes: 180,
    caloriesBurned: 850,
    streak: 3
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {weeklyStats.workoutsCompleted}
              </div>
              <p className="text-sm text-muted-foreground">Workouts This Week</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {weeklyStats.totalMinutes}
              </div>
              <p className="text-sm text-muted-foreground">Minutes Exercised</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {weeklyStats.caloriesBurned}
              </div>
              <p className="text-sm text-muted-foreground">Calories Burned</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {weeklyStats.streak} 🔥
              </div>
              <p className="text-sm text-muted-foreground">Day Streak</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {workoutPlans.map((workout) => (
              <Card key={workout.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{workout.name}</CardTitle>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="secondary">
                          <Timer className="h-3 w-3 mr-1" />
                          {workout.duration} min
                        </Badge>
                        <Badge variant={workout.difficulty === 'High' ? 'destructive' : 'default'}>
                          {workout.difficulty}
                        </Badge>
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
                      </div>
                    ))}
                    {workout.exercises.length > 3 && (
                      <p className="text-sm text-muted-foreground">
                        +{workout.exercises.length - 3} more exercises
                      </p>
                    )}
                  </div>
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700"
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
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeWorkout.exercises.map((exercise: any, index: number) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">{exercise.name}</h4>
                        <Badge variant="outline">{exercise.sets} sets</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {exercise.reps} reps • {exercise.rest}s rest
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
                    <Button className="flex-1 bg-green-600 hover:bg-green-700">
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
                {[
                  { date: 'Today', workout: 'Upper Body Strength', duration: 45, calories: 320 },
                  { date: 'Yesterday', workout: 'Cardio HIIT', duration: 30, calories: 280 },
                  { date: '2 days ago', workout: 'Lower Body', duration: 50, calories: 350 },
                ].map((session, index) => (
                  <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{session.workout}</p>
                      <p className="text-sm text-muted-foreground">{session.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{session.duration} min</p>
                      <p className="text-sm text-muted-foreground">{session.calories} cal</p>
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
