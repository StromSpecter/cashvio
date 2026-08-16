import { useState, useCallback, useRef, useMemo, useEffect } from 'react'
import { Search, Plus, Layers, Wallet, TrendingUp, Percent, ArrowUpRight, ArrowDownRight, ChartPie, RefreshCw } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { InvestmentsTable } from '../../components/investments/InvestmentsTable'
import { AddInvestmentDialog } from '../../components/dialogs/AddInvestmentDialog'
import { EditInvestmentDialog } from '../../components/dialogs/EditInvestmentDialog'
import { DeleteInvestmentDialog } from '../../components/dialogs/DeleteInvestmentDialog'
import { getInvestments, getInvestmentPrices, createInvestment, updateInvestment, deleteInvestment, getWallets, getCards, getCash } from '../../lib/api'
import { toast } from '../../lib/toast.js'
import { formatRp, formatRpSigned, signPct, investedOf, valueOf } from '../../lib/investments'

function StatCard({ stat }) {
  const Icon = stat.icon
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {stat.label}
        </CardTitle>
        <div className="rounded-lg bg-accent p-1.5">
          <Icon className="size-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{stat.value}</div>
        <p className="mt-1 flex items-center gap-1 text-xs">
          <span className={`flex items-center gap-1 ${stat.up ? 'text-emerald-600' : 'text-red-600'}`}>
            {stat.up ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
            {stat.change}
          </span>
          <span className="text-muted-foreground truncate">{stat.hint}</span>
        </p>
      </CardContent>
    </Card>
  )
}

