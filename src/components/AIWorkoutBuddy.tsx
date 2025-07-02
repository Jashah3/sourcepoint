
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Bot, Play, Pause, SkipForward, CheckCircle, Zap } from "lucide-react";

interface AIWorkoutBuddyProps {
  workout: any;
  onCompleteWorkout: () => void;
  onPauseWorkout: () => void;
}

export const AIWorkoutBuddy = ({ workout, onCompleteWorkout, onPauseWorkout }: AIWorkoutBuddyProps) => {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [repsLeft, setRepsLeft] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [restTimer, setRestTimer] = useState(0);
  const [motivationMessage, setMotivationMessage] = useState("Let's crush this workout! 💪");

  const currentExercise = workout.exercises[currentExerciseIndex];
  const totalExercises = workout.exercises.length;
  const progress = ((currentExerciseIndex + (currentSet / currentExercise.sets)) / totalExercises) * 100;

  const motivationalMessages = [
    "Perfect form! Keep it up! 🔥",
    "You're stronger than you think! 💪",
    "Focus on your breathing - you've got this! 🧘‍♂️",
    "Every rep counts! Stay consistent! ⚡",
    "Mind-muscle connection is key! 🧠",
    "Push through the burn - growth happens here! 🚀",
    "Your future self will thank you! ✨",
    "Stay focused, stay strong! 🎯"
  ];

  const postureReminders = [
    "Keep your core engaged! 💪",
    "Shoulders back and down! 🏃‍♂️",
    "Control the movement - no rushing! ⏱️",
    "Full range of motion! 📏",
    "Breathe out on exertion! 🫁"
  ];

  useEffect(() => {
    if (currentExercise) {
      const repCount = parseInt(currentExercise.reps.split('-')[0]) || 10;
      setRepsLeft(repCount);
    }
  }, [currentExercise, currentSet]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isResting && restTimer > 0) {
        setRestTimer(prev => prev - 1);
      } else if (isResting && restTimer === 0) {
        setIsResting(false);
        setMotivationMessage(motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)]);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isResting, restTimer]);

  const handleCompleteSet = () => {
    if (currentSet < currentExercise.sets) {
      setCurrentSet(prev => prev + 1);
      setIsResting(true);
      setRestTimer(currentExercise.rest);
      setMotivationMessage(`Great set! Rest for ${currentExercise.rest} seconds 😤`);
    } else {
      handleNextExercise();
    }
  };

  const handleNextExercise = () => {
    if (currentExerciseIndex < totalExercises - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      setCurrentSet(1);
      setMotivationMessage("New exercise incoming! 🎯");
    } else {
      onCompleteWorkout();
    }
  };

  const handleRepCompleted = () => {
    if (repsLeft > 1) {
      setRepsLeft(prev => prev - 1);
      if (repsLeft <= 3) {
        setMotivationMessage("Final reps - give it everything! 🔥");
      }
    } else {
      handleCompleteSet();
    }
  };

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-green-600" />
            AI Workout Buddy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
              <div className="text-2xl mb-2">🤖</div>
              <p className="text-sm font-medium text-green-700 dark:text-green-300">
                {motivationMessage}
              </p>
              <div className="mt-2">
                <Badge variant="outline" className="text-xs">
                  {postureReminders[Math.floor(Math.random() * postureReminders.length)]}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-600">{repsLeft}</p>
                <p className="text-xs text-muted-foreground">Reps Left</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">{currentSet}/{currentExercise?.sets}</p>
                <p className="text-xs text-muted-foreground">Current Set</p>
              </div>
            </div>

            <Progress value={progress} className="h-3" />
            <p className="text-xs text-center text-muted-foreground">
              Exercise {currentExerciseIndex + 1} of {totalExercises}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-medium">{currentExercise?.name}</h3>
              <p className="text-sm text-muted-foreground">{currentExercise?.primaryMuscle}</p>
            </div>

            {isResting ? (
              <div className="text-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-4xl font-bold text-blue-600 mb-2">{restTimer}</div>
                <p className="text-sm text-blue-700 dark:text-blue-300">Rest Time Remaining</p>
                <div className="mt-4">
                  <div className="animate-pulse text-2xl">😤</div>
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                <Button 
                  onClick={handleRepCompleted}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Complete Rep
                </Button>
                <Button variant="outline" onClick={onPauseWorkout}>
                  <Pause className="h-4 w-4" />
                </Button>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" onClick={handleNextExercise}>
                <SkipForward className="h-4 w-4 mr-1" />
                Skip Exercise
              </Button>
              <Button variant="destructive" size="sm" onClick={onCompleteWorkout}>
                End Workout
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {currentExerciseIndex < totalExercises - 1 && (
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
          <CardContent className="pt-4">
            <div className="text-center">
              <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Up Next:</p>
              <p className="text-lg font-bold">{workout.exercises[currentExerciseIndex + 1]?.name}</p>
              <p className="text-xs text-muted-foreground">
                {workout.exercises[currentExerciseIndex + 1]?.primaryMuscle}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
