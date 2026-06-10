import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import DashboardView from './views/DashboardView';
import BarbeiroView from './views/BarbeiroView';
import ClienteView from './views/ClienteView';
import ServicoView from './views/ServicoView';
import AgendamentoView from './views/AgendamentoView';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-100/50">
        <nav className="bg-white border-b border-slate-200 p-4 shadow-sm">
          <div className="max-w-7xl mx-auto flex gap-4 text-sm font-medium text-slate-600">
            <Link to="/" className="hover:text-slate-900 transition-colors">Dashboard</Link>
            <Link to="/agendamentos" className="hover:text-slate-900 transition-colors">Agendamentos</Link>
            <Link to="/barbeiros" className="hover:text-slate-900 transition-colors">Barbeiros</Link>
            <Link to="/clientes" className="hover:text-slate-900 transition-colors">Clientes</Link>
            <Link to="/servicos" className="hover:text-slate-900 transition-colors">Serviços</Link>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto p-6">
          <Routes>
            <Route path="/" element={<DashboardView />} />
            <Route path="/agendamentos" element={<AgendamentoView />} />
            <Route path="/barbeiros" element={<BarbeiroView />} />
            <Route path="/clientes" element={<ClienteView />} />
            <Route path="/servicos" element={<ServicoView />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}