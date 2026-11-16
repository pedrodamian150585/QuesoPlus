<template>
  <div class="space-y-4">
    <!-- Breadcrumbs -->
    <nav aria-label="Ruta de navegación" class="flex items-center justify-between text-xs text-slate-400">
      <div class="flex items-center gap-2">
        <RouterLink to="/dashboard" class="hover:text-white">🏠 Inicio</RouterLink>
        <span>&gt;</span>
        <span class="text-slate-300">{{ section }}</span>
        <span>&gt;</span>
        <span class="text-white font-semibold">{{ title }}</span>
      </div>
      <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-500/15 text-red-300 border border-red-500/30">
        Módulo {{ code }}
      </span>
    </nav>

    <!-- Hero Banner Dark Premium -->
    <div class="qp-card relative overflow-hidden p-5 border border-red-500/25 bg-gradient-to-r from-[#1D060A] via-[#12080E] to-[#0A0D14] flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div class="flex items-center gap-4">
        <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#E11D2E] to-[#8C0310] flex items-center justify-center shadow-[0_0_20px_rgba(225,29,46,0.45)] shrink-0">
          <span class="text-2xl">{{ emoji }}</span>
        </div>
        <div>
          <h1 class="text-xl md:text-2xl font-bold text-white tracking-tight">{{ title }}</h1>
          <p class="text-xs text-slate-300 mt-0.5">{{ subtitle }}</p>
        </div>
      </div>
      <div class="flex items-center gap-2.5">
        <slot name="actions" />
      </div>
    </div>

    <!-- KPIs Row -->
    <div v-if="kpis && kpis.length" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <KpiStatCard
        v-for="(kpi, i) in kpis"
        :key="i"
        :title="kpi.title"
        :value="kpi.value"
        :delta="kpi.delta"
        :color="kpi.color || 'red'"
        :icon="kpi.icon || 'box'"
        compact
        :use-asset-icon="false"
      />
    </div>

    <!-- Main Module Content -->
    <slot />
  </div>
</template>

<script setup>
import KpiStatCard from './KpiStatCard.vue'

defineProps({
  code: { type: String, required: true },
  section: { type: String, default: 'Operaciones' },
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  emoji: { type: String, default: '📦' },
  kpis: { type: Array, default: () => [] }
})
</script>
