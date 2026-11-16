<template>
  <aside
    aria-label="Navegación principal de QuesoPlus"
    class="relative shrink-0 bg-[#02050B] select-none"
    :class="[
      isReferenceDesktop ? 'w-[245px] h-[941px] overflow-hidden' : 'w-[256px] min-h-screen flex flex-col border-r border-[#1B1F29]'
    ]"
  >
    <!-- En modo escritorio de referencia para las 5 vistas principales, capa visual exacta + enlaces interactivos -->
    <template v-if="isReferenceDesktop && referenceSidebarSkin">
      <img
        :src="referenceSidebarSkin"
        alt="Menú lateral QuesoPlus"
        class="w-[245px] h-[941px] object-cover pointer-events-none block"
      />
      <!-- Mapa de enlaces interactivos alineados con los ítems del sidebar -->
      <nav aria-label="Menú principal" class="absolute inset-0 z-10">
        <RouterLink
          to="/dashboard"
          aria-label="Ir a Dashboard"
          class="absolute left-[10px] top-[168px] w-[224px] h-[44px] rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/60"
          title="Dashboard Principal"
        />
        <RouterLink
          to="/productos"
          aria-label="Ir a Productos"
          class="absolute left-[10px] top-[218px] w-[224px] h-[42px] rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/60"
          title="Catálogo de Productos"
        />

        <!-- Subítems cuando Productos está expandido -->
        <template v-if="referenceKey !== 'dashboard'">
          <RouterLink
            to="/productos"
            aria-label="Ir a Lista de Productos"
            class="absolute left-[20px] top-[266px] w-[205px] h-[30px] rounded-lg"
            title="Lista de Productos"
          />
          <RouterLink
            to="/productos/categorias"
            aria-label="Ir a Categorías"
            class="absolute left-[20px] top-[298px] w-[205px] h-[34px] rounded-lg"
            title="Categorías de Productos"
          />
          <RouterLink
            to="/productos/presentaciones"
            aria-label="Ir a Presentaciones"
            class="absolute left-[20px] top-[336px] w-[205px] h-[34px] rounded-lg"
            title="Presentaciones Comerciales"
          />
          <template v-if="['categories', 'presentations', 'technical-sheets'].includes(referenceKey)">
            <RouterLink
              to="/productos/fichas-tecnicas"
              aria-label="Ir a Fichas Técnicas"
              class="absolute left-[20px] top-[372px] w-[205px] h-[34px] rounded-lg"
              title="Fichas Técnicas"
            />
            <RouterLink
              to="/productos/formulaciones"
              aria-label="Ir a Formulaciones"
              class="absolute left-[20px] top-[408px] w-[205px] h-[32px] rounded-lg"
              title="Formulaciones y Recetas"
            />
          </template>
        </template>

        <!-- Enlaces operativos inferiores según posición en referencia -->
        <RouterLink
          to="/produccion"
          aria-label="Ir a Producción"
          class="absolute left-[10px] w-[224px] h-[36px] rounded-lg"
          :style="{ top: operationalTopOffset(0) }"
          title="Producción"
        />
        <RouterLink
          to="/inventario"
          aria-label="Ir a Inventario"
          class="absolute left-[10px] w-[224px] h-[36px] rounded-lg"
          :style="{ top: operationalTopOffset(1) }"
          title="Inventarios"
        />
        <RouterLink
          :to="referenceKey === 'dashboard' ? '/distribucion' : '/pedidos'"
          :aria-label="referenceKey === 'dashboard' ? 'Ir a Distribución' : 'Ir a Pedidos'"
          class="absolute left-[10px] w-[224px] h-[36px] rounded-lg"
          :style="{ top: operationalTopOffset(2) }"
        />
        <RouterLink
          to="/ventas"
          aria-label="Ir a Ventas"
          class="absolute left-[10px] w-[224px] h-[36px] rounded-lg"
          :style="{ top: operationalTopOffset(3) }"
          title="Ventas"
        />
        <RouterLink
          :to="referenceKey === 'dashboard' ? '/reportes' : '/distribucion'"
          :aria-label="referenceKey === 'dashboard' ? 'Ir a Reportes' : 'Ir a Distribución'"
          class="absolute left-[10px] w-[224px] h-[36px] rounded-lg"
          :style="{ top: operationalTopOffset(4) }"
        />
        <RouterLink
          :to="referenceKey === 'dashboard' ? '/configuracion' : '/reportes'"
          :aria-label="referenceKey === 'dashboard' ? 'Ir a Configuración' : 'Ir a Reportes'"
          class="absolute left-[10px] w-[224px] h-[36px] rounded-lg"
          :style="{ top: operationalTopOffset(5) }"
        />
        <RouterLink
          v-if="referenceKey !== 'dashboard'"
          to="/configuracion"
          aria-label="Ir a Configuración"
          class="absolute left-[10px] top-[708px] w-[224px] h-[36px] rounded-lg"
          title="Configuración y Seguridad"
        />

        <!-- Botón invisible sobre el pie de versión para abrir el selector completo de los 21 módulos -->
        <button
          type="button"
          aria-label="Abrir directorio completo de 21 módulos empresariales"
          class="absolute left-[10px] bottom-[8px] w-[224px] h-[36px] rounded-lg text-transparent hover:bg-white/5 transition"
          title="Ver los 21 módulos de QuesoPlus"
          @click="$emit('open-Launcher')"
        >
          Todos los módulos
        </button>
      </nav>
    </template>

    <!-- Modo completo multinavegación para los 21 módulos y resoluciones responsive -->
    <template v-else>
      <div class="p-4 border-b border-white/10 flex flex-col items-center">
        <RouterLink to="/dashboard" class="block">
          <img :src="sidebarLogo" alt="QuesoPlus Logo" class="w-48 h-auto object-contain" />
        </RouterLink>
      </div>

      <nav aria-label="Menú completo de 21 módulos" class="flex-1 overflow-y-auto px-3 py-3 space-y-4">
        <div v-for="group in navigationGroups" :key="group.title">
          <p class="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            {{ group.title }}
          </p>
          <div class="space-y-1">
            <RouterLink
              v-for="item in group.items"
              :key="item.to"
              :to="item.to"
              class="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition"
              :class="
                route.path === item.to
                  ? 'qp-btn-primary text-white font-semibold'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              "
            >
              <span class="truncate">{{ item.label }}</span>
              <span class="text-[10px] text-slate-400">{{ item.code }}</span>
            </RouterLink>
          </div>
        </div>
      </nav>

      <div class="p-3 border-t border-white/10">
        <img :src="sidebarPromo" alt="Calidad que se disfruta" class="w-full rounded-xl mb-2" />
        <div class="flex items-center justify-between px-1 text-[11px] text-slate-400">
          <span class="font-semibold text-slate-300">QuesoPlus v1.0.0</span>
          <button
            type="button"
            class="text-red-400 hover:text-red-300 font-medium"
            @click="$emit('open-Launcher')"
          >
            21 Módulos
          </button>
        </div>
      </div>
    </template>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import sidebarLogo from '../../assets/images/sidebar-logo.png'
