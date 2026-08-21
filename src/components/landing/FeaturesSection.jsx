import {
  Bus,
  ChartColumn,
  Coffee,
  Coins,
  FileChartColumn,
  NotebookPen,
  ShieldCheck,
  TrendingUp,
  Utensils,
} from "lucide-react";

const cardClass =
  "group relative overflow-hidden rounded-2xl border border-lp-line bg-lp-panel p-8 transition-colors hover:border-lp-hover";

function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-xs font-semibold tracking-[0.2em] text-lp-mint-text uppercase">
        {eyebrow}
      </p>
      <h2 className="mt-4 text-3xl font-bold tracking-tight text-lp-ink md:text-5xl">
        {title}
      </h2>
      <p className="mt-4 text-base leading-relaxed text-lp-muted">
        {description}
      </p>
    </div>
  );
}

const periods = ["Harian", "Mingguan", "Bulanan", "Tahunan"];

export function FeaturesSection() {
  return (
    <section
      id="fitur"
      className="scroll-mt-20 bg-lp-base py-24 transition-colors md:py-32"
    >
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Fitur"
          title="Semua yang kamu butuhkan untuk mengatur uang"
          description="Dari mencatat pengeluaran harian sampai memantau portfolio investasi — Alurkasku menjaga alur kas-mu tetap terkendali."
        />

        <div className="mt-16 grid gap-4 md:grid-cols-6">
          <div className={`${cardClass} md:col-span-4`}>
            <div className="grid items-center gap-8 sm:grid-cols-2">
              <div>
                <span className="inline-flex size-11 items-center justify-center rounded-xl border border-mint-400/25 bg-mint-400/10 text-lp-mint-text">
                  <NotebookPen className="size-5" />
                </span>
                <h3 className="mt-5 text-xl font-semibold text-lp-ink">
                  Pencatatan Harian
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-lp-muted">
                  Catat pemasukan dan pengeluaran dalam hitungan detik.
                  Kelompokkan otomatis per kategori — makan, transport,
                  jajan, gaji, dan lainnya.
                </p>
              </div>
              <div className="space-y-2.5">
                {[
                  { icon: Utensils, label: "Makanan", amount: "Rp1.250.000", pct: "62%" },
                  { icon: Bus, label: "Transportasi", amount: "Rp850.000", pct: "42%" },
                  { icon: Coffee, label: "Jajan", amount: "Rp420.000", pct: "21%" },
                ].map((c) => (
                  <div
                    key={c.label}
                    className="rounded-xl border border-lp-line bg-lp-soft p-3 transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-2 text-lp-muted">
                        <c.icon className="size-3.5" />
                        {c.label}
                      </span>
                      <span className="font-semibold text-lp-ink">
                        {c.amount}
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-lp-hover">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-mint-500 to-mint-400"
                        style={{ width: c.pct }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={cardClass + " md:col-span-2"}>
            <span className="inline-flex size-11 items-center justify-center rounded-xl border border-gold-400/25 bg-gold-400/10 text-lp-gold-text">
              <ShieldCheck className="size-5" />
            </span>
            <h3 className="mt-5 text-xl font-semibold text-lp-ink">
              Data Milikmu
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-lp-muted">
              Catatan keuanganmu tersimpan aman dan hanya bisa diakses olehmu.
              Privasi nomor satu.
            </p>
            <ShieldCheck className="absolute -right-4 -bottom-4 size-28 text-lp-hover" />
          </div>

          <div className={cardClass + " md:col-span-2"}>
            <span className="inline-flex size-11 items-center justify-center rounded-xl border border-gold-400/25 bg-gold-400/10 text-lp-gold-text">
              <ChartColumn className="size-5" />
            </span>
            <h3 className="mt-5 text-xl font-semibold text-lp-ink">
              Dashboard Monitoring
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-lp-muted">
              Ringkasan pemasukan, pengeluaran, dan sisa saldo dalam satu
              layar. Tren mingguan langsung terlihat.
            </p>
            <div className="mt-6 flex h-16 items-end gap-1.5">
              {[35, 55, 40, 70, 48, 90, 62].map((h, i) => (
                <div
                  key={i}
                  className={`flex-1 rounded-sm ${
                    i === 5 ? "bg-mint-400" : "bg-lp-hover"
                  }`}
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>

          <div className={cardClass + " md:col-span-2"}>
            <span className="inline-flex size-11 items-center justify-center rounded-xl border border-gold-400/25 bg-gold-400/10 text-lp-gold-text">
              <FileChartColumn className="size-5" />
            </span>
            <h3 className="mt-5 text-xl font-semibold text-lp-ink">
              Laporan Lengkap
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-lp-muted">
              Rangkuman keuangan otomatis per periode. Evaluasi arus kas tanpa
              rekap manual lagi.
            </p>
            <div className="mt-6 flex flex-wrap gap-1.5">
              {periods.map((p) => (
                <span
                  key={p}
                  className={`rounded-md px-2.5 py-1 text-[11px] font-medium ${
                    p === "Bulanan"
                      ? "bg-mint-400/15 text-lp-mint-text"
                      : "bg-lp-soft text-lp-faint"
                  }`}
                >
                  {p}
                </span>
              ))}
            </div>
          </div>

          <div className={cardClass + " md:col-span-2"}>
            <span className="inline-flex size-11 items-center justify-center rounded-xl border border-gold-400/25 bg-gold-400/10 text-lp-gold-text">
              <ChartColumn className="size-5" />
            </span>
            <h3 className="mt-5 text-xl font-semibold text-lp-ink">
              Analisis Tren
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-lp-muted">
              Bandingkan antar periode dan lihat ke mana uangmu benar-benar
              mengalir setiap bulannya.
            </p>
          </div>

          <div className={cardClass + " md:col-span-6"}>
            <div className="grid items-center gap-8 md:grid-cols-2">
              <div>
                <div className="flex items-center gap-3">
                  <span className="inline-flex size-11 items-center justify-center rounded-xl border border-gold-400/25 bg-gold-400/10 text-lp-gold-text">
                    <TrendingUp className="size-5" />
                  </span>
                  <span className="rounded-full border border-gold-400/30 bg-gold-400/10 px-3 py-1 text-[11px] font-semibold tracking-wide text-lp-gold-text uppercase">
                    Premium
                  </span>
                </div>
                <h3 className="mt-5 text-xl font-semibold text-lp-ink">
                  Portfolio: Saham IDX &amp; Gold
                </h3>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-lp-muted">
                  Lacak nilai portfolio-mu di satu tempat. Pantau saham Bursa
                  Efek Indonesia dan harga gold/logam mulia real-time, lengkap
                  dengan detail per aset.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {["Harga real-time", "Detail saham IDX", "Gold & logam mulia"].map(
                    (chip) => (
                      <span
                        key={chip}
                        className="rounded-full border border-lp-line bg-lp-soft px-3 py-1.5 text-xs text-lp-muted"
                      >
                        {chip}
                      </span>
                    ),
                  )}
                </div>
              </div>
              <div className="space-y-3">
                <div className="overflow-hidden rounded-xl border border-lp-line bg-lp-soft p-5 transition-colors">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-xs text-lp-muted">BBCA · Saham IDX</p>
                      <p className="mt-1 text-xl font-bold text-lp-ink">
                        Rp9.775{" "}
                        <span className="text-sm font-semibold text-lp-mint-text">
                          +1,8%
                        </span>
                      </p>
                    </div>
                  </div>
                  <svg viewBox="0 0 320 70" className="mt-3 w-full">
                    <defs>
                      <linearGradient id="feat-chart-fill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#26b676" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#26b676" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0,55 C30,50 45,35 70,38 C95,41 110,48 135,42 C160,36 175,22 200,25 C225,28 240,14 265,12 C290,10 305,15 320,11 L320,70 L0,70 Z"
                      fill="url(#feat-chart-fill)"
                    />
                    <path
                      d="M0,55 C30,50 45,35 70,38 C95,41 110,48 135,42 C160,36 175,22 200,25 C225,28 240,14 265,12 C290,10 305,15 320,11"
                      fill="none"
                      stroke="#26b676"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-lp-line bg-lp-soft p-5 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="flex size-9 items-center justify-center rounded-lg bg-gold-400/15 text-lp-gold-text">
                      <Coins className="size-4.5" />
                    </span>
                    <div>
                      <p className="text-xs text-lp-muted">Gold · Logam Mulia</p>
                      <p className="text-sm font-bold text-lp-ink">
                        Rp1.842.000/gram
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-lp-mint-text">
                    +0,6%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
