
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';
import { useNavigate } from 'react-router-dom';

// Types
interface UserProfile {
  id: string;
  name: string;
  lastname?: string;
  remotejid?: string;
  reminders?: string;
  credits?: string;
  plan?: string;
}

interface User {
  id: string;
  email?: string;
  user_metadata?: {
    name?: string;
    lastname?: string;
    remotejid?: string;
  };
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  signIn: (identifier: string, password: string) => Promise<{ 
    success: boolean; 
    error?: string;
    needsVerification?: boolean;
    email?: string;
    userId?: string;
  }>;
  signUp: (email: string, password: string, metadata: any) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Verificar sesión inicial
  useEffect(() => {
    console.info('Auth state changed: INITIAL_SESSION', user);
    
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error checking session:', error);
          return;
        }
        
        console.info('Initial session check:', session);
        
        if (session) {
          setUser(session.user as User);
          await fetchUserProfile(session.user.id);
        }
      } catch (error) {
        console.error('Error in session check:', error);
      }
    };
    
    checkSession();
    
    // Suscribirse a cambios de autenticación
    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event);
      
      if (event === 'SIGNED_IN' && session) {
        setUser(session.user as User);
        await fetchUserProfile(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setUserProfile(null);
      }
    });
    
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // Obtener perfil del usuario
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching user profile:', error);
        return;
      }
      
      if (data) {
        setUserProfile(data as UserProfile);
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    }
  };

  // Iniciar sesión
  const signIn = async (identifier: string, password: string) => {
    try {
      // Check if the identifier is an email or phone number
      const isEmail = identifier.includes('@');
      
      // If it's a phone, we need to format it correctly
      let email = identifier;
      
      // Sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Supabase login error:', error);
        return { success: false, error: error.message };
      }
      
      // Fetch user profile
      if (data.user) {
        await fetchUserProfile(data.user.id);
        
        // Check if user needs WhatsApp verification
        // This condition would depend on your user setup
        // Here we're assuming we need to verify if the user has remotejid set
        const userMeta = data.user.user_metadata;
        const hasRemoteJid = userMeta && userMeta.remotejid;
        
        // If verification is needed
        if (!hasRemoteJid) {
          return { 
            success: true, 
            needsVerification: true,
            email: data.user.email,
            userId: data.user.id
          };
        }
        
        return { success: true };
      }
      
      return { success: false, error: 'No se pudo iniciar sesión' };
    } catch (error: any) {
      console.error('Login error:', error);
      return { success: false, error: error.message || 'Error al iniciar sesión' };
    }
  };

  // Registrar usuario
  const signUp = async (email: string, password: string, metadata: any) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      });
      
      if (error) {
        console.error('Supabase registration error:', error);
        return { success: false, error: error.message };
      }
      
      if (data.user) {
        // Create user profile in database
        const { error: profileError } = await supabase
          .from('users')
          .insert([
            {
              id: data.user.id,
              name: metadata.name,
              lastname: metadata.lastname,
              remotejid: metadata.remotejid,
              reminders: '10', // Default value
              credits: '10',   // Default value
              plan: metadata.plan || 'Basic'
            }
          ]);
          
        if (profileError) {
          console.error('Error creating user profile:', profileError);
          return { success: false, error: profileError.message };
        }
        
        return { success: true };
      }
      
      return { success: false, error: 'No se pudo completar el registro' };
    } catch (error: any) {
      console.error('Registration error:', error);
      return { success: false, error: error.message || 'Error durante el registro' };
    }
  };

  // Cerrar sesión
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setUserProfile(null);
      navigate('/');
      
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión correctamente",
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error",
        description: "No se pudo cerrar la sesión",
        variant: "destructive",
      });
    }
  };

  // Actualizar sesión
  const refreshSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error refreshing session:', error);
        return;
      }
      
      if (session && session.user) {
        setUser(session.user as User);
        await fetchUserProfile(session.user.id);
      }
    } catch (error) {
      console.error('Error in refreshSession:', error);
    }
  };

  const value = {
    user,
    userProfile,
    signIn,
    signUp,
    signOut,
    refreshSession
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
