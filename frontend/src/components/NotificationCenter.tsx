"use client";

type Notification = {
  id: number;
  message: string;
  type: "warning" | "critical" | "info";
  time: string;
};

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    message: "CPU spike detected while Chrome and VS Code are open.",
    type: "warning",
    time: "10:23 AM",
  },
  {
    id: 2,
    message: "High RAM usage from chrome.exe (1.2 GB).",
    type: "critical",
    time: "10:18 AM",
  },
];

export default function NotificationCenter() {
  const items = INITIAL_NOTIFICATIONS;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[var(--text)]">
          Notifications (mock)
        </h2>
        <span className="rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-2 py-0.5 text-xs text-[var(--muted)]">
          Quiet mode & real-time wiring will be added later
        </span>
      </div>
      {items.length === 0 && (
        <p className="text-sm text-[var(--muted)]">No alerts. System is calm.</p>
      )}
      {items.map((n) => (
        <div
          key={n.id}
          className={`flex items-start justify-between rounded-2xl border px-3 py-2 text-sm transition-all duration-150 hover:-translate-y-[1px] hover:shadow-[var(--shadow)] ${
            n.type === "critical"
              ? "border-rose-400/30 bg-rose-500/10"
              : n.type === "warning"
              ? "border-amber-400/30 bg-amber-500/10"
              : "border-blue-400/25 bg-blue-500/10"
          }`}
        >
          <div>
            <p className="font-semibold text-[var(--text)]">
              {n.type === "critical"
                ? "🚨 Critical"
                : n.type === "warning"
                ? "⚠️ Warning"
                : "ℹ️ Info"}
            </p>
            <p className="mt-1 text-xs text-[var(--muted)]">{n.message}</p>
            <p className="mt-1 text-[10px] text-[var(--muted)]">{n.time}</p>
          </div>
          <button className="ml-3 text-xs text-[var(--muted)] hover:text-[var(--text)]">
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}

