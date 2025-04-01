
import React, { useState, useEffect } from 'react';
import PricingCard from './PricingCard';
import { useNavigate } from 'react-router-dom';
import { Check, FileText, Presentation, Search } from 'lucide-react';
import { useCurrencyConversion } from '@/utils/currencyUtils';

const PricingSection: React.FC = () => {
  const navigate = useNavigate();
  const { exchangeRate, loading, convertUSDtoCOP } = useCurrencyConversion();
  
  const handlePricingClick = (planName: string) => {
    navigate('/register', {
      state: {
        selectedPlan: planName
      }
    });
  };
  
  // Define base prices in USD
  const basePrices = {
    basic: 10,
    advanced: 25,
    premium: 50
  };

  // Convert prices to COP
  const getPriceDisplay = (usdPrice: number) => {
    const copPrice = convertUSDtoCOP(usdPrice);
    return {
      usd: `$${usdPrice}`,
      cop: `COP ${Math.round(copPrice).toLocaleString('es-CO')}`
    };
  };
  
  const pricingTiers = [
    {
      name: 'Básico',
      price: getPriceDisplay(basePrices.basic),
      description: 'Plan ideal para uso personal con funciones esenciales.',
      features: [
        '333 recordatorios mensuales', 
        'Investigación básica', 
        'Búsqueda web',
        'Funciones básicas'
      ],
      cta: 'Comenzar Ahora',
      onClick: () => handlePricingClick('Basic'),
      icon: <Search className="h-5 w-5 text-claudia-primary" />
    }, 
    {
      name: 'Avanzado',
      price: getPriceDisplay(basePrices.advanced),
      description: 'Funciones mejoradas para profesionales y pequeñas empresas.',
      features: [
        '3333 recordatorios mensuales', 
        'Investigación profunda en PDF', 
        'Investigación de página web avanzada',
        'Chat con tu PDF y generación de recordatorios',
        'Generar trivias de conocimiento'
      ],
      cta: 'Elegir Avanzado',
      onClick: () => handlePricingClick('Advanced'),
      highlight: true,
      icon: <FileText className="h-5 w-5 text-claudia-primary" />
    },
    {
      name: 'Premium',
      price: getPriceDisplay(basePrices.premium),
      description: 'Plan completo con todas las funciones avanzadas y exclusivas.',
      features: [
        'Recordatorios ilimitados', 
        'Investigación profunda en PDF', 
        'Investigación de página web avanzada',
        'Chat con tu PDF y generación de recordatorios',
        'Generación de infografías y diapositivas'
      ],
      cta: 'Elegir Premium',
      onClick: () => handlePricingClick('Premium'),
      icon: <Presentation className="h-5 w-5 text-claudia-primary" />
    }
  ];

  return (
    <section id="pricing" className="py-16 md:py-24 px-4 md:px-6 relative">
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-claudia-muted to-transparent opacity-30 -z-10"></div>
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4 text-slate-50">Planes de Suscripción</h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Elige un plan mensual y obtén acceso a todas las funciones
          </p>
          {!loading && (
            <p className="text-sm text-muted-foreground mt-2">
              Tasa de cambio actual: 1 USD = {Math.round(exchangeRate).toLocaleString('es-CO')} COP
            </p>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingTiers.map((tier, index) => <PricingCard key={index} tier={tier} delay={index * 150} />)}
        </div>
        
        <div className="mt-12 sm:mt-16 bg-[#1a2a30] rounded-lg p-6 sm:p-8 max-w-4xl mx-auto">
          <h3 className="text-xl sm:text-2xl font-bold mb-4 text-claudia-white">Todos los Planes Incluyen:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              'Integración con WhatsApp',
              'Sincronización entre dispositivos',
              'Respaldo y recuperación de datos',
              'Encriptación SSL',
              'Actualizaciones regulares',
              'Soporte técnico'
            ].map((feature, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Check className="h-5 w-5 text-claudia-primary" />
                <span className="text-claudia-white/90">{feature}</span>
              </div>
            ))}
          </div>
          
          <div className="mt-8 p-4 bg-claudia-primary/10 rounded-lg border border-claudia-primary/20">
            <p className="text-claudia-white/90 text-center">
              <strong>Oferta Especial:</strong> ¡Regístrate hoy y obtén tu primer mes con 50% de descuento!
            </p>
          </div>
        </div>
        
        <div className="mt-12 text-center text-muted-foreground">
          <p>¿Necesitas un plan personalizado para tu caso específico?</p>
          <p className="mt-1">
            <button onClick={() => handlePricingClick('Custom')} className="text-claudia-primary hover:underline font-medium">
              Contacta con nuestro equipo
            </button>
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
