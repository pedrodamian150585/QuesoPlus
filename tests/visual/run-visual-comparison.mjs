import fs from 'fs'
import path from 'path'
import { spawn } from 'child_process'
import { chromium } from '@playwright/test'
import pixelmatch from 'pixelmatch'
import { PNG } from 'pngjs'

const ROOT_DIR = process.cwd()
const REF_DIR = path.join(ROOT_DIR, 'tests/visual/references')
const ACTUAL_DIR = path.join(ROOT_DIR, 'tests/visual/actual')
const DIFF_DIR = path.join(ROOT_DIR, 'tests/visual/diff')
const OVERLAY_DIR = path.join(ROOT_DIR, 'tests/visual/overlay')
const REPORTS_DIR = path.join(ROOT_DIR, 'tests/visual/reports')

const CHROME_PATH = '/home/pedro/.cache/ms-playwright/chromium_headless_shell-1255/chrome-headless-shell-linux64/chrome-headless-shell'

const MODULES = [
  { id: 'dashboard', name: '7.1 Dashboard Principal', route: '/dashboard', refFile: 'dashboard.png' },
  { id: 'products', name: '7.2 Catálogo de Productos', route: '/productos', refFile: 'products.png' },
  { id: 'categories', name: '7.3 Categorías de Productos', route: '/productos/categorias', refFile: 'categories.png' },
  { id: 'presentations', name: '7.4 Presentaciones Comerciales', route: '/productos/presentaciones', refFile: 'presentations.png' },
  { id: 'technical-sheets', name: '7.5 Fichas Técnicas', route: '/productos/fichas-tecnicas', refFile: 'technical-sheets.png' }
]

async function waitForServer(url, timeoutMs = 20000) {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url)
      if (res.ok) return true
    } catch {
      // retry
    }
    await new Promise((r) => setTimeout(r, 300))
  }
  throw new Error(`Servidor no disponible en ${url}`)
}

function createOverlayImage(refPng, actualPng) {
  const out = new PNG({ width: refPng.width, height: refPng.height })
  for (let i = 0; i < refPng.data.length; i += 4) {
    out.data[i] = Math.round(refPng.data[i] * 0.5 + actualPng.data[i] * 0.5)
    out.data[i + 1] = Math.round(refPng.data[i + 1] * 0.5 + actualPng.data[i + 1] * 0.5)
    out.data[i + 2] = Math.round(refPng.data[i + 2] * 0.5 + actualPng.data[i + 2] * 0.5)
    out.data[i + 3] = 255
  }
  return out
}

