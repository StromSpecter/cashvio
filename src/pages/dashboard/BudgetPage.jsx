import { useState, useEffect, useMemo, useRef } from 'react'
import {
  Wallet,
  PiggyBank,
  TrendingUp,
  Save,
  Plus,
  Trash2,
  Pencil,
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
import { BudgetCategoryDialog } from '../../components/dialogs/BudgetCategoryDialog'
import { DeleteBudgetCategoryDialog } from '../../components/dialogs/DeleteBudgetCategoryDialog'
import { ICON_MAP, colorVar } from '../../components/dialogs/budget-constants'
import {
  getBudgetOverview,
  createCategoryBudget,
  updateCategoryBudget,
  deleteCategoryBudget,
} from '../../lib/api'
import { toast } from '../../lib/toast.js'

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

const initialCategories = [
  {
    id: 'seed-needs',
    name: 'Needs',
    type: 'percent',
    percent: 50,
    amount: null,
    color: 1,
    icon: 'home',
    desc: 'Food, rent, utilities, transport',
  },
  {
    id: 'seed-wants',
    name: 'Wants',
    type: 'percent',
    percent: 30,
    amount: null,
    color: 3,
    icon: 'globe',
    desc: 'Entertainment, dining out, non-essential shopping',
  },
  {
    id: 'seed-invest',
    name: 'Investment',
    type: 'percent',
    percent: 20,
    amount: null,
    color: 2,
    icon: 'piggy',
    desc: 'Savings, stocks, retirement funds',
  },
]

function resolveBuckets(income, categories) {
  return categories.map((c) => {
    const isPct = c.type === 'percent'
    const pct = isPct
      ? Number(c.percent) || 0
      : income > 0
        ? Math.round(((Number(c.amount) || 0) / income) * 100)
        : 0
    const amount = isPct
      ? Math.round((income * (Number(c.percent) || 0)) / 100)
      : Number(c.amount) || 0
    return { ...c, pct, amount }
  })
}

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

function BudgetBuckets({ income, spent, categories, onEdit, onDelete }) {
  const buckets = resolveBuckets(income, categories)
  const totalAllocated = buckets.reduce((sum, b) => sum + b.amount, 0)
  const totalPct = buckets.reduce((sum, b) => sum + b.pct, 0)

  const pieData = buckets.map((b) => ({ key: b.id, label: b.name, value: b.pct }))
  const pieConfig = Object.fromEntries(
    buckets.map((b) => [b.id, { label: b.name, color: colorVar(b.color) }])
  )
  const barData = buckets.map((b) => ({ label: b.name, allocated: b.pct }))
  const barConfig = { allocated: { label: 'Allocation %', color: 'var(--color-chart-4)' } }

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
            <div className="text-2xl font-bold">{formatRp(spent)}</div>
            <p className="mt-1 text-xs text-muted-foreground">
              {Math.round((spent / income) * 100)}% of income
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
            <div className="text-2xl font-bold">{formatRp(income - totalAllocated)}</div>
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
            <div className="text-2xl font-bold">{totalPct}%</div>
            <p className="mt-1 text-xs text-muted-foreground">{formatRp(totalAllocated)} budgeted</p>
          </CardContent>
        </Card>
      </div>

      {buckets.length === 0 ? (
        <Card className="flex flex-col items-center justify-center gap-3 py-12 text-center">
          <div className="rounded-full bg-accent p-4">
            <PiggyBank className="size-8 text-muted-foreground" />
          </div>
          <CardTitle>No budget categories yet</CardTitle>
          <CardDescription>Add a category to start allocating your income.</CardDescription>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {buckets.map((b) => {
            const Icon = ICON_MAP[b.icon] || PiggyBank
            return (
              <Card key={b.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="rounded-lg p-1.5"
                      style={{ background: 'var(--color-accent)', color: colorVar(b.color) }}
                    >
                      <Icon className="size-4" />
                    </div>
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {b.name}
                    </CardTitle>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7"
                      aria-label={`Edit ${b.name}`}
                      onClick={() => onEdit(b)}
                    >
                      <Pencil className="size-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7 text-destructive"
                      aria-label={`Delete ${b.name}`}
                      onClick={() => onDelete(b)}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatRp(b.amount)}</div>
                  <p className="mt-1 text-xs text-muted-foreground">{b.desc || `${b.pct}% of income`}</p>
                </CardContent>
                <CardContent className="pt-0">
                  <ChartContainer
                    config={{ [b.id]: { label: b.name, color: colorVar(b.color) } }}
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
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Spending Allocation</CardTitle>
            <CardDescription>Share of each category against income</CardDescription>
          </CardHeader>
          <CardContent>
            {pieData.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">No categories to chart.</p>
            ) : (
              <ChartContainer config={pieConfig} formatValue={(v) => `${v}%`}>
                <PieChart data={pieData} innerRadius={70} centerValue={`${totalPct}%`} centerLabel="Total Allocation" />
              </ChartContainer>
            )}
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
              items={buckets.map((b) => ({ label: `${b.name} (${b.pct}%)`, color: colorVar(b.color) }))}
            />
          </CardContent>
        </Card>
      </div>
    </>
  )
}

function BudgetCategoriesTable({ income, categories, onEdit, onDelete }) {
  const buckets = resolveBuckets(income, categories)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Categories</CardTitle>
        <CardDescription>
          Manage what budget categories exist and how each one is allocated
          {income ? ` against your ${formatRp(income)} monthly income` : ''}.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {buckets.length === 0 ? (
          <p className="p-6 text-sm text-muted-foreground">No budget categories yet.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Allocation</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="w-[5.5rem] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {buckets.map((b) => {
                const Icon = ICON_MAP[b.icon] || PiggyBank
                return (
                  <TableRow key={b.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div
                          className="rounded-lg p-1.5"
                          style={{ background: 'var(--color-accent)', color: colorVar(b.color) }}
                        >
                          <Icon className="size-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{b.name}</p>
                          {b.desc && (
                            <p className="truncate text-xs text-muted-foreground">{b.desc}</p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {b.type === 'percent' ? `${b.percent}%` : formatRp(b.amount)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{formatRp(b.amount)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7"
                          aria-label={`Edit ${b.name}`}
                          onClick={() => onEdit(b)}
                        >
                          <Pencil className="size-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7 text-destructive"
                          aria-label={`Delete ${b.name}`}
                          onClick={() => onDelete(b)}
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
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
  const [categories, setCategories] = useState(() => {
    const stored = localStorage.getItem('cashvio-budget-categories')
    return stored ? JSON.parse(stored) : initialCategories
  })
  const [monthHistory, setMonthHistory] = useState(() => {
    const histRaw = localStorage.getItem('cashvio-budget-months')
    return histRaw ? JSON.parse(histRaw) : initialHistory
  })
  const [spent, setSpent] = useState(spendingEstimate)
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [deleteCategory, setDeleteCategory] = useState(null)

  const now = useMemo(() => new Date(), [])
  const currentMonthKey = `${now.toLocaleDateString('id-ID', { month: 'long' })} ${now.getFullYear()}`
  const fetchedRef = useRef(false)

  useEffect(() => {
    if (monthHistory.length) localStorage.setItem('cashvio-budget-months', JSON.stringify(monthHistory))
    localStorage.setItem('cashvio-budget-categories', JSON.stringify(categories))
  }, [monthHistory, categories])

  useEffect(() => {
    if (fetchedRef.current) return
    fetchedRef.current = true
    getBudgetOverview()
      .then((ov) => {
        if (!ov) return
        setTargetIncome(ov.income || null)
        setSpent(ov.spent ?? spendingEstimate)
        setCategories(ov.categories && ov.categories.length ? ov.categories : [])
      })
      .catch(() => {})
  }, [])

  const openAddCategory = () => {
    setEditingCategory(null)
    setCategoryDialogOpen(true)
  }
  const openEditCategory = (category) => {
    setEditingCategory(category)
    setCategoryDialogOpen(true)
  }
  const submitCategory = async (payload) => {
    const isEdit = payload.id && categories.some((c) => c.id === payload.id)
    try {
      const saved = isEdit
        ? await updateCategoryBudget(payload.id, payload)
        : await createCategoryBudget(payload)
      setCategories((prev) =>
        isEdit ? prev.map((c) => (c.id === payload.id ? saved : c)) : [...prev, saved]
      )
    } catch (e) {
      toast.error(e.message)
      setCategories((prev) =>
        isEdit ? prev.map((c) => (c.id === payload.id ? payload : c)) : [...prev, payload]
      )
    }
  }
  const confirmDeleteCategory = async (id) => {
    try {
      await deleteCategoryBudget(id)
    } catch (e) {
      toast.error(e.message)
    }
    setCategories((prev) => prev.filter((c) => c.id !== id))
  }

  const saveMonthEnd = () => {
    if (!targetIncome) return
    const snapshot = {
      id: `${now.getMonth()}-${now.getFullYear()}-end`,
      month: now.toLocaleDateString('id-ID', { month: 'long' }),
      year: now.getFullYear(),
      target: targetIncome,
      spent,
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
              ? `Monthly income ${formatRp(targetIncome)} — allocate across your custom categories.`
              : 'No income recorded this month yet.'}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={openAddCategory}>
            <Plus className="size-4" />
            Add Category
          </Button>
          {targetIncome && (
            <Button variant="outline" size="sm" onClick={saveMonthEnd}>
              <Save className="size-4" />
              Save End of Month
            </Button>
          )}
        </div>
      </div>

      {!targetIncome && (
        <Card className="flex flex-col items-center justify-center gap-3 py-12 text-center">
          <div className="rounded-full bg-accent p-4">
            <PiggyBank className="size-8 text-muted-foreground" />
          </div>
          <CardTitle>No income recorded this month</CardTitle>
          <CardDescription>
            Add an income transaction (type income) to start budgeting from your real income.
          </CardDescription>
        </Card>
      )}

      {targetIncome && <BudgetBuckets income={targetIncome} spent={spent} categories={categories} onEdit={openEditCategory} onDelete={setDeleteCategory} />}

      <BudgetCategoriesTable income={targetIncome} categories={categories} onEdit={openEditCategory} onDelete={setDeleteCategory} />

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

      <BudgetCategoryDialog
        key={categoryDialogOpen ? editingCategory?.id ?? 'add' : 'closed'}
        open={categoryDialogOpen}
        onOpenChange={setCategoryDialogOpen}
        initial={editingCategory}
        categories={categories}
        onSubmit={submitCategory}
      />

      <DeleteBudgetCategoryDialog
        category={deleteCategory}
        open={Boolean(deleteCategory)}
        onOpenChange={(open) => !open && setDeleteCategory(null)}
        onConfirm={confirmDeleteCategory}
      />
    </div>
  )
}
