"use client";

import { useState } from "react";
import DiskHealthCard from "@/components/DiskHealthCard";
import SchedulerPanel from "@/components/SchedulerPanel";
import api from "@/lib/api";
import { Play, Activity, Loader2 } from "lucide-react";

export default function DiskPage() {
  const [ioStatus, setIoStatus] = useState("Optimal");
  const [running, setRunning] = useState(false);
  const [lastSummary, setLastSummary] = useState<string | null>(null);
  const [lastWarnings, setLastWarnings] = useState<string[]>([]);

  const runDiagnostic = async () => {
    setRunning(true);
    setLastSummary(null);
    setLastWarnings([]);
    try {
      const res = await api.post("/metrics/diagnostic/run");
      const overall = res.data?.overall_status || "UNKNOWN";
      if (overall === "CRITICAL") {
        setIoStatus("Critical");
      } else if (overall === "WARNING") {
        setIoStatus("Warning");
      } else if (overall === "PASS") {
        setIoStatus("Optimal");
      } else {
        setIoStatus("Unknown");
      }
      setLastSummary(res.data?.summary || "Diagnostics completed.");
      const warnings = res.data?.warnings || res.data?.scan?.warnings || [];
      setLastWarnings(warnings);
    } catch (err) {
      setIoStatus("Unknown");
      setLastSummary("Diagnostic failed. Please try again.");
    } finally {
      setRunning(false);
    }
  };

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
              IO Status: {ioStatus}
            </div>
           <button
             onClick={runDiagnostic}
             disabled={running}
             className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-500 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
           >
              {running ? <Loader2 className="h-3 w-3 animate-spin" /> : <Play className="h-3 w-3 fill-current" />}
              {running ? "Running..." : "Run Full Diagnostic"}
           </button>
        </div>
      </div>
      {lastSummary ? (
        <div className="text-[11px] text-slate-500 border-l-2 border-slate-200 dark:border-white/10 pl-3 py-1">
          {lastSummary}
        </div>
      ) : null}
      {lastSummary ? (
        <div className={`text-[11px] border-l-2 pl-3 py-1 space-y-1 ${
          lastWarnings.length
            ? "text-rose-500 border-rose-200 dark:border-rose-500/20"
            : "text-slate-400 border-slate-200 dark:border-white/10"
        }`}>
          {lastWarnings.length ? (
            lastWarnings.map((warning, index) => (
              <div key={`${warning}-${index}`}>{warning}</div>
            ))
          ) : (
            <div>No warnings detected.</div>
          )}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <DiskHealthCard />
        <SchedulerPanel />
      </div>
    </div>
  );
}
