
import { User as SupabaseUser } from '@supabase/supabase-js';

export interface User extends SupabaseUser {
  // Add any additional user properties here
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
  reminders?: string; // Add this line
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
