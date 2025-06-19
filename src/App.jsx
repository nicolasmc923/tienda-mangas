// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TiendaMangas from './TiendaMangas';
import LoginPage from './pages/Login';
import Admin from './pages/Admin';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TiendaMangas />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}
