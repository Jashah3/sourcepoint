
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface HealthData {
  streak: number;
  achievements: number;
  badges: string[];
  dailyCalories: number;
  calorieGoal: number;
  waterIntake: number;
  waterGoal: number;
  proteinIntake: number;
  proteinGoal: number;
  steps: number;
  stepGoal: number;
  workoutsCompleted: number;
  mealsLogged: number;
  supplementsTaken: string[];
  currentWeight: number;
  targetWeight: number;
  muscleGained: number;
  sleepHours: number;
  healthScore: number;
}

interface HealthDataContextType {
  healthData: HealthData;
  updateHealthData: (updates: Partial<HealthData>) => void;
  addBadge: (badge: string) => void;
  incrementCalories: (calories: number) => void;
  incrementWater: () => void;
  incrementProtein: (protein: number) => void;
  addSupplement: (supplement: string) => void;
  completeWorkout: () => void;
  logMeal: () => void;
  calculateHealthScore: () => number;
}

const HealthDataContext = createContext<HealthDataContextType | undefined>(undefined);

export const useHealthData = () => {
  const context = useContext(HealthDataContext);
  if (!context) {
    throw new Error('useHealthData must be used within a HealthDataProvider');
  }
  return context;
};

export const HealthDataProvider = ({ children }: { children: ReactNode }) => {
  const [healthData, setHealthData] = useState<HealthData>({
    streak: 7,
    achievements: 12,
    badges: ['Week Warrior', 'Hydration Hero', 'Protein Power', 'Consistency King'],
    dailyCalories: 1450,
    calorieGoal: 2200,
    waterIntake: 6,
    waterGoal: 8,
    proteinIntake: 85,
    proteinGoal: 120,
    steps: 8420,
    stepGoal: 10000,
    workoutsCompleted: 4,
    mealsLogged: 3,
    supplementsTaken: ['Vitamin D3', 'Omega-3'],
    currentWeight: 75.2,
    targetWeight: 70,
    muscleGained: 2.1,
    sleepHours: 7.5,
    healthScore: 85
  });

  const updateHealthData = (updates: Partial<HealthData>) => {
    setHealthData(prev => ({ ...prev, ...updates }));
  };

  const addBadge = (badge: string) => {
    setHealthData(prev => ({
      ...prev,
      badges: [...prev.badges, badge],
      achievements: prev.achievements + 1
    }));
  };

  const incrementCalories = (calories: number) => {
    setHealthData(prev => ({
      ...prev,
      dailyCalories: prev.dailyCalories + calories
    }));
  };

  const incrementWater = () => {
    setHealthData(prev => ({
      ...prev,
      waterIntake: Math.min(prev.waterIntake + 1, prev.waterGoal + 5)
    }));
  };

  const incrementProtein = (protein: number) => {
    setHealthData(prev => ({
      ...prev,
      proteinIntake: prev.proteinIntake + protein
    }));
  };

  const addSupplement = (supplement: string) => {
    setHealthData(prev => ({
      ...prev,
      supplementsTaken: [...prev.supplementsTaken, supplement]
    }));
  };

  const completeWorkout = () => {
    setHealthData(prev => ({
      ...prev,
      workoutsCompleted: prev.workoutsCompleted + 1,
      streak: prev.streak + (Math.random() > 0.7 ? 1 : 0)
    }));
  };

  const logMeal = () => {
    setHealthData(prev => ({
      ...prev,
      mealsLogged: prev.mealsLogged + 1
    }));
  };

  const calculateHealthScore = () => {
    const workoutScore = (healthData.workoutsCompleted / 7) * 30;
    const nutritionScore = (healthData.dailyCalories / healthData.calorieGoal) * 25;
    const hydrationScore = (healthData.waterIntake / healthData.waterGoal) * 20;
    const supplementScore = (healthData.supplementsTaken.length / 8) * 15;
    const sleepScore = (healthData.sleepHours / 8) * 10;
    
    return Math.min(Math.round(workoutScore + nutritionScore + hydrationScore + supplementScore + sleepScore), 100);
  };

  useEffect(() => {
    const score = calculateHealthScore();
    setHealthData(prev => ({ ...prev, healthScore: score }));
  }, [healthData.workoutsCompleted, healthData.dailyCalories, healthData.waterIntake, healthData.supplementsTaken, healthData.sleepHours]);

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        setHealthData(prev => ({
          ...prev,
          steps: prev.steps + Math.floor(Math.random() * 50)
        }));
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <HealthDataContext.Provider value={{
      healthData,
      updateHealthData,
      addBadge,
      incrementCalories,
      incrementWater,
      incrementProtein,
      addSupplement,
      completeWorkout,
      logMeal,
      calculateHealthScore
    }}>
      {children}
    </HealthDataContext.Provider>
  );
};
