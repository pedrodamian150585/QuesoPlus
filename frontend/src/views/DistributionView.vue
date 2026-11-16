<template>
  <EnterpriseModuleShell
    code="7.19"
    section="Logística"
    title="Distribución, Rutas Refrigeradas y Entregas"
    subtitle="Seguimiento de despachos en cadena de frío, transportistas, pedidos asociados y confirmación de entregas"
    emoji="🚚"
    :kpis="kpis"
  >
    <div class="qp-card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="bg-[#121622] text-slate-300 uppercase text-[11px]">
            <tr>
              <th class="p-3.5">Despacho</th>
              <th class="p-3.5">Pedido Asociado</th>
              <th class="p-3.5">Cliente Destino</th>
              <th class="p-3.5">Ruta Comercial</th>
              <th class="p-3.5">Vehículo / Conductor</th>
              <th class="p-3.5">Temp. Furgón</th>
              <th class="p-3.5">Evidencia</th>
              <th class="p-3.5">Estado</th>
              <th class="p-3.5">Acción Logística</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/10">
            <tr v-for="dsp in store.dispatches" :key="dsp.id" class="hover:bg-white/[0.02]">
              <td class="p-3.5 font-bold text-white">{{ dsp.code }}</td>
              <td class="p-3.5 font-mono text-amber-300">{{ dsp.orderCode }}</td>
              <td class="p-3.5 font-semibold text-white">{{ dsp.customerName }}</td>
              <td class="p-3.5 text-slate-300">{{ dsp.route }}</td>
              <td class="p-3.5 text-slate-300">
                <p class="font-semibold text-white">{{ dsp.carrier }}</p>
                <p class="text-[11px] text-slate-400">Conductor: {{ dsp.driver }}</p>
              </td>
              <td class="p-3.5 font-bold text-sky-400">{{ dsp.temperature }}</td>
              <td class="p-3.5 text-slate-300">{{ dsp.evidence }}</td>
              <td class="p-3.5">
                <span
                  class="px-2.5 py-0.5 rounded-full text-[11px] font-bold"
                  :class="
                    dsp.status === 'Entregado'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : dsp.status === 'En Ruta'
                      ? 'bg-sky-500/20 text-sky-300'
                      : 'bg-amber-500/20 text-amber-300'
                  "
                >
                  {{ dsp.status }}
                </span>
              </td>
              <td class="p-3.5">
                <button
                  v-if="dsp.status !== 'Entregado'"
                  type="button"
                  class="qp-btn-primary px-3 py-1.5 rounded-lg text-xs font-bold"
                  @click="store.advanceDispatchStatus(dsp.id)"
                >
                  {{ dsp.status === 'Pendiente de Despacho' ? '🚚 Iniciar Ruta' : '✔ Confirmar Entrega' }}
                </button>
                <span v-else class="text-[11px] text-emerald-400 font-semibold">✔ Entrega Completada</span>
              </td>
            </tr>
          </tbody>
        </table>
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
  { title: 'Despachos Registrados', value: store.dispatches.length, delta: 'Cadena de frío', color: 'blue', icon: 'truck' },
  {
    title: 'En Ruta / Pendientes',
    value: store.dispatches.filter((d) => d.status !== 'Entregado').length,
    delta: 'Monitoreo GPS',
    color: 'amber',
    icon: 'box'
  },
  {
    title: 'Entregas Confirmadas',
    value: store.dispatches.filter((d) => d.status === 'Entregado').length,
    delta: 'Con guía firmada',
    color: 'green',
    icon: 'check-circle'
  },
  { title: 'Temp. Promedio Flota', value: '1.9 °C', delta: 'Óptima (0-4°C)', color: 'purple', icon: 'star' }
])
</script>
