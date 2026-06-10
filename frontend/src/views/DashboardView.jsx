import React from 'react';

export default function DashboardView() {
  return (
    <div className="space-y-2 p-4">
      <h2 className="text-xl font-bold text-slate-900">Bem-vindo ao Sistema de Agendamentos!</h2>
      <p className="text-sm text-slate-500">
        Utilize o menu superior para gerenciar os cadastros e verificar a disponibilidade dos barbeiros em tempo real.
      </p>
    </div>
  );
}