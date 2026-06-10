import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:8000/api/clientes';

const styles = {
  input: "w-full bg-white border border-slate-200 rounded-lg p-2 text-sm h-10 focus:outline-none focus:border-slate-900 transition-colors placeholder:text-slate-400",
  btnPrimary: "bg-slate-900 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap h-10 flex items-center justify-center",
  btnSecondary: "bg-slate-200 text-slate-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-300 transition-colors h-10 flex items-center justify-center"
};

export default function ClienteView() {
  const [clientes, setClientes] = useState([]);
  const [idEdicao, setIdEdicao] = useState(null);
  const [form, setForm] = useState({ nome: '', telefone: '' });

  const listar = async () => {
    const res = await axios.get(API);
    setClientes(res.data);
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

  const prepararEdicao = (c) => {
    setIdEdicao(c.id);
    setForm({ nome: c.nome, telefone: c.telefone });
  };

  const limparForm = () => {
    setIdEdicao(null);
    setForm({ nome: '', telefone: '' });
  };

  const excluir = async (id) => {
    if (window.confirm('Excluir cliente?')) {
      await axios.delete(`${API}/${id}`);
      listar();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900">{idEdicao ? 'Alterar Cliente' : 'Cadastrar Novo Cliente'}</h2>
        <p className="text-sm text-slate-500">Adicione ou modifique os dados dos clientes da barbearia.</p>
      </div>

      <form onSubmit={salvar} className="flex flex-col md:flex-row gap-3 items-end bg-slate-50 p-4 rounded-xl border border-slate-100">
        <div className="w-full md:w-1/3">
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Nome Completo</label>
          <input value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} type="text" placeholder="Ex: João Silva" className={styles.input} required />
        </div>
        <div className="w-full md:w-1/3">
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Telefone / WhatsApp</label>
          <input value={form.telefone} onChange={e => setForm({...form, telefone: e.target.value})} type="text" placeholder="Ex: (47) 99999-9999" className={styles.input} required />
        </div>
        <div className="flex gap-2 w-full md:w-auto mt-2 md:mt-0">
          <button type="submit" className={styles.btnPrimary + " w-full md:w-auto"}>Salvar</button>
          {idEdicao && <button type="button" onClick={limparForm} className={styles.btnSecondary}>Cancelar</button>}
        </div>
      </form>

      <div className="overflow-x-auto rounded-xl border border-slate-100 shadow-sm bg-white">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <th className="p-4 w-16">ID</th>
              <th className="p-4">Nome</th>
              <th className="p-4">Telefone</th>
              <th className="p-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
            {clientes.map(c => (
              <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-4 font-mono font-medium text-slate-400">#{c.id}</td>
                <td className="p-4 font-medium text-slate-900">{c.nome}</td>
                <td className="p-4 text-slate-500">{c.telefone}</td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => prepararEdicao(c)} className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-2.5 py-1.5 rounded-md hover:bg-slate-100 transition-colors">Alterar</button>
                  <button onClick={() => excluir(c.id)} className="text-xs font-semibold text-red-600 hover:text-red-700 px-2.5 py-1.5 rounded-md hover:bg-red-50 transition-colors">Excluir</button>
                </td>
              </tr>
            ))}
            {clientes.length === 0 && (
              <tr><td colSpan="4" className="p-8 text-center text-slate-400 bg-slate-50/20">Nenhum cliente cadastrado ainda.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}