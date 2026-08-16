import { Layers } from 'lucide-react'
import { Button } from '../ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog'
import { formatUnits, formatPrice, formatDate } from '../../lib/investments'

export function DeleteLotDialog({ investment, lot, open, onOpenChange, onConfirm }) {
  if (!investment || !lot) return null

  const handleConfirm = () => {
    onConfirm(investment.id, lot.id)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Delete purchase lot</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this purchase? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-3 rounded-lg border border-border p-4">
          <div className="rounded-lg bg-accent p-2">
            <Layers className="size-5 text-muted-foreground" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{investment.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {formatDate(lot.buy_date)} · {formatUnits(lot.units)} units @ {formatPrice(lot.buy_price)}
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={handleConfirm}>
            Delete Lot
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}