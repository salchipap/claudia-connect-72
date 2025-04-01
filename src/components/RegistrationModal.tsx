
import React, { useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { useToast } from "@/hooks/use-toast";
import { registerUserWithWebhook } from '@/utils/api';
import VerificationModal from './VerificationModal';
import RegistrationForm, { RegistrationFormData } from './forms/RegistrationForm';

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
  const [isLoading, setIsLoading] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  
  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };
  
  const handleSubmit = async (formData: RegistrationFormData) => {
    setIsLoading(true);
    
    try {
      // Combine country code and phone number
      const fullPhoneNumber = `${formData.countryCode}${formData.phoneNumber}`;
      // Format phone number with WhatsApp format for remotejid
      const formattedPhone = fullPhoneNumber.startsWith('+') ? fullPhoneNumber.substring(1) : fullPhoneNumber;
      
      const response = await registerUserWithWebhook({
        name: formData.name,
        lastname: formData.lastname,
        email: formData.email,
        remotejid: formattedPhone,
        password: formData.password,
      });
      
      if (response.success) {
        toast({
          title: "Registro exitoso",
          description: "Por favor verifica tu código.",
        });
        // Store email for verification modal
        setUserEmail(formData.email);
        // Close the registration modal
        handleClose();
        // Open the verification modal
        setIsVerificationModalOpen(true);
      } else {
        toast({
          title: "Error en el registro",
          description: response.message || "Hubo un problema al registrar tu cuenta.",
          variant: "destructive",
        });
      }
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
      
      {/* Verification Modal - Only shown after successful registration */}
      {isVerificationModalOpen && (
        <VerificationModal
          isOpen={isVerificationModalOpen}
          onClose={() => setIsVerificationModalOpen(false)}
          email={userEmail}
        />
      )}
    </>
  );
};

export default RegistrationModal;
