"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { HardDrive, ShieldCheck, ShieldAlert } from "lucide-react";

export default function DiskHealthCard() {
  const [disk, setDisk] = useState<any>(null);

  useEffect(() => {
    const fetchDisk = async () => {
      try {
        const res = await api.get("/metrics/disk");
        setDisk(res.data);
      } catch (err) {}
    };
    fetchDisk();
  }, []);

  if (!disk) {
     return (
       <div className="flex h-48 items-center justify-center rounded-xl border border-slate-200 bg-white dark:border-white/5 dark:bg-[#0b1222] animate-pulse">
         <div className="h-4 w-4 rounded-full border-2 border-slate-200 border-t-blue-500 animate-spin" />
       </div>
     );
  }

  const isWarning = disk.percent > 85;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-[#0b1222]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
           <HardDrive className="h-5 w-5 text-blue-500" />
           <h3 className="text-sm font-bold text-slate-900 dark:text-white">Disk Diagnostics</h3>
        </div>
        <div className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ${
          disk.health === "PASS" ? "bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-500 dark:border-emerald-500/20" : "bg-rose-50 text-rose-600 border border-rose-100 dark:bg-rose-500/10 dark:text-rose-500 dark:border-rose-500/20"
        }`}>
           {disk.health === "PASS" ? <ShieldCheck className="h-3 w-3" /> : <ShieldAlert className="h-3 w-3" />}
           Status: {disk.health}
        </div>
      </div>

      <div className="space-y-6">
         <div className="space-y-2">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500">
               <span>Utilization</span>
               <span className={isWarning ? 'text-rose-500' : 'text-blue-500'}>{disk.percent}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-white/5 overflow-hidden">
               <div 
                 className={`h-full rounded-full transition-all duration-1000 ${isWarning ? 'bg-rose-500' : 'bg-blue-500'}`} 
                 style={{ width: `${disk.percent}%` }}
               />
            </div>
         </div>

         <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border border-slate-100 dark:border-white/5 p-3">
               <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Used Space</p>
               <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{disk.used_gb} GB</p>
            </div>
            <div className="rounded-lg border border-slate-100 dark:border-white/5 p-3">
               <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Capacity</p>
               <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{disk.total_gb} GB</p>
            </div>
         </div>

         <div className="text-[11px] text-slate-500 leading-relaxed italic border-l-2 border-slate-200 dark:border-white/10 pl-3 py-1">
            Mount point integrity verified. Model: <span className="text-slate-900 dark:text-white font-medium">{disk.model}</span>
         </div>
      </div>
    </div>
  );
}
