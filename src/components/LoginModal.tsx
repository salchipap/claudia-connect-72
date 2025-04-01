
import React from 'react';
import { Dialog } from '@/components/ui/dialog';
import LoginModalDialog from './auth/LoginModalDialog';

type LoginModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const LoginModal: React.FC<LoginModalProps> = ({ 
  isOpen, 
  onClose
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <LoginModalDialog onClose={onClose} />
    </Dialog>
  );
};

export default LoginModal;
