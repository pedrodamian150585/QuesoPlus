<template>
  <div class="w-full h-full relative">
    <h1 class="sr-only">Categorías de Productos — QuesoPlus</h1>

    <!-- MODO REFERENCIA ESCRITORIO INICIAL (Fidelidad Pixel-a-Pixel + Controles Interactivos) -->
    <template v-if="isReferenceDesktop && isDefaultReferenceState">
      <img
        :src="catMainSkin"
        alt="Categorías de Productos de QuesoPlus"
        class="w-[1427px] h-[859px] object-cover pointer-events-none block select-none"
      />

      <!-- Breadcrumbs interactivos -->
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
        aria-label="Crear Nueva Categoría"
        class="absolute left-[22px] top-[296px] w-[162px] h-[44px] rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/70"
        @click="openCreateModal"
      />
      <button
        type="button"
        aria-label="Exportar categorías"
        class="absolute left-[196px] top-[296px] w-[112px] h-[44px] rounded-xl"
        @click="store.notify('Exportación exitosa', 'Listado de categorías exportado.', 'success')"
      />
      <button
        type="button"
        aria-label="Importar categorías"
        class="absolute left-[320px] top-[296px] w-[112px] h-[44px] rounded-xl"
        @click="store.notify('Importación lista', 'Seleccione archivo de categorías.', 'info')"
      />
      <button
        type="button"
        aria-label="Actualizar categorías"
        class="absolute left-[444px] top-[296px] w-[122px] h-[44px] rounded-xl"
        @click="store.notify('Categorías actualizadas', 'Conteos sincronizados con catálogo.', 'info')"
      />

      <!-- Buscador de categorías -->
      <div class="absolute left-[762px] top-[296px] w-[392px] h-[44px]">
        <label for="qp-cat-search" class="sr-only">Buscar categoría</label>
        <input
          id="qp-cat-search"
          v-model="searchQuery"
          type="search"
          aria-label="Buscar categoría por nombre"
          class="w-full h-full rounded-xl bg-transparent text-transparent caret-white px-10 focus:bg-[#121621] focus:text-white focus:outline-none"
        />
      </div>

      <!-- Conmutador de vista (Grilla / Tabla) -->
      <button
        type="button"
        aria-label="Cambiar a vista de tabla de categorías"
        class="absolute left-[1352px] top-[296px] w-[44px] h-[44px] rounded-xl"
        @click="viewMode = 'table'; forceDynamic = true"
      />

      <!-- Botones en las 3 tarjetas de categorías (Ver Detalle, Editar, Más) -->
      <div
        v-for="(cat, idx) in store.categories.slice(0, 3)"
        :key="cat.id"
        class="absolute top-[716px] h-[36px] flex items-center justify-between"
        :style="{ left: `${44 + idx * 467}px`, width: '404px' }"
      >
        <button
          type="button"
          :aria-label="`Ver detalle de categoría ${cat.name}`"
          class="w-[126px] h-full rounded-full"
          @click="inspectCategory(cat)"
        />
        <button
          type="button"
          :aria-label="`Editar categoría ${cat.name}`"
          class="w-[120px] h-full rounded-full"
          @click="openEditModal(cat)"
        />
        <button
          type="button"
          :aria-label="`Cambiar estado de categoría ${cat.name}`"
          class="w-[106px] h-full rounded-full"
          @click="store.toggleCategoryStatus(cat.id); forceDynamic = true"
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
            <span class="text-white font-semibold">Categorías</span>
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
            <img :src="heroIconCategories" alt="Categorías" class="w-16 h-16 rounded-2xl object-contain" />
            <div>
              <h2 class="text-2xl font-bold text-white">Categorías de Productos</h2>
              <p class="text-xs text-slate-300">Organiza y gestiona las categorías de tu catálogo</p>
            </div>
          </div>
          <img :src="heroCategoriesArt" alt="Variedad y sabor en cada categoría" class="hidden md:block h-24 object-contain" />
        </div>

        <!-- Barra de herramientas -->
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center gap-2.5">
            <button
              type="button"
              class="qp-btn-primary px-4 py-2.5 rounded-xl text-xs font-bold"
              @click="openCreateModal"
            >
              ➕ Nueva Categoría
            </button>
            <button
              type="button"
              class="qp-btn-secondary px-3.5 py-2.5 rounded-xl text-xs font-semibold"
              @click="resetToReference"
            >
              ↻ Actualizar
            </button>
          </div>

          <div class="flex items-center gap-2">
            <input
              v-model="searchQuery"
              type="search"
              aria-label="Buscar categoría..."
              placeholder="Buscar categoría..."
              class="h-10 px-4 rounded-xl bg-[#11151F] border border-white/10 text-xs text-white"
            />
            <button
              type="button"
              class="px-3 py-2 rounded-xl text-xs font-semibold"
              :class="viewMode === 'grid' ? 'qp-btn-primary' : 'qp-btn-secondary'"
              @click="viewMode = 'grid'"
            >
              Grilla
            </button>
            <button
              type="button"
              class="px-3 py-2 rounded-xl text-xs font-semibold"
              :class="viewMode === 'table' ? 'qp-btn-primary' : 'qp-btn-secondary'"
              @click="viewMode = 'table'"
            >
              Lista
            </button>
          </div>
        </div>

        <!-- Grilla de Categorías -->
        <div v-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            v-for="cat in filteredCategories"
            :key="cat.id"
            class="qp-card overflow-hidden p-4 flex flex-col justify-between border-b-4"
            :class="
              cat.themeColor === 'amber'
                ? 'border-b-amber-500'
                : cat.themeColor === 'purple'
                ? 'border-b-purple-500'
                : 'border-b-red-600'
            "
          >
            <div>
              <div class="relative h-44 mb-3">
                <span class="absolute top-2.5 left-2.5 z-10 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500 text-white">
                  ✔ {{ cat.status }}
                </span>
                <img :src="resolveCategoryImage(cat.imageKey)" :alt="cat.name" class="w-full h-full object-cover rounded-xl" />
              </div>
              <h3 class="text-base font-bold text-white">{{ cat.name }}</h3>
              <p class="text-xs text-slate-300 mt-0.5">{{ cat.description }}</p>
            </div>

            <div class="grid grid-cols-3 gap-2 text-center py-3 my-3 border-y border-white/10 divide-x divide-white/10">
              <div>
                <p class="text-sm font-bold text-white">{{ cat.productsCount }}</p>
                <p class="text-[11px] text-slate-400">Productos</p>
              </div>
              <div>
                <p class="text-sm font-bold text-white">{{ cat.presentationsCount }}</p>
                <p class="text-[11px] text-slate-400">Presentaciones</p>
              </div>
              <div>
                <p class="text-sm font-bold text-white">{{ cat.share }}%</p>
                <p class="text-[11px] text-slate-400">Participación</p>
              </div>
            </div>

            <div class="grid grid-cols-3 gap-2">
              <button type="button" class="qp-btn-secondary py-1.5 rounded-full text-xs font-semibold" @click="inspectCategory(cat)">
                👁 Ver Detalle
              </button>
              <button type="button" class="qp-btn-secondary py-1.5 rounded-full text-xs font-semibold" @click="openEditModal(cat)">
                ✎ Editar
              </button>
              <button
                type="button"
                class="qp-btn-secondary py-1.5 rounded-full text-xs font-semibold"
                @click="store.toggleCategoryStatus(cat.id)"
              >
                {{ cat.status === 'Activa' ? 'Desactivar' : 'Activar' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Vista de Tabla -->
        <div v-else class="qp-card overflow-hidden">
          <table class="w-full text-left text-xs">
            <thead class="bg-[#121622] text-slate-300 uppercase text-[11px]">
              <tr>
                <th class="p-3.5">Categoría</th>
                <th class="p-3.5">Descripción</th>
                <th class="p-3.5">Productos</th>
                <th class="p-3.5">Presentaciones</th>
                <th class="p-3.5">Participación</th>
                <th class="p-3.5">Estado</th>
                <th class="p-3.5">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/10">
              <tr v-for="cat in filteredCategories" :key="cat.id" class="hover:bg-white/[0.02]">
                <td class="p-3.5 font-bold text-white">{{ cat.name }}</td>
                <td class="p-3.5 text-slate-300">{{ cat.description }}</td>
                <td class="p-3.5">{{ cat.productsCount }}</td>
                <td class="p-3.5">{{ cat.presentationsCount }}</td>
                <td class="p-3.5 font-semibold">{{ cat.share }}%</td>
                <td class="p-3.5">{{ cat.status }}</td>
                <td class="p-3.5">
                  <button type="button" class="text-red-400 hover:underline mr-2" @click="openEditModal(cat)">Editar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>

    <!-- Modal de Creación / Edición de Categoría -->
    <BaseModal
      v-model="showCategoryModal"
      :title="editingCategory.id ? `Editar Categoría — ${editingCategory.name}` : 'Nueva Categoría de Productos'"
    >
      <form class="space-y-4" @submit.prevent="handleSaveCategory">
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Nombre de la Categoría *</label>
          <input
            v-model="editingCategory.name"
            type="text"
            required
            placeholder="Ej. Tequeños Gourmet"
            class="w-full h-10 px-3 rounded-xl bg-[#11151F] border border-white/15 text-xs text-white"
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Descripción *</label>
          <textarea
            v-model="editingCategory.description"
            rows="2"
            required
            class="w-full p-3 rounded-xl bg-[#11151F] border border-white/15 text-xs text-white"
          ></textarea>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">Participación Estimada (%)</label>
            <input
              v-model.number="editingCategory.share"
              type="number"
              step="0.1"
              class="w-full h-10 px-3 rounded-xl bg-[#11151F] border border-white/15 text-xs text-white"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">Estado</label>
            <select
              v-model="editingCategory.status"
              class="w-full h-10 px-3 rounded-xl bg-[#11151F] border border-white/15 text-xs text-white"
            >
              <option value="Activa">Activa</option>
              <option value="Inactiva">Inactiva</option>
            </select>
          </div>
        </div>
        <div class="flex justify-end gap-2">
          <button type="button" class="qp-btn-secondary px-4 py-2 rounded-xl text-xs" @click="showCategoryModal = false">
            Cancelar
          </button>
          <button type="submit" class="qp-btn-primary px-5 py-2 rounded-xl text-xs font-bold">
            Guardar Categoría
          </button>
        </div>
      </form>
    </BaseModal>

    <!-- Modal de Detalle de Categoría y Productos Asociados -->
    <BaseModal
      v-model="showDetailModal"
      :title="`Productos Asociados — ${selectedCategoryDetail?.name || ''}`"
    >
      <div v-if="selectedCategoryDetail" class="space-y-3 text-xs">
        <p class="text-slate-300">{{ selectedCategoryDetail.description }}</p>
        <div class="space-y-2">
          <div
            v-for="p in store.products.filter((item) => item.categoryName === selectedCategoryDetail.name)"
            :key="p.id"
            class="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between"
          >
            <div>
              <p class="font-bold text-white">{{ p.name }} ({{ p.code }})</p>
              <p class="text-slate-400">Stock: {{ formatNumber(p.stock) }} und.</p>
            </div>
            <span class="font-bold text-amber-400">{{ formatCurrencyCOP(p.unitPrice) }}</span>
          </div>
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

import catMainSkin from '../assets/images/skins/categories-main.png'
import heroIconCategories from '../assets/images/hero-icon-categories.png'
import heroCategoriesArt from '../assets/images/hero-categories-art.png'
import catCard1 from '../assets/images/cat-card-1.png'
import catCard2 from '../assets/images/cat-card-2.png'
import catCard3 from '../assets/images/cat-card-3.png'

defineProps({
  isReferenceDesktop: { type: Boolean, default: false }
})

const store = useEnterpriseStore()
const searchQuery = ref('')
const viewMode = ref('grid')
const forceDynamic = ref(false)
const showCategoryModal = ref(false)
const showDetailModal = ref(false)
const selectedCategoryDetail = ref(null)

const editingCategory = ref({
  id: null,
  name: '',
  description: '',
  share: 45.0,
  status: 'Activa'
})

const isDefaultReferenceState = computed(() => {
  return !forceDynamic.value && searchQuery.value.trim() === '' && viewMode.value === 'grid'
})

const filteredCategories = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  return store.categories.filter((c) => !q || c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q))
})

function resolveCategoryImage(key) {
  if (key === 'cat-card-2') return catCard2
  if (key === 'cat-card-3') return catCard3
  return catCard1
}

function openCreateModal() {
  editingCategory.value = { id: null, name: '', description: '', share: 25.0, status: 'Activa' }
  showCategoryModal.value = true
}

function openEditModal(cat) {
  editingCategory.value = { ...cat }
  showCategoryModal.value = true
}

function inspectCategory(cat) {
  selectedCategoryDetail.value = cat
  showDetailModal.value = true
}

async function handleSaveCategory() {
  await store.saveCategory(editingCategory.value)
  showCategoryModal.value = false
  forceDynamic.value = true
}

function resetToReference() {
  searchQuery.value = ''
  viewMode.value = 'grid'
  forceDynamic.value = false
}
</script>
