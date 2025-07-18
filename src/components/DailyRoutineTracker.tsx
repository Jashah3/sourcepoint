import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Clock, Droplets, Dumbbell, Book, Utensils, Moon, Sun, Calendar, RefreshCw, Bell } from "lucide-react";
import { GoogleCalendarService } from "@/services/googleCalendar";
import { toast } from "sonner";

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
      id: 'detox-mon-1',
      time: '6:30 AM',
      title: 'Lemon-Ginger-Turmeric Detox Drink',
      description: '1 cup warm water, 1/2 lemon juice, 1 tsp ginger, 1/2 tsp turmeric, pinch black pepper, 1 tsp honey + beetroot powder',
      category: 'detox',
      completed: false
    },
    {
      id: 'bathroom-mon-1',
      time: '6:50 AM',
      title: 'Bathroom Routine',
      description: 'Quick face wash and preparation',
      category: 'recovery',
      duration: '15 mins',
      completed: false
    },
    {
      id: 'ice-mon-1',
      time: '7:05 AM',
      title: 'Ice Therapy + Wim Hof Breathing',
      description: 'Cold shower/ice bath for 2-3 minutes, 3 rounds Wim Hof breathing',
      category: 'recovery',
      duration: '3 mins',
      completed: false
    },
    {
      id: 'supplements-mon-1',
      time: '7:15 AM',
      title: 'Morning Supplement Stack',
      description: 'CoQ10 (100-200mg), Vitamin D3+K2, Shilajit, L-Tyrosine, B12, Biotin, Silica, Astaxanthin',
      category: 'supplements',
      completed: false
    },
    {
      id: 'movement-mon-1',
      time: '7:30 AM',
      title: 'Morning Movement Routine',
      description: 'Yoga Flow (15min), Core Activation (10min), Kegels (5min)',
      category: 'movement',
      duration: '35 mins',
      completed: false
    },
    {
      id: 'breakfast-mon-1',
      time: '8:15 AM',
      title: 'Enhanced Breakfast with Dry Fruits & Seeds',
      description: 'Power Oats Bowl with protein, dry fruits mix, healthy seeds, vitamin C boost',
      category: 'meal',
      calories: 650,
      protein: '35g',
      completed: false
    },
    {
      id: 'study-mon-1',
      time: '9:00 AM',
      title: 'Deep Work Session 1',
      description: 'High-focus tasks (math, technical subjects) - L-Tyrosine peak',
      category: 'study',
      duration: '90 mins',
      completed: false
    },
    {
      id: 'break-mon-1',
      time: '10:30 AM',
      title: 'Study Break',
      description: '10-minute walk + hydration + light stretching',
      category: 'recovery',
      duration: '10 mins',
      completed: false
    },
    {
      id: 'study-mon-2',
      time: '11:00 AM',
      title: 'Study Session 2',
      description: 'Continue focused work',
      category: 'study',
      duration: '90 mins',
      completed: false
    },
    {
      id: 'lunch-mon-1',
      time: '12:30 PM',
      title: 'Nutritionally Complete Lunch',
      description: 'High-Protein Rajma Bowl, Spinach-Paneer Sabzi, Quinoa Tabbouleh, Greek Yogurt Raita',
      category: 'meal',
      calories: 750,
      protein: '42g',
      completed: false
    },
    {
      id: 'supplements-mon-2',
      time: '1:00 PM',
      title: 'Midday Supplements',
      description: 'Alpha Lipoic Acid, Iron with Vitamin C, Vitamin B-Complex',
      category: 'supplements',
      completed: false
    },
    {
      id: 'walk-mon-1',
      time: '1:15 PM',
      title: 'Post-Lunch Walk',
      description: '15-minute easy walk for digestion',
      category: 'recovery',
      duration: '15 mins',
      completed: false
    },
    {
      id: 'study-mon-3',
      time: '2:00 PM',
      title: 'Study Session 3',
      description: 'Review/lighter subjects',
      category: 'study',
      duration: '90 mins',
      completed: false
    },
    {
      id: 'snack-mon-1',
      time: '3:30 PM',
      title: 'Balanced Snack Break',
      description: 'Protein Energy Mix: buttermilk + chia seeds, fig + almond butter, spirulina powder',
      category: 'meal',
      calories: 280,
      protein: '12g',
      completed: false
    },
    {
      id: 'study-mon-4',
      time: '4:00 PM',
      title: 'Study Session 4',
      description: 'Final study block of the day',
      category: 'study',
      duration: '90 mins',
      completed: false
    },
    {
      id: 'preworkout-mon-1',
      time: '6:00 PM',
      title: 'Pre-Workout',
      description: 'Beetroot powder, L-Arginine (2-3g), light dynamic warmup',
      category: 'supplements',
      completed: false
    },
    {
      id: 'workout-mon-1',
      time: '6:15 PM',
      title: 'PUSH DAY WORKOUT',
      description: 'Incline Push-ups, DB Chest Press, Overhead Press, Lateral Raises, Triceps Dips, Core Finisher',
      category: 'workout',
      duration: '60 mins',
      completed: false
    },
    {
      id: 'protein-mon-1',
      time: '7:15 PM',
      title: 'Post-Workout Plant Protein Shake',
      description: 'Plant protein powder, almond milk, banana, chia seeds, almond butter, creatine',
      category: 'meal',
      calories: 420,
      protein: '30g',
      completed: false
    },
    {
      id: 'dinner-mon-1',
      time: '7:30 PM',
      title: 'Complete Nutritional Dinner',
      description: 'Tofu Stir-Fry, Lentil-Stuffed Roti, Sprout Salad, Roasted Edamame, Nutritional Yeast Sauce',
      category: 'meal',
      calories: 680,
      protein: '38g',
      completed: false
    },
    {
      id: 'supplements-mon-3',
      time: '8:00 PM',
      title: 'Evening Supplements',
      description: 'Omega-3, Curcumin + Black Pepper, Vitamin E',
      category: 'supplements',
      completed: false
    },
    {
      id: 'social-mon-1',
      time: '8:30 PM',
      title: 'Study/Relaxation',
      description: 'Light study or personal time, social time with friends/family',
      category: 'recovery',
      duration: '60 mins',
      completed: false
    },
    {
      id: 'night-supplements-mon',
      time: '10:00 PM',
      title: 'Night Supplement Stack',
      description: 'Ashwagandha, Zinc, Magnesium Glycinate, Casein Protein, Inositol, Glycine',
      category: 'supplements',
      completed: false
    },
    {
      id: 'sleep-prep-mon',
      time: '10:30 PM',
      title: 'Sleep Preparation',
      description: 'Dim lights, no screens, reading/meditation, final Kegel session',
      category: 'recovery',
      duration: '30 mins',
      completed: false
    }
  ],
  tuesday: [
    {
      id: 'detox-tue-1',
      time: '6:30 AM',
      title: 'Lemon-Ginger-Turmeric Detox Drink',
      description: '1 cup warm water, 1/2 lemon juice, 1 tsp ginger, 1/2 tsp turmeric + beetroot powder',
      category: 'detox',
      completed: false
    },
    {
      id: 'ice-tue-1',
      time: '7:05 AM',
      title: 'Ice Therapy + Wim Hof Breathing',
      description: 'Cold exposure + Wim Hof breathing',
      category: 'recovery',
      duration: '3 mins',
      completed: false
    },
    {
      id: 'supplements-tue-1',
      time: '7:15 AM',
      title: 'Morning Supplement Stack',
      description: 'CoQ10, L-Tyrosine, Shilajit, B-Complex (alternate B12 days), Biotin, Silica, Vitamin E',
      category: 'supplements',
      completed: false
    },
    {
      id: 'movement-tue-1',
      time: '7:30 AM',
      title: 'Morning Movement Routine',
      description: 'Same yoga + core + kegel routine (35 mins)',
      category: 'movement',
      duration: '35 mins',
      completed: false
    },
    {
      id: 'breakfast-tue-1',
      time: '8:15 AM',
      title: 'Nutritious Breakfast with Dry Fruits',
      description: 'Protein Besan Chilla, Enhanced Oats Bowl, Sprouted Moong Salad, Mixed berries',
      category: 'meal',
      calories: 620,
      protein: '32g',
      completed: false
    },
    {
      id: 'study-tue-1',
      time: '9:00 AM',
      title: 'Study Block Session 1',
      description: 'Same structure as Monday - focused work',
      category: 'study',
      duration: '90 mins',
      completed: false
    },
    {
      id: 'break-tue-1',
      time: '10:30 AM',
      title: 'Study Break',
      description: '10-minute walk + hydration + light stretching',
      category: 'recovery',
      duration: '10 mins',
      completed: false
    },
    {
      id: 'study-tue-2',
      time: '11:00 AM',
      title: 'Study Session 2',
      description: 'Continue focused work',
      category: 'study',
      duration: '90 mins',
      completed: false
    },
    {
      id: 'lunch-tue-1',
      time: '12:30 PM',
      title: 'Complete Nutritional Lunch',
      description: 'High-Protein Chole, Triple Bean Salad, Amaranth Roti, Beetroot Hummus, Probiotic Drink',
      category: 'meal',
      calories: 780,
      protein: '45g',
      completed: false
    },
    {
      id: 'supplements-tue-2',
      time: '1:00 PM',
      title: 'Midday Supplements',
      description: 'ALA with lunch, Iron with Vitamin C, Calcium + Magnesium supplement',
      category: 'supplements',
      completed: false
    },
    {
      id: 'walk-tue-1',
      time: '1:15 PM',
      title: 'Post-Lunch Walk',
      description: '15-minute easy walk for digestion',
      category: 'recovery',
      duration: '15 mins',
      completed: false
    },
    {
      id: 'study-tue-3',
      time: '2:00 PM',
      title: 'Afternoon Study',
      description: 'Review/lighter subjects',
      category: 'study',
      duration: '90 mins',
      completed: false
    },
    {
      id: 'snack-tue-1',
      time: '3:30 PM',
      title: 'Nutrient Snack',
      description: 'Protein Makhana Mix, Coconut water, Antioxidant boost with goji berries',
      category: 'meal',
      calories: 290,
      protein: '15g',
      completed: false
    },
    {
      id: 'study-tue-4',
      time: '4:00 PM',
      title: 'Study Session 4',
      description: 'Final study block',
      category: 'study',
      duration: '90 mins',
      completed: false
    },
    {
      id: 'preworkout-tue-1',
      time: '6:00 PM',
      title: 'Pre-Workout',
      description: 'L-Arginine, light warmup',
      category: 'supplements',
      completed: false
    },
    {
      id: 'workout-tue-1',
      time: '6:15 PM',
      title: 'PULL + BOXING DAY',
      description: 'Pull-ups, Rows, Face Pulls, Curls, Boxing Session (Shadow + Bag), Core Finisher',
      category: 'workout',
      duration: '75 mins',
      completed: false
    },
    {
      id: 'protein-tue-1',
      time: '7:30 PM',
      title: 'Post-Workout Plant Protein Shake',
      description: 'Plant Protein Recovery Shake + creatine + electrolytes',
      category: 'meal',
      calories: 420,
      protein: '30g',
      completed: false
    },
    {
      id: 'dinner-tue-1',
      time: '8:00 PM',
      title: 'Complete Nutritional Dinner',
      description: 'Protein-Rich Veg Pulao, Paneer-Tofu Curry, Masoor Dal, Roasted Chickpea Salad, Steamed Kale',
      category: 'meal',
      calories: 720,
      protein: '40g',
      completed: false
    },
    {
      id: 'supplements-tue-3',
      time: '8:30 PM',
      title: 'Evening Supplements',
      description: 'Omega-3, Curcumin, Vitamin D3 (if not taken in morning)',
      category: 'supplements',
      completed: false
    },
    {
      id: 'night-supplements-tue',
      time: '10:00 PM',
      title: 'Night Supplements',
      description: 'Full night stack + collagen peptides (10g)',
      category: 'supplements',
      completed: false
    }
  ],
  wednesday: [
    {
      id: 'detox-wed-1',
      time: '6:30 AM',
      title: 'Lemon-Ginger-Turmeric Detox Drink',
      description: 'Mandatory daily start with lemon-ginger-turmeric detox drink',
      category: 'detox',
      completed: false
    },
    {
      id: 'supplements-wed-1',
      time: '7:15 AM',
      title: 'Morning Supplements',
      description: 'Morning stack + Probiotic (empty stomach)',
      category: 'supplements',
      completed: false
    },
    {
      id: 'movement-wed-1',
      time: '7:30 AM',
      title: 'Morning Movement Routine',
      description: 'Yoga + core + kegel routine',
      category: 'movement',
      duration: '35 mins',
      completed: false
    },
    {
      id: 'breakfast-wed-1',
      time: '8:15 AM',
      title: 'Power-Packed Breakfast',
      description: 'Green Oats Smoothie Bowl, Enhanced Protein Toast, Sprouted Lentil Salad, Vitamin C boost',
      category: 'meal',
      calories: 640,
      protein: '34g',
      completed: false
    },
    {
      id: 'study-wed-1',
      time: '9:00 AM',
      title: 'Study Block 1',
      description: 'Regular study routine',
      category: 'study',
      duration: '90 mins',
      completed: false
    },
    {
      id: 'break-wed-1',
      time: '10:30 AM',
      title: 'Study Break',
      description: '10-minute walk + hydration',
      category: 'recovery',
      duration: '10 mins',
      completed: false
    },
    {
      id: 'study-wed-2',
      time: '11:00 AM',
      title: 'Study Session 2',
      description: 'Continued focused work',
      category: 'study',
      duration: '90 mins',
      completed: false
    },
    {
      id: 'lunch-wed-1',
      time: '12:30 PM',
      title: 'Nutrient-Dense Lunch',
      description: 'Protein Khichdi, Carrot-Beet-Sprout Salad, Stuffed Bell Peppers, Protein Lassi',
      category: 'meal',
      calories: 700,
      protein: '38g',
      completed: false
    },
    {
      id: 'supplements-wed-2',
      time: '1:00 PM',
      title: 'Midday Supplements',
      description: 'ALA, Iron with Vitamin C, B-Complex',
      category: 'supplements',
      completed: false
    },
    {
      id: 'walk-wed-1',
      time: '1:15 PM',
      title: 'Post-Lunch Walk',
      description: '15-minute digestive walk',
      category: 'recovery',
      duration: '15 mins',
      completed: false
    },
    {
      id: 'study-wed-3',
      time: '2:00 PM',
      title: 'Afternoon Study',
      description: 'Review sessions',
      category: 'study',
      duration: '90 mins',
      completed: false
    },
    {
      id: 'snack-wed-1',
      time: '3:30 PM',
      title: 'Energy Snack',
      description: 'Protein Date Balls, Green tea with nuts, Coconut water with mint',
      category: 'meal',
      calories: 260,
      protein: '10g',
      completed: false
    },
    {
      id: 'study-wed-4',
      time: '4:00 PM',
      title: 'Study Session 4',
      description: 'Final study block',
      category: 'study',
      duration: '90 mins',
      completed: false
    },
    {
      id: 'workout-wed-1',
      time: '6:00 PM',
      title: 'LEGS + CORE DAY',
      description: 'Squats, Lunges, Hip Thrusts, Calf Raises, Core Superset',
      category: 'workout',
      duration: '75 mins',
      completed: false
    },
    {
      id: 'protein-wed-1',
      time: '7:15 PM',
      title: 'Post-Workout Plant Protein Shake',
      description: 'Plant Protein Recovery Shake + creatine + electrolytes',
      category: 'meal',
      calories: 420,
      protein: '30g',
      completed: false
    },
    {
      id: 'dinner-wed-1',
      time: '7:30 PM',
      title: 'Recovery Dinner',
      description: 'Jowar Roti with High-Protein Paneer Curry, Protein-Rich Broccoli Soup',
      category: 'meal',
      calories: 650,
      protein: '35g',
      completed: false
    },
    {
      id: 'yoga-wed-1',
      time: '9:00 PM',
      title: 'Evening Yoga',
      description: 'Hip openers, gentle twists, restorative poses',
      category: 'recovery',
      duration: '30 mins',
      completed: false
    },
    {
      id: 'night-supplements-wed',
      time: '10:00 PM',
      title: 'Night Supplements + Extra Kegels',
      description: 'Full night stack with extra Kegel focus',
      category: 'supplements',
      completed: false
    }
  ],
  thursday: [
    {
      id: 'detox-thu-1',
      time: '6:30 AM',
      title: 'Lemon-Ginger-Turmeric Detox Drink',
      description: 'Mandatory daily start with detox drink',
      category: 'detox',
      completed: false
    },
    {
      id: 'supplements-thu-1',
      time: '7:15 AM',
      title: 'Morning Supplement Stack',
      description: 'Standard morning supplements',
      category: 'supplements',
      completed: false
    },
    {
      id: 'movement-thu-1',
      time: '7:30 AM',
      title: 'Morning Movement Routine',
      description: 'Yoga + core + kegel routine',
      category: 'movement',
      duration: '35 mins',
      completed: false
    },
    {
      id: 'breakfast-thu-1',
      time: '8:15 AM',
      title: 'Balanced Breakfast',
      description: 'Protein Muesli Bowl, Protein-Rich Fruit Bowl, Antioxidant Tea',
      category: 'meal',
      calories: 580,
      protein: '28g',
      completed: false
    },
    {
      id: 'study-thu-1',
      time: '9:00 AM',
      title: 'Study Block - Challenging Subjects',
      description: 'Focus on challenging subjects',
      category: 'study',
      duration: '90 mins',
      completed: false
    },
    {
      id: 'break-thu-1',
      time: '10:30 AM',
      title: 'Study Break',
      description: '10-minute walk + hydration',
      category: 'recovery',
      duration: '10 mins',
      completed: false
    },
    {
      id: 'study-thu-2',
      time: '11:00 AM',
      title: 'Study Session 2',
      description: 'Continued work',
      category: 'study',
      duration: '90 mins',
      completed: false
    },
    {
      id: 'lunch-thu-1',
      time: '12:30 PM',
      title: 'Wholesome Lunch',
      description: 'Palak Paneer, Three-Bean Salad, Protein Smoothie, Iron Boost Spinach Salad',
      category: 'meal',
      calories: 720,
      protein: '40g',
      completed: false
    },
    {
      id: 'supplements-thu-2',
      time: '1:00 PM',
      title: 'Midday Supplements',
      description: 'ALA, Iron, B-Complex',
      category: 'supplements',
      completed: false
    },
    {
      id: 'walk-thu-1',
      time: '1:15 PM',
      title: 'Post-Lunch Walk',
      description: '15-minute digestive walk',
      category: 'recovery',
      duration: '15 mins',
      completed: false
    },
    {
      id: 'study-thu-3',
      time: '2:00 PM',
      title: 'Afternoon Study',
      description: 'Study session 3',
      category: 'study',
      duration: '90 mins',
      completed: false
    },
    {
      id: 'snack-thu-1',
      time: '3:30 PM',
      title: 'Balanced Snack',
      description: 'Protein Lassi, Roasted Chickpea Mix, Seed Mix',
      category: 'meal',
      calories: 270,
      protein: '14g',
      completed: false
    },
    {
      id: 'study-thu-4',
      time: '4:00 PM',
      title: 'Study Session 4',
      description: 'Final study block',
      category: 'study',
      duration: '90 mins',
      completed: false
    },
    {
      id: 'active-recovery-thu-1',
      time: '6:00 PM',
      title: 'ACTIVE RECOVERY',
      description: 'Jump Rope, Shadow Boxing, Mobility drills, Foam rolling, Kegel Focus Session',
      category: 'workout',
      duration: '60 mins',
      completed: false
    },
    {
      id: 'recovery-drink-thu-1',
      time: '7:00 PM',
      title: 'Light Recovery Drink',
      description: 'Simple Hydration Shake with coconut water + lemon + chia seeds',
      category: 'meal',
      calories: 150,
      protein: '5g',
      completed: false
    },
    {
      id: 'dinner-thu-1',
      time: '7:30 PM',
      title: 'Nourishing Dinner',
      description: 'Protein Quinoa Bowl, Protein-Enhanced Tomato Soup, Edamame Salad, Probiotic Support',
      category: 'meal',
      calories: 620,
      protein: '32g',
      completed: false
    },
    {
      id: 'relaxation-thu-1',
      time: '9:00 PM',
      title: 'Relaxation Time',
      description: 'Sauna/steam (if available), deep stretching, meditation',
      category: 'recovery',
      duration: '60 mins',
      completed: false
    },
    {
      id: 'night-supplements-thu',
      time: '10:00 PM',
      title: 'Night Supplement Stack',
      description: 'Standard night supplements',
      category: 'supplements',
      completed: false
    }
  ],
  friday: [
    {
      id: 'detox-fri-1',
      time: '6:30 AM',
      title: 'Lemon-Ginger-Turmeric Detox Drink',
      description: 'Mandatory daily start with detox drink',
      category: 'detox',
      completed: false
    },
    {
      id: 'supplements-fri-1',
      time: '7:15 AM',
      title: 'Morning Supplement Stack',
      description: 'Standard morning supplements',
      category: 'supplements',
      completed: false
    },
    {
      id: 'movement-fri-1',
      time: '7:30 AM',
      title: 'Morning Movement Routine',
      description: 'Yoga + core + kegel routine',
      category: 'movement',
      duration: '35 mins',
      completed: false
    },
    {
      id: 'breakfast-fri-1',
      time: '8:15 AM',
      title: 'Energy-Boosting Breakfast',
      description: 'Protein Pancakes, Orange Power Bowl, Brazil Nut Special for selenium',
      category: 'meal',
      calories: 660,
      protein: '36g',
      completed: false
    },
    {
      id: 'study-fri-1',
      time: '9:00 AM',
      title: 'Study Block 1',
      description: 'Regular study routine',
      category: 'study',
      duration: '90 mins',
      completed: false
    },
    {
      id: 'break-fri-1',
      time: '10:30 AM',
      title: 'Study Break',
      description: '10-minute walk + hydration',
      category: 'recovery',
      duration: '10 mins',
      completed: false
    },
    {
      id: 'study-fri-2',
      time: '11:00 AM',
      title: 'Study Session 2',
      description: 'Continued work',
      category: 'study',
      duration: '90 mins',
      completed: false
    },
    {
      id: 'lunch-fri-1',
      time: '12:30 PM',
      title: 'High-Energy Lunch',
      description: 'High-Protein Paneer Bhurji, Sprouted Beetroot Salad, Amaranth Porridge, Protein Buttermilk',
      category: 'meal',
      calories: 760,
      protein: '43g',
      completed: false
    },
    {
      id: 'supplements-fri-2',
      time: '1:00 PM',
      title: 'Midday Supplements',
      description: 'ALA, Iron, B-Complex',
      category: 'supplements',
      completed: false
    },
    {
      id: 'walk-fri-1',
      time: '1:15 PM',
      title: 'Post-Lunch Walk',
      description: '15-minute digestive walk',
      category: 'recovery',
      duration: '15 mins',
      completed: false
    },
    {
      id: 'study-fri-3',
      time: '2:00 PM',
      title: 'Afternoon Study',
      description: 'Study session 3',
      category: 'study',
      duration: '90 mins',
      completed: false
    },
    {
      id: 'snack-fri-1',
      time: '3:30 PM',
      title: 'Power Snack',
      description: 'Protein Power Mix, Herbal tea, Homemade Energy Balls',
      category: 'meal',
      calories: 320,
      protein: '16g',
      completed: false
    },
    {
      id: 'study-fri-4',
      time: '4:00 PM',
      title: 'Study Session 4',
      description: 'Final study block',
      category: 'study',
      duration: '90 mins',
      completed: false
    },
    {
      id: 'workout-fri-1',
      time: '6:00 PM',
      title: 'ARMS + BAG WORK',
      description: 'DB Shoulder Press, Bicep Curls, Boxing Power Session, Core Finisher',
      category: 'workout',
      duration: '90 mins',
      completed: false
    },
    {
      id: 'protein-fri-1',
      time: '7:30 PM',
      title: 'Post-Workout Plant Protein Shake',
      description: 'Plant Protein Recovery Shake + creatine + electrolytes',
      category: 'meal',
      calories: 420,
      protein: '30g',
      completed: false
    },
    {
      id: 'dinner-fri-1',
      time: '8:00 PM',
      title: 'Complete Dinner',
      description: 'Protein-Rich Chole, Greek Yogurt Bowl, Roasted Lentil Snack Mix, Evening Nutrition',
      category: 'meal',
      calories: 700,
      protein: '38g',
      completed: false
    },
    {
      id: 'social-fri-1',
      time: '9:00 PM',
      title: 'Social Time',
      description: 'Friends/family time, light entertainment',
      category: 'recovery',
      duration: '90 mins',
      completed: false
    },
    {
      id: 'night-supplements-fri',
      time: '10:00 PM',
      title: 'Night Supplement Stack',
      description: 'Standard night supplements',
      category: 'supplements',
      completed: false
    }
  ],
  saturday: [
    {
      id: 'detox-sat-1',
      time: '6:30 AM',
      title: 'Lemon-Ginger-Turmeric Detox Drink',
      description: 'Mandatory daily start + extended morning routine (45 mins)',
      category: 'detox',
      completed: false
    },
    {
      id: 'movement-sat-1',
      time: '7:00 AM',
      title: 'Extended Morning Movement',
      description: 'Extended morning routine with extra emphasis on mobility',
      category: 'movement',
      duration: '45 mins',
      completed: false
    },
    {
      id: 'breakfast-sat-1',
      time: '8:15 AM',
      title: 'Weekend Power Breakfast',
      description: 'Overnight Protein Oats, Weekend Fruit Salad, Green Smoothie, Special Weekend Granola',
      category: 'meal',
      calories: 720,
      protein: '40g',
      completed: false
    },
    {
      id: 'study-sat-1',
      time: '9:00 AM',
      title: 'Study Block - Light Review',
      description: 'Lighter study/review day',
      category: 'study',
      duration: '90 mins',
      completed: false
    },
    {
      id: 'break-sat-1',
      time: '10:30 AM',
      title: 'Study Break',
      description: '10-minute walk + hydration',
      category: 'recovery',
      duration: '10 mins',
      completed: false
    },
    {
      id: 'study-sat-2',
      time: '11:00 AM',
      title: 'Study Session 2',
      description: 'Light review continued',
      category: 'study',
      duration: '90 mins',
      completed: false
    },
    {
      id: 'lunch-sat-1',
      time: '12:30 PM',
      title: 'Pre-Workout Power Lunch',
      description: 'Tofu-Tempeh Stir-Fry, Protein-Packed Spinach, High-Protein Greek Yogurt, Energy Boost',
      category: 'meal',
      calories: 800,
      protein: '45g',
      completed: false
    },
    {
      id: 'rest-sat-1',
      time: '2:00 PM',
      title: 'Rest Period',
      description: 'Light rest before major workout',
      category: 'recovery',
      duration: '90 mins',
      completed: false
    },
    {
      id: 'snack-sat-1',
      time: '3:30 PM',
      title: 'Pre-Workout Power Snack',
      description: 'Power Smoothie with pumpkin seeds, Energy Mix with figs and almonds',
      category: 'meal',
      calories: 350,
      protein: '18g',
      completed: false
    },
    {
      id: 'workout-sat-1',
      time: '4:30 PM',
      title: 'FULL BOXING + HIIT',
      description: 'Jump Rope, Shadow Boxing, Pad Work, Bag Combos, HIIT Circuit, Core Finisher',
      category: 'workout',
      duration: '90 mins',
      completed: false
    },
    {
      id: 'protein-sat-1',
      time: '6:00 PM',
      title: 'Post-Workout Plant Protein Shake',
      description: 'Plant Protein Recovery Shake + creatine + electrolytes + extended cooldown',
      category: 'meal',
      calories: 420,
      protein: '30g',
      completed: false
    },
    {
      id: 'dinner-sat-1',
      time: '7:00 PM',
      title: 'Weekend Recovery Dinner',
      description: 'Protein Moong Dal Chilla, Protein-Enhanced Broccoli Soup, Edamame Hummus, Weekend Treat',
      category: 'meal',
      calories: 680,
      protein: '36g',
      completed: false
    },
    {
      id: 'recovery-sat-1',
      time: '8:00 PM',
      title: 'Recovery Focus',
      description: 'Massage/foam rolling, stretching session',
      category: 'recovery',
      duration: '60 mins',
      completed: false
    },
    {
      id: 'social-sat-1',
      time: '9:00 PM',
      title: 'Weekend Social Time',
      description: 'Extended social time for weekend',
      category: 'recovery',
      duration: '90 mins',
      completed: false
    },
    {
      id: 'night-supplements-sat',
      time: '10:30 PM',
      title: 'Night Supplement Stack',
      description: 'Weekend night supplements',
      category: 'supplements',
      completed: false
    }
  ],
  sunday: [
    {
      id: 'detox-sun-1',
      time: '6:45 AM',
      title: 'Gentle Wake Up + Detox Drink',
      description: 'Lemon-Ginger-Turmeric Detox Drink with extra sleep if needed',
      category: 'detox',
      completed: false
    },
    {
      id: 'movement-sun-1',
      time: '7:30 AM',
      title: 'Extended Movement Session',
      description: 'Long yoga flow (30min), Deep hip openers, Meditation/breathwork, Extended Kegel Session',
      category: 'movement',
      duration: '60 mins',
      completed: false
    },
    {
      id: 'breakfast-sun-1',
      time: '8:30 AM',
      title: 'Weekend Special Greek Yogurt Bowl',
      description: 'Premium Greek Yogurt Bowl, Protein Tofu Scramble, Pomegranate Smoothie',
      category: 'meal',
      calories: 750,
      protein: '42g',
      completed: false
    },
    {
      id: 'study-sun-1',
      time: '9:00 AM',
      title: 'Light Study/Planning',
      description: 'Weekly review, next week planning, light reading',
      category: 'study',
      duration: '180 mins',
      completed: false
    },
    {
      id: 'lunch-sun-1',
      time: '12:00 PM',
      title: 'Sunday Special Lunch',
      description: 'Protein-Rich Quinoa Pulao, Coconut Chutney, Cabbage-Sprout Poriyal, Avocado toast',
      category: 'meal',
      calories: 720,
      protein: '38g',
      completed: false
    },
    {
      id: 'walk-sun-1',
      time: '2:00 PM',
      title: 'Long Nature Walk',
      description: 'Nature walk or park, fresh air + sunlight',
      category: 'recovery',
      duration: '30 mins',
      completed: false
    },
    {
      id: 'snack-sun-1',
      time: '3:00 PM',
      title: 'Nutritious Snack',
      description: 'Protein Chickpea Chaat, Coconut water with lime',
      category: 'meal',
      calories: 280,
      protein: '15g',
      completed: false
    },
    {
      id: 'light-circuit-sun-1',
      time: '3:30 PM',
      title: 'Optional Light Circuit',
      description: 'Push-ups, Bodyweight Squats, Pull-ups (assisted), Plank Hold with recovery focus',
      category: 'workout',
      duration: '30 mins',
      completed: false
    },
    {
      id: 'recovery-session-sun-1',
      time: '4:30 PM',
      title: 'Deep Recovery Session',
      description: 'Foam Rolling, Restorative Yoga, Meditation/Breathwork, Self-Massage',
      category: 'recovery',
      duration: '90 mins',
      completed: false
    },
    {
      id: 'dinner-sun-1',
      time: '6:00 PM',
      title: 'Sunday Reset Dinner',
      description: 'Comfort Protein Bowl, Healing Soup, Probiotic Support, Mineral Rich Salad, Sunday Special',
      category: 'meal',
      calories: 700,
      protein: '35g',
      completed: false
    },
    {
      id: 'supplements-sun-1',
      time: '7:00 PM',
      title: 'Evening Supplements',
      description: 'Omega-3, Curcumin, Vitamin E, Probiotic supplement',
      category: 'supplements',
      completed: false
    },
    {
      id: 'week-reset-sun-1',
      time: '7:30 PM',
      title: 'Week Reset Activities',
      description: 'Meal prep, organize supplements, plan workout clothes, review upcoming week',
      category: 'recovery',
      duration: '60 mins',
      completed: false
    },
    {
      id: 'social-sun-1',
      time: '8:30 PM',
      title: 'Social/Family Time',
      description: 'Quality time with family/friends, light entertainment, no heavy study or work',
      category: 'recovery',
      duration: '60 mins',
      completed: false
    },
    {
      id: 'selfcare-sun-1',
      time: '9:30 PM',
      title: 'Sunday Night Self-Care',
      description: 'Hot bath with salts (magnesium absorption), skincare routine',
      category: 'recovery',
      duration: '30 mins',
      completed: false
    },
    {
      id: 'night-supplements-sun',
      time: '10:00 PM',
      title: 'Sunday Night Supplement Stack',
      description: 'Enhanced night stack for week reset: Ashwagandha, Zinc, Magnesium, Casein, Melatonin, Optional additions',
      category: 'supplements',
      completed: false
    },
    {
      id: 'sleep-prep-sun',
      time: '10:30 PM',
      title: 'Sleep Preparation',
      description: 'Dim lights, cool temperature, no screens, final Kegel session, deep breathing, 8+ hours recovery sleep prep',
      category: 'recovery',
      duration: '30 mins',
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
  const [calendarConnected, setCalendarConnected] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [googleCalendarService] = useState(() => GoogleCalendarService.getInstance());

  useEffect(() => {
    // Check if Google Calendar is already connected
    setCalendarConnected(googleCalendarService.isConnected());
  }, [googleCalendarService]);

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

  const connectToGoogleCalendar = async () => {
    setSyncing(true);
    try {
      const success = await googleCalendarService.signIn();
      if (success) {
        setCalendarConnected(true);
        toast.success("Successfully connected to Google Calendar!");
      } else {
        toast.error("Failed to connect to Google Calendar. Please check your settings.");
      }
    } catch (error) {
      console.error("Google Calendar connection error:", error);
      toast.error("Connection failed. Please try again.");
    } finally {
      setSyncing(false);
    }
  };

  const syncRoutineToCalendar = async () => {
    if (!calendarConnected) {
      toast.error("Please connect to Google Calendar first");
      return;
    }

    setSyncing(true);
    try {
      const today = new Date();
      const currentDayItems = currentDayData;
      let successCount = 0;

      for (const item of currentDayItems) {
        const [time, ampm] = item.time.split(' ');
        const [hours, minutes] = time.split(':').map(Number);
        let hour24 = hours;
        
        if (ampm === 'PM' && hours !== 12) hour24 += 12;
        if (ampm === 'AM' && hours === 12) hour24 = 0;

        const itemDateTime = new Date(today);
        itemDateTime.setHours(hour24, minutes, 0, 0);

        // Only create reminders for future items
        if (itemDateTime > new Date()) {
          let success = false;
          
          if (item.category === 'meal') {
            success = await googleCalendarService.createMealReminder(item.title, itemDateTime);
          } else if (item.category === 'workout' || item.category === 'movement') {
            success = await googleCalendarService.createWorkoutReminder(item.title, itemDateTime);
          } else {
            // Create general reminder for other categories
            success = await googleCalendarService.createMealReminder(
              `${item.category.toUpperCase()}: ${item.title}`, 
              itemDateTime
            );
          }
          
          if (success) successCount++;
        }
      }

      // Create water reminders for the day
      const waterSuccess = await googleCalendarService.createWaterReminder();
      
      if (successCount > 0 || waterSuccess) {
        toast.success(`Successfully synced ${successCount} routine items and water reminders to Google Calendar!`);
      } else {
        toast.warning("No future items to sync today. Calendar reminders are for upcoming activities.");
      }
    } catch (error) {
      console.error("Sync error:", error);
      toast.error("Failed to sync with Google Calendar. Please try again.");
    } finally {
      setSyncing(false);
    }
  };

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
        
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Daily Progress</span>
              <span>{Math.round(completionPercentage)}%</span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
          </div>
          
          {/* Google Calendar Integration Controls */}
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-lg border border-emerald-200 dark:border-emerald-700">
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-emerald-600" />
              <div>
                <p className="font-medium text-emerald-800 dark:text-emerald-200">Google Calendar Integration</p>
                <p className="text-xs text-emerald-600 dark:text-emerald-300">
                  {calendarConnected ? 'Connected - Sync your routine' : 'Connect to create automatic reminders'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {calendarConnected ? (
                <Button
                  onClick={syncRoutineToCalendar}
                  disabled={syncing}
                  variant="outline"
                  size="sm"
                  className="bg-emerald-600 text-white hover:bg-emerald-700 border-emerald-600"
                >
                  {syncing ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Syncing...
                    </>
                  ) : (
                    <>
                      <Bell className="h-4 w-4 mr-2" />
                      Sync Today
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={connectToGoogleCalendar}
                  disabled={syncing}
                  variant="outline"
                  size="sm"
                  className="bg-emerald-600 text-white hover:bg-emerald-700 border-emerald-600"
                >
                  {syncing ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Calendar className="h-4 w-4 mr-2" />
                      Connect
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
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