import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { Search, Plus, MoreHorizontal, Pencil, Trash2, Layers, Wallet, TrendingUp, Percent, ArrowUpRight, ArrowDownRight, ChartPie, PackagePlus } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Badge } from '../../components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '../../components/ui/avatar'
import { DataTable } from '../../components/ui/table'
import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownSeparator,
} from '../../components/ui/dropdown'
import { AddInvestmentDialog } from '../../components/dialogs/AddInvestmentDialog'
import { EditInvestmentDialog } from '../../components/dialogs/EditInvestmentDialog'
import { DeleteInvestmentDialog } from '../../components/dialogs/DeleteInvestmentDialog'
import { AddLotDialog } from '../../components/dialogs/AddLotDialog'
import { DeleteLotDialog } from '../../components/dialogs/DeleteLotDialog'
import { useInvestments } from '../../lib/investment-context'
import { getWallets, getCards, getCash } from '../../lib/api'
import { toast } from '../../lib/toast.js'
import {
  typeMeta,
  formatRp,
  formatRpSigned,
  signPct,
  formatUnits,
  formatPrice,
  formatDate,
  totalUnits,
  avgBuyPrice,
  investedOf,
  valueOf,
  gainOf,
  gainPctOf,
  lotInvestedOf,
  lotValueOf,
  lotGainOf,
} from '../../lib/investments'

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

function InvestmentActions({ onAddLot, onEdit, onDelete }) {
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="ghost" size="icon" aria-label="Investment options">
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownTrigger>
      <DropdownContent align="end">
        <DropdownItem onClick={onAddLot}>
          <PackagePlus className="size-4" /> Add Lot
        </DropdownItem>
        <DropdownItem onClick={onEdit}>
          <Pencil className="size-4" /> Edit
        </DropdownItem>
        <DropdownSeparator />
        <DropdownItem className="text-destructive focus:text-destructive" onClick={onDelete}>
          <Trash2 className="size-4" /> Delete
        </DropdownItem>
      </DropdownContent>
    </Dropdown>
  )
}

function LotGainText({ value, pct }) {
  return (
    <span
      className={`flex items-center justify-end gap-1 font-medium tabular-nums ${
        value >= 0 ? 'text-emerald-600' : 'text-red-600'
      }`}
    >
      {value >= 0 ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
      {formatRpSigned(value)}
      <span className="text-xs text-muted-foreground">({signPct(pct)})</span>
    </span>
  )
}

function LotLabeledRow({ label, children }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-medium tabular-nums">{children}</span>
    </div>
  )
}

function LotMobileCard({ lot, currentPrice, onDelete }) {
  return (
    <div className="border-b border-border/50 px-3 py-3 sm:hidden last:border-b-0">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-semibold">{formatDate(lot.buy_date)}</span>
        <Button
          variant="ghost"
          size="icon"
          className="size-7 text-muted-foreground hover:text-destructive"
          aria-label={`Delete lot ${formatDate(lot.buy_date)}`}
          onClick={() => onDelete(lot)}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
      <div className="mt-2 space-y-1.5">
        <LotLabeledRow label="Units">
          {formatUnits(lot.units)}
        </LotLabeledRow>
        <LotLabeledRow label="Buy price">
          {formatPrice(lot.buy_price)}
        </LotLabeledRow>
        <LotLabeledRow label="Invested">
          {formatRp(lotInvestedOf(lot))}
        </LotLabeledRow>
        <LotLabeledRow label="Value">
          {formatRp(lotValueOf(lot, currentPrice))}
        </LotLabeledRow>
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-muted-foreground">Gain</span>
          <LotGainText
            value={lotGainOf(lot, currentPrice)}
            pct={(lotGainOf(lot, currentPrice) / lotInvestedOf(lot)) * 100}
          />
        </div>
      </div>
    </div>
  )
}

