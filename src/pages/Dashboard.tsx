
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReminderCalendar from '@/components/ReminderCalendar';
import { useAuth } from '@/hooks/auth';
import { LogOut, UserCircle, Mail, Calendar, MessageCircle, Phone, ExternalLink, CreditCard, CalendarDays, Plus } from 'lucide-react';
import Button from '@/components/Button';
import { useToast } from '@/hooks/use-toast';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { useIsMobile } from '@/hooks/use-mobile';

const Dashboard = () => {
  const { user, userProfile, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  const handleSignOut = async () => {
    try {
      setIsLoggingOut(true);
      await signOut();
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión correctamente",
      });
    } catch (error: any) {
      console.error('Error al cerrar sesión:', error);
      toast({
        title: "Error",
        description: "No se pudo cerrar sesión. Inténtalo de nuevo.",
        variant: "destructive",
      });
      setIsLoggingOut(false);
    }
  };

  const openWhatsAppChat = () => {
    const whatsappNumber = "+573128310805";
    const message = "Hola ClaudIA, quiero chatear contigo";
    
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#142126] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-claudia-primary"></div>
      </div>
    );
  }

  if (!user || !userProfile) {
    return null;
  }

  const userPhoneNumber = userProfile.remotejid || 
                         (user.user_metadata?.remotejid) || 
                         'No disponible';

  return (
    <div className="min-h-screen bg-[#142126] text-claudia-foreground relative">
      <header className="py-4 px-4 flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-claudia-white">Dashboard</h1>
        
        <div className="flex items-center gap-2 md:gap-4">
          <Button 
            onClick={openWhatsAppChat}
            variant="primary"
            size={isMobile ? "sm" : "md"}
            className="flex items-center gap-2"
            icon={isMobile ? null : <ExternalLink size={14} />}
            iconPosition="right"
          >
            {isMobile ? (
              <div className="flex items-center justify-center">
                <div className="h-5 w-5 rounded-full overflow-hidden">
                  <img 
                    src="https://img.recraft.ai/TPT2gnDTOAplVWXdKprcxYJZGSC82p_p5DJzbNYpSyU/rs:fit:1024:1024:0/q:95/g:no/plain/abs://prod/images/8fbdfedc-79e6-4ae5-9912-89c9048c67d8@jpg" 
                    alt="ClaudIA" 
                    className="h-full w-full object-cover" 
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 rounded-full overflow-hidden">
                  <img 
                    src="https://img.recraft.ai/TPT2gnDTOAplVWXdKprcxYJZGSC82p_p5DJzbNYpSyU/rs:fit:1024:1024:0/q:95/g:no/plain/abs://prod/images/8fbdfedc-79e6-4ae5-9912-89c9048c67d8@jpg" 
                    alt="ClaudIA" 
                    className="h-full w-full object-cover" 
                  />
                </div>
                <span>Chatear con ClaudIA</span>
              </div>
            )}
          </Button>
          
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex items-center justify-center p-2 rounded-full bg-[#1a2a30] hover:bg-claudia-primary/20 transition-colors">
                <Avatar className="h-8 w-8 md:h-10 md:w-10 border-2 border-claudia-primary/30">
                  <AvatarFallback className="bg-claudia-primary/20 text-claudia-primary">
                    {userProfile.name ? userProfile.name[0].toUpperCase() : 'U'}
                  </AvatarFallback>
                </Avatar>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0 bg-[#1a2a30] border-claudia-primary/20">
              <div className="p-4 bg-[#142126] rounded-t-md border-b border-claudia-primary/20">
                <div className="flex items-center gap-3">
                  <Avatar className="h-14 w-14 border-2 border-claudia-primary/30">
                    <AvatarFallback className="bg-claudia-primary/20 text-claudia-primary">
                      {userProfile.name ? userProfile.name[0].toUpperCase() : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-lg font-semibold text-claudia-white">
                      {userProfile.name || 'Usuario'} {userProfile.lastname || ''}
                    </h2>
                    <p className="text-sm text-claudia-white/70">
                      {user.email || 'No email'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-3">
                <div className="flex items-center gap-2 p-2 mb-2 text-claudia-white">
                  <MessageCircle size={18} className="text-claudia-primary" />
                  <span>{userProfile.credits || '0'} mensajes disponibles</span>
                </div>
                
                <div className="flex items-center gap-2 p-2 mb-2 text-claudia-white">
                  <CalendarDays size={18} className="text-claudia-primary" />
                  <span>{userProfile.reminders || '0'} recordatorios disponibles</span>
                </div>
                
                <div className="flex items-center gap-2 p-2 mb-2 text-claudia-white">
                  <Phone size={18} className="text-claudia-primary" />
                  <span>Tel: {userPhoneNumber}</span>
                </div>
                
                <div className="flex items-center gap-2 p-2 mb-2 text-claudia-white">
                  <Mail size={18} className="text-claudia-primary" />
                  <span>{user.email || 'No disponible'}</span>
                </div>
                
                <div className="flex items-center gap-2 p-2 text-claudia-white">
                  <CreditCard size={18} className="text-claudia-primary" />
                  <span>Tipo: {userProfile.type_user || 'regular'}</span>
                </div>
                
                <div className="mt-4 pt-3 border-t border-claudia-primary/20">
                  <Button 
                    onClick={handleSignOut}
                    loading={isLoggingOut}
                    variant="ghost"
                    className="w-full text-claudia-white hover:bg-claudia-primary/20 hover:text-claudia-white"
                  >
                    <LogOut size={16} className="mr-2" />
                    Cerrar Sesión
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </header>
      
      <main className="py-4 md:py-8 px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          <Card className="border-claudia-primary/10 shadow-lg overflow-hidden relative">
            {isMobile ? (
              <Button
                variant="primary"
                size="sm"
                className="absolute top-3 right-3 z-10"
                icon={<Plus size={16} />}
              >
                Crear
              </Button>
            ) : null}
            <ReminderCalendar />
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
