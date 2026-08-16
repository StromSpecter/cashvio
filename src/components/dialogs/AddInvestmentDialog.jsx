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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../ui/select'
import { DatePicker } from '../ui/datepicker'
import { INVESTMENT_TYPES } from '../../lib/investments'

const formatRp = (n) => `Rp${Number(n || 0).toLocaleString('id-ID')}`

function AccountOption({ account }) {
  return (
    <div className="flex w-full items-center justify-between gap-2">
      <span className="truncate text-sm font-medium">
        {account.label}
        <span className="text-xs font-normal text-muted-foreground"> · {formatRp(account.balance)}</span>
      </span>
    </div>
  )
}

export function AddInvestmentDialog({ open, onOpenChange, onSubmit, accounts = [] }) {
  const [type, setType] = useState('stock')
  const [name, setName] = useState('')
  const [ticker, setTicker] = useState('')
  const [app, setApp] = useState('')
  const [account, setAccount] = useState('')
  const [units, setUnits] = useState('')
  const [buyPrice, setBuyPrice] = useState('')
  const [currentPrice, setCurrentPrice] = useState('')
  const [buyDate, setBuyDate] = useState('')
  const [error, setError] = useState('')

  const reset = () => {
    setType('stock')
    setName('')
    setTicker('')
    setApp('')
    setAccount('')
    setUnits('')
    setBuyPrice('')
    setCurrentPrice('')
    setBuyDate('')
    setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Asset name is required')
      return
    }
    if (!(parseFloat(units) > 0)) {
      setError('Units must be greater than 0')
      return
    }
    if (!(parseFloat(buyPrice) > 0)) {
      setError('Buy price must be greater than 0')
      return
    }
    if (!(parseFloat(currentPrice) > 0)) {
      setError('Current price must be greater than 0')
      return
    }
    if (!account) {
      setError('Please select a source wallet, card, or cash')
      return
    }
    setError('')
    const [accountType, accountId] = account.split(':')
    onSubmit({
      type,
      name: name.trim(),
      ticker: ticker.trim().toUpperCase() || '—',
      app: app.trim(),
      account_type: accountType,
      account_id: accountId,
      current_price: parseFloat(currentPrice),
      lot: {
        units: parseFloat(units),
        buy_price: parseFloat(buyPrice),
        buy_date: buyDate || undefined,
      },
    })
    reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add investment</DialogTitle>
          <DialogDescription>
            Add a new asset with its first purchase lot.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="add-inv-type">Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger id="add-inv-type">
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
            <Label htmlFor="add-inv-name">Asset name</Label>
            <Input
              id="add-inv-name"
              placeholder="e.g. Bank Central Asia"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="add-inv-ticker">Ticker / code</Label>
              <Input
                id="add-inv-ticker"
                placeholder="e.g. BBCA"
                value={ticker}
                onChange={(e) => setTicker(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-inv-app">Investment app</Label>
              <Input
                id="add-inv-app"
                placeholder="e.g. GoTrade, Ajaib, Bibit"
                value={app}
                onChange={(e) => setApp(e.target.value)}
              />
            </div>
          </div>
          {accounts.length > 0 ? (
            <div className="space-y-2">
              <Label htmlFor="add-inv-account">Source wallet/card/cash</Label>
              <Select value={account} onValueChange={setAccount}>
                <SelectTrigger id="add-inv-account">
                  <SelectValue placeholder="Select source account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((a) => (
                    <SelectItem key={a.key} value={a.key} disabled={a.balance <= 0}>
                      <AccountOption account={a} />
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <p className="rounded-md border border-border bg-muted/50 p-3 text-sm text-muted-foreground">
              No accounts yet. Add a wallet, card, or cash before adding an investment.
            </p>
          )}

          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Purchase lot
          </p>
          <div className="space-y-2">
            <Label htmlFor="add-inv-units">Units</Label>
            <Input
              id="add-inv-units"
              placeholder="e.g. 100"
              type="number"
              min="0"
              step="any"
              value={units}
              onChange={(e) => setUnits(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="add-inv-buy-price">Buy price</Label>
            <Input
              id="add-inv-buy-price"
              placeholder="e.g. 9800"
              type="number"
              min="0"
              step="any"
              value={buyPrice}
              onChange={(e) => setBuyPrice(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="add-inv-date">Buy date</Label>
            <DatePicker
              id="add-inv-date"
              value={buyDate}
              onChange={setBuyDate}
              placeholder="Pick a date"
            />
          </div>

          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Current price
          </p>
          <div className="space-y-2">
            <Label htmlFor="add-inv-current-price">Current price</Label>
            <Input
              id="add-inv-current-price"
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
            <Button type="submit" disabled={accounts.length === 0}>
              <Plus className="size-4" /> Add Investment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}