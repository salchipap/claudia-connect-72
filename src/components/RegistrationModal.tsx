
import React, { useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
import Button from './Button';
import { useToast } from "@/hooks/use-toast";
import { registerUserWithWebhook } from '@/utils/api';
import VerificationModal from './VerificationModal';

type RegistrationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan?: string;
};

const RegistrationModal: React.FC<RegistrationModalProps> = ({ 
  isOpen, 
  onClose,
  selectedPlan = ''
}) => {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  
  const handleClose = () => {
    if (!isLoading) {
      onClose();
      // Reset form after a short delay to avoid visual jumps
      setTimeout(() => {
        setName('');
        setLastname('');
        setEmail('');
        setPhone('');
      }, 300);
    }
  };
  
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
    
    const phoneRegex = /^\d{10,15}$/;
    if (!phoneRegex.test(phone.replace(/\D/g, ''))) {
      toast({
        title: "Error",
        description: "Por favor, ingresa un número de teléfono válido.",
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
      // Format phone number with WhatsApp format for remotejid
      const formattedPhone = phone.startsWith('+') ? phone.substring(1) : phone;
      
      const response = await registerUserWithWebhook({
        name,
        lastname,
        email,
        remotejid: formattedPhone,
      });
      
      if (response.success) {
        toast({
          title: "Registro exitoso",
          description: "Por favor verifica tu código.",
        });
        // Close the registration modal
        handleClose();
        // Open the verification modal
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
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-[#142126] rounded-lg w-full max-w-md shadow-xl animate-fade-in-up relative overflow-hidden text-claudia-white">
            {/* Decorative element */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-claudia-primary opacity-10 rounded-bl-full -z-10"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-claudia-primary opacity-10 rounded-tr-full -z-10"></div>
            
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-1 text-claudia-white">Regístrate en ClaudIA</h2>
              {selectedPlan && (
                <p className="text-claudia-primary mb-4">Plan seleccionado: {selectedPlan}</p>
              )}
              <p className="text-claudia-white/70 mb-6">Completa el formulario para comenzar tu experiencia con ClaudIA</p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1 text-claudia-white">
                    Nombre
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-claudia-primary/30 rounded-md focus:outline-none focus:ring-2 focus:ring-claudia-primary bg-[#1a2a30] text-claudia-white"
                    placeholder="Tu nombre"
                    disabled={isLoading}
                  />
                </div>
                
                <div>
                  <label htmlFor="lastname" className="block text-sm font-medium mb-1 text-claudia-white">
                    Apellido
                  </label>
                  <input
                    id="lastname"
                    type="text"
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                    className="w-full px-3 py-2 border border-claudia-primary/30 rounded-md focus:outline-none focus:ring-2 focus:ring-claudia-primary bg-[#1a2a30] text-claudia-white"
                    placeholder="Tu apellido"
                    disabled={isLoading}
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1 text-claudia-white">
                    Correo electrónico
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-claudia-primary/30 rounded-md focus:outline-none focus:ring-2 focus:ring-claudia-primary bg-[#1a2a30] text-claudia-white"
                    placeholder="nombre@ejemplo.com"
                    disabled={isLoading}
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-1 text-claudia-white">
                    Número de teléfono (WhatsApp)
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-claudia-primary/30 rounded-md focus:outline-none focus:ring-2 focus:ring-claudia-primary bg-[#1a2a30] text-claudia-white"
                    placeholder="+573128310805"
                    disabled={isLoading}
                  />
                </div>
                
                <div className="flex justify-end space-x-3 pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleClose}
                    disabled={isLoading}
                    className="text-claudia-white hover:text-claudia-primary"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    loading={isLoading}
                  >
                    Registrarme
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Dialog>
      
      {/* Verification Modal - Only shown after successful registration */}
      {isVerificationModalOpen && (
        <VerificationModal
          isOpen={isVerificationModalOpen}
          onClose={() => setIsVerificationModalOpen(false)}
          email={email}
        />
      )}
    </>
  );
};

export default RegistrationModal;
