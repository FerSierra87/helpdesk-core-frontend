import { useState, useEffect } from 'react';
import { clientesApi } from '../api';

export default function ClientesView() {
  const [clientes, setClientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '' });
  const [enviando, setEnviando] = useState(false);

  const cargarClientes = async () => {
    setCargando(true);
    setError(null);
    try {
      const data = await clientesApi.listar();
      setClientes(data || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombre.trim() || !form.email.trim()) return;
    setEnviando(true);
    setError(null);
    try {
      await clientesApi.crear(form);
      setForm({ nombre: '', email: '', telefono: '' });
      await cargarClientes();
    } catch (e) {
      setError(e.message);
    } finally {
      setEnviando(false);
    }
  };

  const handleEliminar = async (id) => {
    if (!confirm('¿Eliminar este cliente? Esto puede fallar si tiene equipos asociados.')) return;
    try {
      await clientesApi.eliminar(id);
      await cargarClientes();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-hd-text">Clientes</h2>
        <p className="text-sm text-hd-muted">Personas o empresas a las que les brindás soporte.</p>
      </div>

      {error && (
        <div className="bg-hd-danger/10 border border-hd-danger text-hd-danger text-sm rounded-lg p-3">
          {error}
        </div>
      )}

      {/* FORMULARIO */}
      <form
        onSubmit={handleSubmit}
        className="bg-hd-surface border border-hd-border rounded-xl p-5 grid grid-cols-1 md:grid-cols-4 gap-3"
      >
        <input
          type="text"
          placeholder="Nombre"
          value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          className="bg-hd-bg border border-hd-border rounded-lg px-3 py-2 text-sm text-hd-text focus:outline-none focus:border-hd-primary"
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="bg-hd-bg border border-hd-border rounded-lg px-3 py-2 text-sm text-hd-text focus:outline-none focus:border-hd-primary"
        />
        <input
          type="text"
          placeholder="Teléfono (opcional)"
          value={form.telefono}
          onChange={(e) => setForm({ ...form, telefono: e.target.value })}
          className="bg-hd-bg border border-hd-border rounded-lg px-3 py-2 text-sm text-hd-text focus:outline-none focus:border-hd-primary"
        />
        <button
          type="submit"
          disabled={enviando}
          className="bg-hd-primary hover:bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-semibold transition-all disabled:opacity-50"
        >
          {enviando ? 'Guardando...' : '+ Agregar cliente'}
        </button>
      </form>

      {/* LISTA */}
      {cargando ? (
        <p className="text-hd-muted text-sm">Cargando clientes...</p>
      ) : clientes.length === 0 ? (
        <p className="text-hd-muted text-sm">Todavía no hay clientes cargados.</p>
      ) : (
        <>
          <div className="bg-hd-surface border border-hd-border rounded-xl overflow-x-auto">
            <table className="w-full text-sm min-w-[560px]">
              <thead className="bg-hd-surface-2 text-hd-muted text-left">
                <tr>
                  <th className="p-3">ID</th>
                  <th className="p-3">Nombre</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Teléfono</th>
                  <th className="p-3"></th>
                </tr>
              </thead>
              <tbody>
                {clientes.map((c) => (
                  <tr key={c.id} className="border-t border-hd-border text-hd-text">
                    <td className="p-3 text-hd-muted">{c.id}</td>
                    <td className="p-3 font-medium whitespace-nowrap">{c.nombre}</td>
                    <td className="p-3 whitespace-nowrap">{c.email}</td>
                    <td className="p-3 whitespace-nowrap">{c.telefono || '—'}</td>
                    <td className="p-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleEliminar(c.id)}
                        className="text-hd-danger hover:underline text-xs"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[10px] text-hd-muted sm:hidden">← Deslizá para ver todos los datos →</p>
        </>
      )}
    </div>
  );
}
