import { useState, useCallback, useEffect, useMemo, useRef } from 'react'
import { useNavigate, useParams, Link } from 'react-router'
import {
  ArrowLeft,
  TrendingUp,
  Wallet,
  Layers,
  Percent,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  ChartPie,
} from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../../components/ui/table'
import { getInvestments, getInvestmentPrices } from '../../lib/api'
import { toast } from '../../lib/toast.js'
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
  flattenGroups,
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

export default function DetailSahamIDXPage() {
  const { symbol } = useParams()
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [prices, setPrices] = useState({})
  const [loading, setLoading] = useState(true)
  const fetchedRef = useRef(null)

  const refresh = useCallback(async () => {
    try {
      const [invRes, priceRes] = await Promise.all([
        getInvestments({ search: String(symbol || '') }),
        getInvestmentPrices(),
      ])
      setItems(flattenGroups(invRes.data))
      const map = {}
      ;(priceRes.data || []).forEach((p) => {
        map[p.symbol] = p
      })
      setPrices(map)
    } catch (e) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }, [symbol])

  useEffect(() => {
    if (fetchedRef.current === symbol) return
    fetchedRef.current = symbol
    Promise.all([refresh()]).catch((e) => toast.error(e.message))
  }, [refresh, symbol])

  const group = useMemo(() => {
    const target = String(symbol || '').toUpperCase()
    return groupInvestments(items).find(
      (g) => g.type === 'stock' && String(g.ticker || '').toUpperCase() === target
    )
  }, [items, symbol])

  const price = group ? prices[group.ticker] : null

  const totals = useMemo(() => {
    if (!group) return null
    const invested = group.invested
    const value = groupValue(group, price)
    const gain = groupGain(group, price)
    const gainPct = groupGainPct(group, price)
    return { invested, value, gain, gainPct }
  }, [group, price])

  const purchases = useMemo(() => {
    if (!group) return []
    return [...group.purchases].sort((a, b) => new Date(b.date) - new Date(a.date))
  }, [group])

  if (loading && !group) {
    return (
      <div className="space-y-6">
        <div className="h-9 w-40 animate-pulse rounded-md bg-accent" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-xl bg-accent" />
          ))}
        </div>
        <div className="h-64 animate-pulse rounded-xl bg-accent" />
      </div>
    )
  }

  if (!group) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
          <div className="rounded-full bg-accent p-4">
            <ChartPie className="size-8 text-muted-foreground" />
          </div>
          <div>
            <h2 className="font-semibold">Stock not found</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              No stock investment matches ticker &quot;{symbol}&quot;.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link to="/dashboard/investments">
              <ArrowLeft className="size-4" /> Back to Investments
            </Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  const meta = typeMeta[group.type]
  const Icon = meta.icon
  const lots = lotsOf(group.units, group.type)

  const stats = [
    {
      label: 'Last Price',
      value: formatPrice(price ? price.price : null),
      change: signPct(totals.gainPct),
      hint: price && price.stale ? 'Stale · updated daily' : 'IDX close',
      icon: TrendingUp,
      up: totals.gainPct >= 0,
    },
    {
      label: 'Avg Buy Price',
      value: formatPrice(avgBuyPrice(group)),
      change: signPct(totals.gainPct),
      hint: `Cost basis of ${group.purchases.length} purchase${group.purchases.length > 1 ? 's' : ''}`,
      icon: Layers,
      up: true,
    },
    {
      label: 'Market Value',
      value: formatRp(totals.value),
      change: formatRpSigned(totals.gain),
      hint: `${formatUnits(group.units)} shares${lots ? ` (${formatUnits(lots)} lots)` : ''}`,
      icon: Wallet,
      up: totals.gain >= 0,
    },
    {
      label: 'Unrealized Gain',
      value: formatRpSigned(totals.gain),
      change: signPct(totals.gainPct),
      hint: `Invested ${formatRp(totals.invested)}`,
      icon: Percent,
      up: totals.gain >= 0,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4 min-w-0">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Back to investments"
            onClick={() => navigate('/dashboard/investments')}
          >
            <ArrowLeft className="size-5" />
          </Button>
          <div className="flex items-center gap-3 min-w-0">
            <div className="rounded-lg bg-accent p-2.5 shrink-0">
              <Icon className="size-5" />
            </div>
            <div className="min-w-0">
              <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight truncate">
                {group.ticker}
                <Badge variant="outline" className="font-normal capitalize">
                  {meta.label}
                </Badge>
              </h1>
              <p className="text-sm text-muted-foreground truncate">{group.name}</p>
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setLoading(true)
            refresh().finally(() => setLoading(false))
          }}
          disabled={loading}
        >
          <RefreshCw className={`size-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Purchase History</CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">
              {purchases.length} purchase{purchases.length > 1 ? 's' : ''}
              {lots ? (
                <>
                  {' '}
                  <span
                    className="rounded-full bg-accent px-1.5 py-0.5 font-medium text-muted-foreground"
                    title="1 lot = 100 shares"
                  >
                    {formatUnits(lots)} lots
                  </span>
                </>
              ) : null}
              {' '}· Total invested {formatRp(totals.invested)}
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Units</TableHead>
                <TableHead className="text-right">Buy Price</TableHead>
                <TableHead className="text-right">Invested</TableHead>
                <TableHead className="text-right">Value</TableHead>
                <TableHead className="text-right">Gain</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchases.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{formatDate(p.date)}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatUnits(p.units)}
                    {lotsOf(p.units, p.type) > 1 && (
                      <span
                        className="ml-1.5 rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
                        title="1 lot = 100 shares"
                      >
                        {formatUnits(lotsOf(p.units, p.type))} lots
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{formatPrice(p.buy_price)}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatRp(investedOf(p))}</TableCell>
                  <TableCell className="text-right font-medium tabular-nums">{formatRp(valueOf(p, price))}</TableCell>
                  <TableCell className="text-right">
                    <span
                      className={`inline-flex items-center justify-end gap-1 font-medium tabular-nums ${
                        gainOf(p, price) >= 0 ? 'text-emerald-600' : 'text-red-600'
                      }`}
                    >
                      {gainOf(p, price) >= 0 ? (
                        <ArrowUpRight className="size-3.5" />
                      ) : (
                        <ArrowDownRight className="size-3.5" />
                      )}
                      {formatRpSigned(gainOf(p, price))}
                      <span className="text-xs text-muted-foreground">({signPct(gainPctOf(p, price))})</span>
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
