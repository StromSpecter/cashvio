import { useState } from 'react'
import { Pencil, ArrowDownToLine, ArrowLeftRight, Store, ShoppingCart, Briefcase, Repeat, Globe } from 'lucide-react'
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

export function EditTransactionDialog({ transaction, open, onOpenChange, onSubmit, wallets = [], cards = [] }) {
  const [name, setName] = useState(transaction?.name || '')
  const [amount, setAmount] = useState(transaction?.amount || '')
  const [type, setType] = useState(
    transaction?.amount.startsWith('+') ? 'income' : 'expense'
  )
  const [category, setCategory] = useState(transaction?.category || 'shopping')
  const [date, setDate] = useState(transaction?.date || '')
  const [status, setStatus] = useState(transaction?.status || 'completed')
  const [wallet, setWallet] = useState(transaction?.wallet || '')

  const allWallets = [...wallets, ...cards]

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim() || !amount.trim()) return
    const num = parseFloat(amount.replace(/[^\d.-]/g, ''))
    const prefix = type === 'income' ? '+' : '-'
    const formatted = `${prefix}Rp${Math.abs(num).toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
    onSubmit({
      ...transaction,
      name: name.trim(),
      date: date || transaction.date,
      amount: formatted,
      category,
      status,
      wallet: wallet || transaction.wallet,
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
          {allWallets.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="edit-tx-wallet">
                {type === 'income' ? 'Destination' : 'Source'} wallet/card
              </Label>
              <Select value={wallet} onValueChange={setWallet}>
                <SelectTrigger id="edit-tx-wallet">
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
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
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