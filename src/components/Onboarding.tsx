
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";

interface OnboardingProps {
  onComplete: () => void;
}

const Onboarding = ({ onComplete }: OnboardingProps) => {
  const [step, setStep] = useState(0);
  const [userData, setUserData] = useState({
    age: '',
    gender: '',
    height: '',
    weight: '',
    activityLevel: '',
    goal: '',
    dietType: '',
    allergies: [] as string[],
    medicalConditions: '',
    workoutDays: '',
    workoutLocation: ''
  });

  const steps = [
    'Basic Info',
    'Goals & Diet',
    'Health & Fitness',
    'Complete'
  ];

  const handleInputChange = (field: string, value: string | string[]) => {
    setUserData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    localStorage.setItem('healthApp_userData', JSON.stringify(userData));
    toast({
      title: "Welcome to Thrive Today!",
      description: "Your personalized health journey starts now.",
    });
    onComplete();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-green-600">
            🌱 Thrive Today
          </CardTitle>
          <p className="text-muted-foreground">
            Step {step + 1} of {steps.length}: {steps[step]}
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {step === 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Tell us about yourself</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      value={userData.age}
                      onChange={(e) => handleInputChange('age', e.target.value)}
                      placeholder="25"
                    />
                  </div>
                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <Select onValueChange={(value) => handleInputChange('gender', value)}>
                      <SelectTrigger aria-label="Select gender">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      value={userData.height}
                      onChange={(e) => handleInputChange('height', e.target.value)}
                      placeholder="170"
                    />
                  </div>
                  <div>
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      value={userData.weight}
                      onChange={(e) => handleInputChange('weight', e.target.value)}
                      placeholder="70"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Your Goals & Diet</h3>
                <div className="space-y-4">
                  <div>
                    <Label>Primary Goal</Label>
                    <Select onValueChange={(value) => handleInputChange('goal', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your goal" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weight-loss">Weight Loss</SelectItem>
                        <SelectItem value="muscle-gain">Muscle Gain</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="athletic-performance">Athletic Performance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Diet Type</Label>
                    <Select onValueChange={(value) => handleInputChange('dietType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select diet type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="balanced">Balanced</SelectItem>
                        <SelectItem value="keto">Keto</SelectItem>
                        <SelectItem value="vegan">Vegan</SelectItem>
                        <SelectItem value="low-carb">Low Carb</SelectItem>
                        <SelectItem value="mediterranean">Mediterranean</SelectItem>
                        <SelectItem value="paleo">Paleo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Health & Fitness</h3>
                <div className="space-y-4">
                  <div>
                    <Label>Activity Level</Label>
                    <Select onValueChange={(value) => handleInputChange('activityLevel', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select activity level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sedentary">Sedentary</SelectItem>
                        <SelectItem value="lightly-active">Lightly Active</SelectItem>
                        <SelectItem value="moderately-active">Moderately Active</SelectItem>
                        <SelectItem value="very-active">Very Active</SelectItem>
                        <SelectItem value="extra-active">Extra Active</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="medical">Medical Conditions (optional)</Label>
                    <Textarea
                      id="medical"
                      value={userData.medicalConditions}
                      onChange={(e) => handleInputChange('medicalConditions', e.target.value)}
                      placeholder="Any medical conditions, allergies, or dietary restrictions..."
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="text-center space-y-4">
                <div className="text-6xl">🎉</div>
                <h3 className="text-2xl font-semibold">You're all set!</h3>
                <p className="text-muted-foreground">
                  We've created your personalized health plan. Let's start your journey to a healthier you!
                </p>
              </div>
            )}

            <div className="flex justify-between pt-6">
              {step > 0 && (
                <Button
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                >
                  Previous
                </Button>
              )}
              <Button
                onClick={handleNext}
                className="ml-auto bg-green-600 hover:bg-green-700"
              >
                {step === steps.length - 1 ? 'Complete Setup' : 'Next'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;
