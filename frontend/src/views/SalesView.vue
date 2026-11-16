<template>
  <EnterpriseModuleShell
    code="7.15"
    section="Gestión Comercial"
    title="Ventas y Facturación Comercial"
    subtitle="Facturación de contado y a crédito conectada con Cuentas por Cobrar y Tesorería"
    emoji="💰"
    :kpis="kpis"
  >
    <template #actions>
      <button type="button" class="qp-btn-primary px-4 py-2.5 rounded-xl text-xs font-bold" @click="showModal = true">
        ➕ Emitir Factura de Venta
      </button>
    </template>

    <div class="qp-card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="bg-[#121622] text-slate-300 uppercase text-[11px]">
            <tr>
              <th class="p-3.5">Factura</th>
              <th class="p-3.5">Pedido Origen</th>
              <th class="p-3.5">Cliente</th>
              <th class="p-3.5">Modalidad</th>
              <th class="p-3.5">Detalle Facturado</th>
              <th class="p-3.5">Fecha</th>
              <th class="p-3.5">Total Factura</th>
              <th class="p-3.5">Estado</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/10">
            <tr v-for="sal in store.sales" :key="sal.id" class="hover:bg-white/[0.02]">
              <td class="p-3.5 font-bold text-white">{{ sal.invoiceCode }}</td>
              <td class="p-3.5 text-slate-300">{{ sal.orderCode }}</td>
              <td class="p-3.5 font-semibold text-white">{{ sal.customerName }}</td>
              <td class="p-3.5">
                <span
                  class="px-2 py-0.5 rounded text-[11px] font-bold"
                  :class="sal.paymentType === 'Crédito' ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'"
                >
                  {{ sal.paymentType }}
                </span>
              </td>
              <td class="p-3.5 text-slate-300">{{ sal.itemsSummary }}</td>
              <td class="p-3.5 text-slate-400">{{ sal.date }}</td>
              <td class="p-3.5 font-bold text-emerald-400">{{ formatCurrencyCOP(sal.totalAmount, true) }}</td>
              <td class="p-3.5 font-semibold text-white">{{ sal.status }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <BaseModal v-model="showModal" title="Emitir Nueva Factura de Venta">
      <form class="space-y-3" @submit.prevent="handleRegisterSale">
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Cliente *</label>
          <select v-model="draft.customerId" class="w-full h-10 px-3 rounded-xl bg-[#11151F] border border-white/15 text-xs text-white">
            <option v-for="c in store.customers" :key="c.id" :value="c.id">{{ c.name }}</option>
          </select>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">Modalidad de Pago *</label>
            <select v-model="draft.paymentType" class="w-full h-10 px-3 rounded-xl bg-[#11151F] border border-white/15 text-xs text-white">
              <option value="Crédito">Crédito (Genera Cuenta por Cobrar)</option>
              <option value="Contado">Contado (Ingresa a Tesorería)</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">Valor Total (COP) *</label>
            <input
              v-model.number="draft.totalAmount"
              type="number"
              min="1000"
              required
              class="w-full h-10 px-3 rounded-xl bg-[#11151F] border border-white/15 text-xs text-white"
            />
          </div>
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Concepto / Productos *</label>
          <input
            v-model="draft.itemsSummary"
            type="text"
            required
            class="w-full h-10 px-3 rounded-xl bg-[#11151F] border border-white/15 text-xs text-white"
          />
        </div>
        <div class="flex justify-end gap-2">
          <button type="button" class="qp-btn-secondary px-4 py-2 rounded-xl text-xs" @click="showModal = false">Cancelar</button>
          <button type="submit" class="qp-btn-primary px-4 py-2 rounded-xl text-xs font-bold">Facturar Venta</button>
        </div>
      </form>
    </BaseModal>
  </EnterpriseModuleShell>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useEnterpriseStore } from '../stores/useEnterpriseStore.js'
import { formatCurrencyCOP } from '../utils/formatters.js'
import EnterpriseModuleShell from '../components/common/EnterpriseModuleShell.vue'
import BaseModal from '../components/common/BaseModal.vue'

const store = useEnterpriseStore()
const showModal = ref(false)
const draft = ref({
  customerId: 'CLI-01',
  paymentType: 'Crédito',
  totalAmount: 2450000,
  itemsSummary: '250x Palitos de Queso Familiar'
})

const kpis = computed(() => [
  { title: 'Ventas del Mes (Und.)', value: '48.750 und.', delta: '+12.3%', color: 'amber', icon: 'shopping-cart' },
  {
    title: 'Facturación del Mes',
    value: formatCurrencyCOP(store.dashboard.businessSummary.totalSales),
    delta: '+14.2%',
    color: 'green',
    icon: 'check-circle'
  },
  { title: 'Facturas Emitidas', value: store.sales.length, delta: 'Vigentes', color: 'blue', icon: 'box' },
  { title: 'Cartera Generada CxC', value: formatCurrencyCOP(store.totalReceivablesBalance), delta: 'Activa', color: 'red', icon: 'trending' }
])

async function handleRegisterSale() {
  await store.registerSale(draft.value)
  showModal.value = false
}
</script>
