import { Plus, Pencil, Trash2, ArrowUpRight, ArrowDownRight, MoreHorizontal } from 'lucide-react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { DataTable } from '../ui/table'
import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownSeparator,
} from '../ui/dropdown'
import {
  typeMeta,
  formatRp,
  formatRpSigned,
  signPct,
  formatUnits,
  formatPrice,
  formatDate,
  investedOf,
  valueOf,
  gainOf,
  gainPctOf,
  avgBuyPrice,
  groupInvestments,
  groupValue,
  groupGain,
  groupGainPct,
  lotsOf,
} from '../../lib/investments'

function GainText({ value, pct }) {
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

function LabeledRow({ label, children }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-medium tabular-nums">{children}</span>
    </div>
  )
}

function PurchaseMobileCard({ purchase, price, onEdit, onDelete }) {
  return (
    <div className="flex flex-col gap-2 border-b border-border/50 px-3 py-3 sm:hidden last:border-b-0">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-semibold">{formatDate(purchase.date)}</span>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="size-7 text-muted-foreground" aria-label="Edit purchase" onClick={() => onEdit(purchase)}>
            <Pencil className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" className="size-7 text-muted-foreground hover:text-destructive" aria-label="Delete purchase" onClick={() => onDelete(purchase)}>
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>
      <div className="space-y-1.5">
        <LabeledRow label="Units">{formatUnits(purchase.units)}</LabeledRow>
        <LabeledRow label="Buy price">{formatPrice(purchase.buy_price)}</LabeledRow>
        <LabeledRow label="Invested">{formatRp(investedOf(purchase))}</LabeledRow>
        <LabeledRow label="Value">{formatRp(valueOf(purchase, price))}</LabeledRow>
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-muted-foreground">Gain</span>
          <GainText value={gainOf(purchase, price)} pct={gainPctOf(purchase, price)} />
        </div>
      </div>
    </div>
  )
}

function PurchaseDesktopRow({ purchase, price, onEdit, onDelete }) {
  return (
    <div className="hidden grid-cols-8 gap-3 border-b border-border/50 px-3 py-2.5 text-sm last:border-b-0 sm:grid sm:items-center">
      <span className="text-muted-foreground">{formatDate(purchase.date)}</span>
      <span className="text-right tabular-nums">{formatUnits(purchase.units)}</span>
      <span className="text-right tabular-nums">{formatPrice(purchase.buy_price)}</span>
      <span className="text-right tabular-nums">{formatRp(investedOf(purchase))}</span>
      <span className="text-right font-medium tabular-nums">{formatRp(valueOf(purchase, price))}</span>
      <GainText value={gainOf(purchase, price)} pct={gainPctOf(purchase, price)} />
      <span className="text-right">
        <Button variant="ghost" size="icon" className="size-7 text-muted-foreground" aria-label="Edit purchase" onClick={() => onEdit(purchase)}>
          <Pencil className="size-4" />
        </Button>
      </span>
      <span className="text-right">
        <Button variant="ghost" size="icon" className="size-7 text-muted-foreground hover:text-destructive" aria-label="Delete purchase" onClick={() => onDelete(purchase)}>
          <Trash2 className="size-4" />
        </Button>
      </span>
    </div>
  )
}

