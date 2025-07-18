import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Heart, Shield, FileText } from "lucide-react";

const Footer = () => {
  return (
    <Card className="w-full bg-white/60 dark:bg-gray-900/60 backdrop-blur-md border border-white/30 dark:border-gray-700/30 mt-8">
      <div className="p-6">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          {/* Brand */}
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg">
              <Heart className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">SourcePoint</h3>
              <p className="text-xs text-muted-foreground">Health & Fitness AI</p>
            </div>
          </div>

          {/* Links */}
          <div className="flex items-center space-x-6">
            <Link 
              to="/privacy-policy" 
              className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Shield className="h-4 w-4" />
              <span>Privacy Policy</span>
            </Link>
            
            <Separator orientation="vertical" className="h-4" />
            
            <Link 
              to="/terms-of-service" 
              className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <FileText className="h-4 w-4" />
              <span>Terms of Service</span>
            </Link>
          </div>

          {/* Copyright */}
          <div className="text-xs text-muted-foreground text-center md:text-right">
            <p>© {new Date().getFullYear()} SourcePoint Health.</p>
            <p>All rights reserved.</p>
          </div>
        </div>
        
        <Separator className="my-4" />
        
        {/* Additional Info */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            This app provides health and fitness guidance. Always consult healthcare professionals for medical advice.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default Footer;