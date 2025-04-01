
import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';
import Button from '@/components/Button';
import { useLoginForm } from '@/hooks/useLoginForm';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import VerificationModal from './VerificationModal';

const LoginForm = () => {
  const {
    identifier,
    setIdentifier,
    password,
    setPassword,
    isLoading,
    errorMessage,
    showVerification,
    setShowVerification,
    emailForVerification,
    handleSubmit
  } = useLoginForm();

  return (
    <div className="max-w-md mx-auto bg-[#1a2a30] rounded-lg shadow-xl p-8 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-claudia-primary opacity-10 rounded-bl-full -z-10"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-claudia-primary opacity-10 rounded-tr-full -z-10"></div>
      
      {errorMessage && (
        <Alert variant="destructive" className="mb-4 bg-red-500/10 border border-red-500/30 text-red-200">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="identifier" className="block text-sm font-medium mb-1 text-claudia-white">
            Correo Electrónico
          </label>
          
          <div className="relative">
            <input
              id="identifier"
              type="email"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full pl-9 px-3 py-2 border border-claudia-primary/30 rounded-md focus:outline-none focus:ring-2 focus:ring-claudia-primary bg-[#1a2a30] text-claudia-white"
              placeholder="correo@ejemplo.com"
              disabled={isLoading}
            />
            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-claudia-primary/70" />
          </div>
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1 text-claudia-white">
            Contraseña
          </label>
          <div className="relative">
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-9 px-3 py-2 border border-claudia-primary/30 rounded-md focus:outline-none focus:ring-2 focus:ring-claudia-primary bg-[#1a2a30] text-claudia-white"
              placeholder="Tu contraseña"
              disabled={isLoading}
            />
            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-claudia-primary/70" />
          </div>
        </div>
        
        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            loading={isLoading}
            className="w-full"
          >
            Iniciar Sesión
          </Button>
        </div>
        
        <div className="text-center mt-4 text-claudia-white/70 text-sm">
          ¿No tienes una cuenta?{" "}
          <Link to="/register" className="text-claudia-primary hover:underline">
            Regístrate
          </Link>
        </div>
      </form>
      
      {/* Modal de verificación - solo se muestra cuando showVerification es true */}
      {showVerification && (
        <VerificationModal 
          isOpen={showVerification} 
          onClose={() => setShowVerification(false)}
          email={emailForVerification}
        />
      )}
    </div>
  );
};

export default LoginForm;
