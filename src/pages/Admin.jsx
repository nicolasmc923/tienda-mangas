import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';

const ADMIN_EMAIL = 'tunombre@tucorreo.com'; // <-- reemplaza con tu email

export default function AdminPanel() {
  const [user, setUser] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [mangas, setMangas] = useState([]);

  const [nuevoManga, setNuevoManga] = useState({
    nombre: '',
    precio: '',
    imagen_url: '',
    categoria_id: ''
  });

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
    cargarCategorias();
    cargarMangas();
  }, []);

  const cargarCategorias = async () => {
    const { data, error } = await supabase.from('categorias').select('*');
    if (!error) setCategorias(data);
  };

  const cargarMangas = async () => {
    const { data, error } = await supabase.from('mangas').select('*');
    if (!error) setMangas(data);
  };

  const handleGuardar = async () => {
    const { error } = await supabase.from('mangas').insert([nuevoManga]);
    if (!error) {
      setNuevoManga({ nombre: '', precio: '', imagen_url: '', categoria_id: '' });
      cargarMangas();
    } else {
      alert('Error al guardar');
    }
  };

  if (!user) return <p className="p-6">Cargando usuario...</p>;
  if (user.email !== ADMIN_EMAIL) return <p className="p-6 text-red-600">No estás autorizado.</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Panel de Administración</h1>

      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-3">Agregar nuevo manga</h2>
        <div className="grid gap-4">
          <Input placeholder="Nombre" value={nuevoManga.nombre} onChange={(e) => setNuevoManga({ ...nuevoManga, nombre: e.target.value })} />
          <Input placeholder="Precio" type="number" value={nuevoManga.precio} onChange={(e) => setNuevoManga({ ...nuevoManga, precio: e.target.value })} />
          <Input placeholder="Imagen URL" value={nuevoManga.imagen_url} onChange={(e) => setNuevoManga({ ...nuevoManga, imagen_url: e.target.value })} />
          <select
            className="border rounded px-3 py-2"
            value={nuevoManga.categoria_id}
            onChange={(e) => setNuevoManga({ ...nuevoManga, categoria_id: e.target.value })}
          >
            <option value="">Seleccionar categoría</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.nombre}</option>
            ))}
          </select>
          <Button onClick={handleGuardar}>Guardar manga</Button>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Inventario actual</h2>
        <ul className="space-y-2">
          {mangas.map((m) => (
            <li key={m.id} className="border p-3 rounded">
              <strong>{m.nombre}</strong> - Bs. {m.precio}<br />
              <span className="text-sm text-gray-500">{m.categoria_id}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
