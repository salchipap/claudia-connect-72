
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/auth';
import { useToast } from './use-toast';
import { verifyCodeWithWebhook } from '@/utils/api';

type LoginMethod = 'phone' | 'email';

export function useLoginForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showVerification, setShowVerification] = useState(false);
  const [emailForVerification, setEmailForVerification] = useState('');
  const [userIdForVerification, setUserIdForVerification] = useState('');
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('email');
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
  
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      console.log(`Login attempt - Method: ${loginMethod}, Identifier: ${identifier}`);
      
      // Intentar iniciar sesión
      const result = await signIn(identifier, password);
      
      if (!result.success) {
        console.error('Login error:', result.error);
        setErrorMessage(result.error || 'Error al iniciar sesión');
        setIsLoading(false);
        return;
      }
      
      // Verificar si el usuario necesita verificación
      if (result.needsVerification && result.email) {
        console.log('User needs verification');
        setEmailForVerification(result.email);
        if (result.userId) {
          setUserIdForVerification(result.userId);
        }
        setShowVerification(true);
        setIsLoading(false);
        return;
      }
      
      // Si todo salió bien, mostrar toast y redirigir
      toast({
        title: "Inicio de sesión exitoso",
        description: "¡Bienvenido de nuevo!",
      });
      
      // Redirigir al dashboard
      navigate('/dashboard');
      
    } catch (error: any) {
      console.error('Login error:', error);
      setErrorMessage(error.message || 'Ocurrió un error durante el inicio de sesión');
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
    showVerification,
    setShowVerification,
    emailForVerification,
    userIdForVerification,
    loginMethod,
    countryCode,
    setCountryCode,
    handleSubmit,
    toggleLoginMethod
  };
}
