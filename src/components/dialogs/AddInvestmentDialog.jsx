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

export function AddInvestmentDialog({ open, onOpenChange, onSubmit, accounts = [], defaults = null }) {
  const [type, setType] = useState('stock')
  const [name, setName] = useState('')
  const [ticker, setTicker] = useState('')
  const [app, setApp] = useState('')
  const [account, setAccount] = useState('')
  const [units, setUnits] = useState('')
  const [buyPrice, setBuyPrice] = useState('')
  const [buyDate, setBuyDate] = useState('')
  const [error, setError] = useState('')
  const [prevDefaults, setPrevDefaults] = useState(null)

  if (defaults !== prevDefaults) {
    setPrevDefaults(defaults)
    setType(defaults ? defaults.type || 'stock' : 'stock')
    setName(defaults ? defaults.name || '' : '')
    setTicker(defaults ? defaults.ticker || '' : '')
    setApp(defaults ? defaults.app || '' : '')
    setAccount(
      defaults && defaults.account_type && defaults.account_id
        ? `${defaults.account_type}:${defaults.account_id}`
        : ''
    )
  }

  const reset = () => {
    setType(defaults ? defaults.type || 'stock' : 'stock')
    setName(defaults ? defaults.name || '' : '')
    setTicker(defaults ? defaults.ticker || '' : '')
    setApp(defaults ? defaults.app || '' : '')
    setAccount(
      defaults && defaults.account_type && defaults.account_id
        ? `${defaults.account_type}:${defaults.account_id}`
        : ''
    )
    setUnits('')
    setBuyPrice('')
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
    if (!account) {
      setError('Please select a source wallet, card, or cash')
      return
    }
    setError('')
    const [accountType, accountId] = account.split(':')
    onSubmit({
      type,
      name: name.trim(),
      ticker: ticker.trim().toUpperCase(),
      app: app.trim(),
      account_type: accountType,
      account_id: accountId,
      units: parseFloat(units),
      buy_price: parseFloat(buyPrice),
      date: buyDate || undefined,
    })
    reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{defaults ? `Add lot to ${defaults.name}` : 'Add investment'}</DialogTitle>
          <DialogDescription>
            {defaults
              ? 'Record a new purchase for this asset. It creates a matching expense in transactions.'
              : 'Add a new investment. It creates a matching expense in transactions.'}
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
            Purchase details
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
          <p className="rounded-md border border-border bg-muted/50 p-3 text-xs text-muted-foreground">
            Current prices are fetched automatically for stock tickers between 17:00 and 23:59.
          </p>
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