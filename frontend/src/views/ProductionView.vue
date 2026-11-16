<template>
  <EnterpriseModuleShell
    code="7.8"
    section="Operaciones"
    title="Producción y Órdenes de Fabricación"
    subtitle="Planificación de lotes, consumo de materias primas, control de mermas y cierre hacia inventario de producto terminado"
    emoji="🏭"
    :kpis="kpis"
  >
    <template #actions>
      <button type="button" class="qp-btn-primary px-4 py-2.5 rounded-xl text-xs font-bold" @click="showModal = true">
        ➕ Nueva Orden de Producción
      </button>
    </template>

    <div class="qp-card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="bg-[#121622] text-slate-300 uppercase text-[11px]">
            <tr>
              <th class="p-3.5">Orden / Lote</th>
              <th class="p-3.5">Producto</th>
              <th class="p-3.5">Fórmula</th>
              <th class="p-3.5">Fecha y Turno</th>
              <th class="p-3.5">Meta Planificada</th>
              <th class="p-3.5">Unidades Producidas</th>
              <th class="p-3.5">Rendimiento</th>
              <th class="p-3.5">Calidad</th>
              <th class="p-3.5">Estado</th>
              <th class="p-3.5">Acción Operativa</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/10">
            <tr v-for="op in store.productionOrders" :key="op.id" class="hover:bg-white/[0.02]">
              <td class="p-3.5">
                <p class="font-bold text-white">{{ op.code }}</p>
                <p class="text-[11px] font-mono text-amber-400">{{ op.lotCode }}</p>
              </td>
              <td class="p-3.5 font-bold text-white">{{ op.productName }}</td>
              <td class="p-3.5 text-slate-300">{{ op.formulationCode }}</td>
              <td class="p-3.5 text-slate-300">
                <p>{{ op.plannedDate }}</p>
                <p class="text-[11px] text-slate-400">{{ op.shift }}</p>
              </td>
              <td class="p-3.5 font-semibold">{{ formatNumber(op.plannedUnits) }} und.</td>
              <td class="p-3.5 font-bold text-emerald-400">{{ formatNumber(op.producedUnits) }} und.</td>
              <td class="p-3.5">{{ op.yieldPct }}%</td>
              <td class="p-3.5">{{ op.qualityStatus }}</td>
              <td class="p-3.5">
                <span
                  class="px-2.5 py-0.5 rounded-full text-[11px] font-bold"
                  :class="
                    op.status === 'Completada'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-amber-500/20 text-amber-300'
                  "
                >
                  {{ op.status }}
                </span>
              </td>
              <td class="p-3.5">
                <button
                  v-if="op.status !== 'Completada'"
                  type="button"
                  class="qp-btn-primary px-3 py-1.5 rounded-lg text-xs font-bold"
                  @click="store.completeProductionOrder(op.id)"
                >
                  ✔ Cerrar y Enviar a Stock
                </button>
                <span v-else class="text-[11px] text-slate-400">En inventario PT</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <BaseModal v-model="showModal" title="Programar Nueva Orden de Producción">
      <form class="space-y-3" @submit.prevent="createProductionOrder">
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Producto a Fabricar *</label>
          <select
            v-model="draft.productId"
            class="w-full h-10 px-3 rounded-xl bg-[#11151F] border border-white/15 text-xs text-white"
          >
            <option v-for="p in store.products" :key="p.id" :value="p.id">{{ p.name }} ({{ p.code }})</option>
          </select>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">Unidades Planificadas *</label>
            <input
              v-model.number="draft.plannedUnits"
              type="number"
              min="100"
              required
              class="w-full h-10 px-3 rounded-xl bg-[#11151F] border border-white/15 text-xs text-white"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">Turno</label>
            <input
              v-model="draft.shift"
              type="text"
              class="w-full h-10 px-3 rounded-xl bg-[#11151F] border border-white/15 text-xs text-white"
            />
          </div>
        </div>
        <div class="flex justify-end gap-2">
          <button type="button" class="qp-btn-secondary px-4 py-2 rounded-xl text-xs" @click="showModal = false">Cancelar</button>
          <button type="submit" class="qp-btn-primary px-4 py-2 rounded-xl text-xs font-bold">Programar Orden</button>
        </div>
      </form>
    </BaseModal>
  </EnterpriseModuleShell>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useEnterpriseStore } from '../stores/useEnterpriseStore.js'
import { formatNumber } from '../utils/formatters.js'
import EnterpriseModuleShell from '../components/common/EnterpriseModuleShell.vue'
import BaseModal from '../components/common/BaseModal.vue'

const store = useEnterpriseStore()
const showModal = ref(false)
const draft = ref({ productId: 'PRD-01', plannedUnits: 3200, shift: 'Turno Mañana (06:00 - 14:00)' })

const kpis = computed(() => [
  { title: 'Órdenes Activas', value: store.productionOrders.length, delta: '+1 hoy', color: 'red', icon: 'box' },
  { title: 'Producción del Día', value: store.dashboard.kpis[0].value, delta: '+8.5%', color: 'green', icon: 'check-circle' },
  { title: 'Rendimiento Planta', value: '98.5%', delta: 'Óptimo', color: 'amber', icon: 'trending' },
  { title: 'Líneas Operativas', value: '2 / 2', delta: '100%', color: 'blue', icon: 'truck' }
])

function createProductionOrder() {
  const prod = store.products.find((p) => p.id === draft.value.productId) || store.products[0]
  store.addGenericRecord(
    'productionOrders',
    {
      id: `OP-0${store.productionOrders.length + 1}`,
      code: `OP-2026-087${3 + store.productionOrders.length}`,
      lotCode: `#L-2026-087${3 + store.productionOrders.length}`,
      productId: prod.id,
      productName: prod.name,
      formulationCode: 'REC-PQ-001',
      plannedDate: '2026-11-16',
      shift: draft.value.shift,
      line: 'Línea Automatizada 01',
      plannedUnits: draft.value.plannedUnits,
      producedUnits: 0,
      shrinkageUnits: 20,
      yieldPct: 100.0,
      totalRealCost: 2450000,
      status: 'En Proceso',
      qualityStatus: 'En Inspección'
    },
    'Producción'
  )
  showModal.value = false
}
</script>
