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

export function EditInvestmentDialog({ investment, open, onOpenChange, onSubmit, accounts = [] }) {
  const [type, setType] = useState('stock')
  const [name, setName] = useState('')
  const [ticker, setTicker] = useState('')
  const [app, setApp] = useState('')
  const [account, setAccount] = useState('')
  const [units, setUnits] = useState('')
  const [buyPrice, setBuyPrice] = useState('')
  const [buyDate, setBuyDate] = useState('')
  const [error, setError] = useState('')
  const [prevInvestment, setPrevInvestment] = useState(null)

  if (investment !== prevInvestment) {
    setPrevInvestment(investment)
    setType(investment ? investment.type || 'stock' : 'stock')
    setName(investment ? investment.name || '' : '')
    setTicker(investment ? investment.ticker || '' : '')
    setApp(investment ? investment.app || '' : '')
    setAccount(
      investment && investment.account_type && investment.account_id
        ? `${investment.account_type}:${investment.account_id}`
        : ''
    )
    setUnits(investment ? String(investment.units ?? '') : '')
    setBuyPrice(investment ? String(investment.buy_price ?? '') : '')
    setBuyDate(investment ? investment.date || '' : '')
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
    const [accountType, accountId] = account ? account.split(':') : ['', null]
    onSubmit(investment.id, {
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
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[92dvh] flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle>Edit investment</DialogTitle>
          <DialogDescription>
            Update the investment and its matching transaction.
          </DialogDescription>
        </DialogHeader>
        <form className="flex min-h-0 flex-1 flex-col overflow-hidden" onSubmit={handleSubmit}>
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-1">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                  placeholder={isGold ? 'e.g. LM Antam 1 gr' : 'e.g. Bank Central Asia'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
          {isGold ? (
            <div className="space-y-2">
              <Label htmlFor="edit-inv-gold-source">Price source</Label>
              <Select
                value={app}
                onValueChange={(v) => setApp(v === NO_GOLD_SOURCE ? '' : v)}
              >
                <SelectTrigger id="edit-inv-gold-source">
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
                <Label htmlFor="edit-inv-ticker">Ticker / code</Label>
                <Input
                  id="edit-inv-ticker"
                  placeholder="e.g. BBCA"
                  value={ticker}
                  onChange={(e) => setTicker(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-inv-app">Investment app</Label>
                <Input
                  id="edit-inv-app"
                  placeholder="e.g. GoTrade, Ajaib, Bibit"
                  value={app}
                  onChange={(e) => setApp(e.target.value)}
                />
              </div>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="edit-inv-account">Source wallet/card/cash (optional)</Label>
            <Select
              value={account}
              onValueChange={(v) => setAccount(v === NO_SOURCE ? '' : v)}
            >
              <SelectTrigger id="edit-inv-account">
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
              Skip the source for investments already owned. Removing a source also removes its linked expense.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="edit-inv-units">{isGold ? 'Grams (gr)' : 'Units'}</Label>
              <Input
                id="edit-inv-units"
                type="number"
                min="0"
                step="any"
                value={units}
                onChange={(e) => setUnits(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-inv-buy-price">{isGold ? 'Buy price per gram' : 'Buy price'}</Label>
              <Input
                id="edit-inv-buy-price"
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
            <Label htmlFor="edit-inv-date">Date</Label>
            <DatePicker
              id="edit-inv-date"
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
              <Pencil className="size-4" /> Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}