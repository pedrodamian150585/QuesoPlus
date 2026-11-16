import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { createInitialEnterpriseData } from '../services/mocks/enterpriseSeedData.js'
import { enterpriseRepository } from '../services/repositories/enterpriseRepository.js'
import { formatNumber } from '../utils/formatters.js'

export const useEnterpriseStore = defineStore('enterprise', () => {
  const rawState = ref(createInitialEnterpriseData())
  const toasts = ref([])
  const globalSearchQuery = ref('')

  // Accesores directos a colecciones
  const currentUser = computed(() => rawState.value.currentUser)
  const dashboard = computed(() => rawState.value.dashboard)
  const categories = computed(() => rawState.value.categories)
  const products = computed(() => rawState.value.products)
  const presentations = computed(() => rawState.value.presentations)
  const technicalSheets = computed(() => rawState.value.technicalSheets)
  const formulations = computed(() => rawState.value.formulations)
  const rawMaterials = computed(() => rawState.value.rawMaterials)
  const productionOrders = computed(() => rawState.value.productionOrders)
  const qualityInspections = computed(() => rawState.value.qualityInspections)
  const inventoryMovements = computed(() => rawState.value.inventoryMovements)
  const suppliers = computed(() => rawState.value.suppliers)
  const purchaseOrders = computed(() => rawState.value.purchaseOrders)
  const customers = computed(() => rawState.value.customers)
  const orders = computed(() => rawState.value.orders)
  const sales = computed(() => rawState.value.sales)
  const receivables = computed(() => rawState.value.receivables)
  const payables = computed(() => rawState.value.payables)
  const treasury = computed(() => rawState.value.treasury)
  const dispatches = computed(() => rawState.value.dispatches)
  const settings = computed(() => rawState.value.settings)

  // Métricas transversales coherentes para Reportes y Dashboard
  const totalReceivablesBalance = computed(() =>
    rawState.value.receivables.reduce((sum, item) => sum + Number(item.balance || 0), 0)
  )
  const totalPayablesBalance = computed(() =>
    rawState.value.payables.reduce((sum, item) => sum + Number(item.balance || 0), 0)
  )
  const totalTreasuryBalance = computed(() =>
    rawState.value.treasury.accounts.reduce((sum, acc) => sum + Number(acc.balance || 0), 0)
  )

  function notify(title, message, type = 'success') {
    const id = `TST-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
    toasts.value.push({ id, title, message, type })
    setTimeout(() => {
      dismissToast(id)
    }, 4000)
  }

  function dismissToast(id) {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  function appendAuditLog(moduleName, actionText) {
    rawState.value.settings.auditLogs.unshift({
      id: `AUD-${Date.now()}`,
      timestamp: '2026-11-15 10:30 AM',
      user: rawState.value.currentUser.name,
      module: moduleName,
      action: actionText
    })
  }

  // 1. PRODUCTOS CRUD
  async function saveProduct(productPayload) {
    await enterpriseRepository.syncResource('/products', productPayload.id ? 'PUT' : 'POST', productPayload)
    const category = rawState.value.categories.find(
      (c) => c.id === productPayload.categoryId || c.name === productPayload.categoryName
    )
    if (productPayload.id) {
      const idx = rawState.value.products.findIndex((p) => p.id === productPayload.id)
      if (idx !== -1) {
        rawState.value.products[idx] = {
          ...rawState.value.products[idx],
          ...productPayload,
          categoryName: category?.name || productPayload.categoryName || 'Palitos de Queso'
        }
        appendAuditLog('Productos', `Actualización de producto ${rawState.value.products[idx].code}`)
        notify('Producto actualizado', `${rawState.value.products[idx].name} se actualizó correctamente.`)
        return rawState.value.products[idx]
      }
    }
    const newProduct = {
      id: `PRD-0${rawState.value.products.length + 1}`,
      code: productPayload.code || `PQ-00${rawState.value.products.length + 1}`,
      name: productPayload.name,
      shortName: productPayload.shortName || productPayload.name,
      categoryId: category?.id || 'CAT-01',
      categoryName: category?.name || productPayload.categoryName || 'Palitos de Queso',
      description: productPayload.description || 'Producto elaborado bajo estándares de calidad QuesoPlus.',
      tagline: productPayload.tagline || 'Calidad artesanal QuesoPlus',
      longDescription: productPayload.longDescription || productPayload.description || '',
      status: productPayload.status || 'Activo',
      featured: Boolean(productPayload.featured),
      stock: Number(productPayload.stock ?? 1000),
      rotation: Number(productPayload.rotation ?? 90.0),
      unitPrice: Number(productPayload.unitPrice ?? 2500),
      monthlySales: Number(productPayload.monthlySales ?? 1200),
      rating: 4.8,
      presentationsCount: 1,
      presentationsSummary: 'Paquete estándar',
      imageKey: productPayload.imageKey || 'prod-card-1'
    }
    rawState.value.products.unshift(newProduct)
    appendAuditLog('Productos', `Registro de nuevo producto ${newProduct.code} (${newProduct.name})`)
    notify('Producto registrado', `${newProduct.name} fue agregado al catálogo.`)
    return newProduct
  }

  function toggleProductStatus(productId) {
    const prod = rawState.value.products.find((p) => p.id === productId)
    if (!prod) return
    prod.status = prod.status === 'Activo' ? 'Inactivo' : 'Activo'
    appendAuditLog('Productos', `Cambio de estado de ${prod.code} a ${prod.status}`)
    notify('Estado actualizado', `${prod.name} ahora está ${prod.status}.`, 'info')
  }

  // 2. CATEGORÍAS CRUD
  async function saveCategory(catPayload) {
    await enterpriseRepository.syncResource('/categories', catPayload.id ? 'PUT' : 'POST', catPayload)
    if (catPayload.id) {
      const idx = rawState.value.categories.findIndex((c) => c.id === catPayload.id)
      if (idx !== -1) {
        rawState.value.categories[idx] = { ...rawState.value.categories[idx], ...catPayload }
        notify('Categoría actualizada', `${catPayload.name} actualizada con éxito.`)
        return rawState.value.categories[idx]
      }
    }
    const created = {
      id: `CAT-0${rawState.value.categories.length + 1}`,
      code: catPayload.code || `CAT-0${rawState.value.categories.length + 1}`,
      name: catPayload.name,
      description: catPayload.description || 'Categoría comercial del catálogo QuesoPlus.',
      status: catPayload.status || 'Activa',
      productsCount: Number(catPayload.productsCount ?? 0),
      presentationsCount: Number(catPayload.presentationsCount ?? 0),
      share: Number(catPayload.share ?? 15.0),
      themeColor: catPayload.themeColor || 'red',
      imageKey: catPayload.imageKey || 'cat-card-1'
    }
    rawState.value.categories.push(created)
    appendAuditLog('Categorías', `Creación de categoría ${created.name}`)
    notify('Categoría creada', `${created.name} registrada en el catálogo.`)
    return created
  }

  function toggleCategoryStatus(categoryId) {
    const cat = rawState.value.categories.find((c) => c.id === categoryId)
    if (!cat) return
    cat.status = cat.status === 'Activa' ? 'Inactiva' : 'Activa'
    notify('Categoría actualizada', `Estado de ${cat.name}: ${cat.status}.`, 'info')
  }

  // 3. PRESENTACIONES CRUD
  async function savePresentation(presPayload) {
    await enterpriseRepository.syncResource('/presentations', presPayload.id ? 'PUT' : 'POST', presPayload)
    if (presPayload.id) {
      const idx = rawState.value.presentations.findIndex((p) => p.id === presPayload.id)
      if (idx !== -1) {
        rawState.value.presentations[idx] = { ...rawState.value.presentations[idx], ...presPayload }
        notify('Presentación actualizada', `${presPayload.name} guardada correctamente.`)
        return rawState.value.presentations[idx]
      }
    }
    const created = {
      id: `PRES-0${rawState.value.presentations.length + 1}`,
      code: presPayload.code || `PR-0${rawState.value.presentations.length + 1}`,
      productId: presPayload.productId || 'PRD-01',
      productName: presPayload.productName || 'Palitos de Queso',
      name: presPayload.name,
      description: presPayload.description || `Empaque de ${presPayload.unitsPerPackage || 10} unidades (${presPayload.netWeight || '150 g'}).`,
      netWeight: presPayload.netWeight || '150 g',
      netWeightGrams: parseInt(presPayload.netWeight, 10) || 150,
      unitsPerPackage: Number(presPayload.unitsPerPackage || 10),
      suggestedPrice: Number(presPayload.suggestedPrice || 5000),
      salesShare: Number(presPayload.salesShare || 15),
      monthlySales: Number(presPayload.monthlySales || 2500),
      status: presPayload.status || 'Activa',
      imageKey: presPayload.imageKey || 'pres-card-1'
    }
    rawState.value.presentations.unshift(created)
    appendAuditLog('Presentaciones', `Nueva presentación comercial ${created.name}`)
    notify('Presentación creada', `${created.productName} — ${created.name} registrada.`)
    return created
  }

  // 4. REGLA DE INTEGRACIÓN: RECEPCIÓN DE ÓRDENES DE COMPRA -> INVENTARIO MP + CXP
  async function receivePurchaseOrder(purchaseOrderId) {
    const po = rawState.value.purchaseOrders.find((o) => o.id === purchaseOrderId)
    if (!po || po.status === 'Recibida') return null
    await enterpriseRepository.syncResource(`/purchases/${purchaseOrderId}/receive`, 'POST')

    po.status = 'Recibida'
    const rm = rawState.value.rawMaterials.find((m) => m.id === po.rawMaterialId)
    if (rm) {
      rm.stock += Number(po.quantity || 0)
      rm.status = rm.stock >= rm.minStock ? 'Activo' : 'Stock Bajo'
    }

    rawState.value.inventoryMovements.unshift({
      id: `KDX-${Date.now()}`,
      code: `MOV-2026-${900 + rawState.value.inventoryMovements.length + 1}`,
      date: '2026-11-15 10:40 AM',
      type: 'Entrada',
      category: 'Materia Prima',
      itemName: rm ? rm.name : po.itemSummary,
      lotCode: rm ? rm.lotCode : 'LOT-REC-2611',
      quantity: Number(po.quantity || 0),
      unit: po.unit || 'kg',
      balanceAfter: rm ? rm.stock : Number(po.quantity || 0),
      reference: po.code
    })

    // Verificar si existe Cuenta por Pagar asociada; si no, generarla
    const existingPayable = rawState.value.payables.find((p) => p.purchaseOrderCode === po.code)
    if (!existingPayable) {
      rawState.value.payables.unshift({
        id: `CXP-0${rawState.value.payables.length + 1}`,
        invoiceCode: po.invoiceCode || `FP-${Math.floor(1000 + Math.random() * 9000)}`,
        purchaseOrderCode: po.code,
        supplierId: po.supplierId,
        supplierName: po.supplierName,
        issueDate: '2026-11-15',
        dueDate: '2026-12-15',
        agingBucket: '0 - 30 días',
        originalAmount: po.totalAmount,
        paidAmount: 0,
        balance: po.totalAmount,
        status: 'Pendiente'
      })
    }

    appendAuditLog('Compras / Inventario', `Recepción de ${po.code} (+${po.quantity} ${po.unit} en almacén)`)
    notify('Mercancía recibida', `Orden ${po.code} ingresada a inventario de materia prima.`)
    return po
  }

  // 5. REGLA DE INTEGRACIÓN: ORDEN DE PRODUCCIÓN -> CONSUMO MP -> CALIDAD -> INVENTARIO PT
  async function completeProductionOrder(productionOrderId) {
    const order = rawState.value.productionOrders.find((o) => o.id === productionOrderId)
    if (!order || order.status === 'Completada') return null
    await enterpriseRepository.syncResource(`/production/${productionOrderId}/complete`, 'POST')

    order.producedUnits = order.plannedUnits - (order.shrinkageUnits || 20)
    order.yieldPct = Number(((order.producedUnits / order.plannedUnits) * 100).toFixed(1))
    order.status = 'Completada'
    order.qualityStatus = 'Aprobado'

    // Consumir materia prima principal
    const mainRm = rawState.value.rawMaterials[0]
    if (mainRm && mainRm.stock >= 25) {
      mainRm.stock -= 25
    }

    // Incrementar stock de producto terminado
    const product = rawState.value.products.find((p) => p.id === order.productId)
    if (product) {
      product.stock += order.producedUnits
    }
    rawState.value.dashboard.inventoryStatus.inStock += order.producedUnits
    rawState.value.dashboard.kpis[0].rawValue += order.producedUnits
    rawState.value.dashboard.kpis[0].value = `${formatNumber(rawState.value.dashboard.kpis[0].rawValue)} und.`

    // Registrar movimiento en Kardex
    rawState.value.inventoryMovements.unshift({
      id: `KDX-${Date.now()}`,
      code: `MOV-2026-${900 + rawState.value.inventoryMovements.length + 1}`,
      date: '2026-11-15 10:45 AM',
      type: 'Entrada',
      category: 'Producto Terminado',
      itemName: order.productName,
      lotCode: order.lotCode,
      quantity: order.producedUnits,
      unit: 'und',
      balanceAfter: product ? product.stock : order.producedUnits,
      reference: order.code
    })

    appendAuditLog('Producción', `Cierre de orden ${order.code}: +${order.producedUnits} und. al inventario PT`)
    notify('Producción finalizada', `Lote ${order.lotCode} liberado (+${formatNumber(order.producedUnits)} und. en stock).`)
    return order
  }

  // 6. REGLA DE INTEGRACIÓN: CREAR PEDIDO -> RESERVA INVENTARIO -> DISTRIBUCIÓN
  async function createOrder(orderPayload) {
    await enterpriseRepository.syncResource('/orders', 'POST', orderPayload)
    const customer = rawState.value.customers.find((c) => c.id === orderPayload.customerId) || rawState.value.customers[0]
    const product = rawState.value.products.find((p) => p.id === orderPayload.productId) || rawState.value.products[0]
    const qty = Number(orderPayload.quantity || 100)
    const price = Number(orderPayload.unitPrice || product.unitPrice || 2500)
    const discountPct = Number(orderPayload.discountPct || 0)
    const subtotal = qty * price
    const totalAmount = Math.round(subtotal * (1 - discountPct / 100))

    const newOrder = {
      id: `ORD-0${rawState.value.orders.length + 1}`,
      code: `#PED-2026-${1045 + rawState.value.orders.length}`,
      customerId: customer.id,
      customerName: customer.name,
      productId: product.id,
      productName: product.name,
      presentationName: orderPayload.presentationName || 'Presentación Individual',
      quantity: qty,
      unitPrice: price,
      discountPct,
      totalAmount,
      date: '2026-11-15',
      deliveryDate: orderPayload.deliveryDate || '2026-11-16',
      status: 'Pendiente de Despacho'
    }

    rawState.value.orders.unshift(newOrder)
    rawState.value.dashboard.inventoryStatus.reserved += qty

    rawState.value.dispatches.unshift({
      id: `DSP-0${rawState.value.dispatches.length + 1}`,
      code: `DESP-2026-${205 + rawState.value.dispatches.length}`,
      orderCode: newOrder.code,
      customerName: customer.name,
      route: orderPayload.route || 'Ruta Principal Refrigerada',
      carrier: 'Flota Propia QuesoPlus (Furgón Refrigerado QPL-104)',
      driver: 'Wilmar Andrés Rojas',
      temperature: '2.0 °C',
      departureTime: 'Programado',
      status: 'Pendiente de Despacho',
      evidence: 'Pendiente de cargue'
    })

    appendAuditLog('Pedidos', `Creación de pedido ${newOrder.code} con reserva de ${qty} und.`)
    notify('Pedido registrado', `${newOrder.code} creado y stock reservado en inventario.`)
    return newOrder
  }

  // 7. REGLA DE INTEGRACIÓN: REGISTRAR VENTA -> FACTURACIÓN -> CXC (CRÉDITO) O TESORERÍA (CONTADO)
  async function registerSale(salePayload) {
    await enterpriseRepository.syncResource('/sales', 'POST', salePayload)
    const customer = rawState.value.customers.find((c) => c.id === salePayload.customerId) || rawState.value.customers[0]
    const totalAmount = Number(salePayload.totalAmount || 1850000)
    const invoiceCode = `#F-2026-${4521 + rawState.value.sales.length}`
    const paymentType = salePayload.paymentType || 'Crédito'

    const newSale = {
      id: `SAL-0${rawState.value.sales.length + 1}`,
      invoiceCode,
      orderCode: salePayload.orderCode || '#PED-2026-1045',
      customerId: customer.id,
      customerName: customer.name,
      paymentType,
      itemsSummary: salePayload.itemsSummary || '200x Palitos de Queso Clásicos',
      subtotal: totalAmount,
      discount: 0,
      totalAmount,
      date: '2026-11-15 11:05 AM',
      status: paymentType === 'Contado' ? 'Pagada' : 'Facturada'
    }
    rawState.value.sales.unshift(newSale)

    if (paymentType === 'Crédito') {
      rawState.value.receivables.unshift({
        id: `CXC-0${rawState.value.receivables.length + 1}`,
        invoiceCode,
        customerId: customer.id,
        customerName: customer.name,
        issueDate: '2026-11-15',
        dueDate: '2026-12-15',
        agingBucket: '0 - 30 días',
        originalAmount: totalAmount,
        paidAmount: 0,
        balance: totalAmount,
        status: 'Pendiente'
      })
      customer.currentBalance += totalAmount
      notify('Venta a crédito facturada', `Factura ${invoiceCode} generó cuenta por cobrar por $${formatNumber(totalAmount)}.`)
    } else {
      rawState.value.treasury.accounts[0].balance += totalAmount
      rawState.value.treasury.movements.unshift({
        id: `TES-0${rawState.value.treasury.movements.length + 1}`,
        code: `RC-2026-${710 + rawState.value.treasury.movements.length}`,
        date: '2026-11-15 11:05 AM',
        type: 'Ingreso',
        category: 'Venta de Contado',
        accountName: rawState.value.treasury.accounts[0].name,
        paymentMethod: 'Transferencia Bancaria',
        reference: invoiceCode,
        amount: totalAmount,
        status: 'Conciliado'
      })
      notify('Venta de contado registrada', `Factura ${invoiceCode} ingresada en Tesorería.`)
    }

    appendAuditLog('Ventas', `Emisión de factura ${invoiceCode} (${paymentType})`)
    return newSale
  }

  // 8. REGLA DE INTEGRACIÓN: RECAUDO EN CUENTAS POR COBRAR -> DISMINUYE SALDO + INGRESO TESORERÍA
  async function registerReceivableCollection(receivableId, amount, paymentMethod = 'Transferencia ACH') {
    const item = rawState.value.receivables.find((r) => r.id === receivableId)
    if (!item || item.balance <= 0) return null
    const applied = Math.min(Number(amount || item.balance), item.balance)
    await enterpriseRepository.syncResource(`/receivables/${receivableId}/collect`, 'POST', { amount: applied })

    item.paidAmount += applied
    item.balance -= applied
    item.status = item.balance === 0 ? 'Pagada' : 'Parcialmente pagada'

    const customer = rawState.value.customers.find((c) => c.id === item.customerId)
    if (customer) {
      customer.currentBalance = Math.max(0, customer.currentBalance - applied)
    }

    rawState.value.treasury.accounts[0].balance += applied
    rawState.value.treasury.movements.unshift({
      id: `TES-${Date.now()}`,
      code: `RC-2026-${711 + rawState.value.treasury.movements.length}`,
      date: '2026-11-15 11:15 AM',
      type: 'Ingreso',
      category: 'Recaudo Cartera Cliente',
      accountName: rawState.value.treasury.accounts[0].name,
      paymentMethod,
      reference: item.invoiceCode,
      amount: applied,
      status: 'Conciliado'
    })

    appendAuditLog('Cuentas por Cobrar', `Recaudo aplicado a ${item.invoiceCode} por $${formatNumber(applied)}`)
    notify('Recaudo registrado', `Se abonaron $${formatNumber(applied)} a la factura ${item.invoiceCode}.`)
    return item
  }

  // 9. REGLA DE INTEGRACIÓN: PAGO EN CUENTAS POR PAGAR -> DISMINUYE SALDO + EGRESO TESORERÍA
  async function registerPayablePayment(payableId, amount, paymentMethod = 'Transferencia Bancaria') {
    const item = rawState.value.payables.find((p) => p.id === payableId)
    if (!item || item.balance <= 0) return null
    const applied = Math.min(Number(amount || item.balance), item.balance)
    await enterpriseRepository.syncResource(`/payables/${payableId}/pay`, 'POST', { amount: applied })

    item.paidAmount += applied
    item.balance -= applied
    item.status = item.balance === 0 ? 'Pagada' : 'Parcialmente pagada'

    const supplier = rawState.value.suppliers.find((s) => s.id === item.supplierId)
    if (supplier) {
      supplier.pendingBalance = Math.max(0, supplier.pendingBalance - applied)
    }

    rawState.value.treasury.accounts[0].balance = Math.max(0, rawState.value.treasury.accounts[0].balance - applied)
    rawState.value.treasury.movements.unshift({
      id: `TES-${Date.now()}`,
      code: `CE-2026-${520 + rawState.value.treasury.movements.length}`,
      date: '2026-11-15 11:20 AM',
      type: 'Egreso',
      category: 'Pago a Proveedor',
      accountName: rawState.value.treasury.accounts[0].name,
      paymentMethod,
      reference: item.invoiceCode,
      amount: applied,
      status: 'Conciliado'
    })

    appendAuditLog('Cuentas por Pagar', `Pago aplicado a factura ${item.invoiceCode} por $${formatNumber(applied)}`)
    notify('Pago a proveedor aplicado', `Se pagaron $${formatNumber(applied)} sobre ${item.invoiceCode}.`)
    return item
  }

  // 10. REGLA DE INTEGRACIÓN: DISTRIBUCIÓN <-> PEDIDOS
  async function advanceDispatchStatus(dispatchId) {
    const dsp = rawState.value.dispatches.find((d) => d.id === dispatchId)
    if (!dsp) return null
    if (dsp.status === 'Pendiente de Despacho') {
      dsp.status = 'En Ruta'
      dsp.departureTime = '2026-11-15 11:25 AM'
      dsp.evidence = 'GPS Activo — Salida de planta verificada'
    } else if (dsp.status === 'En Ruta') {
      dsp.status = 'Entregado'
      dsp.evidence = `Guía firmada #GRE-${Math.floor(1000 + Math.random() * 9000)}`
    }
    const linkedOrder = rawState.value.orders.find((o) => o.code === dsp.orderCode)
    if (linkedOrder) {
      linkedOrder.status = dsp.status
    }
    appendAuditLog('Distribución', `Despacho ${dsp.code} (${dsp.orderCode}) actualizado a ${dsp.status}`)
    notify('Estado de despacho actualizado', `${dsp.code} pasó a estado: ${dsp.status}.`)
    return dsp
  }

  // 11. CREACIÓN GENÉRICA DE REGISTROS EN CUALQUIER MÓDULO OPERATIVO
  function addGenericRecord(collectionKey, record, moduleTitle = 'Sistema') {
    if (!Array.isArray(rawState.value[collectionKey])) return null
    rawState.value[collectionKey].unshift(record)
    appendAuditLog(moduleTitle, `Nuevo registro creado: ${record.code || record.name || record.id}`)
    notify('Registro guardado', `Se agregó correctamente en ${moduleTitle}.`)
    return record
  }

  return {
    rawState,
    toasts,
    globalSearchQuery,
    currentUser,
    dashboard,
    categories,
    products,
    presentations,
    technicalSheets,
    formulations,
    rawMaterials,
    productionOrders,
    qualityInspections,
    inventoryMovements,
    suppliers,
    purchaseOrders,
    customers,
    orders,
    sales,
    receivables,
    payables,
    treasury,
    dispatches,
    settings,
    totalReceivablesBalance,
    totalPayablesBalance,
    totalTreasuryBalance,
    notify,
    dismissToast,
    saveProduct,
    toggleProductStatus,
    saveCategory,
    toggleCategoryStatus,
    savePresentation,
    receivePurchaseOrder,
    completeProductionOrder,
    createOrder,
    registerSale,
    registerReceivableCollection,
    registerPayablePayment,
    advanceDispatchStatus,
    addGenericRecord
  }
})
