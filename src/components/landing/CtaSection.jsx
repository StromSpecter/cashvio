import { Link } from "react-router";
import { ArrowUpRight } from "lucide-react";

export function CtaSection() {
  return (
    <section className="bg-lp-base py-24 transition-colors">
      <div className="mx-auto max-w-6xl px-6">
        <div className="relative overflow-hidden rounded-3xl border border-lp-line bg-lp-panel px-8 py-16 text-center transition-colors md:py-24">
          <div className="pointer-events-none absolute -top-40 left-1/4 size-[500px] rounded-full bg-mint-400/10 blur-[120px]" />
          <div className="pointer-events-none absolute -top-32 right-0 size-[380px] rounded-full bg-gold-400/10 blur-[110px]" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-400/60 to-transparent" />

          <h2 className="relative mx-auto max-w-2xl text-3xl font-bold tracking-tight text-lp-ink md:text-5xl">
            Siap merapikan keuanganmu mulai hari ini?
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-base leading-relaxed text-lp-muted">
            Gabung bersama ribuan pengguna yang sudah mengelola uang dengan
            lebih tenang bersama Alurkasku.
          </p>
          <div className="relative mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/signup"
              className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-lp-btn px-8 text-sm font-semibold text-lp-btn-ink shadow-xl shadow-night-950/15 transition-opacity hover:opacity-90 sm:w-auto"
            >
              Daftar Gratis Sekarang
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <Link
              to="/signin"
              className="inline-flex h-12 w-full items-center justify-center rounded-xl border border-lp-line px-8 text-sm font-medium text-lp-ink transition-colors hover:bg-lp-hover sm:w-auto"
            >
              Sudah punya akun? Masuk
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
