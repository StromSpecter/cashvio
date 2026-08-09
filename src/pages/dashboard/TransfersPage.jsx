import { useEffect, useMemo, useState, useCallback, useRef } from 'react'
import { Search, Plus, ArrowLeftRight, MoreHorizontal, Trash2, Landmark, Wallet } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Input } from '../../components/ui/input'
import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
} from '../../components/ui/dropdown'
import { DataTable } from '../../components/ui/table'
import { AddTransferDialog } from '../../components/dialogs/AddTransferDialog'
import { DeleteTransferDialog } from '../../components/dialogs/DeleteTransferDialog'
import { getTransfers, createTransfer, deleteTransfer, getWallets, getCards } from '../../lib/api'
import { toast } from '../../lib/toast.js'

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
  const Icon = typeIcons[type] || ArrowLeftRight
  const acc = accountMap[`${type}:${id}`]
  return (
    <div className="flex items-center gap-2">
      <Icon className="size-4 text-muted-foreground" />
      <span>{acc ? acc.name || acc.bank : '—'}</span>
    </div>
  )
}

export function TransfersPage() {
  const [transfers, setTransfers] = useState([])
  const [wallets, setWallets] = useState([])
  const [cards, setCards] = useState([])
  const [query, setQuery] = useState('')
  const [addOpen, setAddOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selected, setSelected] = useState(null)
  const fetchedRef = useRef(false)

  const fetchAll = useCallback(async () => {
    const [wRes, cRes, tRes] = await Promise.all([
      getWallets({ limit: 100 }),
      getCards({ limit: 100 }),
      getTransfers({ limit: 100 }),
    ])
    return { wallets: wRes.data, cards: cRes.data, transfers: tRes.data }
  }, [])

  const applyAll = useCallback(({ wallets, cards, transfers }) => {
    setWallets(wallets)
    setCards(cards)
    setTransfers(transfers)
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
    wallets.forEach((w) => {
      map[`wallet:${w.id}`] = w
    })
    cards.forEach((c) => {
      map[`card:${c.id}`] = c
    })
    return map
  }, [wallets, cards])

  const filtered = transfers.filter((t) =>
    (t.note || '').toLowerCase().includes(query.toLowerCase())
  )

  const handleAdd = async (form) => {
    try {
      await createTransfer(form)
      toast.success('Transfer completed')
      refresh()
    } catch (e) {
      toast.error(e.message)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteTransfer(id)
      toast.success('Transfer deleted')
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
        <Button variant="ghost" size="icon" className="ml-1" aria-label="Transfer options">
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
      header: 'From',
      render: (_, row) => <AccountCell type={row.from_type} id={row.from_id} accountMap={accountMap} />,
    },
    {
      key: 'to',
      header: 'To',
      render: (_, row) => <AccountCell type={row.to_type} id={row.to_id} accountMap={accountMap} />,
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Transfers</h1>
          <p className="text-sm text-muted-foreground">
            Move money between your cards and wallets.
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setAddOpen(true)}>
            <Plus className="size-4" /> New Transfer
          </Button>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search transfers by note..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-9 w-full pl-8"
          aria-label="Search transfers"
        />
      </div>

      <DataTable columns={columns} data={filtered} pageSize={10} showActions actions={tableActions} />

      <AddTransferDialog open={addOpen} onOpenChange={setAddOpen} onSubmit={handleAdd} wallets={wallets} cards={cards} />
      <DeleteTransferDialog transfer={selected} open={deleteOpen} onOpenChange={setDeleteOpen} onConfirm={handleDelete} />
    </div>
  )
}