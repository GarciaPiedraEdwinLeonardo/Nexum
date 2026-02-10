import { useState } from 'react';
import { AiOutlineMail, AiOutlineCheckCircle } from 'react-icons/ai';
import authService from '../../services/authService';
import { validateEmail, MAX_EMAIL_LENGTH } from '../../utils/validators';

function ForgotPassword({ onBackToLogin }) {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isFormHovered, setIsFormHovered] = useState(false);
    const [activeField, setActiveField] = useState(null);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState('');

    const validateForm = () => {
        const newErrors = {};

        const emailError = validateEmail(email);
        if (emailError) {
            newErrors.email = emailError;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Limpiar errores previos
        setApiError('');

        // Validar formulario
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            // Llamar al servicio de forgot password
            await authService.forgotPassword(email);

            console.log('Solicitud de recuperación enviada para:', email);
            setIsSubmitted(true);

        } catch (error) {
            console.error('Error al solicitar recuperación:', error);

            // Manejar diferentes tipos de errores
            if (error.message === 'Network Error') {
                setApiError('No se pudo conectar con el servidor. Verifica tu conexión.');
            } else if (error.message) {
                setApiError(error.message);
            } else {
                setApiError('Error al enviar el correo. Por favor, intenta nuevamente.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Si ya se envió el email, mostrar mensaje de confirmación
    if (isSubmitted) {
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
                {/* Barra superior sutil */}
                <div
                    className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl"
                    style={{ backgroundColor: '#2E7D32' }}
                ></div>

                <div className="text-center py-8">
                    {/* Ícono de éxito */}
                    <div className="flex justify-center mb-6">
                        <div
                            className="w-20 h-20 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: 'rgba(46, 125, 50, 0.1)' }}
                        >
                            <AiOutlineCheckCircle size={48} style={{ color: '#2E7D32' }} />
                        </div>
                    </div>

                    <h2 className="text-3xl font-bold mb-4" style={{ color: '#2E7D32' }}>
                        ¡Correo Enviado!
                    </h2>

                    <p className="text-base mb-6" style={{ color: 'rgba(46, 46, 46, 0.7)' }}>
                        Hemos enviado un enlace de recuperación a:
                    </p>

                    <p className="text-lg font-semibold mb-8" style={{ color: '#7A1E2D' }}>
                        {email}
                    </p>

                    <div
                        className="rounded-xl p-4 mb-8"
                        style={{ backgroundColor: '#F2F2F2' }}
                    >
                        <p className="text-sm" style={{ color: 'rgba(46, 46, 46, 0.8)' }}>
                            Por favor, revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.
                            Si no ves el correo, revisa tu carpeta de spam.
                        </p>
                    </div>

                    <button
                        onClick={onBackToLogin}
                        className="w-full font-semibold py-4 rounded-xl transition-all duration-300 text-base"
                        style={{
                            backgroundColor: '#7A1E2D',
                            color: 'white',
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
            </div>
        );
    }

    // Formulario de recuperación
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
            {/* Barra superior sutil */}
            <div
                className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl"
                style={{ backgroundColor: '#7A1E2D' }}
            ></div>

            <div className="mb-10 text-center">
                <h2 className="text-4xl font-bold mb-3" style={{ color: '#7A1E2D' }}>
                    Recuperar Contraseña
                </h2>
                <p className="text-base mt-2" style={{ color: 'rgba(46, 46, 46, 0.6)' }}>
                    Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña
                </p>
            </div>

            {/* Error general de la API */}
            {apiError && (
                <div
                    className="mb-6 p-4 rounded-xl border-l-4"
                    style={{
                        backgroundColor: 'rgba(211, 47, 47, 0.1)',
                        borderColor: '#D32F2F'
                    }}
                >
                    <p className="text-sm font-medium" style={{ color: '#D32F2F' }}>
                        {apiError}
                    </p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="transition-all duration-200">
                    <label
                        htmlFor="email"
                        className="block text-sm font-semibold mb-3"
                        style={{ color: '#2E2E2E' }}
                    >
                        Correo Electrónico
                    </label>
                    <div className="relative">
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value.length <= MAX_EMAIL_LENGTH) {
                                    setEmail(value);
                                    if (errors.email) {
                                        setErrors({});
                                    }
                                    if (apiError) {
                                        setApiError('');
                                    }
                                }
                            }}
                            placeholder="ejemplo@correo.com"
                            maxLength={MAX_EMAIL_LENGTH}
                            disabled={isLoading}
                            className="w-full px-5 py-4 border-2 rounded-xl focus:outline-none transition-all duration-200 text-base pl-12"
                            style={{
                                borderColor: errors.email ? '#D32F2F' : '#E8E8E8',
                                color: '#2E2E2E',
                                backgroundColor: isLoading ? '#F5F5F5' : '#FFFFFF',
                                boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.03)',
                                cursor: isLoading ? 'not-allowed' : 'text'
                            }}
                            onFocus={(e) => {
                                setActiveField('email');
                                e.target.style.borderColor = errors.email ? '#D32F2F' : '#7A1E2D';
                                e.target.style.boxShadow = `0 0 0 3px ${errors.email ? 'rgba(211, 47, 47, 0.1)' : 'rgba(122, 30, 45, 0.1)'}, inset 0 1px 2px rgba(0, 0, 0, 0.03)`;
                            }}
                            onBlur={(e) => {
                                setActiveField(null);
                                e.target.style.borderColor = errors.email ? '#D32F2F' : '#E8E8E8';
                                e.target.style.boxShadow = 'inset 0 1px 2px rgba(0, 0, 0, 0.03)';
                            }}
                        />
                        <div
                            className="absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-200"
                            style={{
                                color: errors.email ? '#D32F2F' : (activeField === 'email' ? '#7A1E2D' : '#666666'),
                                opacity: activeField === 'email' ? 1 : 0.8
                            }}
                        >
                            <AiOutlineMail className="h-5 w-5" />
                        </div>
                    </div>
                    {errors.email && (
                        <p className="mt-2 text-sm" style={{ color: '#D32F2F' }}>
                            {errors.email}
                        </p>
                    )}
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full text-white font-semibold py-4 rounded-xl transition-all duration-300 text-base relative overflow-hidden flex items-center justify-center"
                        style={{
                            backgroundColor: isLoading ? '#A0A0A0' : '#7A1E2D',
                            boxShadow: '0 4px 12px rgba(122, 30, 45, 0.2)',
                            cursor: isLoading ? 'not-allowed' : 'pointer'
                        }}
                        onMouseEnter={(e) => {
                            if (!isLoading) {
                                e.target.style.backgroundColor = '#621823';
                                e.target.style.boxShadow = '0 6px 16px rgba(122, 30, 45, 0.3)';
                                e.target.style.transform = 'translateY(-1px)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!isLoading) {
                                e.target.style.backgroundColor = '#7A1E2D';
                                e.target.style.boxShadow = '0 4px 12px rgba(122, 30, 45, 0.2)';
                                e.target.style.transform = 'translateY(0)';
                            }
                        }}
                    >
                        {isLoading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                Enviando...
                            </>
                        ) : (
                            'Enviar Enlace de Recuperación'
                        )}
                    </button>
                </div>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                <p className="text-sm mb-4" style={{ color: 'rgba(46, 46, 46, 0.6)' }}>
                    ¿Recordaste tu contraseña?
                </p>
                <button
                    onClick={onBackToLogin}
                    disabled={isLoading}
                    className="inline-flex items-center justify-center font-semibold transition-all duration-300 py-3 px-6 rounded-xl border"
                    style={{
                        color: isLoading ? 'rgba(122, 30, 45, 0.5)' : '#7A1E2D',
                        borderColor: '#E8E8E8',
                        cursor: isLoading ? 'not-allowed' : 'pointer'
                    }}
                    onMouseEnter={(e) => {
                        if (!isLoading) {
                            e.target.style.borderColor = '#7A1E2D';
                            e.target.style.color = '#621823';
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (!isLoading) {
                            e.target.style.borderColor = '#E8E8E8';
                            e.target.style.color = '#7A1E2D';
                        }
                    }}
                >
                    Volver al Inicio de Sesión
                </button>
            </div>
        </div>
    );
}

export default ForgotPassword;