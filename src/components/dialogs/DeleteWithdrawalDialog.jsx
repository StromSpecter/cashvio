import { Banknote } from 'lucide-react'
import { Button } from '../ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog'

export function DeleteWithdrawalDialog({ withdrawal, open, onOpenChange, onConfirm }) {
  const formatRp = (n) => `Rp${Number(n || 0).toLocaleString('id-ID')}`
  const formatDate = (value) => {
    if (!value) return ''
    return new Date(value).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }
  const handleConfirm = () => {
    onConfirm(withdrawal.id)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Delete withdrawal</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this cash withdrawal? Balances will be restored to how they were before.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-3 rounded-lg border border-border p-4">
          <div className="rounded-lg bg-accent p-2">
            <Banknote className="size-5 text-muted-foreground" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">
              {withdrawal ? `${formatRp(withdrawal.amount)} · ${formatDate(withdrawal.date)}` : ''}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {withdrawal ? withdrawal.note || 'No note' : ''}
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={handleConfirm}>
            Delete Withdrawal
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