function LotDesktopRow({ lot, currentPrice, onDelete }) {
  return (
    <div className="hidden grid-cols-7 gap-3 border-b border-border/50 px-3 py-2.5 text-sm last:border-b-0 sm:grid sm:items-center">
      <span className="text-muted-foreground">{formatDate(lot.buy_date)}</span>
      <span className="text-right tabular-nums">{formatUnits(lot.units)}</span>
      <span className="text-right tabular-nums">{formatPrice(lot.buy_price)}</span>
      <span className="text-right tabular-nums">{formatRp(lotInvestedOf(lot))}</span>
      <span className="text-right font-medium tabular-nums">{formatRp(lotValueOf(lot, currentPrice))}</span>
      <LotGainText value={lotGainOf(lot, currentPrice)} pct={(lotGainOf(lot, currentPrice) / lotInvestedOf(lot)) * 100} />
      <span className="text-right">
        <Button
          variant="ghost"
          size="icon"
          className="size-7 text-muted-foreground hover:text-destructive"
          aria-label={`Delete lot ${formatDate(lot.buy_date)}`}
          onClick={() => onDelete(lot)}
        >
          <Trash2 className="size-4" />
        </Button>
      </span>
    </div>
  )
}

function ExpandedLots({ row, avgPrice, onAddLot, onDeleteLot }) {
  return (
    <div className="px-4 py-4 sm:px-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold">Purchase lots</p>
          <p className="text-xs text-muted-foreground">
            {row.lots.length} purchase{row.lots.length > 1 ? 'es' : ''} · average buy price{' '}
            {formatPrice(avgPrice)}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={onAddLot}>
          <Plus className="size-4" /> New lot
        </Button>
      </div>
      <div className="mt-3 overflow-hidden rounded-lg border border-border">
        <div className="hidden grid-cols-7 gap-3 border-b border-border bg-accent/50 px-3 py-2 text-xs font-medium text-muted-foreground sm:grid">
          <span>Date</span>
          <span className="text-right">Units</span>
          <span className="text-right">Buy price</span>
          <span className="text-right">Invested</span>
          <span className="text-right">Value</span>
          <span className="text-right">Gain</span>
          <span />
        </div>
        {row.lots.map((lot) => (
          <div key={lot.id}>
            <LotMobileCard lot={lot} currentPrice={row.current_price} onDelete={onDeleteLot} />
            <LotDesktopRow lot={lot} currentPrice={row.current_price} onDelete={onDeleteLot} />
          </div>
        ))}
        {row.lots.length === 0 && (
          <p className="px-3 py-6 text-center text-sm text-muted-foreground">
            No purchase lots. Add one to record a buy.
          </p>
        )}
      </div>
    </div>
  )
}

