<template>
  <div class="min-h-screen bg-slate-50 text-slate-800 antialiased font-sans p-6">

    <div class="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-slate-100 p-6">

      <header class="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4 mb-6">
        <h1 class="text-xl font-bold tracking-tight text-slate-900">Barbearia do Zé</h1>

        <nav class="flex gap-2 mt-4 sm:mt-0 text-sm font-medium">
          <RouterLink to="/" class="nav-link">Início</RouterLink>
          <RouterLink to="/clientes" class="nav-link">Clientes</RouterLink>
          <RouterLink to="/barbeiros" class="nav-link">Barbeiros</RouterLink>
          <RouterLink to="/servicos" class="nav-link">Serviços</RouterLink>
          <RouterLink to="/agendamentos" class="nav-link">Agendamentos</RouterLink>
        </nav>
      </header>

      <main>
        <RouterView />
      </main>

    </div>
  </div>
</template>

<style scoped>
/* Importa as referências de utilitários para o escopo deste componente no v4 */
@import "tailwindcss";

/* Classes reutilizáveis do Tailwind para deixar os links bonitos */
.nav-link {
  @apply px-3 py-1.5 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors;
}

/* Estilo para quando a rota do menu estiver ativa */
.router-link-exact-active {
  @apply bg-slate-900 text-white hover:bg-slate-900 hover:text-white;
}
</style>