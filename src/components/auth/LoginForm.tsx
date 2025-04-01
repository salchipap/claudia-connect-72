
import React from 'react';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Lock, Phone, Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Button from '../Button';
import CountrySelect from '../CountrySelect';

const loginSchema = z.object({
  identifier: z.string().min(1, 'Este campo es requerido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres')
});

export type LoginValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSubmit: (values: LoginValues) => Promise<void>;
  isLoading: boolean;
  loginMethod: 'phone' | 'email';
  toggleLoginMethod: () => void;
  countryCode: string;
  setCountryCode: (value: string) => void;
  onCancel: () => void;
}

const LoginFormComponent: React.FC<LoginFormProps> = ({ 
  onSubmit, 
  isLoading, 
  loginMethod, 
  toggleLoginMethod, 
  countryCode, 
  setCountryCode,
  onCancel
}) => {
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: '',
      password: ''
    }
  });
  
  return (
    <>
      <div className="text-center mb-4">
        <button 
          onClick={toggleLoginMethod}
          className="text-claudia-primary text-sm underline hover:text-claudia-primary/80"
          type="button"
        >
          ¿Prefieres iniciar sesión con {loginMethod === 'phone' ? 'correo electrónico' : 'teléfono'}?
        </button>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="identifier"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-claudia-white">
                  {loginMethod === 'phone' ? 'Número de WhatsApp' : 'Correo Electrónico'}
                </FormLabel>
                
                {loginMethod === 'phone' ? (
                  <div className="flex gap-2">
                    <CountrySelect 
                      value={countryCode}
                      onChange={setCountryCode}
                      disabled={isLoading}
                    />
                    <div className="relative flex-1">
                      <FormControl>
                        <Input
                          placeholder="3128310805"
                          className="pl-9 bg-[#1a2a30] border-claudia-primary/30 text-claudia-white"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-claudia-primary/70" />
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <FormControl>
                      <Input
                        placeholder="correo@ejemplo.com"
                        className="pl-9 bg-[#1a2a30] border-claudia-primary/30 text-claudia-white"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-claudia-primary/70" />
                  </div>
                )}
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-claudia-white">Contraseña</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Contraseña"
                      className="pl-9 bg-[#1a2a30] border-claudia-primary/30 text-claudia-white"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-claudia-primary/70" />
                </div>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />
          
          <div className="flex justify-end space-x-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onCancel}
              disabled={isLoading}
              className="text-claudia-white hover:text-claudia-primary"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={isLoading}
            >
              Iniciar Sesión
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default LoginFormComponent;
