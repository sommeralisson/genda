<template>
  <div class="space-y-8">
    <div>
      <h2 class="text-lg font-bold text-slate-900">Painel de Agendamentos</h2>
      <p class="text-sm text-slate-500">Consulte janelas de horários livres e gerencie os agendamentos da barbearia.</p>
    </div>

    <Transition name="fade">
      <div v-if="mensagem" :class="[statusErro ? 'bg-red-50 text-red-700 border-red-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200', 'p-4 rounded-xl border text-sm font-medium transition-all']">
        {{ mensagem }}
      </div>
    </Transition>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

      <div class="bg-slate-50 p-5 rounded-xl border border-slate-100 space-y-4">
        <div>
          <h3 class="text-sm font-bold text-slate-800 uppercase tracking-wider">1. Consultar Horários Livres</h3>
          <p class="text-xs text-slate-500">Selecione os dados para o algoritmo varrer a agenda.</p>
        </div>

        <div class="space-y-3">
          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">Selecione o Barbeiro</label>
            <select v-model="busca.barbeiro_id" class="form-input">
              <option v-for="b in barbeiros" :value="b.id" :key="b.id">{{ b.nome }}</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">Data da Consulta</label>
            <input type="date" v-model="busca.data" class="form-input" />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">Serviços Desejados (Segure Ctrl para múltiplos)</label>
            <select v-model="busca.servicos" multiple size="4" class="form-input-multiple">
              <option v-for="s in servicos" :value="s.id" :key="s.id">{{ s.nome }} ({{ s.duracao_minutos }} min)</option>
            </select>
          </div>

          <button @click="consultarHorarios" class="btn-secondary w-full justify-center">Verificar Disponibilidade</button>
        </div>

        <div class="pt-2 border-t border-slate-200/60">
          <h4 class="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Horários Livres no Dia:</h4>
          <div v-if="horariosLivres.length > 0" class="flex flex-wrap gap-1.5">
            <button v-for="h in horariosLivres" :key="h" @click="aplicarHorario(h)" class="text-xs font-semibold bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg hover:border-slate-900 hover:bg-slate-900 hover:text-white transition-all shadow-sm">
              {{ h }}
            </button>
          </div>
          <p v-else class="text-xs text-slate-400 italic">Nenhum horário consultado ou vago para esta combinação.</p>
        </div>
      </div>

      <div class="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm space-y-4">
        <div>
          <h3 class="text-sm font-bold text-slate-800 uppercase tracking-wider">
            2. {{ idEdicao ? 'Remarcar / Atualizar Horário' : 'Novo Agendamento' }}
          </h3>
          <p class="text-xs text-slate-500">Confirme a reserva injetando os dados diretamente no banco.</p>
        </div>

        <form @submit.prevent="salvarAgendamento" class="space-y-3">
          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">Cliente Solicitante</label>
            <select v-model="form.cliente_id" class="form-input" required>
              <option v-for="c in clientes" :value="c.id" :key="c.id">{{ c.nome }}</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">Profissional Escolhido</label>
            <select v-model="form.barbeiro_id" class="form-input" required>
              <option v-for="b in barbeiros" :value="b.id" :key="b.id">{{ b.nome }}</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">Data e Hora de Início</label>
            <input v-model="form.data_hora" placeholder="YYYY-MM-DD HH:MM:SS" class="form-input font-mono" required />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">Confirmar Serviços (Segure Ctrl para múltiplos)</label>
            <select v-model="form.servicos" multiple size="4" class="form-input-multiple" required>
              <option v-for="s in servicos" :value="s.id" :key="s.id">{{ s.nome }}</option>
            </select>
          </div>

          <div class="flex gap-2 pt-2">
            <button type="submit" class="btn-primary flex-1 justify-center">Confirmar Agendamento</button>
            <button v-if="idEdicao" type="button" @click="limparForm" class="btn-secondary">Cancelar</button>
          </div>
        </form>
      </div>

    </div>

    <div class="space-y-3">
      <h3 class="text-sm font-bold text-slate-800 uppercase tracking-wider">Agendamentos Ativos</h3>

      <div class="overflow-x-auto rounded-xl border border-slate-100 shadow-sm bg-white">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <th class="p-4 w-12">ID</th>
              <th class="p-4">Cliente</th>
              <th class="p-4">Barbeiro</th>
              <th class="p-4">Data / Hora Marcada</th>
              <th class="p-4">Serviços Inclusos</th>
              <th class="p-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-sm text-slate-700">
            <tr v-for="a in agendamentos" :key="a.id" class="hover:bg-slate-50/50 transition-colors">
              <td class="p-4 font-mono font-medium text-slate-400">#{{ a.id }}</td>
              <td class="p-4 font-medium text-slate-900">ID: {{ a.cliente_id }}</td>
              <td class="p-4 text-slate-600">ID: {{ a.barbeiro_id }}</td>
              <td class="p-4 font-mono text-xs text-slate-600">{{ a.data_hora }}</td>
              <td class="p-4">
                <div class="flex flex-wrap gap-1">
                  <span v-for="s in a.servicos" :key="s.id" class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                    {{ s.nome }}
                  </span>
                </div>
              </td>
              <td class="p-4 text-right space-x-1 whitespace-nowrap">
                <button @click="prepararEdicao(a)" class="text-xs font-semibold text-slate-600 hover:text-slate-900 px-2.5 py-1.5 rounded-md hover:bg-slate-100 transition-colors">Alterar</button>
                <button @click="cancelar(a.id)" class="text-xs font-semibold text-red-600 hover:text-red-700 px-2.5 py-1.5 rounded-md hover:bg-red-50 transition-colors">Cancelar</button>
              </td>
            </tr>
            <tr v-if="agendamentos.length === 0">
              <td colspan="6" class="p-8 text-center text-slate-400 bg-slate-50/20">Nenhum horário marcado no sistema.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const API_BASE = 'http://localhost:8000/api'

