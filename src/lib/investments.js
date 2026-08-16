import { TrendingUp, Briefcase, Landmark, Coins, Bitcoin, Globe } from 'lucide-react'

export const STORAGE_KEY = 'cashvio_investments'

export const typeMeta = {
  stock: { label: 'Stocks', icon: TrendingUp, color: 'var(--color-chart-1)' },
  mutual_fund: { label: 'Mutual Funds', icon: Briefcase, color: 'var(--color-chart-2)' },
  bond: { label: 'Bonds', icon: Landmark, color: 'var(--color-chart-3)' },
  gold: { label: 'Gold', icon: Coins, color: 'var(--color-chart-4)' },
  crypto: { label: 'Crypto', icon: Bitcoin, color: 'var(--color-chart-5)' },
  forex: { label: 'Forex', icon: Globe, color: '#0ea5e9' },
}

export const INVESTMENT_TYPES = Object.entries(typeMeta).map(([value, meta]) => ({
  value,
  label: meta.label,
}))

const seedInvestments = [
  { id: 'seed-1', type: 'stock', name: 'Bank Central Asia', ticker: 'BBCA', app: 'GoTrade', current_price: 10250, lots: [
    { id: 'lot-1a', units: 80, buy_price: 9400, buy_date: '2026-01-10' },
    { id: 'lot-1b', units: 40, buy_price: 10200, buy_date: '2026-04-15' },
  ] },
  { id: 'seed-2', type: 'stock', name: 'Bank Rakyat Indonesia', ticker: 'BBRI', app: 'GoTrade', current_price: 4850, lots: [
    { id: 'lot-2a', units: 300, buy_price: 4400, buy_date: '2026-02-14' },
    { id: 'lot-2b', units: 200, buy_price: 5050, buy_date: '2026-06-20' },
  ] },
  { id: 'seed-3', type: 'stock', name: 'Telkom Indonesia', ticker: 'TLKM', app: 'Ajaib', current_price: 2780, lots: [
    { id: 'lot-3a', units: 300, buy_price: 2900, buy_date: '2026-03-02' },
  ] },
  { id: 'seed-4', type: 'stock', name: 'Aneka Tambang', ticker: 'ANTM', app: 'Ajaib', current_price: 1540, lots: [
    { id: 'lot-4a', units: 1000, buy_price: 1600, buy_date: '2026-04-20' },
  ] },
  { id: 'seed-5', type: 'crypto', name: 'Bitcoin', ticker: 'BTC', app: 'Indodax', current_price: 1100000000, lots: [
    { id: 'lot-5a', units: 0.01, buy_price: 880000000, buy_date: '2025-11-05' },
    { id: 'lot-5b', units: 0.01, buy_price: 1020000000, buy_date: '2026-02-01' },
  ] },
  { id: 'seed-6', type: 'crypto', name: 'Ethereum', ticker: 'ETH', app: 'Indodax', current_price: 49500000, lots: [
    { id: 'lot-6a', units: 0.35, buy_price: 42000000, buy_date: '2025-12-12' },
  ] },
  { id: 'seed-7', type: 'mutual_fund', name: 'Reksa Dana Syariah', ticker: 'RDSY', app: 'Bibit', current_price: 1180, lots: [
    { id: 'lot-7a', units: 10000, buy_price: 1050, buy_date: '2026-01-25' },
    { id: 'lot-7b', units: 5000, buy_price: 1150, buy_date: '2026-05-03' },
  ] },
  { id: 'seed-8', type: 'gold', name: 'Antam Gold', ticker: 'ANTAM', app: 'Treasury', current_price: 1450000, lots: [
    { id: 'lot-8a', units: 10, buy_price: 1200000, buy_date: '2026-05-08' },
  ] },
  { id: 'seed-9', type: 'bond', name: 'Obligasi Ritel Indonesia', ticker: 'ORI024', app: 'Treasury', current_price: 1020000, lots: [
    { id: 'lot-9a', units: 5, buy_price: 1000000, buy_date: '2026-06-15' },
  ] },
]

// Normalize legacy records (flat units/buy_price) into lot-based assets.
export const normalizeInvestment = (raw) => {
  if (!raw) return null
  const base = {
    app: raw.app || '',
    account_type: raw.account_type || null,
    account_id: raw.account_id || null,
  }
  if (Array.isArray(raw.lots)) {
    return {
      id: raw.id,
      type: raw.type || 'stock',
      name: raw.name || 'Untitled',
      ticker: raw.ticker || '—',
      current_price: raw.current_price || 0,
      buy_date: raw.buy_date,
      ...base,
      lots: raw.lots.map((lot, i) => ({
        id: lot.id || `${raw.id}-lot-${i}`,
        units: lot.units || 0,
        buy_price: lot.buy_price || 0,
        buy_date: lot.buy_date || '',
      })),
    }
  }
  return {
    id: raw.id,
    type: raw.type || 'stock',
    name: raw.name || 'Untitled',
    ticker: raw.ticker || '—',
    current_price: raw.current_price || 0,
    buy_date: raw.buy_date,
    ...base,
    lots: [
      {
        id: `${raw.id}-lot-0`,
        units: raw.units || 0,
        buy_price: raw.buy_price || 0,
        buy_date: raw.buy_date || '',
      },
    ],
  }
}

export const readStored = () => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) ? parsed.map(normalizeInvestment) : null
    }
  } catch {
    return null
  }
  return null
}

export const getSeedInvestments = () => seedInvestments.map(normalizeInvestment)

export const formatRp = (n) => `Rp${Number(n || 0).toLocaleString('id-ID')}`

export const formatRpSigned = (n) => {
  const value = Number(n || 0)
  return `${value < 0 ? '-' : '+'}${formatRp(Math.abs(value))}`
}

export const formatUnits = (n) =>
  Number(n || 0).toLocaleString('id-ID', { maximumFractionDigits: 4 })

export const formatPrice = (n) => formatRp(n)

export const formatDate = (value) => {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

// --- Aggregations across lots ---
export const totalUnits = (i) =>
  (i.lots || []).reduce((sum, lot) => sum + (lot.units || 0), 0)

export const investedOf = (i) =>
  (i.lots || []).reduce((sum, lot) => sum + (lot.units || 0) * (lot.buy_price || 0), 0)

export const avgBuyPrice = (i) => {
  const units = totalUnits(i)
  return units > 0 ? investedOf(i) / units : 0
}

export const valueOf = (i) => totalUnits(i) * (i.current_price || 0)

export const gainOf = (i) => valueOf(i) - investedOf(i)

export const gainPctOf = (i) =>
  investedOf(i) > 0 ? (gainOf(i) / investedOf(i)) * 100 : 0

// --- Per-lot helpers ---
export const lotInvestedOf = (lot) => (lot.units || 0) * (lot.buy_price || 0)

export const lotValueOf = (lot, currentPrice) => (lot.units || 0) * (currentPrice || 0)

export const lotGainOf = (lot, currentPrice) => lotValueOf(lot, currentPrice) - lotInvestedOf(lot)

export const signPct = (value) =>
  `${value >= 0 ? '+' : ''}${Number(value || 0).toLocaleString('id-ID', { maximumFractionDigits: 1 })}%`