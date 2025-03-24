
import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import Button from './Button';
import { useToast } from "@/hooks/use-toast";
import { loginUser } from '@/utils/api';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Lock, Phone } from 'lucide-react';

type LoginModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const loginSchema = z.object({
  phone: z.string().min(10, 'El número de teléfono debe tener al menos 10 dígitos'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres')
});

type LoginValues = z.infer<typeof loginSchema>;

const LoginModal: React.FC<LoginModalProps> = ({ 
  isOpen, 
  onClose
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phone: '',
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
      // Format phone number with WhatsApp format
      const formattedPhone = values.phone.startsWith('+') ? values.phone.substring(1) : values.phone;
      
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
      } else {
        toast({
          title: "Error en el inicio de sesión",
          description: response.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Login error:', error);
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
            <h2 className="text-2xl font-bold mb-1 text-claudia-white">Iniciar Sesión</h2>
            <p className="text-claudia-white/70 mb-6">Ingresa con tu número de WhatsApp y contraseña</p>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-claudia-white">Número de WhatsApp</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            placeholder="+573128310805"
                            className="pl-9 bg-[#1a2a30] border-claudia-primary/30 text-claudia-white"
                            disabled={isLoading}
                            {...field}
                          />
                        </FormControl>
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-claudia-primary/70" />
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
