
import React, { useState, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import { useToast } from "@/hooks/use-toast";
import Button from '@/components/Button';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, Phone } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import CountrySelect from '@/components/CountrySelect';

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, userProfile, signIn, loading: authLoading } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loginMethod, setLoginMethod] = useState<'phone' | 'email'>('phone');
  const [countryCode, setCountryCode] = useState('+57');

  useEffect(() => {
    // Redirect if user is already logged in
    if (user && userProfile) {
      navigate('/dashboard');
    }
  }, [navigate, user, userProfile]);
  
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
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      let email = identifier;
      
      // Si es teléfono, formateamos para convertirlo en email
      if (loginMethod === 'phone') {
        // Quitamos cualquier espacio o caracter especial que no sea número
        const cleanPhone = identifier.replace(/\D/g, '');
        
        // Formateamos el número de teléfono según Supabase
        // Importante: NO debemos combinar el código de país si ya está incluido en el número
        let formattedPhone;
        
        // Verificamos si el usuario ya incluyó el código de país en el input
        if (cleanPhone.startsWith('0')) {
          // Si comienza con 0, quitamos el 0 y agregamos el código de país sin el +
          formattedPhone = countryCode.substring(1) + cleanPhone.substring(1);
        } else if (cleanPhone.startsWith(countryCode.substring(1))) {
          // Si ya incluye el código de país, lo dejamos como está
          formattedPhone = cleanPhone;
        } else {
          // Si no incluye el código, lo agregamos
          formattedPhone = countryCode.substring(1) + cleanPhone;
        }
        
        console.log('Número formateado para login:', formattedPhone);
        
        // Convertir a email para Supabase (usando el formato del teléfono como usuario)
        email = `${formattedPhone}@claudia.ai`;
        
        console.log('Intentando login con teléfono formateado como email:', email);
      } else {
        console.log('Intentando login con email:', email);
      }
      
      const { data, error } = await signIn(email, password);
      
      if (error) {
        console.error('Supabase login error:', error);
        throw error;
      }
      
      toast({
        title: "Inicio de sesión exitoso",
        description: "¡Bienvenido de nuevo!",
      });
      
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Login error details:', error);
      
      let errorMsg = "Email o contraseña inválidos. Por favor intenta de nuevo.";
      
      // Manejar errores específicos de Supabase
      if (error.message) {
        if (error.message.includes("Invalid login credentials")) {
          errorMsg = "Credenciales inválidas. Verifica tu número/email y contraseña.";
        } else {
          errorMsg = error.message;
        }
      }
      
      setErrorMessage(errorMsg);
      
      toast({
        title: "Error de inicio de sesión",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleLoginMethod = () => {
    setLoginMethod(prev => prev === 'phone' ? 'email' : 'phone');
    setIdentifier('');
  };
  
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
                        type="text"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
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
        </div>
      </main>
    </div>
  );
};

export default Login;
