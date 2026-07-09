import { useState, useEffect } from 'react';
import ClientesView from './components/ClientesView';
import EquiposView from './components/EquiposView';
import TicketsView from './components/TicketsView';
import { clientesApi, equiposApi, ticketsApi } from './api';

const TABS = [
  { id: 'clientes', label: 'Clientes', icon: 'fa-users' },
  { id: 'equipos', label: 'Equipos', icon: 'fa-desktop' },
  { id: 'tickets', label: 'Tickets', icon: 'fa-ticket' },
];

export default function App() {
  const [tab, setTab] = useState('clientes');
  const [stats, setStats] = useState({ clientes: 0, equipos: 0, ticketsAbiertos: 0 });
  const [apiError, setApiError] = useState(false);

  const cargarStats = async () => {
    try {
      const [clientes, equipos, tickets] = await Promise.all([
        clientesApi.listar(),
        equiposApi.listar(),
        ticketsApi.listar(),
      ]);
      setStats({
        clientes: (clientes || []).length,
        equipos: (equipos || []).length,
        ticketsAbiertos: (tickets || []).filter((t) => t.estado === 'abierto').length,
      });
      setApiError(false);
    } catch (e) {
      setApiError(true);
    }
  };

  useEffect(() => {
    cargarStats();
  }, [tab]);

  return (
    <div className="min-h-screen bg-hd-bg text-hd-text">
      {/* HEADER */}
      <header className="border-b border-hd-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <i className="fa-solid fa-headset text-hd-primary text-xl"></i>
          <div>
            <h1 className="font-bold text-lg leading-tight">Helpdesk Core</h1>
            <p className="text-xs text-hd-muted">Panel de gestión de soporte técnico</p>
          </div>
        </div>
      </header>

      {apiError && (
        <div className="bg-hd-danger/10 border-b border-hd-danger text-hd-danger text-sm px-6 py-3">
          No se pudo conectar con la API en <code>http://localhost:8080</code>. Verificá que tu
          proyecto Spring Boot esté corriendo y que CORS esté configurado.
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* DASHBOARD RESUMEN */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-hd-surface border border-hd-border rounded-xl p-5 flex items-center gap-4">
            <i className="fa-solid fa-users text-2xl text-hd-primary"></i>
            <div>
              <span className="text-xs text-hd-muted block">Clientes</span>
              <span className="text-2xl font-bold">{stats.clientes}</span>
            </div>
          </div>
          <div className="bg-hd-surface border border-hd-border rounded-xl p-5 flex items-center gap-4">
            <i className="fa-solid fa-desktop text-2xl text-hd-primary"></i>
            <div>
              <span className="text-xs text-hd-muted block">Equipos</span>
              <span className="text-2xl font-bold">{stats.equipos}</span>
            </div>
          </div>
          <div className="bg-hd-surface border border-hd-border rounded-xl p-5 flex items-center gap-4">
            <i className="fa-solid fa-ticket text-2xl text-hd-warning"></i>
            <div>
              <span className="text-xs text-hd-muted block">Tickets abiertos</span>
              <span className="text-2xl font-bold">{stats.ticketsAbiertos}</span>
            </div>
          </div>
        </div>

        {/* NAV DE PESTAÑAS */}
        <div className="flex gap-2 border-b border-hd-border">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
                tab === t.id
                  ? 'border-hd-primary text-hd-primary'
                  : 'border-transparent text-hd-muted hover:text-hd-text'
              }`}
            >
              <i className={`fa-solid ${t.icon} text-xs`}></i>
              {t.label}
            </button>
          ))}
        </div>

        {/* CONTENIDO */}
        {tab === 'clientes' && <ClientesView />}
        {tab === 'equipos' && <EquiposView />}
        {tab === 'tickets' && <TicketsView />}
      </div>
    </div>
  );
}
