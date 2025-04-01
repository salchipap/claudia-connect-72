
import { supabase } from '@/integrations/supabase/client';

export const signOut = async () => {
  try {
    console.log('Signing out user');
    // Intentar cerrar sesión con el cliente de Supabase
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Error signing out:', error);
      throw error;
    } else {
      console.log('Successfully signed out');
      // Forzar recarga para asegurar que se limpie el estado y se redirija correctamente
      window.location.href = '/';
    }
  } catch (error) {
    console.error('Exception during signout:', error);
    // En caso de error, intentar forzar la limpieza de la sesión
    window.location.href = '/';
  }
};
