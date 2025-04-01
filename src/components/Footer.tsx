
import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-[#0c1518] text-claudia-white/70 pt-12 md:pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-claudia-white mb-4">ClaudIA</h3>
            <p className="text-sm">
              Asistente virtual inteligente para la gestión de recordatorios y tareas,
              potenciado por inteligencia artificial para mejorar tu productividad.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="https://facebook.com" className="hover:text-claudia-primary" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="https://twitter.com" className="hover:text-claudia-primary" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="https://instagram.com" className="hover:text-claudia-primary" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="https://linkedin.com" className="hover:text-claudia-primary" aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-claudia-white mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-claudia-primary transition-colors">Inicio</Link></li>
              <li><Link to="/faq" className="hover:text-claudia-primary transition-colors">Preguntas Frecuentes</Link></li>
              <li><Link to="/terms" className="hover:text-claudia-primary transition-colors">Términos y Condiciones</Link></li>
              <li><a href="#pricing" className="hover:text-claudia-primary transition-colors">Planes</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-claudia-white mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <MapPin size={16} className="text-claudia-primary" />
                <span>Calle Principal 123, Bogotá, Colombia</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-claudia-primary" />
                <span>+57 (601) 123-4567</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-claudia-primary" />
                <span>info@claudia-ai.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold text-claudia-white mb-4">Boletín Informativo</h3>
            <p className="text-sm mb-4">Suscríbete para recibir noticias y actualizaciones.</p>
            <div className="flex flex-col space-y-2">
              <input 
                type="email" 
                placeholder="Tu correo electrónico" 
                className="px-4 py-2 bg-[#18272e] border border-claudia-primary/20 rounded text-claudia-white"
              />
              <button className="px-4 py-2 bg-claudia-primary text-claudia-white rounded hover:bg-claudia-primary/90 transition-colors">
                Suscribirse
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-claudia-primary/10 text-center text-xs">
          <p>&copy; {currentYear} ClaudIA. Todos los derechos reservados.</p>
          <p className="mt-2">
            Desarrollado con ❤️ en Colombia
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
