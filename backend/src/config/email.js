const sgMail = require('@sendgrid/mail');
require('dotenv').config();

const BREVO_API_KEY = process.env.BREVO_API_KEY;

// IMPORTANTE: El email debe estar verificado en Brevo
// Opcion 1: Tu email personal verificado en Brevo (recomendado para desarrollo)
// Opcion 2: Email por defecto de Brevo (ej: tu-cuenta@brevo.sendinblue.com)
// Opcion 3: Dominio personalizado verificado
const EMAIL_FROM = {
    email: process.env.EMAIL_FROM_ADDRESS,
    name: process.env.EMAIL_FROM_NAME
};

// Límite diario de emails (300 en plan gratuito de Brevo)
const DAILY_EMAIL_LIMIT = parseInt(process.env.DAILY_EMAIL_LIMIT);

// Importar modelo de email logs (se importa después para evitar dependencia circular)
let EmailLog;
try {
    EmailLog = require('../models/EmailLog');
} catch (error) {
    console.warn('⚠️ EmailLog model no disponible, límites desactivados');
    EmailLog = null;
}

/**
 * Verificar si se puede enviar un email (dentro del límite diario)
 */
const checkEmailLimit = async () => {
    if (!EmailLog) {
        // Si no hay modelo de logs, permitir envío (modo sin DB)
        return { canSend: true, count: 0, limit: DAILY_EMAIL_LIMIT, remaining: DAILY_EMAIL_LIMIT };
    }

    return await EmailLog.canSendEmail();
};

/**
 * Enviar email usando Brevo API
 */
