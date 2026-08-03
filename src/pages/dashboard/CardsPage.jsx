import {
  Plus,
  MoreHorizontal,
  Eye,
  EyeOff,
  Pencil,
  Trash2,
  Landmark,
  LayoutGrid,
  List,
} from "lucide-react";
import { useState } from "react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { DataTable } from "../../components/ui/table";
import { Pagination } from "../../components/ui/pagination";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../components/ui/select";
import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownSeparator,
} from "../../components/ui/dropdown";
import { AddCardDialog } from "../../components/dialogs/AddCardDialog";
import { EditCardDialog } from "../../components/dialogs/EditCardDialog";
import { DeleteCardDialog } from "../../components/dialogs/DeleteCardDialog";

const IDR_PER_USD = 16000;

const initialAccounts = [
  {
    id: 1,
    bank: "Bank Central Asia",
    number: "0834 5678 9012",
    masked: "•••• •••• 9012",
    balanceUsd: 18432.5,
    gradient: "from-zinc-900 to-zinc-700",
  },
  {
    id: 2,
    bank: "Bank Mandiri",
    number: "1370 0298 4471",
    masked: "•••• •••• 4471",
    balanceUsd: 4860,
    gradient: "from-indigo-600 to-purple-600",
  },
  {
    id: 3,
    bank: "DBS Bank",
    number: "5031 8820 3345",
    masked: "•••• •••• 3345",
    balanceUsd: 2127.3,
    gradient: "from-emerald-600 to-teal-600",
  },
  {
    id: 4,
    bank: "Bank Negara Indonesia",
    number: "0111 3025 6620",
    masked: "•••• •••• 6620",
    balanceUsd: 10000,
    gradient: "from-rose-600 to-orange-500",
  },
];

const currencies = {
  USD: { locale: "en-US", label: "Dollar (USD)" },
  IDR: { locale: "id-ID", label: "Rupiah (IDR)" },
};

function formatBalance(amountUsd, currency) {
  const { locale } = currencies[currency];
  const amount = currency === "IDR" ? amountUsd * IDR_PER_USD : amountUsd;
  const maximumFractionDigits = currency === "IDR" ? 0 : 2;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits,
  }).format(amount);
}

function AccountFace({ account, showNumber, onToggleNumber, balance }) {
  return (
    <div
      className={`relative aspect-[8/5] w-full overflow-hidden rounded-xl bg-gradient-to-br ${account.gradient} p-5 text-white shadow-lg`}
    >
      <div className="absolute -right-10 -top-10 size-40 rounded-full bg-white/10" />
      <div className="absolute -bottom-16 -right-6 size-48 rounded-full bg-white/10" />
      <div className="relative flex h-full flex-col justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-white/70">
            Bank
          </p>
          <p className="mt-0.5 text-sm font-semibold">{account.bank}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-white/70">
            Account number
          </p>
          <button
            type="button"
            onClick={onToggleNumber}
            className="mt-0.5 flex items-center gap-1.5 font-mono text-sm tracking-widest sm:text-base"
            aria-label={
              showNumber ? "Hide account number" : "Show account number"
            }
          >
            {showNumber ? account.number : account.masked}
            <span className="text-white/70" aria-hidden="true">
              {showNumber ? (
                <EyeOff className="size-3.5" />
              ) : (
                <Eye className="size-3.5" />
              )}
            </span>
          </button>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-white/70">
            Saldo
          </p>
          <p className="mt-0.5 text-lg font-bold">{balance}</p>
        </div>
      </div>
    </div>
  );
}

function AccountActions({ onEdit, onDelete, tone = "default" }) {
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          variant="ghost"
          size="icon"
          className={
            tone === "on-card"
              ? "size-7 text-white/80 hover:bg-white/15 hover:text-white"
              : ""
          }
          aria-label="Account options"
        >
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownTrigger>
      <DropdownContent align="end">
        <DropdownItem onClick={onEdit}>
          <Pencil className="size-4" /> Edit
        </DropdownItem>
        <DropdownSeparator />
        <DropdownItem
          className="text-destructive focus:text-destructive"
          onClick={onDelete}
        >
          <Trash2 className="size-4" /> Delete
        </DropdownItem>
      </DropdownContent>
    </Dropdown>
  );
}

