
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import Button from './Button';
import { useToast } from "@/hooks/use-toast";
import { loginUser } from '@/utils/api';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Lock, Phone } from 'lucide-react';
import CountrySelect from '@/components/CountrySelect';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

type LoginModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const loginSchema = z.object({
  phoneNumber: z.string().min(6, 'El número de teléfono debe tener al menos 6 dígitos'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres')
});

type LoginValues = z.infer<typeof loginSchema>;

const LoginModal: React.FC<LoginModalProps> = ({ 
  isOpen, 
  onClose
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [countryCode, setCountryCode] = useState('+57');
  const navigate = useNavigate();
  const { signIn } = useAuth();
  
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phoneNumber: '',
      password: ''
    }
  });
  
  const handleClose = () => {
    if (!isLoading) {
      onClose();
      form.reset();
    }
  };
  
  const onSubmit = async (values: LoginValues) => {
    setIsLoading(true);
    
    try {
      // Combine country code and phone number
      const fullPhoneNumber = `${countryCode}${values.phoneNumber}`;
      
      // Format phone number with WhatsApp format
      const formattedPhone = fullPhoneNumber.startsWith('+') ? fullPhoneNumber.substring(1) : fullPhoneNumber;
      
      try {
        console.log('Intentando login a través de webhook');
        const response = await loginUser({
          phone: formattedPhone,
          password: values.password
        });
        
        if (response.success) {
          toast({
            title: "Inicio de sesión exitoso",
            description: "Bienvenido a ClaudIA.",
          });
          handleClose();
          
          // Redirect to WhatsApp after successful login
          window.location.href = "https://wa.me/573128310805";
          return;
        }
      } catch (webhookError) {
        console.log('Error en webhook, intentando autenticación con Supabase:', webhookError);
        // Si falla el webhook, intentamos con Supabase
        try {
          // Usar email como nombre de usuario para Supabase - concatenar el número con @claudia.ai
          const email = `${formattedPhone}@claudia.ai`;
          const { data, error } = await signIn(email, values.password);
          
          if (error) {
            throw error;
          }
          
          toast({
            title: "Inicio de sesión exitoso",
            description: "Bienvenido a ClaudIA.",
          });
          
          handleClose();
          navigate('/dashboard');
          return;
        } catch (supabaseError: any) {
          console.error('Error en autenticación con Supabase:', supabaseError);
          throw supabaseError;
        }
      }
      
      // Si llegamos aquí es porque ambos métodos fallaron pero no hubo excepción
      toast({
        title: "Error en el inicio de sesión",
        description: "Credenciales inválidas o servicio no disponible.",
        variant: "destructive",
      });
      
    } catch (error: any) {
      console.error('Error logging in:', error);
      toast({
        title: "Error",
        description: "Ocurrió un error durante el inicio de sesión. Por favor, intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-[#142126] border-claudia-primary/20 text-claudia-white p-0 overflow-hidden max-w-md">
        <div className="relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-claudia-primary opacity-10 rounded-bl-full -z-10"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-claudia-primary opacity-10 rounded-tr-full -z-10"></div>
          
          <div className="p-6">
            <DialogTitle className="text-2xl font-bold mb-1 text-claudia-white">Iniciar Sesión</DialogTitle>
            <DialogDescription className="text-claudia-white/70 mb-6">Ingresa con tu número de WhatsApp y contraseña</DialogDescription>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-claudia-white">Número de WhatsApp</FormLabel>
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
                    onClick={handleClose}
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
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
