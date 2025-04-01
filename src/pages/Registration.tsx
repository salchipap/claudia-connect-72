
import React, { useState, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import { useToast } from "@/hooks/use-toast";
import { useNavigate, Link, useLocation } from 'react-router-dom';
import RegistrationForm, { RegistrationFormData } from '@/components/forms/RegistrationForm';
import { useAuth } from '@/hooks/auth';

const Registration = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signUp, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');

  useEffect(() => {
    // Check for selected plan from location state
    if (location.state && location.state.selectedPlan) {
      setSelectedPlan(location.state.selectedPlan);
    }
    
    // Redirect if user is already logged in
    if (user) {
      navigate('/dashboard');
    }
  }, [location, navigate, user]);
  
  const handleSubmit = async (formData: RegistrationFormData) => {
    setIsLoading(true);
    
    try {
      // Limpiamos el número de teléfono para usar solo números
      const cleanPhone = formData.phoneNumber.replace(/\D/g, '');
      
      // Verificamos si el usuario ya incluyó el código de país en el input
      let formattedPhone;
      const countryCodeWithoutPlus = formData.countryCode.substring(1);
      
      if (cleanPhone.startsWith('0')) {
        // Si comienza con 0, quitamos el 0 y agregamos el código de país sin el +
        formattedPhone = countryCodeWithoutPlus + cleanPhone.substring(1);
      } else if (cleanPhone.startsWith(countryCodeWithoutPlus)) {
        // Si ya incluye el código de país, lo dejamos como está
        formattedPhone = cleanPhone;
      } else {
        // Si no incluye el código, lo agregamos
        formattedPhone = countryCodeWithoutPlus + cleanPhone;
      }
      
      console.log('Registrando con número:', formattedPhone);
      
      // Register with Supabase Auth
      const result = await signUp(formData.email, formData.password, {
        name: formData.name,
        lastname: formData.lastname,
        remotejid: formattedPhone,
        plan: selectedPlan || 'Basic'
      });
      
      if (!result.success) {
        throw new Error(result.error || "Error durante el registro");
      }
      
      // Success message
      toast({
        title: "Registro exitoso",
        description: "¡Tu cuenta ha sido creada con éxito! Ya puedes iniciar sesión.",
      });
      
      // Navigate to login page instead of dashboard
      navigate('/login');
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Error en el registro",
        description: error.message || "Ocurrió un error durante el registro. Por favor, intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-[#142126] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-claudia-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-[#142126] text-claudia-foreground relative">
      <NavBar />
      
      <main className="pt-20 pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-claudia-white">Register for ClaudIA</h1>
            <p className="text-claudia-white/70 text-lg">Complete the form to start your ClaudIA experience</p>
            {selectedPlan && (
              <p className="text-claudia-primary mt-2">Selected plan: {selectedPlan}</p>
            )}
          </div>
          
          <div className="max-w-md mx-auto bg-[#1a2a30] rounded-lg shadow-xl p-8 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-claudia-primary opacity-10 rounded-bl-full -z-10"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-claudia-primary opacity-10 rounded-tr-full -z-10"></div>
            
            <RegistrationForm
              onSubmit={handleSubmit}
              isLoading={isLoading}
              selectedPlan={selectedPlan}
            />
            
            <div className="text-center mt-4 text-claudia-white/70 text-sm">
              Already have an account?{" "}
              <button
                type="button"
                className="text-claudia-primary hover:underline"
                onClick={() => navigate('/login')}
              >
                Log in
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Registration;
