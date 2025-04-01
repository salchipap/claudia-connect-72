// API utilities for external services

/**
 * Send verification code to WhatsApp via webhook
 */
export const sendCodeToWhatsApp = async (userData: { 
  email: string;
  phone?: string;
  name?: string;
  lastname?: string;
  id?: string;
}) => {
  try {
    console.log('Sending verification data to webhook:', userData);
    
    const response = await fetch('https://nn.tumejorversionhoy.shop/webhook/c1530bfd-a2c3-4c82-bb88-3e956d20b113', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'send_code',
        ...userData
      }),
    });
    
    const data = await response.json();
    console.log('Webhook response:', data);
    
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
  userId?: string;
}) => {
  try {
    console.log('Verifying code with webhook:', verificationData);
    
    const response = await fetch('https://nn.tumejorversionhoy.shop/webhook/c1530bfd-a2c3-4c82-bb88-3e956d20b113', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'verify_code',
        ...verificationData
      }),
    });
    
    const data = await response.json();
    console.log('Verification response:', data);
    
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

export const loginUser = async (credentials: {
  phone?: string;
  email?: string;
  password: string;
}) => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error al iniciar sesión');
    }
    
    return {
      success: true,
      message: data.message || 'Inicio de sesión exitoso'
    };
  } catch (error: any) {
    console.error('Error during login:', error);
    return {
      success: false,
      message: error.message || 'Error al iniciar sesión'
    };
  }
};
