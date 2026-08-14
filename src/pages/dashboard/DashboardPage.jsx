import { useEffect, useMemo, useState, useCallback, useRef } from 'react'
import {
  Wallet,
  ArrowDownToLine,
  ArrowUpFromLine,
  ArrowDownRight,
  ArrowUpRight,
  Plus,
  MoreHorizontal,
  Copy,
  CalendarDays,
  Sparkles,
  ReceiptText,
  PiggyBank,
  CreditCard,
  Smartphone,
  Banknote,
  UtensilsCrossed,
  Car,
  ShoppingBag,
  Clapperboard,
  Landmark,
  Download,
} from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '../../components/ui/avatar'
import { Tabs, TabsList, TabsTrigger } from '../../components/ui/tabs'
import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownSeparator,
} from '../../components/ui/dropdown'
import { DataTable } from '../../components/ui/table'
import { ChartContainer } from '../../components/ui/chart'
import { AreaChart } from '../../components/ui/chart'
import { BarChart } from '../../components/ui/chart'
import { PieChart } from '../../components/ui/chart'
import { getDashboardOverview, createTransaction } from '../../lib/api'
import { useAuth } from '../../lib/auth-context.js'
import { toast } from '../../lib/toast.js'
import { DashboardSkeleton } from '../../components/templates'
import { AddTransactionDialog } from '../../components/dialogs/AddTransactionDialog'

const formatRp = (value) => `Rp${Number(value || 0).toLocaleString('id-ID')}`

const signPct = (value) => `${value >= 0 ? '+' : ''}${Number(value || 0).toLocaleString('id-ID', { maximumFractionDigits: 1 })}%`

const categoryLabels = {
  income: 'Income',
  transfer: 'Transfer',
  salary: 'Salary',
  freelance: 'Freelance',
  gift: 'Gift',
  bonus: 'Bonus',
  food: 'Food & Drinks',
  transportation: 'Transportation',
  housing: 'Housing',
  shopping: 'Shopping',
  entertainment: 'Entertainment',
  health: 'Health',
  education: 'Education',
  groceries: 'Groceries',
  subscription: 'Subscription',
  travel: 'Travel',
}

const categoryMeta = {
  food: { icon: UtensilsCrossed, tone: 'text-emerald-600' },
  transportation: { icon: Car, tone: 'text-cyan-600' },
  transport: { icon: Car, tone: 'text-cyan-600' },
  shopping: { icon: ShoppingBag, tone: 'text-blue-600' },
  entertainment: { icon: Clapperboard, tone: 'text-red-600' },
  salary: { icon: Landmark, tone: 'text-emerald-600' },
}

const cardGradients = [
  'from-zinc-900 to-zinc-700',
  'from-emerald-600 to-teal-500',
  'from-blue-600 to-cyan-500',
  'from-orange-600 to-amber-500',
]

const spendingPalette = [
  'var(--color-chart-1)',
  'var(--color-chart-2)',
  'var(--color-chart-3)',
  'var(--color-chart-4)',
  'var(--color-chart-5)',
]

const statusVariant = {
  completed: 'success',
  pending: 'warning',
  failed: 'destructive',
}

