<template>
  <EnterpriseModuleShell
    code="7.21"
    section="Administración"
    title="Configuración Corporativa, Seguridad y Auditoría"
    subtitle="Parámetros de la empresa, gestión de usuarios, roles, permisos y bitácora inmutable de auditoría"
    emoji="⚙️"
    :kpis="kpis"
  >
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">
      <!-- Datos de la Empresa -->
      <div class="qp-card p-5 lg:col-span-5 space-y-3 text-xs">
        <h2 class="text-sm font-bold text-white">Datos Corporativos de QuesoPlus</h2>
        <div class="space-y-2">
          <div class="flex justify-between py-1.5 border-b border-white/10">
            <span class="text-slate-400">Razón Social:</span>
            <strong class="text-white">{{ store.settings.company.legalName }}</strong>
          </div>
          <div class="flex justify-between py-1.5 border-b border-white/10">
            <span class="text-slate-400">NIT:</span>
            <strong class="text-white">{{ store.settings.company.taxId }}</strong>
          </div>
          <div class="flex justify-between py-1.5 border-b border-white/10">
            <span class="text-slate-400">Planta Principal:</span>
            <strong class="text-white">{{ store.settings.company.plantAddress }}</strong>
          </div>
          <div class="flex justify-between py-1.5 border-b border-white/10">
            <span class="text-slate-400">Estándar Cadena de Frío:</span>
            <strong class="text-sky-400">{{ store.settings.company.coldChainStandard }}</strong>
          </div>
          <div class="flex justify-between py-1.5">
            <span class="text-slate-400">Moneda Oficial:</span>
            <strong class="text-amber-400">{{ store.settings.company.currency }}</strong>
          </div>
        </div>
      </div>

      <!-- Usuarios y Roles -->
      <div class="qp-card p-5 lg:col-span-7 space-y-3">
        <h2 class="text-sm font-bold text-white">Usuarios y Roles Activos (RBAC)</h2>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-[#121622] text-slate-300">
              <tr>
                <th class="p-2.5">Usuario</th>
                <th class="p-2.5">Rol</th>
                <th class="p-2.5">Área</th>
                <th class="p-2.5">Estado</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/10">
              <tr v-for="u in store.settings.users" :key="u.id">
                <td class="p-2.5">
                  <p class="font-bold text-white">{{ u.name }}</p>
                  <p class="text-[11px] text-slate-400">{{ u.email }}</p>
                </td>
                <td class="p-2.5 font-semibold text-amber-300">{{ u.role }}</td>
                <td class="p-2.5 text-slate-300">{{ u.area }}</td>
                <td class="p-2.5 text-emerald-400 font-bold">✔ {{ u.status }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Bitácora de Auditoría -->
    <div class="qp-card p-5 space-y-3">
      <h2 class="text-sm font-bold text-white">Bitácora de Auditoría de Operaciones</h2>
      <div class="space-y-2">
        <div
          v-for="log in store.settings.auditLogs"
          :key="log.id"
          class="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs"
        >
          <div>
            <span class="px-2 py-0.5 rounded bg-red-500/20 text-red-300 font-bold mr-2">{{ log.module }}</span>
            <strong class="text-white">{{ log.action }}</strong>
          </div>
          <div class="text-slate-400">
            <span>{{ log.user }}</span> · <span>{{ log.timestamp }}</span>
          </div>
        </div>
      </div>
    </div>
  </EnterpriseModuleShell>
</template>

<script setup>
import { computed } from 'vue'
import { useEnterpriseStore } from '../stores/useEnterpriseStore.js'
import EnterpriseModuleShell from '../components/common/EnterpriseModuleShell.vue'

const store = useEnterpriseStore()

const kpis = computed(() => [
  { title: 'Usuarios Activos', value: store.settings.users.length, delta: 'RBAC Activo', color: 'green', icon: 'check-circle' },
  { title: 'Eventos Auditados', value: store.settings.auditLogs.length, delta: 'En tiempo real', color: 'blue', icon: 'box' },
  { title: 'Módulos Integrados', value: '21 / 21', delta: '100% Operativos', color: 'red', icon: 'star' },
  { title: 'Modo Fuente Datos', value: 'Mock / API Ready', delta: 'PostgreSQL 17 Ready', color: 'purple', icon: 'truck' }
])
</script>
