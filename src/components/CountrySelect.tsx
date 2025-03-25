
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Common country codes for phone numbers
export const countries = [
  { code: '+57', name: 'Colombia' },
  { code: '+1', name: 'Estados Unidos' },
  { code: '+34', name: 'España' },
  { code: '+52', name: 'México' },
  { code: '+54', name: 'Argentina' },
  { code: '+56', name: 'Chile' },
  { code: '+51', name: 'Perú' },
  { code: '+58', name: 'Venezuela' },
  { code: '+55', name: 'Brasil' },
  { code: '+593', name: 'Ecuador' },
  { code: '+502', name: 'Guatemala' },
  { code: '+507', name: 'Panamá' },
  { code: '+506', name: 'Costa Rica' },
  { code: '+503', name: 'El Salvador' },
  { code: '+504', name: 'Honduras' },
  { code: '+505', name: 'Nicaragua' },
  { code: '+598', name: 'Uruguay' },
  { code: '+595', name: 'Paraguay' },
  { code: '+591', name: 'Bolivia' },
  { code: '+1809', name: 'República Dominicana' },
  { code: '+44', name: 'Reino Unido' },
  { code: '+33', name: 'Francia' },
  { code: '+49', name: 'Alemania' },
  { code: '+39', name: 'Italia' },
];

interface CountrySelectProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const CountrySelect: React.FC<CountrySelectProps> = ({ value, onChange, disabled }) => {
  return (
    <Select 
      value={value} 
      onValueChange={onChange} 
      disabled={disabled}
    >
      <SelectTrigger className="w-[110px] bg-[#1a2a30] text-claudia-white border-claudia-primary/30 focus:ring-claudia-primary">
        <SelectValue placeholder="+57" />
      </SelectTrigger>
      <SelectContent className="bg-[#1a2a30] text-claudia-white border-claudia-primary/30">
        {countries.map((country) => (
          <SelectItem 
            key={country.code} 
            value={country.code} 
            className="hover:bg-claudia-primary/20 focus:bg-claudia-primary/20"
          >
            {country.code} {country.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CountrySelect;
