
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import ReminderCalendar from '@/components/ReminderCalendar';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, UserCircle, Mail, Calendar, BreadSlice } from 'lucide-react';
import Button from '@/components/Button';
import { useToast } from '@/hooks/use-toast';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

const Dashboard = () => {
  const { user, userProfile, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    // Si no hay usuario autenticado y no está cargando, redirigir al login
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
      navigate('/');
    } catch (error: any) {
      console.error('Error al cerrar sesión:', error);
      toast({
        title: "Error",
        description: "No se pudo cerrar sesión. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#142126] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-claudia-primary"></div>
      </div>
    );
  }

  if (!user || !userProfile) {
    return null; // No renderizar nada mientras se redirige
  }

  return (
    <div className="min-h-screen bg-[#142126] text-claudia-foreground relative">
      <NavBar />
      
      <main className="pt-20 pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 flex justify-between items-center">
            <h1 className="text-3xl md:text-4xl font-bold text-claudia-white">Dashboard</h1>
            
            <Popover>
              <PopoverTrigger asChild>
                <button className="flex items-center gap-2 p-2 rounded-full bg-[#1a2a30] hover:bg-claudia-primary/20 transition-colors">
                  <Avatar className="h-10 w-10 border-2 border-claudia-primary/30">
                    <AvatarImage src={userProfile.pic || undefined} alt={userProfile.name || 'Usuario'} />
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
                      <AvatarImage src={userProfile.pic || undefined} alt={userProfile.name || 'Usuario'} />
                      <AvatarFallback className="bg-claudia-primary/20 text-claudia-primary">
                        {userProfile.name ? userProfile.name[0].toUpperCase() : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-lg font-semibold text-claudia-white">
                        {userProfile.name || 'Usuario'} {userProfile.lastname || ''}
                      </h2>
                      <p className="text-sm text-claudia-white/70">
                        {user.email || userProfile.email || 'No email'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-3">
                  <div className="flex items-center gap-2 p-2 mb-2 text-claudia-white">
                    <BreadSlice size={18} className="text-claudia-primary" />
                    <span>{userProfile.credits || '0'} panes disponibles</span>
                  </div>
                  
                  <div className="flex items-center gap-2 p-2 mb-2 text-claudia-white">
                    <Mail size={18} className="text-claudia-primary" />
                    <span>{userProfile.remotejid || 'No disponible'}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 p-2 text-claudia-white">
                    <Calendar size={18} className="text-claudia-primary" />
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
          
          <div className="grid grid-cols-1 gap-6">
            <ReminderCalendar />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
