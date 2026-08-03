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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";

const IDR_PER_USD = 16000;

export function EditWalletDialog({ wallet, open, onOpenChange, onSubmit }) {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [balance, setBalance] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [prevWallet, setPrevWallet] = useState(null);

  if (wallet !== prevWallet) {
    setPrevWallet(wallet);
    setName(wallet ? wallet.name : "");
    setNumber(wallet ? wallet.number : "");
    setBalance(wallet ? String(wallet.balanceUsd) : "");
    setCurrency("USD");
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!wallet || !name.trim()) return;
    const clean = number.replace(/\s+/g, "");
    const amountUsd =
      currency === "IDR"
        ? (parseFloat(balance) || 0) / IDR_PER_USD
        : parseFloat(balance) || 0;
    onSubmit({
      ...wallet,
      name: name.trim(),
      number: clean,
      masked: clean ? `•••• ${clean.slice(-4)}` : "•••• ••••",
      balanceUsd: amountUsd,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit wallet</DialogTitle>
          <DialogDescription>Update the wallet details.</DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="edit-wallet-name">Wallet name</Label>
            <Input
              id="edit-wallet-name"
              placeholder="e.g. Emergency Fund"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-wallet-number">Account number</Label>
            <Input
              id="edit-wallet-number"
              placeholder="e.g. 1234 5678 9012"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-wallet-balance">Saldo</Label>
            <div className="flex gap-2">
              <Input
                id="edit-wallet-balance"
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
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
