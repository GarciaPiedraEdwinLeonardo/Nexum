import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineMail, AiOutlineLock } from 'react-icons/ai';
import authService from '../../services/authService';
import { validateEmail, validatePassword, MAX_EMAIL_LENGTH, MAX_PASSWORD_LENGTH } from '../../utils/validators';

function Login({ onSwitchToRegister, onSwitchToForgotPassword }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isFormHovered, setIsFormHovered] = useState(false);
    const [activeField, setActiveField] = useState(null);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Limites de caracteres
        const limits = {
            email: MAX_EMAIL_LENGTH,
            password: MAX_PASSWORD_LENGTH
        };

        // Si excede el límite, no actualizar
        if (limits[name] && value.length > limits[name]) {
            return;
        }

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Limpiar error del campo cuando el usuario empieza a escribir
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
        // Limpiar error general de API
        if (apiError) {
            setApiError('');
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Validar email
        const emailError = validateEmail(formData.email);
        if (emailError) {
            newErrors.email = emailError;
        }

        // Validar password (solo requerida en login, no validamos complejidad)
        if (!formData.password) {
            newErrors.password = 'La contraseña es requerida';
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
            // Llamar al servicio de login
            const response = await authService.login({
                email: formData.email,
                password: formData.password
            });

            console.log('✅ Login exitoso:', response);

            // Verificar si el usuario necesita verificar su email
            if (response.data && response.data.user && !response.data.user.isVerified) {
                console.log('⚠️ Email no verificado, redirigiendo a verificación');
                navigate('/verify-email', {
                    state: { email: formData.email }
                });
                return;
            }

            // Verificar que el token se guardó correctamente
            const savedToken = localStorage.getItem('authToken');
            if (!savedToken) {
                console.error('❌ Error: Token no se guardó en localStorage');
                setApiError('Error al iniciar sesión. Por favor, intenta nuevamente.');
                return;
            }

            console.log('✅ Token guardado correctamente, redirigiendo a dashboard...');

            // Redirigir al dashboard
            // Usamos setTimeout para asegurar que el estado se actualice antes de navegar
            setTimeout(() => {
                navigate('/dashboard', { replace: true });
            }, 100);

        } catch (error) {
            console.error('❌ Error en login:', error);

            // Manejar diferentes tipos de errores
            if (error.message === 'Network Error') {
                setApiError('No se pudo conectar con el servidor. Verifica tu conexión.');
            } else if (error.message) {
                setApiError(error.message);
            } else {
                setApiError('Error al iniciar sesión. Por favor, intenta nuevamente.');
            }
        } finally {
            setIsLoading(false);
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
            {/* Barra superior sutil */}
            <div
                className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl"
                style={{ backgroundColor: '#7A1E2D' }}
            ></div>

            <div className="mb-10 text-center">
                <h2 className="text-4xl font-bold mb-3" style={{ color: '#7A1E2D' }}>
                    Iniciar Sesión
                </h2>
                <p className="text-base mt-2" style={{ color: 'rgba(46, 46, 46, 0.6)' }}>
                    Ingresa tus credenciales para acceder a la plataforma
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
                {/* Email */}
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
                            value={formData.email}
                            onChange={handleInputChange}
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
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-200"
                            style={{
                                color: errors.email ? '#D32F2F' : (activeField === 'email' ? '#7A1E2D' : '#666666'),
                                opacity: activeField === 'email' ? 1 : 0.8
                            }}>
                            <AiOutlineMail className="h-5 w-5" />
                        </div>
                    </div>
                    {errors.email && (
                        <p className="mt-2 text-sm" style={{ color: '#D32F2F' }}>
                            {errors.email}
                        </p>
                    )}
                </div>

                {/* Password */}
                <div className="transition-all duration-200">
                    <div className="flex items-center justify-between mb-3">
                        <label
                            htmlFor="password"
                            className="block text-sm font-semibold"
                            style={{ color: '#2E2E2E' }}
                        >
                            Contraseña
                        </label>
                        <button
                            type='button'
                            onClick={onSwitchToForgotPassword}
                            disabled={isLoading}
                            className="text-sm font-medium transition-colors duration-200"
                            style={{
                                color: isLoading ? 'rgba(122, 30, 45, 0.5)' : '#7A1E2D',
                                cursor: isLoading ? 'not-allowed' : 'pointer'
                            }}
                            onMouseEnter={(e) => !isLoading && (e.target.style.color = '#621823')}
                            onMouseLeave={(e) => !isLoading && (e.target.style.color = '#7A1E2D')}
                        >
                            ¿Olvidaste tu contraseña?
                        </button>
                    </div>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="••••••••"
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
                            style={{
                                color: '#7A1E2D',
                                cursor: isLoading ? 'not-allowed' : 'pointer',
                                opacity: isLoading ? 0.5 : 1
                            }}
                        >
                            {showPassword ? (
                                <AiOutlineEyeInvisible size={20} />
                            ) : (
                                <AiOutlineEye size={20} />
                            )}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="mt-2 text-sm" style={{ color: '#D32F2F' }}>
                            {errors.password}
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
                                Iniciando sesión...
                            </>
                        ) : (
                            'Iniciar Sesión'
                        )}
                    </button>
                </div>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                <p className="text-sm mb-4" style={{ color: 'rgba(46, 46, 46, 0.6)' }}>
                    ¿No tienes una cuenta?
                </p>
                <button
                    onClick={onSwitchToRegister}
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
                    Regístrate aquí
                </button>
            </div>
        </div>
    );
}

export default Login;