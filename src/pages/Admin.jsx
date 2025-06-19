import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';

const ADMIN_EMAIL = 'nicolascm329@gmail.com';

export default function AdminPanel() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [mangas, setMangas] = useState([]);
  const [mensaje, setMensaje] = useState('');

  const [nuevoManga, setNuevoManga] = useState({
    nombre: '',
    precio: '',
    imagen_url: '',
    categoria_id: ''
  });

  useEffect(() => {
    const verificarSesion = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || user.email !== ADMIN_EMAIL) {
        navigate('/login');
      } else {
        setUser(user);
        cargarCategorias();
        cargarMangas();
      }
    };
    verificarSesion();
  }, []);

  const cargarCategorias = async () => {
    const { data, error } = await supabase.from('categorias').select('*');
    if (!error) setCategorias(data);
  };

  const cargarMangas = async () => {
    const { data, error } = await supabase
      .from('mangas')
      .select('id, nombre, precio, imagen_url, categorias(nombre)');
    if (!error) setMangas(data);
  };

  const handleGuardar = async () => {
    setMensaje('');
    if (!nuevoManga.nombre || !nuevoManga.precio || !nuevoManga.imagen_url || !nuevoManga.categoria_id) {
      setMensaje('Completa todos los campos.');
      return;
    }

    const { error } = await supabase.from('mangas').insert([nuevoManga]);
    if (!error) {
      setNuevoManga({ nombre: '', precio: '', imagen_url: '', categoria_id: '' });
      cargarMangas();
      setMensaje('✅ Manga agregado');
    } else {
      setMensaje('❌ Error al guardar');
    }
  };

  const cerrarSesion = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (!user) return <p className="p-6">🔐 Verificando sesión...</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">🛠️ Panel de Administración</h1>
        <Button onClick={cerrarSesion} className="bg-red-600 hover:bg-red-700 text-white text-sm">Cerrar sesión</Button>
      </div>

      {/* FORMULARIO */}
      <section className="bg-white p-6 rounded shadow space-y-4">
        <h2 className="text-xl font-semibold">➕ Agregar nuevo manga</h2>
        <Input placeholder="Nombre" value={nuevoManga.nombre} onChange={(e) => setNuevoManga({ ...nuevoManga, nombre: e.target.value })} />
        <Input placeholder="Precio en Bs." type="number" value={nuevoManga.precio} onChange={(e) => setNuevoManga({ ...nuevoManga, precio: e.target.value })} />
        <Input placeholder="URL de imagen" value={nuevoManga.imagen_url} onChange={(e) => setNuevoManga({ ...nuevoManga, imagen_url: e.target.value })} />

        {nuevoManga.imagen_url && (
          <img src={nuevoManga.imagen_url} alt="Vista previa" className="w-32 h-32 object-cover rounded border" />
        )}

        <select
          className="border rounded px-3 py-2"
          value={nuevoManga.categoria_id}
          onChange={(e) => setNuevoManga({ ...nuevoManga, categoria_id: e.target.value })}
        >
          <option value="">Selecciona categoría</option>
          {categorias.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.nombre}</option>
          ))}
        </select>

        <Button onClick={handleGuardar}>Guardar manga</Button>
        {mensaje && <p className="text-sm text-center mt-2 text-blue-600">{mensaje}</p>}
      </section>

      {/* INVENTARIO */}
      <section className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">📚 Inventario actual</h2>
        {mangas.length === 0 ? (
          <p className="text-gray-500 text-sm">Aún no hay mangas registrados.</p>
        ) : (
          <ul className="grid sm:grid-cols-2 gap-4">
            {mangas.map(m => (
              <li key={m.id} className="border p-4 rounded shadow-sm space-y-2">
                {m.imagen_url && (
                  <img src={m.imagen_url} alt={m.nombre} className="w-full h-40 object-cover rounded" />
                )}
                <h3 className="font-bold">{m.nombre}</h3>
                <p className="text-sm text-gray-700">Bs. {m.precio}</p>
                <p className="text-xs text-blue-600 italic">{m.categorias?.nombre || 'Sin categoría'}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
