import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:8000/api/servicos';

const styles = {
  input: "w-full bg-white border border-slate-200 rounded-lg p-2 text-sm h-10 focus:outline-none focus:border-slate-900 transition-colors placeholder:text-slate-400",
  btnPrimary: "bg-slate-900 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap h-10 flex items-center justify-center",
  btnSecondary: "bg-slate-200 text-slate-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-300 transition-colors h-10 flex items-center justify-center"
};

export default function ServicoView() {
  const [servicos, setServicos] = useState([]);
  const [idEdicao, setIdEdicao] = useState(null);
  const [form, setForm] = useState({ nome: '', preco: '', duracao_minutos: '' });
  const [mensagem, setMensagem] = useState('');
  const [statusErro, setStatusErro] = useState(false);

  const listar = async () => {
    const res = await axios.get(API);
    setServicos(res.data);
  };

  useEffect(() => { listar(); }, []);

  const salvar = async (e) => {
    e.preventDefault();
    if (idEdicao) {
      await axios.put(`${API}/${idEdicao}`, form);
    } else {
      await axios.post(API, form);
    }
    limparForm();
    listar();
  };

  const prepararEdicao = (s) => {
    setIdEdicao(s.id);
    setForm({ nome: s.nome, preco: s.preco, duracao_minutos: s.duracao_minutos });
  };

  const limparForm = () => {
    setIdEdicao(null);
    setForm({ nome: '', preco: '', duracao_minutos: '' });
  };

  const excluir = async (id) => {
    if (!confirm('Deseja realmente remover este serviço da barbearia?')) return;

    try {
      setMensagem('');
      setStatusErro(false);

      await axios.delete(`${API}/${id}`);

      setStatusErro(false);
      setMensagem('Serviço excluído com sucesso!');
      listar();

      setTimeout(() => setMensagem(''), 4000);
    } catch (error) {
      setStatusErro(true);

      const msg = error.response?.data?.message || 'Erro ao tentar remover o serviço.';
      setMensagem(msg);

      setTimeout(() => setMensagem(''), 6000);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900">{idEdicao ? 'Alterar Serviço' : 'Adicionar Novo Serviço'}</h2>
        <p className="text-sm text-slate-500">Configure os preços e o tempo estimado de cada procedimento do catálogo.</p>
      </div>

      {mensagem && (
        <div className={`p-4 rounded-xl border text-sm font-medium transition-all duration-300 ${
          statusErro ? 'bg-red-50 text-red-700 border-red-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
        }`}>
          {mensagem}
        </div>
      )}

      <form onSubmit={salvar} className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100 items-end">
        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Nome do Procedimento</label>
          <input value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} placeholder="Ex: Corte + Barba" className={styles.input} required />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Preço Cobrado</label>
          <input value={form.preco} onChange={e => setForm({...form, preco: parseFloat(e.target.value) || ''})} type="number" step="0.01" placeholder="R$ 0,00" className={styles.input} required />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Tempo Mínimo (Minutos)</label>
          <input value={form.duracao_minutos} onChange={e => setForm({...form, duracao_minutos: parseInt(e.target.value) || ''})} type="number" placeholder="Ex: 45" className={styles.input} required />
        </div>
        <div className="flex gap-2">
          <button type="submit" className={styles.btnPrimary + " w-full"}>Salvar</button>
          {idEdicao && <button type="button" onClick={limparForm} className={styles.btnSecondary}>Cancelar</button>}
        </div>
      </form>

      <div className="overflow-x-auto rounded-xl border border-slate-100 shadow-sm bg-white">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <th className="p-4 w-16">ID</th>
              <th className="p-4">Procedimento</th>
              <th className="p-4">Preço</th>
              <th className="p-4">Duração</th>
              <th className="p-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
            {servicos.map(s => (
              <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-4 font-mono font-medium text-slate-400">#{s.id}</td>
                <td className="p-4 font-medium text-slate-900">{s.nome}</td>
                <td className="p-4 font-mono text-emerald-600 font-semibold">R$ {s.preco}</td>
                <td className="p-4 text-slate-500">{s.duracao_minutos} minutos</td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => prepararEdicao(s)} className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-2.5 py-1.5 rounded-md hover:bg-slate-100 transition-colors">Alterar</button>
                  <button onClick={() => excluir(s.id)} className="text-xs font-semibold text-red-600 hover:text-red-700 px-2.5 py-1.5 rounded-md hover:bg-red-50 transition-colors">Remover</button>
                </td>
              </tr>
            ))}
            {servicos.length === 0 && (
              <tr><td colSpan="5" className="p-8 text-center text-slate-400 bg-slate-50/20">Nenhum procedimento no catálogo.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}