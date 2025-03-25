
import React, { useState } from 'react';
import PricingCard from './PricingCard';
import { useNavigate } from 'react-router-dom';
import TokenPurchaseModal from './TokenPurchaseModal';
import { Coins } from 'lucide-react';

const PricingSection: React.FC = () => {
  const navigate = useNavigate();
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  
  const handlePricingClick = (planName: string) => {
    if (planName === 'Tokens') {
      setIsTokenModalOpen(true);
    } else {
      navigate('/register', {
        state: {
          selectedPlan: planName
        }
      });
    }
  };
  
  const pricingTiers = [{
    name: 'Básico',
    price: 'Gratis',
    description: 'Servicio gratuito con 5 mensajes diarios para cualquier uso.',
    features: ['5 mensajes diarios', 'Búsquedas en internet', 'Traducciones', 'Respuestas a preguntas', 'Extracción de texto'],
    cta: 'Comenzar gratis',
    onClick: () => handlePricingClick('Básico')
  }, {
    name: 'Tokens',
    price: 'Desde $0.24 USD',
    description: 'Compra solo los mensajes que necesitas.',
    features: ['100 mensajes por $0.24 USD / 1000 COP', 'Sin suscripción mensual', 'Personaliza la cantidad de mensajes', 'Los tokens no expiran', 'Ideal para uso ocasional'],
    cta: 'Comprar tokens',
    icon: <Coins className="h-5 w-5" />,
    onClick: () => handlePricingClick('Tokens')
  }];

  return (
    <section id="pricing" className="py-24 px-6 relative">
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-claudia-muted to-transparent opacity-30 -z-10"></div>
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 text-slate-50 md:text-5xl">Planes que se adaptan a tus necesidades</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Elige el plan perfecto y comienza a aprovechar todo el potencial de la inteligencia artificial
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
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
      
      <TokenPurchaseModal 
        isOpen={isTokenModalOpen} 
        onClose={() => setIsTokenModalOpen(false)} 
      />
    </section>
  );
};

export default PricingSection;
