import Chatbot from "@/components/Chatbot";
import StoryCard from "@/components/StoryCard";
import { Sparkles, Trophy, Snowflake, Zap, BrainCircuit } from "lucide-react";

const ACHIEVEMENTS = [
  { icon: Trophy, label: "Stability", desc: "No crashes this week", color: "text-amber-500", bg: "bg-amber-500/10" },
  { icon: Snowflake, label: "Thermal", desc: "Optimal temperature", color: "text-blue-400", bg: "bg-blue-400/10" },
  { icon: Zap, label: "Efficiency", desc: "Auto-pilot active", color: "text-purple-400", bg: "bg-purple-400/10" },
];

export default function StoriesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-slate-200 dark:border-white/5 pb-6">
        <div>
           <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Neural Insights</h2>
           <p className="text-xs text-slate-500 mt-1">Daily system narratives and interactive AI assistant.</p>
        </div>
        
        <div className="flex items-center gap-2 rounded-full border border-slate-200 dark:border-white/5 bg-white dark:bg-white/5 px-3 py-1.5 text-[10px] font-bold text-slate-700 dark:text-slate-300">
           <BrainCircuit className="h-3 w-3 text-purple-500" />
           Core Active
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {ACHIEVEMENTS.map((b) => (
          <div
            key={b.label}
            className="flex items-center gap-3 rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0b1222] p-4 shadow-sm"
          >
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${b.bg} ${b.color}`}>
               <b.icon className="h-5 w-5" />
            </div>
            <div>
               <p className="text-xs font-bold text-slate-900 dark:text-white">{b.label}</p>
               <p className="text-[10px] text-slate-500">{b.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2 space-y-4">
           <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-1">Synthesized Story</h3>
           <StoryCard />
        </div>
        <div className="lg:col-span-3 space-y-4">
           <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-1">Intelligence Console</h3>
           <div className="rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0b1222] shadow-sm overflow-hidden min-h-[500px]">
              <Chatbot />
           </div>
        </div>
      </div>
    </div>
  );
}
