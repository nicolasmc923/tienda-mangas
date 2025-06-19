import { useState, useEffect } from 'react';
import { Input } from './components/ui/input';
import { Button } from './components/ui/button';
import { Card, CardContent } from './components/ui/card';
import { supabase } from './lib/supabase';

export default function TiendaMangas() {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [carrito, setCarrito] = useState([]);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);

  useEffect(() => {
    async function cargarMangas() {
      const { data, error } = await supabase
        .from('mangas')
        .select('id, nombre, precio, imagen_url, categorias (nombre)');
      if (error) console.error('Error al cargar mangas:', error);
      else setProductos(data);
    }

    cargarMangas();
  }, []);

  const productosFiltrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const agregarAlCarrito = (producto) => {
    setCarrito([...carrito, producto]);
  };

  const eliminarDelCarrito = (index) => {
    const nuevoCarrito = [...carrito];
    nuevoCarrito.splice(index, 1);
    setCarrito(nuevoCarrito);
  };

  const enviarWhatsApp = () => {
    if (carrito.length === 0) return alert('El carrito está vacío');

    let mensaje = 'Hola, quiero comprar:\n';
    let total = 0;

    carrito.forEach(p => {
      mensaje += `- ${p.nombre} (Bs. ${p.precio})\n`;
      total += p.precio;
    });

    mensaje += `\nTotal: Bs. ${total}`;
    const numero = '59175073898';
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="max-w-screen-xl mx-auto">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white shadow flex flex-col md:flex-row gap-3 items-center justify-between px-4 py-3">
        <h1 className="text-xl font-bold">🛍️ Tienda de Mangas</h1>
        <Input
          placeholder="Buscar manga..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full md:w-64"
        />
        <div className="relative">
          <button onClick={() => setMostrarCarrito(!mostrarCarrito)} className="relative text-xl">
            🛒
            {carrito.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2 text-xs">
                {carrito.length}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* MODAL DEL CARRITO */}
      {mostrarCarrito && (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-start pt-10">
          <div className="bg-white w-[90%] max-w-md rounded-xl shadow-lg p-4 relative">
            <button
              className="absolute top-2 right-3 text-red-600 text-lg"
              onClick={() => setMostrarCarrito(false)}
            >
              ✖
            </button>
            <h3 className="text-lg font-bold mb-2">Carrito</h3>
            <div className="max-h-60 overflow-y-auto space-y-2">
              {carrito.map((item, index) => (
                <div key={index} className="flex justify-between items-center border-b pb-1">
                  <span className="text-sm">{item.nombre}</span>
                  <Button variant="ghost" size="sm" onClick={() => eliminarDelCarrito(index)}>
                    ❌
                  </Button>
                </div>
              ))}
            </div>
            <Button className="mt-4 w-full" onClick={enviarWhatsApp}>
              Comprar por WhatsApp
            </Button>
          </div>
        </div>
      )}

      {/* PRODUCTOS */}
      <main className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {productosFiltrados.map((p) => (
          <Card key={p.id} className="flex flex-col justify-between">
            <CardContent className="p-4">
              {p.imagen_url && (
                <img
                  src={p.imagen_url}
                  alt={p.nombre}
                  className="w-full h-40 object-cover rounded mb-2"
                />
              )}
              <h2 className="text-lg font-semibold">{p.nombre}</h2>
              <p className="text-sm text-gray-500">Bs. {p.precio}</p>
              {p.categorias?.nombre && (
                <p className="text-xs text-blue-600 italic">{p.categorias.nombre}</p>
              )}
              <Button className="mt-3 w-full" onClick={() => agregarAlCarrito(p)}>
                Añadir al carrito
              </Button>
            </CardContent>
          </Card>
        ))}
      </main>
    </div>
  );
}
