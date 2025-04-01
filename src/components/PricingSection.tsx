
import React, { useState } from 'react';
import PricingCard from './PricingCard';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';

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
    name: 'Basic',
    price: '$4.99/month',
    description: 'Perfect for personal use with essential features.',
    features: ['100 daily reminders', 'Unlimited conversations', 'Basic AI assistance', 'WhatsApp integration', '24/7 customer support'],
    cta: 'Get Started',
    onClick: () => handlePricingClick('Basic')
  }, {
    name: 'Premium',
    price: '$9.99/month',
    description: 'Enhanced features for professionals and small businesses.',
    features: ['Unlimited reminders', 'Priority AI assistance', 'Advanced analytics', 'Custom integrations', 'Priority customer support'],
    cta: 'Choose Premium',
    onClick: () => handlePricingClick('Premium')
  }];

  return (
    <section id="pricing" className="py-24 px-6 relative">
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-claudia-muted to-transparent opacity-30 -z-10"></div>
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 text-slate-50 md:text-5xl">Subscription Plans</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose a monthly subscription plan and get access to all features
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {pricingTiers.map((tier, index) => <PricingCard key={index} tier={tier} delay={index * 150} />)}
        </div>
        
        <div className="mt-16 bg-[#1a2a30] rounded-lg p-8 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold mb-4 text-claudia-white">All Plans Include:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              'Free WhatsApp Integration',
              'Cross-Device Synchronization',
              'Data Backup & Recovery',
              'SSL Encryption',
              'Regular Feature Updates',
              'Technical Support'
            ].map((feature, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Check className="h-5 w-5 text-claudia-primary" />
                <span className="text-claudia-white/90">{feature}</span>
              </div>
            ))}
          </div>
          
          <div className="mt-8 p-4 bg-claudia-primary/10 rounded-lg border border-claudia-primary/20">
            <p className="text-claudia-white/90 text-center">
              <strong>Special Offer:</strong> Sign up today and get your first month for 50% off!
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
