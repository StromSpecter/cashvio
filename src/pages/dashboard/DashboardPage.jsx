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

const stats = [
  { label: 'Total Balance', value: 'Rp24.562.800', change: '+12.4%', icon: Wallet, up: true },
  { label: 'Pemasukan', value: 'Rp8.420.000', change: '+4.1%', icon: ArrowDownToLine, up: true },
  { label: 'Pengeluaran', value: 'Rp3.215.600', change: '-2.3%', icon: ArrowUpFromLine, up: false },
  { label: 'Kartu Aktif', value: '2', change: '+1 bulan ini', icon: TrendingUp, up: true },
]

const spending = [
  { category: 'Rent & Housing', amount: 38, color: 'bg-primary' },
  { category: 'Food & Dining', amount: 24, color: 'bg-emerald-500' },
  { category: 'Transportation', amount: 16, color: 'bg-amber-500' },
  { category: 'Entertainment', amount: 12, color: 'bg-purple-500' },
  { category: 'Other', amount: 10, color: 'bg-muted-foreground' },
]

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
              <CardDescription>Your account activity for the last 30 days</CardDescription>
            </div>
            <Tabs defaultValue="30d">
              <TabsList>
                <TabsTrigger value="7d">7d</TabsTrigger>
                <TabsTrigger value="30d">30d</TabsTrigger>
                <TabsTrigger value="90d">90d</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <div className="flex h-64 items-end gap-2">
              {[42, 65, 38, 72, 55, 88, 46, 62, 74, 51, 68, 92, 58, 47, 79, 66, 35, 57, 84, 49, 63, 71, 44, 90, 53, 69, 38, 61, 76, 48].map(
                (h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t-md bg-primary/20 transition-colors hover:bg-primary/40"
                    style={{ height: `${h}%` }}
                  />
                )
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
            <CardDescription>Where your money went this month</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {spending.map((item) => (
              <div key={item.category} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span>{item.category}</span>
                  <span className="text-muted-foreground">{item.amount}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full ${item.color}`}
                    style={{ width: `${item.amount}%` }}
                  />
                </div>
              </div>
            ))}
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
