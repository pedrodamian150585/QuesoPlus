<template>
  <EnterpriseModuleShell
    code="7.13"
    section="Gestión Comercial"
    title="Clientes y Cupos de Crédito"
    subtitle="Directorio comercial, clasificación por canal, condiciones de pago, cupos aprobados y saldos en cartera"
    emoji="🏢"
    :kpis="kpis"
  >
    <template #actions>
      <button type="button" class="qp-btn-primary px-4 py-2.5 rounded-xl text-xs font-bold" @click="showModal = true">
        ➕ Nuevo Cliente
      </button>
    </template>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div v-for="cli in store.customers" :key="cli.id" class="qp-card p-5 space-y-3 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between">
            <span class="px-2.5 py-0.5 rounded bg-sky-500/20 text-sky-300 text-[11px] font-bold">{{ cli.segment }}</span>
            <span class="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold">✔ {{ cli.status }}</span>
          </div>
          <h2 class="text-base font-bold text-white mt-2">{{ cli.name }}</h2>
          <p class="text-xs text-slate-400">NIT: {{ cli.taxId }}</p>
          <p class="text-xs text-slate-300 mt-2">Contacto: {{ cli.contactName }} · {{ cli.phone }}</p>
          <p class="text-xs text-slate-400">{{ cli.email }}</p>
        </div>

        <div class="pt-3 border-t border-white/10 grid grid-cols-2 gap-2 text-xs">
          <div>
            <p class="text-slate-400">Cupo de Crédito</p>
            <p class="font-bold text-white">{{ formatCurrencyCOP(cli.creditLimit) }}</p>
          </div>
          <div class="text-right">
            <p class="text-slate-400">Saldo en Cartera</p>
            <p class="font-bold text-amber-400">{{ formatCurrencyCOP(cli.currentBalance) }}</p>
          </div>
        </div>
      </div>
    </div>

    <BaseModal v-model="showModal" title="Registrar Nuevo Cliente Comercial">
      <form class="space-y-3" @submit.prevent="saveCustomer">
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Nombre / Razón Social *</label>
          <input
            v-model="draft.name"
            type="text"
            required
            placeholder="Ej. Hipermercados del Sur S.A."
            class="w-full h-10 px-3 rounded-xl bg-[#11151F] border border-white/15 text-xs text-white"
          />
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">Segmento</label>
            <input
              v-model="draft.segment"
              type="text"
              class="w-full h-10 px-3 rounded-xl bg-[#11151F] border border-white/15 text-xs text-white"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">Cupo de Crédito (COP)</label>
            <input
              v-model.number="draft.creditLimit"
              type="number"
              class="w-full h-10 px-3 rounded-xl bg-[#11151F] border border-white/15 text-xs text-white"
            />
          </div>
        </div>
        <div class="flex justify-end gap-2">
          <button type="button" class="qp-btn-secondary px-4 py-2 rounded-xl text-xs" @click="showModal = false">Cancelar</button>
          <button type="submit" class="qp-btn-primary px-4 py-2 rounded-xl text-xs font-bold">Guardar Cliente</button>
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
const draft = ref({ name: '', segment: 'Distribuidor Mayorista', creditLimit: 12000000 })

const kpis = computed(() => [
  { title: 'Base Total Clientes', value: '842', delta: '+11.7%', color: 'green', icon: 'check-circle' },
  { title: 'Cuentas Corporativas', value: store.customers.length, delta: 'Clave', color: 'blue', icon: 'star' },
  { title: 'Cartera Total Activa', value: formatCurrencyCOP(store.totalReceivablesBalance), delta: 'Al día', color: 'amber', icon: 'shopping-cart' },
  { title: 'Retención Comercial', value: '96.4%', delta: '+1.8%', color: 'purple', icon: 'box' }
])

function saveCustomer() {
  store.addGenericRecord(
    'customers',
    {
      id: `CLI-0${store.customers.length + 1}`,
      code: `CL-00${store.customers.length + 1}`,
      name: draft.value.name,
      taxId: '901.300.220-1',
      segment: draft.value.segment,
      contactName: 'Gerente de Compras',
      phone: '+57 315 000 1122',
      email: 'compras@cliente.co',
      paymentTerms: '30 días',
      creditLimit: draft.value.creditLimit,
      currentBalance: 0,
      status: 'Activo'
    },
    'Clientes'
  )
  showModal.value = false
}
</script>
