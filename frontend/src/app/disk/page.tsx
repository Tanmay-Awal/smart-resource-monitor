import DiskHealthCard from "@/components/DiskHealthCard";
import SchedulerPanel from "@/components/SchedulerPanel";
import { HardDrive, Play, Activity } from "lucide-react";

export default function DiskPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-slate-200 dark:border-white/5 pb-6">
        <div>
           <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Storage & Maintenance</h2>
           <p className="text-xs text-slate-500 mt-1">Monitor disk integrity and manage automation sequences.</p>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="flex items-center gap-2 rounded-full border border-slate-200 dark:border-white/5 bg-white dark:bg-white/5 px-3 py-1.5 text-[10px] font-bold text-slate-700 dark:text-slate-300">
              <Activity className="h-3 w-3 text-blue-500" />
              IO Status: Optimal
           </div>
           <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-500 transition-all">
              <Play className="h-3 w-3 fill-current" />
              Run Full Diagnostic
           </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <DiskHealthCard />
        <SchedulerPanel />
      </div>
    </div>
  );
}
