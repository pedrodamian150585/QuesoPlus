<template>
  <div class="w-full h-full relative">
    <h1 class="sr-only">Dashboard Principal — QuesoPlus</h1>

    <!-- MODO REFERENCIA ESCRITORIO INICIAL (Fidelidad Visual Pixel-a-Pixel + Controles Interactivos) -->
    <template v-if="isReferenceDesktop && !userInteracted">
      <img
        :src="dashMainSkin"
        alt="Panel de control principal de QuesoPlus"
        class="w-[1427px] h-[859px] object-cover pointer-events-none block select-none"
      />

      <!-- Botones de periodo del gráfico Producción vs Ventas (7d, 30d, 90d, 1a) -->
      <div role="group" aria-label="Selector de periodo Producción vs Ventas" class="absolute left-[506px] top-[374px] flex items-center gap-1.5">
        <button
          v-for="p in ['7d', '30d', '90d', '1a']"
          :key="p"
          type="button"
          :aria-label="`Filtrar gráfico por ${p}`"
          class="w-[38px] h-[24px] rounded-full text-transparent focus:outline-none focus:ring-2 focus:ring-red-500/70"
          @click="selectPeriod(p)"
        >
          {{ p }}
        </button>
      </div>

      <!-- Botón Ver detalle Estado de Inventario -->
      <RouterLink
        to="/inventario"
        aria-label="Ver detalle de Estado de Inventario"
        class="absolute left-[968px] top-[374px] w-[82px] h-[26px] rounded-full focus:outline-none focus:ring-2 focus:ring-red-500/70"
        title="Ir a Inventarios"
      />

      <!-- 3 Alertas Importantes interactivas -->
      <RouterLink
        to="/materias-primas"
        aria-label="Alerta: Stock bajo de Queso Mozzarella"
        class="absolute left-[1102px] top-[418px] w-[295px] h-[52px] rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/70"
      />
      <RouterLink
        to="/distribucion"
        aria-label="Alerta: Pedido #PED-2026-1045 pendiente de despacho"
        class="absolute left-[1102px] top-[474px] w-[295px] h-[54px] rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/70"
      />
      <RouterLink
        to="/produccion"
        aria-label="Alerta: Mantenimiento programado en la línea de producción"
        class="absolute left-[1102px] top-[534px] w-[295px] h-[52px] rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/70"
      />

      <!-- Botón Ver todos Últimos Movimientos -->
      <button
        type="button"
        aria-label="Ver todos los últimos movimientos"
        class="absolute left-[382px] top-[612px] w-[78px] h-[25px] rounded-full focus:outline-none focus:ring-2 focus:ring-red-500/70"
        @click="showMovementsModal = true"
      />

      <!-- Botón Ver catálogo y Ver ficha en Productos Destacados -->
      <RouterLink
        to="/productos"
        aria-label="Ver catálogo completo de productos"
        class="absolute left-[800px] top-[612px] w-[84px] h-[25px] rounded-full focus:outline-none focus:ring-2 focus:ring-red-500/70"
      />
      <RouterLink
        to="/productos/fichas-tecnicas"
        aria-label="Ver ficha técnica de Palitos de Queso"
        class="absolute left-[792px] top-[726px] w-[96px] h-[34px] rounded-full focus:outline-none focus:ring-2 focus:ring-red-500/70"
      />

      <!-- Selector Este Mes en Resumen del Negocio -->
      <button
        type="button"
        aria-label="Cambiar periodo de Resumen del Negocio"
        class="absolute left-[1312px] top-[612px] w-[82px] h-[25px] rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500/70"
        @click="showSummaryModal = true"
      />
    </template>

    <!-- MODO INTERACTIVO DINÁMICO Y RESPONSIVE -->
    <template v-else>
      <div class="space-y-4">
        <!-- Hero Banner -->
        <div class="qp-card relative overflow-hidden p-6 border border-red-500/25 bg-gradient-to-r from-[#1A060A] via-[#12080D] to-[#0B0D14] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div class="z-10 space-y-1.5">
            <div class="flex items-center gap-3">
              <h2 class="text-2xl md:text-3xl font-bold text-white">
                ¡Bienvenido, {{ store.currentUser.firstName }}! 👋
              </h2>
              <button
                v-if="userInteracted"
                type="button"
                class="qp-btn-secondary px-2.5 py-1 rounded-lg text-[11px]"
                @click="resetReferenceMode"
              >
                Restaurar vista inicial
              </button>
            </div>
            <p class="text-sm text-slate-200">
              Gestiona, controla y haz crecer tu negocio de palitos de queso
            </p>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#680A14]/80 border border-red-500/40 text-xs text-red-100 mt-1">
              <span>📅 {{ store.dashboard.dateLabel }}</span>
            </div>
          </div>
          <img
            :src="heroDashArt"
            alt="Palitos de queso recién horneados"
            class="h-28 md:h-36 object-contain rounded-xl self-end"
          />
        </div>

        <!-- 4 KPI Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <KpiStatCard
            v-for="kpi in store.dashboard.kpis"
            :key="kpi.id"
            :title="kpi.title"
            :value="kpi.value"
            :delta="kpi.delta"
            :color="kpi.color"
            :icon="kpi.icon"
            :sparkline="kpi.sparkline"
          />
        </div>

        <!-- Middle Row: Chart + Inventory Donut + Alerts -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <!-- Producción vs Ventas -->
          <div class="qp-card p-4 lg:col-span-6 flex flex-col justify-between">
            <div class="flex items-center justify-between gap-2 mb-3">
              <div class="flex items-center gap-2">
                <BarChart3 class="w-4 h-4 text-red-500" />
                <h3 class="text-sm font-bold text-white">Producción vs Ventas</h3>
              </div>
              <div class="flex items-center gap-1.5">
                <button
                  v-for="p in ['7d', '30d', '90d', '1a']"
                  :key="p"
                  type="button"
                  class="px-2.5 py-1 rounded-full text-xs font-semibold transition"
                  :class="activePeriod === p ? 'qp-btn-primary text-white' : 'bg-[#171B26] text-slate-300 hover:text-white'"
                  @click="selectPeriod(p)"
                >
                  {{ p }}
                </button>
              </div>
            </div>

            <!-- Leyenda -->
            <div class="flex items-center justify-center gap-6 text-xs text-slate-300 mb-2">
              <span class="flex items-center gap-1.5">
                <span class="w-2.5 h-2.5 rounded-full bg-[#E11D2E]"></span> Producción
              </span>
              <span class="flex items-center gap-1.5">
                <span class="w-2.5 h-2.5 rounded-full bg-[#F59E0B]"></span> Ventas
              </span>
            </div>

            <!-- SVG Line Chart Dinámico -->
            <div class="w-full h-44">
              <svg viewBox="0 0 620 170" class="w-full h-full overflow-visible">
                <g stroke="#1E2433" stroke-width="1">
                  <line x1="36" y1="20" x2="605" y2="20" />
                  <line x1="36" y1="52" x2="605" y2="52" />
                  <line x1="36" y1="84" x2="605" y2="84" />
                  <line x1="36" y1="116" x2="605" y2="116" />
                  <line x1="36" y1="148" x2="605" y2="148" />
                </g>
                <g fill="#94A3B8" font-size="10">
                  <text x="8" y="24">4k</text>
                  <text x="8" y="56">3k</text>
                  <text x="8" y="88">2k</text>
                  <text x="8" y="120">1k</text>
                  <text x="14" y="152">0</text>
                </g>
                <polyline
                  fill="none"
                  stroke="#E11D2E"
                  stroke-width="2.5"
                  :points="chartPoints(currentChartData.production)"
                />
                <polyline
                  fill="none"
                  stroke="#F59E0B"
                  stroke-width="2.5"
                  :points="chartPoints(currentChartData.sales)"
                />
                <g v-for="(lbl, idx) in currentChartData.labels" :key="lbl">
                  <text
                    :x="36 + (idx / Math.max(currentChartData.labels.length - 1, 1)) * 568"
                    y="165"
                    text-anchor="middle"
                    fill="#94A3B8"
                    font-size="10"
                  >
                    {{ lbl }}
                  </text>
                </g>
              </svg>
            </div>
          </div>

          <!-- Estado de Inventario -->
          <div class="qp-card p-4 lg:col-span-3 flex flex-col justify-between">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-bold text-white">Estado de Inventario</h3>
              <RouterLink to="/inventario" class="text-xs text-slate-300 hover:text-white px-2.5 py-1 rounded-full bg-white/5">
                Ver detalle &gt;
              </RouterLink>
            </div>
            <div class="flex items-center justify-around gap-3 my-auto py-2">
              <DonutStatCard
                :size="138"
                :stroke-width="18"
                :center-value="`${store.dashboard.inventoryStatus.percentage}%`"
                center-label="Stock Total"
                :segments="[
                  { value: store.dashboard.inventoryStatus.inStock, color: '#10B981' },
                  { value: store.dashboard.inventoryStatus.reserved, color: '#F59E0B' },
                  { value: store.dashboard.inventoryStatus.lowStock, color: '#E11D2E' }
                ]"
              />
              <div class="space-y-2.5 text-xs">
                <div>
                  <span class="flex items-center gap-1.5 text-slate-300">
                    <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> En Stock
                  </span>
                  <p class="font-bold text-white pl-4">{{ formatNumber(store.dashboard.inventoryStatus.inStock) }} und.</p>
                </div>
                <div>
                  <span class="flex items-center gap-1.5 text-slate-300">
                    <span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span> En Reserva
                  </span>
                  <p class="font-bold text-white pl-4">{{ formatNumber(store.dashboard.inventoryStatus.reserved) }} und.</p>
                </div>
                <div>
                  <span class="flex items-center gap-1.5 text-slate-300">
                    <span class="w-2.5 h-2.5 rounded-full bg-red-500"></span> Stock Bajo
                  </span>
                  <p class="font-bold text-white pl-4">{{ formatNumber(store.dashboard.inventoryStatus.lowStock) }} und.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Alertas Importantes -->
          <div class="qp-card p-4 lg:col-span-3 flex flex-col justify-between">
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-sm font-bold text-white flex items-center gap-2">
                <span>🔔 Alertas Importantes</span>
                <span class="px-2 py-0.5 text-[11px] rounded-full bg-[#E11D2E] text-white">3</span>
              </h3>
            </div>
            <div class="space-y-2.5 my-auto">
              <RouterLink
                v-for="al in store.dashboard.importantAlerts"
                :key="al.id"
                :to="al.route"
                class="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 transition"
              >
                <div>
                  <p class="text-xs font-semibold text-white">{{ al.title }}</p>
                  <p class="text-[11px] text-slate-400">{{ al.time }}</p>
                </div>
                <span class="text-slate-400">&gt;</span>
              </RouterLink>
            </div>
          </div>
        </div>

        <!-- Bottom Row: Últimos Movimientos + Productos Destacados + Resumen del Negocio -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div class="qp-card p-4 lg:col-span-4">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-sm font-bold text-white">⚡ Últimos Movimientos</h3>
              <button
                type="button"
                class="text-xs text-slate-300 hover:text-white px-2.5 py-1 rounded-full bg-white/5"
                @click="showMovementsModal = true"
              >
                Ver todos &gt;
              </button>
            </div>
            <div class="space-y-2">
              <div
                v-for="mov in store.dashboard.recentMovements"
                :key="mov.id"
                class="flex items-center justify-between text-xs py-1 border-b border-white/5 last:border-0"
              >
                <span class="text-slate-200 truncate pr-2">{{ mov.text }}</span>
                <span class="text-[11px] text-slate-400 shrink-0">{{ mov.time }}</span>
              </div>
            </div>
          </div>

          <div class="qp-card p-4 lg:col-span-4">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-sm font-bold text-white">⭐ Productos Destacados</h3>
              <RouterLink to="/productos" class="text-xs text-slate-300 hover:text-white px-2.5 py-1 rounded-full bg-white/5">
                Ver catálogo &gt;
              </RouterLink>
            </div>
            <div class="flex items-center gap-4">
              <img :src="featuredPalitos" alt="Palitos de Queso" class="w-28 h-28 rounded-xl object-cover shrink-0" />
              <div class="space-y-2 flex-1">
                <div class="flex items-center justify-between">
                  <h4 class="text-sm font-bold text-white">Palitos de Queso</h4>
                  <span class="px-2 py-0.5 rounded-full text-[11px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Activo
                  </span>
                </div>
                <p class="text-xs text-slate-300">Crujientes por fuera, ¡irresistibles por dentro!</p>
                <div class="flex items-center justify-between pt-1">
                  <span class="text-xs font-bold text-emerald-400">+18.5% Ventas</span>
                  <RouterLink
                    to="/productos/fichas-tecnicas"
                    class="qp-btn-primary px-3 py-1.5 rounded-full text-xs font-semibold"
                  >
                    Ver ficha →
                  </RouterLink>
                </div>
              </div>
            </div>
          </div>

          <div class="qp-card p-4 lg:col-span-4 flex flex-col justify-between">
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-sm font-bold text-white">📈 Resumen del Negocio</h3>
              <span class="text-xs text-slate-300 px-2.5 py-1 rounded-full bg-white/5">Este Mes ⌄</span>
            </div>
            <div class="grid grid-cols-3 gap-2 text-center py-2 divide-x divide-white/10">
              <div>
                <p class="text-sm font-bold text-white">{{ formatCurrencyCOP(store.dashboard.businessSummary.totalSales) }}</p>
                <p class="text-[11px] text-slate-400">Ventas Totales</p>
                <p class="text-[11px] text-emerald-400 font-semibold">↑ {{ store.dashboard.businessSummary.salesDelta }}</p>
              </div>
              <div>
                <p class="text-sm font-bold text-white">{{ formatNumber(store.dashboard.businessSummary.totalProduction) }} und.</p>
                <p class="text-[11px] text-slate-400">Producción Total</p>
                <p class="text-[11px] text-emerald-400 font-semibold">↑ {{ store.dashboard.businessSummary.productionDelta }}</p>
              </div>
              <div>
                <p class="text-sm font-bold text-white">{{ store.dashboard.businessSummary.totalCustomers }}</p>
                <p class="text-[11px] text-slate-400">Clientes</p>
                <p class="text-[11px] text-emerald-400 font-semibold">↑ {{ store.dashboard.businessSummary.customersDelta }}</p>
              </div>
            </div>
            <div class="p-2.5 rounded-xl border border-amber-500/40 bg-amber-500/10 flex items-center justify-between">
              <div>
                <p class="text-xs font-bold text-amber-300">{{ store.dashboard.businessSummary.achievementTitle }}</p>
                <p class="text-[11px] text-slate-200">{{ store.dashboard.businessSummary.achievementText }}</p>
              </div>
              <span>🏆</span>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Modal de Bitácora Completa de Movimientos -->
    <BaseModal v-model="showMovementsModal" title="Bitácora de Últimos Movimientos Operativos" size="lg">
      <div class="space-y-3">
        <div
          v-for="mov in store.dashboard.recentMovements"
          :key="mov.id"
          class="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between"
        >
          <span class="text-xs font-medium text-white">{{ mov.text }}</span>
          <span class="text-xs text-slate-400">{{ mov.time }}</span>
        </div>
      </div>
    </BaseModal>

    <!-- Modal de Resumen Financiero del Mes -->
    <BaseModal v-model="showSummaryModal" title="Resumen Ejecutivo del Negocio — Noviembre 2026">
      <div class="space-y-3 text-xs">
        <div class="p-3 rounded-xl bg-white/5 flex justify-between">
          <span>Ventas Totales Acumuladas:</span>
          <strong class="text-emerald-400">{{ formatCurrencyCOP(store.dashboard.businessSummary.totalSales, true) }}</strong>
        </div>
        <div class="p-3 rounded-xl bg-white/5 flex justify-between">
          <span>Cartera por Cobrar Activa:</span>
          <strong class="text-amber-400">{{ formatCurrencyCOP(store.totalReceivablesBalance, true) }}</strong>
        </div>
        <div class="p-3 rounded-xl bg-white/5 flex justify-between">
          <span>Cuentas por Pagar a Proveedores:</span>
          <strong class="text-red-400">{{ formatCurrencyCOP(store.totalPayablesBalance, true) }}</strong>
        </div>
        <div class="p-3 rounded-xl bg-white/5 flex justify-between">
          <span>Disponibilidad en Cajas y Bancos (Tesorería):</span>
          <strong class="text-sky-400">{{ formatCurrencyCOP(store.totalTreasuryBalance, true) }}</strong>
        </div>
      </div>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { BarChart3 } from 'lucide-vue-next'