export function InvestmentsPage() {
  const [items, setItems] = useState([])
  const [prices, setPrices] = useState({})
  const [loading, setLoading] = useState(true)
  const [addOpen, setAddOpen] = useState(false)
  const [addDefaults, setAddDefaults] = useState(null)
  const [editTarget, setEditTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [query, setQuery] = useState('')
  const [wallets, setWallets] = useState([])
  const [cards, setCards] = useState([])
  const [cash, setCash] = useState(null)
  const fetchedRef = useRef(false)

  const fetchPrices = useCallback(async () => {
    try {
      const res = await getInvestmentPrices()
      const map = {}
      ;(res.data || []).forEach((p) => {
        map[p.symbol] = p
      })
      setPrices(map)
    } catch (e) {
      toast.error(e.message)
    }
  }, [])

  const refresh = useCallback(async () => {
    try {
      const res = await getInvestments({ limit: 100 })
      setItems(res.data || [])
    } catch (e) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const refreshAll = useCallback(() => Promise.all([refresh(), fetchPrices()]), [refresh, fetchPrices])

  const fetchAccounts = useCallback(async () => {
    const [wRes, cRes, cashRes] = await Promise.all([
      getWallets({ limit: 100 }),
      getCards({ limit: 100 }),
      getCash(),
    ])
    return { wallets: wRes.data, cards: cRes.data, cash: cashRes.data }
  }, [])

  useEffect(() => {
    if (fetchedRef.current) return
    fetchedRef.current = true
    Promise.all([refresh(), fetchPrices(), fetchAccounts()])
      .then(([, , { wallets, cards, cash }]) => {
        setWallets(wallets)
        setCards(cards)
        setCash(cash)
      })
      .catch((e) => toast.error(e.message))
  }, [refresh, fetchPrices, fetchAccounts])

  const accounts = useMemo(() => {
    return [
      ...wallets.map((w) => ({ key: `wallet:${w.id}`, label: w.name, balance: w.balance_idr })),
      ...cards.map((c) => ({ key: `card:${c.id}`, label: c.bank, balance: c.balance_idr })),
      ...(cash ? [{ key: `cash:${cash.id}`, label: 'Cash', balance: cash.balance_idr }] : []),
    ]
  }, [wallets, cards, cash])

  const totals = useMemo(() => {
    const invested = items.reduce((sum, i) => sum + investedOf(i), 0)
    const value = items.reduce((sum, i) => sum + valueOf(i, prices[i.ticker]), 0)
    const gain = value - invested
    const gainPct = invested > 0 ? (gain / invested) * 100 : 0
    return { invested, value, gain, gainPct }
  }, [items, prices])

  const stats = [
    {
      label: 'Total Invested',
      value: formatRp(totals.invested),
      change: signPct(0),
      hint: 'Cost basis of all buys',
      icon: Layers,
      up: true,
    },
    {
      label: 'Current Value',
      value: formatRp(totals.value),
      change: signPct(totals.gainPct),
      hint: 'Market value today',
      icon: Wallet,
      up: totals.gainPct >= 0,
    },
    {
      label: 'Unrealized Gain',
      value: formatRpSigned(totals.gain),
      change: signPct(totals.gainPct),
      hint: 'Profit or loss',
      icon: TrendingUp,
      up: totals.gain >= 0,
    },
    {
      label: 'Return',
      value: signPct(totals.gainPct),
      change: signPct(totals.gainPct),
      hint: 'Overall return',
      icon: Percent,
      up: totals.gainPct >= 0,
    },
  ]

  const visibleItems = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        i.ticker.toLowerCase().includes(q) ||
        (i.app || '').toLowerCase().includes(q)
    )
  }, [items, query])

  const openAdd = (defaults) => {
    setAddDefaults(defaults)
    setAddOpen(true)
  }

  const handleAdd = async (form) => {
    try {
      await createInvestment(form)
      toast.success('Investment added')
      setAddOpen(false)
      await refreshAll()
    } catch (e) {
      toast.error(e.message)
    }
  }

  const handleEdit = async (id, form) => {
    try {
      await updateInvestment(id, form)
      toast.success('Investment updated')
      setEditTarget(null)
      await refreshAll()
    } catch (e) {
      toast.error(e.message)
    }
  }

  const handleDelete = async (target) => {
    try {
      const ids = Array.isArray(target.purchases)
        ? target.purchases.map((p) => p.id)
        : [target.id]
      await Promise.all(ids.map((id) => deleteInvestment(id)))
      toast.success(ids.length > 1 ? 'Purchases deleted' : 'Investment deleted')
      setDeleteTarget(null)
      await refreshAll()
    } catch (e) {
      toast.error(e.message)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Investments</h1>
          <p className="text-sm text-muted-foreground">
            Manage your assets. Rows with the same ticker are merged; expand to see each purchase.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search assets..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-9 w-full pl-8 sm:w-56"
              aria-label="Search investments"
            />
          </div>
          <Button onClick={() => openAdd(null)}>
            <Plus className="size-4" /> Add Investment
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>

      <div className="flex flex-col gap-2 rounded-lg border border-border bg-muted/50 px-4 py-2.5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <span className="flex items-center gap-2">
          <RefreshCw className="size-3.5 shrink-0" />
          Harga saham (IDX) diperbarui otomatis setiap hari pukul 17.00–23.59 WIB dari goapi.io.
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setLoading(true)
            refreshAll().finally(() => setLoading(false))
          }}
        >
          <RefreshCw className="size-3.5" /> Refresh
        </Button>
      </div>

      {loading ? (
        <Card>
          <CardContent className="py-16 text-center text-sm text-muted-foreground">
            Loading investments...
          </CardContent>
        </Card>
      ) : items.length > 0 ? (
        <InvestmentsTable
          investments={visibleItems}
          prices={prices}
          onAddLot={(g) =>
            openAdd({
              type: g.type,
              name: g.name,
              ticker: g.ticker,
              app: g.app,
              account_type: g.purchases[0]?.account_type,
              account_id: g.purchases[0]?.account_id,
            })
          }
          onEdit={(p) => setEditTarget(p)}
          onDelete={(p) => setDeleteTarget(p)}
          onDeleteAll={(g) => setDeleteTarget(g)}
        />
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
            <div className="rounded-full bg-accent p-4">
              <ChartPie className="size-8 text-muted-foreground" />
            </div>
            <div>
              <h2 className="font-semibold">No investments yet</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Add your first asset to start building your portfolio.
              </p>
            </div>
            <Button onClick={() => openAdd(null)}>
              <Plus className="size-4" /> Add Investment
            </Button>
          </CardContent>
        </Card>
      )}

      <AddInvestmentDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onSubmit={handleAdd}
        accounts={accounts}
        defaults={addDefaults}
      />
      <EditInvestmentDialog
        open={!!editTarget}
        onOpenChange={(open) => {
          if (!open) setEditTarget(null)
        }}
        investment={editTarget}
        onSubmit={handleEdit}
        accounts={accounts}
      />
      <DeleteInvestmentDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null)
        }}
        investment={deleteTarget}
        onConfirm={handleDelete}
      />
    </div>
  )
}