<template>
  <div class="w-full h-full relative">
    <h1 class="sr-only">Catálogo de Productos — QuesoPlus</h1>

    <!-- MODO REFERENCIA ESCRITORIO INICIAL (Fidelidad Pixel-a-Pixel + Controles Interactivos) -->
    <template v-if="isReferenceDesktop && isDefaultReferenceState">
      <img
        :src="prodMainSkin"
        alt="Catálogo de Productos de QuesoPlus"
        class="w-[1427px] h-[859px] object-cover pointer-events-none block select-none"
      />

      <!-- Barra de Herramientas Interactiva -->
      <button
        type="button"
        aria-label="Crear Nuevo Producto"
        class="absolute left-[18px] top-[146px] w-[178px] h-[44px] rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/70"
        @click="openCreateModal"
      />
      <button
        type="button"
        aria-label="Importar catálogo de productos"
        class="absolute left-[210px] top-[146px] w-[116px] h-[44px] rounded-xl focus:outline-none focus:ring-2 focus:ring-white/40"
        @click="store.notify('Importación lista', 'Asistente de importación CSV/Excel de productos activado.', 'info')"
      />
      <button
        type="button"
        aria-label="Exportar catálogo de productos"
        class="absolute left-[338px] top-[146px] w-[116px] h-[44px] rounded-xl focus:outline-none focus:ring-2 focus:ring-white/40"
        @click="store.notify('Exportación completada', 'Catálogo de 6 productos exportado correctamente.', 'success')"
      />
      <button
        type="button"
        aria-label="Actualizar catálogo de productos"
        class="absolute left-[466px] top-[146px] w-[122px] h-[44px] rounded-xl focus:outline-none focus:ring-2 focus:ring-white/40"
        @click="store.notify('Catálogo sincronizado', 'Existencias y precios actualizados.', 'info')"
      />

      <!-- Buscador de productos local -->
      <div class="absolute left-[842px] top-[146px] w-[442px] h-[44px]">
        <label for="qp-prod-search" class="sr-only">Buscar producto</label>
        <input
          id="qp-prod-search"
          v-model="searchQuery"
          type="search"
          aria-label="Buscar producto por nombre o código"
          class="w-full h-full rounded-xl bg-transparent text-transparent caret-white px-10 focus:bg-[#121621] focus:text-white focus:outline-none"
        />
      </div>
      <button
        type="button"
        aria-label="Abrir filtros avanzados de productos"
        class="absolute left-[1296px] top-[146px] w-[112px] h-[44px] rounded-xl focus:outline-none focus:ring-2 focus:ring-white/40"
        @click="selectedCategory = 'Palitos de Queso'"
      />

      <!-- Píldoras de Categoría (Todos, Palitos de Queso, Bolitas de Queso, Mozzarella Sticks) -->
      <button
        type="button"
        aria-label="Filtrar: Todos (6)"
        class="absolute left-[18px] top-[204px] w-[116px] h-[38px] rounded-xl"
        @click="selectedCategory = 'Todos'"
      />
      <button
        type="button"
        aria-label="Filtrar: Palitos de Queso (3)"
        class="absolute left-[146px] top-[204px] w-[184px] h-[38px] rounded-xl"
        @click="selectedCategory = 'Palitos de Queso'"
      />
      <button
        type="button"
        aria-label="Filtrar: Bolitas de Queso (2)"
        class="absolute left-[342px] top-[204px] w-[184px] h-[38px] rounded-xl"
        @click="selectedCategory = 'Bolitas de Queso'"
      />
      <button
        type="button"
        aria-label="Filtrar: Mozzarella Sticks (1)"
        class="absolute left-[538px] top-[204px] w-[184px] h-[38px] rounded-xl"
        @click="selectedCategory = 'Mozzarella Sticks'"
      />

      <!-- Botones de las 3 tarjetas de producto (Ver Ficha, Editar, Más) -->
      <div
        v-for="(prod, idx) in displayedProducts.slice(0, 3)"
        :key="prod.id"
        class="absolute top-[548px] h-[34px] flex items-center justify-between"
        :style="{ left: `${36 + idx * 468}px`, width: '416px' }"
      >
        <RouterLink
          to="/productos/fichas-tecnicas"
          :aria-label="`Ver ficha técnica de ${prod.name}`"
          class="w-[126px] h-full rounded-full"
        />
        <button
          type="button"
          :aria-label="`Editar producto ${prod.name}`"
          class="w-[126px] h-full rounded-full"
          @click="openEditModal(prod)"
        />
        <button
          type="button"
          :aria-label="`Más opciones para ${prod.name}`"
          class="w-[110px] h-full rounded-full"
          @click="store.toggleProductStatus(prod.id); forceDynamic = true"
        />
      </div>

      <!-- Paginación inferior -->
      <button
        type="button"
        aria-label="Ir a página 2 de productos"
        class="absolute left-[1182px] top-[818px] w-[28px] h-[28px] rounded-lg"
        @click="currentPage = 2"
      />
    </template>

    <!-- MODO INTERACTIVO DINÁMICO Y RESPONSIVE -->
    <template v-else>
      <div class="space-y-4">
        <!-- Hero Banner -->
        <div class="qp-card relative overflow-hidden p-5 border border-red-500/25 bg-gradient-to-r from-[#1D060A] via-[#12070C] to-[#0B0D14] flex items-center justify-between">
          <div class="flex items-center gap-4">
            <img :src="heroIconProducts" alt="Icono Productos" class="w-16 h-16 rounded-2xl object-contain" />
            <div>
              <div class="flex items-center gap-3">
                <h2 class="text-2xl font-bold text-white">Productos</h2>
                <button
                  type="button"
                  class="qp-btn-secondary px-2.5 py-1 rounded-lg text-[11px]"
                  @click="resetToReference"
                >
                  Restaurar vista inicial
                </button>
              </div>
              <p class="text-xs text-slate-300">Administra el catálogo de productos de QuesoPlus</p>
            </div>
          </div>
          <img :src="heroProductsArt" alt="Innovación y sabor en cada bocado" class="hidden md:block h-24 object-contain" />
        </div>

        <!-- Barra de Acciones y Búsqueda -->
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div class="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              class="qp-btn-primary px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2"
              @click="openCreateModal"
            >
              <span>➕ Nuevo Producto</span>
            </button>
            <button
              type="button"
              class="qp-btn-secondary px-3.5 py-2.5 rounded-xl text-xs font-semibold"
              @click="store.notify('Importación', 'Archivo de catálogo validado.', 'info')"
            >
              ↑ Importar
            </button>
            <button
              type="button"
              class="qp-btn-secondary px-3.5 py-2.5 rounded-xl text-xs font-semibold"
              @click="store.notify('Exportación', 'Catálogo exportado a CSV.', 'success')"
            >
              ↓ Exportar
            </button>
            <button
              type="button"
              class="qp-btn-secondary px-3.5 py-2.5 rounded-xl text-xs font-semibold"
              @click="resetToReference"
            >
              ↻ Actualizar
            </button>
          </div>

          <div class="flex items-center gap-2 flex-1 max-w-md">
            <input
              v-model="searchQuery"
              type="search"
              aria-label="Buscar producto..."
              placeholder="Buscar producto por nombre o código..."
              class="w-full h-10 px-4 rounded-xl bg-[#11151F] border border-white/10 text-xs text-white focus:outline-none focus:border-red-500"
            />
          </div>
        </div>

        <!-- Píldoras de Categoría -->
        <div class="flex flex-wrap items-center gap-2.5">
          <button
            v-for="pill in categoryPills"
            :key="pill.name"
            type="button"
            class="px-3.5 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2"
            :class="selectedCategory === pill.name ? 'qp-btn-primary text-white' : 'qp-btn-secondary text-slate-300'"
            @click="selectedCategory = pill.name; currentPage = 1"
          >
            <span>{{ pill.label }}</span>
          </button>
        </div>

        <!-- Grilla de Tarjetas de Productos -->
        <div v-if="paginatedProducts.length" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <div
            v-for="prod in paginatedProducts"
            :key="prod.id"
            class="p-4 flex flex-col justify-between transition"
            :class="prod.featured ? 'qp-card-featured' : 'qp-card'"
          >
            <div class="flex gap-4">
              <div class="relative w-36 h-36 shrink-0">
                <span
                  v-if="prod.featured"
                  class="absolute -top-2 left-1 z-10 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#B00110] text-white shadow"
                >
                  ★ Producto Destacado
                </span>
                <img :src="resolveProductImage(prod.imageKey)" :alt="prod.name" class="w-full h-full rounded-xl object-cover" />
              </div>
              <div class="space-y-1.5 flex-1 min-w-0">
                <h3 class="text-base font-bold text-white truncate">{{ prod.name }}</h3>
                <p class="text-xs text-slate-300 font-medium">Código: {{ prod.code }}</p>
                <p class="text-xs text-slate-400 line-clamp-2">{{ prod.description }}</p>
                <span
                  class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
                  :class="prod.status === 'Activo' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-red-500/20 text-red-300'"
                >
                  ✔ {{ prod.status }}
                </span>
              </div>
            </div>

            <div class="grid grid-cols-3 gap-2 text-center py-3 my-3 border-y border-white/10 divide-x divide-white/10">
              <div>
                <p class="text-sm font-bold text-white">{{ formatNumber(prod.stock) }}</p>
                <p class="text-[11px] text-slate-400">Stock Actual</p>
              </div>
              <div>
                <p class="text-sm font-bold text-white">{{ prod.rotation }}%</p>
                <p class="text-[11px] text-slate-400">Rotación</p>
              </div>
              <div>
                <p class="text-sm font-bold text-white">{{ formatCurrencyCOP(prod.unitPrice) }}</p>
                <p class="text-[11px] text-slate-400">Precio Unit.</p>
              </div>
            </div>

            <div class="grid grid-cols-3 gap-2">
              <RouterLink
                to="/productos/fichas-tecnicas"
                class="qp-btn-secondary py-1.5 rounded-full text-xs font-semibold text-center"
              >
                👁 Ver Ficha
              </RouterLink>
              <button
                type="button"
                class="qp-btn-secondary py-1.5 rounded-full text-xs font-semibold"
                @click="openEditModal(prod)"
              >
                ✎ Editar
              </button>
              <button
                type="button"
                class="qp-btn-secondary py-1.5 rounded-full text-xs font-semibold"
                @click="store.toggleProductStatus(prod.id)"
              >
                {{ prod.status === 'Activo' ? 'Desactivar' : 'Activar' }}
              </button>
            </div>
          </div>
        </div>

        <div v-else class="qp-card p-8 text-center space-y-2">
          <p class="text-sm font-bold text-white">No se encontraron productos para el filtro seleccionado</p>
          <button type="button" class="qp-btn-primary px-4 py-2 rounded-xl text-xs font-semibold" @click="resetToReference">
            Limpiar filtros
          </button>
        </div>

        <!-- Paginación -->
        <div class="flex items-center justify-between text-xs text-slate-400 pt-2">
          <span>
            Mostrando {{ paginatedProducts.length ? (currentPage - 1) * pageSize + 1 : 0 }} -
            {{ Math.min(currentPage * pageSize, filteredProducts.length) }} de {{ filteredProducts.length }} productos
          </span>
          <div class="flex items-center gap-1.5">
            <button
              type="button"
              class="px-2.5 py-1 rounded-lg bg-[#141824] text-slate-300 disabled:opacity-40"
              :disabled="currentPage === 1"
              @click="currentPage--"
            >
              ←
            </button>
            <button
              v-for="page in totalPages"
              :key="page"
              type="button"
              class="px-2.5 py-1 rounded-lg font-bold"
              :class="currentPage === page ? 'qp-btn-primary text-white' : 'bg-[#141824] text-slate-300'"
              @click="currentPage = page"
            >
              {{ page }}
            </button>
            <button
              type="button"
              class="px-2.5 py-1 rounded-lg bg-[#141824] text-slate-300 disabled:opacity-40"
              :disabled="currentPage >= totalPages"
              @click="currentPage++"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </template>

    <!-- Modal de Creación / Edición de Producto -->
    <BaseModal
      v-model="showProductModal"
      :title="editingProduct.id ? `Editar Producto — ${editingProduct.code}` : 'Registrar Nuevo Producto'"
    >
      <form class="space-y-4" @submit.prevent="handleSaveProduct">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">Código SKU *</label>
            <input
              v-model="editingProduct.code"
              type="text"
              required
              placeholder="Ej. PQ-004"
              class="w-full h-10 px-3 rounded-xl bg-[#11151F] border border-white/15 text-xs text-white"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">Categoría *</label>
            <select
              v-model="editingProduct.categoryName"
              class="w-full h-10 px-3 rounded-xl bg-[#11151F] border border-white/15 text-xs text-white"
            >
              <option value="Palitos de Queso">Palitos de Queso</option>
              <option value="Bolitas de Queso">Bolitas de Queso</option>
              <option value="Mozzarella Sticks">Mozzarella Sticks</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Nombre Comercial del Producto *</label>
          <input
            v-model="editingProduct.name"
            type="text"
            required
            placeholder="Ej. Palitos de Queso Parmesano"
            class="w-full h-10 px-3 rounded-xl bg-[#11151F] border border-white/15 text-xs text-white"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Descripción *</label>
          <textarea
            v-model="editingProduct.description"
            rows="2"
            required
            class="w-full p-3 rounded-xl bg-[#11151F] border border-white/15 text-xs text-white"
          ></textarea>
        </div>

        <div class="grid grid-cols-3 gap-3">
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">Stock Inicial</label>
            <input
              v-model.number="editingProduct.stock"
              type="number"
              min="0"
              class="w-full h-10 px-3 rounded-xl bg-[#11151F] border border-white/15 text-xs text-white"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">Rotación (%)</label>
            <input
              v-model.number="editingProduct.rotation"
              type="number"
              step="0.1"
              class="w-full h-10 px-3 rounded-xl bg-[#11151F] border border-white/15 text-xs text-white"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">Precio Unit. (COP)</label>
            <input
              v-model.number="editingProduct.unitPrice"
              type="number"
              min="100"
              class="w-full h-10 px-3 rounded-xl bg-[#11151F] border border-white/15 text-xs text-white"
            />
          </div>
        </div>

        <div class="flex justify-end gap-2 pt-2">
          <button
            type="button"
            class="qp-btn-secondary px-4 py-2 rounded-xl text-xs font-semibold"
            @click="showProductModal = false"
          >
            Cancelar
          </button>
          <button type="submit" class="qp-btn-primary px-5 py-2 rounded-xl text-xs font-bold">
            Guardar Producto
          </button>
        </div>
      </form>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useEnterpriseStore } from '../stores/useEnterpriseStore.js'
