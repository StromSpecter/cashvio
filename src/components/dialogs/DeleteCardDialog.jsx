import { Landmark } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";

export function DeleteCardDialog({ account, open, onOpenChange, onConfirm }) {
  const handleConfirm = () => {
    onConfirm(account.id);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Delete bank account</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this account? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-3 rounded-lg border border-border p-4">
          <div className="rounded-lg bg-accent p-2">
            <Landmark className="size-5 text-muted-foreground" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">
              {account ? account.bank : ""}
            </p>
            <p className="truncate font-mono text-xs text-muted-foreground">
              {account ? account.masked : ""}
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={handleConfirm}>
            Delete Account
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
