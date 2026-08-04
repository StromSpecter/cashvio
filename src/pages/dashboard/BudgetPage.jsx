import { useState, useEffect, useMemo } from 'react'
import {
  Wallet,
  PiggyBank,
  ShoppingBasket,
  Globe,
  TrendingUp,
  Save,
  Edit,
  Plus,
  Trash2,
} from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table'
import { ChartContainer, ChartLegend } from '../../components/ui/chart'
import { PieChart } from '../../components/ui/chart'
import { RadialChart } from '../../components/ui/chart'
import { BarChart } from '../../components/ui/chart'
import { SetBudgetDialog } from '../../components/dialogs/SetBudgetDialog'

const formatRp = (value) => `Rp${Number(value).toLocaleString('id-ID')}`
const monthYear = (iso) => new Date(iso).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
const spendingEstimate = 3215600

const initialHistory = [
  {
    id: 'seed-august',
    month: 'August',
    year: 2026,
    target: 8420000,
    spent: 3215600,
    createdAt: new Date(2026, 7, 31, 23, 59, 0).toISOString(),
  },
  {
    id: 'seed-july',
    month: 'July',
    year: 2026,
    target: null,
    spent: 2900000,
    createdAt: new Date(2026, 6, 31, 23, 59, 0).toISOString(),
  },
]

function analyzeBudget({ target, spent }) {
  if (!target) {
    return {
      status: 'no-target',
      expl: 'No target was set for this month.',
      rec: 'Set a monthly target so the 50/30/20 split is calculated automatically.',
    }
  }
  const needs = target * 0.5
  if (spent > needs + target * 0.3) {
    return {
      status: 'overspent',
      expl: `Spending exceeded the needs (${formatRp(needs)}) + wants (${formatRp(target * 0.3)}) budgets.`,
      rec: 'Reduce discretionary wants and redirect the surplus to investment.',
    }
  }
  if (spent > needs) {
    return {
      status: 'on-target',
      expl: 'Spending stays within the needs budget.',
      rec: 'Healthy budget. Keep the allocation and add a little buffer to investment.',
    }
  }
  const saved = target - spent
  return {
    status: 'on-target',
    expl: 'Spending is below the 50% needs allocation.',
    rec: `Great, save ${formatRp(saved)} or allocate it to the 20% investment bucket next month.`,
  }
}

