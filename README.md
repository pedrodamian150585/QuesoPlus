# QuesoPlus — Sistema Integral de Gestión Empresarial

Aplicación web empresarial **Dark Premium Enterprise SaaS** construida con **Vue.js 3 (Composition API)**, **Vite**, **Tailwind CSS**, **Pinia**, **Vue Router**, **Lucide Icons**, **Chart.js** y **Axios**, diseñada para la gestión integral de producción, calidad, inventarios, abastecimiento, comercialización, distribución y finanzas de palitos de queso y derivados.

## Stack Tecnológico Oficial
- **Frontend:** Vue 3 + Vite + JavaScript ES6+ + Tailwind CSS + Vue Router 4 + Pinia + Lucide Icons + Chart.js + Axios.
- **Pruebas y Calidad:** Playwright + Pixelmatch (`pngjs`) + Vitest + `@axe-core/playwright`.
- **Preparación Backend:** Capa de repositorios y cliente HTTP Axios lista para conectar con API REST en Node.js + Express + PostgreSQL 17 (`VITE_DATA_SOURCE=mock|api`).

## Comandos del Proyecto

```bash
# Servidor de desarrollo (http://127.0.0.1:5173)
npm run dev

# Compilación de producción
npm run build

# Pruebas unitarias y de integración de módulos (Vitest)
npm run test:unit

# Comparación visual automatizada pixel a pixel (Playwright + Pixelmatch)
npm run test:visual

# Suite E2E funcional y de accesibilidad WCAG con axe-core (Playwright)
npm run test:e2e
```

## Estructura del Repositorio
- `frontend/`: Código fuente modular de la aplicación Vue 3.
- `references/`: Imágenes originales de referencia (fuente de verdad visual inmutable, solo lectura).
- `tests/visual/`: Evidencias de regresión visual (`references/`, `actual/`, `diff/`, `overlay/`, `reports/`).
- `tests/unit/`: Pruebas unitarias con Vitest.
- `tests/e2e/`: Pruebas funcionales E2E y de accesibilidad con Playwright y `axe-core`.
- `documentation/`: Documentación de arquitectura, sistema de diseño y reportes de calidad.
