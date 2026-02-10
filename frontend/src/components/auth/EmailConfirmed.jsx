import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AiOutlineCheckCircle, AiOutlineCloseCircle, AiOutlineLoading3Quarters } from 'react-icons/ai';
import authService from '../../services/authService';

function EmailConfirmed() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('loading'); // 'loading', 'success', 'error'
    const [errorMessage, setErrorMessage] = useState('');
    const [countdown, setCountdown] = useState(3);

    useEffect(() => {
        verifyEmailToken();
    }, [token]);

    // Countdown para redirigir al dashboard
    useEffect(() => {
        if (status === 'success' && countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (status === 'success' && countdown === 0) {
            // Redirigir al dashboard
            navigate('/dashboard');
        }
    }, [status, countdown, navigate]);

    const verifyEmailToken = async () => {
        try {
            // Llamar al servicio de verificación de email
            const response = await authService.verifyEmail(token);

            console.log('Email verificado exitosamente:', response);
            setStatus('success');

        } catch (error) {
            console.error('Error al verificar email:', error);
            setStatus('error');

            if (error.message === 'Network Error') {
                setErrorMessage('No se pudo conectar con el servidor. Verifica tu conexión.');
            } else if (error.message) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage('El enlace de verificación es inválido o ha expirado');
            }
        }
    };

    const handleRetryVerification = () => {
        setStatus('loading');
        setErrorMessage('');
        verifyEmailToken();
    };

    const handleBackToLogin = () => {
        navigate('/login');
    };

    // Estado de CARGANDO
    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center p-8" style={{ backgroundColor: '#7A1E2D' }}>
                <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center relative">
                    {/* Barra superior */}
                    <div
                        className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl"
                        style={{ backgroundColor: '#1F3A5F' }}
                    ></div>

                    {/* Spinner animado */}
                    <div className="flex justify-center mb-6">
                        <div
                            className="w-24 h-24 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: 'rgba(31, 58, 95, 0.1)' }}
                        >
                            <AiOutlineLoading3Quarters
                                size={52}
                                className="animate-spin"
                                style={{ color: '#1F3A5F' }}
                            />
                        </div>
                    </div>

                    <h2 className="text-3xl font-bold mb-4" style={{ color: '#1F3A5F' }}>
                        Verificando tu Email...
                    </h2>

                    <p className="text-base" style={{ color: 'rgba(46, 46, 46, 0.7)' }}>
                        Por favor espera mientras confirmamos tu cuenta
                    </p>

                    <div className="mt-8">
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#1F3A5F' }}></div>
                            <div className="w-2 h-2 rounded-full animate-pulse delay-75" style={{ backgroundColor: '#1F3A5F' }}></div>
                            <div className="w-2 h-2 rounded-full animate-pulse delay-150" style={{ backgroundColor: '#1F3A5F' }}></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Estado de ÉXITO
    if (status === 'success') {
        return (
            <div className="min-h-screen flex items-center justify-center p-8" style={{ backgroundColor: '#7A1E2D' }}>
                <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center relative">
                    {/* Barra superior verde */}
                    <div
                        className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl"
                        style={{ backgroundColor: '#2E7D32' }}
                    ></div>

                    {/* Ícono de éxito */}
                    <div className="flex justify-center mb-6">
                        <div
                            className="w-24 h-24 rounded-full flex items-center justify-center animate-bounce-once"
                            style={{ backgroundColor: 'rgba(46, 125, 50, 0.1)' }}
                        >
                            <AiOutlineCheckCircle
                                size={52}
                                style={{ color: '#2E7D32' }}
                            />
                        </div>
                    </div>

                    <h2 className="text-4xl font-bold mb-4" style={{ color: '#2E7D32' }}>
                        ¡Email Verificado!
                    </h2>

                    <p className="text-base mb-6" style={{ color: 'rgba(46, 46, 46, 0.7)' }}>
                        Tu cuenta ha sido activada exitosamente.
                        <br />
                        Serás redirigido al dashboard en:
                    </p>

                    {/* Countdown */}
                    <div className="mb-8">
                        <div
                            className="inline-flex items-center justify-center w-20 h-20 rounded-full text-4xl font-bold"
                            style={{
                                backgroundColor: 'rgba(46, 125, 50, 0.1)',
                                color: '#2E7D32'
                            }}
                        >
                            {countdown}
                        </div>
                        <p className="text-sm mt-3" style={{ color: 'rgba(46, 46, 46, 0.6)' }}>
                            segundos
                        </p>
                    </div>

                    {/* Botón para ir inmediatamente */}
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="w-full text-white font-semibold py-4 rounded-xl transition-all duration-300 text-base"
                        style={{
                            backgroundColor: '#2E7D32',
                            boxShadow: '0 4px 12px rgba(46, 125, 50, 0.2)'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#1B5E20';
                            e.target.style.boxShadow = '0 6px 16px rgba(46, 125, 50, 0.3)';
                            e.target.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = '#2E7D32';
                            e.target.style.boxShadow = '0 4px 12px rgba(46, 125, 50, 0.2)';
                            e.target.style.transform = 'translateY(0)';
                        }}
                    >
                        Ir al Dashboard Ahora
                    </button>
                </div>
            </div>
        );
    }

    // Estado de ERROR
    if (status === 'error') {
        return (
            <div className="min-h-screen flex items-center justify-center p-8" style={{ backgroundColor: '#7A1E2D' }}>
                <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center relative">
                    {/* Barra superior roja */}
                    <div
                        className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl"
                        style={{ backgroundColor: '#D32F2F' }}
                    ></div>

                    {/* Ícono de error */}
                    <div className="flex justify-center mb-6">
                        <div
                            className="w-24 h-24 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: 'rgba(211, 47, 47, 0.1)' }}
                        >
                            <AiOutlineCloseCircle
                                size={52}
                                style={{ color: '#D32F2F' }}
                            />
                        </div>
                    </div>

                    <h2 className="text-3xl font-bold mb-4" style={{ color: '#D32F2F' }}>
                        Error de Verificación
                    </h2>

                    <p className="text-base mb-6" style={{ color: 'rgba(46, 46, 46, 0.7)' }}>
                        {errorMessage}
                    </p>

                    {/* Causas comunes */}
                    <div
                        className="rounded-xl p-5 mb-6 text-left"
                        style={{ backgroundColor: '#F2F2F2' }}
                    >
                        <h3 className="font-semibold mb-3" style={{ color: '#2E2E2E' }}>
                            Posibles causas:
                        </h3>
                        <ul className="text-sm space-y-2" style={{ color: 'rgba(46, 46, 46, 0.8)' }}>
                            <li className="flex items-start gap-2">
                                <span>•</span>
                                <span>El enlace ha expirado (válido por 24 horas)</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span>•</span>
                                <span>El enlace ya fue utilizado anteriormente</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span>•</span>
                                <span>El enlace está incompleto o dañado</span>
                            </li>
                        </ul>
                    </div>

                    {/* Botones de acción */}
                    <div className="space-y-3">
                        <button
                            onClick={handleRetryVerification}
                            className="w-full font-semibold py-4 rounded-xl transition-all duration-300 text-base border-2"
                            style={{
                                color: '#7A1E2D',
                                borderColor: '#7A1E2D',
                                backgroundColor: 'transparent'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = 'rgba(122, 30, 45, 0.05)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = 'transparent';
                            }}
                        >
                            Intentar Nuevamente
                        </button>

                        <button
                            onClick={handleBackToLogin}
                            className="w-full text-white font-semibold py-4 rounded-xl transition-all duration-300 text-base"
                            style={{
                                backgroundColor: '#7A1E2D',
                                boxShadow: '0 4px 12px rgba(122, 30, 45, 0.2)'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = '#621823';
                                e.target.style.boxShadow = '0 6px 16px rgba(122, 30, 45, 0.3)';
                                e.target.style.transform = 'translateY(-1px)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = '#7A1E2D';
                                e.target.style.boxShadow = '0 4px 12px rgba(122, 30, 45, 0.2)';
                                e.target.style.transform = 'translateY(0)';
                            }}
                        >
                            Volver al Inicio de Sesión
                        </button>
                    </div>

                    <p className="text-xs mt-6" style={{ color: 'rgba(46, 46, 46, 0.5)' }}>
                        ¿Necesitas ayuda? Contacta a soporte@nexum.com
                    </p>
                </div>
            </div>
        );
    }

    return null;
}

export default EmailConfirmed;