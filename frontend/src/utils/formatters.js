/**
 * Utilidades centralizadas de formato numérico, monetario (COP) y de fechas
 * para QuesoPlus Enterprise SaaS.
 */

export function formatNumber(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return '0'
  return new Intl.NumberFormat('es-CO', {
    maximumFractionDigits: 0
  }).format(Number(value))
}

export function formatCurrencyCOP(value, includeSuffix = false) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return includeSuffix ? '$ 0 COP' : '$ 0'
  }
  const formatted = new Intl.NumberFormat('es-CO', {
    maximumFractionDigits: 0
  }).format(Number(value))
  return includeSuffix ? `$ ${formatted} COP` : `$ ${formatted}`
}

export function formatPercentage(value, decimals = 1, withSign = false) {
  const num = Number(value || 0)
  const sign = withSign && num > 0 ? '+' : ''
  return `${sign}${num.toFixed(decimals)}%`
}

export function getStatusVariant(status) {
  const normalized = String(status || '').toLowerCase()
  if (['activo', 'activa', 'aprobado', 'aprobada', 'pagada', 'recibida', 'entregado', 'completada', 'liberado'].includes(normalized)) {
    return 'success'
  }
  if (['pendiente', 'en proceso', 'programada', 'parcialmente pagada', 'parcialmente recibida', 'en ruta', 'en reserva', 'borrador', 'enviada'].includes(normalized)) {
    return 'warning'
  }
  if (['inactivo', 'inactiva', 'vencida', 'cancelada', 'anulada', 'rechazado', 'no conforme', 'stock bajo', 'crítico'].includes(normalized)) {
    return 'danger'
  }
  return 'info'
}
