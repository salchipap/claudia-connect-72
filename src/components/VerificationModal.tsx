
import React, { useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
import Button from './Button';
import { useToast } from "@/hooks/use-toast";
import { verifyCodeWithWebhook } from '@/utils/api';

type VerificationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  userId?: string;
};

const VerificationModal: React.FC<VerificationModalProps> = ({ 
  isOpen, 
  onClose,
  email,
  userId
}) => {
  const { toast } = useToast();
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleClose = () => {
    if (!isLoading) {
      onClose();
      // Reset form after a short delay to avoid visual jumps
      setTimeout(() => {
        setCode('');
      }, 300);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code.trim()) {
      toast({
        title: "Error",
        description: "Por favor, ingresa el código de verificación.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await verifyCodeWithWebhook({
        code,
        email,
        userId
      });
      
      if (response.success) {
        toast({
          title: "Verificación exitosa",
          description: "Tu cuenta ha sido verificada correctamente.",
        });
        handleClose();
        
        // Redirect to WhatsApp after successful verification (this serves as the login)
        window.location.href = "https://wa.me/573128310805";
      } else {
        toast({
          title: "Error de verificación",
          description: response.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Verification error:', error);
      toast({
        title: "Error",
        description: "Ocurrió un error durante la verificación. Por favor, intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <div className="bg-[#142126] rounded-lg w-full max-w-md shadow-xl animate-fade-in-up text-claudia-white">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-2 text-claudia-white">Verificación</h2>
            <p className="text-claudia-white/70 mb-6">
              Hemos enviado un código de verificación a tu WhatsApp. Por favor, ingrésalo a continuación para completar tu inicio de sesión.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="code" className="block text-sm font-medium mb-1 text-claudia-white">
                  Código de verificación
                </label>
                <input
                  id="code"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full px-3 py-2 border border-claudia-primary/30 rounded-md focus:outline-none focus:ring-2 focus:ring-claudia-primary bg-[#1a2a30] text-claudia-white"
                  placeholder="Ingresa el código aquí"
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
                  Verificar
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default VerificationModal;
