
import { supabase } from '@/integrations/supabase/client';

export const signOut = async () => {
  try {
    console.log('Signing out user');
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
    } else {
      console.log('Successfully signed out');
    }
  } catch (error) {
    console.error('Exception during signout:', error);
  }
};
