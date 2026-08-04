import { useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog'

export function SetBudgetDialog({ open, onOpenChange, onSubmit, initialValue, mode = 'set' }) {
  const [amount, setAmount] = useState(initialValue ? String(initialValue) : '')
  const [note, setNote] = useState('')

  const isEdit = mode === 'edit'
  const handleSubmit = (e) => {
    e.preventDefault()
    const value = parseFloat(amount.replace(/\./g, ''))
    if (!value || Number.isNaN(value)) return
    onSubmit({ amount: value, note: note.trim() })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Monthly Target' : 'Set Monthly Target'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update your monthly income target for the 50/30/20 split.' : 'Set your monthly income to calculate the needs, wants, and investment split automatically.'}
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="budget-amount">Target Income (Rp)</Label>
            <Input
              id="budget-amount"
              placeholder="e.g. 8420000"
              type="number"
              min={0}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="budget-note">Note (optional)</Label>
            <Input
              id="budget-note"
              placeholder="e.g. Monthly salary"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{isEdit ? 'Save changes' : 'Save target'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
