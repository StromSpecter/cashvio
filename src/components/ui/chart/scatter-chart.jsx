import { cn } from '../../../lib/utils.js'
import {
  CartesianAxes,
  ChartLegend,
  CHART_MARGIN,
  useChartContext,
  niceMax,
} from './chart.jsx'
import { useChartSize } from './chart.jsx'
import { getValue, resolveColor } from './helpers.js'

export function ScatterChart({
  data = [],
  config,
  height = 260,
  showTooltip = true,
  showLegend = false,
  pointSize = 7,
  className,
  ...props
}) {
  const { ref, width } = useChartSize()
  const ctx = useChartContext()
  const series = Object.entries(config ?? ctx.config)
  const key = series[0]?.[0] ?? 'point'
  const color = resolveColor(key, series[0]?.[1], 0)
  const label = series[0]?.[1]?.label ?? 'Series'

  const xs = data.map((d, i) => getValue(d, 'x', i))
  const xMin = xs.length ? Math.min(...xs) : 0
  const xMax = xs.length ? Math.max(...xs) : 1
  const yMax = niceMax(Math.max(1, ...data.map((d, i) => getValue(d, 'y', i))))

  const innerW = Math.max(0, width - CHART_MARGIN.left - CHART_MARGIN.right)
  const innerH = Math.max(0, height - CHART_MARGIN.top - CHART_MARGIN.bottom)
  const xScale = (v) => CHART_MARGIN.left + ((v - xMin) / (xMax - xMin || 1)) * innerW
  const yScale = (v) => CHART_MARGIN.top + innerH - (v / yMax) * innerH

  const xLabels = Array.from({ length: 4 }, (_, i) => {
    const t = xMin + (i / 3) * (xMax - xMin)
    return { x: xScale(t), label: Number(t.toFixed(2)) }
  })

  const onMove = (e, d, i) => {
    if (!showTooltip) return
    const el = e.currentTarget
    const svg = el.ownerSVGElement
    const c = svg.getBoundingClientRect()
    const r = el.getBoundingClientRect()
    ctx.showTooltip({
      x: r.left - c.left + r.width / 2,
      y: r.top - c.top + r.height / 2,
      label: d?.label ?? d?.name,
      rows: [
        {
          label,
          color,
          value: `x: ${ctx.formatValue(getValue(d, 'x', i))}, y: ${ctx.formatValue(
            getValue(d, 'y', i)
          )}`,
        },
      ],
    })
  }

  return (
    <div ref={ref} className={cn('w-full text-foreground', className)} {...props}>
      {showLegend && (
        <ChartLegend className="mb-2" items={[{ label, color }]} />
      )}
      <svg width={width} height={height} className="block overflow-visible">
        <CartesianAxes
          height={height}
          maxValue={yMax}
          xLabels={xLabels}
          formatValue={ctx.formatValue}
        />
        {data.map((d, i) => (
          <circle
            key={i}
            cx={xScale(getValue(d, 'x', i))}
            cy={yScale(getValue(d, 'y', i))}
            r={pointSize}
            fill={color}
            stroke="var(--color-background)"
            strokeWidth="1.5"
            style={{ cursor: showTooltip ? 'pointer' : 'default' }}
            onPointerMove={(e) => onMove(e, d, i)}
            onPointerLeave={ctx.hideTooltip}
          />
        ))}
      </svg>
    </div>
  )
}
