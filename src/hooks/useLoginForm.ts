
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export const useLoginForm = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showVerification, setShowVerification] = useState(false);
  const [emailForVerification, setEmailForVerification] = useState('');
  const [userIdForVerification, setUserIdForVerification] = useState('');
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!identifier.trim() || !password.trim()) {
      setErrorMessage('Por favor, completa todos los campos');
      return;
    }
    
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      // Intentar iniciar sesión
      const result = await signIn(identifier, password);
      
      if (!result.success) {
        console.error('Login error:', result.error);
        setErrorMessage(result.error || 'Error al iniciar sesión');
        setIsLoading(false);
        return;
      }
      
      // Verificar si el usuario necesita verificación
      // Suponemos que signIn ahora devuelve userData cuando es necesaria la verificación
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
};
