import { useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineMail, AiOutlineLock, AiOutlineUser } from 'react-icons/ai';
import authService from '../../services/authService';
import { validateName, validateEmail, validatePassword, validateConfirmPassword, MAX_NAME_LENGTH, MAX_EMAIL_LENGTH, MAX_PASSWORD_LENGTH } from '../../utils/validators';

function Register({ onSwitchToLogin, onRegisterSuccess }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isFormHovered, setIsFormHovered] = useState(false);
    const [activeField, setActiveField] = useState(null);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Limites de caracteres
        const limits = {
            name: MAX_NAME_LENGTH,
            email: MAX_EMAIL_LENGTH,
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

        // Validar nombre
        const nameError = validateName(formData.name);
        if (nameError) {
            newErrors.name = nameError;
        }

        // Validar email
        const emailError = validateEmail(formData.email);
        if (emailError) {
            newErrors.email = emailError;
        }

        // Validar password
        const passwordError = validatePassword(formData.password);
        if (passwordError) {
            newErrors.password = passwordError;
        }

        // Validar confirmación de password
        const confirmPasswordError = validateConfirmPassword(formData.password, formData.confirmPassword);
        if (confirmPasswordError) {
            newErrors.confirmPassword = confirmPasswordError;
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
            // Llamar al servicio de registro
            const response = await authService.register({
                name: formData.name,
                email: formData.email,
                password: formData.password
            });

            console.log('Registro exitoso:', response);

            // Navegar a pantalla de verificación de email
            if (onRegisterSuccess) {
                onRegisterSuccess(formData.email);
            }

        } catch (error) {
            console.error('Error en registro:', error);

            // Manejar diferentes tipos de errores
            if (error.message === 'Network Error') {
                setApiError('No se pudo conectar con el servidor. Verifica tu conexión.');
            } else if (error.message) {
                setApiError(error.message);
            } else {
                setApiError('Error al crear la cuenta. Por favor, intenta nuevamente.');
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

            <div className="mb-8 text-center">
                <h2 className="text-4xl font-bold mb-3" style={{ color: '#7A1E2D' }}>
                    Crear Cuenta
                </h2>
                <p className="text-base mt-2" style={{ color: 'rgba(46, 46, 46, 0.6)' }}>
                    Únete a Nexum y conecta con oportunidades laborales
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

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Nombre Completo */}
                <div className="transition-all duration-200">
                    <label
                        htmlFor="name"
                        className="block text-sm font-semibold mb-3"
                        style={{ color: '#2E2E2E' }}
                    >
                        Nombre Completo
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Tu nombre completo"
                            maxLength={MAX_NAME_LENGTH}
                            disabled={isLoading}
                            className="w-full px-5 py-4 border-2 rounded-xl focus:outline-none transition-all duration-200 text-base pl-12"
                            style={{
                                borderColor: errors.name ? '#D32F2F' : '#E8E8E8',
                                color: '#2E2E2E',
                                backgroundColor: isLoading ? '#F5F5F5' : '#FFFFFF',
                                boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.03)',
                                cursor: isLoading ? 'not-allowed' : 'text'
                            }}
                            onFocus={(e) => {
                                setActiveField('name');
                                e.target.style.borderColor = errors.name ? '#D32F2F' : '#7A1E2D';
                                e.target.style.boxShadow = `0 0 0 3px ${errors.name ? 'rgba(211, 47, 47, 0.1)' : 'rgba(122, 30, 45, 0.1)'}, inset 0 1px 2px rgba(0, 0, 0, 0.03)`;
                            }}
                            onBlur={(e) => {
                                setActiveField(null);
                                e.target.style.borderColor = errors.name ? '#D32F2F' : '#E8E8E8';
                                e.target.style.boxShadow = 'inset 0 1px 2px rgba(0, 0, 0, 0.03)';
                            }}
                        />
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-200"
                            style={{
                                color: errors.name ? '#D32F2F' : (activeField === 'name' ? '#7A1E2D' : '#666666'),
                                opacity: activeField === 'name' ? 1 : 0.8
                            }}>
                            <AiOutlineUser className="h-5 w-5" />
                        </div>
                    </div>
                    {errors.name && (
                        <p className="mt-2 text-sm" style={{ color: '#D32F2F' }}>
                            {errors.name}
                        </p>
                    )}
                </div>

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

                {/* Contraseña */}
                <div className="transition-all duration-200">
                    <label
                        htmlFor="password"
                        className="block text-sm font-semibold mb-3"
                        style={{ color: '#2E2E2E' }}
                    >
                        Contraseña
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

                {/* Confirmar Contraseña */}
                <div className="transition-all duration-200">
                    <label
                        htmlFor="confirmPassword"
                        className="block text-sm font-semibold mb-3"
                        style={{ color: '#2E2E2E' }}
                    >
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
                            style={{
                                color: '#7A1E2D',
                                cursor: isLoading ? 'not-allowed' : 'pointer',
                                opacity: isLoading ? 0.5 : 1
                            }}
                        >
                            {showConfirmPassword ? (
                                <AiOutlineEyeInvisible size={20} />
                            ) : (
                                <AiOutlineEye size={20} />
                            )}
                        </button>
                    </div>
                    {errors.confirmPassword && (
                        <p className="mt-2 text-sm" style={{ color: '#D32F2F' }}>
                            {errors.confirmPassword}
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
                                Creando cuenta...
                            </>
                        ) : (
                            'Crear Cuenta'
                        )}
                    </button>
                </div>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                <p className="text-sm mb-4" style={{ color: 'rgba(46, 46, 46, 0.6)' }}>
                    ¿Ya tienes una cuenta?
                </p>
                <button
                    onClick={onSwitchToLogin}
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
                    Inicia sesión aquí
                </button>
            </div>
        </div>
    );
}

export default Register;