import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Verificar autenticación al cargar
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            // Verificar si hay token
            const isAuthenticated = authService.isAuthenticated();

            if (!isAuthenticated) {
                // Si no hay token, redirigir a login
                navigate('/login', { replace: true });
                return;
            }

            // Obtener datos del usuario
            const currentUser = authService.getCurrentUser();
            setUser(currentUser);

            // Opcionalmente, validar token con el backend
            try {
                const profileData = await authService.getProfile();
                setUser(profileData.data.user);
            } catch (error) {
                console.error('Error al obtener perfil:', error);
                // Si el token es inválido, redirigir a login
                navigate('/login', { replace: true });
            }
        } catch (error) {
            console.error('Error en autenticación:', error);
            navigate('/login', { replace: true });
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await authService.logout();
            navigate('/login', { replace: true });
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5F5F5' }}>
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4"
                        style={{ borderColor: '#7A1E2D' }}></div>
                    <p className="text-lg" style={{ color: '#2E2E2E' }}>Cargando...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#F5F5F5' }}>
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold" style={{ color: '#7A1E2D' }}>
                                Nexum
                            </h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-sm font-medium" style={{ color: '#2E2E2E' }}>
                                    {user?.name}
                                </p>
                                <p className="text-xs" style={{ color: 'rgba(46, 46, 46, 0.6)' }}>
                                    {user?.email}
                                </p>
                            </div>
                            {user?.profilePicture ? (
                                <img
                                    src={user.profilePicture}
                                    alt="Profile"
                                    className="w-10 h-10 rounded-full"
                                />
                            ) : (
                                <div
                                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                                    style={{ backgroundColor: '#7A1E2D' }}
                                >
                                    {user?.name?.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 rounded-lg font-medium transition-all duration-200"
                                style={{
                                    backgroundColor: '#7A1E2D',
                                    color: 'white'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = '#621823';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = '#7A1E2D';
                                }}
                            >
                                Cerrar Sesión
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
                    <div className="text-center py-12">
                        <h2 className="text-4xl font-bold mb-4" style={{ color: '#7A1E2D' }}>
                            ¡Bienvenido a Nexum, {user?.name}! 🎉
                        </h2>
                        <p className="text-lg mb-6" style={{ color: 'rgba(46, 46, 46, 0.7)' }}>
                            Tu cuenta ha sido verificada exitosamente
                        </p>

                        {/* Información de verificación */}
                        <div
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full mb-8"
                            style={{ backgroundColor: 'rgba(46, 125, 50, 0.1)' }}
                        >
                            <svg
                                className="w-5 h-5"
                                style={{ color: '#2E7D32' }}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <span className="font-medium" style={{ color: '#2E7D32' }}>
                                Email Verificado
                            </span>
                        </div>

                        {/* Información del usuario */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                            <div
                                className="p-6 rounded-xl"
                                style={{ backgroundColor: '#F5F5F5' }}
                            >
                                <h3 className="text-sm font-semibold mb-2" style={{ color: 'rgba(46, 46, 46, 0.6)' }}>
                                    ROL
                                </h3>
                                <p className="text-lg font-bold" style={{ color: '#7A1E2D' }}>
                                    {user?.roleDisplayName || user?.role}
                                </p>
                            </div>

                            <div
                                className="p-6 rounded-xl"
                                style={{ backgroundColor: '#F5F5F5' }}
                            >
                                <h3 className="text-sm font-semibold mb-2" style={{ color: 'rgba(46, 46, 46, 0.6)' }}>
                                    CORREO
                                </h3>
                                <p className="text-sm font-medium break-all" style={{ color: '#2E2E2E' }}>
                                    {user?.email}
                                </p>
                            </div>

                            <div
                                className="p-6 rounded-xl"
                                style={{ backgroundColor: '#F5F5F5' }}
                            >
                                <h3 className="text-sm font-semibold mb-2" style={{ color: 'rgba(46, 46, 46, 0.6)' }}>
                                    ESTADO
                                </h3>
                                <p className="text-lg font-bold" style={{ color: '#2E7D32' }}>
                                    Activo
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Próximos pasos */}
                <div className="bg-white rounded-2xl shadow-sm p-8">
                    <h3 className="text-2xl font-bold mb-6" style={{ color: '#1F3A5F' }}>
                        Próximos Pasos
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div
                            className="p-6 rounded-xl border-2"
                            style={{ borderColor: '#E8E8E8' }}
                        >
                            <div className="flex items-start gap-4">
                                <div
                                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                                    style={{ backgroundColor: 'rgba(122, 30, 45, 0.1)' }}
                                >
                                    <svg
                                        className="w-6 h-6"
                                        style={{ color: '#7A1E2D' }}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2" style={{ color: '#2E2E2E' }}>
                                        Completa tu Perfil
                                    </h4>
                                    <p className="text-sm" style={{ color: 'rgba(46, 46, 46, 0.7)' }}>
                                        Agrega más información sobre ti para destacar en la plataforma
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div
                            className="p-6 rounded-xl border-2"
                            style={{ borderColor: '#E8E8E8' }}
                        >
                            <div className="flex items-start gap-4">
                                <div
                                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                                    style={{ backgroundColor: 'rgba(31, 58, 95, 0.1)' }}
                                >
                                    <svg
                                        className="w-6 h-6"
                                        style={{ color: '#1F3A5F' }}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2" style={{ color: '#2E2E2E' }}>
                                        Explora Oportunidades
                                    </h4>
                                    <p className="text-sm" style={{ color: 'rgba(46, 46, 46, 0.7)' }}>
                                        Descubre las ofertas laborales disponibles para ti
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Dashboard;