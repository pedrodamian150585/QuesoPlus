<template>
  <EnterpriseModuleShell
    code="7.11"
    section="Abastecimiento"
    title="Compras y Recepción de Mercancías"
    subtitle="Solicitudes, requisiciones, órdenes de compra, recepción conectada con inventario y generación de cuentas por pagar"
    emoji="🛒"
    :kpis="kpis"
  >
    <template #actions>
      <button type="button" class="qp-btn-primary px-4 py-2.5 rounded-xl text-xs font-bold" @click="showModal = true">
        ➕ Nueva Orden de Compra
      </button>
    </template>

    <div class="qp-card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="bg-[#121622] text-slate-300 uppercase text-[11px]">
            <tr>
              <th class="p-3.5">Orden</th>
              <th class="p-3.5">Proveedor</th>
              <th class="p-3.5">Detalle de Compra</th>
              <th class="p-3.5">Fecha Emisión / Entrega</th>
              <th class="p-3.5">Factura Prov.</th>
              <th class="p-3.5">Valor Total</th>
              <th class="p-3.5">Estado</th>
              <th class="p-3.5">Recepción a Inventario</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/10">
            <tr v-for="po in store.purchaseOrders" :key="po.id" class="hover:bg-white/[0.02]">
              <td class="p-3.5 font-bold text-white">{{ po.code }}</td>
              <td class="p-3.5 font-semibold text-white">{{ po.supplierName }}</td>
              <td class="p-3.5 text-slate-300">{{ po.itemSummary }}</td>
              <td class="p-3.5 text-slate-300">{{ po.date }} → {{ po.expectedDate }}</td>
              <td class="p-3.5 font-mono text-amber-300">{{ po.invoiceCode }}</td>
              <td class="p-3.5 font-bold text-white">{{ formatCurrencyCOP(po.totalAmount, true) }}</td>
              <td class="p-3.5">
                <span
                  class="px-2.5 py-0.5 rounded-full text-[11px] font-bold"
                  :class="po.status === 'Recibida' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'"
                >
                  {{ po.status }}
                </span>
              </td>
              <td class="p-3.5">
                <button
                  v-if="po.status !== 'Recibida'"
                  type="button"
                  class="qp-btn-primary px-3 py-1.5 rounded-lg text-xs font-bold"
                  @click="store.receivePurchaseOrder(po.id)"
                >
                  📥 Recibir e Ingresar a Almacén
                </button>
                <span v-else class="text-[11px] text-emerald-400 font-semibold">✔ Ingresada a Kardex</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <BaseModal v-model="showModal" title="Emitir Nueva Orden de Compra">
      <form class="space-y-3" @submit.prevent="createPurchaseOrder">
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Proveedor *</label>
          <select v-model="draft.supplierId" class="w-full h-10 px-3 rounded-xl bg-[#11151F] border border-white/15 text-xs text-white">
            <option v-for="s in store.suppliers" :key="s.id" :value="s.id">{{ s.name }}</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Materia Prima / Insumo *</label>
          <input
            v-model="draft.itemSummary"
            type="text"
            required
            placeholder="Queso Mozzarella Bloque Industrial (150 kg)"
            class="w-full h-10 px-3 rounded-xl bg-[#11151F] border border-white/15 text-xs text-white"
          />
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">Cantidad (kg/und) *</label>
            <input
              v-model.number="draft.quantity"
              type="number"
              min="1"
              required
              class="w-full h-10 px-3 rounded-xl bg-[#11151F] border border-white/15 text-xs text-white"
            />
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
        <div class="flex justify-end gap-2">
          <button type="button" class="qp-btn-secondary px-4 py-2 rounded-xl text-xs" @click="showModal = false">Cancelar</button>
          <button type="submit" class="qp-btn-primary px-4 py-2 rounded-xl text-xs font-bold">Aprobar Orden</button>
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
  supplierId: 'PROV-01',
  itemSummary: 'Queso Mozzarella Bloque Industrial (150 kg)',
  quantity: 150,
  totalAmount: 5100000
})

const kpis = computed(() => [
  { title: 'Órdenes de Compra', value: store.purchaseOrders.length, delta: 'Activas', color: 'red', icon: 'shopping-cart' },
  {
    title: 'Pendientes de Recepción',
    value: store.purchaseOrders.filter((p) => p.status !== 'Recibida').length,
    delta: 'En tránsito',
    color: 'amber',
    icon: 'truck'
  },
  {
    title: 'Recibidas en Almacén',
    value: store.purchaseOrders.filter((p) => p.status === 'Recibida').length,
    delta: 'Con Kardex',
    color: 'green',
    icon: 'check-circle'
  },
  { title: 'Saldos CxP Generados', value: formatCurrencyCOP(store.totalPayablesBalance), delta: 'Proveedores', color: 'purple', icon: 'box' }
])

function createPurchaseOrder() {
  const sup = store.suppliers.find((s) => s.id === draft.value.supplierId) || store.suppliers[0]
  store.addGenericRecord(
    'purchaseOrders',
    {
      id: `PO-0${store.purchaseOrders.length + 1}`,
      code: `OC-2026-31${1 + store.purchaseOrders.length}`,
      supplierId: sup.id,
      supplierName: sup.name,
      rawMaterialId: 'MP-01',
      itemSummary: draft.value.itemSummary,
      quantity: draft.value.quantity,
      unit: 'kg',
      date: '2026-11-15',
      expectedDate: '2026-11-18',
      totalAmount: draft.value.totalAmount,
      status: 'Aprobada',
      invoiceCode: `FP-890${store.purchaseOrders.length + 1}`
    },
    'Compras'
  )
  showModal.value = false
}
</script>