function ExpandedPurchases({ group, price, onAddLot, onEdit, onDelete }) {
  return (
    <div className="px-4 py-4 sm:px-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold">Purchase history</p>
          <p className="text-xs text-muted-foreground">
            {group.purchases.length} purchase{group.purchases.length > 1 ? 'es' : ''} · average buy price{' '}
            {formatPrice(avgBuyPrice(group))}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => onAddLot(group)}>
          <Plus className="size-4" /> New lot
        </Button>
      </div>
      <div className="mt-3 overflow-hidden rounded-lg border border-border">
        <div className="hidden grid-cols-8 gap-3 border-b border-border bg-accent/50 px-3 py-2 text-xs font-medium text-muted-foreground sm:grid">
          <span>Date</span>
          <span className="text-right">Units</span>
          <span className="text-right">Buy price</span>
          <span className="text-right">Invested</span>
          <span className="text-right">Value</span>
          <span className="text-right">Gain</span>
          <span />
          <span />
        </div>
        {group.purchases.map((p) => (
          <div key={p.id}>
            <PurchaseMobileCard purchase={p} price={price} onEdit={onEdit} onDelete={onDelete} />
            <PurchaseDesktopRow purchase={p} price={price} onEdit={onEdit} onDelete={onDelete} />
          </div>
        ))}
      </div>
    </div>
  )
}

function GroupActions({ onAddLot, onDeleteAll }) {
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="ghost" size="icon" aria-label="Asset options">
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownTrigger>
      <DropdownContent align="end">
        <DropdownItem onClick={onAddLot}>
          <Plus className="size-4" /> New lot
        </DropdownItem>
        <DropdownSeparator />
        <DropdownItem className="text-destructive focus:text-destructive" onClick={onDeleteAll}>
          <Trash2 className="size-4" /> Delete all
        </DropdownItem>
      </DropdownContent>
    </Dropdown>
  )
}

export function InvestmentsTable({
  investments,
  prices = {},
  onAddLot,
  onEdit,
  onDelete,
  onDeleteAll,
  emptyMessage = 'No investments found.',
}) {
  const columns = [
    {
      key: 'name',
      header: 'Asset',
      sortable: true,
      width: 'min-w-[200px]',
      render: (value, row) => {
        const meta = row.type ? typeMeta[row.type] : typeMeta.stock
        const Icon = meta.icon
        return (
          <div className="flex items-center gap-3 min-w-0">
            <Avatar className="size-9 shrink-0 bg-accent">
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
      align: 'right',
      render: (value, row) => {
        const lots = lotsOf(value, row.type)
        return (
          <span className="tabular-nums">
            {formatUnits(value)}
            {lots > 1 && (
              <span
                className="ml-1.5 rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
                title="1 lot = 100 shares"
              >
                {formatUnits(lots)} lots
              </span>
            )}
          </span>
        )
      },
    },
    {
      key: 'avg',
      header: 'Avg Buy Price',
      sortable: true,
      align: 'right',
      render: (value, row) => <span className="tabular-nums">{formatPrice(avgBuyPrice(row))}</span>,
    },
    {
      key: 'price',
      header: 'Last Price',
      sortable: true,
      align: 'right',
      render: (value, row) => {
        const price = prices[row.ticker]
        return (
          <span className="tabular-nums">
            {formatPrice(price ? price.price : null)}
            {price && price.stale && (
              <span
                className="ml-1.5 text-[10px] font-medium text-muted-foreground"
                title="Updated daily 17:00-23:59"
              >
                stale
              </span>
            )}
          </span>
        )
      },
    },
    {
      key: 'value',
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
      render: (value, row) => <GainText value={value} pct={groupGainPct(row, prices[row.ticker])} />,
    },
  ]

  const rows = groupInvestments(investments).map((g) => ({
    ...g,
    avg: avgBuyPrice(g),
    price: prices[g.ticker] ? prices[g.ticker].price : null,
    value: groupValue(g, prices[g.ticker]),
    gain: groupGain(g, prices[g.ticker]),
  }))

  return (
    <DataTable
      columns={columns}
      data={rows}
      pageSize={10}
      showActions
      actions={(row) => (
        <GroupActions
          onAddLot={() => onAddLot(row)}
          onDeleteAll={() => onDeleteAll(row)}
        />
      )}
      renderExpanded={(row) => (
        <ExpandedPurchases
          group={row}
          price={prices[row.ticker]}
          onAddLot={() => onAddLot(row)}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
      emptyMessage={emptyMessage}
    />
  )
}