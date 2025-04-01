import { supabase } from '@/integrations/supabase/client';
import { fetchUserProfile } from './fetchUserProfile';

/**
 * Format a phone number for Supabase authentication
 * @param phoneNumber The raw phone number input
 * @param countryCode The country code with + prefix (e.g., +57)
 * @returns Properly formatted phone number
 */
const formatPhoneNumber = (phoneNumber: string, countryCode: string): string => {
  // Strip all non-digit characters
  const cleanPhone = phoneNumber.replace(/\D/g, '');
  
  // Remove the + from country code if present
  const cleanCountryCode = countryCode.startsWith('+') 
    ? countryCode.substring(1) 
    : countryCode;
  
  // Handle different formatting scenarios
  if (cleanPhone.startsWith('0')) {
    // If number starts with 0, remove it and add country code
    return cleanCountryCode + cleanPhone.substring(1);
  } else if (cleanPhone.startsWith(cleanCountryCode)) {
    // If number already includes country code, use as is
    return cleanPhone;
  } else {
    // Otherwise, add country code to number
    return cleanCountryCode + cleanPhone;
  }
};

export const signIn = async (email: string, password: string, isPhoneLogin = false, countryCode = '+57') => {
  try {
    console.log(`Login attempt with ${isPhoneLogin ? 'phone' : 'email'}: ${email}`);
    
    let formattedIdentifier = email;
    
    // Format phone number if this is a phone login
    if (isPhoneLogin) {
      const formattedPhone = formatPhoneNumber(email, countryCode);
      console.log('Raw phone input:', email);
      console.log('Country code:', countryCode);
      console.log('Formatted phone:', formattedPhone);
      formattedIdentifier = `${formattedPhone}@claudia.ai`;
    }
    
    console.log('Final identifier for Supabase:', formattedIdentifier);
    
    const result = await supabase.auth.signInWithPassword({
      email: formattedIdentifier,
      password,
    });
    
    console.log('SignIn result:', result);
    
    if (result.error) {
      console.error('Error signing in:', result.error);
      return { data: null, error: result.error };
    }
    
    console.log('Successfully signed in user:', result.data.user);
    
    // Verify if the user exists in the users table
    if (result.data.user) {
      try {
        const userProfileData = await fetchUserProfile(result.data.user.id);
        
        if (!userProfileData) {
          console.warn('User exists in auth but not in users table, creating profile...');
          
          // Try to create the profile if it doesn't exist
          let remotejid = null;
          if (isPhoneLogin) {
            // For phone logins, use the formatted phone number without @claudia.ai
            remotejid = formatPhoneNumber(email, countryCode);
          } else if (formattedIdentifier.includes('@claudia.ai')) {
            remotejid = formattedIdentifier.split('@')[0];
          }
          
          const { error: insertError } = await supabase
            .from('users')
            .insert([{ 
              id: result.data.user.id, 
              email: formattedIdentifier,
              remotejid: remotejid,
              status: 'active',
              type_user: 'regular',
              credits: '10'
            }]);
            
          if (insertError) {
            console.error('Error creating missing user profile:', insertError);
          } else {
            console.log('Created missing user profile');
          }
        }
      } catch (err) {
        console.error('Exception during missing profile creation:', err);
      }
    }
    
    return { data: result.data, error: null };
  } catch (error) {
    console.error('Exception during signin:', error);
    return { data: null, error };
  }
};
