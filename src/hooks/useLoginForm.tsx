
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
      
      // Pass information to signIn about the login method
      const { data, error } = await signIn(
        identifier,
        password,
        isPhoneLogin,
        countryCode
      );
      
      if (error) {
        console.error('Login error details:', error);
        throw error;
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
          errorMsg = "Credenciales inválidas. Verifica tu número/email y contraseña.";
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
