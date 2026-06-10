import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:8000/api';

const styles = {
  input: "w-full bg-white border border-slate-200 rounded-lg p-2 text-sm h-10 focus:outline-none focus:border-slate-900 transition-colors appearance-none",
  inputMultiple: "w-full bg-white border border-slate-200 rounded-lg p-2 text-sm focus:outline-none focus:border-slate-900 transition-colors",
  btnPrimary: "inline-flex items-center justify-center bg-slate-900 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap h-10",
  btnSecondary: "inline-flex items-center justify-center bg-slate-100 text-slate-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-200 border border-slate-200/40 transition-colors h-10"
};

export default function AgendamentoView() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [barbeiros, setBarbeiros] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [horariosLivres, setHorariosLivres] = useState([]);

  const [idEdicao, setIdEdicao] = useState(null);
  const [mensagem, setMensagem] = useState('');
  const [statusErro, setStatusErro] = useState(false);

  const [busca, setBusca] = useState({ barbeiro_id: '', data: '', servicos: [] });
  const [form, setForm] = useState({ cliente_id: '', barbeiro_id: '', data_hora: '', servicos: [] });

  const carregarDados = async () => {
    const [agend, cli, barb, serv] = await Promise.all([
      axios.get(`${API_BASE}/agendamentos`),
      axios.get(`${API_BASE}/clientes`),
      axios.get(`${API_BASE}/barbeiros`),
      axios.get(`${API_BASE}/servicos`)
    ]);
    setAgendamentos(agend.data);
    setClientes(cli.data);
    setBarbeiros(barb.data);
    setServicos(serv.data);
  };

  useEffect(() => { carregarDados(); }, []);

  const getClienteNome = (id) => {
    const c = clientes.find(item => item.id === id);
    return c ? c.nome : `Cliente #${id}`;
  };

  const getBarbeiroNome = (id) => {
    const b = barbeiros.find(item => item.id === id);
    return b ? b.nome : `Barbeiro #${id}`;
  };

  const consultarHorarios = async () => {
    if (!busca.data || busca.servicos.length === 0) return alert('Selecione data e serviços!');
    let query = `barbeiro_id=${busca.barbeiro_id}&data=${busca.data}`;
    busca.servicos.forEach(id => query += `&servicos[]=${id}`);

    const res = await axios.get(`${API_BASE}/agendamentos/disponibilidade?${query}`);
    setHorariosLivres(res.data);
  };

  const aplicarHorario = (h) => {
    setForm(prev => ({ ...prev, data_hora: `${busca.data}T${h}` }));
  };

  const handleMultipleSelect = (e, stateSetter) => {
    const options = Array.from(e.target.selectedOptions, option => parseInt(option.value));
    stateSetter(prev => ({ ...prev, servicos: options }));
  };

  const salvarAgendamento = async (e) => {
    e.preventDefault();
    try {
      setMensagem('');
      const dadosParaEnviar = { ...form };

      if (dadosParaEnviar.data_hora) {
        dadosParaEnviar.data_hora = dadosParaEnviar.data_hora.replace('T', ' ') + ':00';
      }

      if (idEdicao) {
        await axios.patch(`${API_BASE}/agendamentos/${idEdicao}`, dadosParaEnviar);
      } else {
        await axios.post(`${API_BASE}/agendamentos`, dadosParaEnviar);
      }

      setStatusErro(false);
      setMensagem("Agendamento salvo com sucesso!");
      limparForm();
      carregarDados();
    } catch (error) {
      setStatusErro(true);
      setMensagem(error.response?.data?.mensagem || error.response?.data?.message || "Ocorreu um erro.");
    }
  };

  const prepararEdicao = (a) => {
    setIdEdicao(a.id);
    const dataFormatadaParaInput = a.data_hora ? a.data_hora.substring(0, 16).replace(' ', 'T') : '';
    setForm({
      cliente_id: a.cliente_id,
      barbeiro_id: a.barbeiro_id,
      data_hora: dataFormatadaParaInput,
      servicos: a.servicos.map(s => s.id)
    });
  };

  const limparForm = () => {
    setIdEdicao(null);
    setForm({ cliente_id: '', barbeiro_id: '', data_hora: '', servicos: [] });
  };

  const cancelar = async (id) => {
    if (window.confirm('Deseja realmente cancelar este horário?')) {
      await axios.delete(`${API_BASE}/agendamentos/${id}`);
      carregarDados();
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Painel de Agendamentos</h2>
        <p className="text-sm text-slate-500">Consulte janelas de horários livres e gerencie os agendamentos da barbearia.</p>
      </div>

      {mensagem && (
        <div className={`${statusErro ? 'bg-red-50 text-red-700 border-red-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'} p-4 rounded-xl border text-sm font-medium transition-all`}>
          {mensagem}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">1. Consultar Horários Livres</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Selecione o Barbeiro</label>
              <select value={busca.barbeiro_id} onChange={e => setBusca({...busca, barbeiro_id: e.target.value})} className={styles.input}>
                <option value="">Selecione...</option>
                {barbeiros.map(b => <option key={b.id} value={b.id}>{b.nome}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Data da Consulta</label>
              <input type="date" value={busca.data} onChange={e => setBusca({...busca, data: e.target.value})} className={styles.input} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Serviços Desejados (Ctrl para múltiplos)</label>
              <select multiple size="4" value={busca.servicos} onChange={e => handleMultipleSelect(e, setBusca)} className={styles.inputMultiple}>
                {servicos.map(s => <option key={s.id} value={s.id}>{s.nome} ({s.duracao_minutos} min)</option>)}
              </select>
            </div>
            <button onClick={consultarHorarios} className={styles.btnSecondary + " w-full"}>Verificar Disponibilidade</button>
          </div>

          <div className="pt-2 border-t border-slate-200/60">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Horários Livres no Dia:</h4>
            {horariosLivres.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {horariosLivres.map(h => (
                  <button key={h} onClick={() => aplicarHorario(h)} className="text-xs font-semibold bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg hover:border-slate-900 hover:bg-slate-900 hover:text-white transition-all shadow-sm">{h}</button>
                ))}
              </div>
            ) : <p className="text-xs text-slate-400 italic">Nenhum horário livre.</p>}
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">2. {idEdicao ? 'Remarcar / Atualizar Horário' : 'Novo Agendamento'}</h3>
          <form onSubmit={salvarAgendamento} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Cliente Solicitante</label>
              <select value={form.cliente_id} onChange={e => setForm({...form, cliente_id: e.target.value})} className={styles.input} required>
                <option value="">Selecione...</option>
                {clientes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Profissional Escolhido</label>
              <select value={form.barbeiro_id} onChange={e => setForm({...form, barbeiro_id: e.target.value})} className={styles.input} required>
                <option value="">Selecione...</option>
                {barbeiros.map(b => <option key={b.id} value={b.id}>{b.nome}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Data e Hora de Início</label>
              <input type="datetime-local" value={form.data_hora} onChange={e => setForm({...form, data_hora: e.target.value})} className={styles.input + " font-mono"} required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Confirmar Serviços (Ctrl para múltiplos)</label>
              <select multiple size="4" value={form.servicos} onChange={e => handleMultipleSelect(e, setForm)} className={styles.inputMultiple} required>
                {servicos.map(s => <option key={s.id} value={s.id}>{s.nome}</option>)}
              </select>
            </div>
            <div className="flex gap-2 pt-2">
              <button type="submit" className={styles.btnPrimary + " flex-1"}>Confirmar Agendamento</button>
              {idEdicao && <button type="button" onClick={limparForm} className={styles.btnSecondary}>Cancelar</button>}
            </div>
          </form>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Agendamentos Ativos</h3>
        <div className="overflow-x-auto rounded-xl border border-slate-100 shadow-sm bg-white">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="p-4 w-12">ID</th>
                <th className="p-4">Cliente</th>
                <th className="p-4">Barbeiro</th>
                <th className="p-4">Data / Hora Marcada</th>
                <th className="p-4">Serviços Inclusos</th>
                <th className="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {agendamentos.map(a => (
                <tr key={a.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 font-mono font-medium text-slate-400">#{a.id}</td>
                  <td className="p-4 font-medium text-slate-900">{getClienteNome(a.cliente_id)}</td>
                  <td className="p-4 text-slate-600">{getBarbeiroNome(a.barbeiro_id)}</td>
                  <td className="p-4 font-mono text-xs text-slate-600">{a.data_hora}</td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {a.servicos?.map(s => (
                        <span key={s.id} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">{s.nome}</span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 text-right space-x-1 whitespace-nowrap">
                    <button onClick={() => prepararEdicao(a)} className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-2.5 py-1.5 rounded-md hover:bg-slate-100 transition-colors">Alterar</button>
                    <button onClick={() => cancelar(a.id)} className="text-xs font-semibold text-red-600 hover:text-red-700 px-2.5 py-1.5 rounded-md hover:bg-red-50 transition-colors">Cancelar</button>
                  </td>
                </tr>
              ))}
              {agendamentos.length === 0 && (
                <tr><td colSpan="6" className="p-8 text-center text-slate-400 bg-slate-50/20">Nenhum horário marcado no sistema.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}