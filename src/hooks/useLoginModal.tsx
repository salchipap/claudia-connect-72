
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/hooks/auth';
import { LoginValues } from '@/components/auth/LoginForm';

export const useLoginModal = (onClose: () => void) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [countryCode, setCountryCode] = useState('+57');
  const [loginMethod, setLoginMethod] = useState<'phone' | 'email'>('phone');
  const navigate = useNavigate();
  const { signIn } = useAuth();
  
  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };
  
  const toggleLoginMethod = () => {
    setLoginMethod(prev => prev === 'phone' ? 'email' : 'phone');
  };
  
  const onSubmit = async (values: LoginValues) => {
    setIsLoading(true);
    
    try {
      // Currently we only support email login
      const result = await signIn(values.identifier, values.password);
      
      if (!result.success) {
        console.error('Error en autenticación:', result.error);
        toast({
          title: "Error",
          description: result.error || "Credenciales inválidas. Verifica tu número/email y contraseña.",
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "Inicio de sesión exitoso",
        description: "Bienvenido a ClaudIA.",
      });
      
      handleClose();
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error logging in:', error);
      
      // Mensaje de error más amigable basado en el código de error
      let errorMessage = "Credenciales inválidas o servicio no disponible.";
      
      if (error?.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    countryCode,
    setCountryCode,
    loginMethod,
    toggleLoginMethod,
    handleClose,
    onSubmit
  };
};
