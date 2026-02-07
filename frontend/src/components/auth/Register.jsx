import { useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineMail, AiOutlineLock, AiOutlineUser } from 'react-icons/ai';

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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }
        console.log('Register attempt:', formData);

        // Lógica de registro
        // Después de un registro exitoso, navegar a verificación de email
        if (onRegisterSuccess) {
            onRegisterSuccess(formData.email);
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
                            required
                            className="w-full px-5 py-4 border-2 rounded-xl focus:outline-none transition-all duration-200 text-base pl-12"
                            style={{
                                borderColor: '#E8E8E8',
                                color: '#2E2E2E',
                                backgroundColor: '#FFFFFF',
                                boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.03)'
                            }}
                            onFocus={(e) => {
                                setActiveField('name');
                                e.target.style.borderColor = '#7A1E2D';
                                e.target.style.boxShadow = '0 0 0 3px rgba(122, 30, 45, 0.1), inset 0 1px 2px rgba(0, 0, 0, 0.03)';
                            }}
                            onBlur={(e) => {
                                setActiveField(null);
                                e.target.style.borderColor = '#E8E8E8';
                                e.target.style.boxShadow = 'inset 0 1px 2px rgba(0, 0, 0, 0.03)';
                            }}
                        />
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-200"
                            style={{
                                color: activeField === 'name' ? '#7A1E2D' : '#666666',
                                opacity: activeField === 'name' ? 1 : 0.8
                            }}>
                            <AiOutlineUser className="h-5 w-5" />
                        </div>
                    </div>
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
                            required
                            className="w-full px-5 py-4 border-2 rounded-xl focus:outline-none transition-all duration-200 text-base pl-12"
                            style={{
                                borderColor: '#E8E8E8',
                                color: '#2E2E2E',
                                backgroundColor: '#FFFFFF',
                                boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.03)'
                            }}
                            onFocus={(e) => {
                                setActiveField('email');
                                e.target.style.borderColor = '#7A1E2D';
                                e.target.style.boxShadow = '0 0 0 3px rgba(122, 30, 45, 0.1), inset 0 1px 2px rgba(0, 0, 0, 0.03)';
                            }}
                            onBlur={(e) => {
                                setActiveField(null);
                                e.target.style.borderColor = '#E8E8E8';
                                e.target.style.boxShadow = 'inset 0 1px 2px rgba(0, 0, 0, 0.03)';
                            }}
                        />
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-200"
                            style={{
                                color: activeField === 'email' ? '#7A1E2D' : '#666666',
                                opacity: activeField === 'email' ? 1 : 0.8
                            }}>
                            <AiOutlineMail className="h-5 w-5" />
                        </div>
                    </div>
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
                            required
                            minLength={8}
                            className="w-full px-5 py-4 pr-12 border-2 rounded-xl focus:outline-none transition-all duration-200 text-base pl-12"
                            style={{
                                borderColor: '#E8E8E8',
                                color: '#2E2E2E',
                                backgroundColor: '#FFFFFF',
                                boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.03)'
                            }}
                            onFocus={(e) => {
                                setActiveField('password');
                                e.target.style.borderColor = '#7A1E2D';
                                e.target.style.boxShadow = '0 0 0 3px rgba(122, 30, 45, 0.1), inset 0 1px 2px rgba(0, 0, 0, 0.03)';
                            }}
                            onBlur={(e) => {
                                setActiveField(null);
                                e.target.style.borderColor = '#E8E8E8';
                                e.target.style.boxShadow = 'inset 0 1px 2px rgba(0, 0, 0, 0.03)';
                            }}
                        />
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-200"
                            style={{
                                color: activeField === 'password' ? '#7A1E2D' : '#666666',
                                opacity: activeField === 'password' ? 1 : 0.8
                            }}>
                            <AiOutlineLock className="h-5 w-5" />
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors duration-200 p-1 rounded-md hover:bg-gray-50"
                            style={{ color: '#7A1E2D' }}
                        >
                            {showPassword ? (
                                <AiOutlineEyeInvisible size={20} />
                            ) : (
                                <AiOutlineEye size={20} />
                            )}
                        </button>
                    </div>
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
                            required
                            className="w-full px-5 py-4 pr-12 border-2 rounded-xl focus:outline-none transition-all duration-200 text-base pl-12"
                            style={{
                                borderColor: '#E8E8E8',
                                color: '#2E2E2E',
                                backgroundColor: '#FFFFFF',
                                boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.03)'
                            }}
                            onFocus={(e) => {
                                setActiveField('confirmPassword');
                                e.target.style.borderColor = '#7A1E2D';
                                e.target.style.boxShadow = '0 0 0 3px rgba(122, 30, 45, 0.1), inset 0 1px 2px rgba(0, 0, 0, 0.03)';
                            }}
                            onBlur={(e) => {
                                setActiveField(null);
                                e.target.style.borderColor = '#E8E8E8';
                                e.target.style.boxShadow = 'inset 0 1px 2px rgba(0, 0, 0, 0.03)';
                            }}
                        />
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-200"
                            style={{
                                color: activeField === 'confirmPassword' ? '#7A1E2D' : '#666666',
                                opacity: activeField === 'confirmPassword' ? 1 : 0.8
                            }}>
                            <AiOutlineLock className="h-5 w-5" />
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors duration-200 p-1 rounded-md hover:bg-gray-50"
                            style={{ color: '#7A1E2D' }}
                        >
                            {showConfirmPassword ? (
                                <AiOutlineEyeInvisible size={20} />
                            ) : (
                                <AiOutlineEye size={20} />
                            )}
                        </button>
                    </div>
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        className="w-full text-white font-semibold py-4 rounded-xl transition-all duration-300 text-base relative overflow-hidden"
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
                        Crear Cuenta
                    </button>
                </div>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                <p className="text-sm mb-4" style={{ color: 'rgba(46, 46, 46, 0.6)' }}>
                    ¿Ya tienes una cuenta?
                </p>
                <button
                    onClick={onSwitchToLogin}
                    className="inline-flex items-center justify-center font-semibold transition-all duration-300 py-3 px-6 rounded-xl border"
                    style={{
                        color: '#7A1E2D',
                        borderColor: '#E8E8E8'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.borderColor = '#7A1E2D';
                        e.target.style.color = '#621823';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.borderColor = '#E8E8E8';
                        e.target.style.color = '#7A1E2D';
                    }}
                >
                    Inicia sesión aquí
                </button>
            </div>
        </div>
    );
}

export default Register;