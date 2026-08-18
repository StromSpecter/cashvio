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
import { INVESTMENT_TYPES, GOLD_SOURCES } from '../../lib/investments'

const formatRp = (n) => `Rp${Number(n || 0).toLocaleString('id-ID')}`

const NO_SOURCE = '__none__'
const NO_GOLD_SOURCE = '__none__'

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
  const [type, setType] = useState(defaults ? defaults.type || 'stock' : 'stock')
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

  const isGold = type === 'gold'

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Asset name is required')
      return
    }
    if (isGold && !app) {
      setError('Price source is required')
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
    setError('')
    const [accountType, accountId] = account ? account.split(':') : [null, null]
    onSubmit({
      type,
      name: name.trim(),
      ticker: isGold ? '' : ticker.trim().toUpperCase(),
      app: isGold ? app : app.trim(),
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
      <DialogContent className="flex max-h-[92dvh] flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle>{defaults ? `Add lot to ${defaults.name}` : 'Add investment'}</DialogTitle>
          <DialogDescription>
            {defaults
              ? 'Record a new purchase for this asset. It creates a matching expense in transactions.'
              : 'Add a new investment. Add a source account to also record the matching expense in transactions.'}
          </DialogDescription>
        </DialogHeader>
        <form className="flex min-h-0 flex-1 flex-col overflow-hidden" onSubmit={handleSubmit}>
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-1">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                  placeholder={isGold ? 'e.g. LM Antam 1 gr' : 'e.g. Bank Central Asia'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
          {isGold ? (
            <div className="space-y-2">
              <Label htmlFor="add-inv-gold-source">Price source</Label>
              <Select
                value={app}
                onValueChange={(v) => setApp(v === NO_GOLD_SOURCE ? '' : v)}
              >
                <SelectTrigger id="add-inv-gold-source">
                  <SelectValue placeholder="Choose a price source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NO_GOLD_SOURCE}>No source</SelectItem>
                  {GOLD_SOURCES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Current price is fetched from the logam mulia API using this source.
              </p>
            </div>
          ) : (
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
          )}
          <div className="space-y-2">
            <Label htmlFor="add-inv-account">Source wallet/card/cash (optional)</Label>
            <Select
              value={account}
              onValueChange={(v) => setAccount(v === NO_SOURCE ? '' : v)}
            >
              <SelectTrigger id="add-inv-account">
                <SelectValue placeholder="No source — historical only" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NO_SOURCE}>No source — historical only</SelectItem>
                {accounts.map((a) => (
                  <SelectItem key={a.key} value={a.key} disabled={a.balance <= 0}>
                    <AccountOption account={a} />
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Choose a source to reduce its balance and record the purchase as an expense.
              Skip it for investments you already own.
            </p>
          </div>

          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Purchase details
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="add-inv-units">{isGold ? 'Grams (gr)' : 'Units'}</Label>
              <Input
                id="add-inv-units"
                placeholder={isGold ? 'e.g. 2.5' : 'e.g. 100'}
                type="number"
                min="0"
                step="any"
                value={units}
                onChange={(e) => setUnits(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-inv-buy-price">{isGold ? 'Buy price per gram' : 'Buy price'}</Label>
              <Input
                id="add-inv-buy-price"
                placeholder={isGold ? 'e.g. 1066000' : 'e.g. 9800'}
                type="number"
                min="0"
                step="any"
                value={buyPrice}
                onChange={(e) => setBuyPrice(e.target.value)}
                required
              />
            </div>
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
            Gold prices are fetched live from the chosen source.
          </p>
          </div>
          <DialogFooter className="shrink-0 flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-end">
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              <Plus className="size-4" /> Add Investment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}