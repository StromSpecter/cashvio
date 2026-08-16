import { TrendingUp } from 'lucide-react'
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
    onConfirm(investment.id)
    onOpenChange(false)
  }

  const meta = investment ? typeMeta[investment.type] : null
  if (!investment) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Delete investment</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this asset? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-3 rounded-lg border border-border p-4">
          <div className="rounded-lg bg-accent p-2">
            <TrendingUp className="size-5 text-muted-foreground" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{investment.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {meta ? meta.label : ''} · {formatUnits(investment.units)} @ {formatPrice(investment.buy_price)}
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={handleConfirm}>
            Delete Investment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}