<template>
  <EnterpriseModuleShell
    code="7.18"
    section="Finanzas"
    title="Tesorería, Cajas, Bancos y Movimientos de Dinero"
    subtitle="Saldos financieros consolidados, ingresos por ventas y recaudos, egresos por pagos a proveedores y conciliación bancaria"
    emoji="🏦"
    :kpis="kpis"
  >
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div v-for="acc in store.treasury.accounts" :key="acc.id" class="qp-card p-4 flex items-center justify-between">
        <div>
          <span class="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 text-[10px] font-bold uppercase">{{ acc.type }}</span>
          <h2 class="text-sm font-bold text-white mt-1.5">{{ acc.name }}</h2>
          <p class="text-lg font-bold text-emerald-400 mt-1">{{ formatCurrencyCOP(acc.balance, true) }}</p>
        </div>
      </div>
    </div>

    <div class="qp-card overflow-hidden">
      <div class="p-4 border-b border-white/10">
        <h3 class="text-sm font-bold text-white">Libro de Movimientos Financieros (Ingresos y Egresos)</h3>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="bg-[#121622] text-slate-300 uppercase text-[11px]">
            <tr>
              <th class="p-3.5">Comprobante</th>
              <th class="p-3.5">Fecha</th>
              <th class="p-3.5">Tipo</th>
              <th class="p-3.5">Concepto</th>
              <th class="p-3.5">Cuenta Financiera</th>
              <th class="p-3.5">Medio de Pago</th>
              <th class="p-3.5">Referencia</th>
              <th class="p-3.5">Valor</th>
              <th class="p-3.5">Estado</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/10">
            <tr v-for="mov in store.treasury.movements" :key="mov.id" class="hover:bg-white/[0.02]">
              <td class="p-3.5 font-bold text-white">{{ mov.code }}</td>
              <td class="p-3.5 text-slate-300">{{ mov.date }}</td>
              <td class="p-3.5">
                <span
                  class="px-2.5 py-0.5 rounded-full text-[11px] font-bold"
                  :class="mov.type === 'Ingreso' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'"
                >
                  {{ mov.type }}
                </span>
              </td>
              <td class="p-3.5 font-semibold text-white">{{ mov.category }}</td>
              <td class="p-3.5 text-slate-300">{{ mov.accountName }}</td>
              <td class="p-3.5 text-slate-300">{{ mov.paymentMethod }}</td>
              <td class="p-3.5 font-mono text-amber-300">{{ mov.reference }}</td>
              <td class="p-3.5 font-bold" :class="mov.type === 'Ingreso' ? 'text-emerald-400' : 'text-red-400'">
                {{ mov.type === 'Ingreso' ? '+' : '-' }}{{ formatCurrencyCOP(mov.amount, true) }}
              </td>
              <td class="p-3.5 text-emerald-300 font-semibold">✔ {{ mov.status }}</td>
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
import { formatCurrencyCOP } from '../utils/formatters.js'
import EnterpriseModuleShell from '../components/common/EnterpriseModuleShell.vue'

const store = useEnterpriseStore()

const kpis = computed(() => [
  { title: 'Liquidez Total Disponible', value: formatCurrencyCOP(store.totalTreasuryBalance), delta: '+16.4%', color: 'green', icon: 'check-circle' },
  { title: 'Cuentas Bancarias y Cajas', value: store.treasury.accounts.length, delta: 'Conciliadas', color: 'blue', icon: 'box' },
  { title: 'Cartera por Recaudar CxC', value: formatCurrencyCOP(store.totalReceivablesBalance), delta: 'Activa', color: 'amber', icon: 'shopping-cart' },
  { title: 'Obligaciones CxP', value: formatCurrencyCOP(store.totalPayablesBalance), delta: 'Cubiertas', color: 'purple', icon: 'star' }
])
</script>
