<template>
  <div class="w-full h-full relative">
    <h1 class="sr-only">Presentaciones de Productos — QuesoPlus</h1>

    <!-- MODO REFERENCIA ESCRITORIO INICIAL (Fidelidad Pixel-a-Pixel + Controles Interactivos) -->
    <template v-if="isReferenceDesktop && isDefaultReferenceState">
      <img
        :src="presMainSkin"
        alt="Presentaciones Comerciales de Productos de QuesoPlus"
        class="w-[1427px] h-[859px] object-cover pointer-events-none block select-none"
      />

      <!-- Breadcrumbs -->
      <RouterLink
        to="/dashboard"
        aria-label="Ir a Inicio"
        class="absolute left-[30px] top-[24px] w-[28px] h-[24px] rounded"
      />
      <RouterLink
        to="/productos"
        aria-label="Ir a Productos"
        class="absolute left-[72px] top-[24px] w-[68px] h-[24px] rounded"
      />

      <!-- Barra de Herramientas -->
      <button
        type="button"
        aria-label="Crear Nueva Presentación"
        class="absolute left-[22px] top-[290px] w-[184px] h-[44px] rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/70"
        @click="openCreateModal"
      />
      <button
        type="button"
        aria-label="Exportar presentaciones"
        class="absolute left-[218px] top-[290px] w-[112px] h-[44px] rounded-xl"
        @click="store.notify('Exportación completada', 'Presentaciones comerciales exportadas.', 'success')"
      />
      <button
        type="button"
        aria-label="Importar presentaciones"
        class="absolute left-[342px] top-[290px] w-[112px] h-[44px] rounded-xl"
        @click="store.notify('Importación lista', 'Seleccione archivo de presentaciones.', 'info')"
      />
      <button
        type="button"
        aria-label="Actualizar presentaciones"
        class="absolute left-[466px] top-[290px] w-[122px] h-[44px] rounded-xl"
        @click="store.notify('Presentaciones sincronizadas', 'Precios sugeridos y pesos verificados.', 'info')"
      />

      <!-- Buscador local -->
      <div class="absolute left-[802px] top-[290px] w-[482px] h-[44px]">
        <label for="qp-pres-search" class="sr-only">Buscar presentación</label>
        <input
          id="qp-pres-search"
          v-model="searchQuery"
          type="search"
          aria-label="Buscar presentación comercial"
          class="w-full h-full rounded-xl bg-transparent text-transparent caret-white px-10 focus:bg-[#121621] focus:text-white focus:outline-none"
        />
      </div>

      <!-- Botones en las 3 tarjetas de presentación (Ver Detalle, Editar, Más) -->
      <div
        v-for="(pres, idx) in store.presentations.slice(0, 3)"
        :key="pres.id"
        class="absolute top-[740px] h-[36px] flex items-center justify-between"
        :style="{ left: `${44 + idx * 467}px`, width: '404px' }"
      >
        <button
          type="button"
          :aria-label="`Ver detalle de ${pres.productName} - ${pres.name}`"
          class="w-[126px] h-full rounded-full"
          @click="inspectPresentation(pres)"
        />
        <button
          type="button"
          :aria-label="`Editar presentación ${pres.name}`"
          class="w-[120px] h-full rounded-full"
          @click="openEditModal(pres)"
        />
        <button
          type="button"
          :aria-label="`Opciones para ${pres.name}`"
          class="w-[106px] h-full rounded-full"
          @click="forceDynamic = true"
        />
      </div>
    </template>

    <!-- MODO INTERACTIVO DINÁMICO Y RESPONSIVE -->
    <template v-else>
      <div class="space-y-4">
        <div class="flex items-center justify-between text-xs text-slate-400">
          <div class="flex items-center gap-2">
            <RouterLink to="/dashboard" class="hover:text-white">🏠</RouterLink>
            <span>&gt;</span>
            <RouterLink to="/productos" class="hover:text-white">Productos</RouterLink>
            <span>&gt;</span>
            <span class="text-white font-semibold">Presentaciones</span>
          </div>
          <button
            type="button"
            class="qp-btn-secondary px-2.5 py-1 rounded-lg text-[11px]"
            @click="resetToReference"
          >
            Restaurar vista inicial
          </button>
        </div>

        <div class="qp-card relative overflow-hidden p-5 border border-red-500/25 bg-gradient-to-r from-[#1D060A] via-[#12070C] to-[#0B0D14] flex items-center justify-between">
          <div class="flex items-center gap-4">
            <img :src="heroIconPresentations" alt="Presentaciones" class="w-16 h-16 rounded-2xl object-contain" />
            <div>
              <h2 class="text-2xl font-bold text-white">Presentaciones de Productos</h2>
              <p class="text-xs text-slate-300">Administra las presentaciones comerciales de tus productos</p>
            </div>
          </div>
          <img :src="heroPresentationsArt" alt="Innovación y sabor en cada presentación" class="hidden md:block h-24 object-contain" />
        </div>

        <!-- Barra de herramientas -->
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center gap-2.5">
            <button
              type="button"
              class="qp-btn-primary px-4 py-2.5 rounded-xl text-xs font-bold"
              @click="openCreateModal"
            >
              ➕ Nueva Presentación
            </button>
            <button
              type="button"
              class="qp-btn-secondary px-3.5 py-2.5 rounded-xl text-xs font-semibold"
              @click="resetToReference"
            >
              ↻ Actualizar
            </button>
          </div>
          <input
            v-model="searchQuery"
            type="search"
            aria-label="Buscar presentación..."
            placeholder="Buscar presentación por nombre o producto..."
            class="w-full max-w-sm h-10 px-4 rounded-xl bg-[#11151F] border border-white/10 text-xs text-white"
          />
        </div>

        <!-- Grilla de Presentaciones -->
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <div
            v-for="pres in filteredPresentations"
            :key="pres.id"
            class="qp-card p-4 flex flex-col justify-between"
          >
            <div>
              <div class="relative h-36 mb-3">
                <span class="absolute top-2.5 right-2.5 z-10 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500 text-white">
                  ✔ {{ pres.status }}
                </span>
                <img :src="resolvePresentationImage(pres.imageKey)" :alt="pres.name" class="w-full h-full object-cover rounded-xl" />
              </div>
              <h3 class="text-base font-bold text-white">{{ pres.productName }}</h3>
              <p class="text-xs font-semibold text-slate-200">{{ pres.name }}</p>
              <p class="text-xs text-slate-400 mt-1">{{ pres.description }}</p>
            </div>

            <div class="grid grid-cols-3 gap-2 text-center py-3 my-3 border-y border-white/10 divide-x divide-white/10 text-xs">
              <div>
                <p class="text-slate-400 text-[11px]">Peso Neto</p>
                <p class="font-bold text-white">{{ pres.netWeight }}</p>
              </div>
              <div>
                <p class="text-slate-400 text-[11px]">Unidades</p>
                <p class="font-bold text-white">{{ pres.unitsPerPackage }} und.</p>
              </div>
              <div>
                <p class="text-slate-400 text-[11px]">Precio Sugerido</p>
                <p class="font-bold text-amber-400">{{ formatCurrencyCOP(pres.suggestedPrice, true) }}</p>
              </div>
            </div>

            <div class="flex items-center justify-between text-xs mb-3 px-2">
              <span>Participación en Ventas: <strong class="text-emerald-400">{{ pres.salesShare }}%</strong></span>
              <span>Ventas Mes: <strong class="text-white">{{ formatNumber(pres.monthlySales) }} und.</strong></span>
            </div>

            <div class="grid grid-cols-3 gap-2">
              <button type="button" class="qp-btn-secondary py-1.5 rounded-full text-xs font-semibold" @click="inspectPresentation(pres)">
                👁 Ver Detalle
              </button>
              <button type="button" class="qp-btn-secondary py-1.5 rounded-full text-xs font-semibold" @click="openEditModal(pres)">
                ✎ Editar
              </button>
              <RouterLink
                to="/productos/fichas-tecnicas"
                class="qp-btn-secondary py-1.5 rounded-full text-xs font-semibold text-center"
              >
                Ficha
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Modal de Creación / Edición de Presentación Comercial -->
    <BaseModal
      v-model="showPresentationModal"
      :title="editingPresentation.id ? `Editar — ${editingPresentation.name}` : 'Registrar Nueva Presentación Comercial'"
    >
      <form class="space-y-4" @submit.prevent="handleSavePresentation">
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">Producto Asociado *</label>
            <select
              v-model="editingPresentation.productName"
              class="w-full h-10 px-3 rounded-xl bg-[#11151F] border border-white/15 text-xs text-white"
            >
              <option value="Palitos de Queso">Palitos de Queso</option>
              <option value="Bolitas de Queso">Bolitas de Queso</option>
              <option value="Mozzarella Sticks">Mozzarella Sticks</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">Nombre Presentación *</label>
            <input
              v-model="editingPresentation.name"
              type="text"
              required
              placeholder="Ej. Presentación Institucional"
              class="w-full h-10 px-3 rounded-xl bg-[#11151F] border border-white/15 text-xs text-white"
            />
          </div>
        </div>

        <div class="grid grid-cols-3 gap-3">
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">Peso Neto *</label>
            <input
              v-model="editingPresentation.netWeight"
              type="text"
              required
              placeholder="Ej. 500 g"
              class="w-full h-10 px-3 rounded-xl bg-[#11151F] border border-white/15 text-xs text-white"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">Unidades / Paquete *</label>
            <input
              v-model.number="editingPresentation.unitsPerPackage"
              type="number"
              min="1"
              required
              class="w-full h-10 px-3 rounded-xl bg-[#11151F] border border-white/15 text-xs text-white"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">Precio Sugerido (COP) *</label>
            <input
              v-model.number="editingPresentation.suggestedPrice"
              type="number"
              min="500"
              required
              class="w-full h-10 px-3 rounded-xl bg-[#11151F] border border-white/15 text-xs text-white"
            />
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Descripción Comercial</label>
          <textarea
            v-model="editingPresentation.description"
            rows="2"
            class="w-full p-3 rounded-xl bg-[#11151F] border border-white/15 text-xs text-white"
          ></textarea>
        </div>

        <div class="flex justify-end gap-2">
          <button type="button" class="qp-btn-secondary px-4 py-2 rounded-xl text-xs" @click="showPresentationModal = false">
            Cancelar
          </button>
          <button type="submit" class="qp-btn-primary px-5 py-2 rounded-xl text-xs font-bold">
            Guardar Presentación
          </button>
        </div>
      </form>
    </BaseModal>

    <!-- Modal Detalle -->
    <BaseModal
      v-model="showDetailModal"
      :title="`Detalle Comercial — ${selectedPresentation?.productName || ''} (${selectedPresentation?.name || ''})`"
    >
      <div v-if="selectedPresentation" class="space-y-2.5 text-xs">
        <div class="p-3 rounded-xl bg-white/5 flex justify-between">
          <span>Código Empaque:</span>
          <strong class="text-white">{{ selectedPresentation.code }}</strong>
        </div>
        <div class="p-3 rounded-xl bg-white/5 flex justify-between">
          <span>Peso Neto por Paquete:</span>
          <strong class="text-white">{{ selectedPresentation.netWeight }}</strong>
        </div>
        <div class="p-3 rounded-xl bg-white/5 flex justify-between">
          <span>Unidades por Paquete:</span>
          <strong class="text-white">{{ selectedPresentation.unitsPerPackage }} unidades</strong>
        </div>
        <div class="p-3 rounded-xl bg-white/5 flex justify-between">
          <span>Precio Sugerido al Público:</span>
          <strong class="text-amber-400">{{ formatCurrencyCOP(selectedPresentation.suggestedPrice, true) }}</strong>
        </div>
        <div class="p-3 rounded-xl bg-white/5 flex justify-between">
          <span>Ventas Mensuales Promedio:</span>
          <strong class="text-emerald-400">{{ formatNumber(selectedPresentation.monthlySales) }} und.</strong>
        </div>
      </div>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useEnterpriseStore } from '../stores/useEnterpriseStore.js'
