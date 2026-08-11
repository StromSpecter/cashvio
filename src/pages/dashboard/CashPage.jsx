import { useEffect, useMemo, useState, useCallback, useRef } from 'react'
import { Search, Plus, MoreHorizontal, Trash2, Banknote, Landmark, Wallet } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Input } from '../../components/ui/input'
import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
} from '../../components/ui/dropdown'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { DataTable } from '../../components/ui/table'
import { WithdrawCashDialog } from '../../components/dialogs/WithdrawCashDialog'
import { DeleteWithdrawalDialog } from '../../components/dialogs/DeleteWithdrawalDialog'
import { getCash, getCashWithdrawals, createCashWithdrawal, deleteCashWithdrawal, getWallets, getCards } from '../../lib/api'
import { toast } from '../../lib/toast.js'
import { CashSkeleton } from '../../components/templates'

const typeIcons = { card: Landmark, wallet: Wallet }

const formatRp = (n) => `Rp${Number(n || 0).toLocaleString('id-ID')}`

const formatDate = (value) => {
  if (!value) return ''
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const AccountCell = ({ type, id, accountMap }) => {
  const Icon = typeIcons[type] || Wallet
  const acc = accountMap[`${type}:${id}`]
  return (
    <div className="flex items-center gap-2">
      <Icon className="size-4 text-muted-foreground" />
      <span>{acc ? acc.name || acc.bank : '—'}</span>
    </div>
  )
}

export function CashPage() {
  const [cash, setCash] = useState(null)
  const [withdrawals, setWithdrawals] = useState([])
  const [wallets, setWallets] = useState([])
  const [cards, setCards] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [addOpen, setAddOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selected, setSelected] = useState(null)
  const fetchedRef = useRef(false)

  const fetchAll = useCallback(async () => {
    const [cashRes, wRes, cRes, wdRes] = await Promise.all([
      getCash(),
      getWallets({ limit: 100 }),
      getCards({ limit: 100 }),
      getCashWithdrawals({ limit: 100 }),
    ])
    return {
      cash: cashRes.data,
      wallets: wRes.data,
      cards: cRes.data,
      withdrawals: wdRes.data,
    }
  }, [])

  const applyAll = useCallback(({ cash, wallets, cards, withdrawals }) => {
    setCash(cash)
    setWallets(wallets)
    setCards(cards)
    setWithdrawals(withdrawals)
  }, [])

  const refresh = useCallback(() => {
    fetchAll()
      .then(applyAll)
      .catch((e) => toast.error(e.message))
  }, [fetchAll, applyAll])

  useEffect(() => {
    if (fetchedRef.current) return
    fetchedRef.current = true
    fetchAll()
      .then((res) => applyAll(res))
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false))
  }, [fetchAll, applyAll])

  const accountMap = useMemo(() => {
    const map = {}
    wallets.forEach((w) => {
      map[`wallet:${w.id}`] = w
    })
    cards.forEach((c) => {
      map[`card:${c.id}`] = c
    })
    return map
  }, [wallets, cards])

  const filtered = withdrawals.filter((t) =>
    (t.note || '').toLowerCase().includes(query.toLowerCase())
  )

  const cashBalance = cash?.balance_idr || 0

  const handleAdd = async (form) => {
    try {
      await createCashWithdrawal(form)
      toast.success('Cash withdrawn')
      refresh()
    } catch (e) {
      toast.error(e.message)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteCashWithdrawal(id)
      toast.success('Withdrawal deleted')
      refresh()
    } catch (e) {
      toast.error(e.message)
    }
  }

  const openDelete = (t) => {
    setSelected(t)
    setDeleteOpen(true)
  }

  const tableActions = (row) => (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="ghost" size="icon" className="ml-1" aria-label="Withdrawal options">
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownTrigger>
      <DropdownContent align="end">
        <DropdownItem className="text-destructive focus:text-destructive" onClick={() => openDelete(row)}>
          <Trash2 className="size-4 mr-2" /> Delete
        </DropdownItem>
      </DropdownContent>
    </Dropdown>
  )

  const columns = [
    {
      key: 'from',
      header: 'From account',
      render: (_, row) => <AccountCell type={row.from_type} id={row.from_id} accountMap={accountMap} />,
    },
    {
      key: 'amount',
      header: 'Amount',
      align: 'right',
      render: (value) => <span className="font-medium">{formatRp(value)}</span>,
    },
    {
      key: 'fee',
      header: 'Admin fee',
      align: 'right',
      render: (value) =>
        value > 0 ? (
          <span className="text-muted-foreground">{formatRp(value)}</span>
        ) : (
          <Badge variant="outline">Free</Badge>
        ),
    },
    {
      key: 'note',
      header: 'Note',
      render: (value) => <span className="text-muted-foreground">{value || '—'}</span>,
    },
    {
      key: 'date',
      header: 'Date',
      sortable: true,
      render: (value) => formatDate(value),
    },
  ]

  if (loading) return <CashSkeleton />

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Cash</h1>
          <p className="text-sm text-muted-foreground">
            Withdraw cash from your accounts and track your cash on hand.
          </p>
        </div>
        <Button onClick={() => setAddOpen(true)}>
          <Plus className="size-4" /> Withdraw Cash
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cash balance</CardTitle>
          <CardDescription>
            Cash you have withdrawn and are holding outside your accounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-primary p-3 text-primary-foreground">
              <Banknote className="size-6" />
            </div>
            <p className="text-3xl font-bold">{formatRp(cashBalance)}</p>
          </div>
        </CardContent>
      </Card>

      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search withdrawals by note..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-9 w-full pl-8"
          aria-label="Search withdrawals"
        />
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        pageSize={10}
        showActions
        actions={tableActions}
        emptyMessage="No cash withdrawals yet."
      />

      <WithdrawCashDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onSubmit={handleAdd}
        wallets={wallets}
        cards={cards}
      />
      <DeleteWithdrawalDialog
        withdrawal={selected}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
      />
    </div>
  )
}
