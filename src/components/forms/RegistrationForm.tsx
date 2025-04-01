
import React, { useState } from 'react';
import { Lock, Mail, User } from 'lucide-react';
import Button from '@/components/Button';
import FormInput from './FormInput';
import PhoneInputGroup from './PhoneInputGroup';
import TermsCheckbox from './TermsCheckbox';

export interface RegistrationFormData {
  name: string;
  lastname: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  acceptedTerms: boolean;
}

interface RegistrationFormProps {
  initialData?: Partial<RegistrationFormData>;
  onSubmit: (formData: RegistrationFormData) => void;
  onCancel?: () => void;
  isLoading: boolean;
  selectedPlan?: string;
  isModal?: boolean;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({
  initialData = {},
  onSubmit,
  onCancel,
  isLoading,
  selectedPlan,
  isModal = false
}) => {
  const [formData, setFormData] = useState<RegistrationFormData>({
    name: initialData.name || '',
    lastname: initialData.lastname || '',
    email: initialData.email || '',
    countryCode: initialData.countryCode || '+57',
    phoneNumber: initialData.phoneNumber || '',
    password: initialData.password || '',
    confirmPassword: initialData.confirmPassword || '',
    acceptedTerms: initialData.acceptedTerms || false,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof RegistrationFormData, string>>>({});

  const handleChange = (field: keyof RegistrationFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    // Clear error when field is edited
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleTermsChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, acceptedTerms: checked }));
    if (errors.acceptedTerms) {
      setErrors(prev => ({ ...prev, acceptedTerms: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof RegistrationFormData, string>> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Por favor, ingresa tu nombre";
    }
    
    if (!formData.lastname.trim()) {
      newErrors.lastname = "Por favor, ingresa tu apellido";
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Por favor, ingresa un correo electrónico válido";
    }
    
    // Limpiamos el número de teléfono para validar solo números
    const cleanPhone = formData.phoneNumber.replace(/\D/g, '');
    const phoneRegex = /^\d{7,15}$/;
    if (!phoneRegex.test(cleanPhone)) {
      newErrors.phoneNumber = "Por favor, ingresa un número de teléfono válido (solo números)";
    }
    
    if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }
    
    if (!formData.acceptedTerms) {
      newErrors.acceptedTerms = "Debes aceptar los términos y condiciones para continuar";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleCountryCodeChange = (value: string) => {
    setFormData((prev) => ({ ...prev, countryCode: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {selectedPlan && (
        <p className="text-claudia-primary mb-4">Plan seleccionado: {selectedPlan}</p>
      )}
      
      <FormInput
        id="name"
        label="Nombre"
        type="text"
        value={formData.name}
        onChange={handleChange('name')}
        placeholder="Tu nombre"
        disabled={isLoading}
        icon={User}
        error={errors.name}
      />
      
      <FormInput
        id="lastname"
        label="Apellido"
        type="text"
        value={formData.lastname}
        onChange={handleChange('lastname')}
        placeholder="Tu apellido"
        disabled={isLoading}
        icon={User}
        error={errors.lastname}
      />
      
      <FormInput
        id="email"
        label="Correo electrónico"
        type="email"
        value={formData.email}
        onChange={handleChange('email')}
        placeholder="nombre@ejemplo.com"
        disabled={isLoading}
        icon={Mail}
        error={errors.email}
      />
      
      <PhoneInputGroup
        countryCode={formData.countryCode}
        phoneNumber={formData.phoneNumber}
        onCountryCodeChange={handleCountryCodeChange}
        onPhoneNumberChange={handleChange('phoneNumber')}
        disabled={isLoading}
        error={errors.phoneNumber}
      />
      
      <FormInput
        id="password"
        label="Contraseña"
        type="password"
        value={formData.password}
        onChange={handleChange('password')}
        placeholder="Mínimo 6 caracteres"
        disabled={isLoading}
        icon={Lock}
        error={errors.password}
      />
      
      <FormInput
        id="confirmPassword"
        label="Confirmar Contraseña"
        type="password"
        value={formData.confirmPassword}
        onChange={handleChange('confirmPassword')}
        placeholder="Confirma tu contraseña"
        disabled={isLoading}
        icon={Lock}
        error={errors.confirmPassword}
      />
      
      <div className="space-y-1">
        <TermsCheckbox
          id={isModal ? "modal-terms" : "terms"}
          checked={formData.acceptedTerms}
          onCheckedChange={handleTermsChange}
          onLinkClick={isModal ? onCancel : undefined}
        />
        {errors.acceptedTerms && (
          <p className="text-red-500 text-xs ml-7">{errors.acceptedTerms}</p>
        )}
      </div>
      
      <div className={`${isModal ? 'flex justify-end space-x-3' : ''} pt-2`}>
        {isModal && onCancel && (
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={isLoading}
            className="text-claudia-white hover:text-claudia-primary"
          >
            Cancelar
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          loading={isLoading}
          className={isModal ? '' : 'w-full'}
        >
          {isModal ? 'Registrarme' : 'Register'}
        </Button>
      </div>
    </form>
  );
};

export default RegistrationForm;
