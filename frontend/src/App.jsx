import Main from "./pages/Main";
// import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div>
      <Main />
    </div>
  );

  /* 
  // Cuando estés listo para usar React Router DOM, descomenta esto:
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        {Agrega más rutas aquí }
      </Routes>
    </BrowserRouter>
  );
  */
}

export default App;
