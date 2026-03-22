"use client";

import { TrendingDown, TrendingUp, Minus } from "lucide-react";

export default function MetricCard({
  title,
  value,
  unit,
  color,
  trend,
}: {
  title: string;
  value: number;
  unit: string;
  color?: string;
  trend?: string;
}) {
  const isDanger = value > 90;
  const isHigh = value > 75;

  const getStatusColor = () => {
    if (isDanger) return "text-rose-600 dark:text-rose-500 bg-rose-50 dark:bg-rose-500/10 border-rose-100 dark:border-rose-500/20";
    if (isHigh) return "text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-500/10 border-amber-100 dark:border-amber-500/20";
    return "text-blue-600 dark:text-blue-500 bg-blue-50 dark:bg-blue-500/10 border-blue-100 dark:border-blue-500/20";
  };

  return (
    <div className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-blue-500/30 hover:shadow-md dark:border-white/5 dark:bg-[#0b1222]">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{title}</span>
        {trend && (
           <div className={`flex items-center gap-1 text-[10px] font-bold ${trend.startsWith('+') ? 'text-rose-500' : trend === 'Nominal' ? 'text-slate-400' : 'text-emerald-500'}`}>
              {trend.startsWith('+') ? <TrendingUp className="h-3 w-3" /> : trend === 'Nominal' ? <Minus className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {trend}
           </div>
        )}
      </div>
      
      <div className="flex items-baseline gap-1">
        <span className={`text-2xl font-black tracking-tight ${isDanger ? 'text-rose-500' : isHigh ? 'text-amber-500' : 'text-slate-900 dark:text-white'}`}>
          {value.toFixed(1)}
        </span>
        <span className="text-xs font-bold text-slate-400">{unit}</span>
      </div>

      <div className="mt-4 space-y-2">
         <div className="h-1 w-full rounded-full bg-slate-100 dark:bg-white/5 overflow-hidden">
            <div 
               className={`h-full rounded-full transition-all duration-1000 ${isDanger ? 'bg-rose-500' : isHigh ? 'bg-amber-500' : 'bg-blue-500'}`}
               style={{ width: `${Math.min(value, 100)}%` }}
            />
         </div>
      </div>
    </div>
  );
}
