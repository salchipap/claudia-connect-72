
import React from 'react';
import LoginForm from '@/components/LoginForm';
import NavBar from '@/components/NavBar';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Link to="/" className="inline-flex items-center text-claudia-white/70 hover:text-claudia-primary mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a inicio
          </Link>
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-claudia-white">Iniciar sesión en ClaudIA</h1>
            <p className="text-claudia-white/70 mt-2">
              Ingresa con tu número o correo electrónico para continuar
            </p>
          </div>
          
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Login;
