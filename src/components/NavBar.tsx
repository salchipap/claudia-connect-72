
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from './Button';
import LoginModal from './LoginModal';
import RegistrationModal from './RegistrationModal';
import { useAuth } from '@/hooks/useAuth';
import { UserCircle, Pizza } from 'lucide-react';

const NavBar: React.FC = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const navigate = useNavigate();
  const { user, userProfile, signOut } = useAuth();

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

  const goToProfile = () => {
    navigate('/dashboard');
  };

  return (
    <nav className="bg-[#142126] p-4 flex items-center justify-between text-claudia-foreground">
      <Link to="/" className="text-lg font-bold">
        ClaudIA
      </Link>

      <div className="space-x-4">
        {user ? (
          <div className="flex items-center gap-4">
            {userProfile && (
              <div className="hidden md:flex items-center gap-2 text-claudia-white/70">
                <Pizza size={16} className="text-claudia-primary" />
                <span>{userProfile.credits || '0'} mensajes</span>
              </div>
            )}
            <Button 
              onClick={goToProfile} 
              variant="ghost"
              className="flex items-center gap-2 text-claudia-white hover:text-claudia-primary"
            >
              <UserCircle size={20} />
              <span className="hidden md:inline">{userProfile?.name || 'Mi perfil'}</span>
            </Button>
            <Button onClick={handleSignOut} variant="ghost" className="text-claudia-white hover:text-claudia-primary">
              Cerrar Sesión
            </Button>
          </div>
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
