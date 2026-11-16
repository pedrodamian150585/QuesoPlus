import { createRouter, createWebHistory } from 'vue-router'

import DashboardView from '../views/DashboardView.vue'
import ProductsView from '../views/ProductsView.vue'
import CategoriesView from '../views/CategoriesView.vue'
import PresentationsView from '../views/PresentationsView.vue'
import TechnicalSheetsView from '../views/TechnicalSheetsView.vue'
import FormulationsView from '../views/FormulationsView.vue'
import RawMaterialsView from '../views/RawMaterialsView.vue'
import ProductionView from '../views/ProductionView.vue'
import QualityControlView from '../views/QualityControlView.vue'
import InventoryView from '../views/InventoryView.vue'
import PurchasesView from '../views/PurchasesView.vue'
import SuppliersView from '../views/SuppliersView.vue'
import CustomersView from '../views/CustomersView.vue'
import OrdersView from '../views/OrdersView.vue'
import SalesView from '../views/SalesView.vue'
import ReceivablesView from '../views/ReceivablesView.vue'
import PayablesView from '../views/PayablesView.vue'
import TreasuryView from '../views/TreasuryView.vue'
import DistributionView from '../views/DistributionView.vue'
import ReportsView from '../views/ReportsView.vue'
import SettingsView from '../views/SettingsView.vue'

const routes = [
  { path: '/', redirect: '/dashboard' },
  { path: '/dashboard', name: 'dashboard', component: DashboardView, meta: { title: 'Dashboard Principal' } },
  { path: '/productos', name: 'products', component: ProductsView, meta: { title: 'Catálogo de Productos' } },
  { path: '/productos/categorias', name: 'categories', component: CategoriesView, meta: { title: 'Categorías de Productos' } },
  { path: '/productos/presentaciones', name: 'presentations', component: PresentationsView, meta: { title: 'Presentaciones Comerciales' } },
  { path: '/productos/fichas-tecnicas', name: 'technical-sheets', component: TechnicalSheetsView, meta: { title: 'Fichas Técnicas' } },
  { path: '/productos/formulaciones', name: 'formulations', component: FormulationsView, meta: { title: 'Formulaciones y Recetas' } },
  { path: '/materias-primas', name: 'raw-materials', component: RawMaterialsView, meta: { title: 'Materias Primas e Insumos' } },
  { path: '/produccion', name: 'production', component: ProductionView, meta: { title: 'Producción' } },
  { path: '/calidad', name: 'quality', component: QualityControlView, meta: { title: 'Control de Calidad' } },
  { path: '/inventario', name: 'inventory', component: InventoryView, meta: { title: 'Inventarios y Kardex' } },
  { path: '/compras', name: 'purchases', component: PurchasesView, meta: { title: 'Compras y Recepción' } },
  { path: '/proveedores', name: 'suppliers', component: SuppliersView, meta: { title: 'Proveedores' } },
  { path: '/clientes', name: 'customers', component: CustomersView, meta: { title: 'Clientes' } },
  { path: '/pedidos', name: 'orders', component: OrdersView, meta: { title: 'Pedidos' } },
  { path: '/ventas', name: 'sales', component: SalesView, meta: { title: 'Ventas y Facturación' } },
  { path: '/finanzas/cuentas-por-cobrar', name: 'receivables', component: ReceivablesView, meta: { title: 'Cuentas por Cobrar' } },
  { path: '/finanzas/cuentas-por-pagar', name: 'payables', component: PayablesView, meta: { title: 'Cuentas por Pagar' } },
  { path: '/finanzas/tesoreria', name: 'treasury', component: TreasuryView, meta: { title: 'Tesorería y Movimientos' } },
  { path: '/distribucion', name: 'distribution', component: DistributionView, meta: { title: 'Distribución y Despachos' } },
  { path: '/reportes', name: 'reports', component: ReportsView, meta: { title: 'Reportes y Análisis' } },
  { path: '/configuracion', name: 'settings', component: SettingsView, meta: { title: 'Configuración y Seguridad' } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.afterEach((to) => {
  if (typeof document !== 'undefined') {
    document.title = `${to.meta?.title || 'Sistema'} — QuesoPlus ERP`
  }
})

export default router
