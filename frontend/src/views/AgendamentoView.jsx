import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:8000/api';

const HORARIO_ABERTURA = "08:00:00";
const HORARIO_FECHAMENTO = "18:00:00";

const styles = {
  input: "w-full bg-white border border-slate-200 rounded-lg p-2 text-sm h-10 focus:outline-none focus:border-slate-900 transition-colors appearance-none",
  inputMultiple: "w-full bg-white border border-slate-200 rounded-lg p-2 text-sm focus:outline-none focus:border-slate-900 transition-colors",
  btnPrimary: "inline-flex items-center justify-center bg-slate-900 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap h-10 disabled:opacity-50 disabled:cursor-not-allowed",
  btnSecondary: "inline-flex items-center justify-center bg-slate-100 text-slate-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-200 border border-slate-200/40 transition-colors h-10 disabled:opacity-50"
};

export default function AgendamentoView() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [barbeiros, setBarbeiros] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [horariosLivres, setHorariosLivres] = useState([]);
  const [passoAtual, setPassoAtual] = useState(1);
  const [idEdicao, setIdEdicao] = useState(null);
  const [mensagem, setMensagem] = useState('');
  const [statusErro, setStatusErro] = useState(false);

  const [form, setForm] = useState({ cliente_id: '', barbeiro_id: '', data: '', data_hora: '', servicos: [] });

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

  const consultarHorariosDisponiveis = async () => {
    if (!form.data || form.servicos.length === 0 || !form.barbeiro_id) {
      return alert('Por favor, certifique-se de selecionar o profissional, serviços e a data!');
    }

    let query = `barbeiro_id=${form.barbeiro_id}&data=${form.data}`;
    form.servicos.forEach(id => query += `&servicos[]=${id}`);

    try {
      const res = await axios.get(`${API_BASE}/agendamentos/disponibilidade?${query}`);
      console.log(res.data);
      setHorariosLivres(res.data);
    } catch (error) {
      alert('Erro ao consultar a disponibilidade da agenda.');
    }
  };

  const aplicarHorario = (h) => {
    setForm(prev => ({ ...prev, data_hora: `${form.data}T${h}` }));
  };

  const handleMultipleSelect = (e) => {
    const options = Array.from(e.target.selectedOptions, option => parseInt(option.value));
    setForm(prev => ({ ...prev, servicos: options }));
  };

  const salvarAgendamento = async (e) => {
  e.preventDefault();
  try {
    setMensagem('');
    const dadosParaEnviar = {
      cliente_id: form.cliente_id,
      barbeiro_id: form.barbeiro_id,
      data_hora: form.data_hora.replace('T', ' ') + ':00',
      servicos: form.servicos
    };

    if (idEdicao) {
      await axios.patch(`${API_BASE}/agendamentos/${idEdicao}`, dadosParaEnviar);
    } else {
      await axios.post(`${API_BASE}/agendamentos`, dadosParaEnviar);
    }

    setStatusErro(false);
    setMensagem("Agendamento reservado com sucesso!");
    limparForm();
    carregarDados();

    setTimeout(() => {
      setMensagem('');
    }, 4000);
  } catch (error) {
    setStatusErro(true);
    const erroServidor = error.response?.data?.mensagem || error.response?.data?.message || "";

    if (erroServidor.includes("must be a date after now")) {
      setMensagem("Este horário acabou de passar. Por favor, volte ao Passo 2 e escolha um horário futuro.");
    } else {
      setMensagem(erroServidor || "Ocorreu um erro ao processar o agendamento.");
    }

    setTimeout(() => {
      setMensagem('');
    }, 6000);
  }
};

  const prepararEdicao = (a) => {
    setIdEdicao(a.id);
    const dataCrua = a.data_hora ? a.data_hora.substring(0, 10) : '';
    const dataHoraFormatada = a.data_hora ? a.data_hora.substring(0, 16).replace(' ', 'T') : '';

    setForm({
      cliente_id: a.cliente_id,
      barbeiro_id: a.barbeiro_id,
      data: dataCrua,
      data_hora: dataHoraFormatada,
      servicos: a.servicos.map(s => s.id)
    });
    setPassoAtual(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const limparForm = () => {
    setIdEdicao(null);
    setForm({ cliente_id: '', barbeiro_id: '', data: '', data_hora: '', servicos: [] });
    setHorariosLivres([]);
    setPassoAtual(1);
  };

  const cancelar = async (id) => {
    if (window.confirm('Deseja realmente cancelar este horário?')) {
      await axios.delete(`${API_BASE}/agendamentos/${id}`);
      carregarDados();
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto p-2">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Painel de Agendamentos</h2>
        <p className="text-sm text-slate-500">Agendamento inteligente em etapas dinâmicas integradas ao banco.</p>
      </div>

      {mensagem && (
        <div className={`${statusErro ? 'bg-red-50 text-red-700 border-red-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'} p-4 rounded-xl border text-sm font-medium transition-all`}>
          {mensagem}
        </div>
      )}

      <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm flex justify-between items-center">
        {[
          { step: 1, label: "Profissional & Serviço" },
          { step: 2, label: "Data & Horário" },
          { step: 3, label: "Confirmação" }
        ].map((item) => (
          <div key={item.step} className="flex items-center space-x-2">
            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${passoAtual >= item.step ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'}`}>
              {item.step}
            </span>
            <span className={`text-xs font-semibold hidden sm:inline ${passoAtual === item.step ? 'text-slate-900' : 'text-slate-400'}`}>
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* FORMULÁRIO MULTI STEP CONCENTRADO */}
      <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            {idEdicao ? 'Editar Registro' : 'Nova Reserva'} — Passo {passoAtual} de 3
          </h3>
        </div>

        <form onSubmit={salvarAgendamento} className="space-y-4">
          {passoAtual === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  1. Escolha o Profissional
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {barbeiros.map(b => {
                    const isSelected = parseInt(form.barbeiro_id) === b.id;
                    return (
                      <div
                        key={b.id}
                        onClick={() => setForm({ ...form, barbeiro_id: b.id })}
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all shadow-sm bg-white hover:border-slate-400 ${
                          isSelected ? 'border-slate-900 ring-2 ring-slate-900/10' : 'border-slate-200'
                        }`}
                      >

                        <img
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(b.nome)}&background=0f172a&color=fff&rounded=true&size=128`}
                          alt={b.nome}
                          className="w-12 h-12 rounded-full border border-slate-100 object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-900 truncate">{b.nome}</p>
                          <p className="text-xs text-slate-400">Profissional Ativo</p>
                        </div>

                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'bg-slate-900 border-slate-900' : 'border-slate-300'}`}>
                          {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  2. Selecione os Serviços (Pode escolher vários)
                </label>
                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {servicos.map(s => {
                    const isSelected = form.servicos.includes(s.id);

                    const toggleServico = () => {
                      if (isSelected) {
                        setForm({ ...form, servicos: form.servicos.filter(id => id !== s.id) });
                      } else {
                        setForm({ ...form, servicos: [...form.servicos, s.id] });
                      }
                    };

                    return (
                      <div
                        key={s.id}
                        onClick={toggleServico}
                        className={`flex items-center gap-4 p-3 rounded-xl border cursor-pointer transition-all bg-white hover:border-slate-400 ${
                          isSelected ? 'border-slate-900 ring-2 ring-slate-900/10 bg-slate-50/30' : 'border-slate-200'
                        }`}
                      >

                        <img
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(s.nome)}&background=f1f5f9&color=475569&bold=true&rounded=true`}
                          alt={s.nome}
                          className="w-10 h-10 rounded-xl border border-slate-100 object-cover"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-slate-900">{s.nome}</p>
                          <p className="text-xs text-slate-500 font-medium">⏱️ {s.duracao_minutos} minutos</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-emerald-600">R$ {parseFloat(s.preco).toFixed(2)}</p>
                        </div>

                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-slate-900 border-slate-900 text-white' : 'border-slate-300'}`}>
                          {isSelected && (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-2.5 h-2.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setPassoAtual(2)}
                  disabled={!form.barbeiro_id || form.servicos.length === 0}
                  className={styles.btnPrimary}
                >
                  Avançar para Calendário →
                </button>
              </div>
            </div>
          )}

          {passoAtual === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  3. Selecione a Data do Atendimento
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="date"
                    value={form.data}
                    min={new Date().toLocaleDateString('en-CA')}
                    maxLength="10"
                    onChange={e => {
                      setForm({ ...form, data: e.target.value, data_hora: '' });
                      setHorariosLivres([]);
                    }}
                    className={styles.input + " flex-1"}
                    required
                  />

                  <button
                    type="button"
                    onClick={() => {
                      const hojeLocal = new Date().toLocaleDateString('en-CA');

                      if (form.data < hojeLocal) {
                        alert('Não é possível consultar uma data anterior a hoje!');
                        setForm({ ...form, data: '', data_hora: '' });
                        setHorariosLivres([]);
                        return;
                      }

                      consultarHorariosDisponiveis();
                    }}
                    disabled={!form.data || form.data.length !== 10}
                    className="bg-slate-800 text-white text-xs font-semibold px-4 h-10 rounded-lg hover:bg-slate-700 transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-slate-800"
                  >
                    🔍 Buscar Horários
                  </button>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Horários Livres Encontrados:
                </h4>

                {form.data && form.data.length === 10 && horariosLivres.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {horariosLivres
                      .filter(h => {
                        const horarioFormatado = h.length === 5 ? `${h}:00` : h;
                        return horarioFormatado >= HORARIO_ABERTURA && horarioFormatado <= HORARIO_FECHAMENTO;
                      })
                      .filter(h => {
                        const hojeLocal = new Date().toLocaleDateString('en-CA');
                        if (form.data !== hojeLocal) return true;

                        const agora = new Date();
                        const horaAtual = String(agora.getHours()).padStart(2, '0');
                        const minutoAtual = String(agora.getMinutes()).padStart(2, '0');
                        const relogioAgora = `${horaAtual}:${minutoAtual}`;

                        return h > relogioAgora;
                      })
                      .map(h => {
                        const slotString = `${form.data}T${h}`;
                        const isActive = form.data_hora === slotString;
                        return (
                          <button
                            type="button"
                            key={h}
                            onClick={() => aplicarHorario(h)}
                            className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all shadow-sm ${
                              isActive
                                ? 'bg-slate-900 border-slate-900 text-white ring-2 ring-slate-900/10'
                                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-400'
                            }`}
                          >
                            {h}
                          </button>
                        );
                      })
                    }
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">
                    {form.data && form.data.length === 10
                      ? 'Data preenchida. Clique em "Buscar Horários" para varrer o banco.'
                      : 'Preencha a data completa (dia, mês e ano) para liberar a busca.'}
                  </p>
                )}
              </div>

              <div className="pt-2 flex justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setPassoAtual(1);
                    setHorariosLivres([]);
                  }}
                  className={styles.btnSecondary}
                >
                  ← Voltar
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const hojeLocal = new Date().toLocaleDateString('en-CA');
                    if (!form.data || form.data < hojeLocal || !form.data_hora) {
                      alert('Selecione uma data válida e escolha um dos horários disponíveis antes de avançar!');
                      return;
                    }
                    setPassoAtual(3);
                  }}
                  disabled={!form.data || form.data.length !== 10 || !form.data_hora}
                  className={styles.btnPrimary}
                >
                  Avançar para Identificação →
                </button>
              </div>
            </div>
          )}

          {passoAtual === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">4. Quem é o Cliente Solicitante?</label>
                <select value={form.cliente_id} onChange={e => setForm({...form, cliente_id: e.target.value})} className={styles.input} required>
                  <option value="">Selecione o cliente...</option>
                  {clientes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                </select>
              </div>

              <div className="bg-slate-900 text-slate-100 p-4 rounded-xl space-y-2 text-xs shadow-inner">
                <p className="font-bold uppercase text-slate-400 tracking-wider text-[10px]">Resumo do Atendimento</p>
                <p><span className="text-slate-400">Profissional:</span> {getBarbeiroNome(parseInt(form.barbeiro_id))}</p>
                <p><span className="text-slate-400">Data e Hora:</span> {form.data_hora.replace('T', ' às ')}</p>
                <p><span className="text-slate-400">Serviços:</span> {form.servicos.map(id => servicos.find(s => s.id === id)?.nome).join(', ')}</p>
              </div>

              <div className="pt-2 flex justify-between gap-2">
                <button type="button" onClick={() => setPassoAtual(2)} className={styles.btnSecondary}>← Voltar</button>
                <button type="submit" disabled={!form.cliente_id} className={styles.btnPrimary + " flex-1"}>
                  {idEdicao ? 'Confirmar Alteração' : 'Finalizar Agendamento 💈'}
                </button>
                {idEdicao && <button type="button" onClick={limparForm} className="bg-red-500 text-white rounded-lg px-3 text-xs">Cancelar Edição</button>}
              </div>
            </div>
          )}
        </form>
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
              {agendamentos.map(a => {
                const dataAgendamento = new Date(a.data_hora.replace(' ', 'T'));
                const agora = new Date();
                const jaPassou = dataAgendamento < agora;

                return (
                  <tr key={a.id} className={`transition-colors ${jaPassou ? 'bg-slate-50/40 text-slate-400' : 'hover:bg-slate-50/50'}`}>
                    <td className="p-4 font-mono font-medium text-slate-400">#{a.id}</td>
                    <td className={`p-4 font-medium ${jaPassou ? 'text-slate-400' : 'text-slate-900'}`}>
                      {getClienteNome(a.cliente_id)}
                    </td>
                    <td className="p-4">{getBarbeiroNome(a.barbeiro_id)}</td>
                    <td className="p-4 font-mono text-xs">
                      {(() => {
                        const dataObj = new Date(a.data_hora.replace(' ', 'T'));

                        const dataFormatada = dataObj.toLocaleDateString('pt-BR');

                        const horaFormatada = dataObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

                        return (
                          <div className="flex flex-col">
                            <span className="text-slate-900">{dataFormatada} {horaFormatada}</span>
                          </div>
                        );
                      })()}
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {a.servicos?.map(s => (
                          <span
                            key={s.id}
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              jaPassou ? 'bg-slate-100/70 text-slate-400' : 'bg-slate-100 text-slate-800'
                            }`}
                          >
                            {s.nome}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="p-4 text-right space-x-1 whitespace-nowrap">
                      {jaPassou ? (
                        <span className="text-xs font-medium text-slate-400 italic px-2.5 py-1.5 inline-block">
                          Concluído / Passado
                        </span>
                      ) : (
                        <>
                          <button
                            onClick={() => prepararEdicao(a)}
                            className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-2.5 py-1.5 rounded-md hover:bg-slate-100 transition-colors"
                          >
                            Alterar
                          </button>
                          <button
                            onClick={() => cancelar(a.id)}
                            className="text-xs font-semibold text-red-600 hover:text-red-700 px-2.5 py-1.5 rounded-md hover:bg-red-50 transition-colors"
                          >
                            Cancelar
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}

              {agendamentos.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-400 bg-slate-50/20">
                    Nenhum horário marcado no sistema.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}