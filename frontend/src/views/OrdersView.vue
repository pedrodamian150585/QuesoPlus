<template>
  <EnterpriseModuleShell
    code="7.14"
    section="Gestión Comercial"
    title="Pedidos Comerciales y Reserva de Stock"
    subtitle="Toma de pedidos por cliente, selección de presentaciones, descuentos y reserva automática en inventario"
    emoji="📋"
    :kpis="kpis"
  >
    <template #actions>
      <button type="button" class="qp-btn-primary px-4 py-2.5 rounded-xl text-xs font-bold" @click="showModal = true">
        ➕ Registrar Pedido
      </button>
    </template>

    <div class="qp-card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="bg-[#121622] text-slate-300 uppercase text-[11px]">
            <tr>
              <th class="p-3.5">Pedido</th>
              <th class="p-3.5">Cliente</th>
              <th class="p-3.5">Producto / Presentación</th>
              <th class="p-3.5">Cantidad</th>
              <th class="p-3.5">Precio Unit.</th>
              <th class="p-3.5">Descuento</th>
              <th class="p-3.5">Total Pedido</th>
              <th class="p-3.5">Entrega</th>
              <th class="p-3.5">Estado</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/10">
            <tr v-for="ord in store.orders" :key="ord.id" class="hover:bg-white/[0.02]">
              <td class="p-3.5 font-bold text-white">{{ ord.code }}</td>
              <td class="p-3.5 font-semibold text-white">{{ ord.customerName }}</td>
              <td class="p-3.5 text-slate-300">
                <p class="font-bold text-white">{{ ord.productName }}</p>
                <p class="text-[11px] text-slate-400">{{ ord.presentationName }}</p>
              </td>
              <td class="p-3.5 font-bold">{{ formatNumber(ord.quantity) }} paq.</td>
              <td class="p-3.5">{{ formatCurrencyCOP(ord.unitPrice) }}</td>
              <td class="p-3.5 text-emerald-400">{{ ord.discountPct }}%</td>
              <td class="p-3.5 font-bold text-amber-400">{{ formatCurrencyCOP(ord.totalAmount, true) }}</td>
              <td class="p-3.5 text-slate-300">{{ ord.deliveryDate }}</td>
              <td class="p-3.5">
                <span
                  class="px-2.5 py-0.5 rounded-full text-[11px] font-bold"
                  :class="
                    ord.status === 'Entregado'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : ord.status === 'En Ruta'
                      ? 'bg-sky-500/20 text-sky-300'
                      : 'bg-amber-500/20 text-amber-300'
                  "
                >
                  {{ ord.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <BaseModal v-model="showModal" title="Registrar Nuevo Pedido Comercial (Reserva Stock)">
      <form class="space-y-3" @submit.prevent="handleCreateOrder">
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Cliente *</label>
          <select v-model="draft.customerId" class="w-full h-10 px-3 rounded-xl bg-[#11151F] border border-white/15 text-xs text-white">
            <option v-for="c in store.customers" :key="c.id" :value="c.id">{{ c.name }}</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Producto *</label>
          <select v-model="draft.productId" class="w-full h-10 px-3 rounded-xl bg-[#11151F] border border-white/15 text-xs text-white">
            <option v-for="p in store.products" :key="p.id" :value="p.id">{{ p.name }} ({{ p.code }})</option>
          </select>
        </div>
        <div class="grid grid-cols-3 gap-3">
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
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">Precio Unit. (COP)</label>
            <input
              v-model.number="draft.unitPrice"
              type="number"
              class="w-full h-10 px-3 rounded-xl bg-[#11151F] border border-white/15 text-xs text-white"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">Descuento (%)</label>
            <input
              v-model.number="draft.discountPct"
              type="number"
              min="0"
              max="50"
              class="w-full h-10 px-3 rounded-xl bg-[#11151F] border border-white/15 text-xs text-white"
            />
          </div>
        </div>
        <div class="flex justify-end gap-2">
          <button type="button" class="qp-btn-secondary px-4 py-2 rounded-xl text-xs" @click="showModal = false">Cancelar</button>
          <button type="submit" class="qp-btn-primary px-4 py-2 rounded-xl text-xs font-bold">Confirmar Pedido y Reservar</button>
        </div>
      </form>
    </BaseModal>
  </EnterpriseModuleShell>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useEnterpriseStore } from '../stores/useEnterpriseStore.js'
import { formatNumber, formatCurrencyCOP } from '../utils/formatters.js'
import EnterpriseModuleShell from '../components/common/EnterpriseModuleShell.vue'
import BaseModal from '../components/common/BaseModal.vue'

const store = useEnterpriseStore()
const showModal = ref(false)
const draft = ref({ customerId: 'CLI-01', productId: 'PRD-01', quantity: 150, unitPrice: 8000, discountPct: 5 })

const kpis = computed(() => [
  { title: 'Pedidos en Proceso', value: '12 pedidos', delta: '+20.0%', color: 'blue', icon: 'truck' },
  {
    title: 'Stock Reservado',
    value: `${formatNumber(store.dashboard.inventoryStatus.reserved)} und.`,
    delta: 'Garantizado',
    color: 'amber',
    icon: 'box'
  },
  { title: 'Nivel de Servicio OTIF', value: '98.2%', delta: '+1.5%', color: 'green', icon: 'check-circle' },
  { title: 'Pedidos Registrados', value: store.orders.length, delta: 'Activos', color: 'red', icon: 'shopping-cart' }
])

async function handleCreateOrder() {
  await store.createOrder(draft.value)
  showModal.value = false
}
</script>
