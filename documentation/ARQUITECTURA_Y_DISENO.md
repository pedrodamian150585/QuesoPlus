# QuesoPlus — Documentación Técnica, Sistema de Diseño y Arquitectura Empresarial

## 1. Identidad Visual Oficial
**Nombre del Sistema de Diseño:** `QuesoPlus — Dark Premium Enterprise SaaS`

### Tokens Centralizados (`frontend/src/styles/tokens.css`)
- **Fondos (`Surface Tokens`):**
  - `--qp-bg-canvas`: `#04070C`
  - `--qp-bg-sidebar`: `#02050B`
  - `--qp-bg-topbar`: `#06080E`
  - `--qp-bg-card`: `#0D1017` (`linear-gradient(180deg, #111520 0%, #090C12 100%)`)
- **Acentos (`Accent Tokens`):**
  - Rojo Principal (Marca / Acción): `#E11D2E` → `#A80212`
  - Dorado / Ámbar (Destacados / Ventas): `#F59E0B` / `#CF8004`
  - Verde Esmeralda (Positivo / Activo): `#10B981` / `#05972E`
  - Azul Real (Pedidos / Procesos): `#0EA5E9` / `#0567C0`
  - Violeta (Categorías / Especificaciones): `#8B5CF6` / `#7C3AED`

---

## 2. Arquitectura Modular Frontend (`frontend/src/`)

```text
frontend/src/
├── assets/images/            # Activos fotográficos e iconográficos extraídos sin alterar references/
├── components/
│   ├── common/               # BaseModal, ToastContainer, KpiStatCard, DonutStatCard, EnterpriseModuleShell
│   └── layout/               # AppSidebar, AppTopbar
├── layouts/
│   └── MainEnterpriseLayout.vue
├── views/                    # 21 vistas operativas correspondientes a los módulos 7.1 a 7.21
├── router/
│   └── index.js              # Enrutador Vue Router 4 con las 21 rutas empresariales
├── stores/
│   └── useEnterpriseStore.js # Estado reactivo Pinia con las 11 reglas de coherencia entre módulos
├── services/
│   ├── http/apiClient.js     # Cliente HTTP Axios preparado para Node.js + Express + PostgreSQL 17
│   ├── mocks/enterpriseSeedData.js
│   └── repositories/enterpriseRepository.js
├── styles/
│   ├── tokens.css
│   └── main.css
└── utils/
    └── formatters.js
```

---

## 3. Coherencia e Integración entre los 21 Módulos

El almacén central `useEnterpriseStore` garantiza en tiempo real las siguientes reglas de negocio:
1. **Orden de Compra (`7.11`) ↔ Proveedor (`7.12`) ↔ Materia Prima (`7.7`)**.
2. **Recepción de Mercancía (`7.11`) → Entrada en Inventario/Kardex (`7.10`) + Cuenta por Pagar (`7.17`)**.
3. **Orden de Producción (`7.8`) + Formulación (`7.6`) → Consumo de Materia Prima (`7.7`)**.
4. **Cierre de Producción (`7.8`) + Calidad (`7.9`) → Incremento de Producto Terminado (`7.2` / `7.10`)**.
5. **Pedido Comercial (`7.14`) ↔ Cliente (`7.13`) → Reserva de Stock (`7.10`) + Despacho (`7.19`)**.
6. **Venta a Crédito (`7.15`) → Genera Cuenta por Cobrar (`7.16`) y actualiza saldo del cliente**.
7. **Recaudo de Cartera (`7.16`) → Disminuye saldo de Cuenta por Cobrar e ingresa dinero en Tesorería (`7.18`)**.
8. **Factura de Proveedor (`7.11`) → Vinculada con Cuenta por Pagar (`7.17`)**.
9. **Pago a Proveedor (`7.17`) → Disminuye saldo de Cuenta por Pagar y registra Egreso en Tesorería (`7.18`)**.
10. **Distribución (`7.19`) → Sincroniza estado de entrega con el Pedido asociado (`7.14`)**.
11. **Dashboard (`7.1`) y Reportes (`7.20`) → Consolidan cifras coherentes de todos los módulos**.
