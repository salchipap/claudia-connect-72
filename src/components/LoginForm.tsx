
import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, Mail, Phone } from 'lucide-react';
import Button from '@/components/Button';
import CountrySelect from '@/components/CountrySelect';
import { useLoginForm } from '@/hooks/useLoginForm';

const LoginForm = () => {
  const {
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
  } = useLoginForm();

  // Manejar el cambio del número telefónico, eliminando cualquier caracter no numérico
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remover caracteres no numéricos para asegurar que solo se ingresen números
    const numericValue = e.target.value.replace(/\D/g, '');
    setIdentifier(numericValue);
  };

  return (
    <div className="max-w-md mx-auto bg-[#1a2a30] rounded-lg shadow-xl p-8 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-claudia-primary opacity-10 rounded-bl-full -z-10"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-claudia-primary opacity-10 rounded-tr-full -z-10"></div>
      
      <div className="text-center mb-4">
        <button 
          onClick={toggleLoginMethod}
          className="text-claudia-primary text-sm underline hover:text-claudia-primary/80"
          type="button"
        >
          ¿Prefieres iniciar sesión con {loginMethod === 'phone' ? 'correo electrónico' : 'teléfono'}?
        </button>
      </div>
      
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-md text-red-200 text-sm">
          <p>{errorMessage}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="identifier" className="block text-sm font-medium mb-1 text-claudia-white">
            {loginMethod === 'phone' ? 'Número de WhatsApp' : 'Correo Electrónico'}
          </label>
          
          {loginMethod === 'phone' ? (
            <div className="flex gap-2">
              <CountrySelect 
                value={countryCode}
                onChange={setCountryCode}
                disabled={isLoading}
              />
              <div className="relative flex-1">
                <input
                  id="identifier"
                  type="tel" 
                  pattern="[0-9]*"
                  inputMode="numeric"
                  value={identifier}
                  onChange={handlePhoneChange}
                  className="w-full pl-9 px-3 py-2 border border-claudia-primary/30 rounded-md focus:outline-none focus:ring-2 focus:ring-claudia-primary bg-[#1a2a30] text-claudia-white"
                  placeholder="3128310805"
                  disabled={isLoading}
                />
                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-claudia-primary/70" />
              </div>
            </div>
          ) : (
            <div className="relative">
              <input
                id="identifier"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full pl-9 px-3 py-2 border border-claudia-primary/30 rounded-md focus:outline-none focus:ring-2 focus:ring-claudia-primary bg-[#1a2a30] text-claudia-white"
                placeholder="correo@ejemplo.com"
                disabled={isLoading}
              />
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-claudia-primary/70" />
            </div>
          )}
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
    </div>
  );
};

export default LoginForm;
