
// Function to verify code with webhook
export const verifyCodeWithWebhook = async ({
  code,
  email,
  userId
}: {
  code: string;
  email: string;
  userId?: string;
}) => {
  try {
    // Here you would typically make an API call to your backend verification service
    // For demo purposes, we're simulating a successful verification with a specific code
    if (code === '123456') {
      console.log('Verification successful with code:', code);
      return {
        success: true,
        message: 'Verification successful'
      };
    }
    
    // For any other code, simulate a failed verification
    return {
      success: false,
      message: 'El código ingresado no es válido. Por favor, verifica e intenta nuevamente.'
    };
  } catch (error) {
    console.error('Error during verification:', error);
    return {
      success: false,
      message: 'Ocurrió un error durante la verificación. Por favor, intenta nuevamente.'
    };
  }
};
