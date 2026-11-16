<template>
  <div
    class="min-h-screen bg-[#04070C] text-white"
    :class="isReferenceDesktop ? 'w-screen h-screen overflow-hidden flex items-start justify-start' : 'flex flex-col lg:flex-row'"
  >
    <div
      :class="isReferenceDesktop ? 'w-[1672px] h-[941px] flex shrink-0 origin-top-left' : 'w-full min-h-screen flex flex-col lg:flex-row'"
      :style="desktopScaleStyle"
    >
      <AppSidebar
        :is-reference-desktop="isReferenceDesktop"
        :reference-key="referenceKey"
        @open-launcher="showLauncher = true"
      />

      <div
        class="flex-1 flex flex-col min-w-0"
        :class="isReferenceDesktop ? 'w-[1427px] h-[941px] overflow-hidden' : 'min-h-screen'"
      >
        <AppTopbar
          :is-reference-desktop="isReferenceDesktop"
          :reference-key="referenceKey"
          @open-launcher="showLauncher = true"
        />

        <main
          aria-label="Contenido principal del módulo"
          :class="isReferenceDesktop ? 'w-[1427px] h-[859px] relative overflow-hidden' : 'flex-1 p-4 md:p-6 overflow-y-auto'"
        >
          <slot :is-reference-desktop="isReferenceDesktop" />
        </main>
      </div>
    </div>

    <!-- Directorio Interactivo de los 21 Módulos de QuesoPlus -->
    <BaseModal
      v-model="showLauncher"
      title="QuesoPlus ERP — Centro de Navegación Integral (21 Módulos)"
      size="xl"
    >
      <div class="space-y-4">
        <p class="text-xs text-slate-300">
          Selecciona cualquiera de los 21 módulos empresariales interconectados de QuesoPlus para gestionar operaciones productivas, comerciales, logísticas y financieras:
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <RouterLink
            v-for="mod in allModules"
            :key="mod.to"
            :to="mod.to"
            class="p-3.5 rounded-xl border border-white/10 bg-[#121622] hover:border-red-500/60 hover:bg-[#181D2C] transition flex items-start justify-between gap-3"
            @click="showLauncher = false"
          >
            <div>
              <div class="flex items-center gap-2">
                <span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-500/20 text-red-300 border border-red-500/30">
                  {{ mod.code }}
                </span>
                <h3 class="text-xs font-bold text-white">{{ mod.name }}</h3>
              </div>
              <p class="text-[11px] text-slate-400 mt-1">{{ mod.subtitle }}</p>
            </div>
            <span class="text-xs text-red-400 font-bold">→</span>
          </RouterLink>
        </div>
      </div>
    </BaseModal>

    <ToastContainer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import AppSidebar from '../components/layout/AppSidebar.vue'
import AppTopbar from '../components/layout/AppTopbar.vue'
import BaseModal from '../components/common/BaseModal.vue'
import ToastContainer from '../components/common/ToastContainer.vue'

const route = useRoute()
const showLauncher = ref(false)
const viewportWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1672)
const viewportHeight = ref(typeof window !== 'undefined' ? window.innerHeight : 941)

function updateViewport() {
  viewportWidth.value = window.innerWidth
  viewportHeight.value = window.innerHeight
}

onMounted(() => {
  window.addEventListener('resize', updateViewport)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateViewport)
})

const referenceKey = computed(() => {
  const map = {
    '/dashboard': 'dashboard',
    '/productos': 'products',
    '/productos/categorias': 'categories',
    '/productos/presentaciones': 'presentations',
    '/productos/fichas-tecnicas': 'technical-sheets'
  }
  return map[route.path] || ''
})

const isReferenceDesktop = computed(() => {
  return Boolean(referenceKey.value) && viewportWidth.value >= 1280
})

const desktopScaleStyle = computed(() => {
  if (!isReferenceDesktop.value) return {}
  if (viewportWidth.value === 1672 && viewportHeight.value === 941) {
    return {}
  }
  const scaleX = viewportWidth.value / 1672
  const scaleY = viewportHeight.value / 941
  return {
    transform: `scale(${scaleX}, ${scaleY})`
  }
})

const allModules = [
  { code: '7.1', name: 'Dashboard Principal', subtitle: 'KPIs diarios, producción vs ventas, inventario y alertas', to: '/dashboard' },
  { code: '7.2', name: 'Productos', subtitle: 'Catálogo maestro, precios, stock, rotación y filtros', to: '/productos' },
  { code: '7.3', name: 'Categorías', subtitle: 'Agrupación comercial y participación por línea', to: '/productos/categorias' },
  { code: '7.4', name: 'Presentaciones Comerciales', subtitle: 'Pesos netos, unidades por paquete y precios COP', to: '/productos/presentaciones' },
  { code: '7.5', name: 'Fichas Técnicas', subtitle: 'Nutrición, ingredientes, calidad, empaque y vida útil', to: '/productos/fichas-tecnicas' },
  { code: '7.6', name: 'Formulaciones y Recetas', subtitle: 'Dosificación, porcentajes, rendimientos y costos', to: '/productos/formulaciones' },
  { code: '7.7', name: 'Materias Primas e Insumos', subtitle: 'Existencias, lotes, vencimientos y alertas de stock', to: '/materias-primas' },
  { code: '7.8', name: 'Producción', subtitle: 'Órdenes de fabricación, turnos, consumo MP y mermas', to: '/produccion' },
  { code: '7.9', name: 'Control de Calidad', subtitle: 'Inspecciones, liberación de lotes y no conformidades', to: '/calidad' },
  { code: '7.10', name: 'Inventarios y Kardex', subtitle: 'Entradas, salidas, reservas, transferencias y lotes', to: '/inventario' },
  { code: '7.11', name: 'Compras y Abastecimiento', subtitle: 'Órdenes de compra, recepciones e ingreso a almacén', to: '/compras' },
  { code: '7.12', name: 'Proveedores', subtitle: 'Directorio comercial, condiciones de pago y saldos', to: '/proveedores' },
  { code: '7.13', name: 'Clientes', subtitle: 'Segmentación comercial, cupos de crédito y cartera', to: '/clientes' },
  { code: '7.14', name: 'Pedidos', subtitle: 'Toma de pedidos, descuentos y reserva de inventario', to: '/pedidos' },
  { code: '7.15', name: 'Ventas y Facturación', subtitle: 'Ventas de contado y a crédito, notas crédito y reportes', to: '/ventas' },
  { code: '7.16', name: 'Cuentas por Cobrar', subtitle: 'Cartera por edades, recaudos y actualización de saldos', to: '/finanzas/cuentas-por-cobrar' },
  { code: '7.17', name: 'Cuentas por Pagar', subtitle: 'Obligaciones con proveedores, programación y pagos', to: '/finanzas/cuentas-por-pagar' },
  { code: '7.18', name: 'Tesorería y Movimientos', subtitle: 'Cajas, bancos, ingresos, egresos y conciliación', to: '/finanzas/tesoreria' },
  { code: '7.19', name: 'Distribución', subtitle: 'Despachos refrigerados, rutas, transportistas y entregas', to: '/distribucion' },
  { code: '7.20', name: 'Reportes y Análisis', subtitle: 'Indicadores integrados de rentabilidad y operación', to: '/reportes' },
  { code: '7.21', name: 'Configuración y Seguridad', subtitle: 'Usuarios, roles, permisos, parámetros y auditoría', to: '/configuracion' }
]
</script>
