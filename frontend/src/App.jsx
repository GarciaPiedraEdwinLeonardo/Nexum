import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Main from "./pages/Main";

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

        {/* Ruta para manejar páginas no encontradas */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
