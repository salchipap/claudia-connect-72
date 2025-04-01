
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from './Button';
import LoginModal from './LoginModal';
import RegistrationModal from './RegistrationModal';
import { useAuth } from '@/hooks/auth';
import { UserCircle, MessageCircle, Phone, ExternalLink, CalendarDays, Menu, X } from 'lucide-react';

const NavBar: React.FC = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, userProfile, signOut } = useAuth();

  // Close mobile menu when screen size changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const openLoginModal = () => {
    setIsMobileMenuOpen(false);
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const openRegistrationModal = () => {
    setMobileMenuOpen(false);
    setIsRegistrationModalOpen(true);
  };

  const closeRegistrationModal = () => {
    setIsRegistrationModalOpen(false);
  };

  const handleSignOut = async () => {
    setIsMobileMenuOpen(false);
    try {
      await signOut();
      // No navegar manualmente, signOut.ts se encarga de la redirección
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const goToProfile = () => {
    setIsMobileMenuOpen(false);
    navigate('/dashboard');
  };

  const setMobileMenuOpen = (isOpen: boolean) => {
    setIsMobileMenuOpen(isOpen);
    // Prevent scrolling when menu is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  };

  // Extraer número de teléfono del usuario desde remotejid o user_metadata
  const userPhoneNumber = userProfile?.remotejid || 
                          (user?.user_metadata?.remotejid) || 
                          null;
                          
  // Función para abrir WhatsApp
  const openWhatsAppChat = () => {
    setIsMobileMenuOpen(false);
    // Número de WhatsApp de ClaudIA
    const whatsappNumber = "573128310805";
    const message = "Hola ClaudIA, quiero chatear contigo";
    
    // Crear la URL de WhatsApp
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    
    // Abrir en una nueva pestaña
    window.open(whatsappUrl, '_blank');
  };

  return (
    <nav className="bg-[#142126] p-4 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-xl font-bold z-20">
          <span className="text-claudia-white">Claud</span>
          <span className="text-claudia-primary">IA</span>
        </Link>

        {/* Mobile menu button */}
        <button 
          className="md:hidden z-20 text-claudia-white p-2" 
          onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <div className="flex items-center gap-4">
              {userProfile && (
                <div className="hidden lg:flex items-center gap-2 text-claudia-white/70">
                  <MessageCircle size={16} className="text-claudia-primary" />
                  <span>{userProfile.credits || '0'} mensajes</span>
                </div>
              )}
              
              {userProfile && (
                <div className="hidden lg:flex items-center gap-2 text-claudia-white/70">
                  <CalendarDays size={16} className="text-claudia-primary" />
                  <span>{userProfile.reminders || '0'} recordatorios</span>
                </div>
              )}
              
              {userPhoneNumber && (
                <div className="hidden lg:flex items-center gap-2 text-claudia-white/70">
                  <Phone size={16} className="text-claudia-primary" />
                  <span>{userPhoneNumber}</span>
                </div>
              )}
              
              <Button 
                onClick={openWhatsAppChat}
                variant="primary"
                className="flex items-center gap-2"
              >
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full overflow-hidden">
                    <img 
                      src="https://img.recraft.ai/TPT2gnDTOAplVWXdKprcxYJZGSC82p_p5DJzbNYpSyU/rs:fit:1024:1024:0/q:95/g:no/plain/abs://prod/images/8fbdfedc-79e6-4ae5-9912-89c9048c67d8@jpg" 
                      alt="ClaudIA" 
                      className="h-full w-full object-cover" 
                    />
                  </div>
                  <span className="hidden md:inline">Chatear con ClaudIA</span>
                </div>
                <ExternalLink size={14} />
              </Button>
              
              <Button 
                onClick={goToProfile} 
                variant="ghost"
                className="flex items-center gap-2 text-claudia-white hover:text-claudia-primary"
              >
                <UserCircle size={20} />
                <span className="hidden lg:inline">{userProfile?.name || 'Mi perfil'}</span>
              </Button>
              <Button 
                onClick={handleSignOut} 
                variant="ghost" 
                className="text-claudia-white hover:text-claudia-primary"
              >
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
                Iniciar Sesión
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

        {/* Mobile menu */}
        <div className={`fixed inset-0 bg-[#0c1518] z-10 transform ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out md:hidden flex flex-col pt-20 px-6`}>
          <div className="flex flex-col space-y-4">
            {user ? (
              <>
                <div className="border-b border-claudia-primary/20 pb-4 mb-2">
                  <div className="flex items-center gap-3 mb-4">
                    <UserCircle size={24} className="text-claudia-primary" />
                    <div>
                      <p className="text-claudia-white font-medium">{userProfile?.name || 'Usuario'} {userProfile?.lastname || ''}</p>
                      <p className="text-claudia-white/60 text-sm">{user.email}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#1a2a30] p-3 rounded-md">
                      <MessageCircle size={16} className="text-claudia-primary mb-1" />
                      <p className="text-claudia-white/80 text-sm">Mensajes</p>
                      <p className="text-claudia-white font-medium">{userProfile?.credits || '0'}</p>
                    </div>
                    <div className="bg-[#1a2a30] p-3 rounded-md">
                      <CalendarDays size={16} className="text-claudia-primary mb-1" />
                      <p className="text-claudia-white/80 text-sm">Recordatorios</p>
                      <p className="text-claudia-white font-medium">{userProfile?.reminders || '0'}</p>
                    </div>
                  </div>
                </div>
                
                <Button 
                  onClick={openWhatsAppChat}
                  variant="primary"
                  className="w-full flex items-center justify-center gap-2"
                >
                  <div className="h-5 w-5 rounded-full overflow-hidden">
                    <img 
                      src="https://img.recraft.ai/TPT2gnDTOAplVWXdKprcxYJZGSC82p_p5DJzbNYpSyU/rs:fit:1024:1024:0/q:95/g:no/plain/abs://prod/images/8fbdfedc-79e6-4ae5-9912-89c9048c67d8@jpg" 
                      alt="ClaudIA" 
                      className="h-full w-full object-cover" 
                    />
                  </div>
                  <span>Chatear con ClaudIA</span>
                  <ExternalLink size={14} />
                </Button>
                
                <Button 
                  onClick={goToProfile} 
                  variant="outlined"
                  className="w-full"
                >
                  Mi perfil
                </Button>
                
                <Button 
                  onClick={handleSignOut} 
                  variant="ghost" 
                  className="w-full"
                >
                  Cerrar Sesión
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={openLoginModal}
                  variant="outlined"
                  className="w-full"
                >
                  Iniciar Sesión
                </Button>
                <Button 
                  onClick={openRegistrationModal}
                  variant="primary"
                  className="w-full"
                >
                  Registrarme
                </Button>
              </>
            )}
            
            <div className="border-t border-claudia-primary/20 mt-2 pt-4">
              <div className="flex flex-col space-y-3">
                <Link to="/" className="text-claudia-white hover:text-claudia-primary py-2" onClick={() => setMobileMenuOpen(false)}>
                  Inicio
                </Link>
                <Link to="/know-claudia" className="text-claudia-white hover:text-claudia-primary py-2" onClick={() => setMobileMenuOpen(false)}>
                  Conoce ClaudIA
                </Link>
                <Link to="/faq" className="text-claudia-white hover:text-claudia-primary py-2" onClick={() => setMobileMenuOpen(false)}>
                  Preguntas frecuentes
                </Link>
                <Link to="/terms" className="text-claudia-white hover:text-claudia-primary py-2" onClick={() => setMobileMenuOpen(false)}>
                  Términos y condiciones
                </Link>
              </div>
            </div>
          </div>
        </div>

        <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
        <RegistrationModal isOpen={isRegistrationModalOpen} onClose={closeRegistrationModal} />
      </div>
    </nav>
  );
};

export default NavBar;
