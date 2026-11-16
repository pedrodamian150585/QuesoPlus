<template>
  <EnterpriseModuleShell
    code="7.6"
    section="Productos"
    title="Formulaciones y Recetas Maestro"
    subtitle="Dosificación de ingredientes, porcentajes, rendimientos por lote, mermas y costos estándar"
    emoji="🧪"
    :kpis="kpis"
  >
    <template #actions>
      <button type="button" class="qp-btn-primary px-4 py-2.5 rounded-xl text-xs font-bold" @click="showModal = true">
        ➕ Nueva Formulación
      </button>
    </template>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div v-for="form in store.formulations" :key="form.id" class="qp-card p-5 flex flex-col justify-between space-y-4">
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-red-500/20 text-red-300">
              {{ form.code }} ({{ form.version }})
            </span>
            <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              ✔ {{ form.status }}
            </span>
          </div>
          <h2 class="text-base font-bold text-white">{{ form.productName }}</h2>
          <p class="text-xs text-slate-400 mt-0.5">
            Tamaño de Lote: <strong class="text-white">{{ form.batchSizeKg }} kg</strong> · Rendimiento:
            <strong class="text-emerald-400">{{ formatNumber(form.expectedYieldUnits) }} und.</strong>
          </p>

          <div class="mt-3 space-y-1.5 border-t border-white/10 pt-3">
            <p class="text-[11px] font-bold uppercase text-slate-400">Composición de la Fórmula</p>
            <div
              v-for="ing in form.ingredients"
              :key="ing.name"
              class="flex items-center justify-between text-xs py-1 border-b border-white/5 last:border-0"
            >
              <span class="text-slate-200 truncate pr-2">{{ ing.name }}</span>
              <span class="text-amber-400 font-semibold shrink-0">{{ ing.quantity }} {{ ing.unit }} ({{ ing.percentage }}%)</span>
            </div>
          </div>
        </div>

        <div class="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
          <div>
            <p class="text-slate-400">Costo Estimado Lote</p>
            <p class="text-sm font-bold text-white">{{ formatCurrencyCOP(form.estimatedBatchCost, true) }}</p>
          </div>
          <div class="text-right">
            <p class="text-slate-400">Costo Unitario</p>
            <p class="text-sm font-bold text-emerald-400">{{ formatCurrencyCOP(form.unitCost) }} / und.</p>
          </div>
        </div>
      </div>
    </div>

    <BaseModal v-model="showModal" title="Registrar Nueva Formulación Industrial">
      <form class="space-y-3" @submit.prevent="createFormulation">
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Producto Asociado *</label>
          <input
            v-model="draft.productName"
            type="text"
            required
            placeholder="Ej. Palitos de Queso Finas Hierbas"
            class="w-full h-10 px-3 rounded-xl bg-[#11151F] border border-white/15 text-xs text-white"
          />
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">Tamaño Batch (kg)</label>
            <input
              v-model.number="draft.batchSizeKg"
              type="number"
              class="w-full h-10 px-3 rounded-xl bg-[#11151F] border border-white/15 text-xs text-white"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">Rendimiento Esperado (und.)</label>
            <input
              v-model.number="draft.expectedYieldUnits"
              type="number"
              class="w-full h-10 px-3 rounded-xl bg-[#11151F] border border-white/15 text-xs text-white"
            />
          </div>
        </div>
        <div class="flex justify-end gap-2 pt-2">
          <button type="button" class="qp-btn-secondary px-4 py-2 rounded-xl text-xs" @click="showModal = false">Cancelar</button>
          <button type="submit" class="qp-btn-primary px-4 py-2 rounded-xl text-xs font-bold">Guardar Receta</button>
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
const draft = ref({ productName: '', batchSizeKg: 100, expectedYieldUnits: 3800 })

const kpis = computed(() => [
  { title: 'Formulaciones Activas', value: store.formulations.length, delta: '100% Aprobadas', color: 'red', icon: 'box' },
  { title: 'Rendimiento Promedio', value: '96.8%', delta: '+1.2%', color: 'green', icon: 'check-circle' },
  { title: 'Merma Estándar', value: '3.1%', delta: 'Controlada', color: 'amber', icon: 'trending' },
  { title: 'Costo Unit. Promedio', value: '$ 668 COP', delta: 'Estable', color: 'purple', icon: 'star' }
])

function createFormulation() {
  store.addGenericRecord(
    'formulations',
    {
      id: `FORM-0${store.formulations.length + 1}`,
      code: `REC-00${store.formulations.length + 1}`,
      productName: draft.value.productName,
      version: 'v1.0',
      batchSizeKg: draft.value.batchSizeKg,
      expectedYieldUnits: draft.value.expectedYieldUnits,
      estimatedShrinkagePct: 3.0,
      estimatedBatchCost: 2650000,
      unitCost: Math.round(2650000 / Math.max(draft.value.expectedYieldUnits, 1)),
      status: 'Aprobada',
      ingredients: [
        { name: 'Queso Mozzarella Bloque Industrial', quantity: 50, unit: 'kg', percentage: 50 },
        { name: 'Harina de Trigo Especial Panadería', quantity: 35, unit: 'kg', percentage: 35 },
        { name: 'Empanizador y Especias', quantity: 15, unit: 'kg', percentage: 15 }
      ]
    },
    'Formulaciones'
  )
  showModal.value = false
}
</script>
