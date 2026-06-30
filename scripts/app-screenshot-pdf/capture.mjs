import { chromium } from 'playwright'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT_DIR = path.join(__dirname, 'output', 'screenshots')
const MANIFEST_PATH = path.join(__dirname, 'output', 'manifest.json')

const BASE_URL = process.env.APP_URL ?? 'http://localhost:5173'
const API_URL = process.env.API_URL ?? 'http://localhost:8000/api/v1'
const PASSWORD = 'password'
const VIEWPORT = { width: 1920, height: 1080 }

const ROLES = [
  { key: 'owner', email: 'owner@luxebeauty.ae' },
  { key: 'admin', email: 'admin@luxebeauty.ae' },
  { key: 'receptionist', email: 'reception@luxebeauty.ae' },
  { key: 'staff', email: 'staff@luxebeauty.ae' },
]

/** Static ERP routes and required view permission */
const STATIC_ROUTES = [
  { slug: 'dashboard', path: '/dashboard', permission: 'dashboard.view' },
  { slug: 'users', path: '/users', permission: 'users.view' },
  { slug: 'roles', path: '/roles', permission: 'roles.view' },
  { slug: 'permissions', path: '/permissions', permission: 'roles.view' },
  { slug: 'activity-logs', path: '/activity-logs', permission: 'activity-logs.view' },
  { slug: 'pos', path: '/pos', permission: 'sales.view' },
  { slug: 'appointments', path: '/appointments', permission: 'appointments.view' },
  { slug: 'packages', path: '/packages', permission: 'service-packages.view' },
  { slug: 'customers', path: '/customers', permission: 'customers.view' },
  { slug: 'customers-directory', path: '/customers/directory', permission: 'customers.view' },
  { slug: 'services', path: '/services', permission: 'services.view' },
  { slug: 'staff', path: '/staff', permission: 'staff.view' },
  { slug: 'staff-directory', path: '/staff/directory', permission: 'staff.view' },
  { slug: 'payroll', path: '/payroll', permission: 'payroll.view' },
  { slug: 'inventory', path: '/inventory', permission: 'inventory.view' },
  { slug: 'expenses', path: '/expenses', permission: 'expenses.view' },
  { slug: 'reports', path: '/reports', permission: 'reports.view' },
  { slug: 'settings', path: '/settings', permission: 'settings.view' },
  { slug: 'website-inquiries', path: '/website/inquiries', permission: 'website-inquiries.view' },
  { slug: 'website-homepage-slides', path: '/website/homepage-slides', permission: 'homepage-slides.view' },
  { slug: 'website-testimonials', path: '/website/testimonials', permission: 'testimonials.view' },
  { slug: 'website-gallery', path: '/website/gallery', permission: 'gallery-items.view' },
  { slug: 'website-journal', path: '/website/journal', permission: 'blog-posts.view' },
  { slug: 'website-faqs', path: '/website/faqs', permission: 'faqs.view' },
  { slug: 'masters-company', path: '/masters/company', permission: 'company.view' },
  { slug: 'masters-branches', path: '/masters/branches', permission: 'branches.view' },
  { slug: 'masters-departments', path: '/masters/departments', permission: 'departments.view' },
  { slug: 'masters-staff-designations', path: '/masters/staff-designations', permission: 'staff-designations.view' },
  { slug: 'masters-countries', path: '/masters/countries', permission: 'countries.view' },
  { slug: 'masters-emirates', path: '/masters/emirates', permission: 'emirates.view' },
  { slug: 'masters-cities', path: '/masters/cities', permission: 'cities.view' },
  { slug: 'masters-expense-categories', path: '/masters/expense-categories', permission: 'expense-categories.view' },
  { slug: 'masters-payment-methods', path: '/masters/payment-methods', permission: 'payment-methods.view' },
  { slug: 'masters-service-categories', path: '/masters/service-categories', permission: 'service-categories.view' },
  { slug: 'masters-product-categories', path: '/masters/product-categories', permission: 'product-categories.view' },
  { slug: 'masters-brands', path: '/masters/brands', permission: 'brands.view' },
  { slug: 'masters-suppliers', path: '/masters/suppliers', permission: 'suppliers.view' },
]

function hasPermission(permissions, required) {
  if (!required) return true
  return permissions.includes(required)
}

