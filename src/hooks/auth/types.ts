
import { Session, User } from '@supabase/supabase-js';

export type AuthContextType = {
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
