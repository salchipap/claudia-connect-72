import React from 'react';
import PricingCard from './PricingCard';
import { useNavigate } from 'react-router-dom';
const PricingSection: React.FC = () => {
  const navigate = useNavigate();
  const handlePricingClick = (planName: string) => {
    navigate('/register', {
      state: {
        selectedPlan: planName
      }
    });
  };
  const pricingTiers = [{
    name: 'Básico',
    price: 'Gratis',
    description: 'Ideal para comenzar a explorar las capacidades de ClaudIA.',
    features: ['Búsquedas simples en internet', '5 traducciones al día', 'Respuestas a preguntas básicas', 'Extracción de texto limitada'],
    cta: 'Comenzar gratis',
    onClick: () => handlePricingClick('Básico')
  }, {
    name: 'Profesional',
    price: '$24.99',
    description: 'Para profesionales que necesitan más potencia y capacidades.',
    features: ['Búsquedas avanzadas e inteligentes', 'Traducciones ilimitadas', 'Análisis detallado de documentos', 'Extracción de texto completa', 'Soporte prioritario'],
    cta: 'Suscribirme',
    highlight: true,
    onClick: () => handlePricingClick('Profesional')
  }, {
    name: 'Empresarial',
    price: '$49.99',
    description: 'Solución completa para equipos y empresas.',
    features: ['Todo lo de Profesional', 'Múltiples usuarios', 'Integraciones personalizadas', 'Análisis avanzado de imágenes', 'Soporte dedicado 24/7', 'API para desarrolladores'],
    cta: 'Contactar ventas',
    onClick: () => handlePricingClick('Empresarial')
  }];
  return <section id="pricing" className="py-24 px-6 relative">
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-claudia-muted to-transparent opacity-30 -z-10"></div>
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 text-slate-50 md:text-5xl">Planes que se adaptan a tus necesidades</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Elige el plan perfecto y comienza a aprovechar todo el potencial de la inteligencia artificial
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingTiers.map((tier, index) => <PricingCard key={index} tier={tier} delay={index * 150} />)}
        </div>
        
        <div className="mt-12 text-center text-muted-foreground">
          <p>¿Necesitas un plan personalizado para tu caso específico?</p>
          <p className="mt-1">
            <button onClick={() => handlePricingClick('Personalizado')} className="text-claudia-primary hover:underline font-medium">
              Contacta con nuestro equipo
            </button>
          </p>
        </div>
      </div>
    </section>;
};
export default PricingSection;