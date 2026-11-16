<template>
  <EnterpriseModuleShell
    code="7.17"
    section="Finanzas"
    title="Cuentas por Pagar a Proveedores"
    subtitle="Control de obligaciones con proveedores, vencimientos, programación de pagos y descuento automático en Tesorería"
    emoji="📤"
    :kpis="kpis"
  >
    <div class="qp-card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="bg-[#121622] text-slate-300 uppercase text-[11px]">
            <tr>
              <th class="p-3.5">Factura Prov.</th>
              <th class="p-3.5">Orden Compra</th>
              <th class="p-3.5">Proveedor</th>
              <th class="p-3.5">Vencimiento</th>
              <th class="p-3.5">Valor Original</th>
              <th class="p-3.5">Pagado</th>
              <th class="p-3.5">Saldo por Pagar</th>
              <th class="p-3.5">Estado</th>
              <th class="p-3.5">Aplicación de Pago</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/10">
            <tr v-for="item in store.payables" :key="item.id" class="hover:bg-white/[0.02]">
              <td class="p-3.5 font-bold text-white">{{ item.invoiceCode }}</td>
              <td class="p-3.5 text-slate-300">{{ item.purchaseOrderCode }}</td>
              <td class="p-3.5 font-semibold text-white">{{ item.supplierName }}</td>
              <td class="p-3.5 text-slate-300">{{ item.dueDate }}</td>
              <td class="p-3.5">{{ formatCurrencyCOP(item.originalAmount) }}</td>
              <td class="p-3.5 text-emerald-400">{{ formatCurrencyCOP(item.paidAmount) }}</td>
              <td class="p-3.5 font-bold text-red-400">{{ formatCurrencyCOP(item.balance, true) }}</td>
              <td class="p-3.5">
                <span
                  class="px-2.5 py-0.5 rounded-full text-[11px] font-bold"
                  :class="item.status === 'Pagada' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'"
                >
                  {{ item.status }}
                </span>
              </td>
              <td class="p-3.5">
                <button
                  v-if="item.balance > 0"
                  type="button"
                  class="qp-btn-primary px-3 py-1.5 rounded-lg text-xs font-bold"
                  @click="openPayModal(item)"
                >
                  💸 Registrar Pago / Abono
                </button>
                <span v-else class="text-[11px] text-emerald-400 font-semibold">✔ Obligación Pagada</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <BaseModal v-model="showModal" :title="`Programar / Aplicar Pago — Factura ${selectedItem?.invoiceCode || ''}`">
      <form v-if="selectedItem" class="space-y-3" @submit.prevent="applyPayment">
        <div class="p-3 rounded-xl bg-white/5 text-xs flex justify-between">
          <span>Saldo Pendiente por Pagar:</span>
          <strong class="text-red-400">{{ formatCurrencyCOP(selectedItem.balance, true) }}</strong>
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Monto a Pagar desde Tesorería (COP) *</label>
          <input
            v-model.number="payAmount"
            type="number"
            min="1000"
            :max="selectedItem.balance"
            required
            class="w-full h-10 px-3 rounded-xl bg-[#11151F] border border-white/15 text-xs text-white"
          />
        </div>
        <div class="flex justify-end gap-2">
          <button type="button" class="qp-btn-secondary px-4 py-2 rounded-xl text-xs" @click="showModal = false">Cancelar</button>
          <button type="submit" class="qp-btn-primary px-4 py-2 rounded-xl text-xs font-bold">Confirmar Egreso Bancario</button>
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
const payAmount = ref(0)

const kpis = computed(() => [
  { title: 'Saldo Total por Pagar', value: formatCurrencyCOP(store.totalPayablesBalance), delta: 'Proveedores', color: 'red', icon: 'shopping-cart' },
  {
    title: 'Facturas Abiertas',
    value: store.payables.filter((p) => p.balance > 0).length,
    delta: 'Programadas',
    color: 'amber',
    icon: 'box'
  },
  { title: 'Disponibilidad Bancos', value: formatCurrencyCOP(store.totalTreasuryBalance), delta: 'Cobertura OK', color: 'green', icon: 'check-circle' },
  { title: 'Descuentos Pronto Pago', value: '2.5%', delta: 'Aprovechados', color: 'purple', icon: 'star' }
])

function openPayModal(item) {
  selectedItem.value = item
  payAmount.value = item.balance
  showModal.value = true
}

async function applyPayment() {
  if (!selectedItem.value) return
  await store.registerPayablePayment(selectedItem.value.id, payAmount.value)
  showModal.value = false
}
</script>
