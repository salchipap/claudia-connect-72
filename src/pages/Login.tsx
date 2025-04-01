
import React, { useState, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import { useToast } from "@/hooks/use-toast";
import Button from '@/components/Button';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, signIn, loading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Redirect if user is already logged in
    if (user) {
      navigate('/dashboard');
    }
  }, [navigate, user]);
  
  const validateForm = () => {
    if (!email.trim()) {
      toast({
        title: "Error",
        description: "Please enter your email.",
        variant: "destructive",
      });
      return false;
    }
    
    if (!password.trim()) {
      toast({
        title: "Error",
        description: "Please enter your password.",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const { data, error } = await signIn(email, password);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Login error",
        description: error.message || "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#142126] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-claudia-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-[#142126] text-claudia-foreground relative">
      <NavBar />
      
      <main className="pt-20 pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-claudia-white">Log in to ClaudIA</h1>
            <p className="text-claudia-white/70 text-lg">Welcome back! Please enter your credentials</p>
          </div>
          
          <div className="max-w-md mx-auto bg-[#1a2a30] rounded-lg shadow-xl p-8 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-claudia-primary opacity-10 rounded-bl-full -z-10"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-claudia-primary opacity-10 rounded-tr-full -z-10"></div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1 text-claudia-white">
                  Email
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 px-3 py-2 border border-claudia-primary/30 rounded-md focus:outline-none focus:ring-2 focus:ring-claudia-primary bg-[#1a2a30] text-claudia-white"
                    placeholder="name@example.com"
                    disabled={isLoading}
                  />
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-claudia-primary/70" />
                </div>
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1 text-claudia-white">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 px-3 py-2 border border-claudia-primary/30 rounded-md focus:outline-none focus:ring-2 focus:ring-claudia-primary bg-[#1a2a30] text-claudia-white"
                    placeholder="Your password"
                    disabled={isLoading}
                  />
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-claudia-primary/70" />
                </div>
              </div>
              
              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  loading={isLoading}
                  className="w-full"
                >
                  Log in
                </Button>
              </div>
              
              <div className="text-center mt-4 text-claudia-white/70 text-sm">
                Don't have an account?{" "}
                <Link to="/register" className="text-claudia-primary hover:underline">
                  Register
                </Link>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
