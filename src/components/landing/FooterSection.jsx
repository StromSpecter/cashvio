import { Link } from "react-router";
import { Globe, Mail, Send } from "lucide-react";
import alurkaskuLogo from "../../../public/alurkasku.svg";

const columns = [
  {
    title: "Produk",
    links: [
      { label: "Fitur", href: "#fitur" },
      { label: "Cara Kerja", href: "#cara-kerja" },
      { label: "Harga", href: "#harga" },
      { label: "Portfolio IDX & Gold", href: "#fitur" },
    ],
  },
  {
    title: "Perusahaan",
    links: [
      { label: "Tentang Kami", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Karier", href: "#" },
      { label: "Kontak", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Syarat & Ketentuan", href: "#" },
      { label: "Kebijakan Privasi", href: "#" },
      { label: "Keamanan", href: "#" },
    ],
  },
];

const socials = [
  { icon: Globe, label: "Website" },
  { icon: Mail, label: "Email" },
  { icon: Send, label: "Telegram" },
];

export function FooterSection() {
  return (
    <footer className="border-t border-lp-line bg-lp-base transition-colors">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-5">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2.5">
              <img src={alurkaskuLogo} alt="Alurkasku" className="size-9" />
              <span className="text-lg font-bold tracking-tight text-lp-ink">
                Alurkasku
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-lp-muted">
              Catat keuangan harian, pantau lewat dashboard dan laporan
              lengkap, lalu kembangkan portfolio saham IDX dan gold.
            </p>
            <div className="mt-6 flex gap-2">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href="#"
                  aria-label={social.label}
                  className="flex size-10 items-center justify-center rounded-xl border border-lp-line text-lp-muted transition-colors hover:border-mint-400/40 hover:text-lp-mint-text"
                >
                  <social.icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold text-lp-ink">{col.title}</h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-lp-muted transition-colors hover:text-lp-ink"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-lp-line pt-8 sm:flex-row">
          <p className="text-xs text-lp-faint">
            © 2026 Alurkasku. Semua hak dilindungi.
          </p>
          <p className="text-xs text-lp-faint">
            Dibuat dengan hati di Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
}
