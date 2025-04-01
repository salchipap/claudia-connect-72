
import { supabase } from '@/integrations/supabase/client';

export const signIn = async (email: string, password: string) => {
  try {
    console.log('Signing in with email:', email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('Error signing in:', error);
      return { success: false, error: error.message };
    }
    
    console.log('Successfully signed in:', data);
    return { success: true };
  } catch (error: any) {
    console.error('Exception during sign in:', error);
    return { success: false, error: error.message || 'An unknown error occurred' };
  }
};
