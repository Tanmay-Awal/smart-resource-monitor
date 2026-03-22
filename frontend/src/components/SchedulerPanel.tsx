"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Calendar, Play, Clock, CheckCircle2, Loader2 } from "lucide-react";

export default function SchedulerPanel() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [runningId, setRunningId] = useState<number | null>(null);
  const [lastMessage, setLastMessage] = useState<string | null>(null);
  const [lastWarnings, setLastWarnings] = useState<string[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await api.get("/metrics/tasks");
        setTasks(res.data);
      } catch (err) {
        console.error("Failed to load tasks:", err);
      }
    };
    fetchTasks();
  }, []);

  const runTask = async (task: any) => {
    const taskKey = task.task_key || (task.name === "System Cleanup" ? "system_cleanup" : "deep_anomaly_scan");
    setRunningId(task.id);
    setLastMessage(null);
    setLastWarnings([]);
    setTasks((prev) => prev.map((t) => t.id === task.id ? { ...t, status: "active" } : t));
    try {
      const res = await api.post(`/metrics/tasks/run?task_key=${taskKey}`);
      const summary = res.data?.summary || res.data?.message || "Task completed.";
      setLastMessage(`${task.name}: ${summary}`);
      const warnings = res.data?.warnings || [];
      setLastWarnings(warnings);
      setTasks((prev) => prev.map((t) => t.id === task.id ? { ...t, status: "completed", last_run: "Just now" } : t));
    } catch (err) {
      setLastMessage(`${task.name}: failed to run.`);
      setLastWarnings([]);
      setTasks((prev) => prev.map((t) => t.id === task.id ? { ...t, status: "pending" } : t));
    } finally {
      setRunningId(null);
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-[#0b1222]">
      <div className="flex items-center gap-2 mb-6 text-slate-500">
        <Calendar className="h-4 w-4" />
        <h3 className="text-xs font-bold uppercase tracking-widest">Automation Pipeline</h3>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => {
          const isActive = task.status === "active";
          const isCompleted = task.status === "completed";
          const isRunning = runningId === task.id;
          const scheduleLabel = task.last_run ? `Last run: ${task.last_run}` : task.scheduled_at;
          
          return (
            <div
              key={task.id}
              className="group flex items-center justify-between rounded-lg border border-slate-100 dark:border-white/5 bg-slate-50/30 dark:bg-white/5 px-4 py-3 transition-colors hover:bg-slate-50 dark:hover:bg-white/10"
            >
              <div className="flex items-center gap-4">
                 <div className={`flex h-8 w-8 items-center justify-center rounded-full border ${
                    isCompleted ? "border-emerald-100 bg-emerald-50 text-emerald-600 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-500" : 
                    isActive ? "border-blue-100 bg-blue-50 text-blue-600 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-500" : 
                    "border-slate-200 bg-slate-100 text-slate-400 dark:border-white/10 dark:bg-white/5"
                 }`}>
                    {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : isActive ? <Loader2 className="h-4 w-4 animate-spin" /> : <Clock className="h-4 w-4" />}
                 </div>

                  <div>
                     <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                       {task.name}
                     </p>
                     <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                        <Clock className="h-3 w-3" />
                       {scheduleLabel}
                     </div>
                  </div>
               </div>

               <button
                 onClick={() => runTask(task)}
                 disabled={isRunning}
                 className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 dark:border-white/10 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-600 dark:hover:text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
               >
                  {isRunning ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5 fill-current" />}
               </button>
            </div>
          );
        })}
      </div>

      {lastMessage ? (
        <div className="mt-4 text-[11px] text-slate-500 border-l-2 border-slate-200 dark:border-white/10 pl-3 py-1">
          {lastMessage}
        </div>
      ) : null}
      {lastMessage ? (
        <div className={`mt-3 text-[11px] border-l-2 pl-3 py-1 space-y-1 ${
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

      <button className="w-full rounded-lg border border-slate-200 dark:border-white/10 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 transition-all mt-6">
         Configuration Access
      </button>
    </div>
  );
}
