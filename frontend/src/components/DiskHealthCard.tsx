const MOCK_DISK = {
  model: "Samsung SSD 970 EVO 500GB",
  health: "PASS",
  temperature: 46,
};

export default function DiskHealthCard() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-hover)]">
      <p className="text-sm font-semibold text-[var(--text)]">
        💾 Disk Health (mock)
      </p>
      <p className="mt-1 text-xs text-[var(--muted)]">{MOCK_DISK.model}</p>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-[var(--muted)]">Overall</span>
        <span className="rounded-full bg-emerald-500/15 px-3 py-0.5 text-xs font-semibold text-emerald-400">
          {MOCK_DISK.health}
        </span>
      </div>
      <div className="mt-4">
        <div className="mb-1 flex justify-between text-xs text-[var(--muted)]">
          <span>Temperature</span>
          <span>{MOCK_DISK.temperature}°C</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--surface-2)]">
          <div
            className="h-2 rounded-full bg-emerald-400 transition-all"
            style={{ width: `${Math.min((MOCK_DISK.temperature / 60) * 100, 100)}%` }}
          />
        </div>
      </div>
      <p className="mt-3 text-xs text-[var(--muted)]">
        No issues detected. Keep an eye on temperatures during heavy gaming or
        long compile sessions.
      </p>
    </div>
  );
}

