import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logomain from '../assets/logo-main.png';
import logoNexum from '../assets/logo-nexum.png';
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';

function Main({ view = 'login' }) {
    const navigate = useNavigate();
    const [currentView, setCurrentView] = useState(view);

    // Sincronizar el estado local con la prop view cuando cambie la ruta
    useEffect(() => {
        setCurrentView(view);
    }, [view]);

    const handleSwitchToRegister = () => {
        navigate('/register');
    };

    const handleSwitchToLogin = () => {
        navigate('/login');
    };

    return (
        <div className="min-h-screen flex">
            {/* ASIDE - Sección izquierda */}
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
                            La plataforma que conecta talento académico exclusivamente del IPN con oportunidades laborales.
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

            {/* MAIN - Sección derecha */}
            <main className="flex-1 flex items-center justify-center p-8 relative overflow-hidden" style={{ backgroundColor: '#7A1E2D' }}>
                {/* Efectos de fondo sutiles */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-1/4 -left-24 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: '#FFFFFF' }}></div>
                    <div className="absolute bottom-1/4 -right-24 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: '#FFFFFF' }}></div>
                </div>

                <div className="w-full max-w-md relative z-10">
                    {/* Logo móvil - solo visible en pantallas pequeñas */}
                    <div className="lg:hidden mb-8 text-center">
                        <div className="w-full bg-white rounded-3xl shadow-2xl p-6 flex items-center justify-center">
                            <img src={logoNexum} alt="Nexum Logo" className="h-24 object-contain" />
                        </div>
                    </div>

                    {/* Renderizar Login o Register según la vista */}
                    {currentView === 'login' ? (
                        <Login onSwitchToRegister={handleSwitchToRegister} />
                    ) : (
                        <Register onSwitchToLogin={handleSwitchToLogin} />
                    )}
                </div>
            </main>
        </div>
    );
}

export default Main;