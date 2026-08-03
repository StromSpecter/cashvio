import { TrendingUp, Wallet, ArrowDownToLine, ArrowUpFromLine, ArrowDownRight, ArrowUpRight, Plus, MoreHorizontal } from 'lucide-react'
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

const stats = [
  { label: 'Total Balance', value: '$24,562.80', change: '+12.4%', icon: Wallet, up: true },
  { label: 'Income', value: '$8,420.00', change: '+4.1%', icon: ArrowDownToLine, up: true },
  { label: 'Spending', value: '$3,215.60', change: '-2.3%', icon: ArrowUpFromLine, up: false },
  { label: 'Active Cards', value: '4', change: '+1 this month', icon: TrendingUp, up: true },
]

const transactions = [
  { id: 1, name: 'Acme Corp', email: 'payroll@acme.com', amount: '+$2,450.00', status: 'completed', initials: 'AC', date: 'Aug 3' },
  { id: 2, name: 'Netflix', email: 'billing@netflix.com', amount: '-$15.99', status: 'completed', initials: 'NF', date: 'Aug 2' },
  { id: 3, name: 'Starbucks', email: 'cards@starbucks.com', amount: '-$6.75', status: 'pending', initials: 'SB', date: 'Aug 2' },
  { id: 4, name: 'GitHub', email: 'billing@github.com', amount: '-$9.00', status: 'completed', initials: 'GH', date: 'Aug 1' },
  { id: 5, name: 'Acme Corp', email: 'payroll@acme.com', amount: '+$2,450.00', status: 'completed', initials: 'AC', date: 'Aug 1' },
  { id: 6, name: 'Uber', email: 'receipts@uber.com', amount: '-$32.10', status: 'failed', initials: 'UB', date: 'Jul 31' },
]

const spending = [
  { category: 'Rent & Housing', amount: 38, color: 'bg-primary' },
  { category: 'Food & Dining', amount: 24, color: 'bg-emerald-500' },
  { category: 'Transportation', amount: 16, color: 'bg-amber-500' },
  { category: 'Entertainment', amount: 12, color: 'bg-purple-500' },
  { category: 'Other', amount: 10, color: 'bg-muted-foreground' },
]

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
        <CardContent>
          <div className="space-y-1">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center gap-4 rounded-lg p-2 transition-colors hover:bg-accent"
              >
                <Avatar className="size-9">
                  <AvatarImage src="" alt={tx.name} />
                  <AvatarFallback className="text-xs">{tx.initials}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{tx.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {tx.email} · {tx.date}
                  </p>
                </div>
                <div className="text-right">
                  <p
                    className={`text-sm font-medium ${
                      tx.amount.startsWith('+') ? 'text-emerald-600' : ''
                    }`}
                  >
                    {tx.amount}
                  </p>
                  <Badge
                    variant={
                      tx.status === 'completed'
                        ? 'success'
                        : tx.status === 'failed'
                          ? 'destructive'
                          : 'warning'
                    }
                    className="mt-0.5 capitalize"
                  >
                    {tx.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
