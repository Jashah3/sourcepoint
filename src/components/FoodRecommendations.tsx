
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const FoodRecommendations = () => {
  const recommendations = {
    protein: [
      { name: "Chicken Breast", amount: "31g per 100g", benefits: "Complete protein, low fat" },
      { name: "Greek Yogurt", amount: "20g per 100g", benefits: "Probiotics, calcium" },
      { name: "Lentils", amount: "9g per 100g", benefits: "Fiber, iron" },
      { name: "Salmon", amount: "25g per 100g", benefits: "Omega-3, vitamin D" }
    ],
    vitamins: [
      { name: "Spinach", amount: "Vitamin K, A, C", benefits: "Iron, folate" },
      { name: "Bell Peppers", amount: "Vitamin C, A", benefits: "Antioxidants" },
      { name: "Sweet Potatoes", amount: "Vitamin A, C", benefits: "Beta-carotene" },
      { name: "Berries", amount: "Vitamin C, K", benefits: "Antioxidants, fiber" }
    ],
    fats: [
      { name: "Avocado", amount: "15g per 100g", benefits: "Monounsaturated fats" },
      { name: "Nuts", amount: "20g per 100g", benefits: "Healthy fats, protein" },
      { name: "Olive Oil", amount: "100g per 100g", benefits: "Heart-healthy fats" },
      { name: "Chia Seeds", amount: "31g per 100g", benefits: "Omega-3, fiber" }
    ]
  };

  return (
    <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>🌟 Nutrition Recommendations</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="protein" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="protein">Protein Rich</TabsTrigger>
            <TabsTrigger value="vitamins">Vitamin Rich</TabsTrigger>
            <TabsTrigger value="fats">Healthy Fats</TabsTrigger>
          </TabsList>

          {Object.entries(recommendations).map(([category, foods]) => (
            <TabsContent key={category} value={category} className="space-y-3">
              {foods.map((food, index) => (
                <div key={index} className="p-3 bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-700 dark:to-slate-700 rounded-lg border hover:shadow-md transition-all duration-200">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{food.name}</h4>
                    <Badge variant="secondary">{food.amount}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{food.benefits}</p>
                </div>
              ))}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};
