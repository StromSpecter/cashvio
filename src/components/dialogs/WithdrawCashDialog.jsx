import { useState, useMemo } from 'react'
import { Banknote } from 'lucide-react'
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

const formatRp = (n) => `Rp${Number(n).toLocaleString('id-ID')}`

export function WithdrawCashDialog({
  open,
  onOpenChange,
  onSubmit,
  wallets = [],
  cards = [],
}) {
  const [from, setFrom] = useState('')
  const [amount, setAmount] = useState('')
  const [fee, setFee] = useState('0')
  const [note, setNote] = useState('')
  const [date, setDate] = useState('')
  const [error, setError] = useState('')

  const accounts = useMemo(() => {
    const ws = wallets.map((w) => ({
      key: `wallet:${w.id}`,
      label: w.name,
      masked: w.masked || '',
      balance: w.balance_idr,
    }))
    const cs = cards.map((c) => ({
      key: `card:${c.id}`,
      label: c.bank || c.name,
      masked: c.masked || '',
      balance: c.balance_idr,
    }))
    return [...ws, ...cs]
  }, [wallets, cards])

  const fromAccount = accounts.find((a) => a.key === from)

  const reset = () => {
    setFrom('')
    setAmount('')
    setFee('0')
    setNote('')
    setDate('')
    setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const amountNum = parseFloat(amount)
    const feeNum = parseFloat(fee) || 0
    if (!from) {
      setError('Please select the account to withdraw from')
      return
    }
    if (!(amountNum > 0)) {
      setError('Amount must be greater than 0')
      return
    }
    if (feeNum < 0) {
      setError('Fee cannot be negative')
      return
    }
    if (feeNum >= amountNum) {
      setError('Fee must be less than withdrawal amount')
      return
    }
    if (fromAccount && amountNum + feeNum > fromAccount.balance) {
      setError('Insufficient balance in source account')
      return
    }
    setError('')
    const [fromType, fromId] = from.split(':')
    onSubmit({
      from_type: fromType,
      from_id: fromId,
      amount: amountNum,
      fee: feeNum,
      note: note.trim() || undefined,
      date: date || undefined,
    })
    reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Withdraw cash</DialogTitle>
          <DialogDescription>
            Take cash out of one of your accounts and add it to your cash balance.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="wc-from">From account</Label>
            <Select value={from} onValueChange={setFrom}>
              <SelectTrigger id="wc-from">
                <SelectValue placeholder="Select account" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((a) => (
                  <SelectItem key={a.key} value={a.key} disabled={a.balance <= 0}>
                    <div className="flex w-full items-center justify-between gap-2">
                      <span className="truncate">
                        {a.label}
                        <span className="text-xs text-muted-foreground"> · {formatRp(a.balance)}</span>
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fromAccount && (
              <p className="text-xs text-muted-foreground">
                Balance: {formatRp(fromAccount.balance)}
                {fromAccount.masked ? ` · ${fromAccount.masked}` : ''}
              </p>
            )}
          </div>
          {accounts.length > 0 ? (
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex-1 space-y-2">
                <Label htmlFor="wc-amount">Amount</Label>
                <Input
                  id="wc-amount"
                  placeholder="e.g. 100000"
                  type="number"
                  min="0"
                  step="any"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
              <div className="flex-1 space-y-2">
                <Label htmlFor="wc-fee">Admin fee</Label>
                <Input
                  id="wc-fee"
                  placeholder="0"
                  type="number"
                  min="0"
                  step="any"
                  value={fee}
                  onChange={(e) => setFee(e.target.value)}
                />
              </div>
            </div>
          ) : (
            <p className="rounded-md border border-border bg-muted/50 p-3 text-sm text-muted-foreground">
              No wallets or cards yet. Add one before withdrawing cash.
            </p>
          )}
          <div className="space-y-2">
            <Label htmlFor="wc-note">Note</Label>
            <Input
              id="wc-note"
              placeholder="e.g. ATM withdrawal"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="wc-date">Date</Label>
            <DatePicker id="wc-date" value={date} onChange={setDate} placeholder="Pick a date" />
          </div>
          <DialogFooter className="flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-end">
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={accounts.length === 0}>
              <Banknote className="size-4" /> Withdraw Cash
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