export function InvestmentsPage() {
  const { investments, addInvestment, updateInvestment, deleteInvestment, addLot, deleteLot } = useInvestments()
  const [addOpen, setAddOpen] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [addLotTarget, setAddLotTarget] = useState(null)
  const [deleteLotTarget, setDeleteLotTarget] = useState(null)
  const [query, setQuery] = useState('')
  const [wallets, setWallets] = useState([])
  const [cards, setCards] = useState([])
  const [cash, setCash] = useState(null)
  const fetchedRef = useRef(false)

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
    fetchAccounts()
      .then(({ wallets, cards, cash }) => {
        setWallets(wallets)
        setCards(cards)
        setCash(cash)
      })
      .catch((e) => toast.error(e.message))
  }, [fetchAccounts])

  const accounts = useMemo(() => {
    return [
      ...wallets.map((w) => ({ key: `wallet:${w.id}`, label: w.name, balance: w.balance_idr })),
      ...cards.map((c) => ({ key: `card:${c.id}`, label: c.bank, balance: c.balance_idr })),
      ...(cash ? [{ key: `cash:${cash.id}`, label: 'Cash', balance: cash.balance_idr }] : []),
    ]
  }, [wallets, cards, cash])

  const totals = useMemo(() => {
    const invested = investments.reduce((sum, i) => sum + investedOf(i), 0)
    const value = investments.reduce((sum, i) => sum + valueOf(i), 0)
    const gain = value - invested
    const gainPct = invested > 0 ? (gain / invested) * 100 : 0
    return { invested, value, gain, gainPct }
  }, [investments])

  const stats = [
    {
      label: 'Total Invested',
      value: formatRp(totals.invested),
      change: signPct(0),
      hint: 'Cost basis of all lots',
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

  const columns = [
    {
      key: 'name',
      header: 'Asset',
      sortable: true,
      width: 'min-w-[200px]',
      render: (value, row) => {
        const meta = typeMeta[row.type]
        const Icon = meta.icon
        return (
          <div className="flex items-center gap-3 min-w-0">
            <Avatar className="size-9 shrink-0 bg-accent">
              <AvatarImage src="" alt={value} />
              <AvatarFallback className="text-xs">
                <Icon className="size-4" />
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="font-medium truncate">{value}</p>
              <p className="text-xs text-muted-foreground truncate">
                {row.ticker}
                {row.app ? ` · ${row.app}` : ''}
              </p>
            </div>
          </div>
        )
      },
    },
    {
      key: 'type',
      header: 'Type',
      sortable: true,
      render: (value) => (
        <Badge variant="outline" className="font-normal capitalize">
          {typeMeta[value].label}
        </Badge>
      ),
    },
    {
      key: 'units',
      header: 'Units',
      sortable: true,
      render: (value, row) => (
        <span className="tabular-nums">
          {formatUnits(value)}
          {row.lots.length > 1 && (
            <span
              className="ml-1.5 rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
              title={`${row.lots.length} purchase lots`}
            >
              {row.lots.length} lots
            </span>
          )}
        </span>
      ),
    },
    {
      key: 'avgBuyPrice',
      header: 'Avg Buy Price',
      sortable: true,
      render: (value) => <span className="tabular-nums">{formatPrice(value)}</span>,
    },
    {
      key: 'current_price',
      header: 'Current Price',
      sortable: true,
      render: (value) => <span className="tabular-nums">{formatPrice(value)}</span>,
    },
    {
      key: 'marketValue',
      header: 'Market Value',
      sortable: true,
      align: 'right',
      width: 'min-w-[120px]',
      render: (value) => <span className="font-medium tabular-nums">{formatRp(value)}</span>,
    },
    {
      key: 'gain',
      header: 'Return',
      sortable: true,
      align: 'right',
      width: 'min-w-[130px]',
      render: (value, row) => <LotGainText value={value} pct={gainPctOf(row)} />,
    },
  ]

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return investments
      .map((i) => ({
        ...i,
        units: totalUnits(i),
        avgBuyPrice: avgBuyPrice(i),
        current_price: i.current_price || 0,
        marketValue: valueOf(i),
        gain: gainOf(i),
      }))
      .filter(
        (i) =>
          !q ||
          i.name.toLowerCase().includes(q) ||
          i.ticker.toLowerCase().includes(q) ||
          (i.app || '').toLowerCase().includes(q)
      )
  }, [investments, query])

  const handleAdd = (form) => {
    addInvestment(form)
  }

  const handleEdit = (id, form) => {
    updateInvestment(id, form)
  }

  const handleDelete = (id) => {
    deleteInvestment(id)
  }

  const tableActions = (row) => (
    <InvestmentActions
      onAddLot={() => setAddLotTarget(row)}
      onEdit={() => setEditTarget(row)}
      onDelete={() => setDeleteTarget(row)}
    />
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Investments</h1>
          <p className="text-sm text-muted-foreground">
            Manage your assets. Expand a row to see each purchase lot.
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
          <Button onClick={() => setAddOpen(true)}>
            <Plus className="size-4" /> Add Investment
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>

      {investments.length > 0 ? (
        <DataTable
          columns={columns}
          data={rows}
          pageSize={10}
          showActions
          actions={tableActions}
          renderExpanded={(row) => (
            <ExpandedLots
              row={row}
              avgPrice={avgBuyPrice(row)}
              onAddLot={() => setAddLotTarget(row)}
              onDeleteLot={(lot) => setDeleteLotTarget({ asset: row, lot })}
            />
          )}
          emptyMessage="No investments found."
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
            <Button onClick={() => setAddOpen(true)}>
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
      <AddLotDialog
        open={!!addLotTarget}
        onOpenChange={(open) => {
          if (!open) setAddLotTarget(null)
        }}
        investment={addLotTarget || { id: '', name: '' }}
        onSubmit={addLot}
      />
      <DeleteLotDialog
        open={!!deleteLotTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteLotTarget(null)
        }}
        investment={deleteLotTarget?.asset}
        lot={deleteLotTarget?.lot}
        onConfirm={deleteLot}
      />
    </div>
  )
}