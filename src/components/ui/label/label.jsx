import { forwardRef } from 'react'
import { Label as RadixLabel } from '@radix-ui/react-label'
import { cn } from '../../../lib/utils.js'

const Label = forwardRef(({ className, ...props }, ref) => {
  return (
    <RadixLabel
      className={cn('text-sm font-medium text-foreground', className)}
      ref={ref}
      {...props}
    />
  )
})
Label.displayName = 'Label'

export { Label }
