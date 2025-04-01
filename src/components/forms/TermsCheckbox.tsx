
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Link } from 'react-router-dom';

interface TermsCheckboxProps {
  id: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  onLinkClick?: () => void;
}

const TermsCheckbox: React.FC<TermsCheckboxProps> = ({
  id,
  checked,
  onCheckedChange,
  onLinkClick
}) => {
  return (
    <div className="flex items-start space-x-2">
      <Checkbox 
        id={id} 
        checked={checked}
        onCheckedChange={(checked) => onCheckedChange(checked as boolean)}
        className="data-[state=checked]:bg-claudia-primary data-[state=checked]:border-claudia-primary border-claudia-primary/50 mt-1"
      />
      <label
        htmlFor={id}
        className="text-sm text-claudia-white/80"
      >
        Acepto los <Link to="/terms" onClick={onLinkClick} className="text-claudia-primary hover:underline">Términos y Condiciones</Link> de ClaudIA
      </label>
    </div>
  );
};

export default TermsCheckbox;
