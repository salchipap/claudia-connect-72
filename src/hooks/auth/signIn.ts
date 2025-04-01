
import { supabase } from '@/integrations/supabase/client';
import { fetchUserProfile } from './fetchUserProfile';

export const signIn = async (email: string, password: string) => {
  try {
    console.log('Iniciando sesión con:', email);
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
          console.warn('Usuario existe en auth pero no en users table, creando perfil...');
          // Intentar crear el perfil si no existe
          try {
            // Verificar si el email es un número de teléfono formateado
            let remotejid = null;
            if (email.includes('@claudia.ai')) {
              remotejid = email.split('@')[0];
            }
            
            const { error: insertError } = await supabase
              .from('users')
              .insert([{ 
                id: result.data.user.id, 
                email: email,
                remotejid: remotejid,
                status: 'active',
                type_user: 'regular',
                credits: '10' // Asignamos 10 créditos por defecto
              }]);
              
            if (insertError) {
              console.error('Error creating missing user profile:', insertError);
            } else {
              console.log('Created missing user profile');
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
