import { forwardRef, useState, useMemo, useCallback } from 'react'
import { cn } from '../../../lib/utils.js'

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}
function firstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay()
}
function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}
function isToday(d) {
  const t = new Date()
  return isSameDay(d, t)
}
function isWeekend(d) {
  const day = d.getDay()
  return day === 0 || day === 6
}

const DatePicker = forwardRef(
  ({
    className,
    value,
    onChange,
    placeholder,
    disabled = false,
    ...props
  }, ref) => {
    const [showCalendar, setShowCalendar] = useState(false)
    const [selectedDate, setSelectedDate] = useState(value ? new Date(value) : null)
    const [viewDate, setViewDate] = useState(value ? new Date(value) : new Date())

    const year = viewDate.getFullYear()
    const month = viewDate.getMonth()
    const totalDays = daysInMonth(year, month)
    const startDay = firstDayOfMonth(year, month)

    const prevMonth = useCallback(() => {
      setViewDate((prev) => {
        const y = prev.getMonth() === 0 ? prev.getFullYear() - 1 : prev.getFullYear()
        const m = prev.getMonth() === 0 ? 11 : prev.getMonth() - 1
        return new Date(y, m, 1)
      })
    }, [])

    const nextMonth = useCallback(() => {
      setViewDate((prev) => {
        const y = prev.getMonth() === 11 ? prev.getFullYear() + 1 : prev.getFullYear()
        const m = prev.getMonth() === 11 ? 0 : prev.getMonth() + 1
        return new Date(y, m, 1)
      })
    }, [])

    const isSelected = useCallback(
      (d) =>
        selectedDate &&
        isSameDay(d, selectedDate),
      [selectedDate]
    )

    const calendarDays = useMemo(() => {
      const days = []
      for (let i = 0; i < startDay; i++) {
        days.push(null)
      }
      for (let day = 1; day <= totalDays; day++) {
        days.push(new Date(year, month, day))
      }
      return days
    }, [year, month, startDay, totalDays])

    const handleSelect = useCallback(
      (d) => {
        setSelectedDate(d)
        setShowCalendar(false)
        if (onChange) {
          onChange(d.toISOString().split('T')[0])
        }
      },
      [onChange]
    )

    const formatDate = useCallback((d) => {
      if (!d) return ''
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    }, [])

    const handleTriggerClick = useCallback(() => {
      if (disabled) return
      setShowCalendar((prev) => !prev)
    }, [disabled])

    const handleKeyEscape = useCallback(() => {
      setShowCalendar(false)
    }, [])

    return (
      <div className={cn('relative', className)} ref={ref} {...props}>
        <input
          type="text"
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            'cursor-pointer'
          )}
          value={formatDate(selectedDate) || ''}
          placeholder={placeholder || 'Select date...'}
          readOnly
          onClick={handleTriggerClick}
          onKeyDown={(e) => e.key === 'Escape' && handleKeyEscape()}
          ref={ref}
          disabled={disabled}
          aria-label="Date picker"
        />

        {showCalendar && (
          <div className="absolute z-10 bottom-full mb-2 w-[calc(100vw-2rem)] max-w-72 max-h-[90vh] overflow-auto rounded-xl border border-border bg-background p-4 shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                onClick={prevMonth}
                aria-label="Previous month"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>
              <span className="text-sm font-semibold">
                {MONTHS[month]} {year}
              </span>
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                onClick={nextMonth}
                aria-label="Next month"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {DAYS.map((d) => (
                <div
                  key={d}
                  className="h-8 w-8 flex items-center justify-center rounded-full text-xs font-medium text-muted-foreground"
                >
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((date, i) =>
                date === null ? (
                      <div key={`empty-${i}`} className="h-8" />
                ) : (
                  <button
                    key={i}
                    type="button"
                    className={cn(
                      'relative h-8 w-8 rounded-full text-sm font-medium transition-all duration-150',
                      'hover:bg-accent hover:text-accent-foreground',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                      isToday(date) && !isSelected(date) && 'bg-muted text-muted-foreground font-semibold',
                      isSelected(date) && 'bg-primary text-primary-foreground shadow-md hover:bg-primary/90',
                      isWeekend(date) && !isToday(date) && !isSelected(date) && 'text-muted-foreground',
                      'cursor-pointer'
                    )}
                    onClick={() => handleSelect(date)}
                    aria-label={date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    aria-pressed={isSelected(date)}
                  >
                    {date.getDate()}
                  </button>
                )
              )}
            </div>
          </div>
        )}
      </div>
    )
  }
)
DatePicker.displayName = 'DatePicker'

export { DatePicker }
