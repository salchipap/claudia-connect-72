
import React, { useState } from 'react';
import { useLoginForm } from '@/hooks/useLoginForm';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import LoginFormComponent from './LoginForm';
import VerificationModal from '../VerificationModal';
import CountrySelect from '../CountrySelect';

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
    userIdForVerification,
    handleSubmit
  } = useLoginForm();
  
  const [loginMethod, setLoginMethod] = useState<'phone' | 'email'>('email');
  const [countryCode, setCountryCode] = useState('+57');
  
  const toggleLoginMethod = () => {
    setLoginMethod(prev => prev === 'phone' ? 'email' : 'phone');
    setIdentifier(''); // Clear the identifier when switching methods
  };
  
  const handleFormSubmit = async (values: { identifier: string; password: string }) => {
    if (loginMethod === 'phone') {
      // Format phone number
      const cleanPhone = values.identifier.replace(/\D/g, '');
      const countryCodeWithoutPlus = countryCode.substring(1);
      
      let formattedPhone;
      if (cleanPhone.startsWith('0')) {
        formattedPhone = countryCodeWithoutPlus + cleanPhone.substring(1);
      } else if (cleanPhone.startsWith(countryCodeWithoutPlus)) {
        formattedPhone = cleanPhone;
      } else {
        formattedPhone = countryCodeWithoutPlus + cleanPhone;
      }
      
      // Update identifier with formatted phone
      setIdentifier(formattedPhone);
      setPassword(values.password);
    } else {
      // Just use email as is
      setIdentifier(values.identifier);
      setPassword(values.password);
    }
    
    // Submit the form after a short delay to ensure state updates
    setTimeout(() => {
      handleSubmit();
    }, 0);
  };

  return (
    <DialogContent className="bg-[#142126] border-claudia-primary/20 text-claudia-white p-0 overflow-hidden max-w-md">
      <div className="relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-claudia-primary opacity-10 rounded-bl-full -z-10"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-claudia-primary opacity-10 rounded-tr-full -z-10"></div>
        
        <div className="p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-claudia-white">Iniciar Sesión</DialogTitle>
            <DialogDescription className="text-claudia-white/70">
              Ingresa tus credenciales para acceder a ClaudIA
            </DialogDescription>
          </DialogHeader>
          
          {errorMessage && (
            <Alert variant="destructive" className="mt-4 mb-4 bg-red-500/10 border border-red-500/30 text-red-200">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
          
          <div className="mt-4">
            <LoginFormComponent
              onSubmit={handleFormSubmit}
              isLoading={isLoading}
              loginMethod={loginMethod}
              toggleLoginMethod={toggleLoginMethod}
              countryCode={countryCode}
              setCountryCode={setCountryCode}
              onCancel={onClose}
            />
          </div>
        </div>
      </div>
      
      {/* Modal de verificación - solo se muestra cuando showVerification es true */}
      {showVerification && (
        <VerificationModal 
          isOpen={showVerification} 
          onClose={() => setShowVerification(false)}
          email={emailForVerification}
          userId={userIdForVerification}
        />
      )}
    </DialogContent>
  );
};

export default LoginModalDialog;
