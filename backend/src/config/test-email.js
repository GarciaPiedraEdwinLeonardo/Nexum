// test-email.js
require('dotenv').config();

const testEmail = async () => {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'api-key': process.env.BREVO_API_KEY
        },
        body: JSON.stringify({
            sender: { 
                email: process.env.EMAIL_FROM_ADDRESS,
                name: process.env.EMAIL_FROM_NAME 
            },
            to: [{ email: 'egarciap2306@alumno.ipn.mx' }], // TU EMAIL
            subject: 'Test Nexum - Brevo funcionando',
            htmlContent: '<h1>¡Funciona! ✅</h1><p>Tu configuración de Brevo está correcta.</p>'
        })
    });

    if (response.ok) {
        const data = await response.json();
        console.log('✅ Email enviado exitosamente!');
        console.log('Message ID:', data.messageId);
    } else {
        const error = await response.json();
        console.error('❌ Error:', error);
    }
};

testEmail();