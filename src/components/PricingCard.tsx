
import React from 'react';
import { cn } from '@/lib/utils';
import Button from './Button';
import { Check } from 'lucide-react';

type PricingTier = {
  name: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  highlight?: boolean;
  icon?: React.ReactNode;
  onClick: () => void;
};

type PricingCardProps = {
  tier: PricingTier;
  className?: string;
  delay?: number;
};

const PricingCard: React.FC<PricingCardProps> = ({
  tier,
  className,
  delay = 0
}) => {
  return (
    <div 
      className={cn(
        "glass-card p-6 flex flex-col h-full animate-fade-in-up", 
        tier.highlight && "ring-2 ring-claudia-accent shadow-lg", 
        className
      )} 
      style={{
        animationDelay: `${delay}ms`
      }}
    >
      {tier.highlight && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-claudia-accent text-white text-sm font-medium rounded-full">
          Popular
        </div>
      )}
      
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          {tier.icon}
          <h3 className="text-xl font-semibold text-slate-50">{tier.name}</h3>
        </div>
        <div className="flex items-baseline">
          <span className="text-3xl font-bold text-slate-200">{tier.price}</span>
          {tier.price !== 'Gratis' && !tier.price.includes('Desde') && <span className="ml-1 text-muted-foreground">/mes</span>}
        </div>
        <p className="mt-3 text-muted-foreground">
          {tier.description}
        </p>
      </div>
      
      <div className="space-y-4 mb-8 flex-grow">
        {tier.features.map((feature, index) => (
          <div key={index} className="flex items-start">
            <div className="flex-shrink-0 h-5 w-5 text-claudia-primary">
              <Check size={20} />
            </div>
            <p className="ml-3 text-sm text-slate-50">{feature}</p>
          </div>
        ))}
      </div>
      
      <Button 
        onClick={tier.onClick} 
        variant={tier.highlight ? 'primary' : 'outlined'} 
        className="w-full mt-auto"
      >
        {tier.cta}
      </Button>
    </div>
  );
};

export default PricingCard;
