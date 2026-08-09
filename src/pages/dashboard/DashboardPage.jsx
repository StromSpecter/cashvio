import { useState } from 'react'
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
import { RadialChart } from '../../components/ui/chart'

const formatRp = (value) => `Rp${Number(value || 0).toLocaleString('id-ID')}`

const stats = [
  { label: 'Total Balance', value: 'Rp24.562.800', change: '+12,4%', icon: Wallet, up: true, hint: 'All wallets & cards' },
  { label: 'Income', value: 'Rp8.420.000', change: '+4,1%', icon: ArrowDownToLine, up: true, hint: 'vs last month' },
  { label: 'Expenses', value: 'Rp3.215.600', change: '-2,3%', icon: ArrowUpFromLine, up: false, hint: 'vs last month' },
  { label: 'Savings Rate', value: '61,8%', change: '+3,4%', icon: PiggyBank, up: true, hint: 'Rp5.204.400 kept' },
]

const balanceRanges = {
  '7d': {
    labels: ['Jul 29', 'Jul 30', 'Jul 31', 'Agu 1', 'Agu 2', 'Agu 3', 'Agu 4'],
    income: [120, 80, 140, 95, 160, 110, 135],
    expense: [45, 60, 38, 72, 55, 48, 62],
  },
  '30d': {
    labels: ['Jul 6', 'Jul 10', 'Jul 14', 'Jul 18', 'Jul 22', 'Jul 26', 'Jul 30', 'Agu 3'],
    income: [110, 145, 95, 170, 130, 150, 120, 165],
    expense: [50, 65, 80, 45, 70, 90, 55, 75],
  },
  '90d': {
    labels: ['Mei', 'Jun', 'Jul', 'Agu'],
    income: [320, 410, 385, 450],
    expense: [180, 240, 210, 195],
  },
}

const balanceConfig = {
  income: { label: 'Income', color: 'var(--color-chart-2)' },
  expense: { label: 'Expenses', color: 'var(--color-destructive)' },
}

const spending = [
  { key: 'transport', label: 'Transportation', value: 32, amount: 1029000, color: 'var(--color-chart-3)' },
  { key: 'food', label: 'Food & Drinks', value: 26, amount: 836100, color: 'var(--color-chart-2)' },
  { key: 'shopping', label: 'Shopping', value: 18, amount: 578800, color: 'var(--color-chart-1)' },
  { key: 'entertainment', label: 'Entertainment', value: 14, amount: 450200, color: 'var(--color-chart-4)' },
  { key: 'other', label: 'Others', value: 10, amount: 279500, color: 'var(--color-chart-5)' },
]

const spendingConfig = Object.fromEntries(
  spending.map((s) => [s.key, { label: s.label, color: s.color }])
)

const cashFlowData = [
  { label: 'Mei', income: 320, expense: 180 },
  { label: 'Jun', income: 410, expense: 240 },
  { label: 'Jul', income: 385, expense: 210 },
  { label: 'Agu', income: 450, expense: 195 },
]

const cashFlowConfig = {
  income: { label: 'Income', color: 'var(--color-chart-2)' },
  expense: { label: 'Expenses', color: 'var(--color-destructive)' },
}

const accounts = [
  { id: 'acc-1', kind: 'card', name: 'Bank Central Asia', masked: '•••• •••• 4753', balance: 8500000, gradient: 'from-zinc-900 to-zinc-700', icon: CreditCard },
  { id: 'acc-2', kind: 'wallet', name: 'GoPay', masked: '• 5679', balance: 170000, gradient: 'from-emerald-600 to-teal-500', icon: Smartphone },
  { id: 'acc-3', kind: 'wallet', name: 'Dana', masked: '• 2411', balance: 895000, gradient: 'from-blue-600 to-cyan-500', icon: Smartphone },
  { id: 'acc-4', kind: 'wallet', name: 'ShopeePay', masked: '• 8892', balance: 2147800, gradient: 'from-orange-600 to-amber-500', icon: Smartphone },
]

const categoryMeta = {
  food: { icon: UtensilsCrossed, tone: 'text-emerald-600' },
  transport: { icon: Car, tone: 'text-cyan-600' },
  shopping: { icon: ShoppingBag, tone: 'text-blue-600' },
  entertainment: { icon: Clapperboard, tone: 'text-red-600' },
  salary: { icon: Landmark, tone: 'text-emerald-600' },
}

