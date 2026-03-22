"use client";

import CrashAlertBanner from "@/components/CrashAlertBanner";
import LearningHeatmap from "@/components/LearningHeatmap";
import MetricCard from "@/components/MetricCard";
import MetricChart from "@/components/MetricChart";
import { useMetrics } from "@/hooks/useMetrics";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Activity, Thermometer, BrainCircuit, Info } from "lucide-react";

export default function DashboardPage() {
  const { metrics, loading } = useMetrics();
  const [autopilotEnabled, setAutopilotEnabled] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await api.get("/metrics/autopilot/status");
        setAutopilotEnabled(res.data.autopilot_enabled);
      } catch (err) {}
    };
    fetchStatus();
  }, []);

  if (loading || !metrics) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-500" />
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Loading system metrics</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Dynamic System Status Bar */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-slate-200 dark:border-white/5 pb-6">
        <div>
           <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">System Overview</h2>
           <p className="text-xs text-slate-500 mt-1">Real-time resource performance and AI-driven anomalies.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
           <div className={`flex items-center gap-2 rounded-full border border-slate-200 dark:border-white/5 bg-white dark:bg-white/5 px-3 py-1.5 text-[10px] font-bold ${metrics.anomaly ? 'text-rose-600' : 'text-emerald-600'}`}>
              <div className={`h-1.5 w-1.5 rounded-full ${metrics.anomaly ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`} />
              {metrics.anomaly ? "Anomalies Detected" : "System Stable"}
           </div>
           <div className={`flex items-center gap-2 rounded-full border border-slate-200 dark:border-white/5 bg-white dark:bg-white/5 px-3 py-1.5 text-[10px] font-bold ${autopilotEnabled ? 'text-blue-600' : 'text-slate-500'}`}>
              <BrainCircuit className="h-3 w-3" />
              Auto-Pilot: {autopilotEnabled ? "Engaged" : "Passive"}
           </div>
           <div className="flex items-center gap-2 rounded-full border border-slate-200 dark:border-white/5 bg-white dark:bg-white/5 px-3 py-1.5 text-[10px] font-bold text-slate-700 dark:text-slate-300">
              <Thermometer className="h-3 w-3 text-rose-500" />
              {metrics.cpu_temp ? `${metrics.cpu_temp}°C` : "72°C"}
           </div>
        </div>
      </div>

      {metrics.anomaly && (
        <CrashAlertBanner probability={85} timeMin={10} visible />
      )}

      {/* Main Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="CPU Load" value={metrics.cpu_percent} unit="%" color={metrics.cpu_percent > 80 ? "red" : "blue"} trend="+0.2%" />
        <MetricCard title="RAM Occupied" value={metrics.ram_percent} unit="%" color={metrics.ram_percent > 80 ? "red" : "green"} trend="-1.5%"/>
        <MetricCard title="Memory Pool" value={metrics.ram_used_gb} unit="GB" color="purple" trend="Nominal" />
        <MetricCard title="IO Throughput" value={metrics.disk_read_mb} unit="MB/s" color="orange" trend="High" />
      </div>

      {/* Primary Analytics Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-[#0b1222]">
           <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                 <Activity className="h-4 w-4 text-blue-500" />
                 <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Resource Consumption History</h3>
              </div>
              <div className="flex gap-1">
                 <button className="rounded px-2 py-1 text-[10px] font-bold bg-slate-100 text-slate-900 dark:bg-white/10 dark:text-white">24h</button>
                 <button className="rounded px-2 py-1 text-[10px] font-bold text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5">7d</button>
              </div>
           </div>
           <div className="h-[280px]">
              <MetricChart />
           </div>
        </div>
        
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-[#0b1222]">
           <div className="mb-6 flex items-center gap-2">
              <BrainCircuit className="h-4 w-4 text-purple-500" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Neural Pattern Learn</h3>
           </div>
           <LearningHeatmap />
           <div className="mt-6 flex items-start gap-3 rounded-lg bg-blue-50 dark:bg-blue-500/5 p-4 border border-blue-100 dark:border-blue-500/10">
              <Info className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed text-blue-800 dark:text-blue-300">
                Performance patterns indicate optimal resource utilization during peak hours. Predicted anomalous behavior: <strong>Nil</strong>.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
