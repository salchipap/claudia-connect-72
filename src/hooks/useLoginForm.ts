
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from './useAuth';
import { useNavigate } from 'react-router-dom';
import { sendCodeToWhatsApp } from '@/utils/api';

export const useLoginForm = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showVerification, setShowVerification] = useState(false);
  
  // Mantener el correo para la verificación posterior
  const [emailForVerification, setEmailForVerification] = useState('');
  // Mantener el ID del usuario para la verificación
  const [userIdForVerification, setUserIdForVerification] = useState('');

  const { toast } = useToast();
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    
    if (!identifier || !password) {
      setErrorMessage('Por favor, completa todos los campos');
      return;
    }
    
    // Verificar formato de correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(identifier)) {
      setErrorMessage('Por favor, ingresa un correo electrónico válido');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Realizar la validación inicial de credenciales
      const signInResult = await signIn(identifier, password);
      
      if (!signInResult.success) {
        console.error('Error signing in:', signInResult.error);
        throw new Error(signInResult.error || 'Error al iniciar sesión');
      }
      
      // Extraer los datos del usuario de la sesión actual
      const userData = signInResult.userData || {};
      console.log('User data for verification:', userData);
      
      // Guardar el correo electrónico para usarlo en la verificación
      setEmailForVerification(identifier);
      
      // Guardar el ID del usuario para la verificación
      if (userData.id) {
        setUserIdForVerification(userData.id);
      }
      
      // Si las credenciales son correctas, enviar código de verificación con todos los datos del usuario
      const sendCodeResult = await sendCodeToWhatsApp({
        email: identifier,
        id: userData.id,
        name: userData.user_metadata?.name || userData.name,
        lastname: userData.user_metadata?.lastname || userData.lastname,
        phone: userData.user_metadata?.remotejid || userData.phone
      });
      
      if (!sendCodeResult.success) {
        throw new Error(sendCodeResult.message);
      }
      
      toast({
        title: "Código enviado",
        description: "Hemos enviado un código de verificación a tu WhatsApp.",
      });
      
      // Mostrar el modal de verificación
      setShowVerification(true);
      
      // No redirigir aún - esperar a que complete la verificación
      
    } catch (error: any) {
      console.error('Login error:', error);
      setErrorMessage(error.message || 'Error al iniciar sesión');
      toast({
        title: "Error",
        description: error.message || "Ocurrió un error durante el inicio de sesión.",
        variant: "destructive",
      });
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