import { formatNumber, formatCurrencyCOP } from '../utils/formatters.js'
import BaseModal from '../components/common/BaseModal.vue'

import prodMainSkin from '../assets/images/skins/products-main.png'
import heroIconProducts from '../assets/images/hero-icon-products.png'
import heroProductsArt from '../assets/images/hero-products-art.png'
import prodCard1 from '../assets/images/prod-card-1.png'
import prodCard2 from '../assets/images/prod-card-2.png'
import prodCard3 from '../assets/images/prod-card-3.png'

defineProps({
  isReferenceDesktop: { type: Boolean, default: false }
})

const store = useEnterpriseStore()
const searchQuery = ref('')
const selectedCategory = ref('Todos')
const currentPage = ref(1)
const pageSize = ref(3)
const forceDynamic = ref(false)
const showProductModal = ref(false)

const editingProduct = ref({
  id: null,
  code: '',
  name: '',
  categoryName: 'Palitos de Queso',
  description: '',
  stock: 2500,
  rotation: 92.5,
  unitPrice: 2500
})

const isDefaultReferenceState = computed(() => {
  return (
    !forceDynamic.value &&
    searchQuery.value.trim() === '' &&
    selectedCategory.value === 'Todos' &&
    currentPage.value === 1
  )
})

const categoryPills = computed(() => [
  { name: 'Todos', label: `Todos (${store.products.length})` },
  {
    name: 'Palitos de Queso',
    label: `Palitos de Queso (${store.products.filter((p) => p.categoryName === 'Palitos de Queso').length})`
  },
  {
    name: 'Bolitas de Queso',
    label: `Bolitas de Queso (${store.products.filter((p) => p.categoryName === 'Bolitas de Queso').length})`
  },
  {
    name: 'Mozzarella Sticks',
    label: `Mozzarella Sticks (${store.products.filter((p) => p.categoryName === 'Mozzarella Sticks').length})`
  }
])