export function CardsPage() {
  const [showNumber, setShowNumber] = useState(false);
  const [currency, setCurrency] = useState("USD");
  const [view, setView] = useState("card");
  const [accounts, setAccounts] = useState(initialAccounts);
  const [cardPage, setCardPage] = useState(1);
  const [addOpen, setAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const cardPageSize = 4;
  const cardTotalPages = Math.max(
    1,
    Math.ceil(accounts.length / cardPageSize)
  );
  const visibleAccounts = accounts.slice(
    (cardPage - 1) * cardPageSize,
    cardPage * cardPageSize
  );
  const cardStartIndex = accounts.length === 0 ? 0 : (cardPage - 1) * cardPageSize + 1;
  const cardEndIndex = Math.min(cardPage * cardPageSize, accounts.length);

  const totalUsd = accounts.reduce((sum, a) => sum + a.balanceUsd, 0);
  const total = formatBalance(totalUsd, currency);

  const handleDelete = (id) => {
    setAccounts((prev) => prev.filter((a) => a.id !== id));
  };

  const handleAdd = (account) => {
    setAccounts((prev) => [...prev, account]);
  };

  const handleEdit = (updated) => {
    setAccounts((prev) =>
      prev.map((a) => (a.id === updated.id ? updated : a))
    );
  };

  const columns = [
    {
      key: "bank",
      header: "Bank",
      sortable: true,
      searchable: false,
      width: "min-w-[180px]",
      render: (value) => <span className="font-medium">{value}</span>,
    },
    {
      key: "number",
      header: "Account number",
      sortable: true,
      searchable: false,
      width: "min-w-[200px]",
      render: (value, row) => (
        <button
          type="button"
          onClick={() => setShowNumber((s) => !s)}
          className="flex items-center gap-1.5 font-mono tracking-widest"
          aria-label={
            showNumber ? "Hide account number" : "Show account number"
          }
        >
          {showNumber ? value : row.masked}
          {showNumber ? (
            <EyeOff className="size-3.5 text-muted-foreground" />
          ) : (
            <Eye className="size-3.5 text-muted-foreground" />
          )}
        </button>
      ),
    },
    {
      key: "balanceUsd",
      header: "Saldo",
      sortable: true,
      searchable: false,
      align: "right",
      width: "min-w-[140px]",
      render: (value) => (
        <span className="font-medium">{formatBalance(value, currency)}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Rekening</h1>
          <p className="text-sm text-muted-foreground">
            {accounts.length === 0
              ? "No linked bank accounts yet."
              : `You have ${accounts.length} linked bank account${accounts.length > 1 ? "s" : ""}.`}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-md border border-border p-0.5">
            <Button
              variant={view === "card" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setView("card")}
              aria-label="Card view"
            >
              <LayoutGrid className="size-4" />
            </Button>
            <Button
              variant={view === "table" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setView("table")}
              aria-label="Table view"
            >
              <List className="size-4" />
            </Button>
          </div>
          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger className="h-9 w-44" aria-label="Select currency">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">{currencies.USD.label}</SelectItem>
              <SelectItem value="IDR">{currencies.IDR.label}</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => setAddOpen(true)}>
            <Plus className="size-4" />
            Add Account
          </Button>
        </div>
      </div>

      {accounts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Total saldo</CardTitle>
            <CardDescription>
              Combined balance across all linked accounts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-3xl font-bold">{total}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {accounts.length > 0 ? (
        view === "card" ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {visibleAccounts.map((account) => (
                <Card key={account.id}>
                  <CardContent className="space-y-4 p-4">
                    <div className="relative">
                      <div className="absolute right-2 top-2 z-10">
                        <AccountActions
                          tone="on-card"
                          onEdit={() => setEditTarget(account)}
                          onDelete={() => setDeleteTarget(account)}
                        />
                      </div>
                      <AccountFace
                        account={account}
                        showNumber={showNumber}
                        onToggleNumber={() => setShowNumber((s) => !s)}
                        balance={formatBalance(account.balanceUsd, currency)}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between">
              <p className="whitespace-nowrap text-sm text-muted-foreground">
                Showing {cardStartIndex}–{cardEndIndex} of {accounts.length}
              </p>
              <Pagination
                page={cardPage}
                totalPages={cardTotalPages}
                onPageChange={setCardPage}
                className="sm:mx-0 [&_ul]:justify-end"
              />
            </div>
          </>
        ) : (
          <Card>
            <CardContent className="p-0">
              <DataTable
                columns={columns}
                data={accounts}
                pageSize={10}
                showActions
                actions={(row) => (
                  <AccountActions
                    onEdit={() => setEditTarget(row)}
                    onDelete={() => setDeleteTarget(row)}
                  />
                )}
                searchPlaceholder="Search..."
                emptyMessage="No accounts found."
              />
            </CardContent>
          </Card>
        )
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
            <div className="rounded-full bg-accent p-4">
              <Landmark className="size-8 text-muted-foreground" />
            </div>
            <div>
              <h2 className="font-semibold">No bank accounts yet</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Link your first bank account to start tracking your saldo.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
      <AddCardDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onSubmit={handleAdd}
      />
      <EditCardDialog
        open={!!editTarget}
        onOpenChange={(open) => {
          if (!open) setEditTarget(null);
        }}
        account={editTarget}
        onSubmit={handleEdit}
      />
      <DeleteCardDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        account={deleteTarget}
        onConfirm={handleDelete}
      />
    </div>
  );
}
