import { TrendingUp, Coins } from 'lucide-react'

export const typeMeta = {
  stock: { label: 'Stocks', icon: TrendingUp, color: 'var(--color-chart-2)' },
  gold: { label: 'Gold', icon: Coins, color: 'var(--color-chart-3)' },
}

export const INVESTMENT_TYPES = Object.entries(typeMeta).map(([value, meta]) => ({
  value,
  label: meta.label,
}))

export const GOLD_SOURCES = [
  { value: 'anekalogam', label: 'Aneka Logam' },
  { value: 'hargaemas-org', label: 'Hargaemas.org' },
  { value: 'lakuemas', label: 'Lakuemas' },
  { value: 'sakumas', label: 'Sakuemas' },
  { value: 'kursdolar', label: 'Kurs Dolar' },
  { value: 'cermati', label: 'Cermati' },
  { value: 'indogold', label: 'IndoGold' },
  { value: 'hargaemas-net', label: 'Hargaemas.net' },
  { value: 'hargaemas-com', label: 'Hargaemas.com' },
  { value: 'treasury', label: 'Treasury' },
  { value: 'logammulia', label: 'Logam Mulia' },
  { value: 'emasku', label: 'Emasku' },
  { value: 'hartadinataabadi', label: 'Hartadinata Abadi' },
  { value: 'galeri24', label: 'Galeri 24' },
  { value: 'sampoernagold', label: 'Sampoerna Gold' },
  { value: 'bankbsi', label: 'Bank BSI' },
  { value: 'brankaslm', label: 'Brankas LM' },
  { value: 'pegadaian', label: 'Pegadaian' },
]

export const GOLD_SOURCE_LABEL = Object.fromEntries(GOLD_SOURCES.map((s) => [s.value, s.label]))

export const formatRp = (n) => `Rp${Number(n || 0).toLocaleString('id-ID')}`

export const formatRpSigned = (n) => {
  const value = Number(n || 0)
  return `${value < 0 ? '-' : '+'}${formatRp(Math.abs(value))}`
}

export const formatUnits = (n) =>
  Number(n || 0).toLocaleString('id-ID', { maximumFractionDigits: 4 })

export const lotsOf = (units, type) => {
  if (type !== 'stock' || !(Number(units) > 0)) return null
  return Number(units) / 100
}

export const formatPrice = (n) => formatRp(n)

export const formatDate = (value) => {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

// --- Per-purchase helpers ---
// price: live quote (close) for the ticker, falls back to buy price.
export const investedOf = (i) => (i.units || 0) * (i.buy_price || 0)

export function priceOf(i, price) {
  const p = Number(price && price.price ? price.price : i.buy_price || 0)
  return p
}

export const valueOf = (i, price) => (i.units || 0) * priceOf(i, price)

export const gainOf = (i, price) => valueOf(i, price) - investedOf(i)

export const gainPctOf = (i, price) =>
  investedOf(i) > 0 ? (gainOf(i, price) / investedOf(i)) * 100 : 0

export const signPct = (value) =>
  `${value >= 0 ? '+' : ''}${Number(value || 0).toLocaleString('id-ID', { maximumFractionDigits: 1 })}%`

// --- Grouping by asset (type + name + ticker + app) ---
const groupKeyOf = (i) =>
  [i.type, i.name, i.ticker, i.app].map((v) => String(v || '').toLowerCase()).join('|')

export function groupInvestments(items) {
  const groups = []
  const map = new Map()
  items.forEach((i) => {
    const key = groupKeyOf(i)
    if (!map.has(key)) {
      const g = {
        key,
        id: key,
        type: i.type,
        name: i.name,
        ticker: i.ticker,
        app: i.app,
        purchases: [],
      }
      map.set(key, g)
      groups.push(g)
    }
    map.get(key).purchases.push(i)
  })
  groups.forEach((g) => {
    g.units = g.purchases.reduce((s, p) => s + (p.units || 0), 0)
    g.invested = g.purchases.reduce((s, p) => s + investedOf(p), 0)
  })
  return groups
}

export const avgBuyPrice = (g) => (g.units > 0 ? g.invested / g.units : 0)

export const groupValue = (g, price) => g.units * priceOf(g, price)

export const groupGain = (g, price) => groupValue(g, price) - g.invested

export const groupGainPct = (g, price) => (g.invested > 0 ? ((groupValue(g, price) - g.invested) / g.invested) * 100 : 0)