function BudgetBuckets({ income }) {
  const buckets = [
    {
      key: 'needs',
      label: 'Needs',
      pct: 50,
      amount: Math.round(income * 0.5),
      color: 'var(--color-chart-1)',
      icon: ShoppingBasket,
      desc: 'Food, rent, utilities, transport',
    },
    {
      key: 'wants',
      label: 'Wants',
      pct: 30,
      amount: Math.round(income * 0.3),
      color: 'var(--color-chart-3)',
      icon: Globe,
      desc: 'Entertainment, dining out, non-essential shopping',
    },
    {
      key: 'invest',
      label: 'Investment',
      pct: 20,
      amount: Math.round(income * 0.2),
      color: 'var(--color-chart-2)',
      icon: PiggyBank,
      desc: 'Savings, stocks, retirement funds',
    },
  ]

  const pieData = buckets.map((b) => ({ key: b.key, label: b.label, value: b.pct }))
  const pieConfig = Object.fromEntries(
    buckets.map((b) => [b.key, { label: b.label, color: b.color }])
  )
  const barData = buckets.map((b) => ({ label: b.label, allocated: b.pct }))
  const barConfig = { allocated: { label: 'Allocation %', color: 'var(--color-chart-4)' } }
  const totalAllocated = buckets.reduce((sum, b) => sum + b.pct, 0)

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Income</CardTitle>
            <div className="rounded-lg bg-accent p-1.5">
              <Wallet className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatRp(income)}</div>
            <p className="mt-1 text-xs text-muted-foreground">monthly target</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Spent</CardTitle>
            <div className="rounded-lg bg-accent p-1.5">
              <TrendingUp className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatRp(spendingEstimate)}</div>
            <p className="mt-1 text-xs text-muted-foreground">
              {Math.round((spendingEstimate / income) * 100)}% of income
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Remaining</CardTitle>
            <div className="rounded-lg bg-accent p-1.5">
              <Save className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatRp(income - spendingEstimate)}</div>
            <p className="mt-1 text-xs text-muted-foreground">left to allocate</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Allocation</CardTitle>
            <div className="rounded-lg bg-accent p-1.5">
              <PiggyBank className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAllocated}%</div>
            <p className="mt-1 text-xs text-muted-foreground">already allocated</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {buckets.map((b) => {
          const Icon = b.icon
          return (
            <Card key={b.key}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {b.label}
                </CardTitle>
                <div className="rounded-lg bg-accent p-1.5">
                  <Icon className="size-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatRp(b.amount)}</div>
                <p className="mt-1 text-xs text-muted-foreground">{b.desc}</p>
              </CardContent>
              <CardContent className="pt-0">
                <ChartContainer
                  config={{ [b.key]: { label: b.label, color: b.color } }}
                  formatValue={(v) => `${v}%`}
                  className="w-full"
                >
                  <RadialChart value={b.pct} max={100} height={140} showValue={false} showLabel strokeWidth={10} />
                </ChartContainer>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Spending Allocation</CardTitle>
            <CardDescription>Share of each category against income</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={pieConfig} formatValue={(v) => `${v}%`}>
              <PieChart data={pieData} innerRadius={70} centerValue={`${totalAllocated}%`} centerLabel="Total Allocation" />
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Allocation per Category (%)</CardTitle>
            <CardDescription>Monthly allocation breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={barConfig} formatValue={(v) => `${v}%`} className="h-64">
              <BarChart data={barData} height={256} />
            </ChartContainer>
            <ChartLegend
              className="mt-3"
              items={[
                { label: 'Needs (50%)', color: 'var(--color-chart-1)' },
                { label: 'Wants (30%)', color: 'var(--color-chart-3)' },
                { label: 'Investment (20%)', color: 'var(--color-chart-2)' },
              ]}
            />
          </CardContent>
        </Card>
      </div>
    </>
  )
}

function StatusBadge({ status }) {
  const map = {
    'on-target': { variant: 'success', label: 'On Target' },
    'overspent': { variant: 'warning', label: 'Over' },
    'no-target': { variant: 'outline', label: 'No target' },
  }
  const m = map[status] || map['no-target']
  return (
    <Badge variant={m.variant} className="capitalize">
      {m.label}
    </Badge>
  )
}

export function BudgetPage() {
  const [targetIncome, setTargetIncome] = useState(() => {
    const stored = localStorage.getItem('cashvio-budget-target')
    return stored ? Number(JSON.parse(stored)) : null
  })
  const [monthHistory, setMonthHistory] = useState(() => {
    const histRaw = localStorage.getItem('cashvio-budget-months')
    return histRaw ? JSON.parse(histRaw) : initialHistory
  })
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editValue, setEditValue] = useState(null)

  const now = useMemo(() => new Date(), [])
  const currentMonthKey = `${now.toLocaleDateString('id-ID', { month: 'long' })} ${now.getFullYear()}`

  useEffect(() => {
    if (targetIncome != null) localStorage.setItem('cashvio-budget-target', JSON.stringify(targetIncome))
    if (monthHistory.length) localStorage.setItem('cashvio-budget-months', JSON.stringify(monthHistory))
  }, [targetIncome, monthHistory])

  const openSet = () => {
    setEditValue(null)
    setDialogOpen(true)
  }
  const openEdit = () => {
    setEditValue(targetIncome)
    setDialogOpen(true)
  }
  const submit = (payload) => {
    const nowIso = new Date().toISOString()
    const entry = { id: nowIso, amount: payload.amount, note: payload.note, createdAt: nowIso }
    localStorage.setItem(
      'cashvio-budget-target-history',
      JSON.stringify([entry, ...JSON.parse(localStorage.getItem('cashvio-budget-target-history') || '[]')].slice(0, 20))
    )
    setTargetIncome(payload.amount)
  }
  const clearTarget = () => setTargetIncome(null)

  const saveMonthEnd = () => {
    if (!targetIncome) return
    const snapshot = {
      id: `${now.getMonth()}-${now.getFullYear()}-end`,
      month: now.toLocaleDateString('id-ID', { month: 'long' }),
      year: now.getFullYear(),
      target: targetIncome,
      spent: spendingEstimate,
      createdAt: now.toISOString(),
    }
    const enriched = { ...snapshot, ...analyzeBudget(snapshot) }
    setMonthHistory((prev) => {
      const filtered = prev.filter((m) => !(m.month === enriched.month && m.year === enriched.year))
      return [enriched, ...filtered]
    })
  }

  const previousMonth = monthHistory.find((m) => monthYear(m.createdAt) !== currentMonthKey)
  const prevEnriched = useMemo(
    () => (previousMonth ? analyzeBudget({ target: previousMonth.target, spent: previousMonth.spent }) : null),
    [previousMonth]
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Budgeting</h1>
          <p className="text-sm text-muted-foreground">
            {targetIncome
              ? `Monthly target ${formatRp(targetIncome)} — allocate 50/30/20.`
              : 'No monthly target yet. Set one to start budgeting.'}
          </p>
        </div>
        {!targetIncome && (
          <Button onClick={openSet}>
            <Plus className="size-4" />
            Set Monthly Target
          </Button>
        )}
        {targetIncome && (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={saveMonthEnd}>
              <Save className="size-4" />
              Save End of Month
            </Button>
            <Button variant="outline" size="sm" onClick={clearTarget}>
              <Trash2 className="size-4" />
              Reset Target
            </Button>
            <Button onClick={openEdit}>
              <Edit className="size-4" />
              Edit Target
            </Button>
          </div>
        )}
      </div>

      {!targetIncome && (
        <Card className="flex flex-col items-center justify-center gap-3 py-12 text-center">
          <div className="rounded-full bg-accent p-4">
            <PiggyBank className="size-8 text-muted-foreground" />
          </div>
          <CardTitle>No monthly target set</CardTitle>
          <CardDescription>
            Set your monthly income to automatically calculate the needs, wants, and
            investment split (50/30/20).
          </CardDescription>
          <Button onClick={openSet}>
            <Plus className="size-4" />
            Set Monthly Target
          </Button>
        </Card>
      )}

      {targetIncome && <BudgetBuckets income={targetIncome} />}

      {previousMonth && prevEnriched ? (
        <Card>
          <CardHeader>
            <CardTitle>Last Month Summary ({monthYear(previousMonth.createdAt)})</CardTitle>
            <CardDescription>
              End-of-month snapshot from the previous month, shown as a reference this month.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Target</span>
              <span className="font-medium">
                {previousMonth.target ? formatRp(previousMonth.target) : '— not set —'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Spent</span>
              <span className="font-medium">{formatRp(previousMonth.spent)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              <StatusBadge status={prevEnriched.status} />
            </div>
            <div className="pt-2">
              <p className="text-sm text-muted-foreground">{prevEnriched.expl}</p>
            </div>
            <div className="pt-1">
              <p className="text-sm font-medium">AI Recommendation</p>
              <p className="text-sm text-muted-foreground">{prevEnriched.rec}</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 py-8 text-center">
            <PiggyBank className="size-8 text-muted-foreground" />
            <CardTitle>No previous month snapshot yet</CardTitle>
            <CardDescription>
              Click "Save End of Month" to generate a snapshot that appears here next month.
            </CardDescription>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Month History</CardTitle>
          <CardDescription>Budget targets, status, and AI recommendations per month</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {monthHistory.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground">No month history yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Month</TableHead>
                  <TableHead className="text-right">Target</TableHead>
                  <TableHead className="text-right">Spent</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Explanation</TableHead>
                  <TableHead>AI Recommendation</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {monthHistory.map((m) => {
                  const enriched = analyzeBudget({ target: m.target, spent: m.spent })
                  return (
                    <TableRow key={m.id}>
                      <TableCell>{monthYear(m.createdAt)}</TableCell>
                      <TableCell className="text-right tabular-nums">
                        {m.target ? formatRp(m.target) : '— not set —'}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">{formatRp(m.spent)}</TableCell>
                      <TableCell>
                        <StatusBadge status={enriched.status} />
                      </TableCell>
                      <TableCell className="max-w-[14rem] text-sm text-muted-foreground">{enriched.expl}</TableCell>
                      <TableCell className="max-w-[20rem] text-sm text-muted-foreground">{enriched.rec}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <SetBudgetDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialValue={editValue}
        mode={editValue ? 'edit' : 'set'}
        onSubmit={submit}
      />
    </div>
  )
}
