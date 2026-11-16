<template>
  <div class="w-full h-full relative">
    <h1 class="sr-only">Ficha Técnica del Producto — QuesoPlus</h1>

    <!-- MODO REFERENCIA ESCRITORIO INICIAL (Fidelidad Pixel-a-Pixel + Controles Interactivos) -->
    <template v-if="isReferenceDesktop && activeTab === 'general' && selectedThumb === 0 && !forceDynamic">
      <img
        :src="techMainSkin"
        alt="Ficha Técnica del Producto — Palitos de Queso"
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

      <!-- Botones de Acción Superiores (Imprimir, Descargar PDF, Editar, Volver) -->
      <button
        type="button"
        aria-label="Imprimir Ficha Técnica"
        class="absolute left-[842px] top-[116px] w-[96px] h-[36px] rounded-xl"
        @click="store.notify('Impresión preparada', 'Ficha técnica PQ-001 enviada a cola de impresión.', 'info')"
      />
      <button
        type="button"
        aria-label="Descargar PDF de Ficha Técnica"
        class="absolute left-[948px] top-[116px] w-[124px] h-[36px] rounded-xl"
        @click="store.notify('PDF generado', 'Archivo Ficha_Tecnica_PQ-001.pdf descargado.', 'success')"
      />
      <button
        type="button"
        aria-label="Editar Ficha Técnica"
        class="absolute left-[1080px] top-[116px] w-[86px] h-[36px] rounded-xl"
        @click="showEditModal = true"
      />
      <RouterLink
        to="/productos"
        aria-label="Volver al catálogo de productos"
        class="absolute left-[1176px] top-[116px] w-[86px] h-[36px] rounded-xl"
      />

      <!-- 4 Miniaturas de Galería -->
      <button
        v-for="idx in [0, 1, 2, 3]"
        :key="idx"
        type="button"
        :aria-label="`Ver imagen ${idx + 1} de la galería`"
        class="absolute top-[417px] w-[114px] h-[82px] rounded-xl"
        :style="{ left: `${32 + idx * 124}px` }"
        @click="selectThumbnail(idx)"
      />

      <!-- 6 Pestañas Interactivas (Información General, Ingredientes, Composición Nutricional, Especificaciones Técnicas, Control de Calidad, Historial) -->
      <div role="tablist" aria-label="Secciones de la Ficha Técnica" class="absolute left-[22px] top-[520px] flex items-center">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          role="tab"
          type="button"
          :aria-selected="activeTab === tab.id"
          :aria-label="tab.label"
          class="h-[46px] rounded-t-xl focus:outline-none focus:ring-2 focus:ring-red-500/70"
          :style="{ width: `${tab.width}px` }"
          @click="activeTab = tab.id"
        />
      </div>
    </template>

    <!-- MODO INTERACTIVO DINÁMICO Y RESPONSIVE (Incluye las 6 Pestañas Completas) -->
    <template v-else>
      <div class="space-y-4">
        <div class="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
          <div class="flex items-center gap-2">
            <RouterLink to="/dashboard" class="hover:text-white">🏠</RouterLink>
            <span>&gt;</span>
            <RouterLink to="/productos" class="hover:text-white">Productos</RouterLink>
            <span>&gt;</span>
            <span class="text-white font-semibold">Fichas Técnicas</span>
          </div>
          <div class="flex items-center gap-2">
            <button
              type="button"
              class="qp-btn-secondary px-3 py-1.5 rounded-xl text-xs"
              @click="resetToReference"
            >
              Restaurar vista inicial
            </button>
            <button
              type="button"
              class="qp-btn-secondary px-3 py-1.5 rounded-xl text-xs"
              @click="store.notify('PDF generado', 'Ficha_Tecnica_PQ-001.pdf exportada.', 'success')"
            >
              ⬇ Descargar PDF
            </button>
            <button
              type="button"
              class="qp-btn-primary px-3.5 py-1.5 rounded-xl text-xs font-bold"
              @click="showEditModal = true"
            >
              ✎ Editar
            </button>
            <RouterLink to="/productos" class="qp-btn-secondary px-3 py-1.5 rounded-xl text-xs">
              ← Volver
            </RouterLink>
          </div>
        </div>

        <!-- Cabecera del Producto y Galería -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div class="lg:col-span-4 space-y-2.5">
            <div class="relative rounded-2xl overflow-hidden border border-white/10 h-56">
              <span class="absolute top-3 left-3 z-10 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white">
                ✔ {{ sheet.status }}
              </span>
              <img :src="galleryImages[selectedThumb]" alt="Palitos de Queso" class="w-full h-full object-cover" />
            </div>
            <div class="grid grid-cols-4 gap-2">
              <button
                v-for="(imgUrl, idx) in galleryImages"
                :key="idx"
                type="button"
                class="h-16 rounded-xl overflow-hidden border-2 transition"
                :class="selectedThumb === idx ? 'border-red-500 shadow-[0_0_12px_rgba(225,29,46,0.5)]' : 'border-white/10 opacity-75'"
                @click="selectedThumb = idx"
              >
                <img :src="imgUrl" :alt="`Miniatura ${idx + 1}`" class="w-full h-full object-cover" />
              </button>
            </div>
          </div>

          <div class="lg:col-span-5 flex flex-col justify-center space-y-3 px-2">
            <h2 class="text-3xl font-bold text-white">{{ sheet.commercialName }}</h2>
            <p class="text-base italic text-slate-200">Crujientes por fuera, irresistibles por dentro</p>
            <div class="flex flex-wrap gap-2 text-xs">
              <span class="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold">
                ⭐ Producto Destacado
              </span>
              <span class="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 font-semibold">
                Categoría: {{ sheet.categoryName }}
              </span>
              <span class="px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/40 font-semibold">
                Presentaciones: {{ sheet.presentationsCount }}
              </span>
            </div>
            <p class="text-xs text-slate-300 leading-relaxed">
              Deliciosos palitos de queso elaborados con ingredientes de alta calidad, con un empanizado crujiente y un interior suave y fundente. Ideales para compartir en familia o disfrutar en cualquier momento.
            </p>
          </div>

          <div class="lg:col-span-3 qp-card p-4 space-y-3">
            <h3 class="text-sm font-bold text-white">📊 Resumen del Producto</h3>
            <div class="grid grid-cols-2 gap-2.5 text-xs">
              <div class="p-3 rounded-xl bg-white/[0.04] border border-white/10">
                <p class="text-slate-400">Stock Actual</p>
                <p class="text-base font-bold text-white mt-0.5">{{ formatNumber(sheet.stock) }} und.</p>
              </div>
              <div class="p-3 rounded-xl bg-white/[0.04] border border-white/10">
                <p class="text-slate-400">Ventas Mes</p>
                <p class="text-base font-bold text-white mt-0.5">{{ formatNumber(sheet.monthlySales) }} und.</p>
              </div>
              <div class="p-3 rounded-xl bg-white/[0.04] border border-white/10">
                <p class="text-slate-400">Rotación</p>
                <p class="text-base font-bold text-emerald-400 mt-0.5">{{ sheet.rotation }}%</p>
              </div>
              <div class="p-3 rounded-xl bg-white/[0.04] border border-white/10">
                <p class="text-slate-400">Calificación</p>
                <p class="text-base font-bold text-amber-400 mt-0.5">{{ sheet.rating }} / 5</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Barra de 6 Pestañas -->
        <div role="tablist" class="flex flex-wrap gap-1.5 border-b border-white/10 pb-2">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            role="tab"
            type="button"
            :aria-selected="activeTab === tab.id"
            class="px-4 py-2.5 rounded-xl text-xs font-bold transition"
            :class="activeTab === tab.id ? 'qp-btn-primary text-white' : 'qp-btn-secondary text-slate-300'"
            @click="activeTab = tab.id"
          >
            {{ tab.label }}
          </button>
        </div>

        <!-- Contenido de Pestañas -->
        <div v-if="activeTab === 'general'" class="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div class="qp-card p-4 space-y-2.5 text-xs">
            <h3 class="text-sm font-bold text-white mb-2">ℹ Información General</h3>
            <div class="flex justify-between py-1.5 border-b border-white/5">
              <span class="text-slate-400">Código del Producto:</span>
              <span class="px-2 py-0.5 rounded bg-red-500/20 text-red-300 font-bold">{{ sheet.code }}</span>
            </div>
            <div class="flex justify-between py-1.5 border-b border-white/5">
              <span class="text-slate-400">Nombre Comercial:</span>
              <span class="text-white font-semibold">{{ sheet.commercialName }}</span>
            </div>
            <div class="flex justify-between py-1.5 border-b border-white/5">
              <span class="text-slate-400">Categoría:</span>
              <span class="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-semibold">{{ sheet.categoryName }}</span>
            </div>
            <div class="flex justify-between py-1.5 border-b border-white/5">
              <span class="text-slate-400">Descripción Corta:</span>
              <span class="text-white">{{ sheet.shortDescription }}</span>
            </div>
            <div class="flex justify-between py-1.5 border-b border-white/5">
              <span class="text-slate-400">Presentaciones:</span>
              <span class="text-white">{{ sheet.presentationsText }}</span>
            </div>
            <div class="flex justify-between py-1.5 border-b border-white/5">
              <span class="text-slate-400">Precio Sugerido:</span>
              <span class="text-white font-bold">{{ formatCurrencyCOP(sheet.suggestedPrice, true) }}</span>
            </div>
            <div class="flex justify-between py-1.5">
              <span class="text-slate-400">Estado:</span>
              <span class="text-emerald-400 font-bold">✔ {{ sheet.status }}</span>
            </div>
          </div>

          <div class="qp-card p-4 flex flex-col justify-between">
            <h3 class="text-sm font-bold text-white">🍴 Composición Nutricional (por 100 g)</h3>
            <div class="flex items-center justify-around gap-4 py-3">
              <DonutStatCard
                :size="138"
                :stroke-width="18"
                :center-value="sheet.nutritionPer100g.calories"
                center-label="kcal"
                :segments="[
                  { value: 34, color: '#10B981' },
                  { value: 22.5, color: '#F59E0B' },
                  { value: 18, color: '#E11D2E' }
                ]"
              />
              <div class="space-y-2 text-xs">
                <div class="flex justify-between gap-6">
                  <span class="text-slate-300">● Proteínas</span>
                  <strong class="text-white">{{ sheet.nutritionPer100g.proteins }}</strong>
                </div>
                <div class="flex justify-between gap-6">
                  <span class="text-slate-300">● Grasas Totales</span>
                  <strong class="text-white">{{ sheet.nutritionPer100g.totalFat }}</strong>
                </div>
                <div class="flex justify-between gap-6">
                  <span class="text-slate-300">● Carbohidratos</span>
                  <strong class="text-white">{{ sheet.nutritionPer100g.carbohydrates }}</strong>
                </div>
                <div class="flex justify-between gap-6">
                  <span class="text-slate-300">● Sodio</span>
                  <strong class="text-white">{{ sheet.nutritionPer100g.sodium }}</strong>
                </div>
              </div>
            </div>
            <p class="text-center text-xs text-slate-300 border-t border-white/10 pt-2">
              Valor Energético: {{ sheet.nutritionPer100g.calories }} kcal / 100 g
            </p>
          </div>

          <div class="qp-card p-4 space-y-2.5 text-xs">
            <h3 class="text-sm font-bold text-white mb-2">⚙ Especificaciones Técnicas</h3>
            <div class="flex justify-between py-1.5 border-b border-white/5">
              <span class="text-slate-400">Peso Neto por Unidad:</span>
              <span class="text-white font-semibold">{{ sheet.technicalSpecs.unitNetWeight }}</span>
            </div>
            <div class="flex justify-between py-1.5 border-b border-white/5">
              <span class="text-slate-400">Dimensiones Empaque:</span>
              <span class="text-white font-semibold">{{ sheet.technicalSpecs.packageDimensions }}</span>
            </div>
            <div class="flex justify-between py-1.5 border-b border-white/5">
              <span class="text-slate-400">Temperatura de Conservación:</span>
              <span class="text-white font-semibold">{{ sheet.technicalSpecs.storageTemperature }}</span>
            </div>
            <div class="flex justify-between py-1.5 border-b border-white/5">
              <span class="text-slate-400">Vida Útil:</span>
              <span class="text-white font-semibold">{{ sheet.technicalSpecs.shelfLife }}</span>
            </div>
            <div class="flex justify-between py-1.5 border-b border-white/5">
              <span class="text-slate-400">Tipo de Empaque:</span>
              <span class="text-white font-semibold">{{ sheet.technicalSpecs.packagingType }}</span>
            </div>
            <div class="flex justify-between py-1.5">
              <span class="text-slate-400">Tipo de Producto:</span>
              <span class="text-white font-semibold">{{ sheet.technicalSpecs.productType }}</span>
            </div>
          </div>
        </div>

        <div v-else-if="activeTab === 'ingredients'" class="qp-card p-5">
          <h3 class="text-sm font-bold text-white mb-3">🌿 Composición de Ingredientes y Alérgenos</h3>
          <table class="w-full text-left text-xs">
            <thead class="bg-[#121622] text-slate-300">
              <tr>
                <th class="p-3">Ingrediente</th>
                <th class="p-3">Porcentaje</th>
                <th class="p-3">Alérgeno Declarado</th>
                <th class="p-3">Origen / Certificación</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/10">
              <tr v-for="ing in sheet.ingredients" :key="ing.name">
                <td class="p-3 font-bold text-white">{{ ing.name }}</td>
                <td class="p-3 text-amber-400 font-semibold">{{ ing.percentage }}</td>
                <td class="p-3">{{ ing.allergen }}</td>
                <td class="p-3 text-slate-300">{{ ing.origin }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-else-if="activeTab === 'nutrition'" class="qp-card p-5 space-y-3 text-xs">
          <h3 class="text-sm font-bold text-white">🍴 Tabla Nutricional Detallada (Porción de 100 g)</h3>
          <div class="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div class="p-3 rounded-xl bg-white/5">
              <p class="text-slate-400">Calorías</p>
              <p class="text-lg font-bold text-white">{{ sheet.nutritionPer100g.calories }} kcal</p>
            </div>
            <div class="p-3 rounded-xl bg-white/5">
              <p class="text-slate-400">Proteínas</p>
              <p class="text-lg font-bold text-amber-400">{{ sheet.nutritionPer100g.proteins }}</p>
            </div>
            <div class="p-3 rounded-xl bg-white/5">
              <p class="text-slate-400">Grasas Totales</p>
              <p class="text-lg font-bold text-emerald-400">{{ sheet.nutritionPer100g.totalFat }}</p>
            </div>
            <div class="p-3 rounded-xl bg-white/5">
              <p class="text-slate-400">Carbohidratos</p>
              <p class="text-lg font-bold text-sky-400">{{ sheet.nutritionPer100g.carbohydrates }}</p>
            </div>
            <div class="p-3 rounded-xl bg-white/5">
              <p class="text-slate-400">Sodio</p>
              <p class="text-lg font-bold text-purple-400">{{ sheet.nutritionPer100g.sodium }}</p>
            </div>
          </div>
        </div>

        <div v-else-if="activeTab === 'specs'" class="qp-card p-5 space-y-3 text-xs">
          <h3 class="text-sm font-bold text-white">⚙ Condiciones de Conservación, Almacenamiento y Empaque</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div class="p-3.5 rounded-xl bg-white/5 border border-white/10">
              <p class="text-slate-400">Cadena de Frío</p>
              <p class="text-sm font-bold text-white mt-1">{{ sheet.technicalSpecs.storageTemperature }}</p>
            </div>
            <div class="p-3.5 rounded-xl bg-white/5 border border-white/10">
              <p class="text-slate-400">Vida Útil Garantizada</p>
              <p class="text-sm font-bold text-white mt-1">{{ sheet.technicalSpecs.shelfLife }}</p>
            </div>
            <div class="p-3.5 rounded-xl bg-white/5 border border-white/10">
              <p class="text-slate-400">Material de Empaque Primario</p>
              <p class="text-sm font-bold text-white mt-1">{{ sheet.technicalSpecs.packagingType }}</p>
            </div>
          </div>
        </div>

        <div v-else-if="activeTab === 'quality'" class="qp-card p-5">
          <h3 class="text-sm font-bold text-white mb-3">🛡 Parámetros de Control de Calidad e Inocuidad</h3>
          <table class="w-full text-left text-xs">
            <thead class="bg-[#121622] text-slate-300">
              <tr>
                <th class="p-3">Parámetro de Control</th>
                <th class="p-3">Rango / Especificación</th>
                <th class="p-3">Método de Ensayo</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/10">
              <tr v-for="qp in sheet.qualityParameters" :key="qp.parameter">
                <td class="p-3 font-bold text-white">{{ qp.parameter }}</td>
                <td class="p-3 text-emerald-400 font-semibold">{{ qp.target }}</td>
                <td class="p-3 text-slate-300">{{ qp.method }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-else-if="activeTab === 'history'" class="qp-card p-5 space-y-3">
          <h3 class="text-sm font-bold text-white">🕒 Historial de Modificaciones de la Ficha Técnica</h3>
          <div
            v-for="h in sheet.history"
            :key="h.version"
            class="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs"
          >
            <div>
              <span class="px-2 py-0.5 rounded bg-red-500/20 text-red-300 font-bold mr-2">{{ h.version }}</span>
              <strong class="text-white">{{ h.change }}</strong>
              <p class="text-slate-400 mt-1">Responsable: {{ h.author }}</p>
            </div>
            <span class="text-slate-400">{{ h.date }}</span>
          </div>
        </div>
      </div>
    </template>

    <!-- Modal de Edición de Ficha Técnica -->
    <BaseModal v-model="showEditModal" title="Editar Parámetros de Ficha Técnica — PQ-001">
      <form class="space-y-4" @submit.prevent="saveTechnicalSheetChanges">
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">Peso Neto por Unidad</label>
            <input
              v-model="sheet.technicalSpecs.unitNetWeight"
              type="text"
              class="w-full h-10 px-3 rounded-xl bg-[#11151F] border border-white/15 text-xs text-white"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">Vida Útil</label>
            <input
              v-model="sheet.technicalSpecs.shelfLife"
              type="text"
              class="w-full h-10 px-3 rounded-xl bg-[#11151F] border border-white/15 text-xs text-white"
            />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">Temperatura de Conservación</label>
            <input
              v-model="sheet.technicalSpecs.storageTemperature"
              type="text"
              class="w-full h-10 px-3 rounded-xl bg-[#11151F] border border-white/15 text-xs text-white"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">Valor Energético (kcal/100g)</label>
            <input
              v-model.number="sheet.nutritionPer100g.calories"
              type="number"
              class="w-full h-10 px-3 rounded-xl bg-[#11151F] border border-white/15 text-xs text-white"
            />
          </div>
        </div>
        <div class="flex justify-end gap-2">
          <button type="button" class="qp-btn-secondary px-4 py-2 rounded-xl text-xs" @click="showEditModal = false">
            Cancelar
          </button>
          <button type="submit" class="qp-btn-primary px-5 py-2 rounded-xl text-xs font-bold">
            Actualizar Ficha Técnica
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
import DonutStatCard from '../components/common/DonutStatCard.vue'
import BaseModal from '../components/common/BaseModal.vue'

import techMainSkin from '../assets/images/skins/technical-sheets-main.png'
import techMainPhoto from '../assets/images/tech-main.png'
import techThumb1 from '../assets/images/tech-thumb-1.png'
import techThumb2 from '../assets/images/tech-thumb-2.png'
import techThumb3 from '../assets/images/tech-thumb-3.png'
import techThumb4 from '../assets/images/tech-thumb-4.png'

defineProps({
  isReferenceDesktop: { type: Boolean, default: false }
})

const store = useEnterpriseStore()
const activeTab = ref('general')
const selectedThumb = ref(0)
const forceDynamic = ref(false)
const showEditModal = ref(false)

const sheet = computed(() => store.technicalSheets[0])
const galleryImages = [techMainPhoto, techThumb2, techThumb3, techThumb4, techThumb1]

const tabs = [
  { id: 'general', label: 'Información General', width: 205 },
  { id: 'ingredients', label: 'Ingredientes', width: 155 },
  { id: 'nutrition', label: 'Composición Nutricional', width: 222 },
  { id: 'specs', label: 'Especificaciones Técnicas', width: 230 },
  { id: 'quality', label: 'Control de Calidad', width: 190 },
  { id: 'history', label: 'Historial', width: 140 }
]

function selectThumbnail(idx) {
  selectedThumb.value = idx
  forceDynamic.value = true
}

function saveTechnicalSheetChanges() {
  showEditModal.value = false
  forceDynamic.value = true
  store.notify('Ficha técnica actualizada', 'Nueva revisión registrada en el historial.', 'success')
}

function resetToReference() {
  activeTab.value = 'general'
  selectedThumb.value = 0
  forceDynamic.value = false
}
</script>
