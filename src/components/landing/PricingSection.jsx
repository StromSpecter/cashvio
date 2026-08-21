import { Link } from "react-router";
import { Check, Sparkles } from "lucide-react";

const freeFeatures = [
  "Pencatatan transaksi harian",
  "Dashboard monitoring keuangan",
  "Laporan harian, mingguan, bulanan & tahunan",
  "Kategorisasi pengeluaran otomatis",
];

const premiumFeatures = [
  "Semua fitur Gratis",
  "Investasi saham IDX real-time",
  "Detail saham IDX lengkap",
  "Portfolio tracker gold & logam mulia",
];

const plans = [
  {
    name: "Gratis",
    price: "Rp0",
    period: "/selamanya",
    description: "Untuk mulai mencatat dan mengatur uang harian.",
    cta: "Mulai Gratis",
    featured: false,
    features: freeFeatures,
  },
  {
    name: "Bulanan",
    price: "Rp49.000",
    period: "/30 hari",
    description: "Akses investment group penuh selama 30 hari.",
    cta: "Upgrade Bulanan",
    featured: false,
    features: [...freeFeatures, ...premiumFeatures],
  },
  {
    name: "Tahunan",
    price: "Rp469.000",
    period: "/365 hari",
    description: "Paket setahun penuh — hemat 2 bulan dibanding bulanan.",
    cta: "Upgrade Tahunan",
    featured: true,
    badge: "Best Value",
    features: [...freeFeatures, ...premiumFeatures],
  },
];

export function PricingSection() {
  return (
    <section
      id="harga"
      className="scroll-mt-20 bg-lp-base py-24 transition-colors md:py-32"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold tracking-[0.2em] text-lp-mint-text uppercase">
            Harga
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-lp-ink md:text-5xl">
            Transparan, tanpa biaya tersembunyi
          </h2>
          <p className="mt-4 text-base leading-relaxed text-lp-muted">
            Mulai gratis selamanya untuk pencatatan. Upgrade sekali bayar via
            QRIS saat kamu siap track portfolio.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl p-8 transition-colors ${
                plan.featured
                  ? "border border-gold-400/40 bg-gradient-to-b from-gold-400/[0.08] to-transparent shadow-2xl shadow-gold-500/10"
                  : "border border-lp-line bg-lp-panel"
              }`}
            >
              {plan.featured && (
                <span className="absolute -top-3.5 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-gradient-to-r from-gold-300 to-gold-400 px-4 py-1.5 text-xs font-bold whitespace-nowrap text-night-950">
                  <Sparkles className="size-3" />
                  {plan.badge}
                </span>
              )}

              <h3 className="text-lg font-semibold text-lp-ink">{plan.name}</h3>
              <p className="mt-1 text-sm text-lp-muted">{plan.description}</p>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-bold tracking-tight text-lp-ink">
                  {plan.price}
                </span>
                <span className="text-sm text-lp-faint">{plan.period}</span>
              </div>

              <ul className="mt-8 flex-1 space-y-3.5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <span
                      className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full ${
                        plan.featured
                          ? "bg-gold-400/15 text-lp-gold-text"
                          : "bg-mint-400/15 text-lp-mint-text"
                      }`}
                    >
                      <Check className="size-3" />
                    </span>
                    <span className="text-lp-muted">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/signup"
                className={`mt-8 flex h-11 w-full items-center justify-center rounded-xl text-sm font-semibold transition-opacity ${
                  plan.featured
                    ? "bg-gradient-to-r from-gold-300 to-gold-400 text-night-950 shadow-lg shadow-gold-500/25 hover:opacity-90"
                    : "border border-lp-line bg-lp-btn text-lp-btn-ink hover:opacity-90"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-xs text-lp-faint">
          Pembayaran sekali bayar via QRIS. Perpanjang kapan saja — harga dalam
          Rupiah.
        </p>
      </div>
    </section>
  );
}
