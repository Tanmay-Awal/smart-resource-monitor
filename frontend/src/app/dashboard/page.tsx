import CrashAlertBanner from "@/components/CrashAlertBanner";
import LearningHeatmap from "@/components/LearningHeatmap";
import MetricCard from "@/components/MetricCard";
import MetricChart from "@/components/MetricChart";

export default function DashboardPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1000px_circle_at_20%_10%,rgba(37,99,235,0.18),transparent_55%),radial-gradient(900px_circle_at_90%_30%,rgba(124,58,237,0.18),transparent_55%)]" />
        <div className="relative p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text)]">
                Smart Resource Monitor
              </h1>
              <p className="mt-1 text-sm text-[var(--muted)]">
                System stable • 2 warnings today • Live insights updating in
                real-time
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-1 text-xs font-semibold text-[var(--text)]">
                  Crash Risk: <span className="text-[var(--danger)]">High</span>
                </span>
                <span className="rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-1 text-xs font-semibold text-[var(--text)]">
                  Auto-Pilot: <span className="text-[var(--accent)]">Off</span>
                </span>
                <span className="rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-1 text-xs font-semibold text-[var(--text)]">
                  Disk Health: <span className="text-[var(--accent-2)]">PASS</span>
                </span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-hover)]">
                <p className="text-[11px] font-semibold text-[var(--muted)]">
                  Uptime
                </p>
                <p className="mt-1 text-lg font-bold text-[var(--text)]">
                  3h 12m
                </p>
              </div>
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-hover)]">
                <p className="text-[11px] font-semibold text-[var(--muted)]">
                  Anomalies
                </p>
                <p className="mt-1 text-lg font-bold text-[var(--text)]">2</p>
              </div>
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-hover)]">
                <p className="text-[11px] font-semibold text-[var(--muted)]">
                  Last sync
                </p>
                <p className="mt-1 text-lg font-bold text-[var(--text)]">
                  2s
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CrashAlertBanner probability={87} timeMin={8} visible />

      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard title="CPU Usage" value={67} unit="%" color="blue" />
        <MetricCard title="RAM Usage" value={72} unit="%" color="green" />
        <MetricCard title="RAM Used" value={11.5} unit="GB" color="purple" />
        <MetricCard title="Disk Read" value={45} unit="MB/s" color="orange" />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <MetricChart />
        </div>
        <LearningHeatmap />
      </div>
    </div>
  );
}

