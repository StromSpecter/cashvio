import { ArrowLeftRight } from 'lucide-react'
import { Button } from '../ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog'

export function DeleteTransferDialog({ transfer, open, onOpenChange, onConfirm }) {
  const formatRp = (n) => `Rp${Number(n || 0).toLocaleString('id-ID')}`
  const formatDate = (value) => {
    if (!value) return ''
    return new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }
  const handleConfirm = () => {
    onConfirm(transfer.id)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Delete transfer</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this transfer? Balances will be restored to how they were before.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-3 rounded-lg border border-border p-4">
          <div className="rounded-lg bg-accent p-2">
            <ArrowLeftRight className="size-5 text-muted-foreground" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">
              {transfer ? `${formatRp(transfer.amount)} · ${formatDate(transfer.date)}` : ''}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {transfer ? transfer.note || 'No note' : ''}
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={handleConfirm}>
            Delete Transfer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}