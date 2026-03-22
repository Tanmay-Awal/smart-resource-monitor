import NotificationCenter from "@/components/NotificationCenter";
import { Bell, Radio, SignalHigh } from "lucide-react";

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-slate-200 dark:border-white/5 pb-6">
        <div>
           <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Alert Hub</h2>
           <p className="text-xs text-slate-500 mt-1">Real-time signal feed and critical system events.</p>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="flex items-center gap-2 rounded-full border border-slate-200 dark:border-white/5 bg-white dark:bg-white/5 px-3 py-1.5 text-[10px] font-bold text-slate-700 dark:text-slate-300">
              <Radio className="h-3 w-3 text-blue-500 animate-pulse" />
              Monitoring
           </div>
           <div className="flex items-center gap-2 rounded-full border border-slate-200 dark:border-white/5 bg-white dark:bg-white/5 px-3 py-1.5 text-[10px] font-bold text-slate-700 dark:text-slate-300">
              <SignalHigh className="h-3 w-3 text-emerald-500" />
              Signal: 98%
           </div>
        </div>
      </div>

      <div className="max-w-3xl">
         <NotificationCenter />
      </div>
    </div>
  );
}
