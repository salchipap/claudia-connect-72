
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from './Button';
import LoginModal from './LoginModal';
import RegistrationModal from './RegistrationModal';
import { useAuth } from '@/hooks/useAuth';

const NavBar: React.FC = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const openRegistrationModal = () => {
    console.log('Opening registration modal');
    setIsRegistrationModalOpen(true);
  };

  const closeRegistrationModal = () => {
    console.log('Closing registration modal');
    setIsRegistrationModalOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="bg-[#142126] p-4 flex items-center justify-between text-claudia-foreground">
      <Link to="/" className="text-lg font-bold">
        ClaudIA
      </Link>

      <div className="space-x-4">
        {user ? (
          <>
            <Button onClick={() => navigate('/dashboard')} variant="secondary">
              Dashboard
            </Button>
            <Button onClick={handleSignOut} variant="ghost">
              Sign Out
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={openLoginModal}
              variant="outlined"
              className="text-claudia-white border-claudia-white"
            >
              Log In
            </Button>
            <Button 
              onClick={openRegistrationModal}
              variant="primary"
            >
              Registrarme
            </Button>
          </>
        )}
      </div>

      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
      <RegistrationModal isOpen={isRegistrationModalOpen} onClose={closeRegistrationModal} />
    </nav>
  );
};

export default NavBar;