async function apiGet(token, endpoint) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  })
  if (!res.ok) return null
  const json = await res.json()
  return json.data
}

async function login(page, email) {
  await page.goto(`${BASE_URL}/login`, { waitUntil: 'domcontentloaded' })
  await page.evaluate(() => {
    localStorage.clear()
    sessionStorage.clear()
  })
  await page.reload({ waitUntil: 'domcontentloaded' })
  await page.fill('input[name="email"]', email)
  await page.fill('input[name="password"]', PASSWORD)
  await page.click('button[type="submit"]')
  await page.waitForURL('**/dashboard', { timeout: 45000 })
  await waitForAppReady(page)
}

async function waitForAppReady(page) {
  await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {})
  await page.waitForTimeout(1200)
  const loader = page.locator('[class*="PageLoader"], [data-testid="page-loader"]')
  if (await loader.count()) {
    await loader.first().waitFor({ state: 'hidden', timeout: 30000 }).catch(() => {})
  }
  await page.waitForTimeout(400)
}

async function getToken(page) {
  return page.evaluate(() => localStorage.getItem('beauty_salon_auth_token'))
}

function buildRoutes(permissions, tokenData) {
  const routes = STATIC_ROUTES.filter((route) => hasPermission(permissions, route.permission))
  return routes
}

async function appendDynamicRoutes(routes, token) {
  if (hasPermissionInRoutes(routes, 'customers.view')) {
    const customers = await apiGet(token, '/customers?per_page=1')
    const first = customers?.data?.[0] ?? customers?.[0]
    if (first?.id) {
      routes.push({
        slug: 'customer-profile',
        path: `/customers/${first.id}`,
        permission: 'customers.view',
      })
    }
  }

  if (hasPermissionInRoutes(routes, 'staff.view')) {
    const staff = await apiGet(token, '/staff?per_page=1')
    const first = staff?.data?.[0] ?? staff?.[0]
    if (first?.id) {
      routes.push({
        slug: 'staff-profile',
        path: `/staff/${first.id}`,
        permission: 'staff.view',
      })
    }
  }

  return routes
}

function hasPermissionInRoutes(routes, permission) {
  return routes.some((r) => r.permission === permission)
}

async function captureRoute(page, route, outFile) {
  await page.goto(`${BASE_URL}${route.path}`, { waitUntil: 'domcontentloaded' })
  await waitForAppReady(page)

  const currentPath = new URL(page.url()).pathname
  if (route.path !== currentPath && !currentPath.startsWith(route.path)) {
    // Redirected away — skip inaccessible route
    if (currentPath === '/dashboard' && route.path !== '/dashboard') {
      return false
    }
  }

  await page.screenshot({
    path: outFile,
    fullPage: false,
    type: 'png',
  })
  return true
}

async function main() {
  fs.rmSync(OUT_DIR, { recursive: true, force: true })
  fs.mkdirSync(OUT_DIR, { recursive: true })

  const manifest = []
  const browser = await chromium.launch({ headless: true })

  for (const role of ROLES) {
    const context = await browser.newContext({
      viewport: VIEWPORT,
      deviceScaleFactor: 1,
      colorScheme: 'light',
    })
    const page = await context.newPage()

    console.log(`\n=== ${role.key.toUpperCase()} ===`)
    await login(page, role.email)

    const token = await getToken(page)
    const me = await apiGet(token, '/auth/me')
    const permissions = me?.permissions ?? []

    let routes = buildRoutes(permissions, me)
    routes = await appendDynamicRoutes(routes, token)

    for (const route of routes) {
      const filename = `${role.key}__${route.slug}.png`
      const outFile = path.join(OUT_DIR, filename)
      process.stdout.write(`  ${route.path} ... `)

      try {
        const ok = await captureRoute(page, route, outFile)
        if (ok) {
          manifest.push({ role: role.key, slug: route.slug, path: route.path, file: filename })
          console.log('ok')
        } else {
          fs.rmSync(outFile, { force: true })
          console.log('skipped (redirect)')
        }
      } catch (err) {
        console.log(`failed (${err.message})`)
      }
    }

    await context.close()
  }

  await browser.close()

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2))
  console.log(`\nCaptured ${manifest.length} screenshots`)
  console.log(`Manifest: ${MANIFEST_PATH}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
