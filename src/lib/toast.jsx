import { Toaster as SonnerToaster } from 'sonner'

// Themed toaster container — mount once at the root (e.g. <App />).
export function Toaster() {
  return (
    <SonnerToaster
      richColors
      closeButton
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
          success:
            'group-[.toaster]:bg-emerald-500/10 group-[.toaster]:text-emerald-600 group-[.toaster]:border-emerald-500/50',
          error:
            'group-[.toaster]:bg-destructive/10 group-[.toaster]:text-destructive group-[.toaster]:border-destructive/50',
        },
      }}
    />
  )
}
