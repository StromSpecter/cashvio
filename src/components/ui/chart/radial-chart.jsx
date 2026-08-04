import { cn } from '../../../lib/utils.js'
import {
  useChartSize,
  useChartContext,
  describeArc,
} from './chart.jsx'
import { resolveColor, clamp } from './helpers.js'

export function RadialChart({
  value = 0,
  min = 0,
  max = 100,
  config,
  height = 200,
  showTooltip = true,
  showValue = true,
  showLabel = false,
  label,
  strokeWidth = 10,
  trackColor = 'var(--color-border)',
  className,
  ...props
}) {
  const { ref, width } = useChartSize()
  const ctx = useChartContext()
  const resolvedConfig = config ?? ctx.config
  const progress = clamp((value - min) / (max - min), 0, 1) * 360
  const cx = width / 2
  const cy = height / 2
  const radius = Math.max(0, Math.min(width, height) / 2 - strokeWidth / 2 - 4)
  const entries = Object.entries(resolvedConfig)
  const color = resolveColor(entries[0]?.[0] ?? 'value', entries[0]?.[1], 0)
  const arc = progress > 359.9 ? null : describeArc(cx, cy, radius, 0, progress)

  const onMove = (e) => {
    if (!showTooltip) return
    const rect = e.currentTarget.getBoundingClientRect()
    ctx.showTooltip({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      rows: [
        {
          label: label ?? entries[0]?.[1]?.label ?? 'Value',
          color,
          value: ctx.formatValue(value),
        },
      ],
    })
  }

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={ctx.hideTooltip}
      className={cn('relative w-full text-foreground', className)}
      {...props}
    >
      <svg width={width} height={height} className="block">
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        {arc ? (
          <path
            d={arc}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
        ) : (
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
          />
        )}
      </svg>
      {(showValue || showLabel) && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          {showValue && (
            <span className="text-2xl font-semibold tabular-nums">
              {ctx.formatValue(value)}
            </span>
          )}
          {showLabel && (
            <span className="text-xs text-muted-foreground">
              {label ?? entries[0]?.[1]?.label ?? 'Value'}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
