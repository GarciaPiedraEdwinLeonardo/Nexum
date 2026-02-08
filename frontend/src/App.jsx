import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Main from "./pages/Main";
import EmailConfirmed from "./components/auth/EmailConfirmed";
import ResetPassword from "./components/auth/ResetPassword";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta principal - redirige a login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Rutas de autenticación */}
        <Route path="/login" element={<Main view="login" />} />
        <Route path="/register" element={<Main view="register" />} />
        <Route path="/forgot-password" element={<Main view="forgot-password" />} />
        <Route path="/verify-email" element={<Main view="verify-email" />} />

        {/* Rutas con token */}
        <Route path="/confirm-email/:token" element={<EmailConfirmed />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Ruta para manejar páginas no encontradas */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
