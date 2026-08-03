import { useState } from "react";
import { Wallet, Landmark, RefreshCw, ArrowLeftRight } from "lucide-react";
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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";

const IDR_PER_USD = 16000;

const tones = [
  "bg-primary text-primary-foreground",
  "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  "bg-sky-500/10 text-sky-600 dark:text-sky-400",
];

const icons = [Wallet, Landmark, RefreshCw, ArrowLeftRight];

export function AddWalletDialog({ open, onOpenChange, onSubmit }) {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [balance, setBalance] = useState("");
  const [currency, setCurrency] = useState("USD");

  const reset = () => {
    setName("");
    setNumber("");
    setBalance("");
    setCurrency("USD");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    const clean = number.replace(/\s+/g, "");
    const amountUsd =
      currency === "IDR"
        ? (parseFloat(balance) || 0) / IDR_PER_USD
        : parseFloat(balance) || 0;
    onSubmit({
      id: Date.now(),
      name: name.trim(),
      number: clean,
      masked: clean ? `•••• ${clean.slice(-4)}` : "•••• ••••",
      balanceUsd: amountUsd,
      tone: tones[Math.floor(Math.random() * tones.length)],
      icon: icons[Math.floor(Math.random() * icons.length)],
      status: "active",
    });
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a new wallet</DialogTitle>
          <DialogDescription>
            Create a wallet to organize your money by purpose.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="add-wallet-name">Wallet name</Label>
            <Input
              id="add-wallet-name"
              placeholder="e.g. Emergency Fund"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="add-wallet-number">Account number</Label>
            <Input
              id="add-wallet-number"
              placeholder="e.g. 1234 5678 9012"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="add-wallet-balance">Saldo</Label>
            <div className="flex gap-2">
              <Input
                id="add-wallet-balance"
                placeholder="e.g. 10000"
                type="number"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
              />
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="w-32" aria-label="Saldo currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="IDR">IDR</SelectItem>
                </SelectContent>
              </Select>
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
            <Button type="submit">Create Wallet</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
