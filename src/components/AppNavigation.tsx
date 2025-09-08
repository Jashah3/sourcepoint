import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/contexts/AuthContext';
import UserProfile from './UserProfile';
import ConnectedServicesCard from './ConnectedServicesCard';
import { User, Settings, LogOut, Menu, Link, Shield } from 'lucide-react';
import { toast } from 'sonner';

const AppNavigation: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const [showProfile, setShowProfile] = useState(false);
  const [showServices, setShowServices] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out successfully');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo/Brand */}
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-foreground">HealthTracker</h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:space-x-4">
              <Button
                variant="ghost"
                onClick={() => setShowServices(true)}
                className="flex items-center gap-2"
              >
                <Link className="h-4 w-4" />
                Connected Services
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={profile?.avatar_url || undefined} alt="Profile" />
                      <AvatarFallback>
                        {profile?.display_name ? getInitials(profile.display_name) : 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {profile?.display_name || 'User'}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setShowProfile(true)}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowServices(true)}>
                    <Settings className="mr-2 h-4 w-4" />
                    Connected Services
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <div className="flex flex-col space-y-4 mt-6">
                    {/* User Info */}
                    <div className="flex items-center space-x-3 pb-4 border-b">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={profile?.avatar_url || undefined} alt="Profile" />
                        <AvatarFallback>
                          {profile?.display_name ? getInitials(profile.display_name) : 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">
                          {profile?.display_name || 'User'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {user?.email}
                        </p>
                      </div>
                    </div>

                    {/* Navigation Items */}
                    <Button
                      variant="ghost"
                      className="justify-start"
                      onClick={() => setShowProfile(true)}
                    >
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Button>

                    <Button
                      variant="ghost"
                      className="justify-start"
                      onClick={() => setShowServices(true)}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Connected Services
                    </Button>

                    <div className="pt-4 border-t">
                      <Button
                        variant="ghost"
                        className="justify-start w-full"
                        onClick={handleSignOut}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign out
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      {/* Profile Sheet */}
      <Sheet open={showProfile} onOpenChange={setShowProfile}>
        <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
          <UserProfile />
        </SheetContent>
      </Sheet>

      {/* Services Sheet */}
      <Sheet open={showServices} onOpenChange={setShowServices}>
        <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
          <div className="py-6">
            <ConnectedServicesCard />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default AppNavigation;