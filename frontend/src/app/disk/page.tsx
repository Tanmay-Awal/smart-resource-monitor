import DiskHealthCard from "@/components/DiskHealthCard";
import SchedulerPanel from "@/components/SchedulerPanel";

export default function DiskPage() {
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Disk & Scheduled Tasks</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <DiskHealthCard />
        <SchedulerPanel />
      </div>
    </div>
  );
}

