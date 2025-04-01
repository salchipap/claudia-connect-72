
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import Button from './Button';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Lock, Phone, Mail } from 'lucide-react';
import CountrySelect from '@/components/CountrySelect';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/hooks/useAuth';

type LoginModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const loginSchema = z.object({
  identifier: z.string().min(1, 'Este campo es requerido'),
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
  const [loginMethod, setLoginMethod] = useState<'phone' | 'email'>('phone');
  const navigate = useNavigate();
  const { signIn } = useAuth();
  
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: '',
      password: ''
    }
  });
  
  const handleClose = () => {
    if (!isLoading) {
      onClose();
      form.reset();
    }
  };
  
  const toggleLoginMethod = () => {
    setLoginMethod(prev => prev === 'phone' ? 'email' : 'phone');
    form.setValue('identifier', '');
  };
  
  const onSubmit = async (values: LoginValues) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await signIn(
        values.identifier, 
        values.password, 
        loginMethod === 'phone', // indicar si es un inicio de sesión por teléfono
        countryCode
      );
      
      if (error) {
        console.error('Error en autenticación con Supabase:', error);
        toast({
          title: "Error",
          description: error.message || "Credenciales inválidas. Verifica tu número/email y contraseña.",
          variant: "destructive",
        });
        return;
      }
      
      if (data.session) {
        console.log('Inicio de sesión exitoso:', data);
        toast({
          title: "Inicio de sesión exitoso",
          description: "Bienvenido a ClaudIA.",
        });
        
        handleClose();
        navigate('/dashboard');
      } else {
        throw new Error('No se pudo iniciar sesión, no se obtuvo la sesión');
      }
    } catch (error: any) {
      console.error('Error logging in:', error);
      
      // Mensaje de error más amigable basado en el código de error
      let errorMessage = "Credenciales inválidas o servicio no disponible.";
      
      if (error?.message) {
        if (error.message.includes("Invalid login credentials")) {
          errorMessage = "Credenciales inválidas. Verifica tu número/email y contraseña.";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Error",
        description: errorMessage,
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
            <DialogDescription className="text-claudia-white/70 mb-6">
              Ingresa con tu {loginMethod === 'phone' ? 'número de WhatsApp' : 'correo electrónico'} y contraseña
            </DialogDescription>
            
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
