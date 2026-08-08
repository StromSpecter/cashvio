import { useMemo, useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog'
import { ICON_OPTIONS, COLOR_OPTIONS } from './budget-constants'

export function BudgetCategoryDialog({ open, onOpenChange, onSubmit, initial, categories = [] }) {
  const isEdit = Boolean(initial)
  const [name, setName] = useState(initial?.name ?? '')
  const [type, setType] = useState(initial?.type ?? 'percent')
  const [value, setValue] = useState(initial?.type === 'amount' ? String(initial.amount ?? '') : String(initial?.percent ?? ''))
  const [color, setColor] = useState(initial?.color ?? 1)
  const [icon, setIcon] = useState(initial?.icon ?? ICON_OPTIONS[0].value)
  const [desc, setDesc] = useState(initial?.desc ?? '')

  const percentTotal = useMemo(() => {
    if (type !== 'percent') return 0
    const existing = categories
      .filter((c) => c.type === 'percent' && c.id !== initial?.id)
      .reduce((sum, c) => sum + (Number(c.percent) || 0), 0)
    return existing + (parseFloat(value) || 0)
  }, [categories, type, value, initial])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    const num = parseFloat(value)
    if (!num || Number.isNaN(num) || num < 0) return
    if (type === 'percent' && num > 100) return
    onSubmit({
      id: initial?.id ?? `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`,
      name: name.trim(),
      type,
      percent: type === 'percent' ? num : null,
      amount: type === 'amount' ? num : null,
      color,
      icon,
      desc: desc.trim(),
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Budget Category' : 'Add Budget Category'}</DialogTitle>
          <DialogDescription>
            Define a budget category and how much of your income goes to it.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="budget-cat-name">Category name</Label>
            <Input
              id="budget-cat-name"
              placeholder="e.g. Groceries"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Allocation type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue placeholder="Pick a type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percent">Percent of income (%)</SelectItem>
                <SelectItem value="amount">Fixed amount (Rp)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="budget-cat-value">
              {type === 'percent' ? 'Percent of income (%)' : 'Amount (Rp)'}
            </Label>
            <Input
              id="budget-cat-value"
              placeholder={type === 'percent' ? 'e.g. 25' : 'e.g. 1500000'}
              type="number"
              min={0}
              max={type === 'percent' ? 100 : undefined}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              required
            />
            {type === 'percent' && (
              <p className={`text-xs ${percentTotal > 100 ? 'text-destructive' : 'text-muted-foreground'}`}>
                Total allocation: {percentTotal}%
                {percentTotal > 100 ? ' — over 100%. Lower this category.' : ''}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex items-center gap-2">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  aria-label={`Color ${c.value}`}
                  onClick={() => setColor(c.value)}
                  className={`size-7 rounded-full transition-transform ${color === c.value ? 'ring-2 ring-ring ring-offset-2' : 'opacity-70 hover:opacity-100'}`}
                  style={{ background: c.css }}
                />
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Icon</Label>
            <Select value={icon} onValueChange={setIcon}>
              <SelectTrigger>
                <SelectValue placeholder="Pick an icon" />
              </SelectTrigger>
              <SelectContent>
                {ICON_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="budget-cat-desc">Description (optional)</Label>
            <Input
              id="budget-cat-desc"
              placeholder="e.g. Weekly market runs"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{isEdit ? 'Save changes' : 'Add category'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
