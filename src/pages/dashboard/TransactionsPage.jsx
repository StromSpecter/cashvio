import { useState } from 'react'
import { Search, Download, Plus, ArrowDownToLine, ArrowLeftRight, Store, ShoppingCart, Briefcase, Repeat, Globe, CircleAlert, MoreHorizontal } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Input } from '../../components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '../../components/ui/avatar'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../../components/ui/select'
import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownSeparator,
} from '../../components/ui/dropdown'

const categories = {
  income: { label: 'Income', icon: ArrowDownToLine, tone: 'text-emerald-600' },
  shopping: { label: 'Shopping', icon: ShoppingCart, tone: 'text-blue-600' },
  groceries: { label: 'Groceries', icon: Store, tone: 'text-amber-600' },
  salary: { label: 'Salary', icon: Briefcase, tone: 'text-emerald-600' },
  subscription: { label: 'Subscription', icon: Repeat, tone: 'text-purple-600' },
  travel: { label: 'Travel', icon: Globe, tone: 'text-cyan-600' },
  transfer: { label: 'Transfer', icon: ArrowLeftRight, tone: 'text-zinc-600' },
}

const allTransactions = [
  { id: 1, name: 'Acme Corp', date: 'Aug 3, 2026', amount: '+$2,450.00', category: 'salary', status: 'completed', initials: 'AC', wallet: 'Main Account' },
  { id: 2, name: 'Netflix', date: 'Aug 2, 2026', amount: '-$15.99', category: 'subscription', status: 'completed', initials: 'NF', wallet: 'Main Account' },
  { id: 3, name: 'Starbucks', date: 'Aug 2, 2026', amount: '-$6.75', category: 'groceries', status: 'pending', initials: 'SB', wallet: 'Everyday' },
  { id: 4, name: 'GitHub', date: 'Aug 1, 2026', amount: '-$9.00', category: 'subscription', status: 'completed', initials: 'GH', wallet: 'Main Account' },
  { id: 5, name: 'Acme Corp', date: 'Aug 1, 2026', amount: '+$2,450.00', category: 'salary', status: 'completed', initials: 'AC', wallet: 'Main Account' },
  { id: 6, name: 'Uber', date: 'Jul 31, 2026', amount: '-$32.10', category: 'travel', status: 'failed', initials: 'UB', wallet: 'Everyday' },
  { id: 7, name: 'Transfer to Savings', date: 'Jul 30, 2026', amount: '-$500.00', category: 'transfer', status: 'completed', initials: 'TS', wallet: 'Savings' },
  { id: 8, name: 'Amazon', date: 'Jul 29, 2026', amount: '-$89.97', category: 'shopping', status: 'completed', initials: 'AM', wallet: 'Everyday' },
  { id: 9, name: 'Freelance Invoice', date: 'Jul 28, 2026', amount: '+$1,200.00', category: 'income', status: 'completed', initials: 'FI', wallet: 'Main Account' },
  { id: 10, name: 'Whole Foods', date: 'Jul 27, 2026', amount: '-$54.32', category: 'groceries', status: 'completed', initials: 'WF', wallet: 'Main Account' },
  { id: 11, name: 'Spotify', date: 'Jul 26, 2026', amount: '-$10.99', category: 'subscription', status: 'completed', initials: 'SP', wallet: 'Everyday' },
  { id: 12, name: 'Booking.com', date: 'Jul 25, 2026', amount: '-$240.00', category: 'travel', status: 'refunded', initials: 'BC', wallet: 'Travel Card' },
]

const statusVariant = {
  completed: 'success',
  pending: 'warning',
  failed: 'destructive',
  refunded: 'secondary',
}

export function TransactionsPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [status, setStatus] = useState('all')

  const filtered = allTransactions.filter((tx) => {
    const matchesQuery = tx.name.toLowerCase().includes(query.toLowerCase())
    const matchesCategory = category === 'all' || tx.category === category
    const matchesStatus = status === 'all' || tx.status === status
    return matchesQuery && matchesCategory && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
          <p className="text-sm text-muted-foreground">
            Review and search your account activity.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="size-4" /> Export
          </Button>
          <Button>
            <Plus className="size-4" /> New Transaction
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="income">Income</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
          </TabsList>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search transactions..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-9 w-full pl-8 sm:w-56"
                aria-label="Search transactions"
              />
            </div>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="h-9 w-full sm:w-40" aria-label="Filter by category">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                <SelectItem value="salary">Salary</SelectItem>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="shopping">Shopping</SelectItem>
                <SelectItem value="groceries">Groceries</SelectItem>
                <SelectItem value="subscription">Subscriptions</SelectItem>
                <SelectItem value="travel">Travel</SelectItem>
                <SelectItem value="transfer">Transfers</SelectItem>
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="h-9 w-full sm:w-40" aria-label="Filter by status">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="all">
          <TransactionList transactions={filtered} />
        </TabsContent>
        <TabsContent value="income">
          <TransactionList transactions={filtered.filter((tx) => tx.amount.startsWith('+'))} />
        </TabsContent>
        <TabsContent value="expenses">
          <TransactionList transactions={filtered.filter((tx) => tx.amount.startsWith('-'))} />
        </TabsContent>
        <TabsContent value="pending">
          <TransactionList transactions={filtered.filter((tx) => tx.status === 'pending')} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function TransactionList({ transactions }) {
  return (
    <Card className="mt-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Activity</CardTitle>
          <CardDescription>{transactions.length} transactions</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-12 text-center">
            <CircleAlert className="size-8 text-muted-foreground" />
            <p className="text-sm font-medium">No transactions found</p>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search or filters.
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {transactions.map((tx) => {
              const cat = categories[tx.category]
              const Icon = cat.icon
              return (
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
                      {tx.wallet} · {tx.date}
                    </p>
                  </div>
                  <div className="hidden items-center gap-2 sm:flex">
                    <Icon className={`size-4 ${cat.tone}`} />
                    <span className="text-sm text-muted-foreground">{cat.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p
                        className={`text-sm font-medium ${
                          tx.amount.startsWith('+') ? 'text-emerald-600' : ''
                        }`}
                      >
                        {tx.amount}
                      </p>
                      <Badge variant={statusVariant[tx.status]} className="mt-0.5 capitalize">
                        {tx.status}
                      </Badge>
                    </div>
                    <Dropdown>
                      <DropdownTrigger>
                        <Button variant="ghost" size="icon" className="ml-1" aria-label="Transaction options">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownTrigger>
                      <DropdownContent align="end">
                        <DropdownItem>View details</DropdownItem>
                        <DropdownItem>Add note</DropdownItem>
                        <DropdownItem>Duplicate</DropdownItem>
                        <DropdownSeparator />
                        <DropdownItem className="text-destructive focus:text-destructive">
                          Report issue
                        </DropdownItem>
                      </DropdownContent>
                    </Dropdown>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
