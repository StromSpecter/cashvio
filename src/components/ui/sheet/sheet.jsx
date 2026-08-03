import { forwardRef, createContext, useContext, useState, useEffect, useCallback } from 'react'
import { X } from 'lucide-react'
import { cn } from '../../../lib/utils.js'

const SheetContext = createContext()

function Sheet({ open: controlledOpen, onOpenChange, children }) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : uncontrolledOpen

  const setOpen = useCallback(
    (val) => {
      if (!isControlled) setUncontrolledOpen(val)
      onOpenChange?.(val)
    },
    [isControlled, onOpenChange]
  )

  return (
    <SheetContext.Provider value={{ open, setOpen }}>
      {children}
    </SheetContext.Provider>
  )
}
Sheet.displayName = 'Sheet'

function SheetTrigger({ asChild, children, ...props }) {
  const { setOpen } = useContext(SheetContext)
  const Comp = asChild ? 'span' : 'button'
  return (
    <Comp onClick={() => setOpen(true)} {...props}>
      {children}
    </Comp>
  )
}
SheetTrigger.displayName = 'SheetTrigger'

function SheetClose({ children, ...props }) {
  const { setOpen } = useContext(SheetContext)
  return (
    <button onClick={() => setOpen(false)} {...props}>
      {children}
    </button>
  )
}
SheetClose.displayName = 'SheetClose'

const SheetContent = forwardRef(
  ({ className, side = 'right', position = 'fixed', overlay = true, children, ...props }, ref) => {
    const { open, setOpen } = useContext(SheetContext)

    useEffect(() => {
      if (!open) return
      const handleEsc = (e) => {
        if (e.key === 'Escape') setOpen(false)
      }
      if (position === 'fixed') document.body.style.overflow = 'hidden'
      document.addEventListener('keydown', handleEsc)
      return () => {
        document.removeEventListener('keydown', handleEsc)
        if (position === 'fixed') document.body.style.overflow = ''
      }
    }, [open, setOpen, position])

    if (!open) return null

    return (
      <>
        {overlay && (
          <div
            className={cn(
              'z-50 bg-black/50 backdrop-blur-md animate-in fade-in-0 duration-200',
              position === 'fixed' ? 'fixed inset-0' : 'absolute inset-0'
            )}
            onClick={() => setOpen(false)}
          />
        )}
        <div
          ref={ref}
          role="dialog"
          aria-modal="true"
          className={cn(
            'z-50 flex flex-col gap-4 bg-background p-6 shadow-lg',
            position === 'fixed' ? 'fixed' : 'absolute',
            side === 'top' && 'inset-x-0 top-0 max-h-full border-b animate-in slide-in-from-top duration-300',
            side === 'bottom' && 'inset-x-0 bottom-0 max-h-full border-t animate-in slide-in-from-bottom duration-300',
            side === 'left' && 'inset-y-0 left-0 h-full w-3/4 border-r max-w-sm animate-in slide-in-from-left duration-300',
            side === 'right' && 'inset-y-0 right-0 h-full w-3/4 border-l max-w-sm animate-in slide-in-from-right duration-300',
            className
          )}
          {...props}
        >
          {children}
          <button
            onClick={() => setOpen(false)}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </div>
      </>
    )
  }
)
SheetContent.displayName = 'SheetContent'

const SheetHeader = forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5 text-center sm:text-left mb-4', className)}
      {...props}
    />
  )
})
SheetHeader.displayName = 'SheetHeader'

const SheetFooter = forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-4', className)}
      {...props}
    />
  )
})
SheetFooter.displayName = 'SheetFooter'

const SheetTitle = forwardRef(({ className, ...props }, ref) => {
  return (
    <h2
      ref={ref}
      className={cn('text-lg font-semibold leading-none tracking-tight', className)}
      {...props}
    />
  )
})
SheetTitle.displayName = 'SheetTitle'

const SheetDescription = forwardRef(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  )
})
SheetDescription.displayName = 'SheetDescription'

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
