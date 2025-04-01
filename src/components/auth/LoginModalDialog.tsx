
import React from 'react';
import { useLoginForm } from '@/hooks/useLoginForm';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Lock, Mail } from 'lucide-react';
import Button from '@/components/Button';
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import VerificationModal from '../VerificationModal';

type LoginModalDialogProps = {
  onClose: () => void;
};

const LoginModalDialog: React.FC<LoginModalDialogProps> = ({ onClose }) => {
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
    <>
      <DialogContent className="bg-[#142126] border-claudia-primary/30 text-claudia-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-claudia-white">Iniciar Sesión</DialogTitle>
          <DialogDescription className="text-claudia-white/70">
            Ingresa tus credenciales para acceder a tu cuenta de ClaudIA
          </DialogDescription>
        </DialogHeader>
        
        {errorMessage && (
          <Alert variant="destructive" className="bg-red-500/10 border border-red-500/30 text-red-200">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="modal-identifier" className="block text-sm font-medium mb-1 text-claudia-white">
              Correo Electrónico
            </label>
            <div className="relative">
              <input
                id="modal-identifier"
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
            <label htmlFor="modal-password" className="block text-sm font-medium mb-1 text-claudia-white">
              Contraseña
            </label>
            <div className="relative">
              <input
                id="modal-password"
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
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
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
              Iniciar Sesión
            </Button>
          </div>
        </form>
      </DialogContent>
      
      {/* Modal de verificación - solo se muestra cuando showVerification es true */}
      {showVerification && (
        <VerificationModal 
          isOpen={showVerification} 
          onClose={() => setShowVerification(false)}
          email={emailForVerification}
        />
      )}
    </>
  );
};

export default LoginModalDialog;