const sendEmail = async ({ to, subject, html, text, emailType = 'generic' }) => {
    try {
        // 1. Verificar límite diario
        const limitStatus = await checkEmailLimit();
        
        if (!limitStatus.canSend) {
            const error = new Error('Límite diario de emails alcanzado');
            error.code = 'DAILY_LIMIT_EXCEEDED';
            error.limitInfo = limitStatus;
            
            console.error('❌ Límite de emails alcanzado:', limitStatus);
            
            // Registrar intento fallido
            if (EmailLog) {
                await EmailLog.log(to, emailType, false, 'Límite diario excedido');
            }
            
            throw error;
        }

        // 2. Enviar email con Brevo API
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'api-key': BREVO_API_KEY
            },
            body: JSON.stringify({
                sender: EMAIL_FROM,
                to: [{ email: to }],
                subject: subject,
                htmlContent: html,
                textContent: text || html.replace(/<[^>]*>/g, '') // Fallback a texto plano
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Brevo API Error: ${JSON.stringify(error)}`);
        }

        const result = await response.json();
        
        // 3. Registrar email enviado exitosamente
        if (EmailLog) {
            await EmailLog.log(to, emailType, true);
        }
        
        console.log('✅ Email enviado:', { 
            to, 
            type: emailType,
            messageId: result.messageId,
            remaining: limitStatus.remaining - 1
        });
        
        return result;

    } catch (error) {
        console.error('❌ Error al enviar email:', error);
        
        // Registrar error
        if (EmailLog && error.code !== 'DAILY_LIMIT_EXCEEDED') {
            await EmailLog.log(to, emailType, false, error.message);
        }
        
        throw error;
    }
};

// Template para email de verificación
const sendVerificationEmail = async (email, token, userName) => {
    const verificationUrl = `${process.env.VERIFY_EMAIL_URL}/${token}`;

    const html = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verifica tu Email - Nexum</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f4;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #7A1E2D 0%, #621823 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Nexum</h1>
                            <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 14px; opacity: 0.9;">Plataforma de Conexión Laboral IPN</p>
                        </td>
                    </tr>
                    
                    <!-- Body -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <h2 style="margin: 0 0 20px 0; color: #1F3A5F; font-size: 24px;">¡Bienvenido a Nexum, ${userName}!</h2>
                            
                            <p style="margin: 0 0 20px 0; color: #2E2E2E; font-size: 16px; line-height: 1.6;">
                                Gracias por registrarte en Nexum. Estás a un paso de acceder a las mejores oportunidades laborales del IPN.
                            </p>
                            
                            <p style="margin: 0 0 30px 0; color: #2E2E2E; font-size: 16px; line-height: 1.6;">
                                Para activar tu cuenta, haz clic en el siguiente botón:
                            </p>
                            
                            <!-- Button -->
                            <table role="presentation" style="margin: 0 auto;">
                                <tr>
                                    <td style="border-radius: 8px; background-color: #7A1E2D;">
                                        <a href="${verificationUrl}" target="_blank" style="display: inline-block; padding: 16px 40px; font-size: 16px; color: #ffffff; text-decoration: none; font-weight: bold;">
                                            Verificar mi Email
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="margin: 30px 0 0 0; color: #666666; font-size: 14px; line-height: 1.6;">
                                Si el botón no funciona, copia y pega este enlace en tu navegador:
                            </p>
                            <p style="margin: 10px 0 0 0; color: #7A1E2D; font-size: 14px; word-break: break-all;">
                                ${verificationUrl}
                            </p>
                            
                            <!-- Info Box -->
                            <div style="margin-top: 30px; padding: 20px; background-color: #FFF8E1; border-left: 4px solid #FFC107; border-radius: 4px;">
                                <p style="margin: 0; color: #2E2E2E; font-size: 14px;">
                                    <strong>⏰ Importante:</strong> Este enlace es válido por 24 horas.
                                </p>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8f8f8; padding: 30px; text-align: center; border-top: 1px solid #e0e0e0;">
                            <p style="margin: 0 0 10px 0; color: #666666; font-size: 14px;">
                                Si no creaste esta cuenta, puedes ignorar este correo.
                            </p>
                            <p style="margin: 0; color: #999999; font-size: 12px;">
                                © ${new Date().getFullYear()} Nexum. Todos los derechos reservados.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `;

    const text = `
Hola ${userName},

Bienvenido a Nexum. Para verificar tu cuenta, visita el siguiente enlace:

${verificationUrl}

Este enlace es válido por 24 horas.

Si no creaste esta cuenta, ignora este correo.

© ${new Date().getFullYear()} Nexum
    `;

    return await sendEmail({
        to: email,
        subject: '✅ Verifica tu cuenta de Nexum',
        html,
        text,
        emailType: 'verification'
    });
};

// Template para email de reseteo de contraseña
const sendPasswordResetEmail = async (email, token, userName) => {
    const resetUrl = `${process.env.RESET_PASSWORD_URL}?token=${token}`;

    const html = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Restablecer Contraseña - Nexum</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f4;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #7A1E2D 0%, #621823 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Nexum</h1>
                            <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 14px; opacity: 0.9;">Recuperación de Contraseña</p>
                        </td>
                    </tr>
                    
                    <!-- Body -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <h2 style="margin: 0 0 20px 0; color: #1F3A5F; font-size: 24px;">Hola ${userName},</h2>
                            
                            <p style="margin: 0 0 20px 0; color: #2E2E2E; font-size: 16px; line-height: 1.6;">
                                Recibimos una solicitud para restablecer tu contraseña de Nexum.
                            </p>
                            
                            <p style="margin: 0 0 30px 0; color: #2E2E2E; font-size: 16px; line-height: 1.6;">
                                Haz clic en el siguiente botón para crear una nueva contraseña:
                            </p>
                            
                            <!-- Button -->
                            <table role="presentation" style="margin: 0 auto;">
                                <tr>
                                    <td style="border-radius: 8px; background-color: #7A1E2D;">
                                        <a href="${resetUrl}" target="_blank" style="display: inline-block; padding: 16px 40px; font-size: 16px; color: #ffffff; text-decoration: none; font-weight: bold;">
                                            Restablecer Contraseña
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="margin: 30px 0 0 0; color: #666666; font-size: 14px; line-height: 1.6;">
                                Si el botón no funciona, copia y pega este enlace en tu navegador:
                            </p>
                            <p style="margin: 10px 0 0 0; color: #7A1E2D; font-size: 14px; word-break: break-all;">
                                ${resetUrl}
                            </p>
                            
                            <!-- Warning Box -->
                            <div style="margin-top: 30px; padding: 20px; background-color: #FFEBEE; border-left: 4px solid #D32F2F; border-radius: 4px;">
                                <p style="margin: 0 0 10px 0; color: #2E2E2E; font-size: 14px;">
                                    <strong>⚠️ Importante:</strong>
                                </p>
                                <ul style="margin: 0; padding-left: 20px; color: #2E2E2E; font-size: 14px;">
                                    <li>Este enlace es válido por 1 hora</li>
                                    <li>Solo puede usarse una vez</li>
                                </ul>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8f8f8; padding: 30px; text-align: center; border-top: 1px solid #e0e0e0;">
                            <p style="margin: 0 0 10px 0; color: #666666; font-size: 14px;">
                                Si no solicitaste este cambio, ignora este correo. Tu contraseña no será modificada.
                            </p>
                            <p style="margin: 0; color: #999999; font-size: 12px;">
                                © ${new Date().getFullYear()} Nexum. Todos los derechos reservados.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `;

    const text = `
Hola ${userName},

Recibimos una solicitud para restablecer tu contraseña de Nexum.

Para crear una nueva contraseña, visita el siguiente enlace:

${resetUrl}

Este enlace es válido por 1 hora y solo puede usarse una vez.

Si no solicitaste este cambio, ignora este correo.

© ${new Date().getFullYear()} Nexum
    `;

    return await sendEmail({
        to: email,
        subject: '🔒 Restablece tu contraseña de Nexum',
        html,
        text,
        emailType: 'password_reset'
    });
};

// Verificar configuración de email
const verifyEmailConfig = () => {
    if (!BREVO_API_KEY) {
        console.warn('⚠️ BREVO_API_KEY no está configurado');
        return false;
    }
    console.log('✅ Configuración de email (Brevo) verificada');
    console.log(`📊 Límite diario: ${DAILY_EMAIL_LIMIT} emails`);
    return true;
};

// Obtener estadísticas de uso de emails
const getEmailStats = async () => {
    if (!EmailLog) {
        return { error: 'EmailLog model no disponible' };
    }

    const limitStatus = await checkEmailLimit();
    const todayStats = await EmailLog.getTodayStats();
    
    return {
        today: limitStatus,
        breakdown: todayStats
    };
};

module.exports = {
    sendEmail,
    sendVerificationEmail,
    sendPasswordResetEmail,
    verifyEmailConfig,
    checkEmailLimit,
    getEmailStats,
    DAILY_EMAIL_LIMIT
};