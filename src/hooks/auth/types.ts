
import { User as SupabaseUser } from '@supabase/supabase-js';

export interface User extends Omit<SupabaseUser, 'user_metadata'> {
  // We extend Supabase User but omit user_metadata to redefine it properly
  user_metadata: { [key: string]: any };
  id: string;
  email?: string;
}

export interface UserProfile {
  id: string;
  name?: string;
  lastname?: string;
  email?: string;
  remotejid?: string;
  push_name?: string;
  pic?: string;
  status?: string;
  last_message?: string;
  credits?: string;
  reminders?: string;  // Agregamos esta propiedad que corresponde a la columna en la base de datos
  type_user?: string;
}

export interface AuthState {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<{
    success: boolean;
    error?: string;
  }>;
  signUp: (email: string, password: string, metadata?: { [key: string]: any }) => Promise<{
    success: boolean;
    error?: string;
  }>;
  signOut: () => Promise<void>;
}
