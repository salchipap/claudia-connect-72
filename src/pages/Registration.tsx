
import React, { useState, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import { useToast } from "@/hooks/use-toast";
import Button from '@/components/Button';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Lock, Mail, Phone, User } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import CountrySelect from '@/components/CountrySelect';
import { useAuth } from '@/hooks/useAuth';

const Registration = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signUp, loading: authLoading } = useAuth();
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+57');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');

  useEffect(() => {
    // Check for selected plan from location state
    if (location.state && location.state.selectedPlan) {
      setSelectedPlan(location.state.selectedPlan);
    }
    
    // Redirect if user is already logged in
    if (user) {
      navigate('/dashboard');
    }
  }, [location, navigate, user]);
  
  const validateForm = () => {
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Please enter your name.",
        variant: "destructive",
      });
      return false;
    }
    
    if (!lastname.trim()) {
      toast({
        title: "Error",
        description: "Please enter your last name.",
        variant: "destructive",
      });
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return false;
    }
    
    // Validate phone number without country code
    const phoneRegex = /^\d{7,15}$/;
    if (!phoneRegex.test(phoneNumber.replace(/\D/g, ''))) {
      toast({
        title: "Error",
        description: "Please enter a valid phone number (numbers only).",
        variant: "destructive",
      });
      return false;
    }
    
    if (password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return false;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return false;
    }
    
    if (!acceptedTerms) {
      toast({
        title: "Error",
        description: "You must accept the terms and conditions to continue.",
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
      // Combine country code and phone number
      const fullPhoneNumber = `${countryCode}${phoneNumber}`;
      
      // Register with Supabase Auth
      const { data, error } = await signUp(email, password, {
        name,
        lastname,
        remotejid: fullPhoneNumber,
        plan: selectedPlan || 'Basic'
      });
      
      if (error) {
        throw error;
      }
      
      // Success message
      toast({
        title: "Registration successful",
        description: "Please check your email to confirm your account.",
      });
      
      // Navigate to dashboard (auth state will handle redirects if email confirmation is required)
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Registration error",
        description: error.message || "An error occurred during registration. Please try again.",
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
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-claudia-white">Register for ClaudIA</h1>
            <p className="text-claudia-white/70 text-lg">Complete the form to start your ClaudIA experience</p>
            {selectedPlan && (
              <p className="text-claudia-primary mt-2">Selected plan: {selectedPlan}</p>
            )}
          </div>
          
          <div className="max-w-md mx-auto bg-[#1a2a30] rounded-lg shadow-xl p-8 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-claudia-primary opacity-10 rounded-bl-full -z-10"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-claudia-primary opacity-10 rounded-tr-full -z-10"></div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1 text-claudia-white">
                  Name
                </label>
                <div className="relative">
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 px-3 py-2 border border-claudia-primary/30 rounded-md focus:outline-none focus:ring-2 focus:ring-claudia-primary bg-[#1a2a30] text-claudia-white"
                    placeholder="Your name"
                    disabled={isLoading}
                  />
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-claudia-primary/70" />
                </div>
              </div>
              
              <div>
                <label htmlFor="lastname" className="block text-sm font-medium mb-1 text-claudia-white">
                  Last Name
                </label>
                <div className="relative">
                  <input
                    id="lastname"
                    type="text"
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                    className="w-full pl-9 px-3 py-2 border border-claudia-primary/30 rounded-md focus:outline-none focus:ring-2 focus:ring-claudia-primary bg-[#1a2a30] text-claudia-white"
                    placeholder="Your last name"
                    disabled={isLoading}
                  />
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-claudia-primary/70" />
                </div>
              </div>
              
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
                <label htmlFor="phone" className="block text-sm font-medium mb-1 text-claudia-white">
                  Phone Number (WhatsApp)
                </label>
                <div className="flex gap-2">
                  <CountrySelect 
                    value={countryCode}
                    onChange={setCountryCode}
                    disabled={isLoading}
                  />
                  <div className="relative flex-1">
                    <input
                      id="phone"
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full pl-9 px-3 py-2 border border-claudia-primary/30 rounded-md focus:outline-none focus:ring-2 focus:ring-claudia-primary bg-[#1a2a30] text-claudia-white"
                      placeholder="3128310805"
                      disabled={isLoading}
                    />
                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-claudia-primary/70" />
                  </div>
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
                    placeholder="Minimum 6 characters"
                    disabled={isLoading}
                  />
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-claudia-primary/70" />
                </div>
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1 text-claudia-white">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-9 px-3 py-2 border border-claudia-primary/30 rounded-md focus:outline-none focus:ring-2 focus:ring-claudia-primary bg-[#1a2a30] text-claudia-white"
                    placeholder="Confirm your password"
                    disabled={isLoading}
                  />
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-claudia-primary/70" />
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <Checkbox 
                  id="terms" 
                  checked={acceptedTerms}
                  onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                  className="data-[state=checked]:bg-claudia-primary data-[state=checked]:border-claudia-primary border-claudia-primary/50 mt-1"
                />
                <label
                  htmlFor="terms"
                  className="text-sm text-claudia-white/80"
                >
                  I accept the <Link to="/terms" className="text-claudia-primary hover:underline">Terms and Conditions</Link> of ClaudIA
                </label>
              </div>
              
              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  loading={isLoading}
                  className="w-full"
                >
                  Register
                </Button>
              </div>
              
              <div className="text-center mt-4 text-claudia-white/70 text-sm">
                Already have an account?{" "}
                <button
                  type="button"
                  className="text-claudia-primary hover:underline"
                  onClick={() => navigate('/login')}
                >
                  Log in
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Registration;
