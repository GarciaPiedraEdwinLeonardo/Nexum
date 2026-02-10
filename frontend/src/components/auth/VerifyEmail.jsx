import { useState } from 'react';
import { AiOutlineMail, AiOutlineCheckCircle, AiOutlineClockCircle } from 'react-icons/ai';
import authService from '../../services/authService';

function VerifyEmail({ email, onResendEmail }) {
    const [isFormHovered, setIsFormHovered] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [resendSuccess, setResendSuccess] = useState(false);
    const [resendError, setResendError] = useState('');

    const handleResendEmail = async () => {
        setIsResending(true);
        setResendError('');
        setResendSuccess(false);

        try {
            // Llamar al servicio para reenviar email
            await authService.resendVerificationEmail(email);

            console.log('Email de verificación reenviado a:', email);
            setResendSuccess(true);

            // Ocultar mensaje de éxito después de 3 segundos
            setTimeout(() => {
                setResendSuccess(false);
            }, 3000);

            if (onResendEmail) {
                onResendEmail(email);
            }

        } catch (error) {
            console.error('Error al reenviar email:', error);

            if (error.message === 'Network Error') {
                setResendError('No se pudo conectar con el servidor. Verifica tu conexión.');
            } else if (error.message) {
                setResendError(error.message);
            } else {
                setResendError('Error al reenviar el correo. Por favor, intenta nuevamente.');
            }

            // Ocultar mensaje de error después de 5 segundos
            setTimeout(() => {
                setResendError('');
            }, 5000);

        } finally {
            setIsResending(false);
        }
    };

    return (
        <div
            className="bg-white rounded-3xl shadow-2xl p-10 relative overflow-hidden transition-all duration-300 ease-out"
            style={{
                transform: isFormHovered ? 'translateY(-2px)' : 'translateY(0)',
                boxShadow: isFormHovered
                    ? '0 25px 50px -12px rgba(122, 30, 45, 0.25)'
                    : '0 20px 25px -5px rgba(122, 30, 45, 0.15)'
            }}
            onMouseEnter={() => setIsFormHovered(true)}
            onMouseLeave={() => setIsFormHovered(false)}
        >
            {/* Barra superior sutil - azul petróleo para verificación */}
            <div
                className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl"
                style={{ backgroundColor: '#1F3A5F' }}
            ></div>

            <div className="text-center py-6">
                {/* Ícono de email */}
                <div className="flex justify-center mb-6">
                    <div
                        className="w-24 h-24 rounded-full flex items-center justify-center relative"
                        style={{ backgroundColor: 'rgba(31, 58, 95, 0.1)' }}
                    >
                        <AiOutlineMail size={52} style={{ color: '#1F3A5F' }} />
                        {/* Indicador de pendiente */}
                        <div
                            className="absolute -top-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: '#7A1E2D' }}
                        >
                            <AiOutlineClockCircle size={18} style={{ color: 'white' }} />
                        </div>
                    </div>
                </div>

                <h2 className="text-4xl font-bold mb-4" style={{ color: '#1F3A5F' }}>
                    ¡Verifica tu Email!
                </h2>

                <p className="text-base mb-6" style={{ color: 'rgba(46, 46, 46, 0.7)' }}>
                    Tu cuenta ha sido creada exitosamente.
                    <br />
                    Hemos enviado un correo de verificación a:
                </p>

                <div
                    className="rounded-xl p-4 mb-6"
                    style={{ backgroundColor: 'rgba(31, 58, 95, 0.05)' }}
                >
                    <div className="flex items-center justify-center gap-3">
                        <AiOutlineMail size={20} className="flex-shrink-0" style={{ color: '#1F3A5F' }} />
                        <p className="text-lg font-semibold break-all" style={{ color: '#7A1E2D' }}>
                            {email}
                        </p>
                    </div>
                </div>

                <div
                    className="rounded-xl p-5 mb-6"
                    style={{ backgroundColor: '#F2F2F2' }}
                >
                    <h3 className="font-semibold mb-3 text-left" style={{ color: '#2E2E2E' }}>
                        Pasos para continuar:
                    </h3>
                    <ol className="text-sm text-left space-y-2" style={{ color: 'rgba(46, 46, 46, 0.8)' }}>
                        <li className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                                style={{ backgroundColor: '#1F3A5F' }}>
                                1
                            </span>
                            <span>Abre tu bandeja de entrada y busca el correo de Nexum</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                                style={{ backgroundColor: '#1F3A5F' }}>
                                2
                            </span>
                            <span>Haz clic en el enlace de verificación</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                                style={{ backgroundColor: '#1F3A5F' }}>
                                3
                            </span>
                            <span>Tu cuenta será activada y podrás iniciar sesión</span>
                        </li>
                    </ol>
                </div>

                <div
                    className="rounded-xl p-4 mb-6"
                    style={{ backgroundColor: 'rgba(255, 193, 7, 0.1)', borderLeft: '4px solid #FFC107' }}
                >
                    <p className="text-sm text-left" style={{ color: 'rgba(46, 46, 46, 0.8)' }}>
                        <strong>Tip:</strong> Si no encuentras el correo, revisa tu carpeta de spam o correo no deseado.
                    </p>
                </div>

                {/* Mensaje de reenvío exitoso */}
                {resendSuccess && (
                    <div
                        className="rounded-xl p-4 mb-6 flex items-center gap-3 animate-fade-in"
                        style={{ backgroundColor: 'rgba(46, 125, 50, 0.1)', borderLeft: '4px solid #2E7D32' }}
                    >
                        <AiOutlineCheckCircle size={24} style={{ color: '#2E7D32' }} />
                        <p className="text-sm font-medium" style={{ color: '#2E7D32' }}>
                            ¡Correo reenviado exitosamente!
                        </p>
                    </div>
                )}

                {/* Mensaje de error al reenviar */}
                {resendError && (
                    <div
                        className="rounded-xl p-4 mb-6 animate-fade-in"
                        style={{ backgroundColor: 'rgba(211, 47, 47, 0.1)', borderLeft: '4px solid #D32F2F' }}
                    >
                        <p className="text-sm font-medium" style={{ color: '#D32F2F' }}>
                            {resendError}
                        </p>
                    </div>
                )}

                {/* Botón de reenviar correo */}
                <div className="mb-6">
                    <p className="text-sm mb-3" style={{ color: 'rgba(46, 46, 46, 0.6)' }}>
                        ¿No recibiste el correo?
                    </p>
                    <button
                        onClick={handleResendEmail}
                        disabled={isResending}
                        className="w-full font-semibold py-3 rounded-xl transition-all duration-300 text-base border-2"
                        style={{
                            color: isResending ? 'rgba(31, 58, 95, 0.5)' : '#1F3A5F',
                            borderColor: isResending ? 'rgba(31, 58, 95, 0.3)' : '#1F3A5F',
                            backgroundColor: 'transparent',
                            cursor: isResending ? 'not-allowed' : 'pointer'
                        }}
                        onMouseEnter={(e) => {
                            if (!isResending) {
                                e.target.style.backgroundColor = 'rgba(31, 58, 95, 0.05)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!isResending) {
                                e.target.style.backgroundColor = 'transparent';
                            }
                        }}
                    >
                        {isResending ? (
                            <span className="flex items-center justify-center gap-2">
                                <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin"
                                    style={{ borderColor: '#1F3A5F' }}></div>
                                Reenviando...
                            </span>
                        ) : (
                            'Reenviar Correo de Verificación'
                        )}
                    </button>
                </div>

                <p className="text-xs mt-6" style={{ color: 'rgba(46, 46, 46, 0.5)' }}>
                    El enlace de verificación es válido por 24 horas
                </p>
            </div>
        </div>
    );
}

export default VerifyEmail;