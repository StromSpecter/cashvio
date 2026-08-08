import { Button } from '../ui/button'
import { ICON_MAP } from './budget-constants'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog'

export function DeleteBudgetCategoryDialog({ category, open, onOpenChange, onConfirm }) {
  const Icon = category ? ICON_MAP[category.icon] || null : null

  const handleConfirm = () => {
    onConfirm(category.id)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Delete budget category</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this category? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-3 rounded-lg border border-border p-4">
          <div className="rounded-lg bg-accent p-2">
            {Icon && <Icon className="size-5 text-muted-foreground" />}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{category ? category.name : ''}</p>
            {category?.desc && (
              <p className="truncate text-xs text-muted-foreground">{category.desc}</p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={handleConfirm}>
            Delete Category
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
