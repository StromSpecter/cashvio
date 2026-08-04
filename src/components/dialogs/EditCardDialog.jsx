import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";

export function EditCardDialog({ account, open, onOpenChange, onSubmit }) {
  const [bank, setBank] = useState("");
  const [number, setNumber] = useState("");
  const [balance, setBalance] = useState("");
  const [prevAccount, setPrevAccount] = useState(null);

  if (account !== prevAccount) {
    setPrevAccount(account);
    setBank(account ? account.bank : "");
    setNumber(account ? account.number : "");
    setBalance(account ? String(account.balanceIdr) : "");
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!account || !bank.trim() || !number.trim()) return;
    const clean = number.replace(/\s+/g, "");
    onSubmit({
      ...account,
      bank: bank.trim(),
      number: clean,
      masked: `•••• •••• ${clean.slice(-4)}`,
      balanceIdr: parseFloat(balance) || 0,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit bank account</DialogTitle>
          <DialogDescription>
            Update the account details.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="edit-card-bank">Bank name</Label>
            <Input
              id="edit-card-bank"
              placeholder="e.g. Bank Central Asia"
              value={bank}
              onChange={(e) => setBank(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-card-number">Account number</Label>
            <Input
              id="edit-card-number"
              placeholder="e.g. 0834 5678 9012"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-card-balance">Balance</Label>
            <Input
              id="edit-card-balance"
              placeholder="e.g. 10000"
              type="number"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
