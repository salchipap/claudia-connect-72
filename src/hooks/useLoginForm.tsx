import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/hooks/useAuth';

type LoginMethod = 'phone' | 'email';

export function useLoginForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('phone');
  const [countryCode, setCountryCode] = useState('+57');
  
  const validateForm = () => {
    setErrorMessage(null);
    
    if (!identifier.trim()) {
      toast({
        title: "Error",
        description: `Por favor ingresa tu ${loginMethod === 'phone' ? 'teléfono' : 'email'}.`,
        variant: "destructive",
      });
      return false;
    }
    
    if (!password.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingresa tu contraseña.",
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
    setErrorMessage(null);
    
    try {
      console.log(`Login attempt - Method: ${loginMethod}, Identifier: ${identifier}`);
      
      const isPhoneLogin = loginMethod === 'phone';
      let formattedIdentifier = identifier;
      
      // Format the phone number for login if needed
      if (isPhoneLogin) {
        // Strip any non-digit characters
        const cleanPhone = identifier.replace(/\D/g, '');
        
        // Handle country code formatting
        const cleanCountryCode = countryCode.startsWith('+') 
          ? countryCode.substring(1) 
          : countryCode;
        
        // Format correctly based on input
        if (cleanPhone.startsWith('0')) {
          // If number starts with 0, remove it and add country code
          formattedIdentifier = cleanCountryCode + cleanPhone.substring(1);
        } else if (cleanPhone.startsWith(cleanCountryCode)) {
          // If number already includes country code, use as is
          formattedIdentifier = cleanPhone;
        } else {
          // Otherwise, add country code to number
          formattedIdentifier = cleanCountryCode + cleanPhone;
        }
        
        console.log('Formatted phone for login:', formattedIdentifier);
      }
      
      // Pass information to signIn about the login method
      const { data, error } = await signIn(
        isPhoneLogin ? formattedIdentifier : identifier,
        password,
        isPhoneLogin,
        countryCode
      );
      
      if (error) {
        console.error('Login error details:', error);
        
        let errorMsg = "Credenciales inválidas. Por favor intenta de nuevo.";
        
        if (error.message) {
          if (error.message.includes("Invalid login credentials")) {
            errorMsg = isPhoneLogin 
              ? "Número de teléfono o contraseña incorrectos. Verifica tus datos e intenta de nuevo."
              : "Email o contraseña incorrectos. Verifica tus datos e intenta de nuevo.";
          } else {
            errorMsg = error.message;
          }
        }
        
        setErrorMessage(errorMsg);
        
        toast({
          title: "Error de inicio de sesión",
          description: errorMsg,
          variant: "destructive",
        });
        
        return;
      }
      
      toast({
        title: "Inicio de sesión exitoso",
        description: "¡Bienvenido de nuevo!",
      });
      
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Login error details:', error);
      
      let errorMsg = "Email o contraseña inválidos. Por favor intenta de nuevo.";
      
      // Manejar errores específicos de Supabase
      if (error.message) {
        if (error.message.includes("Invalid login credentials")) {
          errorMsg = loginMethod === 'phone'
            ? "Número de teléfono o contraseña incorrectos. Verifica tus datos e intenta de nuevo."
            : "Email o contraseña incorrectos. Verifica tus datos e intenta de nuevo.";
        } else {
          errorMsg = error.message;
        }
      }
      
      setErrorMessage(errorMsg);
      
      toast({
        title: "Error de inicio de sesión",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleLoginMethod = () => {
    setLoginMethod(prev => prev === 'phone' ? 'email' : 'phone');
    setIdentifier('');
  };
  
  return {
    identifier,
    setIdentifier,
    password,
    setPassword,
    isLoading,
    errorMessage,
    loginMethod,
    countryCode,
    setCountryCode,
    handleSubmit,
    toggleLoginMethod
  };
}
