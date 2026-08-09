import { useState } from 'react'
import { Plus, ArrowDownToLine, ArrowLeftRight, Store, ShoppingCart, Briefcase, Repeat, Globe } from 'lucide-react'
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
  { value: 'income', label: 'Income', icon: ArrowDownToLine },
  { value: 'salary', label: 'Salary', icon: Briefcase },
  { value: 'shopping', label: 'Shopping', icon: ShoppingCart },
  { value: 'groceries', label: 'Groceries', icon: Store },
  { value: 'subscription', label: 'Subscription', icon: Repeat },
  { value: 'travel', label: 'Travel', icon: Globe },
  { value: 'transfer', label: 'Transfer', icon: ArrowLeftRight },
]

const statusOptions = ['completed', 'pending', 'failed']

const formatRp = (n) => `Rp${Number(n || 0).toLocaleString('id-ID')}`

function AccountOption({ label, balance }) {
  return (
    <div className="flex w-full flex-col leading-tight">
      <span className="text-sm font-medium">{label}</span>
      <span className="text-xs text-muted-foreground">Saldo {formatRp(balance)}</span>
    </div>
  )
}

export function AddTransactionDialog({ open, onOpenChange, onSubmit, wallets = [], cards = [] }) {
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [type, setType] = useState('expense')
  const [category, setCategory] = useState('shopping')
  const [date, setDate] = useState('')
  const [status, setStatus] = useState('completed')
  const [account, setAccount] = useState('')
  const [error, setError] = useState('')

  const accounts = [
    ...wallets.map((w) => ({ key: `wallet:${w.id}`, label: w.name, balance: w.balance })),
    ...cards.map((c) => ({ key: `card:${c.id}`, label: c.name, balance: c.balance })),
  ]

  const reset = () => {
    setName('')
    setAmount('')
    setType('expense')
    setCategory('shopping')
    setDate('')
    setStatus('completed')
    setAccount('')
    setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Name is required')
      return
    }
    if (!(parseFloat(amount) > 0)) {
      setError('Amount must be greater than 0')
      return
    }
    if (!account) {
      setError('Please select a wallet or card')
      return
    }
    setError('')
    const [accountType, accountId] = account.split(':')
    onSubmit({
      name: name.trim(),
      amount: Math.abs(parseFloat(amount)),
      type,
      category,
      status,
      account_type: accountType,
      account_id: accountId,
      date: date || undefined,
    })
    reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add transaction</DialogTitle>
          <DialogDescription>
            Record a new income or expense transaction.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="add-tx-name">Transaction name</Label>
            <Input
              id="add-tx-name"
              placeholder="e.g. Grocery store"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="add-tx-amount">Amount</Label>
            <Input
              id="add-tx-amount"
              placeholder="e.g. 50000"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="add-tx-type">Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger id="add-tx-type">
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
              <Label htmlFor="add-tx-wallet">
                {type === 'income' ? 'Destination' : 'Source'} wallet/card
              </Label>
              <Select value={account} onValueChange={setAccount}>
                <SelectTrigger id="add-tx-wallet">
                  <SelectValue placeholder="Select wallet or card" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((a) => (
                    <SelectItem key={a.key} value={a.key}>
                      <AccountOption account={a} />
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <p className="rounded-md border border-border bg-muted/50 p-3 text-sm text-muted-foreground">
              No wallets or cards yet. Add one before recording a transaction.
            </p>
          )}
          <div className="space-y-2">
            <Label htmlFor="add-tx-category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="add-tx-category">
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
            <Label htmlFor="add-tx-date">Date</Label>
            <DatePicker
              id="add-tx-date"
              value={date}
              onChange={setDate}
              placeholder="Pick a date"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="add-tx-status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="add-tx-status">
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
              <Plus className="size-4" /> Add Transaction
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}