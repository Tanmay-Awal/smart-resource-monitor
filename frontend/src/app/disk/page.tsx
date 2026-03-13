import DiskHealthCard from "@/components/DiskHealthCard";
import SchedulerPanel from "@/components/SchedulerPanel";

export default function DiskPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">
            Disk & Scheduled Tasks
          </h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Track disk health and run maintenance tasks at the right time.
          </p>
        </div>
        <span className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs font-semibold text-[var(--muted)]">
          Status: mock
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <DiskHealthCard />
        <SchedulerPanel />
      </div>
    </div>
  );
}

