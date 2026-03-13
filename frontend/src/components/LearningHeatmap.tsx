const HOURS = Array.from({ length: 24 }).map((_, i) => i);

function getMockIntensity(hour: number) {
  if (hour >= 10 && hour <= 13) return "high";
  if (hour >= 18 && hour <= 21) return "medium";
  if (hour === 23 || hour <= 6) return "low";
  return "idle";
}

export default function LearningHeatmap() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-hover)]">
      <p className="text-sm font-semibold text-[var(--text)]">
        🧠 Usage Pattern (mock)
      </p>
      <p className="mt-1 text-xs text-[var(--muted)]">
        This mock heatmap will later come from the personalized learning API.
      </p>
      <div className="mt-4 grid grid-cols-12 gap-1">
        {HOURS.map((h) => {
          const intensity = getMockIntensity(h);
          const bg =
            intensity === "high"
              ? "bg-red-500"
              : intensity === "medium"
              ? "bg-orange-400"
              : intensity === "low"
              ? "bg-green-400"
              : "bg-gray-100";
          return (
            <div
              key={h}
              className={`h-7 rounded ${bg} transition-transform duration-150 hover:scale-[1.06]`}
              title={`${h}:00 activity (${intensity})`}
            />
          );
        })}
      </div>
      <div className="mt-2 flex justify-between text-[10px] text-[var(--muted)]">
        <span>0:00</span>
        <span>6:00</span>
        <span>12:00</span>
        <span>18:00</span>
        <span>23:00</span>
      </div>
    </div>
  );
}

