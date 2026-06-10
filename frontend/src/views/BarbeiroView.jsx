import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:8000/api/barbeiros';

// Classes utilitárias do Tailwind v4 padronizadas
const styles = {
  input: "w-full bg-white border border-slate-200 rounded-lg p-2 text-sm h-10 focus:outline-none focus:border-slate-900 transition-colors placeholder:text-slate-400",
  btnPrimary: "bg-slate-900 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap h-10 flex items-center justify-center",
  btnSecondary: "bg-slate-200 text-slate-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-300 transition-colors h-10 flex items-center justify-center"
};

export default function BarbeiroView() {
  const [barbeiros, setBarbeiros] = useState([]);
  const [idEdicao, setIdEdicao] = useState(null);
  const [nome, setNome] = useState('');

  const listar = async () => {
    const res = await axios.get(API);
    setBarbeiros(res.data);
  };

  useEffect(() => { listar(); }, []);

  const salvar = async (e) => {
    e.preventDefault();
    if (idEdicao) {
      await axios.put(`${API}/${idEdicao}`, { nome });
    } else {
      await axios.post(API, { nome });
    }
    limparForm();
    listar();
  };

  const prepararEdicao = (b) => {
    setIdEdicao(b.id);
    setNome(b.nome);
  };

  const limparForm = () => {
    setIdEdicao(null);
    setNome('');
  };

  const excluir = async (id) => {
    if (window.confirm('Remover profissional?')) {
      await axios.delete(`${API}/${id}`);
      listar();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900">{idEdicao ? 'Alterar Barbeiro' : 'Cadastrar Novo Barbeiro'}</h2>
        <p className="text-sm text-slate-500">Gerencie a equipe de profissionais ativos na casa.</p>
      </div>

      <form onSubmit={salvar} className="flex flex-col md:flex-row gap-3 items-end bg-slate-50 p-4 rounded-xl border border-slate-100">
        <div className="w-full md:max-w-md">
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Nome do Profissional</label>
          <input value={nome} onChange={e => setNome(e.target.value)} type="text" placeholder="Ex: Barbeiro Kennedy" className={styles.input} required />
        </div>
        <div className="flex gap-2 w-full md:w-auto mt-2 md:mt-0">
          <button type="submit" className={styles.btnPrimary + " w-full md:w-auto"}>Salvar</button>
          {idEdicao && <button type="button" onClick={limparForm} className={styles.btnSecondary}>Cancelar</button>}
        </div>
      </form>

      <div className="overflow-x-auto rounded-xl border border-slate-100 shadow-sm bg-white">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <th className="p-4 w-16">ID</th>
              <th className="p-4">Nome Profissional</th>
              <th className="p-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
            {barbeiros.map(b => (
              <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-4 font-mono font-medium text-slate-400">#{b.id}</td>
                <td className="p-4 font-medium text-slate-900">{b.nome}</td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => prepararEdicao(b)} className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-2.5 py-1.5 rounded-md hover:bg-slate-100 transition-colors">Alterar</button>
                  <button onClick={() => excluir(b.id)} className="text-xs font-semibold text-red-600 hover:text-red-700 px-2.5 py-1.5 rounded-md hover:bg-red-50 transition-colors">Remover</button>
                </td>
              </tr>
            ))}
            {barbeiros.length === 0 && (
              <tr><td colSpan="3" className="p-8 text-center text-slate-400 bg-slate-50/20">Nenhum barbeiro adicionado.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}