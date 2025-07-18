import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, AlertTriangle, Shield, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";

const TermsOfService = () => {
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
                  <FileText className="h-8 w-8 text-emerald-600" />
                </div>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-700 via-teal-700 to-blue-700 dark:from-emerald-300 dark:via-teal-300 dark:to-blue-300 bg-clip-text text-transparent">
                Terms of Service
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                These terms govern your use of our health and fitness application. Please read them carefully.
              </p>
              <p className="text-sm text-muted-foreground">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            {/* Acceptance of Terms */}
            <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-white/30 dark:border-gray-700/30">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-emerald-600" />
                  <span>Acceptance of Terms</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  By accessing and using SourcePoint Health & Fitness App ("the App"), you accept and agree to be bound by these Terms of Service. 
                  If you do not agree to these terms, please do not use the App.
                </p>
              </CardContent>
            </Card>

            {/* Description of Service */}
            <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-white/30 dark:border-gray-700/30">
              <CardHeader>
                <CardTitle>Description of Service</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  SourcePoint is a comprehensive health and fitness application that provides:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li>Personalized workout routines and fitness tracking</li>
                  <li>Nutritional guidance and meal planning</li>
                  <li>AI-powered health coaching and recommendations</li>
                  <li>Calendar integration for health reminders</li>
                  <li>Progress monitoring and health analytics</li>
                  <li>Voice-activated assistance and food recognition</li>
                  <li>Community features and expert guidance</li>
                </ul>
              </CardContent>
            </Card>

            {/* Medical Disclaimer */}
            <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-white/30 dark:border-gray-700/30 border-l-4 border-l-orange-500">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-orange-600">
                  <AlertTriangle className="h-5 w-5" />
                  <span>Important Medical Disclaimer</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                  <p className="text-sm font-medium text-orange-800 dark:text-orange-200 mb-2">
                    ⚠️ This App is NOT a substitute for professional medical advice, diagnosis, or treatment.
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-orange-700 dark:text-orange-300 text-sm ml-4">
                    <li>Always consult with qualified healthcare professionals before starting any fitness or nutrition program</li>
                    <li>The AI recommendations are for informational purposes only</li>
                    <li>Individual results may vary and are not guaranteed</li>
                    <li>Stop any activity if you experience pain or discomfort</li>
                    <li>Seek immediate medical attention for any health emergencies</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* User Responsibilities */}
            <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-white/30 dark:border-gray-700/30">
              <CardHeader>
                <CardTitle>User Responsibilities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <h4 className="font-semibold">You agree to:</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li>Provide accurate and complete information about your health status</li>
                  <li>Use the App responsibly and in accordance with safety guidelines</li>
                  <li>Respect the intellectual property rights of the App</li>
                  <li>Not share your account credentials with others</li>
                  <li>Report any technical issues or safety concerns promptly</li>
                  <li>Maintain the confidentiality of your personal health data</li>
                </ul>

                <h4 className="font-semibold mt-4">You agree NOT to:</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li>Use the App for any illegal or unauthorized purposes</li>
                  <li>Attempt to reverse engineer or hack the App</li>
                  <li>Share false or misleading health information</li>
                  <li>Use the App if you have medical conditions that require supervision</li>
                  <li>Distribute malware or attempt to damage the App</li>
                </ul>
              </CardContent>
            </Card>

            {/* Data and Privacy */}
            <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-white/30 dark:border-gray-700/30">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-emerald-600" />
                  <span>Data and Privacy</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Your privacy and data security are paramount. By using this App, you acknowledge that:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li>You have read and understood our Privacy Policy</li>
                  <li>You consent to the collection and processing of your health data as outlined</li>
                  <li>You understand how third-party integrations work</li>
                  <li>You can withdraw consent and delete your data at any time</li>
                  <li>We implement industry-standard security measures</li>
                </ul>
                
                <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                  <p className="text-sm text-emerald-700 dark:text-emerald-300">
                    📋 <Link to="/privacy-policy" className="underline font-medium">View our complete Privacy Policy</Link> for detailed information about data handling.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Limitation of Liability */}
            <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-white/30 dark:border-gray-700/30">
              <CardHeader>
                <CardTitle>Limitation of Liability</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  To the fullest extent permitted by law, SourcePoint and its developers shall not be liable for:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li>Any injuries, health issues, or medical complications arising from App use</li>
                  <li>Loss of data or technical malfunctions</li>
                  <li>Indirect, incidental, or consequential damages</li>
                  <li>Actions taken based on AI recommendations</li>
                  <li>Third-party service failures or data breaches</li>
                  <li>Loss of business, profits, or revenue</li>
                </ul>
                
                <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Maximum Liability:</strong> Our total liability to you for any damages shall not exceed the amount you paid for the App in the 12 months preceding the claim.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Intellectual Property */}
            <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-white/30 dark:border-gray-700/30">
              <CardHeader>
                <CardTitle>Intellectual Property</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li>The App and all its content are protected by copyright and other intellectual property laws</li>
                  <li>You receive a limited, non-exclusive license to use the App for personal purposes</li>
                  <li>You retain ownership of your personal health data</li>
                  <li>Workout routines, meal plans, and AI algorithms remain our intellectual property</li>
                  <li>Any feedback or suggestions you provide may be used to improve the App</li>
                </ul>
              </CardContent>
            </Card>

            {/* Termination */}
            <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-white/30 dark:border-gray-700/30">
              <CardHeader>
                <CardTitle>Termination</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">You may terminate:</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                      <li>Your account at any time through the App settings</li>
                      <li>Your use of the App by uninstalling it</li>
                      <li>Specific data sharing permissions as desired</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">We may terminate:</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                      <li>Your access if you violate these terms</li>
                      <li>The service with 30 days notice for any reason</li>
                      <li>Specific features due to technical limitations</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Changes to Terms */}
            <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-white/30 dark:border-gray-700/30">
              <CardHeader>
                <CardTitle>Changes to These Terms</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We may update these Terms of Service from time to time. When we do, we will:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4 mt-2">
                  <li>Notify you through the App or email</li>
                  <li>Update the "Last Updated" date</li>
                  <li>Provide a summary of significant changes</li>
                  <li>Give you time to review before the changes take effect</li>
                </ul>
                <p className="text-muted-foreground mt-4">
                  Continued use of the App after changes indicates your acceptance of the updated terms.
                </p>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-white/30 dark:border-gray-700/30">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Questions about these Terms of Service? Contact us:
                </p>
                <div className="space-y-2 text-sm">
                  <p><strong>Email:</strong> legal@sourcepoint.health</p>
                  <p><strong>Support:</strong> support@sourcepoint.health</p>
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

export default TermsOfService;