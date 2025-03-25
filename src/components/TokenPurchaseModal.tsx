
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import Button from './Button';
import { useToast } from "@/hooks/use-toast";
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Coins, CreditCard, DollarSign } from 'lucide-react';

type TokenPurchaseModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const purchaseSchema = z.object({
  tokenAmount: z.number()
    .min(100, 'La cantidad mínima es 100 mensajes')
    .max(10000, 'La cantidad máxima es 10,000 mensajes'),
});

type PurchaseValues = z.infer<typeof purchaseSchema>;

const TokenPurchaseModal: React.FC<TokenPurchaseModalProps> = ({ 
  isOpen, 
  onClose
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [currency, setCurrency] = useState<'USD' | 'COP'>('COP');
  const [totalPrice, setTotalPrice] = useState<number>(0);
  
  const form = useForm<PurchaseValues>({
    resolver: zodResolver(purchaseSchema),
    defaultValues: {
      tokenAmount: 100,
    }
  });
  
  const watchTokenAmount = form.watch('tokenAmount');
  
  useEffect(() => {
    // Calculate price based on selected amount
    const pricePerHundred = currency === 'USD' ? 0.24 : 1000;
    const calculatedPrice = (watchTokenAmount / 100) * pricePerHundred;
    setTotalPrice(calculatedPrice);
  }, [watchTokenAmount, currency]);
  
  const handleClose = () => {
    if (!isLoading) {
      onClose();
      form.reset();
    }
  };
  
  const onSubmit = async (values: PurchaseValues) => {
    setIsLoading(true);
    
    try {
      // Here you would integrate with a payment processor
      // For now we'll just simulate success
      
      setTimeout(() => {
        toast({
          title: "Compra exitosa",
          description: `Has comprado ${values.tokenAmount} mensajes por ${currency === 'USD' ? '$' + totalPrice.toFixed(2) + ' USD' : totalPrice.toLocaleString() + ' COP'}.`,
        });
        handleClose();
      }, 1500);
      
    } catch (error) {
      console.error('Purchase error:', error);
      toast({
        title: "Error",
        description: "Ocurrió un error durante la compra. Por favor, intenta de nuevo.",
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
            <div className="flex items-center gap-2 mb-1">
              <Coins className="h-5 w-5 text-claudia-primary" />
              <h2 className="text-2xl font-bold text-claudia-white">Comprar Mensajes</h2>
            </div>
            <p className="text-claudia-white/70 mb-6">Selecciona la cantidad de mensajes que deseas comprar</p>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="flex gap-4 mb-4">
                  <button
                    type="button"
                    className={`flex-1 py-2 px-4 rounded-md border ${currency === 'COP' ? 'bg-claudia-primary/20 border-claudia-primary' : 'border-gray-600'}`}
                    onClick={() => setCurrency('COP')}
                  >
                    COP
                  </button>
                  <button
                    type="button"
                    className={`flex-1 py-2 px-4 rounded-md border ${currency === 'USD' ? 'bg-claudia-primary/20 border-claudia-primary' : 'border-gray-600'}`}
                    onClick={() => setCurrency('USD')}
                  >
                    USD
                  </button>
                </div>
                
                <FormField
                  control={form.control}
                  name="tokenAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-claudia-white">Cantidad de mensajes</FormLabel>
                      <div className="flex gap-4 items-center">
                        <button 
                          type="button" 
                          className="bg-[#1a2a30] text-claudia-white rounded-md p-2"
                          onClick={() => {
                            const currentValue = field.value || 0;
                            if (currentValue > 100) form.setValue('tokenAmount', currentValue - 100);
                          }}
                        >
                          -
                        </button>
                        <div className="relative flex-1">
                          <FormControl>
                            <Input
                              type="number"
                              className="text-center bg-[#1a2a30] border-claudia-primary/30 text-claudia-white"
                              disabled={isLoading}
                              {...field}
                              onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                        </div>
                        <button 
                          type="button" 
                          className="bg-[#1a2a30] text-claudia-white rounded-md p-2"
                          onClick={() => {
                            const currentValue = field.value || 0;
                            if (currentValue < 10000) form.setValue('tokenAmount', currentValue + 100);
                          }}
                        >
                          +
                        </button>
                      </div>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                
                <div className="bg-[#1a2a30] p-4 rounded-md border border-claudia-primary/20">
                  <div className="flex justify-between mb-2">
                    <span className="text-claudia-white/70">Precio por 100 mensajes:</span>
                    <span className="text-claudia-white font-medium">
                      {currency === 'USD' ? '$0.24 USD' : '1,000 COP'}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-claudia-white/70">Cantidad:</span>
                    <span className="text-claudia-white font-medium">{watchTokenAmount} mensajes</span>
                  </div>
                  <div className="border-t border-claudia-primary/10 my-2 pt-2">
                    <div className="flex justify-between">
                      <span className="text-claudia-white font-medium">Total:</span>
                      <span className="text-claudia-primary font-bold">
                        {currency === 'USD' 
                          ? `$${totalPrice.toFixed(2)} USD` 
                          : `${totalPrice.toLocaleString()} COP`}
                      </span>
                    </div>
                  </div>
                </div>
                
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
                    className="gap-2"
                  >
                    <CreditCard className="h-4 w-4" />
                    Realizar Pago
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

export default TokenPurchaseModal;
