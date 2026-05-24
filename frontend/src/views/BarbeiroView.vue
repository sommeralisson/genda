<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-lg font-bold text-slate-900">{{ idEdicao ? 'Alterar Barbeiro' : 'Cadastrar Novo Barbeiro' }}</h2>
      <p class="text-sm text-slate-500">Gerencie a equipe de profissionais ativos na casa.</p>
    </div>

    <form @submit.prevent="salvar" class="flex flex-col md:flex-row gap-3 items-end bg-slate-50 p-4 rounded-xl border border-slate-100">
      <div class="w-full md:max-w-md">
        <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Nome do Profissional</label>
        <input v-model="form.nome" type="text" placeholder="Ex: Barbeiro Kennedy" class="form-input" required />
      </div>
      <div class="flex gap-2 w-full md:w-auto mt-2 md:mt-0">
        <button type="submit" class="btn-primary w-full md:w-auto">Salvar</button>
        <button v-if="idEdicao" type="button" @click="limparForm" class="btn-secondary">Cancelar</button>
      </div>
    </form>

    <div class="overflow-x-auto rounded-xl border border-slate-100 shadow-sm bg-white">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <th class="p-4 w-16">ID</th>
            <th class="p-4">Nome Profissional</th>
            <th class="p-4 text-right">Ações</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 text-sm text-slate-700">
          <tr v-for="b in barbeiros" :key="b.id" class="hover:bg-slate-50/50 transition-colors">
            <td class="p-4 font-mono font-medium text-slate-400">#{{ b.id }}</td>
            <td class="p-4 font-medium text-slate-900">{{ b.nome }}</td>
            <td class="p-4 text-right space-x-2">
              <button @click="prepararEdicao(b)" class="text-xs font-semibold text-slate-600 hover:text-slate-900 px-2.5 py-1.5 rounded-md hover:bg-slate-100 transition-colors">Alterar</button>
              <button @click="excluir(b.id)" class="text-xs font-semibold text-red-600 hover:text-red-700 px-2.5 py-1.5 rounded-md hover:bg-red-50 transition-colors">Remover</button>
            </td>
          </tr>
          <tr v-if="barbeiros.length === 0">
            <td colspan="3" class="p-8 text-center text-slate-400 bg-slate-50/20">Nenhum barbeiro adicionado.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const API = 'http://localhost:8000/api/barbeiros'
const barbeiros = ref([])
const idEdicao = ref(null)
const form = ref({ nome: '' })

const listar = async () => { const res = await axios.get(API); barbeiros.value = res.data }
onMounted(listar)

const salvar = async () => {
  idEdicao.value ? await axios.put(`${API}/${idEdicao.value}`, form.value) : await axios.post(API, form.value)
  limparForm(); listar()
}
const prepararEdicao = (b) => { idEdicao.value = b.id; form.value.nome = b.nome }
const limparForm = () => { idEdicao.value = null; form.value.nome = '' }
const excluir = async (id) => { if(confirm('Remover profissional?')) { await axios.delete(`${API}/${id}`); listar() } }
</script>

<style scoped>
@import "tailwindcss";
.form-input { @apply w-full bg-white border border-slate-200 rounded-lg p-2 text-sm focus:outline-none focus:border-slate-900 transition-colors placeholder:text-slate-400; }
.btn-primary { @apply bg-slate-900 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap; }
.btn-secondary { @apply bg-slate-200 text-slate-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-300 transition-colors; }
</style>