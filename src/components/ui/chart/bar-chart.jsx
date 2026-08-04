import { cn } from '../../../lib/utils.js'
import {
  CartesianAxes,
  ChartLegend,
  useCartesianScale,
  useChartSize,
  useChartContext,
  niceMax,
} from './chart.jsx'
import { getValue, resolveColor } from './helpers.js'

export function BarChart({
  data = [],
  config,
  height = 260,
  showTooltip = true,
  showLegend = false,
  stacked = false,
  radius = 4,
  className,
  ...props
}) {
  const { ref, width } = useChartSize()
  const ctx = useChartContext()
  const seriesConfig = config ?? ctx.config
  const series = Object.entries(seriesConfig)
  const keys = series.map(([key]) => key)

  const maxValue = niceMax(
    Math.max(
      1,
      ...data.map((d) =>
        stacked
          ? keys.reduce((sum, k) => sum + getValue(d, k, 0), 0)
          : Math.max(0, ...keys.map((k) => getValue(d, k, 0)))
      )
    )
  )

  const scale = useCartesianScale({ width, height, data, maxValue })

  const xLabels = data.map((d, i) => ({
    x: scale.xCenter(i),
    label: String(d?.label ?? d?.name ?? i),
  }))

  const buildTooltip = (i, x, y) => {
    const d = data[i]
    if (!d || !showTooltip) return
    ctx.showTooltip({
      x,
      y,
      label: d?.label ?? d?.name,
      rows: keys.map((key, s) => ({
        label: seriesConfig[key]?.label ?? key,
        color: resolveColor(key, seriesConfig[key], s),
        value: ctx.formatValue(getValue(d, key, i)),
      })),
    })
  }

  const onLeave = () => ctx.hideTooltip()

  const onBarMove = (e, i) => {
    if (!showTooltip) return
    const el = e.currentTarget
    const svg = el.ownerSVGElement
    const c = svg.getBoundingClientRect()
    const r = el.getBoundingClientRect()
    buildTooltip(i, r.left - c.left + r.width / 2, r.top - c.top + r.height / 2)
  }

  return (
    <div ref={ref} className={cn('w-full text-foreground', className)} {...props}>
      {showLegend && (
        <ChartLegend
          className="mb-2"
          items={keys.map((key, s) => ({
            label: seriesConfig[key]?.label ?? key,
            color: resolveColor(key, seriesConfig[key], s),
          }))}
        />
      )}
      <svg width={width} height={height} className="block overflow-visible">
        <CartesianAxes
          height={height}
          maxValue={maxValue}
          xLabels={xLabels}
          formatValue={ctx.formatValue}
        />
        {keys.length === 0 ? null : (
          <>
            {data.map((d, i) => {
              if (stacked) {
                let offset = 0
                return keys.map((key, s) => {
                  const value = Math.max(0, getValue(d, key, i))
                  const y0 = scale.yScale(offset)
                  const y1 = scale.yScale(offset + value)
                  offset += value
                  return (
                    <rect
                      key={`${i}-${key}`}
                      className="chart-bar transition-opacity duration-150 hover:opacity-80"
                      x={scale.xCenter(i) - scale.bandWidth / 2 + 2}
                      y={y1}
                      width={Math.max(1, scale.bandWidth - 4)}
                      height={Math.max(0, y0 - y1)}
                      rx={radius}
                      fill={resolveColor(key, seriesConfig[key], s)}
                      style={{ cursor: showTooltip ? 'pointer' : 'default' }}
                      onPointerMove={(e) => onBarMove(e, i)}
                      onPointerLeave={onLeave}
                    />
                  )
                })
              }
              const gap = 4
              const barWidth = Math.max(2, (scale.bandWidth - gap * (keys.length - 1)) / keys.length)
              const groupX = scale.xCenter(i) - scale.bandWidth / 2
              return keys.map((key, s) => {
                const value = Math.max(0, getValue(d, key, i))
                const y = scale.yScale(value)
                return (
                  <rect
                    key={`${i}-${key}`}
                    className="chart-bar transition-opacity duration-150 hover:opacity-80"
                    x={groupX + s * (barWidth + gap)}
                    y={y}
                    width={barWidth}
                    height={Math.max(0, scale.yScale(0) - y)}
                    rx={radius}
                    fill={resolveColor(key, seriesConfig[key], s)}
                    style={{ cursor: showTooltip ? 'pointer' : 'default' }}
                    onPointerMove={(e) => onBarMove(e, i)}
                    onPointerLeave={onLeave}
                  />
                )
              })
            })}
          </>
        )}
      </svg>
    </div>
  )
}
