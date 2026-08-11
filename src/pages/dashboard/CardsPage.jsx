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
import { useState, useEffect, useCallback, useRef } from "react";
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
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownSeparator,
} from "../../components/ui/dropdown";
import { AddCardDialog } from "../../components/dialogs/AddCardDialog";
import { EditCardDialog } from "../../components/dialogs/EditCardDialog";
import { DeleteCardDialog } from "../../components/dialogs/DeleteCardDialog";
import {
  getCards,
  createCard,
  updateCard,
  deleteCard,
} from "../../lib/api";
import { toast } from "../../lib/toast.js";
import { CardsSkeleton } from "../../components/templates";

const DEFAULT_GRADIENT = "from-zinc-900 to-zinc-700";

const normalize = (c) => ({
  id: c.id,
  bank: c.bank,
  number: c.number || "",
  masked: c.masked || "••••",
  balanceIdr: c.balance_idr || 0,
  gradient: c.gradient || DEFAULT_GRADIENT,
});

function formatBalance(amountIdr) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amountIdr);
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
            Balance</p>
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
  const [view, setView] = useState("card");
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cardPage, setCardPage] = useState(1);
  const [addOpen, setAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const fetchedRef = useRef(false);

  const load = useCallback(async () => {
    const { data } = await getCards({ limit: 100 })
    return data
  }, [])

  useEffect(() => {
    if (fetchedRef.current) return
    fetchedRef.current = true
    load()
      .then((data) => {
        setAccounts(data.map(normalize))
        setLoading(false)
      })
      .catch((e) => {
        setLoading(false)
        toast.error(e.message)
      })
  }, [load])

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

  const total = formatBalance(
    accounts.reduce((sum, a) => sum + a.balanceIdr, 0),
  );

  const handleDelete = async (id) => {
    try {
      await deleteCard(id);
      setAccounts((prev) => prev.filter((a) => a.id !== id));
      toast.success("Account deleted");
    } catch (e) {
      toast.error(e.message);
    }
  };

  const handleAdd = async (form) => {
    try {
      const { data } = await createCard({
        bank: form.bank,
        number: form.number,
        balance_idr: form.balanceIdr,
        gradient: DEFAULT_GRADIENT,
      });
      setAccounts((prev) => [normalize(data), ...prev]);
      toast.success("Account created");
    } catch (e) {
      toast.error(e.message);
    }
  };

  const handleEdit = async (form) => {
    try {
      const { data } = await updateCard(form.id, {
        bank: form.bank,
        number: form.number,
        balance_idr: form.balanceIdr,
      });
      setAccounts((prev) =>
        prev.map((a) => (a.id === data.id ? normalize(data) : a))
      );
      toast.success("Account updated");
    } catch (e) {
      toast.error(e.message);
    }
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
      key: "balanceIdr",
      header: "Balance",
      sortable: true,
      searchable: false,
      align: "right",
      width: "min-w-[140px]",
      render: (value) => (
        <span className="font-medium">{formatBalance(value)}</span>
      ),
    },
  ];

  if (loading) return <CardsSkeleton />;

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
                        balance={formatBalance(account.balanceIdr)}
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
        )
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
            <div className="rounded-full bg-accent p-4">
              <Landmark className="size-8 text-muted-foreground" />
            </div>
            <div>
              <h2 className="font-semibold">
                {loading ? "Loading accounts..." : "No bank accounts yet"}
              </h2>
              {!loading && (
                <p className="mt-1 text-sm text-muted-foreground">
                  Link your first bank account to start tracking your saldo.
                </p>
              )}
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
