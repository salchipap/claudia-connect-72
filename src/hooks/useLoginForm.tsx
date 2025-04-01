
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
      let email = identifier;
      
      // Si es teléfono, formateamos para convertirlo en email
      if (loginMethod === 'phone') {
        // Quitamos cualquier espacio o caracter especial que no sea número
        const cleanPhone = identifier.replace(/\D/g, '');
        
        // Formateamos el número de teléfono según Supabase
        // Importante: NO debemos combinar el código de país si ya está incluido en el número
        let formattedPhone;
        
        // Verificamos si el usuario ya incluyó el código de país en el input
        if (cleanPhone.startsWith('0')) {
          // Si comienza con 0, quitamos el 0 y agregamos el código de país sin el +
          formattedPhone = countryCode.substring(1) + cleanPhone.substring(1);
        } else if (cleanPhone.startsWith(countryCode.substring(1))) {
          // Si ya incluye el código de país, lo dejamos como está
          formattedPhone = cleanPhone;
        } else {
          // Si no incluye el código, lo agregamos
          formattedPhone = countryCode.substring(1) + cleanPhone;
        }
        
        console.log('Número formateado para login:', formattedPhone);
        
        // Convertir a email para Supabase (usando el formato del teléfono como usuario)
        email = `${formattedPhone}@claudia.ai`;
        
        console.log('Intentando login con teléfono formateado como email:', email);
      } else {
        console.log('Intentando login con email:', email);
      }
      
      const { data, error } = await signIn(email, password);
      
      if (error) {
        console.error('Supabase login error:', error);
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
