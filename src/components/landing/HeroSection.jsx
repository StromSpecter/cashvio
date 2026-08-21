import { Link } from "react-router";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Briefcase,
  Coffee,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Utensils,
} from "lucide-react";

const bars = [42, 68, 50, 82, 58, 96, 72];
const days = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

const transactions = [
  {
    name: "Gaji Bulanan",
    category: "Pemasukan",
    time: "09.12",
    amount: "+Rp12.500.000",
    positive: true,
    icon: Briefcase,
  },
  {
    name: "Makan Siang",
    category: "Makanan",
    time: "12.30",
    amount: "-Rp25.000",
    positive: false,
    icon: Utensils,
  },
  {
    name: "Kopi Sore",
    category: "Jajan",
    time: "16.05",
    amount: "-Rp18.000",
    positive: false,
    icon: Coffee,
  },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-lp-base pt-36 pb-24 transition-colors">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(38,182,118,0.12),transparent)]" />
      <div className="pointer-events-none absolute -top-32 left-1/4 size-[480px] rounded-full bg-mint-400/10 blur-[140px]" />
      <div className="pointer-events-none absolute top-20 right-0 size-[380px] rounded-full bg-gold-400/10 blur-[120px]" />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <div
            className="animate-fade-up mb-6 inline-flex items-center gap-2 rounded-full border border-mint-400/25 bg-mint-400/10 py-1.5 pr-4 pl-1.5 text-xs font-medium text-lp-mint-text"
            style={{ animationDelay: "0ms" }}
          >
            <span className="flex items-center gap-1 rounded-full bg-mint-400/20 px-2 py-0.5">
              <Sparkles className="size-3" />
              Premium
            </span>
            Track portfolio Saham IDX &amp; Gold sekarang tersedia
          </div>

          <h1
            className="animate-fade-up text-5xl font-bold tracking-tight text-lp-ink md:text-7xl"
            style={{ animationDelay: "100ms" }}
          >
            Catat uangmu,{" "}
            <span className="bg-gradient-to-r from-mint-500 via-mint-400 to-gold-400 bg-clip-text text-transparent dark:from-mint-300 dark:via-mint-400 dark:to-gold-300">
              kuasai hidupmu.
            </span>
          </h1>

          <p
            className="animate-fade-up mx-auto mt-6 max-w-xl text-lg leading-relaxed text-lp-muted"
            style={{ animationDelay: "200ms" }}
          >
            Pencatatan keuangan harian yang simpel. Pantau lewat dashboard,
            lihat laporan harian sampai tahunan, dan kembangkan portfolio di
            fitur Premium.
          </p>

          <div
            className="animate-fade-up mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
            style={{ animationDelay: "300ms" }}
          >
            <Link
              to="/signup"
              className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-lp-btn px-8 text-sm font-semibold text-lp-btn-ink shadow-xl shadow-night-950/15 transition-opacity hover:opacity-90 sm:w-auto"
            >
              Mulai Gratis Sekarang
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <Link
              to="/signin"
              className="inline-flex h-12 w-full items-center justify-center rounded-xl border border-lp-line bg-lp-panel px-8 text-sm font-medium text-lp-ink transition-colors hover:bg-lp-hover sm:w-auto"
            >
              Masuk ke Dashboard
            </Link>
          </div>

          <p
            className="animate-fade-up mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-lp-faint"
            style={{ animationDelay: "400ms" }}
          >
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-lp-mint-text" />
              Gratis untuk pencatatan dasar
            </span>
            <span className="inline-flex items-center gap-1.5">
              <TrendingUp className="size-3.5 text-lp-mint-text" />
              Laporan otomatis H/M/B/T
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ArrowDownLeft className="size-3.5 text-lp-mint-text" />
              Catat dalam hitungan detik
            </span>
          </p>
        </div>

        <div
          className="animate-fade-up relative mx-auto mt-20 max-w-4xl"
          style={{ animationDelay: "500ms" }}
        >
          <div className="absolute -inset-x-8 -top-8 bottom-0 rounded-[2.5rem] bg-gradient-to-b from-mint-400/15 via-transparent to-transparent blur-2xl" />

          <div className="relative overflow-hidden rounded-2xl border border-lp-line bg-lp-panel shadow-2xl shadow-night-950/20 transition-colors">
            <div className="flex items-center gap-2 border-b border-lp-line px-5 py-3.5">
              <span className="size-3 rounded-full bg-red-500/70" />
              <span className="size-3 rounded-full bg-yellow-500/70" />
              <span className="size-3 rounded-full bg-green-500/70" />
              <span className="ml-3 hidden rounded-md bg-lp-soft px-3 py-1 text-xs text-lp-faint sm:block">
                app.alurkasku.id/dashboard
              </span>
            </div>

            <div className="grid gap-px bg-lp-line md:grid-cols-5">
              <div className="space-y-5 bg-lp-panel p-6 md:col-span-3 md:p-8">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs tracking-wider text-lp-faint uppercase">
                      Sisa Bulan Ini
                    </p>
                    <p className="mt-2 text-3xl font-bold text-lp-ink md:text-4xl">
                      Rp4.862.500
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full border border-mint-400/25 bg-mint-400/10 px-2.5 py-1 text-xs font-medium text-lp-mint-text">
                    <ArrowDownLeft className="size-3" />
                    Hemat +18%
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Pemasukan", value: "Rp12.500.000", cls: "text-lp-mint-text" },
                    { label: "Pengeluaran", value: "Rp7.637.500", cls: "text-red-500" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-xl border border-lp-line bg-lp-soft p-3.5"
                    >
                      <p className="text-[11px] text-lp-muted">{item.label}</p>
                      <p className={`mt-1 text-sm font-semibold ${item.cls}`}>
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>

                <div>
                  <p className="mb-3 text-xs tracking-wider text-lp-faint uppercase">
                    Pengeluaran Minggu Ini
                  </p>
                  <div className="flex h-28 items-end gap-2.5">
                    {bars.map((height, i) => (
                      <div
                        key={i}
                        className="flex flex-1 flex-col items-center gap-2"
                      >
                        <div
                          className={`w-full rounded-md ${
                            i === 5
                              ? "bg-gradient-to-t from-mint-600 to-mint-400 shadow-lg shadow-mint-500/30"
                              : "bg-lp-hover"
                          }`}
                          style={{ height: `${height}%` }}
                        />
                        <span className="text-[10px] text-lp-faint">
                          {days[i]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-lp-panel p-6 md:col-span-2 md:p-8">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm font-semibold text-lp-ink">Hari Ini</p>
                  <span className="rounded-md bg-lp-soft px-2 py-1 text-[11px] text-lp-faint">
                    3 catatan
                  </span>
                </div>
                <div className="space-y-3">
                  {transactions.map((tx) => (
                    <div
                      key={tx.name}
                      className="flex items-center gap-3 rounded-xl border border-lp-line bg-lp-soft p-3.5"
                    >
                      <span
                        className={`flex size-9 shrink-0 items-center justify-center rounded-full ${
                          tx.positive
                            ? "bg-mint-400/15 text-lp-mint-text"
                            : "bg-gold-400/15 text-lp-gold-text"
                        }`}
                      >
                        <tx.icon className="size-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-medium text-lp-ink">
                          {tx.name}
                        </p>
                        <p className="text-[11px] text-lp-faint">
                          {tx.category} · {tx.time}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 text-xs font-semibold ${
                          tx.positive ? "text-lp-mint-text" : "text-lp-muted"
                        }`}
                      >
                        {tx.amount}
                      </span>
                    </div>
                  ))}
                </div>
                <button className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-mint-400/40 bg-mint-400/5 text-xs font-semibold text-lp-mint-text transition-colors hover:bg-mint-400/10">
                  <ArrowUpRight className="size-3.5" />
                  Tambah Catatan
                </button>
              </div>
            </div>
          </div>

          <div className="animate-float absolute -top-6 -right-4 hidden rounded-2xl border border-lp-line bg-lp-panel p-4 shadow-2xl shadow-night-950/15 backdrop-blur lg:block">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-gold-400/15 text-lp-gold-text">
                <TrendingUp className="size-5" />
              </span>
              <div>
                <p className="text-[11px] text-lp-muted">Portfolio Gold</p>
                <p className="text-sm font-bold text-lp-mint-text">+3,4% bulan ini</p>
              </div>
            </div>
          </div>

          <div className="animate-float-slow absolute -bottom-6 -left-6 hidden rounded-2xl border border-lp-line bg-lp-panel p-4 shadow-2xl shadow-night-950/15 backdrop-blur lg:block">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-mint-400/15 text-lp-mint-text">
                <Briefcase className="size-5" />
              </span>
              <div>
                <p className="text-[11px] text-lp-muted">Laporan Oktober</p>
                <p className="text-sm font-bold text-lp-ink">Siap dilihat ✓</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
