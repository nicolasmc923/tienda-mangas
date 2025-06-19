import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [modo, setModo] = useState('login'); // 'login' o 'registro'
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const adminEmail = 'nicolascm329@gmail.com'; // tu correo admin

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (modo === 'registro' && email !== adminEmail) {
      setError('❌ Solo el administrador puede registrarse.');
      return;
    }

    let resultado;
    if (modo === 'registro') {
      resultado = await supabase.auth.signUp({ email, password });
    } else {
      resultado = await supabase.auth.signInWithPassword({ email, password });
    }

    const correo = resultado.data?.user?.email || resultado.data?.session?.user?.email;

    if (resultado.error) {
      setError(resultado.error.message);
    } else if (correo === adminEmail) {
      navigate('/admin');
    } else {
      setError('🚫 No autorizado.');
      await supabase.auth.signOut();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-6 rounded shadow max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4 text-center">
          {modo === 'login' ? 'Iniciar sesión' : 'Registrarse'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button className="w-full" type="submit">
            {modo === 'login' ? 'Entrar' : 'Registrarse'}
          </Button>
        </form>

        {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}

        <p className="text-sm mt-4 text-center">
          {modo === 'login' ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
          <button
            onClick={() => setModo(modo === 'login' ? 'registro' : 'login')}
            className="text-blue-600 underline"
          >
            {modo === 'login' ? 'Regístrate' : 'Inicia sesión'}
          </button>
        </p>
      </div>
    </div>
  );
}
