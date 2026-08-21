import { useState, useEffect } from 'react'
import {
  Crown,
  Check,
  Loader2,
  Moon,
  Sun,
  CircleDollarSign,
  QrCode,
  RefreshCw,
} from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../../components/ui/dialog'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs'
import { useAuth } from '../../lib/auth-context.js'
import { useTheme } from '../../lib/theme.jsx'
import { getPremiumPlans, createPremiumOrder, getPremiumOrder, getPremiumOrders, simulatePremiumPayment } from '../../lib/api'
import { toast } from '../../lib/toast.js'
import { formatRp } from '../../lib/investments'

const formatDate = (value) => {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

const statusBadge = (status) => {
  if (status === 'paid') return <Badge variant="success">Dibayar</Badge>
  if (status === 'pending') return <Badge variant="warning">Menunggu</Badge>
  if (status === 'expired') return <Badge variant="outline">Kedaluwarsa</Badge>
  return <Badge variant="destructive">Gagal</Badge>
}

const PLAN_LABEL = { monthly: 'Monthly', yearly: 'Yearly' }

function PremiumDialog({ order, onClose, onSimulate, simulating }) {
  if (!order) return null
  const pending = order.status === 'pending'

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="size-5" /> Bayar dengan QRIS
          </DialogTitle>
          <DialogDescription>
            Scan QR di bawah dengan aplikasi e-wallet / m-banking yang mendukung QRIS.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4">
          <div className="rounded-xl border border-border bg-white p-4">
            <QRCodeSVG value={order.qris_string} size={200} level="M" />
          </div>

          <div className="w-full space-y-1 rounded-lg border border-border bg-muted/50 p-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total</span>
              <span className="font-semibold">{formatRp(order.amount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order</span>
              <span className="font-mono text-xs">{order.external_id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status</span>
              <span className="font-medium text-amber-600">
                {pending ? 'Menunggu pembayaran...' : order.status}
              </span>
            </div>
          </div>

          {order.is_mock && pending && (
            <Button className="w-full" onClick={onSimulate} disabled={simulating}>
              {simulating ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
              Simulasikan Pembayaran (Dev)
            </Button>
          )}

          <p className="text-xs text-muted-foreground">
            Premium aktif otomatis begitu pembayaran terkonfirmasi. Halaman ini akan ter-refresh sendiri.
          </p>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function SubscriptionCard() {
  const { isPremium, user, refreshUser } = useAuth()
  const [plans, setPlans] = useState([])
  const [order, setOrder] = useState(null)
  const [simulating, setSimulating] = useState(false)

  const refreshOrder = async (id) => {
    try {
      const { data } = await getPremiumOrder(id)
      setOrder(data)
      return data
    } catch (e) {
      toast.error(e.message)
      return null
    }
  }

  useEffect(() => {
    getPremiumPlans()
      .then((res) => setPlans(res.data || []))
      .catch((e) => toast.error(e.message))
  }, [])

  useEffect(() => {
    if (!order || order.status !== 'pending') return
    const t = setInterval(async () => {
      const updated = await refreshOrder(order.id)
      if (updated && updated.status !== 'pending') {
        clearInterval(t)
        if (updated.status === 'paid') {
          toast.success('Pembayaran berhasil! Premium aktif.')
          await refreshUser()
        }
      }
    }, 3000)
    return () => clearInterval(t)
  }, [order, refreshUser])

  const handleUpgrade = async (code) => {
    try {
      const { data } = await createPremiumOrder({ plan: code })
      setOrder(data)
    } catch (e) {
      toast.error(e.message)
    }
  }

  const handleSimulate = async () => {
    if (!order) return
    setSimulating(true)
    try {
      await simulatePremiumPayment(order.id)
      const updated = await refreshOrder(order.id)
      if (updated?.status === 'paid') {
        toast.success('Pembayaran berhasil! Premium aktif.')
        await refreshUser()
        setOrder(null)
      }
    } catch (e) {
      toast.error(e.message)
    } finally {
      setSimulating(false)
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Crown className="size-5 text-amber-500" />
            <CardTitle>Subscription</CardTitle>
          </div>
          <CardDescription>
            Status langganan premium kamu. Pembayaran dilakukan sekali via QRIS.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-muted/50 p-4">
            <Badge variant={isPremium ? 'warning' : 'secondary'}>
              {isPremium ? 'Premium Aktif' : 'Free Plan'}
            </Badge>
            {isPremium && user?.premium_expires_at && (
              <span className="text-sm text-muted-foreground">
                Berlaku sampai{' '}
                <span className="font-medium text-foreground">
                  {formatDate(user.premium_expires_at)}
                </span>
              </span>
            )}
          </div>

          <ul className="space-y-1.5 text-sm">
            <li className="flex items-center gap-2">
              <Check className="size-4 text-emerald-600" /> Akses penuh menu Investments & Portfolio
            </li>
            <li className="flex items-center gap-2">
              <Check className="size-4 text-emerald-600" /> Harga saham IDX & emas real-time
            </li>
            <li className="flex items-center gap-2">
              <Check className="size-4 text-emerald-600" /> Analisis gain/loss otomatis
            </li>
          </ul>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        {plans.map((plan) => (
          <Card key={plan.code} className="relative">
            {plan.badge && (
              <Badge variant="warning" className="absolute right-4 top-4">
                {plan.badge}
              </Badge>
            )}
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="size-5 text-amber-500" />
                {plan.name}
              </CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="text-3xl font-bold">{formatRp(plan.price_idr)}</span>
                <span className="text-sm text-muted-foreground">
                  {' '}/ {plan.duration_days === 365 ? 'tahun' : 'bulan'}
                </span>
              </div>
              <Button className="w-full" onClick={() => handleUpgrade(plan.code)}>
                {isPremium ? 'Perpanjang' : 'Upgrade Sekarang'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <PremiumDialog
        order={order}
        onClose={() => setOrder(null)}
        onSimulate={handleSimulate}
        simulating={simulating}
      />
    </>
  )
}

function PaymentHistory() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPremiumOrders({ limit: 20 })
      .then((res) => setOrders(res.data || []))
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Riwayat Pembayaran</CardTitle>
        <CardDescription>Order premium yang pernah kamu buat.</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center gap-2 py-8 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" /> Memuat riwayat...
          </div>
        ) : orders.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">Belum ada pembayaran.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase text-muted-foreground">
                  <th className="py-2 pr-4 font-medium">Paket</th>
                  <th className="py-2 pr-4 font-medium">Jumlah</th>
                  <th className="py-2 pr-4 font-medium">Tanggal</th>
                  <th className="py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-b border-border/60 last:border-0">
                    <td className="py-2.5 pr-4">{PLAN_LABEL[o.plan] || o.plan}</td>
                    <td className="py-2.5 pr-4">{formatRp(o.amount)}</td>
                    <td className="py-2.5 pr-4 text-muted-foreground">
                      {o.paid_at ? formatDate(o.paid_at) : formatDate(o.created_at)}
                    </td>
                    <td className="py-2.5">{statusBadge(o.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function SettingsPage() {
  const { theme, toggle } = useTheme()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Kelola preferensi dan langganan akun kamu.</p>
      </div>

      <Tabs defaultValue="subscription">
        <TabsList>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
          <TabsTrigger value="general">General</TabsTrigger>
        </TabsList>

        <TabsContent value="subscription" className="space-y-4">
          <SubscriptionCard />
          <PaymentHistory />
        </TabsContent>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Preferensi</CardTitle>
              <CardDescription>Pengaturan tampilan aplikasi.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CircleDollarSign className="size-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Tema</p>
                  <p className="text-xs text-muted-foreground">
                    Mode terang atau gelap ({theme === 'dark' ? 'gelap' : 'terang'})
                  </p>
                </div>
              </div>
              <Button variant="outline" onClick={toggle}>
                {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
                {theme === 'dark' ? 'Mode Terang' : 'Mode Gelap'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}