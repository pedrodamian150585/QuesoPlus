<template>
  <EnterpriseModuleShell
    code="7.9"
    section="Operaciones"
    title="Control de Calidad e Inocuidad"
    subtitle="Inspecciones de materias primas, proceso y producto terminado, no conformidades y liberación de lotes"
    emoji="🔬"
    :kpis="kpis"
  >
    <template #actions>
      <button type="button" class="qp-btn-primary px-4 py-2.5 rounded-xl text-xs font-bold" @click="showModal = true">
        ➕ Registrar Inspección
      </button>
    </template>

    <div class="qp-card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="bg-[#121622] text-slate-300 uppercase text-[11px]">
            <tr>
              <th class="p-3.5">Código</th>
              <th class="p-3.5">Etapa</th>
              <th class="p-3.5">Lote / Referencia</th>
              <th class="p-3.5">Producto / Insumo</th>
              <th class="p-3.5">Temp. / Humedad</th>
              <th class="p-3.5">Puntaje Sensorial</th>
              <th class="p-3.5">No Conformidades / Acción Correctiva</th>
              <th class="p-3.5">Inspector</th>
              <th class="p-3.5">Dictamen</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/10">
            <tr v-for="qc in store.qualityInspections" :key="qc.id" class="hover:bg-white/[0.02]">
              <td class="p-3.5 font-bold text-white">{{ qc.code }}</td>
              <td class="p-3.5 text-slate-300">{{ qc.stage }}</td>
              <td class="p-3.5 font-mono text-amber-300">{{ qc.referenceCode }}</td>
              <td class="p-3.5 font-bold text-white">{{ qc.itemName }}</td>
              <td class="p-3.5">{{ qc.temperature }} · {{ qc.humidity }}</td>
              <td class="p-3.5 font-bold text-emerald-400">{{ qc.sensoryScore }}</td>
              <td class="p-3.5 text-slate-300 max-w-xs">
                <p class="font-semibold text-white">{{ qc.nonConformities }}</p>
                <p class="text-[11px] text-slate-400">{{ qc.correctiveAction }}</p>
              </td>
              <td class="p-3.5 text-slate-300">{{ qc.inspector }}</td>
              <td class="p-3.5">
                <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300">
                  ✔ {{ qc.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <BaseModal v-model="showModal" title="Registrar Inspección de Calidad">
      <form class="space-y-3" @submit.prevent="saveInspection">
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">Etapa</label>
            <select v-model="draft.stage" class="w-full h-10 px-3 rounded-xl bg-[#11151F] border border-white/15 text-xs text-white">
              <option value="Producto Terminado">Producto Terminado</option>
              <option value="Materia Prima">Materia Prima</option>
              <option value="En Proceso">En Proceso</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">Lote Evaluado *</label>
            <input
              v-model="draft.referenceCode"
              type="text"
              required
              placeholder="#L-2026-0874"
              class="w-full h-10 px-3 rounded-xl bg-[#11151F] border border-white/15 text-xs text-white"
            />
          </div>
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Producto / Materia Prima *</label>
          <input
            v-model="draft.itemName"
            type="text"
            required
            placeholder="Bolitas de Queso"
            class="w-full h-10 px-3 rounded-xl bg-[#11151F] border border-white/15 text-xs text-white"
          />
        </div>
        <div class="flex justify-end gap-2">
          <button type="button" class="qp-btn-secondary px-4 py-2 rounded-xl text-xs" @click="showModal = false">Cancelar</button>
          <button type="submit" class="qp-btn-primary px-4 py-2 rounded-xl text-xs font-bold">Aprobar y Liberar</button>
        </div>
      </form>
    </BaseModal>
  </EnterpriseModuleShell>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useEnterpriseStore } from '../stores/useEnterpriseStore.js'
import EnterpriseModuleShell from '../components/common/EnterpriseModuleShell.vue'
import BaseModal from '../components/common/BaseModal.vue'

const store = useEnterpriseStore()
const showModal = ref(false)
const draft = ref({ stage: 'Producto Terminado', referenceCode: '#L-2026-0874', itemName: 'Bolitas de Queso' })

const kpis = computed(() => [
  { title: 'Inspecciones Mes', value: store.qualityInspections.length, delta: '100% trazables', color: 'green', icon: 'check-circle' },
  { title: 'Conformidad Lotes', value: '99.2%', delta: '+0.4%', color: 'blue', icon: 'star' },
  { title: 'Cadena de Frío Media', value: '2.0 °C', delta: 'En rango 0-4°C', color: 'amber', icon: 'box' },
  { title: 'No Conformidades Críticas', value: '0', delta: 'Inocuidad total', color: 'red', icon: 'check-circle' }
])

function saveInspection() {
  store.addGenericRecord(
    'qualityInspections',
    {
      id: `QC-0${store.qualityInspections.length + 1}`,
      code: `INSP-2026-41${3 + store.qualityInspections.length}`,
      stage: draft.value.stage,
      referenceCode: draft.value.referenceCode,
      itemName: draft.value.itemName,
      inspector: 'Ing. Laura Méndez',
      date: '2026-11-15 11:30 AM',
      temperature: '2.0 °C',
      humidity: '45.5%',
      sensoryScore: '9.7 / 10',
      nonConformities: 'Ninguna',
      correctiveAction: 'Liberación estándar a inventario',
      status: 'Aprobado'
    },
    'Control de Calidad'
  )
  showModal.value = false
}
</script>