const insights = [
  {
    title: 'Top Spending',
    label: 'Transportation',
    value: 'Rp1.029.000',
    sub: '32% of this month',
    icon: Car,
    tone: 'text-cyan-600',
    bg: 'var(--color-chart-3)',
  },
  {
    title: 'Largest Expense',
    label: 'Bensin Pertamax',
    value: 'Rp300.000',
    sub: 'Aug 10 · BCA',
    icon: ReceiptText,
    tone: 'text-orange-600',
    bg: 'var(--color-chart-4)',
  },
  {
    title: 'Estimated Savings',
    label: 'This month',
    value: 'Rp5.204.400',
    sub: '+4,8% vs July',
    icon: Sparkles,
    tone: 'text-emerald-600',
    bg: 'var(--color-chart-2)',
  },
]

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
    header: 'Wallet/Card',
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
      <Badge
        variant={
          value === 'completed'
            ? 'success'
            : value === 'failed'
              ? 'destructive'
              : 'warning'
        }
        className="capitalize"
      >
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
  const [range, setRange] = useState('30d')
  const [transactions, setTransactions] = useState([
    { id: 1, name: 'Gaji Bulan Ini', amount: '+Rp4.200.000', status: 'completed', date: 'Agu 10', wallet: 'BCA', category: 'salary', categoryLabel: 'Salary' },
    { id: 2, name: 'Bensin Pertamax', amount: '-Rp300.000', status: 'completed', date: 'Agu 10', wallet: 'BCA', category: 'transport', categoryLabel: 'Transportation' },
    { id: 3, name: 'MC Donald', amount: '-Rp65.000', status: 'pending', date: 'Agu 9', wallet: 'GoPay', category: 'food', categoryLabel: 'Food & Drinks' },
    { id: 4, name: 'Netflix', amount: '-Rp59.000', status: 'completed', date: 'Agu 8', wallet: 'BCA', category: 'entertainment', categoryLabel: 'Entertainment' },
    { id: 5, name: 'Uniqlo', amount: '-Rp379.000', status: 'completed', date: 'Agu 7', wallet: 'Dana', category: 'shopping', categoryLabel: 'Shopping' },
    { id: 6, name: 'Grab Car', amount: '-Rp82.000', status: 'failed', date: 'Agu 6', wallet: 'ShopeePay', category: 'transport', categoryLabel: 'Transportation' },
  ])

  const handleDuplicate = (tx) => {
    setTransactions((prev) => [
      { ...tx, id: Date.now(), name: `${tx.name} (Copy)` },
      ...prev,
    ])
  }

  const tableActions = (row) => (
    <DashboardActions row={row} onDuplicate={handleDuplicate} />
  )

  const currentRange = balanceRanges[range]
  const balanceData = currentRange.labels.map((label, i) => ({
    label,
    income: currentRange.income[i],
    expense: currentRange.expense[i],
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

  const budgetUsedPct = 68

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{greeting}, Alex</h1>
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <CalendarDays className="size-3.5" />
            {dateLabel} · Here's what's happening with your money.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline">
            <Download className="size-4" /> Export
          </Button>
          <Button>
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
              <AreaChart data={balanceData} showLegend fit />
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
            <CardDescription>Where your money went this month</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={spendingConfig} formatValue={formatRp}>
              <PieChart
                data={spending.map(({ key, label, amount }) => ({ key, label, value: amount }))}
                innerRadius={70}
                showLegend={false}
              />
            </ChartContainer>
            <div className="mt-4 space-y-2">
              {spending.map((s) => (
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
                    <span className="w-10 text-right text-xs text-muted-foreground tabular-nums">{s.value}%</span>
                  </div>
                </div>
              ))}
            </div>
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

        <Card>
          <CardHeader>
            <CardTitle>Monthly Budget</CardTitle>
            <CardDescription>Budget used up to today</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <ChartContainer
              config={{ budget: { label: 'Budget used', color: 'var(--color-chart-3)' } }}
              formatValue={(v) => `${v}%`}
              className="w-full max-w-[14rem]"
            >
              <RadialChart value={budgetUsedPct} max={100} height={180} showLabel label="Budget Used" />
            </ChartContainer>
            <div className="w-full space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Allocated</span>
                <span className="font-medium tabular-nums">Rp2.110.000</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Remaining</span>
                <span className="font-medium text-emerald-600 tabular-nums">Rp992.000</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Accounts</h2>
            <p className="text-sm text-muted-foreground">Wallets & cards, total across all</p>
          </div>
          <Button variant="outline" size="sm">
            Manage
          </Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {accounts.map((account) => (
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
            data={transactions}
            pageSize={5}
            showActions
            actions={tableActions}
          />
        </CardContent>
      </Card>
    </div>
  )
}