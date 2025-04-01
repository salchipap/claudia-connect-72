
// Utilidades para peticiones API

/**
 * Envía una solicitud al webhook para verificar el código de acceso
 */
export const verifyCodeWithWebhook = async (
  email: string,
  code: string,
  userId?: string
): Promise<{ success: boolean; message?: string }> => {
  try {
    const webhookUrl = "https://nn.tumejorversionhoy.shop/webhook/c1530bfd-a2c3-4c82-bb88-3e956d20b113";
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        userId,
        code,
        action: 'verify_code'
      })
    });
    
    if (!response.ok) {
      return { success: false, message: 'Error en la verificación' };
    }
    
    const result = await response.json().catch(() => ({ success: false }));
    
    return {
      success: result.success || result.verified || false,
      message: result.message
    };
  } catch (error) {
    console.error('Error en la verificación:', error);
    return { success: false, message: 'Error en la conexión con el servidor' };
  }
};

/**
 * Envía una solicitud al webhook para solicitar un código de verificación
 */
export const requestVerificationCode = async (
  email: string,
  userId?: string
): Promise<{ success: boolean; message?: string }> => {
  try {
    const webhookUrl = "https://nn.tumejorversionhoy.shop/webhook/c1530bfd-a2c3-4c82-bb88-3e956d20b113";
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        userId,
        action: 'request_code'
      })
    });
    
    if (!response.ok) {
      return { success: false, message: 'Error al solicitar el código' };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error al solicitar código:', error);
    return { success: false, message: 'Error en la conexión con el servidor' };
  }
};
