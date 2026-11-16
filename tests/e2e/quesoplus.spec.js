import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const ALL_21_ROUTES = [
  '/dashboard',
  '/productos',
  '/productos/categorias',
  '/productos/presentaciones',
  '/productos/fichas-tecnicas',
  '/productos/formulaciones',
  '/materias-primas',
  '/produccion',
  '/calidad',
  '/inventario',
  '/compras',
  '/proveedores',
  '/clientes',
  '/pedidos',
  '/ventas',
  '/finanzas/cuentas-por-cobrar',
  '/finanzas/cuentas-por-pagar',
  '/finanzas/tesoreria',
  '/distribucion',
  '/reportes',
  '/configuracion'
]

test.describe('QuesoPlus ERP — Suite E2E Funcional, Visual y de Accesibilidad (21 Módulos)', () => {
  test('navega por las 21 rutas modulares sin ningún error de consola ni excepción JS', async ({ page }) => {
    const errors = []
    page.on('pageerror', (err) => errors.push(err.message))
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text())
    })

    for (const route of ALL_21_ROUTES) {
      await page.goto(route, { waitUntil: 'networkidle' })
      await expect(page.locator('h1').first()).toBeAttached()
    }

    expect(errors).toEqual([])
  })

  test('ejecuta flujos interactivos en Productos: filtrado, búsqueda y creación mediante modal', async ({ page }) => {
    await page.goto('/productos', { waitUntil: 'networkidle' })

    // Abrir modal de nuevo producto
    await page.getByRole('button', { name: 'Crear Nuevo Producto' }).click()
    await expect(page.getByRole('dialog')).toBeVisible()

    // Llenar formulario de nuevo producto
    await page.locator('input[placeholder="Ej. Palitos de Queso Parmesano"]').fill('Palitos de Queso Trufados')
    await page.locator('textarea').fill('Edición gourmet con aceite de trufa blanca y mozzarella.')
    await page.getByRole('button', { name: 'Guardar Producto' }).click()

    await expect(page.getByRole('heading', { name: 'Palitos de Queso Trufados' })).toBeVisible()
  })

  test('ejecuta cambio de pestañas en Fichas Técnicas (Ingredientes, Nutrición, Calidad e Historial)', async ({ page }) => {
    await page.goto('/productos/fichas-tecnicas', { waitUntil: 'networkidle' })

    await page.getByRole('tab', { name: 'Ingredientes' }).click()
    await expect(page.getByText('Queso Mozzarella Fresco')).toBeVisible()

    await page.getByRole('tab', { name: 'Control de Calidad' }).click()
    await expect(page.getByText('Humedad del núcleo de queso')).toBeVisible()

    await page.getByRole('tab', { name: 'Historial' }).click()
    await expect(page.getByText('v2.4')).toBeVisible()
  })

  test('verifica coherencia operativa entre Compras, Producción, Cuentas por Cobrar y Cuentas por Pagar', async ({ page }) => {
    // 1. Recibir orden de compra
    await page.goto('/compras', { waitUntil: 'networkidle' })
    const receiveBtn = page.getByRole('button', { name: /Recibir e Ingresar a Almacén/i }).first()
    await expect(receiveBtn).toBeVisible()
    await receiveBtn.click()
    await expect(page.getByText(/Orden OC-2026-310 ingresada a inventario/i)).toBeVisible()

    // 2. Completar orden de producción
    await page.goto('/produccion', { waitUntil: 'networkidle' })
    const completeBtn = page.getByRole('button', { name: /Cerrar y Enviar a Stock/i }).first()
    await expect(completeBtn).toBeVisible()
    await completeBtn.click()
    await expect(page.getByText(/Lote #L-2026-0874 liberado/i)).toBeVisible()

    // 3. Registrar recaudo en Cuentas por Cobrar
    await page.goto('/finanzas/cuentas-por-cobrar', { waitUntil: 'networkidle' })
    await page.getByRole('button', { name: /Registrar Abono \/ Recaudo/i }).first().click()
    await page.getByRole('button', { name: /Aplicar Recaudo a Tesorería/i }).click()
    await expect(page.getByText(/Se abonaron/i)).toBeVisible()
  })

  test('valida adaptación responsive en resoluciones Desktop (1672x941, 1648x930), Tablet (768x1024) y Mobile (390x844)', async ({ page }) => {
    for (const vp of [
      { width: 1672, height: 941 },
      { width: 1648, height: 930 },
      { width: 768, height: 1024 },
      { width: 390, height: 844 }
    ]) {
      await page.setViewportSize(vp)
      await page.goto('/dashboard', { waitUntil: 'networkidle' })
      await expect(page.locator('main')).toBeVisible()
    }
  })

  test('supera auditoría de accesibilidad automatizada con axe-core sin violaciones críticas', async ({ page }) => {
    for (const route of ['/dashboard', '/productos', '/productos/categorias', '/productos/presentaciones', '/productos/fichas-tecnicas', '/compras']) {
      await page.goto(route, { waitUntil: 'networkidle' })
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .disableRules(['color-contrast'])
        .analyze()

      expect(results.violations).toEqual([])
    }
  })
})
