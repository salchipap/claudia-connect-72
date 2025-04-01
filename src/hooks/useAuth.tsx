
import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  userProfile: any | null; // Usuario de la tabla users
  signUp: (email: string, password: string, metadata?: { [key: string]: any }) => Promise<{
    error: any | null;
    data: any | null;
  }>;
  signIn: (email: string, password: string) => Promise<{
    error: any | null;
    data: any | null;
  }>;
  signOut: () => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Función para obtener el perfil de usuario desde la tabla users
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }
      
      console.log('User profile fetched successfully:', data);
      setUserProfile(data);
      return data;
    } catch (error) {
      console.error('Exception during user profile fetch:', error);
      return null;
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST - this is critical for session management
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        
        // Fetch user profile when session changes
        if (session?.user) {
          // Use setTimeout to avoid Supabase auth deadlock
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        } else {
          setUserProfile(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, metadata?: { [key: string]: any }) => {
    try {
      console.log('Signing up with email:', email, 'and metadata:', metadata);
      const result = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        }
      });

      console.log('SignUp result:', result);
      
      if (result.error) {
        console.error('Error signing up:', result.error);
      } else {
        console.log('Successfully signed up user:', result.data.user);
        
        // If the signup was successful and we have a user ID, try to create the user in our custom table as well
        if (result.data.user && result.data.user.id && metadata) {
          try {
            const { error: insertError } = await supabase
              .from('users')
              .insert([
                { 
                  id: result.data.user.id, 
                  email: email,
                  name: metadata.name,
                  lastname: metadata.lastname,
                  remotejid: metadata.remotejid,
                  status: 'pending',
                  type_user: 'regular',
                  credits: '0'
                }
              ]);
              
            if (insertError) {
              console.error('Error inserting user profile:', insertError);
            } else {
              console.log('Successfully created user profile in users table');
            }
          } catch (insertErr) {
            console.error('Exception during user profile creation:', insertErr);
          }
        }
      }
      
      return { data: result.data, error: result.error };
    } catch (error) {
      console.error('Exception during signup:', error);
      return { data: null, error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Signing in with email:', email);
      const result = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      console.log('SignIn result:', result);
      
      if (result.error) {
        console.error('Error signing in:', result.error);
      } else {
        console.log('Successfully signed in user:', result.data.user);
        
        // Verificar si el usuario existe en la tabla users
        if (result.data.user) {
          const userProfileData = await fetchUserProfile(result.data.user.id);
          
          if (!userProfileData) {
            console.warn('User exists in auth but not in users table, creating profile...');
            // Intentar crear el perfil si no existe
            try {
              const { error: insertError } = await supabase
                .from('users')
                .insert([{ 
                  id: result.data.user.id, 
                  email: email,
                  status: 'active',
                  type_user: 'regular',
                  credits: '0'
                }]);
                
              if (insertError) {
                console.error('Error creating missing user profile:', insertError);
              } else {
                console.log('Created missing user profile');
                // Actualizar el perfil de usuario
                fetchUserProfile(result.data.user.id);
              }
            } catch (err) {
              console.error('Exception during missing profile creation:', err);
            }
          }
        }
      }
      
      return { data: result.data, error: result.error };
    } catch (error) {
      console.error('Exception during signin:', error);
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      console.log('Signing out user');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
      } else {
        console.log('Successfully signed out');
        setUserProfile(null);
      }
    } catch (error) {
      console.error('Exception during signout:', error);
    }
  };

  const value = {
    session,
    user,
    userProfile,
    signUp,
    signIn,
    signOut,
    loading,
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
