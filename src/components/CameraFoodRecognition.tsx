
import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Camera, Scan, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface FoodRecognitionResult {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  vitamins: string[];
  confidence: number;
}

export const CameraFoodRecognition = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<FoodRecognitionResult | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const ctx = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg');
        setCapturedImage(imageData);
        analyzeFood(imageData);
      }
    }
  };

  const analyzeFood = async (imageData: string) => {
    setIsAnalyzing(true);
    
    // Simulate AI food recognition - in real app, you'd call an API like Clarifai, Google Vision, etc.
    setTimeout(() => {
      const mockResults: FoodRecognitionResult[] = [
        {
          name: "Grilled Chicken Breast",
          calories: 165,
          protein: 31,
          carbs: 0,
          fat: 3.6,
          vitamins: ["B6", "B12", "Niacin", "Selenium"],
          confidence: 0.89
        },
        {
          name: "Mixed Green Salad",
          calories: 45,
          protein: 3,
          carbs: 8,
          fat: 0.5,
          vitamins: ["Vitamin K", "Vitamin A", "Folate", "Vitamin C"],
          confidence: 0.92
        },
        {
          name: "Banana",
          calories: 89,
          protein: 1.1,
          carbs: 22.8,
          fat: 0.3,
          vitamins: ["Vitamin B6", "Vitamin C", "Potassium", "Manganese"],
          confidence: 0.95
        }
      ];
      
      const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)];
      setResult(randomResult);
      setIsAnalyzing(false);
      
      toast({
        title: "Food Recognized!",
        description: `Detected: ${randomResult.name}`,
      });
    }, 2000);
  };

  const addToLog = () => {
    if (result) {
      toast({
        title: "Added to Food Log",
        description: `${result.name} has been logged successfully!`,
      });
      setIsOpen(false);
      setResult(null);
      setCapturedImage(null);
      stopCamera();
    }
  };

  const handleDialogClose = () => {
    setIsOpen(false);
    setResult(null);
    setCapturedImage(null);
    stopCamera();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-none"
          onClick={startCamera}
        >
          <Camera className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Scan className="h-5 w-5 text-green-600" />
            Food Recognition
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {!capturedImage ? (
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-64 object-cover rounded-lg bg-gray-100"
              />
              <Button
                onClick={capturePhoto}
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white hover:bg-gray-100 text-gray-800 rounded-full h-16 w-16"
                size="icon"
              >
                <Camera className="h-8 w-8" />
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <img
                src={capturedImage}
                alt="Captured food"
                className="w-full h-64 object-cover rounded-lg"
              />
              
              {isAnalyzing ? (
                <Card className="animate-pulse">
                  <CardContent className="p-4 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Analyzing food...</p>
                  </CardContent>
                </Card>
              ) : result ? (
                <Card className="animate-fade-in">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      {result.name}
                      <Badge variant="secondary">
                        {Math.round(result.confidence * 100)}% confident
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded">
                        <div className="font-bold text-green-600">{result.calories}</div>
                        <div className="text-muted-foreground">Calories</div>
                      </div>
                      <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                        <div className="font-bold text-blue-600">{result.protein}g</div>
                        <div className="text-muted-foreground">Protein</div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Vitamins & Nutrients:</h4>
                      <div className="flex flex-wrap gap-1">
                        {result.vitamins.map((vitamin, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {vitamin}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <Button onClick={addToLog} className="w-full bg-green-600 hover:bg-green-700">
                      Add to Food Log
                    </Button>
                  </CardContent>
                </Card>
              ) : null}
            </div>
          )}
        </div>
        
        <canvas ref={canvasRef} className="hidden" />
      </DialogContent>
    </Dialog>
  );
};
