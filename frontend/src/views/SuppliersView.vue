<template>
  <EnterpriseModuleShell
    code="7.12"
    section="Abastecimiento"
    title="Directorio de Proveedores"
    subtitle="Información tributaria, contactos comerciales, insumos suministrados, plazos de pago y saldos pendientes"
    emoji="🤝"
    :kpis="kpis"
  >
    <template #actions>
      <button type="button" class="qp-btn-primary px-4 py-2.5 rounded-xl text-xs font-bold" @click="showModal = true">
        ➕ Nuevo Proveedor
      </button>
    </template>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div v-for="sup in store.suppliers" :key="sup.id" class="qp-card p-5 space-y-3 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between">
            <span class="px-2.5 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[11px] font-bold">{{ sup.code }}</span>
            <span class="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold">✔ {{ sup.status }}</span>
          </div>
          <h2 class="text-base font-bold text-white mt-2">{{ sup.name }}</h2>
          <p class="text-xs text-slate-400">NIT: {{ sup.taxId }}</p>
          <p class="text-xs text-slate-300 mt-2"><strong>Suministros:</strong> {{ sup.suppliedItems }}</p>
          <p class="text-xs text-slate-300 mt-1"><strong>Contacto:</strong> {{ sup.contactName }} · {{ sup.phone }}</p>
        </div>

        <div class="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
          <div>
            <p class="text-slate-400">Plazo Comercial</p>
            <p class="font-bold text-white">{{ sup.paymentTerms }}</p>
          </div>
          <div class="text-right">
            <p class="text-slate-400">Saldo por Pagar</p>
            <p class="font-bold text-amber-400">{{ formatCurrencyCOP(sup.pendingBalance, true) }}</p>
          </div>
        </div>
      </div>
    </div>

    <BaseModal v-model="showModal" title="Registrar Nuevo Proveedor">
      <form class="space-y-3" @submit.prevent="saveSupplier">
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Razón Social *</label>
          <input
            v-model="draft.name"
            type="text"
            required
            placeholder="Ej. Agroindustria Láctea del Oriente S.A.S."
            class="w-full h-10 px-3 rounded-xl bg-[#11151F] border border-white/15 text-xs text-white"
          />
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">NIT *</label>
            <input
              v-model="draft.taxId"
              type="text"
              required
              placeholder="900.812.110-4"
              class="w-full h-10 px-3 rounded-xl bg-[#11151F] border border-white/15 text-xs text-white"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">Plazo de Pago</label>
            <input
              v-model="draft.paymentTerms"
              type="text"
              class="w-full h-10 px-3 rounded-xl bg-[#11151F] border border-white/15 text-xs text-white"
            />
          </div>
        </div>
        <div class="flex justify-end gap-2">
          <button type="button" class="qp-btn-secondary px-4 py-2 rounded-xl text-xs" @click="showModal = false">Cancelar</button>
          <button type="submit" class="qp-btn-primary px-4 py-2 rounded-xl text-xs font-bold">Guardar Proveedor</button>
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
const draft = ref({ name: '', taxId: '', paymentTerms: '30 días' })

const kpis = computed(() => [
  { title: 'Proveedores Activos', value: store.suppliers.length, delta: 'Homologados', color: 'purple', icon: 'box' },
  { title: 'Cumplimiento Entregas', value: '97.4%', delta: '+2.1%', color: 'green', icon: 'check-circle' },
  { title: 'Plazo Medio Pago', value: '35 días', delta: 'Estable', color: 'blue', icon: 'truck' },
  { title: 'Total Obligaciones CxP', value: formatCurrencyCOP(store.totalPayablesBalance), delta: 'Vigentes', color: 'amber', icon: 'shopping-cart' }
])

function saveSupplier() {
  store.addGenericRecord(
    'suppliers',
    {
      id: `PROV-0${store.suppliers.length + 1}`,
      code: `PRV-00${store.suppliers.length + 1}`,
      name: draft.value.name,
      taxId: draft.value.taxId,
      contactName: 'Ejecutivo Comercial',
      phone: '+57 310 000 0000',
      email: 'contacto@proveedor.co',
      suppliedItems: 'Insumos y Materias Primas',
      paymentTerms: draft.value.paymentTerms,
      pendingBalance: 0,
      status: 'Activo'
    },
    'Proveedores'
  )
  showModal.value = false
}
</script>
