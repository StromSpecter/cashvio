import { DEFAULT_PALETTE } from './chart.jsx'

export function getValue(datum, key, index) {
  if (datum == null) return 0
  if (typeof datum !== 'object') return Number(datum) || 0
  const v = datum[key]
  return typeof v === 'function' ? v(datum, index) : Number(v) || 0
}

export function resolveColor(key, entry) {
  if (entry?.color) {
    if (typeof entry.color === 'number') {
      return DEFAULT_PALETTE[Math.abs(entry.color) % DEFAULT_PALETTE.length]
    }
    return entry.color
  }
  return `var(--color-${key})`
}

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}