const formatDate = (value) => {
  if (!value) return ''
  return new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const balanceConfig = {
  income: { label: 'Income', color: 'var(--color-chart-2)' },
  expense: { label: 'Expenses', color: 'var(--color-destructive)' },
}

const cashFlowConfig = {
  income: { label: 'Income', color: 'var(--color-chart-2)' },
  expense: { label: 'Expenses', color: 'var(--color-destructive)' },
}

const columns = [
  {
    key: 'name',
    header: 'Transaction',
    sortable: true,
    render: (value, row) => {
      const meta = categoryMeta[row.category] || { icon: ReceiptText, tone: 'text-zinc-600' }
      const Icon = meta.icon
      return (
        <div className="flex items-center gap-3 min-w-0">
          <Avatar className="size-9 shrink-0 bg-accent">
            <AvatarImage src="" alt={row.name} />
            <AvatarFallback className="text-xs">
              <Icon className={`size-4 ${meta.tone}`} />
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="font-medium truncate">{value}</p>
            <p className="text-xs text-muted-foreground truncate">{row.categoryLabel}</p>
          </div>
        </div>
      )
    },
  },
  {
    key: 'wallet',
    header: 'Account',
    sortable: true,
    render: (value) => <Badge variant="outline" className="font-normal">{value}</Badge>,
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
      <span className={value.startsWith('+') ? 'text-emerald-600' : ''}>{value}</span>
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

function DashboardActions({ row, onDuplicate }) {
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="ghost" size="icon" aria-label="Transaction options">
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownTrigger>
      <DropdownContent align="end">
        <DropdownItem onClick={() => onDuplicate(row)}>
          <Copy className="size-4 mr-2" /> Duplicate
        </DropdownItem>
      </DropdownContent>
    </Dropdown>
  )
}

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

function InsightCard({ insight }) {
  const Icon = insight.icon
  return (
    <Card>
      <CardContent className="flex items-start gap-3 pt-6">
        <div
          className="flex size-10 shrink-0 items-center justify-center rounded-xl text-white"
          style={{ background: insight.bg }}
        >
          <Icon className={`size-5 ${insight.tone}`} />
        </div>
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">{insight.title}</p>
          <p className="truncate text-sm font-bold">{insight.label}</p>
          <p className="text-lg font-semibold">{insight.value}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{insight.sub}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function AccountCard({ account }) {
  const Icon = account.icon
  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${account.gradient} p-4 text-white shadow-md`}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold">{account.name}</span>
        <Badge
          variant="outline"
          className="border-white/30 bg-white/10 text-white capitalize hover:bg-white/10"
        >
          {account.kind}
        </Badge>
      </div>
      <p className="mt-4 text-xs tracking-[0.2em] text-white/70">{account.masked}</p>
      <div className="mt-1 flex items-end justify-between">
        <div className="text-xl font-bold tracking-tight">{formatRp(account.balance)}</div>
        <Icon className="size-5 text-white/70" />
      </div>
    </div>
  )
}

export function DashboardPage() {
  const { user } = useAuth()
  const [range, setRange] = useState('30d')
  const [overview, setOverview] = useState(null)
  const [loading, setLoading] = useState(true)
  const [transactions, setTransactions] = useState([])
  const [addOpen, setAddOpen] = useState(false)
  const fetchedRef = useRef(false)

  const fetchAll = useCallback(async () => {
    const ovRes = await getDashboardOverview()
    return { overview: ovRes.data }
  }, [])

  const applyAll = useCallback(({ overview }) => {
    setOverview(overview)
  }, [])

  useEffect(() => {
    if (fetchedRef.current) return
    fetchedRef.current = true
    fetchAll()
      .then(applyAll)
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false))
  }, [fetchAll, applyAll])

  const accountMap = useMemo(() => {
    const map = {}
    if (!overview) return map
    overview.accounts?.wallets?.forEach((w) => {
      map[`wallet:${w.id}`] = w.name
    })
    overview.accounts?.cards?.forEach((c) => {
      map[`card:${c.id}`] = c.bank
    })
    if (overview.accounts?.cash) {
      map[`cash:${overview.accounts.cash.id}`] = 'Cash'
    }
    return map
  }, [overview])

  const accountList = useMemo(() => {
    if (!overview) return []
    const items = []
    overview.accounts?.wallets?.forEach((w, i) => {
      items.push({
        id: `wallet:${w.id}`,
        kind: 'wallet',
        name: w.name,
        masked: w.masked || '••••',
        balance: w.balance_idr,
        gradient: cardGradients[(i + 1) % cardGradients.length],
        icon: Smartphone,
      })
    })
    overview.accounts?.cards?.forEach((c, i) => {
      items.push({
        id: `card:${c.id}`,
        kind: 'card',
        name: c.bank,
        masked: c.masked || '••••',
        balance: c.balance_idr,
        gradient: cardGradients[i % cardGradients.length],
        icon: CreditCard,
      })
    })
    if (overview.accounts?.cash) {
      items.push({
        id: `cash:${overview.accounts.cash.id}`,
        kind: 'cash',
        name: 'Cash',
        masked: 'CASH',
        balance: overview.accounts.cash.balance_idr,
        gradient: cardGradients[(items.length + 2) % cardGradients.length],
        icon: Banknote,
      })
    }
    return items
  }, [overview])

  const dialogWallets = useMemo(
    () => (overview?.accounts?.wallets || []).map((w) => ({ id: w.id, name: w.name, balance: w.balance_idr })),
    [overview]
  )

  const dialogCards = useMemo(
    () => (overview?.accounts?.cards || []).map((c) => ({ id: c.id, name: c.bank, balance: c.balance_idr })),
    [overview]
  )

  const dialogCash = overview?.accounts?.cash || null

  const handleAdd = async (form) => {
    try {
      await createTransaction(form)
      toast.success('Transaction added')
      fetchAll()
        .then(applyAll)
        .catch((e) => toast.error(e.message))
    } catch (e) {
      toast.error(e.message)
    }
  }

  const recentRows = useMemo(() => {
    return (overview?.recent_transactions || []).map((tx) => ({
      id: tx.id,
      name: tx.name,
      amount: `${tx.type === 'income' ? '+' : '-'}${formatRp(Math.abs(tx.amount))}`,
      status: tx.status,
      date: formatDate(tx.date),
      wallet: accountMap[`${tx.account_type}:${tx.account_id}`] || '—',
      category: tx.category,
      categoryLabel: categoryLabels[tx.category] || tx.category,
    }))
  }, [overview, accountMap])

  const handleDuplicate = (tx) => {
    setTransactions((prev) => [
      { ...tx, id: Date.now(), name: `${tx.name} (Copy)` },
      ...prev,
    ])
  }

  const tableActions = (row) => (
    <DashboardActions row={row} onDuplicate={handleDuplicate} />
  )

  const currentBalance = overview?.balance_overview?.[range] || []
  const spendingData = useMemo(() => {
    const colors = [...spendingPalette]
    return (overview?.spending || []).map((s, i) => ({
      key: s.category,
      label: s.label,
      value: s.amount,
      amount: s.amount,
      percentage: s.percentage,
      color: colors[i % colors.length],
    }))
  }, [overview])

  const spendingConfig = Object.fromEntries(
    spendingData.map((s) => [s.key, { label: s.label, color: s.color }])
  )

  const cashFlowData = (overview?.cash_flow || []).map((p) => ({
    label: p.label,
    income: p.income,
    expense: p.expense,
  }))

  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
  const dateLabel = now.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const stats = useMemo(() => {
    const income = overview?.income || 0
    const expense = overview?.expense || 0
    const savings = overview?.savings || 0
    const savingsRate = overview?.savings_rate || 0
    return [
      { label: 'Total Balance', value: formatRp(overview?.total_balance || 0), change: signPct(overview?.changes?.income || 0), icon: Wallet, up: (overview?.changes?.income || 0) >= 0, hint: 'All wallets, cards & cash' },
      { label: 'Income', value: formatRp(income), change: signPct(overview?.changes?.income || 0), icon: ArrowDownToLine, up: (overview?.changes?.income || 0) >= 0, hint: 'vs last month' },
      { label: 'Expenses', value: formatRp(expense), change: signPct(overview?.changes?.expense || 0), icon: ArrowUpFromLine, up: (overview?.changes?.expense || 0) <= 0, hint: 'vs last month' },
      { label: 'Savings Rate', value: `${savingsRate.toLocaleString('id-ID', { maximumFractionDigits: 1 })}%`, change: signPct(overview?.changes?.savings || 0), icon: PiggyBank, up: (overview?.changes?.savings || 0) >= 0, hint: `${formatRp(Math.max(savings, 0))} kept` },
    ]
  }, [overview])

  const insights = useMemo(() => {
    const top = overview?.spending?.[0]
    const largest = overview?.largest_expense
    const income = overview?.income || 0
    const expense = overview?.expense || 0
    const savings = income - expense
    return [
      {
        title: 'Top Spending',
        label: top ? top.label : '—',
        value: top ? formatRp(top.amount) : 'Rp0',
        sub: top ? `${Math.round(top.percentage)}% of this month` : 'No spending yet',
        icon: top ? (categoryMeta[top.category]?.icon || ReceiptText) : ReceiptText,
        tone: 'text-cyan-600',
        bg: 'var(--color-chart-3)',
      },
      {
        title: 'Largest Expense',
        label: largest ? largest.name : '—',
        value: largest ? formatRp(Math.abs(largest.amount)) : 'Rp0',
        sub: largest ? `${formatDate(largest.date)} · ${accountMap[`${largest.account_type}:${largest.account_id}`] || '—'}` : 'No expense yet',
        icon: ReceiptText,
        tone: 'text-orange-600',
        bg: 'var(--color-chart-4)',
      },
      {
        title: 'Estimated Savings',
        label: 'This month',
        value: formatRp(savings),
        sub: `${signPct(overview?.changes?.savings || 0)} vs last month`,
        icon: Sparkles,
        tone: 'text-emerald-600',
        bg: 'var(--color-chart-2)',
      },
    ]
  }, [overview, accountMap])

  if (loading) return <DashboardSkeleton />

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{greeting}, {user?.name || 'there'}</h1>
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <CalendarDays className="size-3.5" />
            {dateLabel} · Here's what's happening with your money.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline">
            <Download className="size-4" /> Export
          </Button>
          <Button onClick={() => setAddOpen(true)}>
            <Plus className="size-4" /> New Transaction
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {insights.map((insight) => (
          <InsightCard key={insight.title} insight={insight} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="flex flex-col lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Balance Overview</CardTitle>
              <CardDescription>Income & expense trend for the last {range === '7d' ? '7 days' : range === '30d' ? '30 days' : '90 days'}</CardDescription>
            </div>
            <Tabs value={range} onValueChange={setRange}>
              <TabsList>
                <TabsTrigger value="7d">7d</TabsTrigger>
                <TabsTrigger value="30d">30d</TabsTrigger>
                <TabsTrigger value="90d">90d</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col">
            <ChartContainer config={balanceConfig} formatValue={formatRp} className="flex-1">
              <AreaChart data={currentBalance} showLegend fit />
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
            <CardDescription>Where your money went this month</CardDescription>
          </CardHeader>
          <CardContent>
            {spendingData.length > 0 ? (
              <>
                <ChartContainer config={spendingConfig} formatValue={formatRp}>
                  <PieChart
                    data={spendingData.map(({ key, label, value }) => ({ key, label, value }))}
                    innerRadius={70}
                    showLegend={false}
                  />
                </ChartContainer>
                <div className="mt-4 space-y-2">
                  {spendingData.map((s) => (
                    <div
                      key={s.key}
                      className="flex items-center justify-between gap-3 rounded-lg border border-border/50 px-3 py-2"
                    >
                      <div className="flex min-w-0 items-center gap-2">
                        <span className="size-2.5 shrink-0 rounded-full" style={{ background: s.color }} />
                        <span className="truncate text-sm">{s.label}</span>
                      </div>
                      <div className="flex shrink-0 items-center gap-3">
                        <span className="text-sm font-medium tabular-nums">{formatRp(s.amount)}</span>
                        <span className="w-10 text-right text-xs text-muted-foreground tabular-nums">{Math.round(s.percentage)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="py-10 text-center text-sm text-muted-foreground">No expenses this month yet.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Cash Flow</CardTitle>
            <CardDescription>Income vs expenses per month</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={cashFlowConfig} formatValue={formatRp} className="h-64">
              <BarChart data={cashFlowData} showLegend height={256} />
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Accounts</h2>
            <p className="text-sm text-muted-foreground">Wallets, cards & cash, total across all</p>
          </div>
          <Button variant="outline" size="sm">
            Manage
          </Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {accountList.map((account) => (
            <AccountCard key={account.id} account={account} />
          ))}
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your latest account activity</CardDescription>
          </div>
          <Dropdown>
            <DropdownTrigger>
              <Button variant="ghost" size="icon" aria-label="More options">
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownTrigger>
            <DropdownContent align="end">
              <DropdownItem>View all</DropdownItem>
              <DropdownItem>Download CSV</DropdownItem>
              <DropdownSeparator />
              <DropdownItem className="text-destructive focus:text-destructive">
                Clear history
              </DropdownItem>
            </DropdownContent>
          </Dropdown>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            columns={columns}
            data={transactions.length > 0 ? transactions : recentRows}
            pageSize={5}
            showActions
            actions={tableActions}
          />
        </CardContent>
      </Card>

      <AddTransactionDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onSubmit={handleAdd}
        wallets={dialogWallets}
        cards={dialogCards}
        cash={dialogCash}
      />
    </div>
  )
}
