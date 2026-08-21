import { useEffect, useRef, useState } from "react";

const stats = [
  { value: 50, decimals: 0, suffix: "K+", label: "Pengguna aktif" },
  { value: 12, decimals: 0, suffix: "Jt+", label: "Transaksi tercatat" },
  { value: 1.2, decimals: 1, suffix: "Jt+", label: "Laporan dibuat" },
  { value: 4.9, decimals: 1, suffix: "/5", label: "Rating kepuasan" },
];

function formatNumber(value, decimals) {
  return value.toFixed(decimals).replace(".", ",");
}

function useCountUp(target, decimals, duration, shouldStart) {
  const [display, setDisplay] = useState(formatNumber(0, decimals));

  useEffect(() => {
    if (!shouldStart) return;
    let frame;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(formatNumber(target * eased, decimals));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [shouldStart, target, decimals, duration]);

  return display;
}

function StatItem({ stat, shouldStart }) {
  const display = useCountUp(stat.value, stat.decimals, 1800, shouldStart);

  return (
    <div className="flex flex-col items-center gap-1.5 bg-lp-panel px-6 py-10 text-center transition-colors">
      <span className="bg-gradient-to-r from-mint-500 to-gold-400 bg-clip-text text-4xl font-bold text-transparent tabular-nums md:text-5xl dark:from-mint-300 dark:to-gold-300">
        {display}
        {stat.suffix}
      </span>
      <span className="text-sm text-lp-muted">{stat.label}</span>
    </div>
  );
}

export function StatsSection() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="bg-lp-base py-16 transition-colors">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-lp-line bg-lp-line lg:grid-cols-4">
          {stats.map((stat) => (
            <StatItem key={stat.label} stat={stat} shouldStart={visible} />
          ))}
        </div>
      </div>
    </section>
  );
}
