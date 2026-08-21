import { Star } from "lucide-react";

const testimonials = [
  {
    quote:
      "Dompet multi-akunnya mengubah cara saya nabung. Dulu selalu campur, sekarang tiap kebutuhan punya papan sendiri.",
    name: "Rina Kusuma",
    role: "Freelance Designer, Bandung",
    initials: "RK",
    color: "from-mint-400 to-mint-600",
  },
  {
    quote:
      "Laporannya lengkap dari harian sampai tahunan. Evaluasi keuangan bulanan jadi cuma lima menit, bukan rekap manual berjam-jam.",
    name: "Dimas Prasetyo",
    role: "Software Engineer, Jakarta",
    initials: "DP",
    color: "from-gold-300 to-gold-500",
  },
  {
    quote:
      "Langganan Premium worth it banget. Bisa pantau saham IDX dan gold langsung dari aplikasi catat uang yang sama.",
    name: "Salsabila Rahma",
    role: "Mahasiswa, Yogyakarta",
    initials: "SR",
    color: "from-gold-400 to-mint-400",
  },
];

export function TestimonialsSection() {
  return (
    <section
      id="testimoni"
      className="scroll-mt-20 border-y border-lp-line bg-lp-base py-24 transition-colors md:py-32"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold tracking-[0.2em] text-lp-mint-text uppercase">
            Testimoni
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-lp-ink md:text-5xl">
            Dipercaya ribuan pengguna
          </h2>
          <p className="mt-4 text-base leading-relaxed text-lp-muted">
            Dari freelancer sampai mahasiswa — mereka merapikan keuangan
            bersama Alurkasku.
          </p>
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="flex flex-col rounded-2xl border border-lp-line bg-lp-panel p-7 transition-colors hover:border-lp-hover"
            >
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="size-4 fill-gold-400 text-gold-400"
                  />
                ))}
              </div>
              <blockquote className="mt-5 flex-1 text-sm leading-relaxed text-lp-muted">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-lp-line pt-5">
                <span
                  className={`flex size-10 items-center justify-center rounded-full bg-gradient-to-br ${t.color} text-xs font-bold text-night-950`}
                >
                  {t.initials}
                </span>
                <div>
                  <p className="text-sm font-semibold text-lp-ink">{t.name}</p>
                  <p className="text-xs text-lp-faint">{t.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
