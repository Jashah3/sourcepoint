
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Shield, Clock, AlertTriangle } from "lucide-react";

export const SupplementTracker = () => {
  const [takenToday, setTakenToday] = useState<string[]>([]);

  const supplements = [
    {
      id: 'vitamin-d',
      name: 'Vitamin D3',
      dosage: '2000 IU',
      timing: 'Morning with food',
      benefits: 'Bone health, immune system',
      taken: false
    },
    {
      id: 'omega-3',
      name: 'Omega-3',
      dosage: '1000mg',
      timing: 'With meals',
      benefits: 'Heart health, brain function',
      taken: false
    },
    {
      id: 'protein',
      name: 'Whey Protein',
      dosage: '25g',
      timing: 'Post-workout',
      benefits: 'Muscle recovery, growth',
      taken: true
    },
    {
      id: 'creatine',
      name: 'Creatine',
      dosage: '5g',
      timing: 'Anytime',
      benefits: 'Strength, power output',
      taken: true
    }
  ];

  const recommendations = [
    {
      supplement: 'Magnesium',
      reason: 'Based on your workout intensity',
      dosage: '400mg before bed',
      priority: 'high'
    },
    {
      supplement: 'B-Complex',
      reason: 'For energy and recovery',
      dosage: '1 tablet with breakfast',
      priority: 'medium'
    }
  ];

  const handleToggleSupplement = (supplementId: string) => {
    setTakenToday(prev => 
      prev.includes(supplementId)
        ? prev.filter(id => id !== supplementId)
        : [...prev, supplementId]
    );
  };

  const completionRate = (takenToday.length / supplements.length) * 100;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            💊 Daily Supplement Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Today's Progress</span>
              <span className="text-sm text-muted-foreground">
                {takenToday.length} of {supplements.length} taken
              </span>
            </div>
            <Progress value={completionRate} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Supplements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {supplements.map((supplement) => (
              <div key={supplement.id} className="flex items-start space-x-3 p-4 border rounded-lg">
                <Checkbox
                  checked={takenToday.includes(supplement.id)}
                  onCheckedChange={() => handleToggleSupplement(supplement.id)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{supplement.name}</h4>
                    <Badge variant="secondary">{supplement.dosage}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">
                    <Clock className="inline h-3 w-3 mr-1" />
                    {supplement.timing}
                  </p>
                  <p className="text-sm text-green-600">{supplement.benefits}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Personalized Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium">{rec.supplement}</h4>
                    <p className="text-sm text-muted-foreground">{rec.reason}</p>
                  </div>
                  <Badge variant={rec.priority === 'high' ? 'destructive' : 'secondary'}>
                    {rec.priority} priority
                  </Badge>
                </div>
                <p className="text-sm font-medium mb-3">Suggested: {rec.dosage}</p>
                <Button variant="outline" size="sm">
                  Add to My Stack
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            Safety Reminders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <p className="font-medium mb-1">⚠️ Interaction Warning</p>
              <p>Taking Vitamin D and Magnesium together enhances absorption</p>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="font-medium mb-1">💡 Tip</p>
              <p>Take omega-3 with fat-containing meals for better absorption</p>
            </div>
            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <p className="font-medium mb-1">🚫 Daily Limits</p>
              <p>Don't exceed 4000 IU of Vitamin D per day without consulting a doctor</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
