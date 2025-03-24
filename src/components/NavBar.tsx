
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import Button from './Button';
import { cn } from '@/lib/utils';
import { useMobile } from '@/hooks/use-mobile';

const NavBar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isMobile = useMobile();
  
  const isActive = (path: string) => location.pathname === path;
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="fixed w-full z-50 bg-[#142126]/80 backdrop-blur-md border-b border-claudia-primary/10">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2" onClick={closeMenu}>
          <span className="text-xl font-bold text-claudia-white">
            Claud<span className="text-claudia-primary">IA</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className={cn("hidden lg:flex items-center space-x-8")}>
          <Link
            to="/"
            className={cn(
              "text-sm font-medium transition-colors",
              isActive("/")
                ? "text-claudia-primary"
                : "text-claudia-white/70 hover:text-claudia-white"
            )}
          >
            Inicio
          </Link>
          <Link
            to="/pricing"
            className={cn(
              "text-sm font-medium transition-colors",
              isActive("/pricing")
                ? "text-claudia-primary"
                : "text-claudia-white/70 hover:text-claudia-white"
            )}
          >
            Precios
          </Link>
          <Link
            to="/faq"
            className={cn(
              "text-sm font-medium transition-colors",
              isActive("/faq")
                ? "text-claudia-primary"
                : "text-claudia-white/70 hover:text-claudia-white"
            )}
          >
            FAQ
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="hidden lg:flex items-center space-x-4">
          <Button
            href="https://wa.me/573128310805"
            variant="ghost"
            size="sm"
            className="text-claudia-white hover:text-claudia-primary"
          >
            Iniciar Sesión
          </Button>
          <Button
            to="/register"
            variant="outlined"
            size="sm"
            className="text-claudia-white"
          >
            Registrarse
          </Button>
          <Button
            href="https://wa.me/573128310805"
            variant="primary"
            size="sm"
          >
            Chatear con ClaudIA
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden text-claudia-white hover:text-claudia-primary"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && isMobile && (
        <div className="lg:hidden absolute w-full bg-[#142126] border-b border-claudia-primary/10 animate-fade-in-down">
          <div className="container mx-auto px-6 py-4 flex flex-col space-y-4">
            <Link
              to="/"
              className={cn(
                "py-2 text-sm font-medium transition-colors",
                isActive("/")
                  ? "text-claudia-primary"
                  : "text-claudia-white/70 hover:text-claudia-white"
              )}
              onClick={closeMenu}
            >
              Inicio
            </Link>
            <Link
              to="/pricing"
              className={cn(
                "py-2 text-sm font-medium transition-colors",
                isActive("/pricing")
                  ? "text-claudia-primary"
                  : "text-claudia-white/70 hover:text-claudia-white"
              )}
              onClick={closeMenu}
            >
              Precios
            </Link>
            <Link
              to="/faq"
              className={cn(
                "py-2 text-sm font-medium transition-colors",
                isActive("/faq")
                  ? "text-claudia-primary"
                  : "text-claudia-white/70 hover:text-claudia-white"
              )}
              onClick={closeMenu}
            >
              FAQ
            </Link>
            <div className="pt-2 flex flex-col space-y-2">
              <Button
                href="https://wa.me/573128310805"
                variant="ghost"
                className="w-full justify-center text-claudia-white"
                onClick={closeMenu}
              >
                Iniciar Sesión
              </Button>
              <Button
                to="/register"
                variant="outlined"
                className="w-full justify-center text-claudia-white"
                onClick={closeMenu}
              >
                Registrarse
              </Button>
              <Button
                href="https://wa.me/573128310805"
                variant="primary"
                className="w-full justify-center"
                onClick={closeMenu}
              >
                Chatear con ClaudIA
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default NavBar;
