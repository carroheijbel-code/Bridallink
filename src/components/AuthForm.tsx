import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Heart, Mail, Lock, User } from 'lucide-react';
import { toast } from '../utils/toast';

interface User {
  id: string;
  email: string;
  name: string;
  weddingDate?: string;
}

interface AuthFormProps {
  onLogin: (userData: User) => void;
}

export function AuthForm({ onLogin }: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  const [signupForm, setSignupForm] = useState({
    name: '',
    email: '',
    password: '',
    weddingDate: ''
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock authentication - in real app, this would be a Supabase call
      if (loginForm.email && loginForm.password) {
        const userData = {
          id: '1',
          email: loginForm.email,
          name: 'Beautiful Bride'
        };
        
        onLogin(userData);
        toast.success('Welcome back to BridalLink!');
      } else {
        toast.error('Please fill in all fields');
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock registration - in real app, this would be a Supabase call
      if (signupForm.name && signupForm.email && signupForm.password) {
        const userData = {
          id: '1',
          email: signupForm.email,
          name: signupForm.name,
          weddingDate: signupForm.weddingDate
        };
        
        onLogin(userData);
        toast.success('Welcome to BridalLink! Your wedding planning journey begins now.');
      } else {
        toast.error('Please fill in all required fields');
      }
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = () => {
    const guestUser = {
      id: 'guest',
      email: 'guest@bridallink.com',
      name: 'Guest User'
    };
    onLogin(guestUser);
    toast.success('Welcome! You\'re using BridalLink as a guest.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Welcome */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <Heart className="h-12 w-12 text-pink-500" />
            <h1 className="text-4xl font-bold text-gray-800">BridalLink</h1>
          </div>
          <p className="text-lg text-gray-600">
            Your complete wedding planning companion
          </p>
        </div>

        {/* Auth Tabs */}
        <Card className="shadow-xl">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login">
              <CardHeader>
                <CardTitle className="text-center">Welcome Back</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="Enter your password"
                        className="pl-10"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-pink-500 hover:bg-pink-600"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing In...' : 'Sign In'}
                  </Button>
                </form>
              </CardContent>
            </TabsContent>

            {/* Signup Tab */}
            <TabsContent value="signup">
              <CardHeader>
                <CardTitle className="text-center">Start Your Journey</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="Enter your full name"
                        className="pl-10"
                        value={signupForm.name}
                        onChange={(e) => setSignupForm({...signupForm, name: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10"
                        value={signupForm.email}
                        onChange={(e) => setSignupForm({...signupForm, email: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="Create a password"
                        className="pl-10"
                        value={signupForm.password}
                        onChange={(e) => setSignupForm({...signupForm, password: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="wedding-date">Wedding Date (Optional)</Label>
                    <Input
                      id="wedding-date"
                      type="date"
                      value={signupForm.weddingDate}
                      onChange={(e) => setSignupForm({...signupForm, weddingDate: e.target.value})}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-pink-500 hover:bg-pink-600"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </form>
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Guest Access */}
        <Card className="border-gray-200">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-gray-600 mb-3">
              Want to explore BridalLink first?
            </p>
            <Button 
              variant="outline" 
              onClick={handleGuestLogin}
              className="w-full border-pink-200 text-pink-600 hover:bg-pink-50"
            >
              Continue as Guest
            </Button>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-500">
            Plan your perfect Mallorca wedding with expert guidance
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-400">
            <span>• Budget Tracking</span>
            <span>• Guest Management</span>
            <span>• Expert Consultations</span>
            <span>• Bride Community</span>
          </div>
        </div>
      </div>
    </div>
  );
}