
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

  const handleChange = (field: keyof RegistrationFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleTermsChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, acceptedTerms: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
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
      />
      
      <PhoneInputGroup
        countryCode={formData.countryCode}
        phoneNumber={formData.phoneNumber}
        onCountryCodeChange={handleCountryCodeChange}
        onPhoneNumberChange={handleChange('phoneNumber')}
        disabled={isLoading}
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
      />
      
      <TermsCheckbox
        id={isModal ? "modal-terms" : "terms"}
        checked={formData.acceptedTerms}
        onCheckedChange={handleTermsChange}
        onLinkClick={isModal ? onCancel : undefined}
      />
      
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
