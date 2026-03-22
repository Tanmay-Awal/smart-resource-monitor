"use client";

import ProcessTable from "@/components/ProcessTable";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Bot, History, BrainCircuit, ShieldAlert } from "lucide-react";

export default function AutoPilotPage() {
  const [enabled, setEnabled] = useState(false);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const fetchStatusAndHistory = async () => {
      try {
        const res = await api.get("/metrics/autopilot/status");
        setEnabled(res.data.autopilot_enabled);
      } catch (err) {
        console.error("Error fetching autopilot status:", err);
      }
    };
    const fetchHistory = async () => {
      try {
        const histRes = await api.get("/metrics/autopilot/history");
        setHistory(histRes.data);
      } catch (err) {
        console.error("Error fetching autopilot history:", err);
      }
    };

    fetchStatusAndHistory();
    fetchHistory();
  }, []);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let isActive = true;
    const runAutoCheck = async () => {
      try {
        await api.post("/metrics/autopilot/auto-check");
        if (isActive) {
          const histRes = await api.get("/metrics/autopilot/history");
          setHistory(histRes.data);
        }
      } catch (err) {
        console.error("Auto-pilot check failed:", err);
      }
    };

    runAutoCheck();
    const interval = setInterval(runAutoCheck, 5000);

    return () => {
      isActive = false;
      clearInterval(interval);
    };
  }, [enabled]);

  const toggleAutoPilot = async () => {
    const newState = !enabled;
    try {
      await api.post(`/metrics/autopilot/toggle?enable=${newState}`);
      setEnabled(newState);
    } catch (err) {
      alert("Failed to toggle Auto-Pilot");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-slate-200 dark:border-white/5 pb-6">
        <div>
           <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Autonomous Core</h2>
           <p className="text-xs text-slate-500 mt-1">AI-powered resource optimization and safety protocols.</p>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="flex flex-col items-end mr-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Protocol Status</span>
              <span className={`text-[11px] font-bold ${enabled ? 'text-emerald-500' : 'text-slate-400'}`}>
                {enabled ? 'Synchronized' : 'Passive'}
              </span>
           </div>
           <button
             onClick={toggleAutoPilot}
             className={`relative h-6 w-11 rounded-full p-1 transition-all duration-300 ${
               enabled ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-700"
             }`}
           >
             <div
               className={`h-4 w-4 rounded-full bg-white shadow-lg transition-all duration-300 ${
                 enabled ? "translate-x-5" : "translate-x-0"
               }`}
             />
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
           <ProcessTable />
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-[#0b1222]">
          <div className="flex items-center gap-2 mb-6 text-slate-500">
            <History className="h-4 w-4" />
            <h3 className="text-xs font-bold uppercase tracking-widest">Decision Logs</h3>
          </div>
          <div className="space-y-4">
            {history.length > 0 ? history.map((h, i) => (
              <div key={i} className="group relative rounded-lg border border-slate-100 dark:border-white/5 p-3 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                <div className="flex justify-between items-start mb-1">
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{h.name}</p>
                  <span className="text-[9px] font-bold text-rose-500 border border-rose-200 dark:border-rose-900 px-1.5 py-0.5 rounded uppercase">{h.action}</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                   <BrainCircuit className="h-3 w-3" />
                   Handled by {h.by}
                </div>
              </div>
            )) : (
              <div className="flex flex-col items-center gap-2 py-12 opacity-20">
                 <Bot className="h-8 w-8" />
                 <p className="text-[10px] font-bold uppercase tracking-widest">Queue empty</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
