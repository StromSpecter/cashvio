import { useMemo, useState } from 'react'
import { cn } from '../../../lib/utils.js'
import {
  ChartLegend,
  useChartSize,
  useChartContext,
  polarToCartesian,
  wedgeSector,
  annularSector,
} from './chart.jsx'
import { getValue, resolveColor } from './helpers.js'

export function PieChart({
  data = [],
  config,
  height = 260,
  showTooltip = true,
  showLegend = true,
  innerRadius = 0,
  padAngle = 2,
  centerLabel,
  centerValue,
  className,
  ...props
}) {
  const { ref, width } = useChartSize()
  const ctx = useChartContext()
  const resolvedConfig = config ?? ctx.config
  const [active, setActive] = useState(null)
  const cx = width / 2
  const cy = height / 2
  const radius = Math.max(0, Math.min(width, height) / 2 - 16)
  const total = data.reduce((sum, d, i) => sum + Math.abs(getValue(d, 'value', i)), 0)

  const items = useMemo(() => {
    let angle = 0
    const list = []
    for (let i = 0; i < data.length; i++) {
      const d = data[i]
      const raw = Math.abs(getValue(d, 'value', i))
      const sweep = total > 0 ? (raw / total) * 360 : 0
      const pad = raw > 0 ? Math.min(padAngle, sweep / 2) : 0
      const start = angle + pad
      const end = angle + sweep - pad
      const finalEnd = i === data.length - 1 && pad > 0 ? 360 : end
      const mid = (start + finalEnd) / 2
      const midR = innerRadius > 0 ? (innerRadius + radius) / 2 : radius * 0.66
      const { x, y } = polarToCartesian(cx, cy, midR, mid)
      const key = d?.key ?? d?.label ?? d?.name ?? i
      const path =
        raw > 0
          ? innerRadius > 0
            ? annularSector(cx, cy, radius, innerRadius, start, finalEnd)
            : wedgeSector(cx, cy, radius, start, finalEnd)
          : ''
      list.push({
        d,
        index: i,
        path,
        x,
        y,
        raw,
        key,
        label: resolvedConfig[key]?.label ?? d?.label ?? d?.name ?? key,
        color: resolveColor(key, resolvedConfig[key]),
      })
      angle += sweep
    }
    return list
  }, [data, resolvedConfig, total, radius, innerRadius, padAngle, cx, cy])

  const onMove = (e, item) => {
    if (!showTooltip) return
    ctx.showTooltip({
      x: item.x,
      y: item.y,
      rows: [
        {
          label: item.label,
          color: item.color,
          value: `${ctx.formatValue(item.raw)}${
            total > 0 ? ` (${((item.raw / total) * 100).toFixed(1)}%)` : ''
          }`,
        },
      ],
    })
  }

  return (
    <div ref={ref} className={cn('w-full text-foreground', className)} {...props}>
      <div className="relative mx-auto" style={{ width, height }}>
        <svg width={width} height={height} className="block">
          {items.map(
            (item) =>
              item.path && (
                <path
                  key={item.key}
                  d={item.path}
                  fill={item.color}
                  stroke="var(--color-background)"
                  strokeWidth="1.5"
                  className="transition-opacity duration-150"
                  style={{
                    cursor: 'pointer',
                    opacity: active != null && active !== item.index ? 0.45 : 1,
                  }}
                  onPointerEnter={() => setActive(item.index)}
                  onPointerMove={(e) => onMove(e, item)}
                  onPointerLeave={() => {
                    setActive(null)
                    ctx.hideTooltip()
                  }}
                />
              )
          )}
        </svg>
        {innerRadius > 0 && (centerValue || centerLabel) && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
            {centerValue && (
              <span className="text-3xl font-semibold tabular-nums">{centerValue}</span>
            )}
            {centerLabel && (
              <span className="mt-1 text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
                {centerLabel}
              </span>
            )}
          </div>
        )}
      </div>
      {showLegend && (
        <ChartLegend
          className="mt-3"
          items={items.map((item) => ({ label: item.label, color: item.color }))}
        />
      )}
    </div>
  )
}
