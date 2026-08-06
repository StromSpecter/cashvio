import { forwardRef, createContext, useContext, useState, useRef, useEffect, useLayoutEffect } from 'react'
import { cn } from '../../../lib/utils.js'

const DropdownContext = createContext()

function Dropdown({ children }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const handleClickOutside = (e) => {
      if (ref.current && ref.current.contains(e.target)) return
      setOpen(false)
    }
    const handleEsc = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEsc)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEsc)
    }
  }, [open])

  return (
    <DropdownContext.Provider value={{ open, setOpen, triggerRef: ref }}>
      <div ref={ref} className="inline-block">
        {children}
      </div>
    </DropdownContext.Provider>
  )
}
Dropdown.displayName = 'Dropdown'

function DropdownTrigger({ asChild, children, ...props }) {
  const { open, setOpen } = useContext(DropdownContext)
  const Comp = asChild ? 'span' : 'button'
  return (
    <Comp
      onClick={() => setOpen(!open)}
      aria-expanded={open}
      aria-haspopup="true"
      {...props}
    >
      {children}
    </Comp>
  )
}
DropdownTrigger.displayName = 'DropdownTrigger'

const DropdownContent = forwardRef(({ className, align = 'start', children, ...props }, ref) => {
  const { open, setOpen, triggerRef } = useContext(DropdownContext)
  const contentRef = useRef(null)
  const [pos, setPos] = useState(null)

  useLayoutEffect(() => {
    if (!open) return
    const update = () => {
      const el = triggerRef.current
      if (!el) return
      const menu = contentRef.current
      const rect = el.getBoundingClientRect()
      const menuH = menu ? menu.offsetHeight : 0
      const menuW = menu ? menu.offsetWidth : 128
      const spaceBelow = window.innerHeight - rect.bottom
      const openUp = spaceBelow < menuH + 8 && rect.top > menuH
      const top = openUp ? rect.top - menuH - 4 : rect.bottom + 4
      const left = align === 'end' ? rect.right - menuW : rect.left
      setPos({ top, left })
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [open, align, triggerRef])

  if (!open) return null
  return (
    <div
      ref={(node) => {
        contentRef.current = node
        if (typeof ref === 'function') ref(node)
        else if (ref) ref.current = node
      }}
      style={pos ? { top: pos.top, left: pos.left } : undefined}
      className={cn(
        'fixed z-50 min-w-[8rem] overflow-hidden rounded-md border border-border bg-background p-1 shadow-md',
        'animate-in fade-in-0 zoom-in-95 duration-150',
        className
      )}
      onClick={() => setOpen(false)}
      role="menu"
      {...props}
    >
      {children}
    </div>
  )
})
DropdownContent.displayName = 'DropdownContent'

const DropdownItem = forwardRef(({ className, inset, ...props }, ref) => {
  return (
    <button
      ref={ref}
      role="menuitem"
      className={cn(
        'relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        inset && 'pl-8',
        className
      )}
      {...props}
    />
  )
})
DropdownItem.displayName = 'DropdownItem'

const DropdownSeparator = forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('-mx-1 my-1 h-px bg-border', className)}
      {...props}
    />
  )
})
DropdownSeparator.displayName = 'DropdownSeparator'

const DropdownLabel = forwardRef(({ className, inset, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('px-2 py-1.5 text-xs font-medium text-muted-foreground', inset && 'pl-8', className)}
      {...props}
    />
  )
})
DropdownLabel.displayName = 'DropdownLabel'

export {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownSeparator,
  DropdownLabel,
}