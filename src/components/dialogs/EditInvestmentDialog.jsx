import { useState } from 'react'
import { Pencil } from 'lucide-react'
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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../ui/select'
import { INVESTMENT_TYPES } from '../../lib/investments'

export function EditInvestmentDialog({ investment, open, onOpenChange, onSubmit }) {
  const [type, setType] = useState('stock')
  const [name, setName] = useState('')
  const [ticker, setTicker] = useState('')
  const [currentPrice, setCurrentPrice] = useState('')
  const [error, setError] = useState('')
  const [prevInvestment, setPrevInvestment] = useState(null)

  if (investment !== prevInvestment) {
    setPrevInvestment(investment)
    setType(investment ? investment.type || 'stock' : 'stock')
    setName(investment ? investment.name || '' : '')
    setTicker(investment ? investment.ticker || '' : '')
    setCurrentPrice(investment ? String(investment.current_price ?? '') : '')
    setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Asset name is required')
      return
    }
    if (!(parseFloat(currentPrice) > 0)) {
      setError('Current price must be greater than 0')
      return
    }
    setError('')
    onSubmit(investment.id, {
      type,
      name: name.trim(),
      ticker: ticker.trim().toUpperCase() || '—',
      current_price: parseFloat(currentPrice),
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit investment</DialogTitle>
          <DialogDescription>
            Update the asset details. Purchase lots stay untouched.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="edit-inv-type">Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger id="edit-inv-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {INVESTMENT_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-inv-name">Asset name</Label>
            <Input
              id="edit-inv-name"
              placeholder="e.g. Bank Central Asia"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-inv-ticker">Ticker / code</Label>
            <Input
              id="edit-inv-ticker"
              placeholder="e.g. BBCA"
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-inv-current-price">Current price</Label>
            <Input
              id="edit-inv-current-price"
              placeholder="e.g. 10250"
              type="number"
              min="0"
              step="any"
              value={currentPrice}
              onChange={(e) => setCurrentPrice(e.target.value)}
              required
            />
          </div>
          <DialogFooter className="flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-end">
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              <Pencil className="size-4" /> Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}