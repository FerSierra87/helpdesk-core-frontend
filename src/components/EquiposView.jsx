import { useState, useEffect } from 'react';
import { equiposApi, clientesApi } from '../api';

export default function EquiposView() {
  const [equipos, setEquipos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ tipo: '', marca: '', modelo: '', numeroSerie: '', clienteId: '' });
  const [enviando, setEnviando] = useState(false);

  const cargarDatos = async () => {
    setCargando(true);
    setError(null);
    try {
      const [equiposData, clientesData] = await Promise.all([
        equiposApi.listar(),
        clientesApi.listar(),
      ]);
      setEquipos(equiposData || []);
      setClientes(clientesData || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.tipo.trim() || !form.marca.trim() || !form.clienteId) return;
    setEnviando(true);
    setError(null);
    try {
      await equiposApi.crear({
        tipo: form.tipo,
        marca: form.marca,
        modelo: form.modelo,
        numeroSerie: form.numeroSerie,
        cliente: { id: Number(form.clienteId) },
      });
      setForm({ tipo: '', marca: '', modelo: '', numeroSerie: '', clienteId: '' });
      await cargarDatos();
    } catch (e) {
      setError(e.message);
    } finally {
      setEnviando(false);
    }
  };

  const handleEliminar = async (id) => {
    if (!confirm('¿Eliminar este equipo? Esto puede fallar si tiene tickets asociados.')) return;
    try {
      await equiposApi.eliminar(id);
      await cargarDatos();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-hd-text">Equipos</h2>
        <p className="text-sm text-hd-muted">Hardware y software asignado a cada cliente.</p>
      </div>

      {error && (
        <div className="bg-hd-danger/10 border border-hd-danger text-hd-danger text-sm rounded-lg p-3">
          {error}
        </div>
      )}

      {clientes.length === 0 && !cargando && (
        <div className="bg-hd-warning/10 border border-hd-warning text-hd-warning text-sm rounded-lg p-3">
          Todavía no hay clientes cargados. Creá al menos uno en la sección "Clientes" antes de
          registrar un equipo.
        </div>
      )}

      {/* FORMULARIO */}
      <form
        onSubmit={handleSubmit}
        className="bg-hd-surface border border-hd-border rounded-xl p-5 grid grid-cols-1 md:grid-cols-3 gap-3"
      >
        <select
          value={form.clienteId}
          onChange={(e) => setForm({ ...form, clienteId: e.target.value })}
          className="bg-hd-bg border border-hd-border rounded-lg px-3 py-2 text-sm text-hd-text focus:outline-none focus:border-hd-primary"
        >
          <option value="">Seleccioná un cliente...</option>
          {clientes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Tipo (Notebook, Monitor...)"
          value={form.tipo}
          onChange={(e) => setForm({ ...form, tipo: e.target.value })}
          className="bg-hd-bg border border-hd-border rounded-lg px-3 py-2 text-sm text-hd-text focus:outline-none focus:border-hd-primary"
        />
        <input
          type="text"
          placeholder="Marca"
          value={form.marca}
          onChange={(e) => setForm({ ...form, marca: e.target.value })}
          className="bg-hd-bg border border-hd-border rounded-lg px-3 py-2 text-sm text-hd-text focus:outline-none focus:border-hd-primary"
        />
        <input
          type="text"
          placeholder="Modelo (opcional)"
          value={form.modelo}
          onChange={(e) => setForm({ ...form, modelo: e.target.value })}
          className="bg-hd-bg border border-hd-border rounded-lg px-3 py-2 text-sm text-hd-text focus:outline-none focus:border-hd-primary"
        />
        <input
          type="text"
          placeholder="Número de serie (opcional)"
          value={form.numeroSerie}
          onChange={(e) => setForm({ ...form, numeroSerie: e.target.value })}
          className="bg-hd-bg border border-hd-border rounded-lg px-3 py-2 text-sm text-hd-text focus:outline-none focus:border-hd-primary"
        />
        <button
          type="submit"
          disabled={enviando}
          className="bg-hd-primary hover:bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-semibold transition-all disabled:opacity-50"
        >
          {enviando ? 'Guardando...' : '+ Agregar equipo'}
        </button>
      </form>

      {/* LISTA */}
      {cargando ? (
        <p className="text-hd-muted text-sm">Cargando equipos...</p>
      ) : equipos.length === 0 ? (
        <p className="text-hd-muted text-sm">Todavía no hay equipos cargados.</p>
      ) : (
        <div className="bg-hd-surface border border-hd-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-hd-surface-2 text-hd-muted text-left">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Tipo</th>
                <th className="p-3">Marca / Modelo</th>
                <th className="p-3">N° Serie</th>
                <th className="p-3">Cliente</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {equipos.map((eq) => (
                <tr key={eq.id} className="border-t border-hd-border text-hd-text">
                  <td className="p-3 text-hd-muted">{eq.id}</td>
                  <td className="p-3 font-medium">{eq.tipo}</td>
                  <td className="p-3">
                    {eq.marca} {eq.modelo || ''}
                  </td>
                  <td className="p-3">{eq.numeroSerie || '—'}</td>
                  <td className="p-3">{eq.cliente?.nombre || '—'}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleEliminar(eq.id)}
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
      )}
    </div>
  );
}
