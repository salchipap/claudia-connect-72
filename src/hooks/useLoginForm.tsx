
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/auth';
import { useToast } from './use-toast';
import { verifyCodeWithWebhook } from '@/utils/api';

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
  
  const validateForm = () => {
    setErrorMessage(null);
    
    if (!identifier.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingresa tu email.",
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
      console.log(`Login attempt - Email: ${identifier}`);
      
      // Intentar iniciar sesión
      const result = await signIn(identifier, password);
      
      if (!result.success) {
        console.error('Login error:', result.error);
        setErrorMessage(result.error || 'Error al iniciar sesión');
        setIsLoading(false);
        return;
      }
      
      // Siempre mostrar el modal de verificación después de un inicio de sesión exitoso
      console.log('Login successful, showing verification modal');
      setEmailForVerification(identifier);
      if (result.userId) {
        setUserIdForVerification(result.userId);
      }
      setShowVerification(true);
      setIsLoading(false);
      
    } catch (error: any) {
      console.error('Login error:', error);
      setErrorMessage(error.message || 'Ocurrió un error durante el inicio de sesión');
      setIsLoading(false);
    }
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
    handleSubmit
  };
}
