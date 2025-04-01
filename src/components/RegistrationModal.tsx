import React, { useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { useToast } from "@/hooks/use-toast";
import RegistrationForm, { RegistrationFormData } from './forms/RegistrationForm';
import { useAuth } from '@/hooks/auth';

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
  const { signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleClose = () => {
    if (!isLoading) {
      console.log('Handling close of registration modal');
      onClose();
    }
  };
  
  const handleSubmit = async (formData: RegistrationFormData) => {
    setIsLoading(true);
    
    try {
      // Limpiamos el número de teléfono para usar solo números
      const cleanPhone = formData.phoneNumber.replace(/\D/g, '');
      
      // Verificamos si el usuario ya incluyó el código de país en el input
      let formattedPhone;
      const countryCodeWithoutPlus = formData.countryCode.substring(1);
      
      if (cleanPhone.startsWith('0')) {
        // Si comienza con 0, quitamos el 0 y agregamos el código de país sin el +
        formattedPhone = countryCodeWithoutPlus + cleanPhone.substring(1);
      } else if (cleanPhone.startsWith(countryCodeWithoutPlus)) {
        // Si ya incluye el código de país, lo dejamos como está
        formattedPhone = cleanPhone;
      } else {
        // Si no incluye el código, lo agregamos
        formattedPhone = countryCodeWithoutPlus + cleanPhone;
      }
      
      console.log('Registrando con número:', formattedPhone);
      
      // Register with Supabase Auth
      const result = await signUp(formData.email, formData.password, {
        name: formData.name,
        lastname: formData.lastname,
        remotejid: formattedPhone,
        plan: selectedPlan || 'Basic'
      });
      
      if (!result.success) {
        console.error('Supabase registration error:', result.error);
        toast({
          title: "Error en el registro",
          description: result.error || "Hubo un problema al registrar tu cuenta.",
          variant: "destructive",
        });
        return;
      }
      
      console.log('Supabase registration success!');
      
      // Close the registration modal
      handleClose();
      
      // Show success toast
      toast({
        title: "Registro exitoso",
        description: "¡Tu cuenta ha sido creada con éxito! Ya puedes iniciar sesión.",
      });
      
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Error",
        description: error.message || "Ocurrió un error durante el registro. Por favor, intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Early return if modal is not open
  if (!isOpen) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-[#142126] rounded-lg w-full max-w-md shadow-xl animate-fade-in-up relative overflow-hidden text-claudia-white">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-claudia-primary opacity-10 rounded-bl-full -z-10"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-claudia-primary opacity-10 rounded-tr-full -z-10"></div>
            
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-1 text-claudia-white">Regístrate en ClaudIA</h2>
              <p className="text-claudia-white/70 mb-6">Completa el formulario para comenzar tu experiencia con ClaudIA</p>
              
              <RegistrationForm
                onSubmit={handleSubmit}
                onCancel={handleClose}
                isLoading={isLoading}
                selectedPlan={selectedPlan}
                isModal={true}
              />
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default RegistrationModal;