import sidebarPromo from '../../assets/images/sidebar-promo.png'
import dashSidebar from '../../assets/images/skins/dashboard-sidebar.png'
import prodSidebar from '../../assets/images/skins/products-sidebar.png'
import catSidebar from '../../assets/images/skins/categories-sidebar.png'
import presSidebar from '../../assets/images/skins/presentations-sidebar.png'
import techSidebar from '../../assets/images/skins/technical-sheets-sidebar.png'

const props = defineProps({
  isReferenceDesktop: { type: Boolean, default: false },
  referenceKey: { type: String, default: '' }
})

defineEmits(['open-Launcher'])

const route = useRoute()

const referenceSidebarSkin = computed(() => {
  const map = {
    dashboard: dashSidebar,
    products: prodSidebar,
    categories: catSidebar,
    presentations: presSidebar,
    'technical-sheets': techSidebar
  }
  return map[props.referenceKey] || null
})

function operationalTopOffset(index) {
  if (props.referenceKey === 'dashboard') {
    const tops = [280, 326, 372, 418, 468, 516]
    return `${tops[index] || 280}px`
  }
  if (props.referenceKey === 'products') {
    const tops = [382, 428, 474, 520, 566, 612]
    return `${tops[index] || 382}px`
  }
  const tops = [455, 498, 540, 582, 624, 666]
  return `${tops[index] || 455}px`
}

const navigationGroups = [
  {
    title: 'Etapa 1 & 2 — Catálogo',
    items: [
      { code: '7.1', label: 'Dashboard Principal', to: '/dashboard' },
      { code: '7.2', label: 'Catálogo de Productos', to: '/productos' },
      { code: '7.3', label: 'Categorías', to: '/productos/categorias' },
      { code: '7.4', label: 'Presentaciones', to: '/productos/presentaciones' },
      { code: '7.5', label: 'Fichas Técnicas', to: '/productos/fichas-tecnicas' },
      { code: '7.6', label: 'Formulaciones y Recetas', to: '/productos/formulaciones' }
    ]
  },
  {
    title: 'Etapa 3 — Operaciones',
    items: [
      { code: '7.7', label: 'Materias Primas e Insumos', to: '/materias-primas' },
      { code: '7.8', label: 'Producción', to: '/produccion' },
      { code: '7.9', label: 'Control de Calidad', to: '/calidad' },
      { code: '7.10', label: 'Inventarios y Kardex', to: '/inventario' }
    ]
  },
  {
    title: 'Etapa 4 — Abastecimiento',
    items: [
      { code: '7.11', label: 'Compras y Recepciones', to: '/compras' },
      { code: '7.12', label: 'Proveedores', to: '/proveedores' }
    ]
  },
  {
    title: 'Etapa 5 — Comercial',
    items: [
      { code: '7.13', label: 'Clientes', to: '/clientes' },
      { code: '7.14', label: 'Pedidos', to: '/pedidos' },
      { code: '7.15', label: 'Ventas y Facturación', to: '/ventas' }
    ]
  },
  {
    title: 'Etapa 6 — Finanzas',
    items: [
      { code: '7.16', label: 'Cuentas por Cobrar', to: '/finanzas/cuentas-por-cobrar' },
      { code: '7.17', label: 'Cuentas por Pagar', to: '/finanzas/cuentas-por-pagar' },
      { code: '7.18', label: 'Tesorería y Movimientos', to: '/finanzas/tesoreria' }
    ]
  },
  {
    title: 'Etapa 7 & 8 — Logística y Admin',
    items: [
      { code: '7.19', label: 'Distribución y Despachos', to: '/distribucion' },
      { code: '7.20', label: 'Reportes y Análisis', to: '/reportes' },
      { code: '7.21', label: 'Configuración y Seguridad', to: '/configuracion' }
    ]
  }
]
</script>
