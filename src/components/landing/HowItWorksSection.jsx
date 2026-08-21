import { NotebookPen, ChartColumn, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: NotebookPen,
    step: "01",
    title: "Catat setiap hari",
    description:
      "Masukkan pemasukan dan pengeluaranmu sesering mungkin. Cuma butuh hitungan detik per catatan.",
  },
  {
    icon: ChartColumn,
    step: "02",
    title: "Pantau dashboard",
    description:
      "Sisa saldo, tren pengeluaran, dan ringkasan harian tampil otomatis tanpa perlu rekap manual.",
  },
  {
    icon: TrendingUp,
    step: "03",
    title: "Evaluasi & kembangkan",
    description:
      "Tinjau laporan harian sampai tahunan, lalu mulai track portfolio saham IDX dan gold di Premium.",
  },
];

export function HowItWorksSection() {
  return (
    <section
      id="cara-kerja"
      className="relative scroll-mt-20 overflow-hidden bg-lp-base py-24 transition-colors md:py-32"
    >
      <div className="pointer-events-none absolute top-1/2 left-1/2 size-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-mint-400/[0.06] blur-[140px]" />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold tracking-[0.2em] text-lp-mint-text uppercase">
            Cara Kerja
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-lp-ink md:text-5xl">
            Mulai hanya dengan tiga langkah
          </h2>
          <p className="mt-4 text-base leading-relaxed text-lp-muted">
            Tidak perlu jago finansial. Alurkasku dirancang supaya siapa pun
            bisa mengelola uang dengan rapi.
          </p>
        </div>

        <div className="relative mt-16 grid gap-10 md:grid-cols-3 md:gap-6">
          <div className="absolute top-7 right-[16%] left-[16%] hidden h-px bg-gradient-to-r from-transparent via-lp-line to-transparent md:block" />

          {steps.map((item) => (
            <div key={item.step} className="relative flex flex-col items-center text-center">
              <div className="relative z-10 flex size-14 items-center justify-center rounded-2xl border border-mint-400/25 bg-lp-panel shadow-lg shadow-mint-500/10 transition-colors">
                <item.icon className="size-6 text-lp-mint-text" />
                <span className="absolute -top-2 -right-2 rounded-full bg-gradient-to-br from-gold-400 to-mint-400 px-2 py-0.5 text-[10px] font-bold text-night-950">
                  {item.step}
                </span>
              </div>
              <h3 className="mt-6 text-lg font-semibold text-lp-ink">
                {item.title}
              </h3>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-lp-muted">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
