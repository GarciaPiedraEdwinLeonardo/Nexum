import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineLock, AiOutlineCheckCircle, AiOutlineCloseCircle, AiOutlineLoading3Quarters } from 'react-icons/ai';
import authService from '../../services/authService';
import { validatePassword, validateConfirmPassword, MAX_PASSWORD_LENGTH } from '../../utils/validators';

function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isFormHovered, setIsFormHovered] = useState(false);
    const [activeField, setActiveField] = useState(null);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [tokenStatus, setTokenStatus] = useState('validating'); // 'validating', 'valid', 'invalid'
    const [resetStatus, setResetStatus] = useState(null); // 'success', 'error'
    const [apiError, setApiError] = useState('');
    const [countdown, setCountdown] = useState(5);

    // Verificar token al cargar el componente
    useEffect(() => {
        if (token) {
            validateToken();
        } else {
            setTokenStatus('invalid');
        }
    }, [token]);

    // Countdown para redirigir después del éxito
    useEffect(() => {
        if (resetStatus === 'success' && countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (resetStatus === 'success' && countdown === 0) {
            navigate('/login');
        }
    }, [resetStatus, countdown, navigate]);

    const validateToken = async () => {
        // Aquí puedes agregar una llamada al backend para validar el token
        // Por ahora, simulamos que es válido
        setTimeout(() => {
            setTokenStatus('valid');
        }, 1000);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Limites de caracteres
        const limits = {
            password: MAX_PASSWORD_LENGTH,
            confirmPassword: MAX_PASSWORD_LENGTH
        };

        // Si excede el límite, no actualizar
        if (limits[name] && value.length > limits[name]) {
            return;
        }

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Limpiar error del campo
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }

        // Limpiar error de API
        if (apiError) {
            setApiError('');
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Validar contraseña
        const passwordError = validatePassword(formData.password);
        if (passwordError) {
            newErrors.password = passwordError;
        }

        // Validar confirmación
        const confirmPasswordError = validateConfirmPassword(formData.password, formData.confirmPassword);
        if (confirmPasswordError) {
            newErrors.confirmPassword = confirmPasswordError;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validar formulario
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        setApiError('');

        try {
            // Llamar al servicio de reset password
            await authService.resetPassword(token, formData.password);

            console.log('Contraseña restablecida exitosamente');
            setResetStatus('success');

        } catch (error) {
            console.error('Error al restablecer contraseña:', error);
            setResetStatus('error');

            if (error.message === 'Network Error') {
                setApiError('No se pudo conectar con el servidor');
            } else {
                setApiError(error.message || 'Error al restablecer la contraseña');
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Estado: Validando token
    if (tokenStatus === 'validating') {
        return (
            <div className="min-h-screen flex items-center justify-center p-8" style={{ backgroundColor: '#7A1E2D' }}>
                <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center relative">
                    <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl" style={{ backgroundColor: '#1F3A5F' }}></div>

                    <div className="flex justify-center mb-6">
                        <div className="w-24 h-24 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(31, 58, 95, 0.1)' }}>
                            <AiOutlineLoading3Quarters size={52} className="animate-spin" style={{ color: '#1F3A5F' }} />
                        </div>
                    </div>

                    <h2 className="text-3xl font-bold mb-4" style={{ color: '#1F3A5F' }}>
                        Validando Enlace...
                    </h2>
                    <p className="text-base" style={{ color: 'rgba(46, 46, 46, 0.7)' }}>
                        Por favor espera mientras verificamos tu enlace de recuperación
                    </p>
                </div>
            </div>
        );
    }

    // Estado: Token inválido
    if (tokenStatus === 'invalid') {
        return (
            <div className="min-h-screen flex items-center justify-center p-8" style={{ backgroundColor: '#7A1E2D' }}>
                <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center relative">
                    <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl" style={{ backgroundColor: '#D32F2F' }}></div>

                    <div className="flex justify-center mb-6">
                        <div className="w-24 h-24 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(211, 47, 47, 0.1)' }}>
                            <AiOutlineCloseCircle size={52} style={{ color: '#D32F2F' }} />
                        </div>
                    </div>

                    <h2 className="text-3xl font-bold mb-4" style={{ color: '#D32F2F' }}>
                        Enlace Inválido
                    </h2>
                    <p className="text-base mb-8" style={{ color: 'rgba(46, 46, 46, 0.7)' }}>
                        El enlace de recuperación es inválido o ha expirado
                    </p>

                    <button
                        onClick={() => navigate('/forgot-password')}
                        className="w-full text-white font-semibold py-4 rounded-xl transition-all duration-300 text-base"
                        style={{ backgroundColor: '#7A1E2D', boxShadow: '0 4px 12px rgba(122, 30, 45, 0.2)' }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#621823';
                            e.target.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = '#7A1E2D';
                            e.target.style.transform = 'translateY(0)';
                        }}
                    >
                        Solicitar Nuevo Enlace
                    </button>
                </div>
            </div>
        );
    }

    // Estado: Éxito
    if (resetStatus === 'success') {
        return (
            <div className="min-h-screen flex items-center justify-center p-8" style={{ backgroundColor: '#7A1E2D' }}>
                <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center relative">
                    <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl" style={{ backgroundColor: '#2E7D32' }}></div>

                    <div className="flex justify-center mb-6">
                        <div className="w-24 h-24 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(46, 125, 50, 0.1)' }}>
                            <AiOutlineCheckCircle size={52} style={{ color: '#2E7D32' }} />
                        </div>
                    </div>

                    <h2 className="text-4xl font-bold mb-4" style={{ color: '#2E7D32' }}>
                        ¡Contraseña Restablecida!
                    </h2>
                    <p className="text-base mb-6" style={{ color: 'rgba(46, 46, 46, 0.7)' }}>
                        Tu contraseña ha sido actualizada exitosamente.
                        <br />
                        Serás redirigido al login en:
                    </p>

                    <div className="mb-8">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full text-4xl font-bold"
                            style={{ backgroundColor: 'rgba(46, 125, 50, 0.1)', color: '#2E7D32' }}>
                            {countdown}
                        </div>
                        <p className="text-sm mt-3" style={{ color: 'rgba(46, 46, 46, 0.6)' }}>
                            segundos
                        </p>
                    </div>

                    <button
                        onClick={() => navigate('/login')}
                        className="w-full text-white font-semibold py-4 rounded-xl transition-all duration-300 text-base"
                        style={{ backgroundColor: '#2E7D32', boxShadow: '0 4px 12px rgba(46, 125, 50, 0.2)' }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#1B5E20';
                            e.target.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = '#2E7D32';
                            e.target.style.transform = 'translateY(0)';
                        }}
                    >
                        Iniciar Sesión Ahora
                    </button>
                </div>
            </div>
        );
    }

    // Formulario de reseteo
    return (
        <div className="min-h-screen flex items-center justify-center p-8" style={{ backgroundColor: '#7A1E2D' }}>
            <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full relative"
                style={{
                    transform: isFormHovered ? 'translateY(-2px)' : 'translateY(0)',
                    boxShadow: isFormHovered
                        ? '0 25px 50px -12px rgba(122, 30, 45, 0.25)'
                        : '0 20px 25px -5px rgba(122, 30, 45, 0.15)',
                    transition: 'all 300ms ease-out'
                }}
                onMouseEnter={() => setIsFormHovered(true)}
                onMouseLeave={() => setIsFormHovered(false)}
            >
                <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl" style={{ backgroundColor: '#7A1E2D' }}></div>

                <div className="mb-10 text-center">
                    <h2 className="text-4xl font-bold mb-3" style={{ color: '#7A1E2D' }}>
                        Nueva Contraseña
                    </h2>
                    <p className="text-base mt-2" style={{ color: 'rgba(46, 46, 46, 0.6)' }}>
                        Ingresa tu nueva contraseña para restablecer el acceso a tu cuenta
                    </p>
                </div>

                {/* Error general de API */}
                {apiError && (
                    <div className="mb-6 p-4 rounded-xl border-l-4"
                        style={{ backgroundColor: 'rgba(211, 47, 47, 0.1)', borderColor: '#D32F2F' }}>
                        <p className="text-sm font-medium" style={{ color: '#D32F2F' }}>{apiError}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Nueva Contraseña */}
                    <div className="transition-all duration-200">
                        <label htmlFor="password" className="block text-sm font-semibold mb-3" style={{ color: '#2E2E2E' }}>
                            Nueva Contraseña
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="Mínimo 8 caracteres"
                                maxLength={MAX_PASSWORD_LENGTH}
                                disabled={isLoading}
                                className="w-full px-5 py-4 pr-12 border-2 rounded-xl focus:outline-none transition-all duration-200 text-base pl-12"
                                style={{
                                    borderColor: errors.password ? '#D32F2F' : '#E8E8E8',
                                    color: '#2E2E2E',
                                    backgroundColor: isLoading ? '#F5F5F5' : '#FFFFFF',
                                    boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.03)',
                                    cursor: isLoading ? 'not-allowed' : 'text'
                                }}
                                onFocus={(e) => {
                                    setActiveField('password');
                                    e.target.style.borderColor = errors.password ? '#D32F2F' : '#7A1E2D';
                                    e.target.style.boxShadow = `0 0 0 3px ${errors.password ? 'rgba(211, 47, 47, 0.1)' : 'rgba(122, 30, 45, 0.1)'}, inset 0 1px 2px rgba(0, 0, 0, 0.03)`;
                                }}
                                onBlur={(e) => {
                                    setActiveField(null);
                                    e.target.style.borderColor = errors.password ? '#D32F2F' : '#E8E8E8';
                                    e.target.style.boxShadow = 'inset 0 1px 2px rgba(0, 0, 0, 0.03)';
                                }}
                            />
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-200"
                                style={{
                                    color: errors.password ? '#D32F2F' : (activeField === 'password' ? '#7A1E2D' : '#666666'),
                                    opacity: activeField === 'password' ? 1 : 0.8
                                }}>
                                <AiOutlineLock className="h-5 w-5" />
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={isLoading}
                                className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors duration-200 p-1 rounded-md hover:bg-gray-50"
                                style={{ color: '#7A1E2D', cursor: isLoading ? 'not-allowed' : 'pointer' }}
                            >
                                {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="mt-2 text-sm" style={{ color: '#D32F2F' }}>{errors.password}</p>
                        )}
                    </div>

                    {/* Confirmar Contraseña */}
                    <div className="transition-all duration-200">
                        <label htmlFor="confirmPassword" className="block text-sm font-semibold mb-3" style={{ color: '#2E2E2E' }}>
                            Confirmar Contraseña
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                placeholder="Repite tu contraseña"
                                maxLength={MAX_PASSWORD_LENGTH}
                                disabled={isLoading}
                                className="w-full px-5 py-4 pr-12 border-2 rounded-xl focus:outline-none transition-all duration-200 text-base pl-12"
                                style={{
                                    borderColor: errors.confirmPassword ? '#D32F2F' : '#E8E8E8',
                                    color: '#2E2E2E',
                                    backgroundColor: isLoading ? '#F5F5F5' : '#FFFFFF',
                                    boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.03)',
                                    cursor: isLoading ? 'not-allowed' : 'text'
                                }}
                                onFocus={(e) => {
                                    setActiveField('confirmPassword');
                                    e.target.style.borderColor = errors.confirmPassword ? '#D32F2F' : '#7A1E2D';
                                    e.target.style.boxShadow = `0 0 0 3px ${errors.confirmPassword ? 'rgba(211, 47, 47, 0.1)' : 'rgba(122, 30, 45, 0.1)'}, inset 0 1px 2px rgba(0, 0, 0, 0.03)`;
                                }}
                                onBlur={(e) => {
                                    setActiveField(null);
                                    e.target.style.borderColor = errors.confirmPassword ? '#D32F2F' : '#E8E8E8';
                                    e.target.style.boxShadow = 'inset 0 1px 2px rgba(0, 0, 0, 0.03)';
                                }}
                            />
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-200"
                                style={{
                                    color: errors.confirmPassword ? '#D32F2F' : (activeField === 'confirmPassword' ? '#7A1E2D' : '#666666'),
                                    opacity: activeField === 'confirmPassword' ? 1 : 0.8
                                }}>
                                <AiOutlineLock className="h-5 w-5" />
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                disabled={isLoading}
                                className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors duration-200 p-1 rounded-md hover:bg-gray-50"
                                style={{ color: '#7A1E2D', cursor: isLoading ? 'not-allowed' : 'pointer' }}
                            >
                                {showConfirmPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="mt-2 text-sm" style={{ color: '#D32F2F' }}>{errors.confirmPassword}</p>
                        )}
                    </div>

                    {/* Requisitos de contraseña */}
                    <div className="rounded-xl p-4" style={{ backgroundColor: '#F2F2F2' }}>
                        <p className="text-sm font-semibold mb-2" style={{ color: '#2E2E2E' }}>
                            La contraseña debe contener:
                        </p>
                        <ul className="text-sm space-y-1" style={{ color: 'rgba(46, 46, 46, 0.7)' }}>
                            <li className="flex items-center gap-2">
                                <span>•</span>
                                <span>Al menos 8 caracteres</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <span>•</span>
                                <span>Letras mayúsculas y minúsculas</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <span>•</span>
                                <span>Al menos un número</span>
                            </li>
                        </ul>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full text-white font-semibold py-4 rounded-xl transition-all duration-300 text-base flex items-center justify-center"
                            style={{
                                backgroundColor: isLoading ? '#A0A0A0' : '#7A1E2D',
                                boxShadow: '0 4px 12px rgba(122, 30, 45, 0.2)',
                                cursor: isLoading ? 'not-allowed' : 'pointer'
                            }}
                            onMouseEnter={(e) => {
                                if (!isLoading) {
                                    e.target.style.backgroundColor = '#621823';
                                    e.target.style.transform = 'translateY(-1px)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isLoading) {
                                    e.target.style.backgroundColor = '#7A1E2D';
                                    e.target.style.transform = 'translateY(0)';
                                }
                            }}
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    Restableciendo...
                                </>
                            ) : (
                                'Restablecer Contraseña'
                            )}
                        </button>
                    </div>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                    <button
                        onClick={() => navigate('/login')}
                        disabled={isLoading}
                        className="text-sm font-medium transition-colors duration-200"
                        style={{ color: isLoading ? 'rgba(122, 30, 45, 0.5)' : '#7A1E2D' }}
                        onMouseEnter={(e) => !isLoading && (e.target.style.color = '#621823')}
                        onMouseLeave={(e) => !isLoading && (e.target.style.color = '#7A1E2D')}
                    >
                        Volver al Inicio de Sesión
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;