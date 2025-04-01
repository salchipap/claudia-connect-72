
import { supabase } from '@/integrations/supabase/client';

export const signIn = async (email: string, password: string) => {
  try {
    console.log('Signing in with email:', email);
    
    // Si es un número de teléfono, lo convertimos a un formato de email
    let emailToUse = email;
    
    // Verificamos si parece un número de teléfono (solo dígitos) y no tiene @
    if (/^\d+$/.test(email) && !email.includes('@')) {
      emailToUse = `${email}@example.com`;
      console.log('Converting phone to email format:', emailToUse);
    }
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: emailToUse,
      password,
    });
    
    if (error) {
      console.error('Error signing in:', error);
      return { success: false, error: error.message };
    }
    
    console.log('Successfully signed in:', data);
    return { 
      success: true,
      userData: data.user 
    };
  } catch (error: any) {
    console.error('Exception during sign in:', error);
    return { success: false, error: error.message || 'An unknown error occurred' };
  }
};
