import { useState } from 'react'
import { Pencil, ShoppingCart, Briefcase, Laptop, Gift, BadgeDollarSign, UtensilsCrossed, Car, Home, Clapperboard, HeartPulse, GraduationCap } from 'lucide-react'
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

const categoryOptions = [
  { value: 'salary', label: 'Salary', icon: Briefcase },
  { value: 'freelance', label: 'Freelance', icon: Laptop },
  { value: 'gift', label: 'Gift', icon: Gift },
  { value: 'bonus', label: 'Bonus', icon: BadgeDollarSign },
  { value: 'food', label: 'Food & Drinks', icon: UtensilsCrossed },
  { value: 'transportation', label: 'Transportation', icon: Car },
  { value: 'housing', label: 'Housing', icon: Home },
  { value: 'shopping', label: 'Shopping', icon: ShoppingCart },
  { value: 'entertainment', label: 'Entertainment', icon: Clapperboard },
  { value: 'health', label: 'Health', icon: HeartPulse },
  { value: 'education', label: 'Education', icon: GraduationCap },
]

const statusOptions = ['completed', 'pending', 'failed']

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

export function EditTransactionDialog({ transaction, open, onOpenChange, onSubmit, wallets = [], cards = [], cash }) {
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [type, setType] = useState('expense')
  const [category, setCategory] = useState('shopping')
  const [date, setDate] = useState('')
  const [status, setStatus] = useState('completed')
  const [account, setAccount] = useState('')
  const [error, setError] = useState('')
  const [prevTx, setPrevTx] = useState(null)

  if (transaction !== prevTx) {
    setPrevTx(transaction)
    setName(transaction?.name || '')
    setAmount(transaction ? String(Math.abs(transaction.amount)) : '')
    setType(transaction?.type || 'expense')
    setCategory(transaction?.category || 'shopping')
    setDate(transaction?.date ? transaction.date.slice(0, 10) : '')
    setStatus(transaction?.status || 'completed')
    setAccount(transaction ? `${transaction.account_type}:${transaction.account_id}` : '')
    setError('')
  }

  const accounts = [
    ...wallets.map((w) => ({ key: `wallet:${w.id}`, label: w.name, balance: w.balance })),
    ...cards.map((c) => ({ key: `card:${c.id}`, label: c.name, balance: c.balance })),
    ...(cash ? [{ key: `cash:${cash.id}`, label: 'Cash', balance: cash.balance_idr }] : []),
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!transaction) return
    if (!name.trim()) {
      setError('Name is required')
      return
    }
    if (!(parseFloat(amount) > 0)) {
      setError('Amount must be greater than 0')
      return
    }
    if (!account) {
      setError('Please select a wallet, card, or cash')
      return
    }
    setError('')
    const [accountType, accountId] = account.split(':')
    onSubmit({
      id: transaction.id,
      name: name.trim(),
      amount: Math.abs(parseFloat(amount)),
      type,
      category,
      status,
      account_type: accountType,
      account_id: accountId,
      date: date || undefined,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit transaction</DialogTitle>
          <DialogDescription>
            Update the transaction details.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="edit-tx-name">Transaction name</Label>
            <Input
              id="edit-tx-name"
              placeholder="e.g. Grocery store"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-tx-amount">Amount</Label>
            <Input
              id="edit-tx-amount"
              placeholder="e.g. 50000"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-tx-type">Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger id="edit-tx-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="expense">Expense</SelectItem>
                <SelectItem value="income">Income</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {accounts.length > 0 ? (
            <div className="space-y-2">
              <Label htmlFor="edit-tx-wallet">
                {type === 'income' ? 'Destination' : 'Source'} wallet/card/cash
              </Label>
              <Select value={account} onValueChange={setAccount}>
                <SelectTrigger id="edit-tx-wallet">
                  <SelectValue placeholder="Select wallet, card, or cash" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((a) => (
                    <SelectItem key={a.key} value={a.key} disabled={type === 'expense' && a.balance <= 0 && a.key !== account}>
                      <AccountOption account={a} />
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <p className="rounded-md border border-border bg-muted/50 p-3 text-sm text-muted-foreground">
              No accounts yet. Add a wallet, card, or cash before recording a transaction.
            </p>
          )}
          <div className="space-y-2">
            <Label htmlFor="edit-tx-category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="edit-tx-category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-tx-date">Date</Label>
            <DatePicker
              id="edit-tx-date"
              value={date}
              onChange={setDate}
              placeholder="Pick a date"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-tx-status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="edit-tx-status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-end">
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={accounts.length === 0}>
              <Pencil className="size-4" /> Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}