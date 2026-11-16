<template>
  <EnterpriseModuleShell
    code="7.10"
    section="Operaciones"
    title="Inventarios Consolidados y Kardex"
    subtitle="Control de existencias de productos terminados, materias primas, reservas, lotes y movimientos de almacén"
    emoji="📦"
    :kpis="kpis"
  >
    <template #actions>
      <button type="button" class="qp-btn-primary px-4 py-2.5 rounded-xl text-xs font-bold" @click="showModal = true">
        ➕ Registrar Ajuste / Movimiento
      </button>
    </template>

    <div class="qp-card overflow-hidden">
      <div class="p-4 border-b border-white/10 flex items-center justify-between">
        <h2 class="text-sm font-bold text-white">Kardex de Movimientos de Inventario en Tiempo Real</h2>
        <span class="text-xs text-slate-400">Sincronizado con Compras, Producción y Pedidos</span>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="bg-[#121622] text-slate-300 uppercase text-[11px]">
            <tr>
              <th class="p-3.5">Código</th>
              <th class="p-3.5">Fecha y Hora</th>
              <th class="p-3.5">Tipo</th>
              <th class="p-3.5">Almacén</th>
              <th class="p-3.5">Ítem</th>
              <th class="p-3.5">Lote</th>
              <th class="p-3.5">Cantidad</th>
              <th class="p-3.5">Saldo Posterior</th>
              <th class="p-3.5">Documento Origen</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/10">
            <tr v-for="mov in store.inventoryMovements" :key="mov.id" class="hover:bg-white/[0.02]">
              <td class="p-3.5 font-bold text-white">{{ mov.code }}</td>
              <td class="p-3.5 text-slate-300">{{ mov.date }}</td>
              <td class="p-3.5">
                <span
                  class="px-2.5 py-0.5 rounded-full text-[11px] font-bold"
                  :class="
                    mov.type === 'Entrada'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : mov.type === 'Reserva'
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-red-500/20 text-red-300'
                  "
                >
                  {{ mov.type }}
                </span>
              </td>
              <td class="p-3.5 text-slate-300">{{ mov.category }}</td>
              <td class="p-3.5 font-bold text-white">{{ mov.itemName }}</td>
              <td class="p-3.5 font-mono text-amber-300">{{ mov.lotCode }}</td>
              <td class="p-3.5 font-bold text-white">{{ formatNumber(mov.quantity) }} {{ mov.unit }}</td>
              <td class="p-3.5 text-emerald-400 font-bold">{{ formatNumber(mov.balanceAfter) }} {{ mov.unit }}</td>
              <td class="p-3.5 text-slate-300">{{ mov.reference }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <BaseModal v-model="showModal" title="Registrar Ajuste o Transferencia de Inventario">
      <form class="space-y-3" @submit.prevent="saveMovement">
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">Tipo de Movimiento</label>
            <select v-model="draft.type" class="w-full h-10 px-3 rounded-xl bg-[#11151F] border border-white/15 text-xs text-white">
              <option value="Entrada">Entrada</option>
              <option value="Salida">Salida</option>
              <option value="Reserva">Reserva</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">Cantidad *</label>
            <input
              v-model.number="draft.quantity"
              type="number"
              min="1"
              required
              class="w-full h-10 px-3 rounded-xl bg-[#11151F] border border-white/15 text-xs text-white"
            />
          </div>
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Producto / Ítem *</label>
          <input
            v-model="draft.itemName"
            type="text"
            required
            placeholder="Palitos de Queso Clásicos (PQ-001)"
            class="w-full h-10 px-3 rounded-xl bg-[#11151F] border border-white/15 text-xs text-white"
          />
        </div>
        <div class="flex justify-end gap-2">
          <button type="button" class="qp-btn-secondary px-4 py-2 rounded-xl text-xs" @click="showModal = false">Cancelar</button>
          <button type="submit" class="qp-btn-primary px-4 py-2 rounded-xl text-xs font-bold">Registrar en Kardex</button>
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
const draft = ref({ type: 'Entrada', quantity: 500, itemName: 'Palitos de Queso Clásicos (PQ-001)' })

const kpis = computed(() => [
  {
    title: 'Productos en Stock',
    value: `${formatNumber(store.dashboard.inventoryStatus.inStock)} und.`,
    delta: '+5.7%',
    color: 'green',
    icon: 'check-circle'
  },
  {
    title: 'Stock en Reserva',
    value: `${formatNumber(store.dashboard.inventoryStatus.reserved)} und.`,
    delta: 'Pedidos activos',
    color: 'amber',
    icon: 'box'
  },
  {
    title: 'Stock Bajo / Alerta',
    value: `${formatNumber(store.dashboard.inventoryStatus.lowStock)} und.`,
    delta: 'Reponer',
    color: 'red',
    icon: 'box'
  },
  {
    title: 'Movimientos Kardex',
    value: store.inventoryMovements.length,
    delta: 'Trazabilidad',
    color: 'blue',
    icon: 'truck'
  }
])

function saveMovement() {
  store.addGenericRecord(
    'inventoryMovements',
    {
      id: `KDX-${Date.now()}`,
      code: `MOV-2026-${902 + store.inventoryMovements.length}`,
      date: '2026-11-15 11:40 AM',
      type: draft.value.type,
      category: 'Producto Terminado',
      itemName: draft.value.itemName,
      lotCode: '#L-2026-0873',
      quantity: draft.value.quantity,
      unit: 'und',
      balanceAfter: 13000,
      reference: 'Ajuste Manual Autorizado'
    },
    'Inventarios'
  )
  showModal.value = false
}
</script>
