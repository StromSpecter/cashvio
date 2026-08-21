import { Link } from "react-router";
import { useEffect, useState } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useTheme } from "../../lib/theme.jsx";
import alurkaskuLogo from "../../../public/alurkasku.svg";

const navLinks = [
  { label: "Fitur", href: "#fitur" },
  { label: "Cara Kerja", href: "#cara-kerja" },
  { label: "Harga", href: "#harga" },
  { label: "Testimoni", href: "#testimoni" },
];

export function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { theme, toggle } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open
          ? "border-b border-lp-line bg-lp-base/85 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <img src={alurkaskuLogo} alt="Alurkasku" className="size-9" />
          <span className="text-lg font-bold tracking-tight text-lp-ink">
            Alurkasku
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-lg px-4 py-2 text-sm text-lp-muted transition-colors hover:bg-lp-hover hover:text-lp-ink"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <button
            type="button"
            onClick={toggle}
            aria-label="Ganti tema"
            className="flex size-10 items-center justify-center rounded-xl border border-lp-line text-lp-muted transition-colors hover:bg-lp-hover hover:text-lp-ink"
          >
            {theme === "dark" ? <Sun className="size-4.5" /> : <Moon className="size-4.5" />}
          </button>
          <Link
            to="/signin"
            className="rounded-xl px-4 py-2 text-sm font-medium text-lp-muted transition-colors hover:text-lp-ink"
          >
            Masuk
          </Link>
          <Link
            to="/signup"
            className="rounded-xl bg-lp-btn px-4 py-2 text-sm font-semibold text-lp-btn-ink shadow-lg shadow-night-950/15 transition-opacity hover:opacity-90"
          >
            Mulai Gratis
          </Link>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={toggle}
            aria-label="Ganti tema"
            className="flex size-10 items-center justify-center rounded-xl border border-lp-line text-lp-muted"
          >
            {theme === "dark" ? <Sun className="size-4.5" /> : <Moon className="size-4.5" />}
          </button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex size-10 items-center justify-center rounded-xl border border-lp-line text-lp-ink"
            aria-label="Toggle menu"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-lp-line px-6 pt-3 pb-6 md:hidden">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-3 text-sm text-lp-muted hover:bg-lp-hover hover:text-lp-ink"
            >
              {link.label}
            </a>
          ))}
          <div className="mt-4 flex flex-col gap-2">
            <Link
              to="/signin"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-lp-line text-sm font-medium text-lp-ink"
            >
              Masuk
            </Link>
            <Link
              to="/signup"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-lp-btn text-sm font-semibold text-lp-btn-ink"
            >
              Mulai Gratis
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
