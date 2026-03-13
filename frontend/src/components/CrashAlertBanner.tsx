interface CrashAlertBannerProps {
  probability: number;
  timeMin: number;
  visible: boolean;
}

export default function CrashAlertBanner({
  probability,
  timeMin,
  visible,
}: CrashAlertBannerProps) {
  if (!visible || probability < 1) return null;

  const severity =
    probability >= 80
      ? {
          border: "border-[var(--danger)]/40",
          bg: "bg-[linear-gradient(135deg,rgba(220,38,38,0.18),rgba(124,58,237,0.12))]",
          text: "text-[var(--text)]",
          accent: "text-[var(--danger)]",
        }
      : {
          border: "border-amber-500/30",
          bg: "bg-[linear-gradient(135deg,rgba(245,158,11,0.18),rgba(37,99,235,0.10))]",
          text: "text-[var(--text)]",
          accent: "text-amber-500",
        };

  return (
    <div
      className={`relative mb-4 overflow-hidden rounded-2xl border px-4 py-3 text-sm shadow-[var(--shadow)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-hover)] ${severity.border} ${severity.bg} ${severity.text}`}
    >
      <div className="pointer-events-none absolute inset-0 opacity-40 bg-[radial-gradient(800px_circle_at_20%_30%,rgba(255,255,255,0.28),transparent_55%)]" />
      <div>
        <p className="relative font-semibold">
          <span className={`${severity.accent}`}>⚠️</span> Crash predicted •{" "}
          <span className={`${severity.accent} font-extrabold`}>
            {probability}%
          </span>{" "}
          probability
        </p>
        <p className="relative mt-1 text-xs text-[var(--muted)]">
          Based on recent CPU/RAM behaviour, your system may crash in{" "}
          <span className="font-semibold text-[var(--text)]">
            {timeMin} minutes
          </span>
          . Save your
          work and close heavy apps.
        </p>
      </div>
      <button className="relative ml-4 rounded-xl bg-[var(--danger)] px-3 py-1.5 text-xs font-extrabold text-white shadow-sm transition-all duration-200 hover:-translate-y-[1px] hover:brightness-110 active:translate-y-0">
        Auto-fix (mock)
      </button>
    </div>
  );
}

