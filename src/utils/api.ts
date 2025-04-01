
// API utilities for external services

/**
 * Send verification code to WhatsApp via webhook
 */
export const sendCodeToWhatsApp = async (userData: { 
  email: string;
  phone?: string;
}) => {
  try {
    const response = await fetch('https://nn.tumejorversionhoy.shop/webhook/c1530bfd-a2c3-4c82-bb88-3e956d20b113', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'send_code',
        email: userData.email,
        phone: userData.phone
      }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error al enviar el código');
    }
    
    return {
      success: true,
      message: data.message || 'Código enviado exitosamente'
    };
  } catch (error: any) {
    console.error('Error sending code:', error);
    return {
      success: false,
      message: error.message || 'Error al enviar el código'
    };
  }
};

/**
 * Verify code from webhook
 */
export const verifyCodeWithWebhook = async (verificationData: {
  code: string;
  email: string;
}) => {
  try {
    const response = await fetch('https://nn.tumejorversionhoy.shop/webhook/c1530bfd-a2c3-4c82-bb88-3e956d20b113', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'verify_code',
        code: verificationData.code,
        email: verificationData.email
      }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error al verificar el código');
    }
    
    return {
      success: true,
      message: data.message || 'Código verificado exitosamente'
    };
  } catch (error: any) {
    console.error('Error verifying code:', error);
    return {
      success: false,
      message: error.message || 'Error al verificar el código'
    };
  }
};
