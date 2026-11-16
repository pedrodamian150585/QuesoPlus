<template>
  <EnterpriseModuleShell
    code="7.16"
    section="Finanzas"
    title="Cuentas por Cobrar y Gestión de Cartera"
    subtitle="Facturas pendientes, antigüedad de saldos, aplicación de recaudos/abonos y actualización en tiempo real hacia Tesorería"
    emoji="📥"
    :kpis="kpis"
  >
    <div class="qp-card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="bg-[#121622] text-slate-300 uppercase text-[11px]">
            <tr>
              <th class="p-3.5">Factura</th>
              <th class="p-3.5">Cliente</th>
              <th class="p-3.5">Emisión / Vencimiento</th>
              <th class="p-3.5">Edad Cartera</th>
              <th class="p-3.5">Valor Original</th>
              <th class="p-3.5">Abonado</th>
              <th class="p-3.5">Saldo Pendiente</th>
              <th class="p-3.5">Estado</th>
              <th class="p-3.5">Recaudo</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/10">
            <tr v-for="item in store.receivables" :key="item.id" class="hover:bg-white/[0.02]">
              <td class="p-3.5 font-bold text-white">{{ item.invoiceCode }}</td>
              <td class="p-3.5 font-semibold text-white">{{ item.customerName }}</td>
              <td class="p-3.5 text-slate-300">{{ item.issueDate }} → {{ item.dueDate }}</td>
              <td class="p-3.5 text-slate-300">{{ item.agingBucket }}</td>
              <td class="p-3.5">{{ formatCurrencyCOP(item.originalAmount) }}</td>
              <td class="p-3.5 text-emerald-400 font-semibold">{{ formatCurrencyCOP(item.paidAmount) }}</td>
              <td class="p-3.5 font-bold text-amber-400">{{ formatCurrencyCOP(item.balance, true) }}</td>
              <td class="p-3.5">
                <span
                  class="px-2.5 py-0.5 rounded-full text-[11px] font-bold"
                  :class="item.status === 'Pagada' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'"
                >
                  {{ item.status }}
                </span>
              </td>
              <td class="p-3.5">
                <button
                  v-if="item.balance > 0"
                  type="button"
                  class="qp-btn-primary px-3 py-1.5 rounded-lg text-xs font-bold"
                  @click="openCollectModal(item)"
                >
                  💳 Registrar Abono / Recaudo
                </button>
                <span v-else class="text-[11px] text-emerald-400 font-semibold">✔ Saldo en $0</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <BaseModal v-model="showModal" :title="`Registrar Recaudo — Factura ${selectedItem?.invoiceCode || ''}`">
      <form v-if="selectedItem" class="space-y-3" @submit.prevent="applyCollection">
        <div class="p-3 rounded-xl bg-white/5 text-xs flex justify-between">
          <span>Saldo Pendiente Actual:</span>
          <strong class="text-amber-400">{{ formatCurrencyCOP(selectedItem.balance, true) }}</strong>
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Monto a Recaudar (COP) *</label>
          <input
            v-model.number="collectAmount"
            type="number"
            min="1000"
            :max="selectedItem.balance"
            required
            class="w-full h-10 px-3 rounded-xl bg-[#11151F] border border-white/15 text-xs text-white"
          />
        </div>
        <div class="flex justify-end gap-2">
          <button type="button" class="qp-btn-secondary px-4 py-2 rounded-xl text-xs" @click="showModal = false">Cancelar</button>
          <button type="submit" class="qp-btn-primary px-4 py-2 rounded-xl text-xs font-bold">Aplicar Recaudo a Tesorería</button>
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
const selectedItem = ref(null)
const collectAmount = ref(0)

const kpis = computed(() => [
  { title: 'Saldo Total por Cobrar', value: formatCurrencyCOP(store.totalReceivablesBalance), delta: 'Cartera activa', color: 'amber', icon: 'shopping-cart' },
  {
    title: 'Facturas Pendientes',
    value: store.receivables.filter((r) => r.balance > 0).length,
    delta: 'En gestión',
    color: 'red',
    icon: 'box'
  },
  { title: 'Recaudo Efectivo Mes', value: '94.6%', delta: '+3.1%', color: 'green', icon: 'check-circle' },
  { title: 'Rotación de Cartera', value: '24 días', delta: 'Óptima', color: 'blue', icon: 'trending' }
])

function openCollectModal(item) {
  selectedItem.value = item
  collectAmount.value = item.balance
  showModal.value = true
}

async function applyCollection() {
  if (!selectedItem.value) return
  await store.registerReceivableCollection(selectedItem.value.id, collectAmount.value)
  showModal.value = false
}
</script>
