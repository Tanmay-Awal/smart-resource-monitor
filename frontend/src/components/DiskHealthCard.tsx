"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { HardDrive, ShieldCheck, ShieldAlert } from "lucide-react";

export default function DiskHealthCard() {
  const [diskInfo, setDiskInfo] = useState<any>(null);

  useEffect(() => {
    const fetchDisk = async () => {
      try {
        const res = await api.get("/metrics/disk");
        setDiskInfo(res.data);
      } catch (err) {
        console.error("Failed to load disk info:", err);
      }
    };
    fetchDisk();
  }, []);

  if (!diskInfo) {
     return (
       <div className="flex h-48 items-center justify-center rounded-xl border border-slate-200 bg-white dark:border-white/5 dark:bg-[#0b1222] animate-pulse">
         <div className="h-4 w-4 rounded-full border-2 border-slate-200 border-t-blue-500 animate-spin" />
       </div>
     );
  }

  const summary = diskInfo.health_summary || "UNKNOWN";
  const systemUsage = diskInfo.system_usage;
  const hasUsage = systemUsage && typeof systemUsage.percent === "number";
  const usagePercent = hasUsage ? systemUsage.percent : 0;
  const isWarning = hasUsage ? usagePercent > 85 : false;
  const summaryStyles = summary === "PASS"
    ? "bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-500 dark:border-emerald-500/20"
    : summary === "WARNING"
      ? "bg-amber-50 text-amber-700 border border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20"
      : summary === "CRITICAL"
        ? "bg-rose-50 text-rose-600 border border-rose-100 dark:bg-rose-500/10 dark:text-rose-500 dark:border-rose-500/20"
        : "bg-slate-100 text-slate-500 border border-slate-200 dark:bg-white/5 dark:text-slate-400 dark:border-white/10";
  const capacityStatus = !hasUsage
    ? "UNKNOWN"
    : usagePercent >= 90
      ? "CRITICAL"
      : usagePercent >= 80
        ? "WARNING"
        : "PASS";
  const capacityStyles = capacityStatus === "PASS"
    ? "bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-500 dark:border-emerald-500/20"
    : capacityStatus === "WARNING"
      ? "bg-amber-50 text-amber-700 border border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20"
      : capacityStatus === "CRITICAL"
        ? "bg-rose-50 text-rose-600 border border-rose-100 dark:bg-rose-500/10 dark:text-rose-500 dark:border-rose-500/20"
        : "bg-slate-100 text-slate-500 border border-slate-200 dark:bg-white/5 dark:text-slate-400 dark:border-white/10";

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-[#0b1222]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
           <HardDrive className="h-5 w-5 text-blue-500" />
           <h3 className="text-sm font-bold text-slate-900 dark:text-white">Disk Diagnostics</h3>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ${summaryStyles}`}>
             {summary === "PASS" ? <ShieldCheck className="h-3 w-3" /> : <ShieldAlert className="h-3 w-3" />}
             SMART: {summary}
          </div>
          <div className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ${capacityStyles}`}>
             {capacityStatus === "PASS" ? <ShieldCheck className="h-3 w-3" /> : <ShieldAlert className="h-3 w-3" />}
             Capacity: {capacityStatus}
          </div>
        </div>
      </div>

      <div className="space-y-6">
         {hasUsage && (
           <div className="space-y-2">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500">
                 <span>System Drive Utilization</span>
                 <span className={isWarning ? 'text-rose-500' : 'text-blue-500'}>{usagePercent}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-white/5 overflow-hidden">
                 <div 
                   className={`h-full rounded-full transition-all duration-1000 ${isWarning ? 'bg-rose-500' : 'bg-blue-500'}`} 
                   style={{ width: `${usagePercent}%` }}
                 />
              </div>
           </div>
         )}

         {hasUsage && (
           <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border border-slate-100 dark:border-white/5 p-3">
                 <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Used Space</p>
                 <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{systemUsage.used_gb} GB</p>
              </div>
              <div className="rounded-lg border border-slate-100 dark:border-white/5 p-3">
                 <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Capacity</p>
                 <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{systemUsage.total_gb} GB</p>
              </div>
           </div>
         )}

         <div className="space-y-3">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500">
               <span>Physical Disks</span>
               <span className="text-slate-400">{diskInfo.disks?.length || 0} detected</span>
            </div>
            {diskInfo.disks?.length ? (
              <div className="space-y-3">
                {diskInfo.disks.map((disk: any) => (
                  <div key={`${disk.device_id}-${disk.serial || "disk"}`} className="rounded-lg border border-slate-100 dark:border-white/5 p-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{disk.model || "Disk"}</p>
                      <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${
                        disk.health === "PASS"
                          ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                          : disk.health === "WARNING"
                            ? "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
                            : disk.health === "CRITICAL"
                              ? "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400"
                              : "bg-slate-100 text-slate-500 dark:bg-white/5 dark:text-slate-400"
                      }`}>
                        {disk.health}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      {disk.media_type || "Unknown"}
                      {typeof disk.size_gb === "number" ? ` • ${disk.size_gb} GB` : ""}
                      {disk.operational_status ? ` • ${disk.operational_status}` : ""}
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-2 text-[11px] text-slate-500">
                      {disk.temperature_c !== null && disk.temperature_c !== undefined ? (
                        <div>Temp: {disk.temperature_c}°C</div>
                      ) : null}
                      {disk.wear !== null && disk.wear !== undefined ? (
                        <div>Wear: {disk.wear}%</div>
                      ) : null}
                      {disk.read_errors !== null && disk.read_errors !== undefined ? (
                        <div>Read errors: {disk.read_errors}</div>
                      ) : null}
                      {disk.write_errors !== null && disk.write_errors !== undefined ? (
                        <div>Write errors: {disk.write_errors}</div>
                      ) : null}
                      {disk.power_on_hours !== null && disk.power_on_hours !== undefined ? (
                        <div>Power-on hours: {disk.power_on_hours}</div>
                      ) : null}
                      {disk.serial ? <div>Serial: {disk.serial}</div> : null}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-[11px] text-slate-500 italic">No physical disk data available.</div>
            )}
         </div>

         {diskInfo.errors?.length ? (
           <div className="text-[11px] text-rose-500 leading-relaxed border-l-2 border-rose-200 dark:border-rose-500/20 pl-3 py-1">
             {diskInfo.errors.join(" | ")}
           </div>
         ) : null}
      </div>
    </div>
  );
}
