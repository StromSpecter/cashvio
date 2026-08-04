/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { cn } from '../../../lib/utils.js'

export const DEFAULT_PALETTE = [
  'var(--color-chart-1)',
  'var(--color-chart-2)',
  'var(--color-chart-3)',
  'var(--color-chart-4)',
  'var(--color-chart-5)',
]

export const CHART_MARGIN = { top: 12, right: 12, bottom: 30, left: 44 }

const NICE = [1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10]

export function niceMax(value) {
  const v = Number(value)
  if (!Number.isFinite(v) || v <= 0) return 1
  const exp = Math.pow(10, Math.floor(Math.log10(v)))
  for (const n of NICE) if (n * exp >= v - 1e-9) return n * exp
  return 10 * exp
}

export function getTicks(max, count = 5) {
  const step = max / count
  return Array.from({ length: count + 1 }, (_, i) => Number((i * step).toFixed(2)))
}

export function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = (angleDeg * Math.PI) / 180
  return { x: cx + r * Math.sin(rad), y: cy - r * Math.cos(rad) }
}

export function describeArc(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, startAngle)
  const end = polarToCartesian(cx, cy, r, endAngle)
  const sweep = ((endAngle - startAngle) % 360) + 360
  const largeArc = sweep % 360 > 180 ? 1 : 0
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`
}

export function wedgeSector(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, startAngle)
  const end = polarToCartesian(cx, cy, r, endAngle)
  const largeArc = endAngle - startAngle > 180 ? 1 : 0
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y} Z`
}

