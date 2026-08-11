import {
  Plus,
  MoreHorizontal,
  Eye,
  EyeOff,
  Pencil,
  Trash2,
  Wallet,
  LayoutGrid,
  List,
} from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
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
import { AddWalletDialog } from "../../components/dialogs/AddWalletDialog";
import { EditWalletDialog } from "../../components/dialogs/EditWalletDialog";
import { DeleteWalletDialog } from "../../components/dialogs/DeleteWalletDialog";
import {
  getWallets,
  createWallet,
  updateWallet,
  deleteWallet,
} from "../../lib/api";
import { toast } from "../../lib/toast.js";
import { WalletsSkeleton } from "../../components/templates";

const DEFAULT_TONE = "bg-primary text-primary-foreground";

const normalize = (w) => ({
  id: w.id,
  name: w.name,
  number: w.number || "",
  masked: w.masked || "••••",
  balanceIdr: w.balance_idr || 0,
  tone: w.tone || DEFAULT_TONE,
  icon: Wallet,
  status: w.status,
  primary: w.primary,
});

function formatBalance(amountIdr) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amountIdr);
}

function WalletActions({ onEdit, onDelete, tone = "default" }) {
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
          aria-label="Wallet options"
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

function WalletFace({
  wallet,
  showNumber,
  onToggleNumber,
  onEdit,
  onDelete,
  balance,
}) {
  const Icon = wallet.icon;
  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div className={`rounded-lg p-2 ${wallet.tone}`}>
          <Icon className="size-5" />
        </div>
        <WalletActions onEdit={onEdit} onDelete={onDelete} />
      </div>
      <div className="flex items-center gap-2">
        <h3 className="font-semibold">{wallet.name}</h3>
        {wallet.primary && <Badge>Primary</Badge>}
      </div>
      <button
        type="button"
        onClick={onToggleNumber}
        className="flex items-center gap-1.5 text-sm text-muted-foreground"
        aria-label={showNumber ? "Hide wallet number" : "Show wallet number"}
      >
        <span className="truncate">
          {showNumber ? wallet.number : wallet.masked}
        </span>
        <span aria-hidden="true">
          {showNumber ? (
            <EyeOff className="size-3.5" />
          ) : (
            <Eye className="size-3.5" />
          )}
        </span>
      </button>
      <p className="text-2xl font-bold">{balance}</p>
    </div>
  );
}

export function WalletsPage() {
  const [showNumber, setShowNumber] = useState(false);
  const [view, setView] = useState("card");
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cardPage, setCardPage] = useState(1);
  const [addOpen, setAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const fetchedRef = useRef(false);

  const load = useCallback(async () => {
    const { data } = await getWallets({ limit: 100 })
    return data
  }, [])

  useEffect(() => {
    if (fetchedRef.current) return
    fetchedRef.current = true
    load()
      .then((data) => {
        setWallets(data.map(normalize))
        setLoading(false)
      })
      .catch((e) => {
        setLoading(false)
        toast.error(e.message)
      })
  }, [load])

  const cardPageSize = 4;
  const cardTotalPages = Math.max(1, Math.ceil(wallets.length / cardPageSize));
  const visibleWallets = wallets.slice(
    (cardPage - 1) * cardPageSize,
    cardPage * cardPageSize,
  );
  const cardStartIndex =
    wallets.length === 0 ? 0 : (cardPage - 1) * cardPageSize + 1;
  const cardEndIndex = Math.min(cardPage * cardPageSize, wallets.length);

  const total = formatBalance(
    wallets.reduce((sum, w) => sum + w.balanceIdr, 0),
  );

  const handleDelete = async (id) => {
    try {
      await deleteWallet(id);
      setWallets((prev) => prev.filter((w) => w.id !== id));
      toast.success("Wallet deleted");
    } catch (e) {
      toast.error(e.message);
    }
  };

  const handleAdd = async (form) => {
    try {
      const { data } = await createWallet({
        name: form.name,
        number: form.number,
        balance_idr: form.balanceIdr,
        primary: false,
      });
      setWallets((prev) => [normalize(data), ...prev]);
      toast.success("Wallet created");
    } catch (e) {
      toast.error(e.message);
    }
  };

  const handleEdit = async (form) => {
    try {
      const { data } = await updateWallet(form.id, {
        name: form.name,
        number: form.number,
        balance_idr: form.balanceIdr,
      });
      setWallets((prev) =>
        prev.map((w) => (w.id === data.id ? normalize(data) : w))
      );
      toast.success("Wallet updated");
    } catch (e) {
      toast.error(e.message);
    }
  };

  const columns = [
    {
      key: "name",
      header: "Wallet",
      sortable: true,
      searchable: false,
      width: "min-w-[180px]",
      render: (value, row) => (
        <div className="flex items-center gap-2">
          <span className="font-medium">{value}</span>
          {row.primary && <Badge>Primary</Badge>}
        </div>
      ),
    },
    {
      key: "number",
      header: "Number",
      sortable: true,
      searchable: false,
      width: "min-w-[180px]",
      render: (value, row) => (
        <button
          type="button"
          onClick={() => setShowNumber((s) => !s)}
          className="flex items-center gap-1.5 font-mono tracking-widest"
          aria-label={showNumber ? "Hide wallet number" : "Show wallet number"}
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

  if (loading) return <WalletsSkeleton />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Wallets</h1>
          <p className="text-sm text-muted-foreground">
            {wallets.length === 0
              ? "No wallets yet."
              : `You have ${wallets.length} wallet${wallets.length > 1 ? "s" : ""}.`}
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
            Add Wallet
          </Button>
        </div>
      </div>

      {wallets.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Wallet summary</CardTitle>
            <CardDescription>
              Combined balance across all active wallets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-3xl font-bold">{total}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {wallets.length > 0 ? (
        view === "card" ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {visibleWallets.map((wallet) => (
                <Card
                  key={wallet.id}
                >
                  <CardContent className="space-y-4 p-4">
                    <WalletFace
                      wallet={wallet}
                      showNumber={showNumber}
                      onToggleNumber={() => setShowNumber((s) => !s)}
                      onEdit={() => setEditTarget(wallet)}
                      onDelete={() => setDeleteTarget(wallet)}
                      balance={formatBalance(wallet.balanceIdr)}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between">
              <p className="whitespace-nowrap text-sm text-muted-foreground">
                Showing {cardStartIndex}–{cardEndIndex} of {wallets.length}
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
            data={wallets}
            pageSize={10}
            showActions
            actions={(row) => (
              <WalletActions
                onEdit={() => setEditTarget(row)}
                onDelete={() => setDeleteTarget(row)}
              />
            )}
            searchPlaceholder="Search..."
            emptyMessage="No wallets found."
          />
        )
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
            <div className="rounded-full bg-accent p-4">
              <Wallet className="size-8 text-muted-foreground" />
            </div>
            <div>
              <h2 className="font-semibold">
                {loading ? "Loading wallets..." : "No wallets yet"}
              </h2>
              {!loading && (
                <p className="mt-1 text-sm text-muted-foreground">
                  Create your first wallet to organize your money by purpose.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      <AddWalletDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onSubmit={handleAdd}
      />
      <EditWalletDialog
        open={!!editTarget}
        onOpenChange={(open) => {
          if (!open) setEditTarget(null);
        }}
        wallet={editTarget}
        onSubmit={handleEdit}
      />
      <DeleteWalletDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        wallet={deleteTarget}
        onConfirm={handleDelete}
      />
    </div>
  );
}
