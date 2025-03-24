
import React, { useState, useEffect } from 'react';
import Button from './Button';

const NavBar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 py-4 px-6 transition-all duration-300 ${
        isScrolled ? 'glass-morphism shadow-sm py-3' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="text-2xl font-bold text-claudia-white">
          ClaudIA
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-claudia-white hover:text-claudia-primary transition-colors">
            Funciones
          </a>
          <a href="#pricing" className="text-claudia-white hover:text-claudia-primary transition-colors">
            Precios
          </a>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button 
            href="https://wa.me/573128310805"
            variant="ghost"
            size="sm"
            className="text-claudia-white hover:text-claudia-primary"
          >
            Chatear con ClaudIA
          </Button>
          <Button 
            href="#register"
            variant="primary"
            size="sm"
          >
            Registrarse
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
