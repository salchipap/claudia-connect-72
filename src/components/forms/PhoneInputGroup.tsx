
import React from 'react';
import { Phone } from 'lucide-react';
import CountrySelect from '../CountrySelect';

interface PhoneInputGroupProps {
  countryCode: string;
  phoneNumber: string;
  onCountryCodeChange: (value: string) => void;
  onPhoneNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  error?: string;
}

const PhoneInputGroup: React.FC<PhoneInputGroupProps> = ({
  countryCode,
  phoneNumber,
  onCountryCodeChange,
  onPhoneNumberChange,
  disabled = false,
  error
}) => {
  return (
    <div className="space-y-1">
      <label htmlFor="phone" className="block text-sm font-medium mb-1 text-claudia-white">
        Número de teléfono (WhatsApp)
      </label>
      <div className="flex gap-2">
        <CountrySelect 
          value={countryCode}
          onChange={onCountryCodeChange}
          disabled={disabled}
        />
        <div className="relative flex-1">
          <input
            id="phone"
            type="tel"
            value={phoneNumber}
            onChange={onPhoneNumberChange}
            className={`w-full pl-9 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-claudia-primary bg-[#1a2a30] text-claudia-white ${
              error 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-claudia-primary/30'
            }`}
            placeholder="3128310805"
            disabled={disabled}
          />
          <Phone className="absolute left-3 top-2.5 h-4 w-4 text-claudia-primary/70" />
        </div>
      </div>
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
};

export default PhoneInputGroup;