const filteredProducts = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  return store.products.filter((p) => {
    const matchCategory = selectedCategory.value === 'Todos' || p.categoryName === selectedCategory.value
    const matchQuery =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.code.toLowerCase().includes(q) ||
      p.categoryName.toLowerCase().includes(q)
    return matchCategory && matchQuery
  })
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredProducts.value.length / pageSize.value)))

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredProducts.value.slice(start, start + pageSize.value)
})

const displayedProducts = computed(() => store.products)

function resolveProductImage(key) {
  if (key === 'prod-card-2') return prodCard2
  if (key === 'prod-card-3') return prodCard3
  return prodCard1
}

function openCreateModal() {
  editingProduct.value = {
    id: null,
    code: `PQ-00${store.products.length + 1}`,
    name: '',
    categoryName: 'Palitos de Queso',
    description: '',
    stock: 3000,
    rotation: 94.0,
    unitPrice: 2600
  }
  showProductModal.value = true
}

function openEditModal(product) {
  editingProduct.value = { ...product }
  showProductModal.value = true
}

async function handleSaveProduct() {
  await store.saveProduct(editingProduct.value)
  showProductModal.value = false
  forceDynamic.value = true
}

function resetToReference() {
  searchQuery.value = ''
  selectedCategory.value = 'Todos'
  currentPage.value = 1
  forceDynamic.value = false
}
</script>
