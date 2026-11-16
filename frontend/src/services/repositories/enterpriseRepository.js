import apiClient from '../http/apiClient.js'
import { createInitialEnterpriseData } from '../mocks/enterpriseSeedData.js'

const DATA_SOURCE = import.meta.env.VITE_DATA_SOURCE || 'mock'

/**
 * Capa de Repositorio Desacoplada.
 * Permite alternar entre la semilla estructurada ('mock') y el backend real
 * Node.js + Express + PostgreSQL 17 ('api') sin reescribir ningún componente Vue.
 */
export const enterpriseRepository = {
  getDataSourceMode() {
    return DATA_SOURCE
  },

  async fetchInitialSnapshot() {
    if (DATA_SOURCE === 'api') {
      return apiClient.get('/bootstrap')
    }
    return structuredClone(createInitialEnterpriseData())
  },

  async syncResource(endpoint, method = 'POST', payload = {}) {
    if (DATA_SOURCE === 'api') {
      return apiClient.request({
        url: endpoint,
        method,
        data: payload
      })
    }
    return { ok: true, mode: 'mock', timestamp: new Date().toISOString(), payload }
  }
}
