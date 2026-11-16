<template>
  <EnterpriseModuleShell
    code="7.7"
    section="Operaciones"
    title="Materias Primas e Insumos"
    subtitle="Control de existencias, lotes, fechas de vencimiento, costos unitarios y alertas de reposición"
    emoji="🧀"
    :kpis="kpis"
  >
    <template #actions>
      <RouterLink to="/compras" class="qp-btn-secondary px-3.5 py-2.5 rounded-xl text-xs font-semibold">
        🛒 Solicitar Compra
      </RouterLink>
      <button type="button" class="qp-btn-primary px-4 py-2.5 rounded-xl text-xs font-bold" @click="showModal = true">
        ➕ Nueva Materia Prima
      </button>
    </template>

    <div class="qp-card overflow-hidden">
      <div class="p-4 border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
        <input
          v-model="search"
          type="search"
          aria-label="Buscar materia prima o lote"
          placeholder="Buscar por nombre, código o lote..."
          class="w-full max-w-md h-10 px-4 rounded-xl bg-[#11151F] border border-white/10 text-xs text-white"
        />
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="bg-[#121622] text-slate-300 uppercase text-[11px]">
            <tr>
              <th class="p-3.5">Código</th>
              <th class="p-3.5">Materia Prima / Insumo</th>
              <th class="p-3.5">Clasificación</th>
              <th class="p-3.5">Proveedor Principal</th>
              <th class="p-3.5">Lote Activo</th>
              <th class="p-3.5">Vencimiento</th>
              <th class="p-3.5">Existencia</th>
              <th class="p-3.5">Costo Unit.</th>
              <th class="p-3.5">Estado</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/10">
            <tr v-for="rm in filteredMaterials" :key="rm.id" class="hover:bg-white/[0.02]">
              <td class="p-3.5 font-bold text-red-300">{{ rm.code }}</td>
              <td class="p-3.5 font-bold text-white">{{ rm.name }}</td>
              <td class="p-3.5 text-slate-300">{{ rm.type }}</td>
              <td class="p-3.5 text-slate-300">{{ rm.supplierName }}</td>
              <td class="p-3.5 font-mono text-amber-300">{{ rm.lotCode }}</td>
              <td class="p-3.5 text-slate-300">{{ rm.expirationDate }}</td>
              <td class="p-3.5 font-bold text-white">{{ formatNumber(rm.stock) }} {{ rm.unit }}</td>
              <td class="p-3.5 text-slate-200">{{ formatCurrencyCOP(rm.unitCost) }}</td>
              <td class="p-3.5">
                <span
                  class="px-2.5 py-0.5 rounded-full text-[11px] font-bold"
                  :class="rm.status === 'Stock Bajo' ? 'bg-red-500/20 text-red-300 border border-red-500/40' : 'bg-emerald-500/20 text-emerald-300'"
                >
                  {{ rm.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <BaseModal v-model="showModal" title="Registrar Materia Prima o Insumo">
      <form class="space-y-3" @submit.prevent="saveRawMaterial">
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Nombre *</label>
          <input
            v-model="draft.name"
            type="text"
            required
            placeholder="Ej. Almidón Modificado de Yuca"
            class="w-full h-10 px-3 rounded-xl bg-[#11151F] border border-white/15 text-xs text-white"
          />
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">Stock Inicial (kg/und)</label>
            <input
              v-model.number="draft.stock"
              type="number"
              class="w-full h-10 px-3 rounded-xl bg-[#11151F] border border-white/15 text-xs text-white"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">Costo Unitario (COP)</label>
            <input
              v-model.number="draft.unitCost"
              type="number"
              class="w-full h-10 px-3 rounded-xl bg-[#11151F] border border-white/15 text-xs text-white"
            />
          </div>
        </div>
        <div class="flex justify-end gap-2">
          <button type="button" class="qp-btn-secondary px-4 py-2 rounded-xl text-xs" @click="showModal = false">Cancelar</button>
          <button type="submit" class="qp-btn-primary px-4 py-2 rounded-xl text-xs font-bold">Guardar</button>
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
const search = ref('')
const showModal = ref(false)
const draft = ref({ name: '', stock: 250, unitCost: 12000 })

const filteredMaterials = computed(() => {
  const q = search.value.trim().toLowerCase()
  return store.rawMaterials.filter(
    (m) => !q || m.name.toLowerCase().includes(q) || m.code.toLowerCase().includes(q) || m.lotCode.toLowerCase().includes(q)
  )
})

const kpis = computed(() => [
  { title: 'Ítems Catalogados', value: store.rawMaterials.length, delta: 'Activos', color: 'purple', icon: 'box' },
  {
    title: 'Alertas Stock Bajo',
    value: store.rawMaterials.filter((m) => m.status === 'Stock Bajo').length,
    delta: 'Queso Mozzarella',
    color: 'red',
    icon: 'box'
  },
  { title: 'Lotes Trazables', value: store.rawMaterials.length, delta: '100% vigentes', color: 'green', icon: 'check-circle' },
  { title: 'Proveedores Lácteos/Secos', value: store.suppliers.length, delta: 'Homologados', color: 'blue', icon: 'truck' }
])

function saveRawMaterial() {
  store.addGenericRecord(
    'rawMaterials',
    {
      id: `MP-0${store.rawMaterials.length + 1}`,
      code: `MP-NEW-0${store.rawMaterials.length + 1}`,
      name: draft.value.name,
      type: 'Materia Prima Seca',
      unit: 'kg',
      supplierId: 'PROV-02',
      supplierName: 'Molinos Andinos de Colombia',
      stock: draft.value.stock,
      minStock: 100,
      lotCode: 'LOT-2611-NEW',
      expirationDate: '2027-06-30',
      unitCost: draft.value.unitCost,
      status: 'Activo'
    },
    'Materias Primas'
  )
  showModal.value = false
}
</script>
