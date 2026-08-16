import { useState } from 'react'
import { Plus } from 'lucide-react'
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
import { DatePicker } from '../ui/datepicker'

export function AddLotDialog({ investment, open, onOpenChange, onSubmit }) {
  const [units, setUnits] = useState('')
  const [buyPrice, setBuyPrice] = useState('')
  const [buyDate, setBuyDate] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!(parseFloat(units) > 0)) {
      setError('Units must be greater than 0')
      return
    }
    if (!(parseFloat(buyPrice) > 0)) {
      setError('Buy price must be greater than 0')
      return
    }
    setError('')
    onSubmit(investment.id, {
      units: parseFloat(units),
      buy_price: parseFloat(buyPrice),
      buy_date: buyDate || undefined,
    })
    setUnits('')
    setBuyPrice('')
    setBuyDate('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add purchase lot</DialogTitle>
          <DialogDescription>
            Record another purchase of {investment.name} at a different price.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="add-lot-units">Units</Label>
            <Input
              id="add-lot-units"
              placeholder="e.g. 50"
              type="number"
              min="0"
              step="any"
              value={units}
              onChange={(e) => setUnits(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="add-lot-buy-price">Buy price</Label>
            <Input
              id="add-lot-buy-price"
              placeholder="e.g. 10500"
              type="number"
              min="0"
              step="any"
              value={buyPrice}
              onChange={(e) => setBuyPrice(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="add-lot-date">Buy date</Label>
            <DatePicker
              id="add-lot-date"
              value={buyDate}
              onChange={setBuyDate}
              placeholder="Pick a date"
            />
          </div>
          <DialogFooter className="flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-end">
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              <Plus className="size-4" /> Add Lot
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}