const agendamentos = ref([])
const clientes = ref([])
const barbeiros = ref([])
const servicos = ref([])
const horariosLivres = ref([])

const idEdicao = ref(null)
const mensagem = ref('')
const statusErro = ref(false)

const busca = ref({ barbeiro_id: '', data: '', servicos: [] })
const form = ref({ cliente_id: '', barbeiro_id: '', data_hora: '', servicos: [] })

const carregarDados = async () => {
  const [agend, cli, barb, serv] = await Promise.all([
    axios.get(`${API_BASE}/agendamentos`),
    axios.get(`${API_BASE}/clientes`),
    axios.get(`${API_BASE}/barbeiros`),
    axios.get(`${API_BASE}/servicos`)
  ])
  agendamentos.value = agend.data
  clientes.value = cli.data
  barbeiros.value = barb.data
  servicos.value = serv.data
}
onMounted(carregarDados)

const consultarHorarios = async () => {
  if (!busca.value.data || busca.value.servicos.length === 0) return alert('Selecione data e serviços!')
  let query = `barbeiro_id=${busca.value.barbeiro_id}&data=${busca.value.data}`
  busca.value.servicos.forEach(id => query += `&servicos[]=${id}`)

  const res = await axios.get(`${API_BASE}/agendamentos/disponibilidade?${query}`)
  horariosLivres.value = res.data
}

const aplicarHorario = (h) => { form.value.data_hora = `${busca.value.data} ${h}:00` }

const salvarAgendamento = async () => {
  try {
    mensagem.value = ''
    if (idEdicao.value) {
      await axios.patch(`${API_BASE}/agendamentos/${idEdicao.value}`, form.value)
    } else {
      await axios.post(`${API_BASE}/agendamentos`, form.value)
    }
    statusErro.value = false
    mensagem.value = "Agendamento salvo com sucesso!"
    limparForm(); carregarDados()
  } catch (error) {
    statusErro.value = true
    mensagem.value = error.response.data.mensagem || error.response.data.message
  }
}

const prepararEdicao = (a) => {
  idEdicao.value = a.id
  form.value = {
    cliente_id: a.cliente_id,
    barbeiro_id: a.barbeiro_id,
    data_hora: a.data_hora,
    servicos: a.servicos.map(s => s.id)
  }
}

const limparForm = () => { idEdicao.value = null; form.value = { cliente_id: '', barbeiro_id: '', data_hora: '', servicos: [] } }

const cancelar = async (id) => {
  if (confirm('Deseja realmente cancelar este horário?')) {
    await axios.delete(`${API_BASE}/agendamentos/${id}`)
    carregarDados()
  }
}
</script>

<style scoped>
@import "tailwindcss";

/* Componentes de Estilo Reaproveitados com Tailwind v4 */
.form-input {
  @apply w-full bg-white border border-slate-200 rounded-lg p-2 text-sm focus:outline-none focus:border-slate-900 transition-colors h-10 appearance-none;
}
.form-input-multiple {
  @apply w-full bg-white border border-slate-200 rounded-lg p-2 text-sm focus:outline-none focus:border-slate-900 transition-colors;
}
.btn-primary {
  @apply inline-flex items-center bg-slate-900 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap h-10;
}
.btn-secondary {
  @apply inline-flex items-center bg-slate-100 text-slate-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-200 border border-slate-200/40 transition-colors h-10;
}
</style>