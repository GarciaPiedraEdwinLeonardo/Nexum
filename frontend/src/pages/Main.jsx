import { useState } from 'react';
import logomain from '../assets/logo-main.png';
import logoNexum from '../assets/logo-nexum.png';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

function Main() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Login attempt:', formData);
        // Lógica de autenticación
    };

    return (
        <div className="min-h-screen flex">
            <aside className="hidden lg:flex lg:w-1/2 p-12 flex-col justify-between relative overflow-hidden bg-white">
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-20 -left-20 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: '#7A1E2D' }}></div>
                    <div className="absolute bottom-20 -right-20 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: '#7A1E2D' }}></div>
                </div>
                <div className="relative z-10 flex flex-col justify-center items-center flex-1">
                    <div className="mb-8">
                        <div className="w-64 h-64 flex items-center justify-center">
                            <img src={logomain} alt="Logo" className="w-full h-full object-contain" />
                        </div>
                    </div>
                    <div className="space-y-6 max-w-md text-center" style={{ color: '#2E2E2E' }}>
                        <p className="text-lg leading-relaxed" style={{ color: 'rgba(46, 46, 46, 0.8)' }}>
                            La plataforma que conecta talento académico exclusivamento del IPN con oportunidades laborales.
                            Impulsa tu carrera profesional y encuentra las mejores opciones de desarrollo.
                        </p>
                        <div className="flex justify-center gap-4 pt-4">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#2E7D32' }}></div>
                                <span className="text-sm" style={{ color: 'rgba(46, 46, 46, 0.7)' }}>Seguro</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#2E7D32' }}></div>
                                <span className="text-sm" style={{ color: 'rgba(46, 46, 46, 0.7)' }}>Confiable</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#2E7D32' }}></div>
                                <span className="text-sm" style={{ color: 'rgba(46, 46, 46, 0.7)' }}>Profesional</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="relative z-10 text-sm" style={{ color: 'rgba(46, 46, 46, 0.5)' }}>
                    <p>© 2026 Nexum. Todos los derechos reservados.</p>
                </div>
            </aside>
            <main className="flex-1 flex items-center justify-center p-8" style={{ backgroundColor: '#7A1E2D' }}>
                <div className="w-full max-w-md">
                    <div className="lg:hidden mb-8 text-center">
                        <div className="w-full bg-white rounded-3xl shadow-2xl p-6 flex items-center justify-center">
                            <img src={logoNexum} alt="Nexum Logo" className="h-24 object-contain" />
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl shadow-2xl p-10">
                        <div className="mb-10 text-center">
                            <h2 className="text-4xl font-bold mb-3" style={{ color: '#7A1E2D' }}>
                                Iniciar Sesión
                            </h2>
                            <p className="text-base" style={{ color: 'rgba(46, 46, 46, 0.6)' }}>
                                Ingresa tus credenciales para acceder a la plataforma
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-semibold mb-3"
                                    style={{ color: '#2E2E2E' }}
                                >
                                    Correo Electrónico
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="ejemplo@correo.com"
                                    required
                                    className="w-full px-5 py-4 border-2 rounded-xl focus:outline-none transition-all duration-300 text-base"
                                    style={{
                                        borderColor: '#F2F2F2',
                                        color: '#2E2E2E',
                                        backgroundColor: '#FAFAFA'
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = '#7A1E2D';
                                        e.target.style.backgroundColor = '#FFFFFF';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = '#F2F2F2';
                                        e.target.style.backgroundColor = '#FAFAFA';
                                    }}
                                />
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <label
                                        htmlFor="password"
                                        className="block text-sm font-semibold"
                                        style={{ color: '#2E2E2E' }}
                                    >
                                        Contraseña
                                    </label>
                                    <a
                                        href="#"
                                        className="text-sm font-medium transition-colors duration-200"
                                        style={{ color: '#7A1E2D' }}
                                        onMouseEnter={(e) => e.target.style.color = '#621823'}
                                        onMouseLeave={(e) => e.target.style.color = '#7A1E2D'}
                                    >
                                        ¿Olvidaste tu contraseña?
                                    </a>
                                </div>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        placeholder="••••••••"
                                        required
                                        className="w-full px-5 py-4 pr-12 border-2 rounded-xl focus:outline-none transition-all duration-300 text-base"
                                        style={{
                                            borderColor: '#F2F2F2',
                                            color: '#2E2E2E',
                                            backgroundColor: '#FAFAFA'
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.borderColor = '#7A1E2D';
                                            e.target.style.backgroundColor = '#FFFFFF';
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = '#F2F2F2';
                                            e.target.style.backgroundColor = '#FAFAFA';
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors duration-200"
                                        style={{ color: '#7A1E2D' }}
                                        onMouseEnter={(e) => e.target.style.color = '#621823'}
                                        onMouseLeave={(e) => e.target.style.color = '#7A1E2D'}
                                    >
                                        {showPassword ? (
                                            <AiOutlineEyeInvisible size={24} />
                                        ) : (
                                            <AiOutlineEye size={24} />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full text-white font-semibold py-4 rounded-xl transition-all duration-300 shadow-lg text-base mt-8"
                                style={{ backgroundColor: '#7A1E2D' }}
                                onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = '#621823';
                                    e.target.style.boxShadow = '0 20px 25px -5px rgba(122, 30, 45, 0.3)';
                                    e.target.style.transform = 'translateY(-2px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = '#7A1E2D';
                                    e.target.style.boxShadow = '0 10px 15px -3px rgba(122, 30, 45, 0.2)';
                                    e.target.style.transform = 'translateY(0)';
                                }}
                            >
                                Iniciar Sesión
                            </button>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-sm" style={{ color: 'rgba(46, 46, 46, 0.6)' }}>
                                ¿No tienes una cuenta?{' '}
                                <a
                                    href="#"
                                    className="font-semibold transition-colors duration-200"
                                    style={{ color: '#7A1E2D' }}
                                    onMouseEnter={(e) => e.target.style.color = '#621823'}
                                    onMouseLeave={(e) => e.target.style.color = '#7A1E2D'}
                                >
                                    Regístrate aquí
                                </a>
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 text-center text-xs" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        <p>Al continuar, aceptas nuestros Términos y Condiciones</p>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Main;