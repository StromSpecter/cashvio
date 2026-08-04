import { useId, useState } from 'react'
import { cn } from '../../../lib/utils.js'
import {
  CartesianAxes,
  ChartLegend,
  CHART_MARGIN,
  useCartesianScale,
  useChartSize,
  useChartContext,
  niceMax,
  linePath,
  smoothPath,
} from './chart.jsx'
import { getValue, resolveColor, clamp } from './helpers.js'

export function LineChart(props) {
  return <LineBase {...props} area={false} />
}

export function AreaChart(props) {
  return <LineBase {...props} area />
}

function LineBase({
  data = [],
  config,
  height = 260,
  showTooltip = true,
  showLegend = false,
  showDots = true,
  area = false,
  curve = 'smooth',
  strokeWidth = 2,
  className,
  ...props
}) {
  const { ref, width } = useChartSize()
  const ctx = useChartContext()
  const gradientId = useId()
  const seriesConfig = config ?? ctx.config
  const series = Object.entries(seriesConfig)
  const keys = series.map(([key]) => key)

  const maxValue = niceMax(
    Math.max(
      1,
      ...data.map((d) => Math.max(0, ...keys.map((k) => getValue(d, k, 0))))
    )
  )

  const scale = useCartesianScale({ width, height, data, maxValue })
  const pathFn = curve === 'straight' ? linePath : smoothPath

  const points = keys.map((key) =>
    data.map((d, i) => ({
      x: scale.xPoint(i),
      y: scale.yScale(getValue(d, key, i)),
    }))
  )

  const xLabels = data.map((d, i) => ({
    x: scale.xPoint(i),
    label: String(d?.label ?? d?.name ?? i),
  }))

  const [activeIndex, setActiveIndex] = useState(null)

  const onMove = (e) => {
    if (!showTooltip) return
    const rect = e.currentTarget.getBoundingClientRect()
    const relX = clamp(e.clientX - rect.left, 0, scale.innerW)
    const idx =
      data.length > 1
        ? clamp(Math.round((relX / scale.innerW) * (data.length - 1)), 0, data.length - 1)
        : 0
    setActiveIndex(idx)
    const d = data[idx]
    const py = Math.min(
      ...keys.map((k) => scale.yScale(getValue(d, k, idx)))
    )
    ctx.showTooltip({
      x: scale.xPoint(idx),
      y: py,
      label: d?.label ?? d?.name,
      rows: keys.map((key, s) => ({
        label: seriesConfig[key]?.label ?? key,
        color: resolveColor(key, seriesConfig[key], s),
        value: ctx.formatValue(getValue(d, key, idx)),
      })),
    })
  }

  const onLeave = () => {
    ctx.hideTooltip()
    setActiveIndex(null)
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
        {area && (
          <defs>
            {series.map(([key], s) => (
              <linearGradient
                key={key}
                id={`${gradientId}-${s}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor={resolveColor(key, seriesConfig[key], s)}
                  stopOpacity="0.3"
                />
                <stop
                  offset="100%"
                  stopColor={resolveColor(key, seriesConfig[key], s)}
                  stopOpacity="0"
                />
              </linearGradient>
            ))}
          </defs>
        )}
        <CartesianAxes
          height={height}
          maxValue={maxValue}
          xLabels={xLabels}
          formatValue={ctx.formatValue}
        />
        {keys.map((key, s) => {
          const pts = points[s]
          const color = resolveColor(key, seriesConfig[key], s)
          const d = pathFn(pts)
          const baselineY = scale.yScale(0)
          return (
            <g key={key}>
              {area && (
                <path
                  d={`${d} L ${pts[pts.length - 1].x} ${baselineY} L ${pts[0].x} ${baselineY} Z`}
                  fill={`url(#${gradientId}-${s})`}
                />
              )}
              <path
                className="chart-line"
                pathLength="1"
                d={d}
                fill="none"
                stroke={color}
                strokeWidth={strokeWidth}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              {showDots &&
                pts.map((p, i) => (
                  <circle
                    key={i}
                    cx={p.x}
                    cy={p.y}
                    r={3.5}
                    fill={color}
                    stroke="var(--color-background)"
                    strokeWidth={2}
                  />
                ))}
            </g>
          )
        })}
        {activeIndex != null && showTooltip && (
          <line
            x1={scale.xPoint(activeIndex)}
            x2={scale.xPoint(activeIndex)}
            y1={CHART_MARGIN.top}
            y2={CHART_MARGIN.top + scale.innerH}
            stroke="currentColor"
            className="text-border/80"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
        )}
        {activeIndex != null &&
          showTooltip &&
          keys.map((key, s) => {
            const color = resolveColor(key, seriesConfig[key], s)
            const p = points[s][activeIndex]
            return (
              <circle
                key={`active-${key}`}
                cx={p.x}
                cy={p.y}
                r={5}
                fill={color}
                stroke="var(--color-background)"
                strokeWidth={2.5}
                className="pointer-events-none"
              />
            )
          })}
        {showTooltip && (
          <rect
            x={CHART_MARGIN.left}
            y={CHART_MARGIN.top}
            width={scale.innerW}
            height={scale.innerH}
            fill="transparent"
            style={{ cursor: 'crosshair' }}
            onPointerMove={onMove}
            onPointerLeave={onLeave}
          />
        )}
      </svg>
    </div>
  )
}
