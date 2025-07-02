import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Shield, Clock, AlertTriangle, Utensils, Info, Plus } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useHealthData } from "@/contexts/HealthDataContext";
import { useToast } from "@/hooks/use-toast";

export const SupplementTracker = () => {
  const [takenToday, setTakenToday] = useState<string[]>(['protein', 'creatine']);
  const [expandedSupplement, setExpandedSupplement] = useState<string | null>(null);
  const [myStack, setMyStack] = useState<string[]>([
    'Vitamin D3', 'Omega-3 Fish Oil', 'CoQ10', 'Shilajit', 
    'Beetroot Powder', 'Vitamin B2 (Riboflavin)', 'Whey Protein', 'Creatine Monohydrate'
  ]);
  
  const { addSupplement } = useHealthData();
  const { toast } = useToast();

  const supplements = [
    {
      id: 'vitamin-d3',
      name: 'Vitamin D3',
      dosage: '2000 IU',
      timing: 'Morning with breakfast',
      takenWith: 'Fat-containing meal (avocado, nuts, olive oil)',
      benefits: 'Bone health, immune system, mood regulation',
      advantages: ['Improves calcium absorption', 'Supports immune function', 'May reduce depression risk'],
      bestTime: '8:00 AM - 10:00 AM',
      foodPairing: 'Take with eggs, avocado toast, or Greek yogurt with nuts',
      absorption: 'Fat-soluble vitamin - requires dietary fat for optimal absorption',
      taken: false
    },
    {
      id: 'omega-3',
      name: 'Omega-3 Fish Oil',
      dosage: '1000mg EPA/DHA',
      timing: 'With meals (lunch or dinner)',
      takenWith: 'Any meal containing fat',
      benefits: 'Heart health, brain function, inflammation reduction',
      advantages: ['Reduces triglycerides', 'Supports cognitive function', 'Anti-inflammatory properties'],
      bestTime: '12:00 PM or 7:00 PM',
      foodPairing: 'Take with salmon, nuts, or any meal with healthy fats',
      absorption: 'Better absorbed with food, especially fatty meals',
      taken: false
    },
    {
      id: 'coq10',
      name: 'CoQ10',
      dosage: '100mg',
      timing: 'With breakfast or lunch',
      takenWith: 'Fat-containing meal for better absorption',
      benefits: 'Heart health, cellular energy production, antioxidant',
      advantages: ['Supports heart muscle function', 'May reduce muscle pain from statins', 'Powerful antioxidant'],
      bestTime: '9:00 AM or 1:00 PM',
      foodPairing: 'Take with olive oil, nuts, or fish for enhanced absorption',
      absorption: 'Fat-soluble, absorption improves significantly with fat',
      taken: false
    },
    {
      id: 'shilajit',
      name: 'Shilajit',
      dosage: '300mg',
      timing: 'Morning on empty stomach or between meals',
      takenWith: 'Water or warm milk, avoid with coffee/tea',
      benefits: 'Energy, stamina, cognitive function, anti-aging',
      advantages: ['Increases energy levels', 'Supports testosterone', 'Improves brain function', 'Rich in fulvic acid'],
      bestTime: '7:00 AM (empty stomach) or 3:00 PM',
      foodPairing: 'Best taken alone or with warm milk. Wait 30 min before meals',
      absorption: 'Better on empty stomach, avoid tannin-rich beverages',
      taken: false
    },
    {
      id: 'beetroot',
      name: 'Beetroot Powder',
      dosage: '5g (1 tsp)',
      timing: '30-60 minutes before workout',
      takenWith: 'Water or smoothie, can mix with pre-workout meal',
      benefits: 'Nitric oxide boost, improved exercise performance, blood pressure',
      advantages: ['Enhances blood flow', 'Improves workout performance', 'Supports cardiovascular health'],
      bestTime: '60 minutes before exercise',
      foodPairing: 'Mix in smoothie with banana and berries, or take with water',
      absorption: 'Works best when taken consistently, effects peak at 60-90 minutes',
      taken: false
    },
    {
      id: 'vitamin-b2',
      name: 'Vitamin B2 (Riboflavin)',
      dosage: '10mg',
      timing: 'Morning with breakfast',
      takenWith: 'Food to prevent stomach upset',
      benefits: 'Energy metabolism, eye health, skin health',
      advantages: ['Converts food to energy', 'Supports healthy skin', 'Important for eye health'],
      bestTime: '8:00 AM with breakfast',
      foodPairing: 'Take with whole grains, eggs, or dairy products',
      absorption: 'Water-soluble, excess is excreted, take with food',
      taken: false
    },
    {
      id: 'protein',
      name: 'Whey Protein',
      dosage: '25g',
      timing: 'Post-workout (within 30 minutes)',
      takenWith: 'Water, milk, or smoothie',
      benefits: 'Muscle recovery, muscle growth, satiety',
      advantages: ['Rapid absorption', 'Complete amino acid profile', 'Supports muscle protein synthesis'],
      bestTime: 'Within 30 minutes post-workout',
      foodPairing: 'Mix with banana and berries for added carbs and antioxidants',
      absorption: 'Fast-absorbing, ideal for post-workout recovery window',
      taken: true
    },
    {
      id: 'creatine',
      name: 'Creatine Monohydrate',
      dosage: '5g',
      timing: 'Anytime (timing not critical)',
      takenWith: 'Water or juice, can mix with protein shake',
      benefits: 'Strength, power output, muscle volume',
      advantages: ['Increases power output', 'Improves high-intensity performance', 'Supports muscle growth'],
      bestTime: 'Post-workout or anytime daily',
      foodPairing: 'Mix with grape juice for better uptake, or add to protein shake',
      absorption: 'Consistent daily intake more important than timing',
      taken: true
    }
  ];

  const recommendations = [
    {
      supplement: 'Magnesium Glycinate',
      reason: 'Based on your workout intensity and stress levels',
      dosage: '400mg before bed',
      timing: '30 minutes before sleep',
      benefits: 'Better sleep, muscle recovery, reduced cramping',
      priority: 'high'
    },
    {
      supplement: 'Zinc Picolinate',
      reason: 'For immune support and testosterone optimization',
      dosage: '15mg with dinner',
      timing: 'Evening with food',
      benefits: 'Immune function, wound healing, hormone support',
      priority: 'medium'
    }
  ];

  const handleToggleSupplement = (supplementId: string) => {
    setTakenToday(prev => 
      prev.includes(supplementId)
        ? prev.filter(id => id !== supplementId)
        : [...prev, supplementId]
    );
    
    if (!takenToday.includes(supplementId)) {
      const supplement = supplements.find(s => s.id === supplementId);
      if (supplement) {
        addSupplement(supplement.name);
      }
    }
  };

  const handleAddToStack = (supplementName: string) => {
    if (!myStack.includes(supplementName)) {
      setMyStack(prev => [...prev, supplementName]);
      toast({
        title: "Supplement Added!",
        description: `${supplementName} has been added to your stack.`
      });
    } else {
      toast({
        title: "Already in Stack",
        description: `${supplementName} is already in your supplement stack.`
      });
    }
  };

  const completionRate = (takenToday.length / supplements.length) * 100;

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
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
            <Progress value={completionRate} className="h-3" />
            <div className="text-center">
              <p className="text-xs text-muted-foreground">My Stack: {myStack.length} supplements</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Supplement Stack</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {supplements.map((supplement) => (
              <div key={supplement.id} className="group">
                <Collapsible 
                  open={expandedSupplement === supplement.id}
                  onOpenChange={(open) => setExpandedSupplement(open ? supplement.id : null)}
                >
                  <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-900/20 dark:hover:to-indigo-900/20 transition-all duration-200">
                    <Checkbox
                      checked={takenToday.includes(supplement.id)}
                      onCheckedChange={() => handleToggleSupplement(supplement.id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <CollapsibleTrigger asChild>
                        <div className="cursor-pointer">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium">{supplement.name}</h4>
                            <div className="flex gap-2">
                              <Badge variant="secondary">{supplement.dosage}</Badge>
                              {myStack.includes(supplement.name) && (
                                <Badge variant="default" className="text-xs">In Stack</Badge>
                              )}
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">
                            <Clock className="inline h-3 w-3 mr-1" />
                            {supplement.timing}
                          </p>
                          <p className="text-sm text-green-600">{supplement.benefits}</p>
                        </div>
                      </CollapsibleTrigger>
                      
                      <CollapsibleContent className="mt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-800 dark:to-gray-800 rounded-lg">
                          <div className="space-y-3">
                            <div>
                              <h5 className="font-medium text-blue-800 dark:text-blue-200 mb-2">⏰ Optimal Timing</h5>
                              <p className="text-sm mb-1"><strong>Best Time:</strong> {supplement.bestTime}</p>
                              <p className="text-sm"><strong>Take With:</strong> {supplement.takenWith}</p>
                            </div>
                            
                            <div>
                              <h5 className="font-medium text-green-800 dark:text-green-200 mb-2">🍽️ Food Pairing</h5>
                              <p className="text-sm">{supplement.foodPairing}</p>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <div>
                              <h5 className="font-medium text-purple-800 dark:text-purple-200 mb-2">💪 Key Benefits</h5>
                              <ul className="text-sm space-y-1">
                                {supplement.advantages.map((advantage, idx) => (
                                  <li key={idx} className="flex items-start gap-1">
                                    <span className="text-green-600">•</span>
                                    {advantage}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            
                            <div>
                              <h5 className="font-medium text-orange-800 dark:text-orange-200 mb-2">🔬 Absorption</h5>
                              <p className="text-sm text-orange-600 dark:text-orange-400">{supplement.absorption}</p>
                            </div>
                          </div>
                        </div>
                      </CollapsibleContent>
                    </div>
                  </div>
                </Collapsible>
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
              <div key={index} className="p-4 border rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium">{rec.supplement}</h4>
                    <p className="text-sm text-muted-foreground">{rec.reason}</p>
                  </div>
                  <Badge variant={rec.priority === 'high' ? 'destructive' : 'secondary'}>
                    {rec.priority} priority
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm mb-3">
                  <div>
                    <p className="font-medium">Dosage:</p>
                    <p className="text-muted-foreground">{rec.dosage}</p>
                  </div>
                  <div>
                    <p className="font-medium">Timing:</p>
                    <p className="text-muted-foreground">{rec.timing}</p>
                  </div>
                  <div>
                    <p className="font-medium">Benefits:</p>
                    <p className="text-muted-foreground">{rec.benefits}</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleAddToStack(rec.supplement)}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
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
            Safety & Interaction Guide
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="font-medium mb-2 text-green-800 dark:text-green-200">✅ Synergistic Combinations</p>
                <ul className="space-y-1 text-green-700 dark:text-green-300">
                  <li>• Vitamin D3 + Magnesium (improves absorption)</li>
                  <li>• CoQ10 + Omega-3 (heart health boost)</li>
                  <li>• Vitamin B2 + Magnesium (energy metabolism)</li>
                </ul>
              </div>
              
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <p className="font-medium mb-2 text-yellow-800 dark:text-yellow-200">⚠️ Timing Considerations</p>
                <ul className="space-y-1 text-yellow-700 dark:text-yellow-300">
                  <li>• Shilajit: Avoid with coffee/tea (reduces absorption)</li>
                  <li>• Fat-soluble vitamins: Take with meals containing fat</li>
                  <li>• Beetroot: Time with workout for maximum benefit</li>
                </ul>
              </div>
            </div>
            
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <p className="font-medium mb-2 text-red-800 dark:text-red-200">🚫 Safety Limits & Contraindications</p>
              <ul className="space-y-1 text-red-700 dark:text-red-300">
                <li>• Vitamin D3: Don't exceed 4000 IU daily without medical supervision</li>
                <li>• CoQ10: May reduce effectiveness of blood thinners</li>
                <li>• Shilajit: Start with lower dose, may interact with diabetes medications</li>
                <li>• Always consult healthcare provider for medication interactions</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
