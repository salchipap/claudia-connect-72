
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import LoginForm from '@/components/LoginForm';
import { useAuth } from '@/hooks/auth';
import { Navigate } from 'react-router-dom';

const Login = () => {
  const { user } = useAuth();
  
  // Si el usuario ya está autenticado, redirigir al dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center">
        <Link to="/" className="text-claudia-white hover:text-claudia-primary flex items-center gap-1">
          <ArrowLeft size={16} />
          <span>Volver al inicio</span>
        </Link>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-claudia-white mb-2">Iniciar Sesión</h1>
            <p className="text-claudia-white/70">
              Accede a tu cuenta para continuar con ClaudIA
            </p>
          </div>
          
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Login;
