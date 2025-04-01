
import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import Button from './Button';
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { CheckCircle2, CreditCard } from 'lucide-react';
import RegistrationModal from './RegistrationModal';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Label } from "@/components/ui/label";

type SubscriptionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  isUserLoggedIn?: boolean;
};

const subscriptionSchema = z.object({
  plan: z.enum(['basic', 'premium']),
});

type SubscriptionValues = z.infer<typeof subscriptionSchema>;

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ 
  isOpen, 
  onClose,
  isUserLoggedIn = false
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('basic');
  
  const form = useForm<SubscriptionValues>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      plan: 'basic',
    }
  });
  
  const handleClose = () => {
    if (!isLoading) {
      setShowSuccess(false);
      onClose();
      form.reset();
    }
  };

  const handleRegisterClick = () => {
    // Close the subscription modal and open registration
    setShowRegistrationModal(true);
  };
  
  const onSubmit = async (values: SubscriptionValues) => {
    // Check if user is logged in first
    if (!isUserLoggedIn) {
      toast({
        title: "Registration required",
        description: "You must register to subscribe to a plan.",
        variant: "destructive",
      });
      handleRegisterClick();
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Here you would integrate with a payment processor
      // For now we'll just simulate success
      
      setTimeout(() => {
        setSelectedPlan(values.plan);
        setShowSuccess(true);
      }, 1500);
      
    } catch (error) {
      console.error('Subscription error:', error);
      toast({
        title: "Error",
        description: "An error occurred during subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getPlanDetails = (plan: string) => {
    if (plan === 'basic') {
      return {
        name: 'Basic Plan',
        price: '$4.99/month',
        features: ['100 daily reminders', 'Unlimited conversations', 'Basic AI assistance', 'WhatsApp integration']
      };
    } else {
      return {
        name: 'Premium Plan',
        price: '$9.99/month',
        features: ['Unlimited reminders', 'Priority AI assistance', 'Advanced analytics', 'Custom integrations']
      };
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="bg-[#142126] border-claudia-primary/20 text-claudia-white p-0 overflow-hidden max-w-md">
          <div className="relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-claudia-primary opacity-10 rounded-bl-full -z-10"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-claudia-primary opacity-10 rounded-tr-full -z-10"></div>
            
            {showSuccess ? (
              <div className="p-6 flex flex-col items-center justify-center min-h-[400px]">
                <div className="bg-claudia-primary/10 rounded-full p-4 mb-4">
                  <CheckCircle2 className="h-12 w-12 text-claudia-primary" />
                </div>
                <h2 className="text-2xl font-bold text-claudia-white mb-2">Subscription Successful!</h2>
                <p className="text-claudia-white/70 text-center mb-4">
                  You have successfully subscribed to the {getPlanDetails(selectedPlan).name} at {getPlanDetails(selectedPlan).price}.
                </p>
                <p className="text-claudia-white/70 text-center mb-6">
                  Your subscription is now active and you can start using all the features.
                </p>
                <Button
                  onClick={handleClose}
                  variant="primary"
                  className="w-full mt-4"
                >
                  Continue
                </Button>
              </div>
            ) : (
              <div className="p-6">
                <h2 className="text-2xl font-bold text-claudia-white mb-1">Choose a Plan</h2>
                <p className="text-claudia-white/70 mb-6">Select a subscription plan that fits your needs</p>
                
                {!isUserLoggedIn && (
                  <div className="bg-claudia-primary/10 border border-claudia-primary/20 p-4 rounded-md mb-6">
                    <p className="text-claudia-white text-sm mb-2">
                      <strong>You must log in or register to subscribe to a plan.</strong>
                    </p>
                    <Button
                      onClick={handleRegisterClick}
                      variant="primary"
                      className="w-full"
                    >
                      Register Now
                    </Button>
                  </div>
                )}
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="plan"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-3"
                            >
                              <div className="flex items-center space-x-2 border border-claudia-primary/20 p-4 rounded-lg hover:bg-[#1a2a30] transition-colors cursor-pointer">
                                <RadioGroupItem value="basic" id="basic" className="border-claudia-primary text-claudia-primary" />
                                <Label htmlFor="basic" className="flex-1 cursor-pointer">
                                  <div className="font-medium text-claudia-white">Basic Plan</div>
                                  <div className="text-claudia-primary font-bold">$4.99/month</div>
                                  <div className="text-claudia-white/70 text-sm mt-2">
                                    Perfect for personal use with essential features
                                  </div>
                                </Label>
                              </div>
                              
                              <div className="flex items-center space-x-2 border border-claudia-primary/20 p-4 rounded-lg hover:bg-[#1a2a30] transition-colors cursor-pointer">
                                <RadioGroupItem value="premium" id="premium" className="border-claudia-primary text-claudia-primary" />
                                <Label htmlFor="premium" className="flex-1 cursor-pointer">
                                  <div className="font-medium text-claudia-white">Premium Plan</div>
                                  <div className="text-claudia-primary font-bold">$9.99/month</div>
                                  <div className="text-claudia-white/70 text-sm mt-2">
                                    Enhanced features for professionals and small businesses
                                  </div>
                                </Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
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
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="primary"
                        loading={isLoading}
                        className="gap-2"
                        disabled={!isUserLoggedIn}
                      >
                        <CreditCard className="h-4 w-4" />
                        Subscribe Now
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Registration Modal */}
      {showRegistrationModal && (
        <RegistrationModal
          isOpen={showRegistrationModal}
          onClose={() => setShowRegistrationModal(false)}
        />
      )}
    </>
  );
};

export default SubscriptionModal;
