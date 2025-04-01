
import React, { useState } from 'react';
import NavBar from '@/components/NavBar';
import { useToast } from "@/hooks/use-toast";
import { registerUserWithWebhook } from '@/utils/api';
import VerificationModal from '@/components/VerificationModal';
import Button from '@/components/Button';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, Phone, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import CountrySelect from '@/components/CountrySelect';

const Registration = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+57');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  
  const validateForm = () => {
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Por favor, ingresa tu nombre.",
        variant: "destructive",
      });
      return false;
    }
    
    if (!lastname.trim()) {
      toast({
        title: "Error",
        description: "Por favor, ingresa tu apellido.",
        variant: "destructive",
      });
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Error",
        description: "Por favor, ingresa un correo electrónico válido.",
        variant: "destructive",
      });
      return false;
    }
    
    // Validate phone number without country code
    const phoneRegex = /^\d{7,15}$/;
    if (!phoneRegex.test(phoneNumber.replace(/\D/g, ''))) {
      toast({
        title: "Error",
        description: "Por favor, ingresa un número de teléfono válido (solo números).",
        variant: "destructive",
      });
      return false;
    }
    
    if (password.length < 6) {
      toast({
        title: "Error",
        description: "La contraseña debe tener al menos 6 caracteres.",
        variant: "destructive",
      });
      return false;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden.",
        variant: "destructive",
      });
      return false;
    }
    
    if (!acceptedTerms) {
      toast({
        title: "Error",
        description: "Debes aceptar los términos y condiciones para continuar.",
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
    
    try {
      // Combine country code and phone number
      const fullPhoneNumber = `${countryCode}${phoneNumber}`;
      // Format phone number with WhatsApp format for remotejid
      const formattedPhone = fullPhoneNumber.startsWith('+') ? fullPhoneNumber.substring(1) : fullPhoneNumber;
      
      const response = await registerUserWithWebhook({
        name,
        lastname,
        email,
        remotejid: formattedPhone,
        password,
      });
      
      if (response.success) {
        toast({
          title: "Registro exitoso",
          description: "Por favor verifica tu código.",
        });
        // Open the verification modal after successful registration
        setIsVerificationModalOpen(true);
      } else {
        toast({
          title: "Error en el registro",
          description: response.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Error",
        description: "Ocurrió un error durante el registro. Por favor, intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-[#142126] text-claudia-foreground relative">
      <NavBar />
      
      <main className="pt-20 pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-claudia-white">Registro en ClaudIA</h1>
            <p className="text-claudia-white/70 text-lg">Completa el formulario para comenzar tu experiencia con ClaudIA</p>
          </div>
          
          <div className="max-w-md mx-auto bg-[#1a2a30] rounded-lg shadow-xl p-8 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-claudia-primary opacity-10 rounded-bl-full -z-10"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-claudia-primary opacity-10 rounded-tr-full -z-10"></div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1 text-claudia-white">
                  Nombre
                </label>
                <div className="relative">
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 px-3 py-2 border border-claudia-primary/30 rounded-md focus:outline-none focus:ring-2 focus:ring-claudia-primary bg-[#1a2a30] text-claudia-white"
                    placeholder="Tu nombre"
                    disabled={isLoading}
                  />
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-claudia-primary/70" />
                </div>
              </div>
              
              <div>
                <label htmlFor="lastname" className="block text-sm font-medium mb-1 text-claudia-white">
                  Apellido
                </label>
                <div className="relative">
                  <input
                    id="lastname"
                    type="text"
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                    className="w-full pl-9 px-3 py-2 border border-claudia-primary/30 rounded-md focus:outline-none focus:ring-2 focus:ring-claudia-primary bg-[#1a2a30] text-claudia-white"
                    placeholder="Tu apellido"
                    disabled={isLoading}
                  />
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-claudia-primary/70" />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1 text-claudia-white">
                  Correo electrónico
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 px-3 py-2 border border-claudia-primary/30 rounded-md focus:outline-none focus:ring-2 focus:ring-claudia-primary bg-[#1a2a30] text-claudia-white"
                    placeholder="nombre@ejemplo.com"
                    disabled={isLoading}
                  />
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-claudia-primary/70" />
                </div>
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-1 text-claudia-white">
                  Número de teléfono (WhatsApp)
                </label>
                <div className="flex gap-2">
                  <CountrySelect 
                    value={countryCode}
                    onChange={setCountryCode}
                    disabled={isLoading}
                  />
                  <div className="relative flex-1">
                    <input
                      id="phone"
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full pl-9 px-3 py-2 border border-claudia-primary/30 rounded-md focus:outline-none focus:ring-2 focus:ring-claudia-primary bg-[#1a2a30] text-claudia-white"
                      placeholder="3128310805"
                      disabled={isLoading}
                    />
                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-claudia-primary/70" />
                  </div>
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
                    placeholder="Mínimo 6 caracteres"
                    disabled={isLoading}
                  />
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-claudia-primary/70" />
                </div>
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1 text-claudia-white">
                  Confirmar Contraseña
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-9 px-3 py-2 border border-claudia-primary/30 rounded-md focus:outline-none focus:ring-2 focus:ring-claudia-primary bg-[#1a2a30] text-claudia-white"
                    placeholder="Confirma tu contraseña"
                    disabled={isLoading}
                  />
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-claudia-primary/70" />
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <Checkbox 
                  id="terms" 
                  checked={acceptedTerms}
                  onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                  className="data-[state=checked]:bg-claudia-primary data-[state=checked]:border-claudia-primary border-claudia-primary/50 mt-1"
                />
                <label
                  htmlFor="terms"
                  className="text-sm text-claudia-white/80"
                >
                  Acepto los <Link to="/terms" className="text-claudia-primary hover:underline">Términos y Condiciones</Link> de ClaudIA
                </label>
              </div>
              
              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  loading={isLoading}
                  className="w-full"
                >
                  Registrarme
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
      
      {/* Verification Modal - Only shown after successful registration */}
      {isVerificationModalOpen && (
        <VerificationModal
          isOpen={isVerificationModalOpen}
          onClose={() => setIsVerificationModalOpen(false)}
          email={email}
        />
      )}
    </div>
  );
};

export default Registration;