import { formatNumber, formatCurrencyCOP } from '../utils/formatters.js'
import BaseModal from '../components/common/BaseModal.vue'

import presMainSkin from '../assets/images/skins/presentations-main.png'
import heroIconPresentations from '../assets/images/hero-icon-presentations.png'
import heroPresentationsArt from '../assets/images/hero-presentations-art.png'
import presCard1 from '../assets/images/pres-card-1.png'
import presCard2 from '../assets/images/pres-card-2.png'
import presCard3 from '../assets/images/pres-card-3.png'

defineProps({
  isReferenceDesktop: { type: Boolean, default: false }
})

const store = useEnterpriseStore()
const searchQuery = ref('')
const forceDynamic = ref(false)
const showPresentationModal = ref(false)
const showDetailModal = ref(false)
const selectedPresentation = ref(null)

const editingPresentation = ref({
  id: null,
  productName: 'Palitos de Queso',
  name: '',
  netWeight: '150 g',
  unitsPerPackage: 10,
  suggestedPrice: 4800,
  description: ''
})

const isDefaultReferenceState = computed(() => {
  return !forceDynamic.value && searchQuery.value.trim() === ''
})

const filteredPresentations = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  return store.presentations.filter(
    (p) => !q || p.name.toLowerCase().includes(q) || p.productName.toLowerCase().includes(q)
  )
})

function resolvePresentationImage(key) {
  if (key === 'pres-card-2') return presCard2
  if (key === 'pres-card-3') return presCard3
  return presCard1
}

function openCreateModal() {
  editingPresentation.value = {
    id: null,
    productName: 'Palitos de Queso',
    name: '',
    netWeight: '150 g',
    unitsPerPackage: 10,
    suggestedPrice: 4800,
    description: ''
  }
  showPresentationModal.value = true
}

function openEditModal(pres) {
  editingPresentation.value = { ...pres }
  showPresentationModal.value = true
}

function inspectPresentation(pres) {
  selectedPresentation.value = pres
  showDetailModal.value = true
}

async function handleSavePresentation() {
  await store.savePresentation(editingPresentation.value)
  showPresentationModal.value = false
  forceDynamic.value = true
}

function resetToReference() {
  searchQuery.value = ''
  forceDynamic.value = false
}
</script>
