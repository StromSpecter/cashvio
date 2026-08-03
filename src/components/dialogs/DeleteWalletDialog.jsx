import { Wallet } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";

export function DeleteWalletDialog({ wallet, open, onOpenChange, onConfirm }) {
  const handleConfirm = () => {
    onConfirm(wallet.id);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Delete wallet</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this wallet? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-3 rounded-lg border border-border p-4">
          <div className="rounded-lg bg-accent p-2">
            <Wallet className="size-5 text-muted-foreground" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">
              {wallet ? wallet.name : ""}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {wallet ? `${wallet.type} · ${wallet.masked}` : ""}
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
            Delete Wallet
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
