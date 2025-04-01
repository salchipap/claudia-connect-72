
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

export const fetchUserProfile = async (userId: string) => {
  try {
    console.log('Buscando perfil de usuario con ID:', userId);
    
    // Primero intentamos con el ID de usuario
    let { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    
    if (error) {
      console.error('Error al buscar perfil de usuario por ID:', error);
      return null;
    }
    
    // Si no encontramos el perfil por ID, buscamos por email
    if (!data && supabase.auth.getUser) {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      
      if (user?.email) {
        console.log('Perfil no encontrado por ID, buscando por email:', user.email);
        
        const { data: emailData, error: emailError } = await supabase
          .from('users')
          .select('*')
          .eq('email', user.email)
          .maybeSingle();
          
        if (emailError) {
          console.error('Error al buscar perfil de usuario por email:', emailError);
          return null;
        }
        
        data = emailData;
      }
    }
    
    // Si no encontramos el perfil por ID ni por email, buscamos por remotejid (teléfono)
    // Verificamos si el email tiene el formato de teléfono: XXXXX@claudia.ai
    if (!data && supabase.auth.getUser) {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      
      if (user?.email) {
        const emailParts = user.email.split('@');
        if (emailParts.length === 2 && emailParts[1] === 'claudia.ai') {
          const phone = emailParts[0]; // Esto sería el número de teléfono
          console.log('Perfil no encontrado por email, buscando por remotejid (teléfono):', phone);
          
          const { data: phoneData, error: phoneError } = await supabase
            .from('users')
            .select('*')
            .eq('remotejid', phone)
            .maybeSingle();
            
          if (phoneError) {
            console.error('Error al buscar perfil de usuario por remotejid:', phoneError);
            return null;
          }
          
          data = phoneData;
        }
      }
    }
    
    // Si no se encontró perfil, creamos uno básico para que la aplicación funcione
    if (!data && supabase.auth.getUser) {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      
      if (user) {
        console.log('No se encontró perfil, creando uno básico para:', user.id);
        
        // Intentamos extraer un remotejid del email si tiene formato teléfono@claudia.ai
        let remotejid = null;
        if (user.email) {
          const emailParts = user.email.split('@');
          if (emailParts.length === 2 && emailParts[1] === 'claudia.ai') {
            remotejid = emailParts[0];
          }
        }
        
        const { data: newProfile, error: insertError } = await supabase
          .from('users')
          .insert({
            id: user.id,
            email: user.email,
            remotejid: remotejid,
            status: 'active',
            type_user: 'regular',
            credits: '10'
          })
          .select()
          .maybeSingle();
        
        if (insertError) {
          console.error('Error al crear perfil básico:', insertError);
          return null;
        }
        
        data = newProfile;
      }
    }
    
    if (data) {
      console.log('Perfil de usuario encontrado:', data);
      return data;
    } else {
      console.log('No se encontró perfil de usuario');
      return null;
    }
  } catch (error) {
    console.error('Excepción durante la búsqueda del perfil de usuario:', error);
    return null;
  }
};
