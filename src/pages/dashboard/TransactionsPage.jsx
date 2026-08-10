import { useEffect, useMemo, useState, useCallback, useRef } from 'react'
import { Search, Download, Plus, ArrowDownToLine, ArrowLeftRight, Store, ShoppingCart, Briefcase, Repeat, Globe, Laptop, Gift, BadgeDollarSign, UtensilsCrossed, Car, Home, Clapperboard, HeartPulse, GraduationCap, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
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
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getWallets,
  getCards,
  getCash,
} from '../../lib/api'
import { toast } from '../../lib/toast.js'

const categories = {
  salary: { label: 'Salary', icon: Briefcase, tone: 'text-emerald-600' },
  freelance: { label: 'Freelance', icon: Laptop, tone: 'text-sky-600' },
  gift: { label: 'Gift', icon: Gift, tone: 'text-pink-600' },
  bonus: { label: 'Bonus', icon: BadgeDollarSign, tone: 'text-amber-600' },
  food: { label: 'Food & Drinks', icon: UtensilsCrossed, tone: 'text-orange-600' },
  transportation: { label: 'Transportation', icon: Car, tone: 'text-cyan-600' },
  housing: { label: 'Housing', icon: Home, tone: 'text-violet-600' },
  shopping: { label: 'Shopping', icon: ShoppingCart, tone: 'text-blue-600' },
  entertainment: { label: 'Entertainment', icon: Clapperboard, tone: 'text-red-600' },
  health: { label: 'Health', icon: HeartPulse, tone: 'text-emerald-600' },
  education: { label: 'Education', icon: GraduationCap, tone: 'text-indigo-600' },
}

const categoryLegacy = {
  income: { label: 'Income', icon: ArrowDownToLine, tone: 'text-emerald-600' },
  transfer: { label: 'Transfer', icon: ArrowLeftRight, tone: 'text-zinc-600' },
  groceries: { label: 'Groceries', icon: Store, tone: 'text-amber-600' },
  subscription: { label: 'Subscription', icon: Repeat, tone: 'text-purple-600' },
  travel: { label: 'Travel', icon: Globe, tone: 'text-cyan-600' },
}

const statusVariant = {
  completed: 'success',
  pending: 'warning',
  failed: 'destructive',
}

const formatAmount = (t) => {
  const sign = t.type === 'income' ? '+' : '-'
  return `${sign}Rp${Math.abs(t.amount).toLocaleString('id-ID')}`
}

const formatDate = (value) => {
  if (!value) return ''
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const initialsOf = (name) =>
  (name || '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

export function TransactionsPage() {
  const [transactions, setTransactions] = useState([])
  const [wallets, setWallets] = useState([])
  const [cards, setCards] = useState([])
  const [cash, setCash] = useState(null)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [status, setStatus] = useState('all')
  const [addOpen, setAddOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selectedTx, setSelectedTx] = useState(null)
  const fetchedRef = useRef(false)

  const fetchAll = useCallback(async () => {
    const [wRes, cRes, tRes, cashRes] = await Promise.all([
      getWallets({ limit: 100 }),
      getCards({ limit: 100 }),
      getTransactions({ limit: 100 }),
      getCash(),
    ])
    return { wallets: wRes.data, cards: cRes.data, transactions: tRes.data, cash: cashRes.data }
  }, [])

  const applyAll = useCallback(({ wallets, cards, transactions, cash }) => {
    setWallets(
      wallets.map((w) => ({ id: w.id, name: w.name, masked: w.masked || '', type: 'wallet', balance: w.balance_idr }))
    )
    setCards(
      cards.map((c) => ({ id: c.id, name: c.bank, masked: c.masked || '', type: 'card', balance: c.balance_idr }))
    )
    setTransactions(transactions)
    setCash(cash)
  }, [])

  const refresh = useCallback(() => {
    fetchAll().then(applyAll).catch((e) => toast.error(e.message))
  }, [fetchAll, applyAll])

  useEffect(() => {
    if (fetchedRef.current) return
    fetchedRef.current = true
    fetchAll()
      .then((res) => {
        applyAll(res)
      })
      .catch((e) => {
        toast.error(e.message)
      })
  }, [fetchAll, applyAll])

  const accountMap = useMemo(() => {
    const map = {}
    ;[...wallets, ...cards, ...(cash ? [{ id: cash.id, name: 'Cash', type: 'cash', balance: cash.balance_idr }] : [])].forEach((a) => {
      map[a.id] = a
    })
    return map
  }, [wallets, cards, cash])

  const filtered = transactions.filter((tx) => {
    const matchesQuery = (tx.name || '').toLowerCase().includes(query.toLowerCase())
    const matchesCategory = category === 'all' || tx.category === category
    const matchesStatus = status === 'all' || tx.status === status
    return matchesQuery && matchesCategory && matchesStatus
  })

  const handleAdd = async (form) => {
    try {
      await createTransaction(form)
      toast.success('Transaction added')
      refresh()
    } catch (e) {
      toast.error(e.message)
    }
  }

  const handleEdit = async (form) => {
    try {
      await updateTransaction(form.id, form)
      toast.success('Transaction updated')
      refresh()
    } catch (e) {
      toast.error(e.message)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteTransaction(id)
      toast.success('Transaction deleted')
      refresh()
    } catch (e) {
      toast.error(e.message)
    }
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

  const columns = [
    {
      key: 'name',
      header: 'Transaction',
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <Avatar className="size-9">
            <AvatarImage src="" alt={row.name} />
            <AvatarFallback className="text-xs">{initialsOf(row.name)}</AvatarFallback>
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
        const cat = categories[value] || categoryLegacy[value]
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
      key: 'account',
      header: 'Account',
      sortable: false,
      render: (_, row) => accountMap[row.account_id]?.name || '—',
    },
    {
      key: 'date',
      header: 'Date',
      sortable: true,
      render: (value) => formatDate(value),
    },
    {
      key: 'amount',
      header: 'Amount',
      sortable: true,
      align: 'right',
      render: (_, row) => (
        <span className={row.type === 'income' ? 'text-emerald-600' : ''}>
          {formatAmount(row)}
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
                <SelectItem value="freelance">Freelance</SelectItem>
                <SelectItem value="gift">Gift</SelectItem>
                <SelectItem value="bonus">Bonus</SelectItem>
                <SelectItem value="food">Food & Drinks</SelectItem>
                <SelectItem value="transportation">Transportation</SelectItem>
                <SelectItem value="housing">Housing</SelectItem>
                <SelectItem value="shopping">Shopping</SelectItem>
                <SelectItem value="entertainment">Entertainment</SelectItem>
                <SelectItem value="health">Health</SelectItem>
                <SelectItem value="education">Education</SelectItem>
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
          <DataTable columns={columns} data={filtered.filter((tx) => tx.type === 'income')} pageSize={10} showActions actions={tableActions} />
        </TabsContent>
        <TabsContent value="expenses">
          <DataTable columns={columns} data={filtered.filter((tx) => tx.type === 'expense')} pageSize={10} showActions actions={tableActions} />
        </TabsContent>
      </Tabs>

      <AddTransactionDialog open={addOpen} onOpenChange={setAddOpen} onSubmit={handleAdd} wallets={wallets} cards={cards} cash={cash} />
      <EditTransactionDialog transaction={selectedTx} open={editOpen} onOpenChange={setEditOpen} onSubmit={handleEdit} wallets={wallets} cards={cards} cash={cash} />
      <DeleteTransactionDialog transaction={selectedTx} open={deleteOpen} onOpenChange={setDeleteOpen} onConfirm={handleDelete} />
    </div>
  )
}