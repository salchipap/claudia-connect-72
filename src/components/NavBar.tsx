
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, User } from 'lucide-react';
import Button from './Button';
import { useAuth } from '@/hooks/useAuth';

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };
  
  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'py-2 bg-[#0e181c]/95 backdrop-blur-sm shadow-lg' : 'py-4 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-claudia-primary">ClaudIA</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link to="/" className="text-claudia-white hover:text-claudia-primary transition-colors">
              Home
            </Link>
            <a href="/#features" className="text-claudia-white hover:text-claudia-primary transition-colors">
              Features
            </a>
            <a href="/#pricing" className="text-claudia-white hover:text-claudia-primary transition-colors">
              Pricing
            </a>
            <Link to="/faq" className="text-claudia-white hover:text-claudia-primary transition-colors">
              FAQ
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/dashboard" className="text-claudia-white hover:text-claudia-primary transition-colors flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  Dashboard
                </Link>
                <Button onClick={handleSignOut} variant="outline" className="text-claudia-white border-claudia-primary/30 hover:bg-claudia-primary hover:text-claudia-white">
                  <LogOut className="h-4 w-4 mr-1" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login">
                  <Button variant="ghost" className="text-claudia-white hover:text-claudia-primary">
                    Log In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-claudia-white hover:text-claudia-primary transition-colors"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#0e181c]/95 backdrop-blur-sm px-4 pt-2 pb-4 shadow-lg">
          <div className="flex flex-col space-y-3">
            <Link to="/" className="text-claudia-white hover:text-claudia-primary transition-colors py-2">
              Home
            </Link>
            <a href="/#features" className="text-claudia-white hover:text-claudia-primary transition-colors py-2">
              Features
            </a>
            <a href="/#pricing" className="text-claudia-white hover:text-claudia-primary transition-colors py-2">
              Pricing
            </a>
            <Link to="/faq" className="text-claudia-white hover:text-claudia-primary transition-colors py-2">
              FAQ
            </Link>
            
            {user ? (
              <>
                <Link to="/dashboard" className="text-claudia-white hover:text-claudia-primary transition-colors py-2 flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  Dashboard
                </Link>
                <button 
                  onClick={handleSignOut}
                  className="text-claudia-white hover:text-claudia-primary transition-colors py-2 flex items-center"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-claudia-white hover:text-claudia-primary transition-colors py-2">
                  Log In
                </Link>
                <Link to="/register" className="text-claudia-white hover:text-claudia-primary transition-colors py-2">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
