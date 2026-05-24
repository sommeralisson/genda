<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-lg font-bold text-slate-900">{{ idEdicao ? 'Alterar Serviço' : 'Adicionar Novo Serviço' }}</h2>
      <p class="text-sm text-slate-500">Configure os preços e o tempo estimado de cada procedimento do catálogo.</p>
    </div>

    <form @submit.prevent="salvar" class="grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100 items-end">
      <div>
        <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Nome do Procedimento</label>
        <input v-model="form.nome" placeholder="Ex: Corte + Barba" class="form-input" required />
      </div>
      <div>
        <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Preço Cobrado</label>
        <input v-model.number="form.preco" type="number" step="0.01" placeholder="R$ 0,00" class="form-input" required />
      </div>
      <div>
        <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Tempo Mínimo (Minutos)</label>
        <input v-model.number="form.duracao_minutos" type="number" placeholder="Ex: 45" class="form-input" required />
      </div>
      <div class="flex gap-2">
        <button type="submit" class="btn-primary w-full">Salvar</button>
        <button v-if="idEdicao" type="button" @click="limparForm" class="btn-secondary">Cancelar</button>
      </div>
    </form>

    <div class="overflow-x-auto rounded-xl border border-slate-100 shadow-sm bg-white">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <th class="p-4 w-16">ID</th>
            <th class="p-4">Procedimento</th>
            <th class="p-4">Preço</th>
            <th class="p-4">Duração</th>
            <th class="p-4 text-right">Ações</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 text-sm text-slate-700">
          <tr v-for="s in servicos" :key="s.id" class="hover:bg-slate-50/50 transition-colors">
            <td class="p-4 font-mono font-medium text-slate-400">#{{ s.id }}</td>
            <td class="p-4 font-medium text-slate-900">{{ s.nome }}</td>
            <td class="p-4 font-mono text-emerald-600 font-semibold">R$ {{ s.preco }}</td>
            <td class="p-4 text-slate-500">{{ s.duracao_minutos }} minutos</td>
            <td class="p-4 text-right space-x-2">
              <button @click="prepararEdicao(s)" class="text-xs font-semibold text-slate-600 hover:text-slate-900 px-2.5 py-1.5 rounded-md hover:bg-slate-100 transition-colors">Alterar</button>
              <button @click="excluir(s.id)" class="text-xs font-semibold text-red-600 hover:text-red-700 px-2.5 py-1.5 rounded-md hover:bg-red-50 transition-colors">Remover</button>
            </td>
          </tr>
          <tr v-if="servicos.length === 0">
            <td colspan="5" class="p-8 text-center text-slate-400 bg-slate-50/20">Nenhum procedimento no catálogo.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const API = 'http://localhost:8000/api/servicos'
const servicos = ref([])
const idEdicao = ref(null)
const form = ref({ nome: '', preco: '', duracao_minutos: '' })

const listar = async () => { const res = await axios.get(API); servicos.value = res.data }
onMounted(listar)

const salvar = async () => {
  idEdicao.value ? await axios.put(`${API}/${idEdicao.value}`, form.value) : await axios.post(API, form.value)
  limparForm(); listar()
}
const prepararEdicao = (s) => { idEdicao.value = s.id; form.value = { nome: s.nome, preco: s.preco, duracao_minutos: s.duracao_minutos } }
const limparForm = () => { idEdicao.value = null; form.value = { nome: '', preco: '', duracao_minutos: '' } }
const excluir = async (id) => { if(confirm('Remover serviço?')) { await axios.delete(`${API}/${id}`); listar() } }
</script>

<style scoped>
@import "tailwindcss";
.form-input { @apply w-full bg-white border border-slate-200 rounded-lg p-2 text-sm focus:outline-none focus:border-slate-900 transition-colors placeholder:text-slate-400; }
.btn-primary { @apply bg-slate-900 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap; }
.btn-secondary { @apply bg-slate-200 text-slate-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-300 transition-colors; }
</style>