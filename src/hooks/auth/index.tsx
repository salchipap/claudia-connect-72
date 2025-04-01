
import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { AuthContextType, User, UserProfile } from './types';
import { signIn } from './signIn';
import { signUp } from './signUp';
import { signOut } from './signOut';
import { fetchUserProfile } from './fetchUserProfile';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
            fetchUserProfile(session.user.id).then(profile => {
              console.log('User profile fetched:', profile);
              setUserProfile(profile);
            }).catch(error => {
              console.error('Error fetching user profile:', error);
              setError('Error fetching user profile');
            });
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
        fetchUserProfile(session.user.id).then(profile => {
          console.log('Initial user profile:', profile);
          setUserProfile(profile);
        }).catch(error => {
          console.error('Error fetching initial user profile:', error);
          setError('Error fetching initial user profile');
        });
      }
      
      setLoading(false);
    }).catch(error => {
      console.error('Error getting session:', error);
      setLoading(false);
      setError('Error getting session');
    });

    return () => subscription.unsubscribe();
  }, []);

  const value: AuthContextType = {
    user,
    userProfile,
    signUp,
    signIn,
    signOut,
    loading,
    error
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
