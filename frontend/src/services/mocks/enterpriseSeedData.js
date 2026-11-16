/**
 * Semilla de datos empresariales estructurados y relacionales de QuesoPlus.
 * Reúne las cifras exactas de las 5 referencias visuales y conecta los 21 módulos.
 */

export function createInitialEnterpriseData() {
  return {
    currentUser: {
      id: 'USR-001',
      name: 'Pedro Damián Caldera',
      firstName: 'Pedro',
      role: 'Administrador',
      email: 'pedro.caldera@quesoplus.co',
      NotificationsCount: 3
    },

    dashboard: {
      dateLabel: 'Sábado, 15 de Noviembre de 2026 | 10:24 AM',
      kpis: [
        {
          id: 'kpi-prod-dia',
          title: 'Producción del Día',
          value: '2.850 und.',
          rawValue: 2850,
          delta: '+8.5%',
          color: 'red',
          icon: 'box',
          sparkline: [18, 22, 19, 28, 24, 35, 31, 42, 48]
        },
        {
          id: 'kpi-ventas-mes',
          title: 'Ventas del Mes',
          value: '48.750 und.',
          rawValue: 48750,
          delta: '+12.3%',
          color: 'amber',
          icon: 'shopping-cart',
          sparkline: [15, 20, 18, 29, 25, 36, 33, 46, 52]
        },
        {
          id: 'kpi-pedidos-proc',
          title: 'Pedidos en Proceso',
          value: '12 pedidos',
          rawValue: 12,
          delta: '+20.0%',
          color: 'blue',
          icon: 'truck',
          sparkline: [10, 14, 13, 21, 19, 29, 26, 36, 44]
        },
        {
          id: 'kpi-stock-total',
          title: 'Productos en Stock',
          value: '15.320 und.',
          rawValue: 15320,
          delta: '+5.7%',
          color: 'green',
          icon: 'check-circle',
          sparkline: [12, 17, 15, 24, 21, 31, 28, 39, 45]
        }
      ],
      productionVsSales: {
        labels: ['Oct 17', 'Oct 20', 'Oct 23', 'Oct 26', 'Oct 29', 'Nov 01', 'Nov 04', 'Nov 07', 'Nov 10', 'Nov 13', 'Nov 15'],
        periods: {
          '7d': {
            labels: ['Nov 09', 'Nov 10', 'Nov 11', 'Nov 12', 'Nov 13', 'Nov 14', 'Nov 15'],
            production: [2750, 2900, 2680, 3100, 3350, 3480, 3600],
            sales: [2300, 2400, 2180, 2650, 2950, 2980, 3000]
          },
          '30d': {
            labels: ['Oct 17', 'Oct 20', 'Oct 23', 'Oct 26', 'Oct 29', 'Nov 01', 'Nov 04', 'Nov 07', 'Nov 10', 'Nov 13', 'Nov 15'],
            production: [1500, 2400, 2350, 2980, 2380, 2920, 2420, 2900, 2850, 3500, 3600],
            sales: [1000, 1880, 1800, 2460, 1850, 2350, 1900, 2380, 2260, 2960, 2980]
          },
          '90d': {
            labels: ['Ago', 'Sep S1', 'Sep S3', 'Oct S1', 'Oct S3', 'Nov S1', 'Nov 15'],
            production: [1900, 2200, 2500, 2700, 3050, 3300, 3600],
            sales: [1650, 1950, 2100, 2350, 2650, 2850, 2980]
          },
          '1a': {
            labels: ['Ene', 'Mar', 'May', 'Jul', 'Sep', 'Nov'],
            production: [1800, 2150, 2480, 2790, 3120, 3600],
            sales: [1500, 1890, 2190, 2420, 2750, 2980]
          }
        }
      },
      inventoryStatus: {
        percentage: 78,
        inStock: 15320,
        reserved: 3200,
        lowStock: 1150
      },
      importantAlerts: [
        {
          id: 'ALT-01',
          title: 'Stock bajo de Queso Mozzarella',
          time: 'Hace 15 min',
          type: 'danger',
          route: '/materias-primas'
        },
        {
          id: 'ALT-02',
          title: 'Pedido #PED-2026-1045 pendiente de despacho',
          time: 'Hace 1 h',
          type: 'warning',
          route: '/distribucion'
        },
        {
          id: 'ALT-03',
          title: 'Mantenimiento programado en la línea de producción',
          time: 'Hoy 6:00 PM',
          type: 'info',
          route: '/produccion'
        }
      ],
      recentMovements: [
        {
          id: 'MOV-01',
          text: 'Producción completada: Lote #L-2026-0873',
          time: '10:12 AM',
          type: 'success',
          icon: 'check'
        },
        {
          id: 'MOV-02',
          text: 'Venta registrada: Factura #F-2026-4521',
          time: '09:47 AM',
          type: 'info',
          icon: 'cart'
        },
        {
          id: 'MOV-03',
          text: 'Despacho realizado: Pedido #PED-2026-1044',
          time: '09:30 AM',
          type: 'warning',
          icon: 'truck'
        },
        {
          id: 'MOV-04',
          text: 'Ingreso de materia prima: Queso Mozzarella',
          time: '08:50 AM',
          type: 'purple',
          icon: 'box'
        },
        {
          id: 'MOV-05',
          text: 'Control de calidad aprobado: Lote #L-2026-0872',
          time: '08:35 AM',
          type: 'success',
          icon: 'check'
        }
      ],
      businessSummary: {
        totalSales: 12850000,
        salesDelta: '+14.2%',
        totalProduction: 3250,
        productionDelta: '+10.1%',
        totalCustomers: 842,
        customersDelta: '+11.7%',
        achievementTitle: '¡Excelente desempeño este mes!',
        achievementText: 'Has superado la meta de ventas en un 14%.'
      }
    },

    categories: [
      {
        id: 'CAT-01',
        name: 'Palitos de Queso',
        code: 'CAT-PQ',
        description: 'Crujientes por fuera, irresistibles por dentro.',
        status: 'Activa',
        productsCount: 2,
        presentationsCount: 3,
        share: 98.5,
        themeColor: 'red',
        imageKey: 'cat-card-1'
      },
      {
        id: 'CAT-02',
        name: 'Bolitas de Queso',
        code: 'CAT-BQ',
        description: 'Pequeñas porciones de gran sabor.',
        status: 'Activa',
        productsCount: 1,
        presentationsCount: 2,
        share: 32.3,
        themeColor: 'amber',
        imageKey: 'cat-card-2'
      },
      {
        id: 'CAT-03',
        name: 'Mozzarella Sticks',
        code: 'CAT-MS',
        description: 'El clásico que todos aman.',
        status: 'Activa',
        productsCount: 3,
        presentationsCount: 4,
        share: 68.2,
        themeColor: 'purple',
        imageKey: 'cat-card-3'
      }
    ],

    products: [
      {
        id: 'PRD-01',
        code: 'PQ-001',
        name: 'Palitos de Queso Clásicos',
        shortName: 'Palitos de Queso',
        categoryId: 'CAT-01',
        categoryName: 'Palitos de Queso',
        description: 'Deliciosos palitos de queso con un sabor inigualable.',
        tagline: 'Crujientes por fuera, irresistibles por dentro',
        longDescription:
          'Deliciosos palitos de queso elaborados con ingredientes de alta calidad, con un empanizado crujiente y un interior suave y fundente. Ideales para compartir en familia o disfrutar en cualquier momento.',
        status: 'Activo',
        featured: true,
        stock: 12500,
        rotation: 98.5,
        unitPrice: 2500,
        monthlySales: 8750,
        rating: 4.8,
        presentationsCount: 3,
        presentationsSummary: 'Paquete x 5, 10 y 20 und.',
        imageKey: 'prod-card-1'
      },
      {
        id: 'PRD-02',
        code: 'BQ-001',
        name: 'Bolitas de Queso',
        shortName: 'Bolitas de Queso',
        categoryId: 'CAT-02',
        categoryName: 'Bolitas de Queso',
        description: 'Suaves y crujientes por fuera, cremosas por dentro.',
        tagline: 'Pequeñas porciones de gran sabor artesanal',
        longDescription:
          'Esferas doradas de masa artesanal rellenas con abundante queso doble crema seleccionado. Textura exterior crocante y centro cremoso.',
        status: 'Activo',
        featured: false,
        stock: 8200,
        rotation: 92.3,
        unitPrice: 1800,
        monthlySales: 6420,
        rating: 4.7,
        presentationsCount: 2,
        presentationsSummary: 'Paquete x 10 y 20 und.',
        imageKey: 'prod-card-2'
      },
      {
        id: 'PRD-03',
        code: 'MS-001',
        name: 'Mozzarella Sticks',
        shortName: 'Mozzarella Sticks',
        categoryId: 'CAT-03',
        categoryName: 'Mozzarella Sticks',
        description: 'Palitos rellenos de mozzarella con un crujiente perfecto.',
        tagline: 'El clásico empanizado estilo gourmet',
        longDescription:
          'Bastones de queso mozzarella puro recubiertos con pan rallado especiado con finas hierbas italianas, listos para freír o preparar en airfryer.',
        status: 'Activo',
        featured: false,
        stock: 5750,
        rotation: 87.6,
        unitPrice: 2800,
        monthlySales: 5180,
        rating: 4.9,
        presentationsCount: 3,
        presentationsSummary: 'Paquete x 8, 16 y 32 und.',
        imageKey: 'prod-card-3'
      },
      {
        id: 'PRD-04',
        code: 'PQ-002',
        name: 'Palitos de Queso Finas Hierbas',
        shortName: 'Palitos Finas Hierbas',
        categoryId: 'CAT-01',
        categoryName: 'Palitos de Queso',
        description: 'Palitos de queso mozzarella con toque artesanal de orégano.',
        tagline: 'Aroma mediterráneo y queso fundente',
        longDescription:
          'Variante gourmet de nuestros palitos clásicos con mezcla de hierbas aromáticas seleccionadas en la cobertura.',
        status: 'Activo',
        featured: false,
        stock: 4100,
        rotation: 89.4,
        unitPrice: 2700,
        monthlySales: 3200,
        rating: 4.7,
        presentationsCount: 2,
        presentationsSummary: 'Paquete x 5 y 10 und.',
        imageKey: 'prod-card-1'
      },
      {
        id: 'PRD-05',
        code: 'PQ-003',
        name: 'Palitos de Queso Horneados',
        shortName: 'Palitos Horneados',
        categoryId: 'CAT-01',
        categoryName: 'Palitos de Queso',
        description: 'Fórmula ligera lista para hornear en 8 minutos.',
        tagline: 'Sabor tradicional con menor contenido graso',
        longDescription:
          'Palitos pre-horneados ultracongelados diseñados para hornos convencionales y freidoras de aire.',
        status: 'Activo',
        featured: false,
        stock: 3400,
        rotation: 84.1,
        unitPrice: 2900,
        monthlySales: 2890,
        rating: 4.6,
        presentationsCount: 2,
        presentationsSummary: 'Paquete x 10 y 20 und.',
        imageKey: 'prod-card-1'
      },
      {
        id: 'PRD-06',
        code: 'BQ-002',
        name: 'Bolitas de Queso y Bocadillo',
        shortName: 'Bolitas Queso y Bocadillo',
        categoryId: 'CAT-02',
        categoryName: 'Bolitas de Queso',
        description: 'Contraste tradicional de queso mozzarella y bocadillo veleño.',
        tagline: 'El equilibrio dulce-salado favorito',
        longDescription:
          'Deliciosas bolitas rellenas con cubos de queso mozzarella y bocadillo de guayaba seleccionado.',
        status: 'Activo',
        featured: false,
        stock: 4600,
        rotation: 91.0,
        unitPrice: 2100,
        monthlySales: 4120,
        rating: 4.8,
        presentationsCount: 2,
        presentationsSummary: 'Paquete x 12 y 24 und.',
        imageKey: 'prod-card-2'
      }
    ],

    presentations: [
      {
        id: 'PRES-01',
        code: 'PR-PQ-05',
        productId: 'PRD-01',
        productName: 'Palitos de Queso',
        name: 'Presentación Individual',
        description: 'Porción individual de 5 unidades (aprox. 75 g).',
        netWeight: '75 g',
        netWeightGrams: 75,
        unitsPerPackage: 5,
        suggestedPrice: 2500,
        salesShare: 38,
        monthlySales: 12450,
        status: 'Activa',
        imageKey: 'pres-card-1'
      },
      {
        id: 'PRES-02',
        code: 'PR-BQ-20',
        productId: 'PRD-02',
        productName: 'Bolitas de Queso',
        name: 'Presentación Familiar',
        description: 'Porción familiar de 20 unidades (aprox. 250 g).',
        netWeight: '250 g',
        netWeightGrams: 250,
        unitsPerPackage: 20,
        suggestedPrice: 8000,
        salesShare: 42,
        monthlySales: 18760,
        status: 'Activa',
        imageKey: 'pres-card-2'
      },
      {
        id: 'PRES-03',
        code: 'PR-MS-08',
        productId: 'PRD-03',
        productName: 'Mozzarella Sticks',
        name: 'Presentación Especial',
        description: 'Porción especial de 8 unidades (aprox. 200 g).',
        netWeight: '200 g',
        netWeightGrams: 200,
        unitsPerPackage: 8,
        suggestedPrice: 7500,
        salesShare: 20,
        monthlySales: 8320,
        status: 'Activa',
        imageKey: 'pres-card-3'
      },
      {
        id: 'PRES-04',
        code: 'PR-PQ-10',
        productId: 'PRD-01',
        productName: 'Palitos de Queso',
        name: 'Presentación Dúo Pack',
        description: 'Bandeja intermedia de 10 unidades (aprox. 150 g).',
        netWeight: '150 g',
        netWeightGrams: 150,
        unitsPerPackage: 10,
        suggestedPrice: 4800,
        salesShare: 28,
        monthlySales: 9400,
        status: 'Activa',
        imageKey: 'pres-card-1'
      },
      {
        id: 'PRES-05',
        code: 'PR-PQ-20',
        productId: 'PRD-01',
        productName: 'Palitos de Queso',
        name: 'Presentación Familiar 20 und.',
        description: 'Empaque familiar ahorro de 20 unidades (aprox. 300 g).',
        netWeight: '300 g',
        netWeightGrams: 300,
        unitsPerPackage: 20,
        suggestedPrice: 9200,
        salesShare: 34,
        monthlySales: 11200,
        status: 'Activa',
        imageKey: 'pres-card-1'
      },
      {
        id: 'PRES-06',
        code: 'PR-MS-32',
        productId: 'PRD-03',
        productName: 'Mozzarella Sticks',
        name: 'Presentación Institucional HORECA',
        description: 'Bolsa institucional de 32 unidades (aprox. 800 g).',
        netWeight: '800 g',
        netWeightGrams: 800,
        unitsPerPackage: 32,
        suggestedPrice: 26500,
        salesShare: 18,
        monthlySales: 6150,
        status: 'Activa',
        imageKey: 'pres-card-3'
      }
    ],

    technicalSheets: [
      {
        id: 'FT-01',
        productId: 'PRD-01',
        code: 'PQ-001',
        commercialName: 'Palitos de Queso',
        categoryName: 'Palitos de Queso',
        shortDescription: 'Crujientes y deliciosos',
        presentationsText: 'Paquete x 5, 10 y 20 und.',
        suggestedPrice: 2500,
        status: 'Activo',
        featured: true,
        presentationsCount: 3,
        stock: 12500,
        monthlySales: 8750,
        rotation: 18.5,
        rating: 4.8,
        nutritionPer100g: {
          calories: 412,
          proteins: '22.5 g',
          totalFat: '18.0 g',
          carbohydrates: '34.0 g',
          sodium: '620 mg'
        },
        technicalSpecs: {
          unitNetWeight: '25 g',
          packageDimensions: '18 x 12 x 4 cm',
          storageTemperature: '0 °C a 4 °C',
          shelfLife: '30 días',
          packagingType: 'Bolsa de Polipropileno',
          productType: 'Producto Terminado'
        },
        ingredients: [
          { name: 'Queso Mozzarella Fresco', percentage: '52%', allergen: 'Lácteos', origin: 'Nacional certificada' },
          { name: 'Harina de Trigo Fortificada', percentage: '28%', allergen: 'Gluten', origin: 'Molino Industrial' },
          { name: 'Empanizador Dorado Crujiente', percentage: '10%', allergen: 'Gluten', origin: 'Planta Procesadora' },
          { name: 'Mantequilla Pasteurizada', percentage: '6%', allergen: 'Lácteos', origin: 'Cuenca Lechera' },
          { name: 'Huevo Entero Pasteurizado y Sal Marina', percentage: '4%', allergen: 'Huevo', origin: 'Granja Biosegura' }
        ],
        qualityParameters: [
          { parameter: 'Humedad del núcleo de queso', target: '44% - 48%', method: 'Termobalanza halógena' },
          { parameter: 'Temperatura interna de empaque', target: '2.0 °C ± 1.5 °C', method: 'Termómetro punzón calibrado' },
          { parameter: 'Índice de crocancia post-fritura', target: '>= 9.0 / 10', method: 'Panel sensorial interno' },
          { parameter: 'Ausencia de patógenos (Salmonella/Listeria)', target: 'Ausente en 25 g', method: 'Microbiología AOAC' }
        ],
        history: [
          { version: 'v2.4', date: '2026-11-10', author: 'Pedro Damián Caldera', change: 'Ajuste de barrera térmica en bolsa de polipropileno biorientado.' },
          { version: 'v2.3', date: '2026-09-22', author: 'Ing. Laura Méndez (Calidad)', change: 'Actualización de tabla nutricional por lote de queso mozzarella.' },
          { version: 'v2.2', date: '2026-07-14', author: 'Carlos Ríos (Producción)', change: 'Estandarización de peso neto unitario en 25 g ± 1 g.' }
        ]
      }
    ],

    formulations: [
      {
        id: 'FORM-01',
        code: 'REC-PQ-001',
        productId: 'PRD-01',
        productName: 'Palitos de Queso Clásicos',
        version: 'v3.2',
        batchSizeKg: 100,
        expectedYieldUnits: 3850,
        estimatedShrinkagePct: 3.75,
        estimatedBatchCost: 2980000,
        unitCost: 774,
        status: 'Aprobada',
        approvedBy: 'Pedro Damián Caldera',
        updatedAt: '2026-11-12',
        ingredients: [
          { rawMaterialId: 'MP-01', name: 'Queso Mozzarella Bloque Industrial', quantity: 52, unit: 'kg', percentage: 52, unitCost: 34000 },
          { rawMaterialId: 'MP-02', name: 'Harina de Trigo Especial Panadería', quantity: 28, unit: 'kg', percentage: 28, unitCost: 4800 },
          { rawMaterialId: 'MP-03', name: 'Miga de Pan Dorada Extruida', quantity: 10, unit: 'kg', percentage: 10, unitCost: 9500 },
          { rawMaterialId: 'MP-04', name: 'Mantequilla Industrial Sin Sal', quantity: 6, unit: 'kg', percentage: 6, unitCost: 26000 },
          { rawMaterialId: 'MP-05', name: 'Mezcla Sal Marina y Especias', quantity: 4, unit: 'kg', percentage: 4, unitCost: 8200 }
        ]
      },
      {
        id: 'FORM-02',
        code: 'REC-BQ-001',
        productId: 'PRD-02',
        productName: 'Bolitas de Queso',
        version: 'v2.1',
        batchSizeKg: 80,
        expectedYieldUnits: 6200,
        estimatedShrinkagePct: 3.1,
        estimatedBatchCost: 2350000,
        unitCost: 379,
        status: 'Aprobada',
        approvedBy: 'Pedro Damián Caldera',
        updatedAt: '2026-11-05',
        ingredients: [
          { rawMaterialId: 'MP-01', name: 'Queso Mozzarella Bloque Industrial', quantity: 44, unit: 'kg', percentage: 55, unitCost: 34000 },
          { rawMaterialId: 'MP-02', name: 'Harina de Trigo Especial Panadería', quantity: 24, unit: 'kg', percentage: 30, unitCost: 4800 },
          { rawMaterialId: 'MP-04', name: 'Mantequilla Industrial Sin Sal', quantity: 8, unit: 'kg', percentage: 10, unitCost: 26000 },
          { rawMaterialId: 'MP-05', name: 'Mezcla Sal Marina y Especias', quantity: 4, unit: 'kg', percentage: 5, unitCost: 8200 }
        ]
      },
      {
        id: 'FORM-03',
        code: 'REC-MS-001',
        productId: 'PRD-03',
        productName: 'Mozzarella Sticks',
        version: 'v1.8',
        batchSizeKg: 100,
        expectedYieldUnits: 3900,
        estimatedShrinkagePct: 2.5,
        estimatedBatchCost: 3320000,
        unitCost: 851,
        status: 'Aprobada',
        approvedBy: 'Ing. Laura Méndez',
        updatedAt: '2026-10-29',
        ingredients: [
          { rawMaterialId: 'MP-01', name: 'Queso Mozzarella Bloque Industrial', quantity: 60, unit: 'kg', percentage: 60, unitCost: 34000 },
          { rawMaterialId: 'MP-03', name: 'Miga de Pan Dorada Extruida', quantity: 22, unit: 'kg', percentage: 22, unitCost: 9500 },
          { rawMaterialId: 'MP-02', name: 'Harina de Trigo Especial Panadería', quantity: 14, unit: 'kg', percentage: 14, unitCost: 4800 },
          { rawMaterialId: 'MP-05', name: 'Hierbas Italianas y Sal Marina', quantity: 4, unit: 'kg', percentage: 4, unitCost: 12000 }
        ]
      }
    ],

    rawMaterials: [
      {
        id: 'MP-01',
        code: 'MP-QM-01',
        name: 'Queso Mozzarella Bloque Industrial',
        type: 'Materia Prima Láctea',
        unit: 'kg',
        supplierId: 'PROV-01',
        supplierName: 'Lácteos del Valle S.A.S.',
        stock: 185,
        minStock: 250,
        lotCode: 'LOT-QM-2611',
        expirationDate: '2026-12-08',
        unitCost: 34000,
        status: 'Stock Bajo'
      },
      {
        id: 'MP-02',
        code: 'MP-HT-02',
        name: 'Harina de Trigo Especial Panadería',
        type: 'Materia Prima Seca',
        unit: 'kg',
        supplierId: 'PROV-02',
        supplierName: 'Molinos Andinos de Colombia',
        stock: 940,
        minStock: 300,
        lotCode: 'LOT-HT-2610',
        expirationDate: '2027-04-15',
        unitCost: 4800,
        status: 'Activo'
      },
      {
        id: 'MP-03',
        code: 'MP-MP-03',
        name: 'Miga de Pan Dorada Extruida',
        type: 'Insumo de Cobertura',
        unit: 'kg',
        supplierId: 'PROV-02',
        supplierName: 'Molinos Andinos de Colombia',
        stock: 420,
        minStock: 150,
        lotCode: 'LOT-MP-2611',
        expirationDate: '2027-03-20',
        unitCost: 9500,
        status: 'Activo'
      },
      {
        id: 'MP-04',
        code: 'MP-MT-04',
        name: 'Mantequilla Industrial Pasteurizada',
        type: 'Materia Prima Láctea',
        unit: 'kg',
        supplierId: 'PROV-01',
        supplierName: 'Lácteos del Valle S.A.S.',
        stock: 210,
        minStock: 100,
        lotCode: 'LOT-MT-2611',
        expirationDate: '2026-12-28',
        unitCost: 26000,
        status: 'Activo'
      },
      {
        id: 'MP-05',
        code: 'INS-BP-05',
        name: 'Bolsa Polipropileno Biorientado Impresa',
        type: 'Insumo de Empaque',
        unit: 'und',
        supplierId: 'PROV-03',
        supplierName: 'Empaques Flexibles del Norte',
        stock: 18500,
        minStock: 5000,
        lotCode: 'LOT-EMP-2609',
        expirationDate: '2028-01-01',
        unitCost: 145,
        status: 'Activo'
      }
    ],

    productionOrders: [
      {
        id: 'OP-01',
        code: 'OP-2026-0873',
        lotCode: '#L-2026-0873',
        productId: 'PRD-01',
        productName: 'Palitos de Queso Clásicos',
        formulationCode: 'REC-PQ-001',
        plannedDate: '2026-11-15',
        shift: 'Turno Mañana (06:00 - 14:00)',
        line: 'Línea Automatizada 01',
        plannedUnits: 2900,
        producedUnits: 2850,
        shrinkageUnits: 50,
        yieldPct: 98.3,
        totalRealCost: 2215000,
        status: 'Completada',
        qualityStatus: 'Aprobado'
      },
      {
        id: 'OP-02',
        code: 'OP-2026-0874',
        lotCode: '#L-2026-0874',
        productId: 'PRD-02',
        productName: 'Bolitas de Queso',
        formulationCode: 'REC-BQ-001',
        plannedDate: '2026-11-15',
        shift: 'Turno Tarde (14:00 - 22:00)',
        line: 'Línea Formadora 02',
        plannedUnits: 3500,
        producedUnits: 2100,
        shrinkageUnits: 28,
        yieldPct: 98.7,
        totalRealCost: 1420000,
        status: 'En Proceso',
        qualityStatus: 'En Inspección'
      },
      {
        id: 'OP-03',
        code: 'OP-2026-0875',
        lotCode: '#L-2026-0875',
        productId: 'PRD-03',
        productName: 'Mozzarella Sticks',
        formulationCode: 'REC-MS-001',
        plannedDate: '2026-11-16',
        shift: 'Turno Mañana (06:00 - 14:00)',
        line: 'Línea Automatizada 01',
        plannedUnits: 4000,
        producedUnits: 0,
        shrinkageUnits: 0,
        yieldPct: 100.0,
        totalRealCost: 3320000,
        status: 'Programada',
        qualityStatus: 'Pendiente'
      }
    ],

    qualityInspections: [
      {
        id: 'QC-01',
        code: 'INSP-2026-412',
        stage: 'Producto Terminado',
        referenceCode: '#L-2026-0873',
        itemName: 'Palitos de Queso Clásicos',
        inspector: 'Ing. Laura Méndez',
        date: '2026-11-15 10:05 AM',
        temperature: '2.1 °C',
        humidity: '45.8%',
        sensoryScore: '9.6 / 10',
        nonConformities: 'Ninguna',
        correctiveAction: 'N/A — Liberación inmediata a cava de producto terminado',
        status: 'Aprobado'
      },
      {
        id: 'QC-02',
        code: 'INSP-2026-411',
        stage: 'Producto Terminado',
        referenceCode: '#L-2026-0872',
        itemName: 'Mozzarella Sticks',
        inspector: 'Ing. Laura Méndez',
        date: '2026-11-15 08:35 AM',
        temperature: '1.9 °C',
        humidity: '46.2%',
        sensoryScore: '9.5 / 10',
        nonConformities: 'Ninguna',
        correctiveAction: 'N/A — Lote liberado satisfactoriamente',
        status: 'Aprobado'
      },
      {
        id: 'QC-03',
        code: 'INSP-2026-410',
        stage: 'Materia Prima',
        referenceCode: 'LOT-QM-2611',
        itemName: 'Queso Mozzarella Bloque Industrial',
        inspector: 'Camilo Vargas',
        date: '2026-11-15 08:50 AM',
        temperature: '3.2 °C',
        humidity: '47.0%',
        sensoryScore: '9.4 / 10',
        nonConformities: 'Empaque secundario con leve condensación externa en 1 caja',
        correctiveAction: 'Reempaque secundario higienizado y paso prioritario a línea',
        status: 'Aprobado'
      }
    ],

    inventoryMovements: [
      {
        id: 'KDX-01',
        code: 'MOV-2026-901',
        date: '2026-11-15 10:12 AM',
        type: 'Entrada',
        category: 'Producto Terminado',
        itemName: 'Palitos de Queso Clásicos (PQ-001)',
        lotCode: '#L-2026-0873',
        quantity: 2850,
        unit: 'und',
        balanceAfter: 12500,
        reference: 'OP-2026-0873'
      },
      {
        id: 'KDX-02',
        code: 'MOV-2026-900',
        date: '2026-11-15 09:47 AM',
        type: 'Salida',
        category: 'Producto Terminado',
        itemName: 'Palitos de Queso Clásicos (PQ-001)',
        lotCode: '#L-2026-0871',
        quantity: 650,
        unit: 'und',
        balanceAfter: 9650,
        reference: 'Factura #F-2026-4521'
      },
      {
        id: 'KDX-03',
        code: 'MOV-2026-899',
        date: '2026-11-15 08:50 AM',
        type: 'Entrada',
        category: 'Materia Prima',
        itemName: 'Queso Mozzarella Bloque Industrial',
        lotCode: 'LOT-QM-2611',
        quantity: 120,
        unit: 'kg',
        balanceAfter: 185,
        reference: 'OC-2026-309'
      },
      {
        id: 'KDX-04',
        code: 'MOV-2026-898',
        date: '2026-11-15 07:30 AM',
        type: 'Reserva',
        category: 'Producto Terminado',
        itemName: 'Mozzarella Sticks (MS-001)',
        lotCode: '#L-2026-0872',
        quantity: 1200,
        unit: 'und',
        balanceAfter: 5750,
        reference: 'Pedido #PED-2026-1045'
      }
    ],

    suppliers: [
      {
        id: 'PROV-01',
        code: 'PRV-001',
        name: 'Lácteos del Valle S.A.S.',
        taxId: '900.412.889-1',
        contactName: 'Roberto Gómez',
        phone: '+57 310 455 8920',
        email: 'comercial@lacteosdelvalle.co',
        suppliedItems: 'Queso Mozzarella, Mantequilla Industrial, Crema de Leche',
        paymentTerms: '30 días',
        pendingBalance: 6850000,
        status: 'Activo'
      },
      {
        id: 'PROV-02',
        code: 'PRV-002',
        name: 'Molinos Andinos de Colombia',
        taxId: '890.102.544-7',
        contactName: 'Marcela Quintero',
        phone: '+57 315 882 1904',
        email: 'ventas@molinosandinos.com',
        suppliedItems: 'Harina de Trigo Fortificada, Miga de Pan Extruida',
        paymentTerms: '45 días',
        pendingBalance: 3420000,
        status: 'Activo'
      },
      {
        id: 'PROV-03',
        code: 'PRV-003',
        name: 'Empaques Flexibles del Norte',
        taxId: '901.209.331-4',
        contactName: 'Andrés Felipe Pardo',
        phone: '+57 320 671 3341',
        email: 'pedidos@empaquesdelnorte.co',
        suppliedItems: 'Bolsas Polipropileno, Cajas Corrugadas, Etiquetas Térmicas',
        paymentTerms: '30 días',
        pendingBalance: 1950000,
        status: 'Activo'
      }
    ],

    purchaseOrders: [
      {
        id: 'PO-01',
        code: 'OC-2026-310',
        supplierId: 'PROV-01',
        supplierName: 'Lácteos del Valle S.A.S.',
        rawMaterialId: 'MP-01',
        itemSummary: 'Queso Mozzarella Bloque Industrial (200 kg)',
        quantity: 200,
        unit: 'kg',
        date: '2026-11-15',
        expectedDate: '2026-11-17',
        totalAmount: 6800000,
        status: 'Aprobada',
        invoiceCode: 'FP-8821'
      },
      {
        id: 'PO-02',
        code: 'OC-2026-309',
        supplierId: 'PROV-01',
        supplierName: 'Lácteos del Valle S.A.S.',
        rawMaterialId: 'MP-01',
        itemSummary: 'Queso Mozzarella Bloque Industrial (120 kg)',
        quantity: 120,
        unit: 'kg',
        date: '2026-11-12',
        expectedDate: '2026-11-15',
        totalAmount: 4080000,
        status: 'Recibida',
        invoiceCode: 'FP-8790'
      },
      {
        id: 'PO-03',
        code: 'OC-2026-308',
        supplierId: 'PROV-02',
        supplierName: 'Molinos Andinos de Colombia',
        rawMaterialId: 'MP-02',
        itemSummary: 'Harina de Trigo (500 kg) + Miga de Pan (100 kg)',
        quantity: 600,
        unit: 'kg',
        date: '2026-11-10',
        expectedDate: '2026-11-16',
        totalAmount: 3420000,
        status: 'Parcialmente recibida',
        invoiceCode: 'FP-4412'
      }
    ],

    customers: [
      {
        id: 'CLI-01',
        code: 'CL-001',
        name: 'Supermercados La Canasta S.A.',
        taxId: '900.118.432-9',
        segment: 'Gran Superficie',
        contactName: 'Patricia Mendoza',
        phone: '+57 311 540 9921',
        email: 'compras@lacanasta.com.co',
        paymentTerms: '30 días',
        creditLimit: 25000000,
        currentBalance: 4850000,
        status: 'Activo'
      },
      {
        id: 'CLI-02',
        code: 'CL-002',
        name: 'Distribuidora Gourmet El Dorado',
        taxId: '901.554.210-3',
        segment: 'Distribuidor Mayorista',
        contactName: 'Jorge Enrique Soto',
        phone: '+57 318 229 4100',
        email: 'gerencia@gourmeteldorado.co',
        paymentTerms: '15 días',
        creditLimit: 15000000,
        currentBalance: 2950000,
        status: 'Activo'
      },
      {
        id: 'CLI-03',
        code: 'CL-003',
        name: 'Cadena Cafeterías Aroma & Café',
        taxId: '800.912.311-5',
        segment: 'Canal HORECA',
        contactName: 'Diana Carolina Vélez',
        phone: '+57 300 712 8854',
        email: 'abastecimiento@aromaycafe.co',
        paymentTerms: 'Contado',
        creditLimit: 8000000,
        currentBalance: 0,
        status: 'Activo'
      }
    ],

    orders: [
      {
        id: 'ORD-01',
        code: '#PED-2026-1045',
        customerId: 'CLI-01',
        customerName: 'Supermercados La Canasta S.A.',
        productId: 'PRD-01',
        productName: 'Palitos de Queso Clásicos',
        presentationName: 'Presentación Familiar 20 und.',
        quantity: 350,
        unitPrice: 9200,
        discountPct: 5,
        totalAmount: 3059000,
        date: '2026-11-15',
        deliveryDate: '2026-11-16',
        status: 'Pendiente de Despacho'
      },
      {
        id: 'ORD-02',
        code: '#PED-2026-1044',
        customerId: 'CLI-02',
        customerName: 'Distribuidora Gourmet El Dorado',
        productId: 'PRD-02',
        productName: 'Bolitas de Queso',
        presentationName: 'Presentación Familiar',
        quantity: 280,
        unitPrice: 8000,
        discountPct: 0,
        totalAmount: 2240000,
        date: '2026-11-15',
        deliveryDate: '2026-11-15',
        status: 'En Ruta'
      },
      {
        id: 'ORD-03',
        code: '#PED-2026-1043',
        customerId: 'CLI-03',
        customerName: 'Cadena Cafeterías Aroma & Café',
        productId: 'PRD-03',
        productName: 'Mozzarella Sticks',
        presentationName: 'Presentación Especial',
        quantity: 220,
        unitPrice: 7500,
        discountPct: 0,
        totalAmount: 1650000,
        date: '2026-11-14',
        deliveryDate: '2026-11-15',
        status: 'Entregado'
      }
    ],

    sales: [
      {
        id: 'SAL-01',
        invoiceCode: '#F-2026-4521',
        orderCode: '#PED-2026-1045',
        customerId: 'CLI-01',
        customerName: 'Supermercados La Canasta S.A.',
        paymentType: 'Crédito',
        itemsSummary: '350x Palitos de Queso Familiar 20 und.',
        subtotal: 3220000,
        discount: 161000,
        totalAmount: 3059000,
        date: '2026-11-15 09:47 AM',
        status: 'Facturada'
      },
      {
        id: 'SAL-02',
        invoiceCode: '#F-2026-4520',
        orderCode: '#PED-2026-1044',
        customerId: 'CLI-02',
        customerName: 'Distribuidora Gourmet El Dorado',
        paymentType: 'Crédito',
        itemsSummary: '280x Bolitas de Queso Familiar',
        subtotal: 2240000,
        discount: 0,
        totalAmount: 2240000,
        date: '2026-11-15 08:20 AM',
        status: 'Facturada'
      },
      {
        id: 'SAL-03',
        invoiceCode: '#F-2026-4519',
        orderCode: '#PED-2026-1043',
        customerId: 'CLI-03',
        customerName: 'Cadena Cafeterías Aroma & Café',
        paymentType: 'Contado',
        itemsSummary: '220x Mozzarella Sticks Especial',
        subtotal: 1650000,
        discount: 0,
        totalAmount: 1650000,
        date: '2026-11-14 04:15 PM',
        status: 'Pagada'
      }
    ],

    receivables: [
      {
        id: 'CXC-01',
        invoiceCode: '#F-2026-4521',
        customerId: 'CLI-01',
        customerName: 'Supermercados La Canasta S.A.',
        issueDate: '2026-11-15',
        dueDate: '2026-12-15',
        agingBucket: '0 - 30 días',
        originalAmount: 3059000,
        paidAmount: 0,
        balance: 3059000,
        status: 'Pendiente'
      },
      {
        id: 'CXC-02',
        invoiceCode: '#F-2026-4489',
        customerId: 'CLI-01',
        customerName: 'Supermercados La Canasta S.A.',
        issueDate: '2026-10-10',
        dueDate: '2026-11-10',
        agingBucket: '31 - 60 días',
        originalAmount: 2791000,
        paidAmount: 1000000,
        balance: 1791000,
        status: 'Parcialmente pagada'
      },
      {
        id: 'CXC-03',
        invoiceCode: '#F-2026-4520',
        customerId: 'CLI-02',
        customerName: 'Distribuidora Gourmet El Dorado',
        issueDate: '2026-11-15',
        dueDate: '2026-11-30',
        agingBucket: '0 - 30 días',
        originalAmount: 2950000,
        paidAmount: 0,
        balance: 2950000,
        status: 'Pendiente'
      }
    ],

    payables: [
      {
        id: 'CXP-01',
        invoiceCode: 'FP-8821',
        purchaseOrderCode: 'OC-2026-310',
        supplierId: 'PROV-01',
        supplierName: 'Lácteos del Valle S.A.S.',
        issueDate: '2026-11-15',
        dueDate: '2026-12-15',
        agingBucket: '0 - 30 días',
        originalAmount: 6850000,
        paidAmount: 0,
        balance: 6850000,
        status: 'Pendiente'
      },
      {
        id: 'CXP-02',
        invoiceCode: 'FP-4412',
        purchaseOrderCode: 'OC-2026-308',
        supplierId: 'PROV-02',
        supplierName: 'Molinos Andinos de Colombia',
        issueDate: '2026-11-10',
        dueDate: '2026-12-25',
        agingBucket: '0 - 30 días',
        originalAmount: 3420000,
        paidAmount: 0,
        balance: 3420000,
        status: 'Programada'
      },
      {
        id: 'CXP-03',
        invoiceCode: 'FP-1920',
        purchaseOrderCode: 'OC-2026-301',
        supplierId: 'PROV-03',
        supplierName: 'Empaques Flexibles del Norte',
        issueDate: '2026-10-12',
        dueDate: '2026-11-12',
        agingBucket: '31 - 60 días',
        originalAmount: 2950000,
        paidAmount: 1000000,
        balance: 1950000,
        status: 'Vencida'
      }
    ],

    treasury: {
      accounts: [
        { id: 'ACC-01', name: 'Cuenta Corriente Bancolombia #4812', type: 'Banco', balance: 48650000, currency: 'COP' },
        { id: 'ACC-02', name: 'Cuenta Empresarial Davivienda #9904', type: 'Banco', balance: 19420000, currency: 'COP' },
        { id: 'ACC-03', name: 'Caja General Planta Principal', type: 'Caja', balance: 3850000, currency: 'COP' }
      ],
      movements: [
        {
          id: 'TES-01',
          code: 'RC-2026-710',
          date: '2026-11-15 09:50 AM',
          type: 'Ingreso',
          category: 'Recaudo Cartera Cliente',
          accountName: 'Cuenta Corriente Bancolombia #4812',
          paymentMethod: 'Transferencia PSE / ACH',
          reference: '#F-2026-4489',
          amount: 1000000,
          status: 'Conciliado'
        },
        {
          id: 'TES-02',
          code: 'CE-2026-519',
          date: '2026-11-14 05:10 PM',
          type: 'Egreso',
          category: 'Pago a Proveedor',
          accountName: 'Cuenta Empresarial Davivienda #9904',
          paymentMethod: 'Transferencia Bancaria',
          reference: 'FP-1920',
          amount: 1000000,
          status: 'Conciliado'
        },
        {
          id: 'TES-03',
          code: 'RC-2026-709',
          date: '2026-11-14 04:15 PM',
          type: 'Ingreso',
          category: 'Venta de Contado',
          accountName: 'Cuenta Corriente Bancolombia #4812',
          paymentMethod: 'Transferencia Bancaria',
          reference: '#F-2026-4519',
          amount: 1650000,
          status: 'Conciliado'
        }
      ]
    },

    dispatches: [
      {
        id: 'DSP-01',
        code: 'DESP-2026-205',
        orderCode: '#PED-2026-1045',
        customerName: 'Supermercados La Canasta S.A.',
        route: 'Ruta Norte — Zona Comercial',
        carrier: 'Logística FríoExpress (Furgón Termoking NKR-812)',
        driver: 'Hernán Darío Castaño',
        temperature: '2.0 °C',
        departureTime: '2026-11-15 11:00 AM',
        status: 'Pendiente de Despacho',
        evidence: 'En alistamiento de cava'
      },
      {
        id: 'DSP-02',
        code: 'DESP-2026-204',
        orderCode: '#PED-2026-1044',
        customerName: 'Distribuidora Gourmet El Dorado',
        route: 'Ruta Occidente — Mayoristas',
        carrier: 'Flota Propia QuesoPlus (Furgón Refrigerado QPL-104)',
        driver: 'Wilmar Andrés Rojas',
        temperature: '1.8 °C',
        departureTime: '2026-11-15 09:30 AM',
        status: 'En Ruta',
        evidence: 'GPS Activo — 75% de recorrido'
      },
      {
        id: 'DSP-03',
        code: 'DESP-2026-203',
        orderCode: '#PED-2026-1043',
        customerName: 'Cadena Cafeterías Aroma & Café',
        route: 'Ruta Centro — HORECA',
        carrier: 'Flota Propia QuesoPlus (Furgón Refrigerado QPL-102)',
        driver: 'Mauricio Salazar',
        temperature: '2.1 °C',
        departureTime: '2026-11-14 02:00 PM',
        status: 'Entregado',
        evidence: 'Guía firmada #GRE-9941'
      }
    ],

    settings: {
      company: {
        legalName: 'QuesoPlus Alimentos Industriales S.A.S.',
        taxId: '901.845.220-8',
        plantAddress: 'Parque Industrial San Diego, Bodega 14 — Colombia',
        phone: '+57 (601) 745 8890',
        email: 'contacto@quesoplus.co',
        currency: 'COP ($)',
        coldChainStandard: '0 °C a 4 °C (Refrigeración controlada)'
      },
      users: [
        { id: 'USR-001', name: 'Pedro Damián Caldera', email: 'pedro.caldera@quesoplus.co', role: 'Administrador', area: 'Dirección General', status: 'Activo' },
        { id: 'USR-002', name: 'Ing. Laura Méndez', email: 'laura.mendez@quesoplus.co', role: 'Jefe de Calidad', area: 'Calidad e Inocuidad', status: 'Activo' },
        { id: 'USR-003', name: 'Carlos Ríos', email: 'carlos.rios@quesoplus.co', role: 'Jefe de Planta', area: 'Producción', status: 'Activo' },
        { id: 'USR-004', name: 'Diana Marcela Ortiz', email: 'diana.ortiz@quesoplus.co', role: 'Coordinadora Comercial', area: 'Ventas y Cartera', status: 'Activo' }
      ],
      auditLogs: [
        { id: 'AUD-01', timestamp: '2026-11-15 10:12 AM', user: 'Carlos Ríos', module: 'Producción', action: 'Cierre de orden OP-2026-0873 (+2.850 und.)' },
        { id: 'AUD-02', timestamp: '2026-11-15 09:47 AM', user: 'Diana Marcela Ortiz', module: 'Ventas', action: 'Emisión de factura a crédito #F-2026-4521' },
        { id: 'AUD-03', timestamp: '2026-11-15 08:35 AM', user: 'Ing. Laura Méndez', module: 'Calidad', action: 'Aprobación de lote #L-2026-0872' }
      ]
    }
  }
}
