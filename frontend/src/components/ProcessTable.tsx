"use client";

import { useMetrics } from "@/hooks/useMetrics";
import { Terminal, XCircle, Search } from "lucide-react";
import { useState } from "react";

export default function ProcessTable() {
  const { processes, killProcess } = useMetrics();
  const [search, setSearch] = useState("");

  const filtered = processes.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.pid.toString().includes(search)
  );

  const handleKill = async (pid: number, name: string) => {
    if (confirm(`Are you sure you want to terminate ${name} (PID: ${pid})?`)) {
      const result = await killProcess(pid);
      if (!result.success) {
        alert(result.error);
      }
    }
  };

  return (
    <div className="flex flex-col gap-4 overflow-hidden rounded-3xl border border-white/5 bg-slate-900/40 p-6 shadow-2xl backdrop-blur-xl transition-all duration-300">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20 text-blue-500">
            <Terminal className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-300">Command Center</h2>
            <p className="text-[10px] text-slate-500 font-medium">Real-time Task Management</p>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
          <input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks..." 
            className="w-full sm:w-48 rounded-xl bg-white/5 border border-white/5 py-1.5 pl-9 pr-4 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
          />
        </div>
      </div>

      <div className="mask-fade-bottom max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/5 text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black">
              <th className="px-3 py-4">Task</th>
              <th className="px-3 py-4">PID</th>
              <th className="px-3 py-4">Workload</th>
              <th className="px-3 py-4">Memory</th>
              <th className="px-3 py-4">State</th>
              <th className="px-3 py-4 text-right">Interrupt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.02]">
            {filtered.length > 0 ? (
              filtered.map((p) => (
                <tr
                  key={p.pid}
                  className="group transition-all hover:bg-white/[0.03]"
                >
                  <td className="px-3 py-4">
                    <div className="flex items-center gap-3">
                       <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-[10px] font-bold text-slate-400 group-hover:bg-blue-500/20 group-hover:text-blue-400 transition-colors">
                          {p.name.charAt(0).toUpperCase()}
                       </div>
                       <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors truncate max-w-[120px]">
                        {p.name}
                       </span>
                    </div>
                  </td>
                  <td className="px-3 py-4 text-xs font-mono text-slate-500">{p.pid}</td>
                  <td className="px-3 py-4">
                     <div className="flex items-center gap-2">
                        <span className={`text-sm font-black ${p.cpu_percent > 10 ? 'text-amber-500' : 'text-blue-500'}`}>
                          {p.cpu_percent.toFixed(1)}%
                        </span>
                        <div className="h-1 w-12 rounded-full bg-slate-800 overflow-hidden hidden sm:block">
                           <div className={`h-full ${p.cpu_percent > 10 ? 'bg-amber-500' : 'bg-blue-500'}`} style={{ width: `${Math.min(p.cpu_percent * 5, 100)}%` }} />
                        </div>
                     </div>
                  </td>
                  <td className="px-3 py-4 text-xs font-bold text-slate-400">{p.ram_mb} MB</td>
                  <td className="px-3 py-4">
                    <div className="flex items-center gap-2">
                       <div className={`h-1.5 w-1.5 rounded-full ${p.status === 'running' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-slate-600'}`} />
                       <span className={`text-[10px] font-black uppercase tracking-widest ${p.status === 'running' ? 'text-emerald-500' : 'text-slate-500'}`}>
                        {p.status}
                       </span>
                    </div>
                  </td>
                  <td className="px-3 py-4 text-right">
                    <button 
                      onClick={() => handleKill(p.pid, p.name)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-white/5 bg-white/5 px-3 py-1.5 text-[10px] font-black uppercase text-rose-500 transition-all hover:bg-rose-500 hover:text-white hover:shadow-[0_0_15px_rgba(244,63,94,0.4)]"
                    >
                      <XCircle className="h-3 w-3" />
                      TERMINATE
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-20 text-center">
                   <div className="flex flex-col items-center gap-2 opacity-20">
                      <Terminal className="h-12 w-12" />
                      <p className="text-sm font-bold uppercase tracking-[0.2em]">No Active Tasks</p>
                   </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
