
import React from 'react';
import { DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import LoginFormComponent from './LoginForm';
import { useLoginModal } from '@/hooks/useLoginModal';

interface LoginModalDialogProps {
  onClose: () => void;
}

const LoginModalDialog: React.FC<LoginModalDialogProps> = ({ onClose }) => {
  const {
    isLoading,
    countryCode,
    setCountryCode,
    loginMethod,
    toggleLoginMethod,
    handleClose,
    onSubmit
  } = useLoginModal(onClose);

  return (
    <DialogContent className="bg-[#142126] border-claudia-primary/20 text-claudia-white p-0 overflow-hidden max-w-md">
      <div className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-claudia-primary opacity-10 rounded-bl-full -z-10"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-claudia-primary opacity-10 rounded-tr-full -z-10"></div>
        
        <div className="p-6">
          <DialogTitle className="text-2xl font-bold mb-1 text-claudia-white">Iniciar Sesión</DialogTitle>
          <DialogDescription className="text-claudia-white/70 mb-6">
            Ingresa con tu {loginMethod === 'phone' ? 'número de WhatsApp' : 'correo electrónico'} y contraseña
          </DialogDescription>
          
          <LoginFormComponent
            onSubmit={onSubmit}
            isLoading={isLoading}
            loginMethod={loginMethod}
            toggleLoginMethod={toggleLoginMethod}
            countryCode={countryCode}
            setCountryCode={setCountryCode}
            onCancel={handleClose}
          />
        </div>
      </div>
    </DialogContent>
  );
};

export default LoginModalDialog;
