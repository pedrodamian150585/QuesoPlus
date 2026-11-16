<template>
  <EnterpriseModuleShell
    code="7.20"
    section="Administración"
    title="Reportes Ejecutivos y Análisis Integral"
    subtitle="Indicadores consolidados y coherentes entre producción, ventas, compras, inventarios, costos, cartera y rentabilidad"
    emoji="📊"
    :kpis="kpis"
  >
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div class="qp-card p-5 space-y-2">
        <h2 class="text-sm font-bold text-white">1. Desempeño Comercial y Ventas</h2>
        <p class="text-xs text-slate-400">Unidades vendidas en el mes: <strong class="text-white">48.750 und. (+12.3%)</strong></p>
        <p class="text-xs text-slate-400">Ingresos facturados: <strong class="text-emerald-400">{{ formatCurrencyCOP(store.dashboard.businessSummary.totalSales, true) }}</strong></p>
        <p class="text-xs text-slate-400">Producto líder: <strong class="text-amber-400">Palitos de Queso Clásicos (PQ-001)</strong></p>
      </div>

      <div class="qp-card p-5 space-y-2">
        <h2 class="text-sm font-bold text-white">2. Eficiencia Productiva y Calidad</h2>
        <p class="text-xs text-slate-400">Producción diaria actual: <strong class="text-white">{{ store.dashboard.kpis[0].value }}</strong></p>
        <p class="text-xs text-slate-400">Rendimiento medio de planta: <strong class="text-emerald-400">98.5%</strong></p>
        <p class="text-xs text-slate-400">Lotes aprobados por calidad: <strong class="text-white">{{ store.qualityInspections.length }} / {{ store.qualityInspections.length }} (100%)</strong></p>
      </div>

      <div class="qp-card p-5 space-y-2">
        <h2 class="text-sm font-bold text-white">3. Posición Financiera y Flujo de Caja</h2>
        <p class="text-xs text-slate-400">Disponibilidad en Tesorería: <strong class="text-emerald-400">{{ formatCurrencyCOP(store.totalTreasuryBalance, true) }}</strong></p>
        <p class="text-xs text-slate-400">Cuentas por Cobrar (CxC): <strong class="text-amber-400">{{ formatCurrencyCOP(store.totalReceivablesBalance, true) }}</strong></p>
        <p class="text-xs text-slate-400">Cuentas por Pagar (CxP): <strong class="text-red-400">{{ formatCurrencyCOP(store.totalPayablesBalance, true) }}</strong></p>
      </div>
    </div>
  </EnterpriseModuleShell>
</template>

<script setup>
import { computed } from 'vue'
import { useEnterpriseStore } from '../stores/useEnterpriseStore.js'
import { formatCurrencyCOP } from '../utils/formatters.js'
import EnterpriseModuleShell from '../components/common/EnterpriseModuleShell.vue'

const store = useEnterpriseStore()

const kpis = computed(() => [
  { title: 'Margen Bruto Estimado', value: '58.4%', delta: '+2.3%', color: 'green', icon: 'check-circle' },
  { title: 'Ventas Totales Mes', value: formatCurrencyCOP(store.dashboard.businessSummary.totalSales), delta: '+14.2%', color: 'amber', icon: 'shopping-cart' },
  { title: 'Flujo de Caja Neto', value: formatCurrencyCOP(store.totalTreasuryBalance), delta: 'Positivo', color: 'blue', icon: 'box' },
  { title: 'Cumplimiento Meta', value: '114%', delta: '+14% sobre meta', color: 'red', icon: 'star' }
])
</script>
