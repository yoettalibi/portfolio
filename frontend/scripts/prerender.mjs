// Prerender step: after `vite build`, boot the built dist/ with `vite preview`,
// visit every public route with a real headless browser, and save the fully
// rendered HTML back into dist/<route>/index.html. This gives crawlers real
// content instead of the empty CSR shell, while the SPA still hydrates and
// takes over client-side navigation as normal for real users.
import { spawn } from 'child_process'
import { fileURLToPath } from 'url'
import puppeteer from 'puppeteer'
import fs from 'fs'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT_DIR = path.resolve(__dirname, '..')
const DIST_DIR = path.join(ROOT_DIR, 'dist')
const PORT = 4173
const BASE_URL = `http://localhost:${PORT}`

// Static public routes (skip /login, /dashboard/* — private, no need to index)
const STATIC_ROUTES = ['/', '/about', '/contact', '/privacy', '/terms', '/cookies']

// Pull work project slugs straight from the data file so this list can't drift
// out of sync with the app's actual routes.
function getWorkRoutes() {
  const dataFile = path.join(ROOT_DIR, 'src/data/workProjects.ts')
  const src = fs.readFileSync(dataFile, 'utf-8')
  const match = src.match(/workProjectSlugs[^=]*=\s*\[([^\]]*)\]/)
  if (!match) return []
  return match[1]
    .split(',')
    .map((s) => s.trim().replace(/^['"]|['"]$/g, ''))
    .filter(Boolean)
    .map((slug) => `/work/${slug}`)
}

const ROUTES = [...STATIC_ROUTES, ...getWorkRoutes()]

function waitForServer(url, timeoutMs = 15000) {
  const start = Date.now()
  return new Promise((resolve, reject) => {
    const tick = async () => {
      try {
        const res = await fetch(url)
        if (res.ok || res.status < 500) return resolve()
      } catch {
        // server not up yet
      }
      if (Date.now() - start > timeoutMs) {
        return reject(new Error(`Timed out waiting for ${url}`))
      }
      setTimeout(tick, 300)
    }
    tick()
  })
}

async function run() {
  if (!fs.existsSync(DIST_DIR)) {
    throw new Error(`dist/ not found at ${DIST_DIR} — run "vite build" first.`)
  }

  console.log(`Starting vite preview on port ${PORT}...`)
  const preview = spawn(
    'npx',
    ['vite', 'preview', '--port', String(PORT), '--strictPort'],
    { cwd: ROOT_DIR, stdio: ['ignore', 'pipe', 'pipe'] },
  )

  let previewLog = ''
  preview.stdout.on('data', (d) => { previewLog += d.toString() })
  preview.stderr.on('data', (d) => { previewLog += d.toString() })

  const cleanup = () => preview.kill()
  process.on('exit', cleanup)

  try {
    await waitForServer(BASE_URL)

    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()

    for (const route of ROUTES) {
      const url = `${BASE_URL}${route}`
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 })

      // Wait for the app to actually render content into #root (past the
      // initial `/settings` fetch + loading gate in App.tsx's Root component).
      try {
        await page.waitForFunction(
          () => {
            const root = document.getElementById('root')
            return !!root && root.textContent && root.textContent.trim().length > 20
          },
          { timeout: 10000 },
        )
      } catch {
        console.warn(`  ! ${route} — content wait timed out, saving current state`)
      }

      const html = await page.content()

      const outDir = route === '/' ? DIST_DIR : path.join(DIST_DIR, route)
      fs.mkdirSync(outDir, { recursive: true })
      fs.writeFileSync(path.join(outDir, 'index.html'), html)
      console.log(`Prerendered ${route} -> ${path.relative(ROOT_DIR, path.join(outDir, 'index.html'))}`)
    }

    await browser.close()
  } catch (err) {
    console.error(previewLog)
    throw err
  } finally {
    cleanup()
  }
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
