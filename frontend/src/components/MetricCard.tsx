interface MetricCardProps {
  title: string;
  value: number | string;
  unit?: string;
  color?: "blue" | "green" | "purple" | "orange" | "red";
}

export default function MetricCard({
  title,
  value,
  unit,
  color = "blue",
}: MetricCardProps) {
  const colorClass = {
    blue: "text-[var(--accent)]",
    green: "text-emerald-500",
    purple: "text-[var(--accent-2)]",
    orange: "text-amber-500",
    red: "text-[var(--danger)]",
  }[color];

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-hover)]">
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100 bg-[radial-gradient(700px_circle_at_30%_10%,rgba(37,99,235,0.18),transparent_60%)]" />
      <p className="relative text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
        {title}
      </p>
      <p className={`relative mt-2 text-3xl font-extrabold ${colorClass}`}>
        {value}
        {unit && (
          <span className="ml-1 text-lg font-semibold text-[var(--muted)]">
            {unit}
          </span>
        )}
      </p>
    </div>
  );
}

