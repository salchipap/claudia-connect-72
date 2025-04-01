
import React from 'react';
import FeatureCard from './FeatureCard';
import { Search, FileText, Image, Globe, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from './Button';

const FeaturesSection: React.FC = () => {
  const features = [{
    icon: <Search size={24} />,
    title: 'Búsquedas inteligentes',
    description: 'Accede a información precisa y actualizada de internet con búsquedas optimizadas por IA.'
  }, {
    icon: <FileText size={24} />,
    title: 'Análisis de documentos',
    description: 'Extrae información clave de documentos complejos y obtén respuestas precisas sobre su contenido.'
  }, {
    icon: <Globe size={24} />,
    title: 'Traducción avanzada',
    description: 'Traduce textos manteniendo el contexto y los matices culturales con alta precisión.'
  }, {
    icon: <Image size={24} />,
    title: 'Extracción de texto',
    description: 'Convierte el texto de imágenes a formato digital con reconocimiento óptico avanzado.'
  }, {
    icon: <MessageCircle size={24} />,
    title: 'Conversación natural',
    description: 'Interactúa de forma natural con respuestas claras, relevantes y personalizadas.'
  }];
  
  return <section id="features" className="py-24 px-6 relative">
      {/* Background accent */}
      <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-claudia-muted to-transparent opacity-70 -z-10"></div>
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 text-slate-50 md:text-5xl">Potencia tu productividad</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            ClaudIA integra tecnologías avanzadas para ofrecerte soluciones inteligentes en distintos escenarios
          </p>
          <div className="mt-8">
            <Button 
              to="/know-claudia" 
              variant="primary"
              className="bg-claudia-primary/20 text-claudia-primary hover:bg-claudia-primary/30"
            >
              Conoce más sobre ClaudIA
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => <FeatureCard key={index} {...feature} delay={index * 100} />)}
        </div>
      </div>
    </section>;
};

export default FeaturesSection;
