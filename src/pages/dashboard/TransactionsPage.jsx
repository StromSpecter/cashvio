import { useState } from 'react'
import { Search, Download, Plus, ArrowDownToLine, ArrowLeftRight, Store, ShoppingCart, Briefcase, Repeat, Globe, MoreHorizontal, Pencil, Trash2, Wallet } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Input } from '../../components/ui/input'
import { Avatar, AvatarImage, AvatarFallback } from '../../components/ui/avatar'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../../components/ui/select'
import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownSeparator,
} from '../../components/ui/dropdown'
import { DataTable } from '../../components/ui/table'
import { AddTransactionDialog } from '../../components/dialogs/AddTransactionDialog'
import { EditTransactionDialog } from '../../components/dialogs/EditTransactionDialog'
import { DeleteTransactionDialog } from '../../components/dialogs/DeleteTransactionDialog'

const categories = {
  income: { label: 'Income', icon: ArrowDownToLine, tone: 'text-emerald-600' },
  shopping: { label: 'Shopping', icon: ShoppingCart, tone: 'text-blue-600' },
  groceries: { label: 'Groceries', icon: Store, tone: 'text-amber-600' },
  salary: { label: 'Salary', icon: Briefcase, tone: 'text-emerald-600' },
  subscription: { label: 'Subscription', icon: Repeat, tone: 'text-purple-600' },
  travel: { label: 'Travel', icon: Globe, tone: 'text-cyan-600' },
  transfer: { label: 'Transfer', icon: ArrowLeftRight, tone: 'text-zinc-600' },
}

const initialTransactions = [
  { id: 1, name: 'Acme Corp', date: 'Aug 3, 2026', amount: '+Rp2.450.000', category: 'salary', status: 'completed', initials: 'AC', wallet: 'Dana' },
  { id: 2, name: 'Netflix', date: 'Aug 2, 2026', amount: '-Rp15.990', category: 'subscription', status: 'completed', initials: 'NF', wallet: 'ShopeePay' },
  { id: 3, name: 'Starbucks', date: 'Aug 2, 2026', amount: '-Rp6.750', category: 'groceries', status: 'pending', initials: 'SB', wallet: 'GoPay' },
  { id: 4, name: 'GitHub', date: 'Aug 1, 2026', amount: '-Rp9.000', category: 'subscription', status: 'completed', initials: 'GH', wallet: 'Dana' },
  { id: 5, name: 'Acme Corp', date: 'Aug 1, 2026', amount: '+Rp2.450.000', category: 'salary', status: 'completed', initials: 'AC', wallet: 'Dana' },
  { id: 6, name: 'Uber', date: 'Jul 31, 2026', amount: '-Rp32.100', category: 'travel', status: 'failed', initials: 'UB', wallet: 'GoPay' },
  { id: 7, name: 'Transfer to Savings', date: 'Jul 30, 2026', amount: '-Rp500.000', category: 'transfer', status: 'completed', initials: 'TS', wallet: 'BCA' },
  { id: 8, name: 'Amazon', date: 'Jul 29, 2026', amount: '-Rp89.970', category: 'shopping', status: 'completed', initials: 'AM', wallet: 'ShopeePay' },
  { id: 9, name: 'Freelance Invoice', date: 'Jul 28, 2026', amount: '+Rp1.200.000', category: 'income', status: 'completed', initials: 'FI', wallet: 'Dana' },
  { id: 10, name: 'Whole Foods', date: 'Jul 27, 2026', amount: '-Rp54.320', category: 'groceries', status: 'completed', initials: 'WF', wallet: 'BNI' },
  { id: 11, name: 'Spotify', date: 'Jul 26, 2026', amount: '-Rp10.990', category: 'subscription', status: 'completed', initials: 'SP', wallet: 'ShopeePay' },
  { id: 12, name: 'Booking.com', date: 'Jul 25, 2026', amount: '-Rp240.000', category: 'travel', status: 'completed', initials: 'BC', wallet: 'BCA' },
]

const statusVariant = {
  completed: 'success',
  pending: 'warning',
  failed: 'destructive',
}

