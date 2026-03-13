import NotificationCenter from "@/components/NotificationCenter";

export default function NotificationsPage() {
  return (
    <div className="space-y-4 p-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">Notifications</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Alerts, anomalies, and smart tips in one place.
          </p>
        </div>
        <span className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs font-semibold text-[var(--muted)]">
          Live mode: mock
        </span>
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow)]">
        <NotificationCenter />
      </div>
    </div>
  );
}

