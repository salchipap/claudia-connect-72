
import { cn } from '@/lib/utils';
import React from 'react';

type FeatureCardProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
  delay?: number;
};

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  title, 
  description, 
  icon,
  className,
  delay = 0
}) => {
  return (
    <div 
      className={cn(
        "glass-card p-6 flex flex-col items-center text-center animate-fade-in-up", 
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="mb-5 p-3 rounded-full bg-claudia-primary/20 text-claudia-primary">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3 text-claudia-white">{title}</h3>
      <p className="text-claudia-white/80">{description}</p>
    </div>
  );
};

export default FeatureCard;