const columns = [
  {
    key: 'name',
    header: 'Transaction',
    sortable: true,
    render: (value, row) => (
      <div className="flex items-center gap-3">
        <Avatar className="size-9">
          <AvatarImage src="" alt={row.name} />
          <AvatarFallback className="text-xs">{row.initials}</AvatarFallback>
        </Avatar>
        <span className="font-medium">{value}</span>
      </div>
    ),
  },
  {
    key: 'category',
    header: 'Category',
    sortable: true,
    render: (value) => {
      const cat = categories[value]
      const Icon = cat.icon
      return (
        <div className="flex items-center gap-2">
          <Icon className={`size-4 ${cat.tone}`} />
          <span>{cat.label}</span>
        </div>
      )
    },
  },
  {
    key: 'wallet',
    header: 'Wallet/Card',
    sortable: true,
  },
  {
    key: 'date',
    header: 'Date',
    sortable: true,
  },
  {
    key: 'amount',
    header: 'Amount',
    sortable: true,
    align: 'right',
    render: (value) => (
      <span className={value.startsWith('+') ? 'text-emerald-600' : ''}>
        {value}
      </span>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    sortable: true,
    render: (value) => (
      <Badge variant={statusVariant[value]} className="capitalize">
        {value}
      </Badge>
    ),
  },
]

export function TransactionsPage() {
  const [transactions, setTransactions] = useState(initialTransactions)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [status, setStatus] = useState('all')
  const [addOpen, setAddOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selectedTx, setSelectedTx] = useState(null)

  const wallets = [
    { id: 1, name: 'Dana', number: '8890 0012 9022', masked: '•••• 9022', balanceIdr: 77800000, icon: Wallet, tone: 'bg-emerald-500/10 text-emerald-600' },
    { id: 2, name: 'ShopeePay', number: '8890 0012 9022', masked: '•••• 9022', balanceIdr: 200000000, icon: Wallet, tone: 'bg-orange-500/10 text-orange-600' },
    { id: 3, name: 'GoPay', number: '8890 0012 9022', masked: '•••• 9022', balanceIdr: 14200000, icon: Wallet, tone: 'bg-blue-500/10 text-blue-600' },
  ]
  const cards = [
    { id: 4, name: 'BCA', number: '5031 8820 3345', masked: '•••• 3345', balanceIdr: 34000000, gradient: 'from-rose-600 to-orange-500' },
    { id: 5, name: 'BNI', number: '1370 0298 4471', masked: '•••• 4471', balanceIdr: 80000000, gradient: 'from-indigo-600 to-purple-600' },
  ]

  const filtered = transactions.filter((tx) => {
    const matchesQuery = tx.name.toLowerCase().includes(query.toLowerCase())
    const matchesCategory = category === 'all' || tx.category === category
    const matchesStatus = status === 'all' || tx.status === status
    return matchesQuery && matchesCategory && matchesStatus
  })

  const handleAdd = (tx) => {
    setTransactions((prev) => [tx, ...prev])
  }

  const handleEdit = (updated) => {
    setTransactions((prev) =>
      prev.map((tx) => (tx.id === updated.id ? updated : tx))
    )
  }

  const handleDelete = (id) => {
    setTransactions((prev) => prev.filter((tx) => tx.id !== id))
  }

  const openEdit = (tx) => {
    setSelectedTx(tx)
    setEditOpen(true)
  }

  const openDelete = (tx) => {
    setSelectedTx(tx)
    setDeleteOpen(true)
  }

  const tableActions = (row) => (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="ghost" size="icon" className="ml-1" aria-label="Transaction options">
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownTrigger>
      <DropdownContent align="end">
        <DropdownItem onClick={() => openEdit(row)}>
          <Pencil className="size-4 mr-2" /> Edit
        </DropdownItem>
        <DropdownSeparator />
        <DropdownItem className="text-destructive focus:text-destructive" onClick={() => openDelete(row)}>
          <Trash2 className="size-4 mr-2" /> Delete
        </DropdownItem>
      </DropdownContent>
    </Dropdown>
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
          <p className="text-sm text-muted-foreground">
            Review and search your account activity.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="size-4" /> Export
          </Button>
          <Button onClick={() => setAddOpen(true)}>
            <Plus className="size-4" /> New Transaction
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="income">Income</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
          </TabsList>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search transactions..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-9 w-full pl-8 sm:w-56"
                aria-label="Search transactions"
              />
            </div>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="h-9 w-full sm:w-40" aria-label="Filter by category">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                <SelectItem value="salary">Salary</SelectItem>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="shopping">Shopping</SelectItem>
                <SelectItem value="groceries">Groceries</SelectItem>
                <SelectItem value="subscription">Subscriptions</SelectItem>
                <SelectItem value="travel">Travel</SelectItem>
                <SelectItem value="transfer">Transfers</SelectItem>
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="h-9 w-full sm:w-40" aria-label="Filter by status">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="all">
          <DataTable columns={columns} data={filtered} pageSize={10} showActions actions={tableActions} />
        </TabsContent>
        <TabsContent value="income">
          <DataTable columns={columns} data={filtered.filter((tx) => tx.amount.startsWith('+'))} pageSize={10} showActions actions={tableActions} />
        </TabsContent>
        <TabsContent value="expenses">
          <DataTable columns={columns} data={filtered.filter((tx) => tx.amount.startsWith('-'))} pageSize={10} showActions actions={tableActions} />
        </TabsContent>
      </Tabs>

      <AddTransactionDialog open={addOpen} onOpenChange={setAddOpen} onSubmit={handleAdd} wallets={wallets} cards={cards} />
      <EditTransactionDialog transaction={selectedTx} open={editOpen} onOpenChange={setEditOpen} onSubmit={handleEdit} wallets={wallets} cards={cards} />
      <DeleteTransactionDialog transaction={selectedTx} open={deleteOpen} onOpenChange={setDeleteOpen} onConfirm={handleDelete} />
    </div>
  )
}