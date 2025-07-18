import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Lock, Eye, UserCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";

const PrivacyPolicy = () => {
  return (
    <ThemeProvider defaultTheme="light" storageKey="sourcepoint-theme">
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <Link to="/">
              <Button variant="ghost" className="mb-4 hover:bg-white/20">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to App
              </Button>
            </Link>
            
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                  <Shield className="h-8 w-8 text-emerald-600" />
                </div>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-700 via-teal-700 to-blue-700 dark:from-emerald-300 dark:via-teal-300 dark:to-blue-300 bg-clip-text text-transparent">
                Privacy Policy
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Your privacy is important to us. This policy explains how we collect, use, and protect your health and fitness data.
              </p>
              <p className="text-sm text-muted-foreground">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            {/* Information We Collect */}
            <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-white/30 dark:border-gray-700/30">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="h-5 w-5 text-emerald-600" />
                  <span>Information We Collect</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Health & Fitness Data</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                    <li>Workout routines, exercise logs, and fitness progress</li>
                    <li>Nutritional information, meal tracking, and dietary preferences</li>
                    <li>Sleep patterns and recovery metrics</li>
                    <li>Body measurements and health goals</li>
                    <li>Supplement intake and medication reminders</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Technical Data</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                    <li>Device information and operating system</li>
                    <li>App usage analytics and performance data</li>
                    <li>Camera data for food recognition (processed locally)</li>
                    <li>Voice data for AI assistant (processed securely)</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Third-Party Integrations</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                    <li>Google Calendar data (with your explicit permission)</li>
                    <li>Fitness device sync data (optional)</li>
                    <li>Health app integrations (user-controlled)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* How We Use Your Data */}
            <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-white/30 dark:border-gray-700/30">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <UserCheck className="h-5 w-5 text-emerald-600" />
                  <span>How We Use Your Data</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li><strong>Personalized Health Coaching:</strong> AI-powered recommendations based on your goals and progress</li>
                  <li><strong>Progress Tracking:</strong> Monitor your fitness journey and health improvements</li>
                  <li><strong>Smart Reminders:</strong> Calendar integration for meal times, workouts, and supplements</li>
                  <li><strong>Food Recognition:</strong> Camera-based nutritional analysis and meal logging</li>
                  <li><strong>Voice Assistance:</strong> Natural language interaction for hands-free app control</li>
                  <li><strong>App Improvement:</strong> Anonymous analytics to enhance user experience</li>
                </ul>
              </CardContent>
            </Card>

            {/* Data Security */}
            <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-white/30 dark:border-gray-700/30">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lock className="h-5 w-5 text-emerald-600" />
                  <span>Data Security & Storage</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Security Measures</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                    <li>End-to-end encryption for all sensitive health data</li>
                    <li>Secure API communications with industry-standard protocols</li>
                    <li>Regular security audits and vulnerability assessments</li>
                    <li>Multi-factor authentication support</li>
                    <li>Secure data storage with access controls</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Data Storage</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                    <li>Data stored locally on your device when possible</li>
                    <li>Cloud storage with encrypted backups for synchronization</li>
                    <li>Data retention policies aligned with health data regulations</li>
                    <li>Geographic data residency compliance</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Your Rights */}
            <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-white/30 dark:border-gray-700/30">
              <CardHeader>
                <CardTitle>Your Privacy Rights</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li><strong>Access:</strong> Request a copy of your personal data</li>
                  <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                  <li><strong>Deletion:</strong> Request deletion of your data (subject to legal requirements)</li>
                  <li><strong>Portability:</strong> Export your data in a machine-readable format</li>
                  <li><strong>Objection:</strong> Opt-out of certain data processing activities</li>
                  <li><strong>Restriction:</strong> Limit how we process your data</li>
                </ul>
              </CardContent>
            </Card>

            {/* Third-Party Services */}
            <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-white/30 dark:border-gray-700/30">
              <CardHeader>
                <CardTitle>Third-Party Services</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  We integrate with third-party services to enhance your experience. These integrations are optional and require your explicit consent:
                </p>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold">Google Services</h4>
                    <p className="text-sm text-muted-foreground">Calendar integration for reminders and scheduling. Governed by Google's Privacy Policy.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold">AI Services</h4>
                    <p className="text-sm text-muted-foreground">External AI APIs for enhanced coaching and recommendations. Data is anonymized and encrypted.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold">Analytics</h4>
                    <p className="text-sm text-muted-foreground">Anonymous usage analytics to improve app performance. No personal health data is shared.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-white/30 dark:border-gray-700/30">
              <CardHeader>
                <CardTitle>Contact Us</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  If you have questions about this Privacy Policy or your data rights, please contact us:
                </p>
                <div className="space-y-2 text-sm">
                  <p><strong>Email:</strong> privacy@sourcepoint.health</p>
                  <p><strong>Address:</strong> [Your Company Address]</p>
                  <p><strong>Phone:</strong> [Your Phone Number]</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default PrivacyPolicy;