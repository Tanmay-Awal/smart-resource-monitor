const HOURS = Array.from({ length: 24 }).map((_, i) => i);

function getMockIntensity(hour: number) {
  if (hour >= 10 && hour <= 13) return "critical";
  if (hour >= 18 && hour <= 21) return "high";
  if (hour === 23 || hour <= 6) return "low";
  return "idle";
}

export default function LearningHeatmap() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Neural Activity Map</h3>
        <p className="text-[10px] text-slate-500 italic mt-1">Learned daily resource cycle</p>
      </div>

      <div className="grid grid-cols-6 gap-2">
        {HOURS.map((h) => {
          const intensity = getMockIntensity(h);
          const styles =
            intensity === "critical"
              ? "bg-rose-500/80 shadow-[0_0_15px_rgba(244,63,94,0.4)]"
              : intensity === "high"
              ? "bg-amber-500/60 shadow-[0_0_10px_rgba(245,158,11,0.2)]"
              : intensity === "low"
              ? "bg-emerald-500/60 shadow-[0_0_10px_rgba(16,185,129,0.2)]"
              : "bg-slate-800/50";
          return (
            <div
              key={h}
              className={`group relative flex h-10 w-full cursor-help items-center justify-center rounded-lg border border-white/5 ${styles} transition-all duration-300 hover:scale-110 hover:z-10`}
              title={`${h}:00 Intensity: ${intensity}`}
            >
               <span className="text-[8px] font-black text-white/40 opacity-0 group-hover:opacity-100 transition-opacity">
                  {h}
               </span>
            </div>
          );
        })}
      </div>
      
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-4 text-[9px] font-bold text-slate-600 uppercase tracking-widest">
           <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-slate-800" /> Idle</div>
           <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-emerald-500/60" /> Low</div>
           <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-rose-500/80" /> Peak</div>
        </div>
      </div>
    </div>
  );
}
