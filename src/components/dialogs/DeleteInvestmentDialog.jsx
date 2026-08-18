import { Button } from '../ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog'
import { typeMeta, formatUnits, formatPrice } from '../../lib/investments'

export function DeleteInvestmentDialog({ investment, open, onOpenChange, onConfirm }) {
  const handleConfirm = () => {
    onConfirm(investment)
    onOpenChange(false)
  }

  const isGroup = investment && Array.isArray(investment.purchases)
  const meta = investment ? typeMeta[investment.type] || typeMeta.stock : typeMeta.stock
  const Icon = meta.icon
  if (!investment) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isGroup ? 'Delete all purchases' : 'Delete investment'}</DialogTitle>
          <DialogDescription>
            {isGroup
              ? `Are you sure you want to delete all ${investment.purchases.length} purchases of this asset? This action cannot be undone.`
              : 'Are you sure you want to delete this investment? This action cannot be undone.'}
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-3 rounded-lg border border-border p-4">
          <div className="rounded-lg bg-accent p-2">
            <Icon className="size-5 text-muted-foreground" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{investment.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {meta.label} ·{' '}
              {isGroup
                ? `${investment.purchases.length} purchase lots`
                : `${formatUnits(investment.units)} @ ${formatPrice(investment.buy_price)}`}
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={handleConfirm}>
            {isGroup ? 'Delete All' : 'Delete Investment'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}