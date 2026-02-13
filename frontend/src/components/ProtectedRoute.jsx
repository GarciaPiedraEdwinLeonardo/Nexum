import { Navigate } from 'react-router-dom';
import authService from '../services/authService';

/**
 * Componente para proteger rutas que requieren autenticación
 * Redirige a /login si no hay sesión activa
 */
function ProtectedRoute({ children }) {
    const isAuthenticated = authService.isAuthenticated();

    if (!isAuthenticated) {
        // Si no está autenticado, redirigir a login
        return <Navigate to="/login" replace />;
    }

    // Si está autenticado, renderizar el componente hijo
    return children;
}

export default ProtectedRoute;