import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'
import ClienteView from '../views/ClienteView.vue'
import BarbeiroView from '../views/BarbeiroView.vue'
import ServicoView from '../views/ServicoView.vue'
import AgendamentoView from '../views/AgendamentoView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'dashboard', component: DashboardView },
    { path: '/clientes', name: 'clientes', component: ClienteView },
    { path: '/barbeiros', name: 'barbeiros', component: BarbeiroView },
    { path: '/servicos', name: 'servicos', component: ServicoView },
    { path: '/agendamentos', name: 'agendamentos', component: AgendamentoView },
  ]
})

export default router