
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import { useAuth } from '@/hooks/useAuth';
import LoginForm from '@/components/LoginForm';

const Login = () => {
  const navigate = useNavigate();
  const { user, userProfile, loading: authLoading } = useAuth();
  
  useEffect(() => {
    // Redirect if user is already logged in
    if (user && userProfile) {
      navigate('/dashboard');
    }
  }, [navigate, user, userProfile]);
  
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#142126] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-claudia-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-[#142126] text-claudia-foreground relative">
      <NavBar />
      
      <main className="pt-20 pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-claudia-white">Iniciar sesión en ClaudIA</h1>
            <p className="text-claudia-white/70 text-lg">¡Bienvenido de nuevo! Por favor ingresa tus credenciales</p>
          </div>
          
          <LoginForm />
        </div>
      </main>
    </div>
  );
};

export default Login;