async function run() {
  for (const dir of [REF_DIR, ACTUAL_DIR, DIFF_DIR, OVERLAY_DIR, REPORTS_DIR]) {
    fs.mkdirSync(dir, { recursive: true })
  }

  const serverProc = spawn('npx', ['vite', '--host', '127.0.0.1', '--port', '5173'], {
    cwd: ROOT_DIR,
    stdio: 'ignore'
  })

  try {
    await waitForServer('http://127.0.0.1:5173')

    const browser = await chromium.launch({
      executablePath: fs.existsSync(CHROME_PATH) ? CHROME_PATH : undefined,
      headless: true
    })

    // 1. Comparación en resolución nativa exacta (1672 x 941)
    const context = await browser.newContext({
      viewport: { width: 1672, height: 941 },
      deviceScaleFactor: 1
    })
    const page = await context.newPage()

    const results = []

    for (const mod of MODULES) {
      await page.goto(`http://127.0.0.1:5173${mod.route}`, { waitUntil: 'networkidle' })
      await page.evaluate(() => document.fonts.ready)
      await page.waitForTimeout(150)

      const actualPath = path.join(ACTUAL_DIR, `${mod.id}.png`)
      await page.screenshot({ path: actualPath, fullPage: false })

      const refPath = path.join(REF_DIR, mod.refFile)
      const refPng = PNG.sync.read(fs.readFileSync(refPath))
      const actualPng = PNG.sync.read(fs.readFileSync(actualPath))

      const { width, height } = refPng
      const diffPng = new PNG({ width, height })

      const diffPixels = pixelmatch(refPng.data, actualPng.data, diffPng.data, width, height, {
        threshold: 0.1
      })

      const diffPath = path.join(DIFF_DIR, `${mod.id}-diff.png`)
      fs.writeFileSync(diffPath, PNG.sync.write(diffPng))

      const overlayPng = createOverlayImage(refPng, actualPng)
      const overlayPath = path.join(OVERLAY_DIR, `${mod.id}-overlay.png`)
      fs.writeFileSync(overlayPath, PNG.sync.write(overlayPng))

      const totalPixels = width * height
      const similarityPct = Number((((totalPixels - diffPixels) / totalPixels) * 100).toFixed(4))

      results.push({
        id: mod.id,
        name: mod.name,
        route: mod.route,
        resolution: `${width}x${height}`,
        totalPixels,
        diffPixels,
        matchedPixels: totalPixels - diffPixels,
        similarityPct,
        referenceFile: `tests/visual/references/${mod.refFile}`,
        actualFile: `tests/visual/actual/${mod.id}.png`,
        diffFile: `tests/visual/diff/${mod.id}-diff.png`,
        overlayFile: `tests/visual/overlay/${mod.id}-overlay.png`
      })
    }

    // 2. Capturas en resolución adicional de escritorio solicitada (1648 x 930)
    const context1648 = await browser.newContext({
      viewport: { width: 1648, height: 930 },
      deviceScaleFactor: 1
    })
    const page1648 = await context1648.newPage()
    for (const mod of MODULES) {
      await page1648.goto(`http://127.0.0.1:5173${mod.route}`, { waitUntil: 'networkidle' })
      await page1648.waitForTimeout(100)
      await page1648.screenshot({
        path: path.join(ACTUAL_DIR, `${mod.id}-1648x930.png`),
        fullPage: false
      })
    }

    await browser.close()

    const reportJson = {
      generatedAt: new Date().toISOString(),
      nativeResolution: '1672x941',
      secondaryDesktopResolution: '1648x930',
      threshold: 0.1,
      averageSimilarityPct: Number(
        (results.reduce((acc, r) => acc + r.similarityPct, 0) / results.length).toFixed(4)
      ),
      modules: results
    }

    fs.writeFileSync(
      path.join(REPORTS_DIR, 'visual-comparison-report.json'),
      JSON.stringify(reportJson, null, 2)
    )

    const mdLines = [
      '# Reporte de Regresión Visual Pixel-a-Pixel — QuesoPlus',
      '',
      `- **Fecha de ejecución:** ${reportJson.generatedAt}`,
      `- **Resolución nativa evaluada:** \`1672 × 941\` (proporción original intacta)`,
      `- **Resolución secundaria capturada:** \`1648 × 930\``,
      `- **Umbral Pixelmatch (\`threshold\`):** \`0.1\``,
      `- **Similitud promedio global:** **${reportJson.averageSimilarityPct}%**`,
      '',
      '| Módulo | Ruta | Resolución | Píxeles Totales | Píxeles Diferentes | Similitud Verificada | Evidencia Diff |',
      '|---|---|---|---|---|---|---|',
      ...results.map(
        (r) =>
          `| **${r.name}** | \`${r.route}\` | \`${r.resolution}\` | ${r.totalPixels.toLocaleString('es-CO')} | ${r.diffPixels.toLocaleString('es-CO')} | **${r.similarityPct}%** | \`${r.diffFile}\` |`
      )
    ]

    fs.writeFileSync(path.join(REPORTS_DIR, 'visual-comparison-report.md'), mdLines.join('\n') + '\n')

    console.log(JSON.stringify(reportJson, null, 2))
  } finally {
    serverProc.kill('SIGTERM')
  }
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
