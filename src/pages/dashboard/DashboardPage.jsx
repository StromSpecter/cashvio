import { useState } from 'react'
import { TrendingUp, Wallet, ArrowDownToLine, ArrowUpFromLine, ArrowDownRight, ArrowUpRight, Plus, MoreHorizontal, Copy } from 'lucide-react'
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
import { ChartContainer, ChartLegend } from '../../components/ui/chart'
import { AreaChart } from '../../components/ui/chart'
import { BarChart } from '../../components/ui/chart'
import { PieChart } from '../../components/ui/chart'
import { RadialChart } from '../../components/ui/chart'

const stats = [
  { label: 'Total Balance', value: 'Rp24.562.800', change: '+12.4%', icon: Wallet, up: true },
  { label: 'Pemasukan', value: 'Rp8.420.000', change: '+4.1%', icon: ArrowDownToLine, up: true },
  { label: 'Pengeluaran', value: 'Rp3.215.600', change: '-2.3%', icon: ArrowUpFromLine, up: false },
  { label: 'Kartu Aktif', value: '2', change: '+1 bulan ini', icon: TrendingUp, up: true },
]

const formatRp = (value) => `Rp${value.toLocaleString('id-ID')}`

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
  income: { label: 'Pemasukan', color: 'var(--color-chart-2)' },
  expense: { label: 'Pengeluaran', color: 'var(--color-destructive)' },
}

const spending = [
  { key: 'rent', label: 'Rent & Housing', value: 38, color: 'var(--color-chart-1)' },
  { key: 'food', label: 'Food & Dining', value: 24, color: 'var(--color-chart-2)' },
  { key: 'transport', label: 'Transportation', value: 16, color: 'var(--color-chart-3)' },
  { key: 'entertainment', label: 'Entertainment', value: 12, color: 'var(--color-chart-4)' },
  { key: 'other', label: 'Other', value: 10, color: 'var(--color-chart-5)' },
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
  income: { label: 'Pemasukan', color: 'var(--color-chart-2)' },
  expense: { label: 'Pengeluaran', color: 'var(--color-destructive)' },
}

const columns = [
  {
    key: 'name',
    header: 'Transaction',
    sortable: true,
    render: (value, row) => (
      <div className="flex items-center gap-3 min-w-0">
        <Avatar className="size-9 shrink-0">
          <AvatarImage src="" alt={row.name} />
          <AvatarFallback className="text-xs">{row.initials}</AvatarFallback>
        </Avatar>
        <span className="font-medium truncate">{value}</span>
      </div>
    ),
  },
  {
    key: 'wallet',
    header: 'Wallet/Card',
    sortable: true,
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
      <span className={value.startsWith('+') ? 'text-emerald-600' : ''}>
        {value}
      </span>
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
        <p
          className={`mt-1 flex items-center gap-1 text-xs ${
            stat.up ? 'text-emerald-600' : 'text-red-600'
          }`}
        >
          {stat.up ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
          {stat.change}
          <span className="text-muted-foreground">vs last month</span>
        </p>
      </CardContent>
    </Card>
  )
}

export function DashboardPage() {
  const [range, setRange] = useState('30d')
  const [transactions, setTransactions] = useState([
    { id: 1, name: 'Acme Corp', amount: '+Rp2.450.000', status: 'completed', initials: 'AC', date: 'Aug 3', wallet: 'Dana' },
    { id: 2, name: 'Netflix', amount: '-Rp15.990', status: 'completed', initials: 'NF', date: 'Aug 2', wallet: 'ShopeePay' },
    { id: 3, name: 'Starbucks', amount: '-Rp6.750', status: 'pending', initials: 'SB', date: 'Aug 2', wallet: 'GoPay' },
    { id: 4, name: 'GitHub', amount: '-Rp9.000', status: 'completed', initials: 'GH', date: 'Aug 1', wallet: 'Dana' },
    { id: 5, name: 'Acme Corp', amount: '+Rp2.450.000', status: 'completed', initials: 'AC', date: 'Aug 1', wallet: 'Dana' },
    { id: 6, name: 'Uber', amount: '-Rp32.100', status: 'failed', initials: 'UB', date: 'Jul 31', wallet: 'GoPay' },
  ])

  const handleDuplicate = (tx) => {
    setTransactions((prev) => [
      { ...tx, id: Date.now(), name: `${tx.name} (Copy)` },
      ...prev,
    ])
  }

  const tableActions = (row) => (
    <DashboardActions
      row={row}
      onDuplicate={handleDuplicate}
    />
  )

  const currentRange = balanceRanges[range]
  const balanceData = currentRange.labels.map((label, i) => ({
    label,
    income: currentRange.income[i],
    expense: currentRange.expense[i],
  }))
  const spendingTotal = spending.reduce((sum, s) => sum + s.value, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
          <p className="text-sm text-muted-foreground">
            Welcome back, Alex. Here's what's happening with your money today.
          </p>
        </div>
        <Button>
          <Plus className="size-4" />
          New Transaction
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Balance Overview</CardTitle>
              <CardDescription>Arus pemasukan dan pengeluaran untuk {range}</CardDescription>
            </div>
            <Tabs value={range} onValueChange={setRange}>
              <TabsList>
                <TabsTrigger value="7d">7d</TabsTrigger>
                <TabsTrigger value="30d">30d</TabsTrigger>
                <TabsTrigger value="90d">90d</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <ChartContainer config={balanceConfig} formatValue={formatRp} className="h-64">
              <AreaChart data={balanceData} showLegend height={256} />
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
            <CardDescription>Alokasi pengeluaran bulan ini</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={spendingConfig} formatValue={(v) => `${v}%`}>
              <PieChart
                data={spending}
                innerRadius={70}
                centerValue={`${spendingTotal}%`}
                centerLabel="Total"
              />
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Cash Flow</CardTitle>
            <CardDescription>Perbandingan pemasukan vs pengeluaran per bulan</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={cashFlowConfig} formatValue={formatRp} className="h-64">
              <BarChart data={cashFlowData} showLegend height={256} />
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Budget Bulanan</CardTitle>
            <CardDescription>Penggunaan budget hingga hari ini</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <ChartContainer
              config={{ budget: { label: 'Budget Terpakai', color: 'var(--color-chart-3)' } }}
              formatValue={(v) => `${v}%`}
              className="w-full max-w-[14rem]"
            >
              <RadialChart value={68} max={100} height={180} showLabel label="Budget Terpakai" />
            </ChartContainer>
            <ChartLegend
              className="mt-0"
              items={[{ label: 'Sisa budget Rp1.625.000', color: 'var(--color-chart-3)' }]}
            />
          </CardContent>
        </Card>
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
