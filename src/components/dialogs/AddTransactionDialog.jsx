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

export function AddTransactionDialog({ open, onOpenChange, onSubmit, wallets = [], cards = [] }) {
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [type, setType] = useState('expense')
  const [category, setCategory] = useState('shopping')
  const [date, setDate] = useState('')
  const [status, setStatus] = useState('completed')
  const [wallet, setWallet] = useState('')

  const allWallets = [...wallets, ...cards]

  const reset = () => {
    setName('')
    setAmount('')
    setType('expense')
    setCategory('shopping')
    setDate('')
    setStatus('completed')
    setWallet('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim() || !amount.trim()) return
    const num = parseFloat(amount.replace(/[^\d.-]/g, ''))
    const prefix = type === 'income' ? '+' : '-'
    const formatted = `${prefix}Rp${Math.abs(num).toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
    onSubmit({
      id: Date.now(),
      name: name.trim(),
      date: date || '',
      amount: formatted,
      category,
      status,
      initials: name.trim().split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2),
      wallet: wallet || 'Main Account',
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
          {allWallets.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="add-tx-wallet">
                {type === 'income' ? 'Destination' : 'Source'} wallet/card
              </Label>
              <Select value={wallet} onValueChange={setWallet}>
                <SelectTrigger id="add-tx-wallet">
                  <SelectValue placeholder="Select wallet or card" />
                </SelectTrigger>
                <SelectContent>
                  {allWallets.map((w) => (
                    <SelectItem key={w.id} value={w.name}>
                      <div className="flex items-center justify-between w-full">
                        <span>{w.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {w.masked}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              <Plus className="size-4" /> Add Transaction
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}