"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Bell, Info, AlertTriangle, ShieldAlert, X } from "lucide-react";

type Notification = {
  id: number;
  message: string;
  type: "warning" | "critical" | "info";
  time: string;
};

export default function NotificationCenter() {
  const [items, setItems] = useState<Notification[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get("/metrics/notifications");
        setItems(res.data);
      } catch (err) {}
    };
    fetchNotifications();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-4">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-blue-500" />
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">System Signals</h2>
        </div>
        <button className="text-[10px] font-bold text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
          Dismiss All
        </button>
      </div>

      <div className="space-y-2">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400 opacity-30">
             <Bell className="h-8 w-8 mb-2" />
             <p className="text-[10px] font-bold uppercase tracking-widest">Signal clear</p>
          </div>
        ) : (
          items.map((n) => {
            const styles = {
              critical: "border-rose-100 bg-rose-50 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/5 dark:text-rose-400",
              warning: "border-amber-100 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/5 dark:text-amber-400",
              info: "border-slate-100 bg-slate-50 text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-400",
            }[n.type];

            const Icon = {
              critical: ShieldAlert,
              warning: AlertTriangle,
              info: Info,
            }[n.type];

            return (
              <div
                key={n.id}
                className={`flex items-start gap-4 rounded-lg border p-3 transition-colors ${styles}`}
              >
                <Icon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                
                <div className="flex-1 space-y-0.5">
                   <div className="flex items-center justify-between">
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-70">{n.type}</p>
                      <span className="text-[10px] font-medium opacity-50">{n.time}</span>
                   </div>
                   <p className="text-xs font-semibold leading-relaxed">
                     {n.message}
                   </p>
                </div>

                <button className="opacity-40 hover:opacity-100 transition-opacity">
                   <X className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          })
        )}
      </div>

      <button className="w-full rounded-lg bg-slate-100 dark:bg-white/5 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:bg-slate-200 dark:hover:bg-white/10 transition-all mt-2">
         View Telemetry History
      </button>
    </div>
  );
}
