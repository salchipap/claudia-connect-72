
import { supabase } from '@/integrations/supabase/client';

export const signUp = async (email: string, password: string, metadata?: { [key: string]: any }) => {
  try {
    console.log('Signing up with email:', email, 'and metadata:', metadata);
    
    // First, check if the user email already exists in the users table
    const { data: existingUsers, error: checkError } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .maybeSingle();
      
    if (checkError) {
      console.error('Error checking for existing user:', checkError);
    } else if (existingUsers) {
      console.log('User already exists in users table:', existingUsers);
      return { 
        success: false, 
        error: 'Este correo electrónico ya está registrado.' 
      };
    }
      
    // If not, proceed with signup
    const result = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
        // Configuramos no requerir confirmación de email
        emailRedirectTo: window.location.origin + '/login',
      }
    });

    console.log('SignUp result:', result);
    
    if (result.error) {
      console.error('Error signing up:', result.error);
      return { success: false, error: result.error.message };
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
                status: 'active', // Cambiamos a 'active' para que pueda iniciar sesión inmediatamente
                type_user: 'regular',
                credits: '10', // Asignamos 10 créditos por defecto
                reminders: '5'  // Asignamos 5 recordatorios por defecto
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
      
      return { success: true };
    }
  } catch (error: any) {
    console.error('Exception during signup:', error);
    return { success: false, error: error.message || 'An unknown error occurred' };
  }
};
