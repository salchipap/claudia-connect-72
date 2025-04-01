
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, UserCircle, CreditCard } from 'lucide-react';
import Button from '@/components/Button';
import { useToast } from '@/hooks/use-toast';

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
            <h1 className="text-3xl md:text-4xl font-bold text-claudia-white">Mi Perfil</h1>
            <Button 
              variant="ghost" 
              onClick={handleSignOut}
              loading={isLoggingOut}
              className="text-claudia-white hover:text-claudia-primary flex items-center gap-2"
            >
              <LogOut size={16} />
              Cerrar Sesión
            </Button>
          </div>
          
          <div className="bg-[#1a2a30] rounded-lg shadow-xl p-8 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-claudia-primary opacity-10 rounded-bl-full -z-10"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-claudia-primary opacity-10 rounded-tr-full -z-10"></div>
            
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
              <div className="bg-claudia-primary/20 rounded-full p-4 flex-shrink-0">
                <UserCircle size={80} className="text-claudia-primary" />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-claudia-white">
                  {userProfile.name || 'Usuario'} {userProfile.lastname || ''}
                </h2>
                
                <p className="text-claudia-white/70">
                  {user.email || userProfile.email || 'No email'}
                </p>
                
                <div className="flex items-center gap-2 text-claudia-primary">
                  <CreditCard size={18} />
                  <span className="font-semibold">{userProfile.credits || '0'} créditos disponibles</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold mb-3 text-claudia-white">Información de contacto</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-claudia-white/70 text-sm">Email</p>
                    <p className="text-claudia-white">{user.email || userProfile.email || 'No disponible'}</p>
                  </div>
                  <div>
                    <p className="text-claudia-white/70 text-sm">WhatsApp</p>
                    <p className="text-claudia-white">{userProfile.remotejid || 'No disponible'}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-bold mb-3 text-claudia-white">Información de la cuenta</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-claudia-white/70 text-sm">Tipo de usuario</p>
                    <p className="text-claudia-white capitalize">{userProfile.type_user || 'regular'}</p>
                  </div>
                  <div>
                    <p className="text-claudia-white/70 text-sm">Estado</p>
                    <p className="text-claudia-white capitalize">{userProfile.status || 'activo'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