import { useEnterpriseStore } from '../stores/useEnterpriseStore.js'
import { formatNumber, formatCurrencyCOP } from '../utils/formatters.js'
import KpiStatCard from '../components/common/KpiStatCard.vue'
import DonutStatCard from '../components/common/DonutStatCard.vue'
import BaseModal from '../components/common/BaseModal.vue'

import dashMainSkin from '../assets/images/skins/dashboard-main.png'
import heroDashArt from '../assets/images/hero-dashboard-art.png'
import featuredPalitos from '../assets/images/dash-featured-palitos.png'

defineProps({
  isReferenceDesktop: { type: Boolean, default: false }
})

const store = useEnterpriseStore()
const activePeriod = ref('30d')
const userInteracted = ref(false)
const showMovementsModal = ref(false)
const showSummaryModal = ref(false)

const currentChartData = computed(() => {
  return store.dashboard.productionVsSales.periods[activePeriod.value] || store.dashboard.productionVsSales.periods['30d']
})

function selectPeriod(period) {
  activePeriod.value = period
  userInteracted.value = true
  store.notify('Periodo actualizado', `Mostrando métricas de Producción vs Ventas (${period}).`, 'info')
}

function resetReferenceMode() {
  activePeriod.value = '30d'
  userInteracted.value = false
}

function chartPoints(values) {
  if (!values || !values.length) return ''
  return values
    .map((val, idx) => {
      const x = Math.round(36 + (idx / Math.max(values.length - 1, 1)) * 568)
      const y = Math.round(148 - (val / 4000) * 128)
      return `${x},${y}`
    })
    .join(' ')
}
</script>
