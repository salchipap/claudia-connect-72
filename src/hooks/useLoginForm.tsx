
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/hooks/useAuth';
import { loginUser } from '@/utils/api';

type LoginMethod = 'phone' | 'email';

export function useLoginForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('email'); // Cambiamos a email por defecto
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
      
      // Si es un número de teléfono, intentamos utilizando la API personalizada
      if (loginMethod === 'phone') {
        try {
          // Formatear el número de teléfono quitando espacios y caracteres no numéricos
          const formattedPhone = `${countryCode}${identifier.replace(/\D/g, '')}`;
          
          // Intenta el inicio de sesión con número de teléfono
          const result = await loginUser({
            phone: formattedPhone,
            password
          });
          
          if (result.success) {
            toast({
              title: "Inicio de sesión exitoso",
              description: "¡Bienvenido de nuevo!",
            });
            
            navigate('/dashboard');
            return;
          }
        } catch (phoneError: any) {
          console.error('Error en login con teléfono:', phoneError);
          // Si falla, continuamos con el método de correo electrónico como respaldo
        }
      }
      
      // Para email o como respaldo si falla el teléfono
      // Intentamos convertir el número de teléfono a un formato de email si es necesario
      let emailToUse = identifier;
      
      // Si parece un número de teléfono y no tiene @ (no es un email),
      // lo convertimos a un formato de email
      if (loginMethod === 'phone' && !identifier.includes('@')) {
        emailToUse = `${identifier}@example.com`;
      }
      
      const result = await signIn(emailToUse, password);
      
      if (!result.success) {
        console.error('Login error details:', result.error);
        
        let errorMsg = "Credenciales inválidas. Por favor intenta de nuevo.";
        
        if (result.error) {
          errorMsg = result.error;
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
      
      if (error?.message) {
        errorMsg = error.message;
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
