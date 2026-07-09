import { useState, useEffect } from 'react';
import { ticketsApi, equiposApi } from '../api';

const CATEGORIAS = ['Hardware', 'Redes', 'Accesos', 'Sistemas'];
const PRIORIDADES = ['baja', 'media', 'alta'];

export default function TicketsView() {
  const [tickets, setTickets] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [form, setForm] = useState({
    descripcion: '',
    categoria: 'Hardware',
    prioridad: 'media',
    equipoId: '',
  });
  const [enviando, setEnviando] = useState(false);

  const cargarDatos = async () => {
    setCargando(true);
    setError(null);
    try {
      const [ticketsData, equiposData] = await Promise.all([
        ticketsApi.listar(),
        equiposApi.listar(),
      ]);
      setTickets(ticketsData || []);
      setEquipos(equiposData || []);
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
    if (!form.descripcion.trim() || !form.equipoId) return;
    setEnviando(true);
    setError(null);
    try {
      await ticketsApi.crear({
        descripcion: form.descripcion,
        categoria: form.categoria,
        prioridad: form.prioridad,
        equipo: { id: Number(form.equipoId) },
      });
      setForm({ descripcion: '', categoria: 'Hardware', prioridad: 'media', equipoId: '' });
      await cargarDatos();
    } catch (e) {
      setError(e.message);
    } finally {
      setEnviando(false);
    }
  };

  const handleResolver = async (id) => {
    try {
      await ticketsApi.resolver(id);
      await cargarDatos();
    } catch (e) {
      setError(e.message);
    }
  };

  const handleEliminar = async (id) => {
    if (!confirm('¿Eliminar este ticket?')) return;
    try {
      await ticketsApi.eliminar(id);
      await cargarDatos();
    } catch (e) {
      setError(e.message);
    }
  };

  const ticketsFiltrados = tickets.filter(
    (t) => filtroEstado === 'todos' || t.estado === filtroEstado
  );

  const colorPrioridad = (p) =>
    p === 'alta' ? 'text-hd-danger' : p === 'media' ? 'text-hd-warning' : 'text-hd-muted';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-hd-text">Tickets</h2>
        <p className="text-sm text-hd-muted">Incidencias reportadas sobre los equipos.</p>
      </div>

      {error && (
        <div className="bg-hd-danger/10 border border-hd-danger text-hd-danger text-sm rounded-lg p-3">
          {error}
        </div>
      )}

      {equipos.length === 0 && !cargando && (
        <div className="bg-hd-warning/10 border border-hd-warning text-hd-warning text-sm rounded-lg p-3">
          Todavía no hay equipos cargados. Creá al menos uno en la sección "Equipos" antes de
          registrar un ticket.
        </div>
      )}

      {/* FORMULARIO */}
      <form
        onSubmit={handleSubmit}
        className="bg-hd-surface border border-hd-border rounded-xl p-5 grid grid-cols-1 md:grid-cols-2 gap-3"
      >
        <select
          value={form.equipoId}
          onChange={(e) => setForm({ ...form, equipoId: e.target.value })}
          className="bg-hd-bg border border-hd-border rounded-lg px-3 py-2 text-sm text-hd-text focus:outline-none focus:border-hd-primary md:col-span-2"
        >
          <option value="">Seleccioná un equipo...</option>
          {equipos.map((eq) => (
            <option key={eq.id} value={eq.id}>
              {eq.tipo} {eq.marca} — {eq.cliente?.nombre}
            </option>
          ))}
        </select>
        <textarea
          rows="2"
          placeholder="Descripción del problema"
          value={form.descripcion}
          onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
          className="bg-hd-bg border border-hd-border rounded-lg px-3 py-2 text-sm text-hd-text focus:outline-none focus:border-hd-primary md:col-span-2"
        />
        <select
          value={form.categoria}
          onChange={(e) => setForm({ ...form, categoria: e.target.value })}
          className="bg-hd-bg border border-hd-border rounded-lg px-3 py-2 text-sm text-hd-text focus:outline-none focus:border-hd-primary"
        >
          {CATEGORIAS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={form.prioridad}
          onChange={(e) => setForm({ ...form, prioridad: e.target.value })}
          className="bg-hd-bg border border-hd-border rounded-lg px-3 py-2 text-sm text-hd-text focus:outline-none focus:border-hd-primary"
        >
          {PRIORIDADES.map((p) => (
            <option key={p} value={p}>
              Prioridad {p}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={enviando}
          className="bg-hd-primary hover:bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-semibold transition-all disabled:opacity-50 md:col-span-2"
        >
          {enviando ? 'Guardando...' : '+ Crear ticket'}
        </button>
      </form>

      {/* FILTRO */}
      <div className="flex gap-2">
        {['todos', 'abierto', 'resuelto'].map((estado) => (
          <button
            key={estado}
            onClick={() => setFiltroEstado(estado)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              filtroEstado === estado
                ? 'bg-hd-primary border-hd-primary text-white'
                : 'border-hd-border text-hd-muted hover:text-hd-text'
            }`}
          >
            {estado.charAt(0).toUpperCase() + estado.slice(1)}
          </button>
        ))}
      </div>

      {/* LISTA */}
      {cargando ? (
        <p className="text-hd-muted text-sm">Cargando tickets...</p>
      ) : ticketsFiltrados.length === 0 ? (
        <p className="text-hd-muted text-sm">No hay tickets para mostrar.</p>
      ) : (
        <div className="space-y-3">
          {ticketsFiltrados.map((t) => (
            <div
              key={t.id}
              className={`bg-hd-surface border border-hd-border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                t.estado === 'resuelto' ? 'opacity-60' : ''
              }`}
            >
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-hd-primary">{t.categoria}</span>
                  <span className={`text-xs font-semibold ${colorPrioridad(t.prioridad)}`}>
                    Prioridad {t.prioridad}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full border ${
                      t.estado === 'abierto'
                        ? 'border-hd-warning text-hd-warning'
                        : 'border-hd-success text-hd-success'
                    }`}
                  >
                    {t.estado.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-hd-text">{t.descripcion}</p>
                <p className="text-xs text-hd-muted mt-1">
                  {t.equipo?.tipo} {t.equipo?.marca} · Cliente: {t.equipo?.cliente?.nombre}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                {t.estado === 'abierto' && (
                  <button
                    onClick={() => handleResolver(t.id)}
                    className="text-xs px-3 py-1.5 rounded-lg border border-hd-success text-hd-success hover:bg-hd-success/10 transition-all"
                  >
                    Marcar resuelto
                  </button>
                )}
                <button
                  onClick={() => handleEliminar(t.id)}
                  className="text-xs px-3 py-1.5 rounded-lg border border-hd-danger text-hd-danger hover:bg-hd-danger/10 transition-all"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
