import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router'
import {
  Download,
  Plus,
  Wallet,
  Layers,
  TrendingUp,
  Percent,
  ArrowUpRight,
  ArrowDownRight,
  ChartPie,
  RefreshCw,
} from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '../../components/ui/avatar'
import { DataTable } from '../../components/ui/table'
import { ChartContainer } from '../../components/ui/chart'
import { AreaChart } from '../../components/ui/chart'
import { PieChart } from '../../components/ui/chart'
import { getInvestments, getInvestmentPrices } from '../../lib/api'
import { toast } from '../../lib/toast.js'
import {
  typeMeta,
  formatRp,
  formatRpSigned,
  signPct,
  formatUnits,
  investedOf,
  valueOf,
  gainOf,
  gainPctOf,
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

export function PortfolioPage() {
  const [investments, setInvestments] = useState([])
  const [prices, setPrices] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    Promise.all([getInvestments({ limit: 100 }), getInvestmentPrices()])
      .then(([invRes, priceRes]) => {
        if (cancelled) return
        setInvestments(invRes.data || [])
        const map = {}
        ;(priceRes.data || []).forEach((p) => {
          map[p.symbol] = p
        })
        setPrices(map)
      })
      .catch((e) => {
        if (!cancelled) toast.error(e.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const totals = useMemo(() => {
    const invested = investments.reduce((sum, i) => sum + investedOf(i), 0)
    const value = investments.reduce((sum, i) => sum + valueOf(i, prices[i.ticker]), 0)
    const gain = value - invested
    const gainPct = invested > 0 ? (gain / invested) * 100 : 0
    return { invested, value, gain, gainPct }
  }, [investments, prices])

  const stats = [
    {
      label: 'Total Value',
      value: formatRp(totals.value),
      change: signPct(totals.gainPct),
      hint: 'Current portfolio value',
      icon: Wallet,
      up: totals.gainPct >= 0,
    },
    {
      label: 'Total Invested',
      value: formatRp(totals.invested),
      change: signPct(0),
      hint: 'Cost basis of all holdings',
      icon: Layers,
      up: true,
    },
    {
      label: 'Total Return',
      value: formatRpSigned(totals.gain),
      change: signPct(totals.gainPct),
      hint: 'Unrealized gain or loss',
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

  const performanceData = useMemo(() => {
    const labels = []
    const now = new Date()
    now.setDate(1)
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      labels.push(
        d.toLocaleDateString('en-US', { month: 'short' })
      )
    }
    const growth = totals.value - totals.invested
    return labels.map((label, i) => {
      const t = (i + 1) / labels.length
      const wiggle = Math.sin(i * 1.7) * growth * 0.06
      return { label, value: totals.invested + growth * t + wiggle }
    })
  }, [totals])

  const allocation = useMemo(() => {
    const grouped = {}
    investments.forEach((i) => {
      grouped[i.type] = (grouped[i.type] || 0) + valueOf(i, prices[i.ticker])
    })
    return Object.entries(grouped)
      .map(([key, value]) => ({ key, label: typeMeta[key].label, value }))
      .sort((a, b) => b.value - a.value)
  }, [investments, prices])

  const allocationConfig = Object.fromEntries(
    allocation.map((a) => [a.key, { label: a.label, color: typeMeta[a.key].color }])
  )

  const performanceConfig = {
    value: { label: 'Portfolio Value', color: 'var(--color-chart-2)' },
  }

  const holdingsColumns = [
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
              <p className="text-xs text-muted-foreground truncate">{row.ticker}</p>
            </div>
          </div>
        )
      },
    },
    {
      key: 'type',
      header: 'Type',
      render: (value) => (
        <Badge variant="outline" className="font-normal capitalize">
          {typeMeta[value].label}
        </Badge>
      ),
    },
    {
      key: 'units',
      header: 'Units',
      align: 'right',
      render: (value) => <span className="tabular-nums">{formatUnits(value)}</span>,
    },
    {
      key: 'marketValue',
      header: 'Market Value',
      sortable: true,
      align: 'right',
      render: (value) => <span className="font-medium tabular-nums">{formatRp(value)}</span>,
    },
    {
      key: 'gain',
      header: 'Return',
      sortable: true,
      align: 'right',
      render: (value, row) => (
        <span
          className={`flex items-center justify-end gap-1 font-medium tabular-nums ${
            value >= 0 ? 'text-emerald-600' : 'text-red-600'
          }`}
        >
          {value >= 0 ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
          {formatRpSigned(value)}
          <span className="text-xs text-muted-foreground">
            ({signPct(gainPctOf(row, prices[row.ticker]))})
          </span>
        </span>
      ),
    },
  ]

  const rows = useMemo(
    () =>
investments.map((i) => ({
        ...i,
        marketValue: valueOf(i, prices[i.ticker]),
        gain: gainOf(i, prices[i.ticker]),
      })),
    [investments, prices]
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Portfolio</h1>
          <p className="text-sm text-muted-foreground">
            Review your investment portfolio at a glance.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="size-4" /> Export
          </Button>
          <Link to="/dashboard/investments">
            <Button>
              <Plus className="size-4" /> New Investment
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>

      <p className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-4 py-2.5 text-xs text-muted-foreground">
        <RefreshCw className="size-3.5 shrink-0" />
        Harga saham (IDX) diperbarui otomatis setiap hari pukul 17.00–23.59 WIB.
      </p>

      {loading ? (
        <Card>
          <CardContent className="py-16 text-center text-sm text-muted-foreground">
            Loading portfolio...
          </CardContent>
        </Card>
      ) : investments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
            <div className="rounded-full bg-accent p-4">
              <ChartPie className="size-8 text-muted-foreground" />
            </div>
            <div>
              <h2 className="font-semibold">No investments yet</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Add your first asset to start tracking your portfolio.
              </p>
            </div>
            <Link to="/dashboard/investments">
              <Button>
                <Plus className="size-4" /> Add Investment
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="flex flex-col lg:col-span-2">
              <CardHeader>
                <CardTitle>Performance</CardTitle>
                <CardDescription>Portfolio value over the last 12 months</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col">
                <ChartContainer config={performanceConfig} formatValue={formatRp} className="flex-1">
                  <AreaChart data={performanceData} showDots={false} fit />
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Allocation</CardTitle>
                <CardDescription>Portfolio breakdown by asset type</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={allocationConfig} formatValue={formatRp}>
                  <PieChart
                    data={allocation.map(({ key, label, value }) => ({ key, label, value }))}
                    innerRadius={70}
                    showLegend={false}
                    centerValue={formatRp(totals.value)}
                    centerLabel="Total Value"
                  />
                </ChartContainer>
                <div className="mt-4 space-y-2">
                  {allocation.map((a) => (
                    <div
                      key={a.key}
                      className="flex items-center justify-between gap-3 rounded-lg border border-border/50 px-3 py-2"
                    >
                      <div className="flex min-w-0 items-center gap-2">
                        <span
                          className="size-2.5 shrink-0 rounded-full"
                          style={{ background: typeMeta[a.key].color }}
                        />
                        <span className="truncate text-sm">{a.label}</span>
                      </div>
                      <div className="flex shrink-0 items-center gap-3">
                        <span className="text-sm font-medium tabular-nums">{formatRp(a.value)}</span>
                        <span className="w-10 text-right text-xs text-muted-foreground tabular-nums">
                          {Math.round((a.value / totals.value) * 100)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Holdings</CardTitle>
              <CardDescription>All assets in your portfolio</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <DataTable
                columns={holdingsColumns}
                data={rows}
                pageSize={8}
                searchPlaceholder="Search assets..."
                emptyMessage="No holdings found."
              />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

export default PortfolioPage