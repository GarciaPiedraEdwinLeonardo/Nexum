import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Main from "./pages/Main";
import Dashboard from "./pages/Dashboard";
import EmailConfirmed from "./components/auth/EmailConfirmed";
import ResetPassword from "./components/auth/ResetPassword";
import ProtectedRoute from "./components/ProtectedRoute";
import authService from "./services/authService";

function App() {
  // Función para redirigir usuarios autenticados
  const RedirectIfAuthenticated = ({ children }) => {
    const isAuthenticated = authService.isAuthenticated();

    if (isAuthenticated) {
      return <Navigate to="/dashboard" replace />;
    }

    return children;
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta principal - redirige según autenticación */}
        <Route
          path="/"
          element={
            authService.isAuthenticated() ?
              <Navigate to="/dashboard" replace /> :
              <Navigate to="/login" replace />
          }
        />

        {/* Rutas de autenticación - redirigen a dashboard si ya están autenticados */}
        <Route
          path="/login"
          element={
            <RedirectIfAuthenticated>
              <Main view="login" />
            </RedirectIfAuthenticated>
          }
        />

        <Route
          path="/register"
          element={
            <RedirectIfAuthenticated>
              <Main view="register" />
            </RedirectIfAuthenticated>
          }
        />

        <Route
          path="/forgot-password"
          element={
            <RedirectIfAuthenticated>
              <Main view="forgot-password" />
            </RedirectIfAuthenticated>
          }
        />

        <Route
          path="/verify-email"
          element={
            <RedirectIfAuthenticated>
              <Main view="verify-email" />
            </RedirectIfAuthenticated>
          }
        />

        {/* Rutas con token - estas siempre deben ser accesibles */}
        <Route path="/confirm-email/:token" element={<EmailConfirmed />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Ruta protegida del Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Ruta para manejar páginas no encontradas */}
        <Route
          path="*"
          element={
            authService.isAuthenticated() ?
              <Navigate to="/dashboard" replace /> :
              <Navigate to="/login" replace />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
