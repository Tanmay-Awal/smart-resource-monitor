const MOCK_TASKS = [
  {
    id: "cleanup",
    label: "🧹 Cache Cleanup",
    description: "Clears temp files and cached data.",
    lastRun: "Yesterday, 9:15 PM",
  },
  {
    id: "memory",
    label: "💾 Memory Optimization",
    description: "Reclaims unused memory from background apps.",
    lastRun: "Today, 8:05 AM",
  },
];

export default function SchedulerPanel() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-hover)]">
      <p className="text-sm font-semibold text-[var(--text)]">
        🗓️ Scheduled Optimization (mock)
      </p>
      <p className="mt-1 text-xs text-[var(--muted)]">
        These tasks will later call real backend endpoints.
      </p>
      <div className="mt-4 space-y-3">
        {MOCK_TASKS.map((task) => (
          <div
            key={task.id}
            className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-xs transition-all duration-150 hover:-translate-y-[1px]"
          >
            <div>
              <p className="font-semibold text-[var(--text)]">{task.label}</p>
              <p className="text-[11px] text-[var(--muted)]">{task.description}</p>
              <p className="mt-1 text-[10px] text-[var(--muted)]">
                Last run: {task.lastRun}
              </p>
            </div>
            <button className="rounded-xl bg-[var(--accent)] px-3 py-1.5 text-[11px] font-extrabold text-white shadow-sm transition-all duration-200 hover:-translate-y-[1px] hover:brightness-110 active:translate-y-0">
              Run now (mock)
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

