
import React from 'react';
import NavBar from '@/components/NavBar';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import PricingSection from '@/components/PricingSection';
import { ArrowRight } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen relative">
      <NavBar />
      
      <main>
        <HeroSection />
        <FeaturesSection />
        <PricingSection />
        
        {/* Call to action section */}
        <section id="register" className="py-20 px-6 relative bg-claudia-primary bg-opacity-5">
          <div className="absolute inset-0 bg-gradient-to-r from-claudia-muted via-transparent to-claudia-muted opacity-40 -z-10"></div>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Empieza a utilizar ClaudIA hoy mismo
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Potencia tu trabajo con la asistencia inteligente que necesitas para ser más productivo
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a 
                href="https://wa.me/573128310805" 
                className="px-8 py-3.5 bg-claudia-primary text-white rounded-md font-medium inline-flex items-center hover:bg-opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-claudia-primary focus:ring-offset-2 shadow-md w-full sm:w-auto justify-center"
              >
                Chatear con ClaudIA
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </div>
          </div>
        </section>
        
        {/* Footer */}
        <footer className="bg-background py-12 px-6 border-t border-border">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-xl font-bold text-claudia-primary mb-4">ClaudIA</h3>
                <p className="text-muted-foreground">
                  Inteligencia artificial avanzada para tus necesidades diarias.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Enlaces rápidos</h4>
                <ul className="space-y-2">
                  <li>
                    <a href="#features" className="text-muted-foreground hover:text-claudia-primary transition-colors">
                      Funciones
                    </a>
                  </li>
                  <li>
                    <a href="#pricing" className="text-muted-foreground hover:text-claudia-primary transition-colors">
                      Precios
                    </a>
                  </li>
                  <li>
                    <a href="#register" className="text-muted-foreground hover:text-claudia-primary transition-colors">
                      Registrarse
                    </a>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Contacto</h4>
                <p className="text-muted-foreground mb-2">
                  ¿Tienes preguntas? Contáctanos:
                </p>
                <a 
                  href="https://wa.me/573128310805" 
                  className="inline-flex items-center text-claudia-primary hover:underline"
                >
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Chatear en WhatsApp
                </a>
              </div>
            </div>
            
            <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
              <p>© {new Date().getFullYear()} ClaudIA. Todos los derechos reservados.</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
