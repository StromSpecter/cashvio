import { cn } from '../../../lib/utils.js'
import {
  ChartLegend,
  useChartSize,
  useChartContext,
  polarToCartesian,
  niceMax,
} from './chart.jsx'
import { getValue, resolveColor } from './helpers.js'

export function RadarChart({
  data = [],
  config,
  height = 280,
  showTooltip = true,
  showLegend = true,
  showDots = true,
  levels = 4,
  strokeWidth = 2,
  className,
  ...props
}) {
  const { ref, width } = useChartSize()
  const ctx = useChartContext()
  const seriesConfig = config ?? ctx.config
  const series = Object.entries(seriesConfig)
  const keys = series.map(([key]) => key)

  const cx = width / 2
  const cy = height / 2 - 6
  const radius = Math.max(0, Math.min(width, height) / 2 - 34)
  const n = data.length
  const per = n > 0 ? 360 / n : 360
  const angleFor = (i) => -90 + i * per

  const maxValue = niceMax(
    Math.max(
      1,
      ...data.map((d) => Math.max(0, ...keys.map((k) => getValue(d, k, 0))))
    )
  )

  const vertex = (i, v) => {
    const r = maxValue > 0 ? (v / maxValue) * radius : 0
    return polarToCartesian(cx, cy, r, angleFor(i))
  }

  const ring = (level) =>
    Array.from({ length: n }, (_, i) =>
      polarToCartesian(cx, cy, (radius * level) / levels, angleFor(i))
    )

  const onMove = (e) => {
    if (!showTooltip) return
    const svgRect = e.currentTarget.ownerSVGElement.getBoundingClientRect()
    const mx = e.clientX - svgRect.left
    const my = e.clientY - svgRect.top
    let angle = (Math.atan2(mx - cx, cy - my) * 180) / Math.PI
    if (angle < 0) angle += 360
    const idx = n > 0 ? Math.round(angle / per) % n : 0
    const d = data[idx]
    if (!d) return
    ctx.showTooltip({
      x: mx,
      y: my,
      label: d?.label ?? d?.name,
      rows: keys.map((key, s) => ({
        label: seriesConfig[key]?.label ?? key,
        color: resolveColor(key, seriesConfig[key], s),
        value: ctx.formatValue(getValue(d, key, idx)),
      })),
    })
  }

  return (
    <div ref={ref} className={cn('w-full text-foreground', className)} {...props}>
      <svg width={width} height={height} className="block overflow-visible">
        {n > 0 && (
          <>
            <g>
              {ring(levels).map((p, i) => (
                <line
                  key={`axis-${i}`}
                  x1={cx}
                  y1={cy}
                  x2={p.x}
                  y2={p.y}
                  stroke="currentColor"
                  className="text-border/60"
                  strokeWidth="1"
                />
              ))}
              {Array.from({ length: levels }, (_, l) => (
                <polygon
                  key={`ring-${l}`}
                  points={ring(l + 1)
                    .map((p) => `${p.x},${p.y}`)
                    .join(' ')}
                  fill="none"
                  stroke="currentColor"
                  className="text-border/60"
                  strokeWidth="1"
                />
              ))}
              {data.map((d, i) => {
                const { x, y } = polarToCartesian(cx, cy, radius + 14, angleFor(i))
                return (
                  <text
                    key={`label-${i}`}
                    x={x}
                    y={y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="10"
                    className="fill-muted-foreground"
                  >
                    {String(d?.label ?? d?.name ?? i)}
                  </text>
                )
              })}
            </g>
            {keys.map((key, s) => {
              const pts = data.map((d, i) => vertex(i, getValue(d, key, i)))
              const color = resolveColor(key, seriesConfig[key], s)
              return (
                <g
                  key={key}
                  onPointerMove={onMove}
                  onPointerLeave={ctx.hideTooltip}
                  style={{ cursor: showTooltip ? 'crosshair' : 'default' }}
                >
                  <polygon
                    points={pts.map((p) => `${p.x},${p.y}`).join(' ')}
                    fill={color}
                    fillOpacity="0.18"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeLinejoin="round"
                  />
                  {showDots &&
                    pts.map((p, i) => (
                      <circle
                        key={i}
                        cx={p.x}
                        cy={p.y}
                        r={3}
                        fill={color}
                        stroke="var(--color-background)"
                        strokeWidth="1.5"
                      />
                    ))}
                </g>
              )
            })}
          </>
        )}
      </svg>
      {showLegend && (
        <ChartLegend
          className="mt-2"
          items={keys.map((key, s) => ({
            label: seriesConfig[key]?.label ?? key,
            color: resolveColor(key, seriesConfig[key], s),
          }))}
        />
      )}
    </div>
  )
}