export function annularSector(cx, cy, outerRadius, innerRadius, startAngle, endAngle) {
  const outerStart = polarToCartesian(cx, cy, outerRadius, startAngle)
  const outerEnd = polarToCartesian(cx, cy, outerRadius, endAngle)
  const innerStart = polarToCartesian(cx, cy, innerRadius, startAngle)
  const innerEnd = polarToCartesian(cx, cy, innerRadius, endAngle)
  const largeArc = endAngle - startAngle > 180 ? 1 : 0
  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${innerStart.x} ${innerStart.y}`,
    'Z',
  ].join(' ')
}

export function linePath(points) {
  if (points.length < 2) return points.length ? `M ${points[0].x} ${points[0].y}` : ''
  return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
}

export function smoothPath(points) {
  if (points.length < 2) return points.length ? `M ${points[0].x} ${points[0].y}` : ''
  return points.reduce((acc, p, i, arr) => {
    if (i === 0) return `M ${p.x} ${p.y}`
    const prev = arr[i - 1]
    const pprev = arr[i - 2] ?? prev
    const pnext = arr[i + 1] ?? p
    const c1x = prev.x + (p.x - pprev.x) / 6
    const c1y = prev.y + (p.y - pprev.y) / 6
    const c2x = p.x - (pnext.x - prev.x) / 6
    const c2y = p.y - (pnext.y - prev.y) / 6
    return `${acc} C ${c1x} ${c1y} ${c2x} ${c2y} ${p.x} ${p.y}`
  }, '')
}

export function chartConfig(series, config = {}) {
  const merged = {}
  series.forEach((s, i) => {
    merged[s.key] = {
      label: config[s.key]?.label ?? s.label ?? s.key,
      color: config[s.key]?.color ?? s.color ?? DEFAULT_PALETTE[i % DEFAULT_PALETTE.length],
    }
  })
  return merged
}

export function legendItems(series, config) {
  return series.map((s) => ({
    label: config[s.key]?.label ?? s.label ?? s.key,
    color: `var(--color-${s.key})`,
  }))
}

const ChartContext = createContext(null)

export function useChartContext() {
  const ctx = useContext(ChartContext)
  if (!ctx) {
    throw new Error('Chart components must be used inside a <ChartContainer>.')
  }
  return ctx
}

export function useChartSize() {
  const ref = useRef(null)
  const [width, setWidth] = useState(0)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) setWidth(entry.contentRect.width)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return { ref, width }
}

export function useCartesianScale({ width, height, data, maxValue, margin = CHART_MARGIN }) {
  return useMemo(() => {
    const innerW = Math.max(0, width - margin.left - margin.right)
    const innerH = Math.max(0, height - margin.top - margin.bottom)
    const yScale = (v) => margin.top + innerH - (v / maxValue) * innerH
    const bandWidth = data.length ? innerW / data.length : innerW
    const xCenter = (i) => margin.left + bandWidth * (i + 0.5)
    const xPoint = (i) =>
      data.length > 1
        ? margin.left + (i / (data.length - 1)) * innerW
        : margin.left + innerW / 2
    return { innerW, innerH, yScale, xCenter, xPoint, bandWidth }
  }, [width, height, data, maxValue, margin])
}

export function CartesianAxes({
  height,
  maxValue,
  xLabels,
  showGrid = true,
  formatValue,
  margin = CHART_MARGIN,
}) {
  const { width } = useChartContext()
  const ticks = getTicks(maxValue)
  const innerH = height - margin.top - margin.bottom
  const y = (v) => margin.top + innerH - (v / maxValue) * innerH

  return (
    <g>
      {showGrid &&
        ticks.map((t) => (
          <line
            key={`grid-${t}`}
            x1={margin.left}
            x2={width - margin.right}
            y1={y(t)}
            y2={y(t)}
            stroke="currentColor"
            className="text-border/40"
            strokeWidth="1"
            strokeDasharray={t === 0 ? undefined : '3 4'}
          />
        ))}
      {ticks.map((t) => (
        <text
          key={`tick-${t}`}
          x={margin.left - 8}
          y={y(t)}
          textAnchor="end"
          dominantBaseline="middle"
          fontSize="10"
          className="fill-muted-foreground"
        >
          {formatValue ? formatValue(t) : t}
        </text>
      ))}
      <line
        x1={margin.left}
        x2={width - margin.right}
        y1={y(0)}
        y2={y(0)}
        stroke="currentColor"
        className="text-border"
        strokeWidth="1"
      />
      {xLabels &&
        xLabels.map(({ x, label }) => (
          <text
            key={`x-${label}-${x}`}
            x={x}
            y={height - margin.bottom / 2}
            textAnchor="middle"
            fontSize="10"
            className="fill-muted-foreground"
          >
            {label}
          </text>
        ))}
    </g>
  )
}

const ChartContainer = forwardRef(({ config = {}, formatValue, className, children, ...props }, ref) => {
  const { ref: sizeRef, width } = useChartSize()
  const [hover, setHover] = useState(null)

  const styleVars = useMemo(() => {
    const vars = {}
    Object.entries(config).forEach(([key, entry], i) => {
      vars[`--color-${key}`] = entry?.color ?? DEFAULT_PALETTE[i % DEFAULT_PALETTE.length]
    })
    return vars
  }, [config])

  const value = useMemo(
    () => ({
      width,
      config,
      formatValue: formatValue ?? ((v) => String(v)),
      showTooltip: setHover,
      hideTooltip: () => setHover(null),
    }),
    [width, config, formatValue]
  )

  return (
    <ChartContext.Provider value={value}>
      <div
        ref={(node) => {
          sizeRef.current = node
          if (typeof ref === 'function') ref(node)
          else if (ref) ref.current = node
        }}
        className={cn('relative w-full', className)}
        style={styleVars}
        {...props}
      >
        {children}
        {hover && <ChartTooltip {...hover} />}
      </div>
    </ChartContext.Provider>
  )
})
ChartContainer.displayName = 'ChartContainer'

const ChartTooltip = forwardRef(({ x, y, label, rows = [], className, ...props }, ref) => {
  const { width } = useChartContext()
  const flip = x > width * 0.55
  return (
    <div
      ref={ref}
      className={cn(
        'chart-tooltip pointer-events-none absolute z-50 min-w-[9rem] rounded-md border border-border/60 bg-card/95 px-3 py-2 text-xs shadow-lg backdrop-blur-sm',
        className
      )}
      style={{
        left: x,
        top: y,
        transform: `translate(${flip ? 'calc(-100% - 12px)' : '12px'}, -50%)`,
      }}
      {...props}
    >
      {label != null && label !== '' && (
        <p className="mb-1.5 font-medium text-muted-foreground">{label}</p>
      )}
      <div className="space-y-1">
        {rows.map((row, i) => (
          <div key={i} className="flex items-center gap-2">
            <span
              className="size-2 shrink-0 rounded-full"
              style={{ background: row.color }}
            />
            <span className="text-muted-foreground">{row.label}</span>
            <span className="ml-auto pl-4 font-medium tabular-nums text-foreground">
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
})
ChartTooltip.displayName = 'ChartTooltip'

const ChartLegend = forwardRef(({ items = [], className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex select-none flex-wrap items-center justify-center gap-x-4 gap-y-1.5', className)}
    {...props}
  >
    {items.map((item, i) => (
      <span key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <span className="size-2.5 rounded-full ring-1 ring-border/40" style={{ background: item.color }} />
        {item.label}
      </span>
    ))}
  </div>
))
ChartLegend.displayName = 'ChartLegend'

export { ChartContainer, ChartTooltip, ChartLegend }
