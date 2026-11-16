import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useEnterpriseStore } from '../../frontend/src/stores/useEnterpriseStore.js'
import { formatNumber, formatCurrencyCOP } from '../../frontend/src/utils/formatters.js'
import fs from 'fs'
import crypto from 'crypto'
import path from 'path'

describe('QuesoPlus Enterprise Store — Integración y Coherencia de los 21 Módulos', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('conserva intactas las 5 imágenes originales de referencia (dimensiones y hash SHA-256)', () => {
    const expectedHashes = {
      'categories.png': 'b8a22d9157d92294f870acea45fd809997e2480b24ce3f1b86ffa05e0f319884',
      'dashboard.png': '6d74204e5aeedc2ece324f178a9c5d932d149a0e57182b58a2c11e7fbc2c02a1',
      'presentations.png': 'edbd88c5e608c8aac75a41a83a9c2920243a691767ffb759dc4515a7d5732b03',
      'products.png': 'fa08703f576899ab49e5592c8364c0c1ec3842aaa465a2b8dd16cb2b14aee26a',
      'technical-sheets.png': '1dcf6e8974cbb8a247f816692c4a6a6b5d5d36517c40758920b5c370e9970f84'
    }

    for (const [filename, expectedHash] of Object.entries(expectedHashes)) {
      const filePath = path.resolve(process.cwd(), 'references', filename)
      expect(fs.existsSync(filePath)).toBe(true)
      const buffer = fs.readFileSync(filePath)
      const actualHash = crypto.createHash('sha256').update(buffer).digest('hex')
      expect(actualHash).toBe(expectedHash)
    }
  })

  it('inicializa las métricas exactas del Dashboard y Catálogo de acuerdo con las referencias', () => {
    const store = useEnterpriseStore()
    expect(store.dashboard.kpis[0].value).toBe('2.850 und.')
    expect(store.dashboard.kpis[1].value).toBe('48.750 und.')
    expect(store.dashboard.kpis[2].value).toBe('12 pedidos')
    expect(store.dashboard.kpis[3].value).toBe('15.320 und.')
    expect(store.products.length).toBe(6)
    expect(store.categories.length).toBe(3)
    expect(store.presentations.length).toBe(6)
    expect(store.technicalSheets[0].code).toBe('PQ-001')
  })

  it('Reglas 1 y 2: Recepción de orden de compra incrementa inventario de materia prima y registra Kardex', async () => {
    const store = useEnterpriseStore()
    const rmBefore = store.rawMaterials.find((m) => m.id === 'MP-01').stock
    const kardexCountBefore = store.inventoryMovements.length

    await store.receivePurchaseOrder('PO-01')

    const poAfter = store.purchaseOrders.find((o) => o.id === 'PO-01')
    const rmAfter = store.rawMaterials.find((m) => m.id === 'MP-01').stock

    expect(poAfter.status).toBe('Recibida')
    expect(rmAfter).toBe(rmBefore + 200)
    expect(store.inventoryMovements.length).toBe(kardexCountBefore + 1)
    expect(store.inventoryMovements[0].type).toBe('Entrada')
  })

  it('Reglas 3 y 4: Completar orden de producción consume materia prima e incrementa stock de producto terminado', async () => {
    const store = useEnterpriseStore()
    const prodBefore = store.products.find((p) => p.id === 'PRD-02').stock
    const rmBefore = store.rawMaterials[0].stock

    const completed = await store.completeProductionOrder('OP-02')

    const prodAfter = store.products.find((p) => p.id === 'PRD-02').stock
    expect(completed.status).toBe('Completada')
    expect(prodAfter).toBeGreaterThan(prodBefore)
    expect(store.rawMaterials[0].stock).toBe(rmBefore - 25)
  })

  it('Reglas 5 y 10: Crear un pedido reserva inventario, genera despacho y sincroniza entrega', async () => {
    const store = useEnterpriseStore()
    const reservedBefore = store.dashboard.inventoryStatus.reserved

    const order = await store.createOrder({
      customerId: 'CLI-01',
      productId: 'PRD-01',
      quantity: 120,
      unitPrice: 2500,
      discountPct: 10
    })

    expect(store.dashboard.inventoryStatus.reserved).toBe(reservedBefore + 120)
    const dispatch = store.dispatches.find((d) => d.orderCode === order.code)
    expect(dispatch).toBeDefined()

    await store.advanceDispatchStatus(dispatch.id)
    expect(dispatch.status).toBe('En Ruta')
    expect(order.status).toBe('En Ruta')

    await store.advanceDispatchStatus(dispatch.id)
    expect(dispatch.status).toBe('Entregado')
    expect(order.status).toBe('Entregado')
  })

  it('Reglas 6 y 7: Venta a crédito genera Cuenta por Cobrar y su recaudo disminuye el saldo e ingresa a Tesorería', async () => {
    const store = useEnterpriseStore()
    const receivablesCountBefore = store.receivables.length
    const bankBalanceBefore = store.treasury.accounts[0].balance

    const sale = await store.registerSale({
      customerId: 'CLI-01',
      paymentType: 'Crédito',
      totalAmount: 1500000,
      itemsSummary: '150x Palitos de Queso'
    })

    expect(store.receivables.length).toBe(receivablesCountBefore + 1)
    const createdCxC = store.receivables.find((r) => r.invoiceCode === sale.invoiceCode)
    expect(createdCxC.balance).toBe(1500000)

    await store.registerReceivableCollection(createdCxC.id, 500000)
    expect(createdCxC.balance).toBe(1000000)
    expect(createdCxC.status).toBe('Parcialmente pagada')
    expect(store.treasury.accounts[0].balance).toBe(bankBalanceBefore + 500000)

    await store.registerReceivableCollection(createdCxC.id, 1000000)
    expect(createdCxC.balance).toBe(0)
    expect(createdCxC.status).toBe('Pagada')
  })

  it('Reglas 8 y 9: Pago de Cuenta por Pagar disminuye obligación con proveedor y registra Egreso en Tesorería', async () => {
    const store = useEnterpriseStore()
    const payable = store.payables[0]
    const initialBalance = payable.balance
    const treasuryBefore = store.treasury.accounts[0].balance

    await store.registerPayablePayment(payable.id, 1850000)

    expect(payable.balance).toBe(initialBalance - 1850000)
    expect(payable.status).toBe('Parcialmente pagada')
    expect(store.treasury.accounts[0].balance).toBe(treasuryBefore - 1850000)
    expect(store.treasury.movements[0].type).toBe('Egreso')
  })

  it('formatea números y moneda COP de manera consistente', () => {
    expect(formatNumber(15320)).toBe('15.320')
    expect(formatCurrencyCOP(2500, true)).toBe('$ 2.500 COP')
  })
})
