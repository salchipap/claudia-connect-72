
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface FormInputProps {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  disabled?: boolean;
  icon?: LucideIcon;
  error?: string;
}

const FormInput: React.FC<FormInputProps> = ({
  id,
  label,
  type,
  value,
  onChange,
  placeholder,
  disabled = false,
  icon: Icon,
  error
}) => {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-medium mb-1 text-claudia-white">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          className={`w-full pl-9 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-claudia-primary bg-[#1a2a30] text-claudia-white ${
            error 
              ? 'border-red-500 focus:ring-red-500' 
              : 'border-claudia-primary/30'
          }`}
          placeholder={placeholder}
          disabled={disabled}
        />
        {Icon && <Icon className="absolute left-3 top-2.5 h-4 w-4 text-claudia-primary/70" />}
      </div>
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
};

export default FormInput;
