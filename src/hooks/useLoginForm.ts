
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export const useLoginForm = () => {
  const { toast } = useToast();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loginMethod, setLoginMethod] = useState<'phone' | 'email'>('phone');
  const [countryCode, setCountryCode] = useState('+57');
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const toggleLoginMethod = () => {
    setLoginMethod(prev => prev === 'phone' ? 'email' : 'phone');
    setIdentifier('');
    setErrorMessage('');
  };

  const validateForm = () => {
    if (!identifier.trim()) {
      setErrorMessage(`Por favor, ingresa tu ${loginMethod === 'phone' ? 'número de teléfono' : 'correo electrónico'}`);
      return false;
    }

    if (!password.trim()) {
      setErrorMessage('Por favor, ingresa tu contraseña');
      return false;
    }

    if (loginMethod === 'phone') {
      // Validación básica de teléfono
      const cleanPhone = identifier.replace(/\D/g, '');
      if (cleanPhone.length < 7) {
        setErrorMessage('El número de teléfono debe tener al menos 7 dígitos');
        return false;
      }
    } else {
      // Validación básica de correo
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(identifier)) {
        setErrorMessage('Por favor, ingresa un correo electrónico válido');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      // Llamar a la función de inicio de sesión con los parámetros correctos
      const { data, error } = await signIn(
        identifier, 
        password, 
        loginMethod === 'phone', // indicar si es un inicio de sesión por teléfono
        countryCode
      );

      if (error) {
        console.error('Error en inicio de sesión:', error);
        setErrorMessage(error.message || 'Credenciales inválidas o servicio no disponible.');
        return;
      }

      if (data?.session) {
        toast({
          title: "Inicio de sesión exitoso",
          description: "Bienvenido a ClaudIA",
        });
        navigate('/dashboard');
      } else {
        setErrorMessage('No se pudo iniciar sesión, por favor intenta de nuevo');
      }
    } catch (error: any) {
      console.error('Excepción durante el inicio de sesión:', error);
      setErrorMessage(error.message || 'Ha ocurrido un error inesperado');
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
    loginMethod,
    countryCode,
    setCountryCode,
    handleSubmit,
    toggleLoginMethod
  };
};
