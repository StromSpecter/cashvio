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

const gradients = [
  "from-sky-600 to-cyan-600",
  "from-orange-600 to-amber-500",
  "from-slate-800 to-slate-600",
  "from-fuchsia-600 to-pink-600",
];

export function AddCardDialog({ open, onOpenChange, onSubmit }) {
  const [bank, setBank] = useState("");
  const [number, setNumber] = useState("");
  const [balance, setBalance] = useState("");

  const reset = () => {
    setBank("");
    setNumber("");
    setBalance("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!bank.trim() || !number.trim()) return;
    const clean = number.replace(/\s+/g, "");
    onSubmit({
      id: Date.now(),
      bank: bank.trim(),
      number: clean,
      masked: `•••• •••• ${clean.slice(-4)}`,
      balanceIdr: parseFloat(balance) || 0,
      gradient: gradients[Math.floor(Math.random() * gradients.length)],
    });
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a bank account</DialogTitle>
          <DialogDescription>
            Store the account details to track your balance.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="add-card-bank">Bank name</Label>
            <Input
              id="add-card-bank"
              placeholder="e.g. Bank Central Asia"
              value={bank}
              onChange={(e) => setBank(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="add-card-number">Account number</Label>
            <Input
              id="add-card-number"
              placeholder="e.g. 0834 5678 9012"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="add-card-balance">Saldo</Label>
            <Input
              id="add-card-balance"
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
            <Button type="submit">Save Account</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
