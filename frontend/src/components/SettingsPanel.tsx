"use client";

import { X, Moon, Sun, Monitor, Bell, Sliders } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

export function SettingsPanel({
  open,
  onClose,
  sidebarCollapsed,
  onToggleSidebarDefault,
}: {
  open: boolean;
  onClose: () => void;
  sidebarCollapsed: boolean;
  onToggleSidebarDefault: () => void;
}) {
  const { theme, setTheme } = useTheme();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <div 
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose} 
      />
      
      <div className="relative h-full w-full max-w-sm border-l border-white/5 bg-slate-900/90 shadow-2xl backdrop-blur-2xl animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between border-b border-white/5 px-6 py-6">
          <div>
            <h2 className="text-lg font-black tracking-tight text-white">System Configuration</h2>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">v2.4 Neural Interface</p>
          </div>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-slate-400 transition-all hover:bg-white/10 hover:text-white"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-8 p-6">
          <section className="space-y-4">
            <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
               <Monitor className="h-3.5 w-3.5" />
               Visual Environment
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                className={`flex items-center justify-center gap-2 rounded-2xl border py-4 text-xs font-bold transition-all ${
                  theme === "light"
                    ? "border-blue-500 bg-blue-500/10 text-white shadow-[0_0_15px_-3px_rgba(59,130,246,0.5)]"
                    : "border-white/5 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                }`}
                onClick={() => setTheme("light")}
              >
                <Sun className="h-4 w-4" />
                Diel Core
              </button>
              <button
                className={`flex items-center justify-center gap-2 rounded-2xl border py-4 text-xs font-bold transition-all ${
                  theme === "dark"
                    ? "border-blue-500 bg-blue-500/10 text-white shadow-[0_0_15px_-3px_rgba(59,130,246,0.5)]"
                    : "border-white/5 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                }`}
                onClick={() => setTheme("dark")}
              >
                <Moon className="h-4 w-4" />
                Vesper Core
              </button>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
               <Sliders className="h-3.5 w-3.5" />
               Viewpoint Optimization
            </h3>
            <div className="rounded-2xl border border-white/5 bg-white/5 p-4 transition-all hover:bg-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-200">Minimal Sidebar</p>
                  <p className="text-[10px] font-medium text-slate-500 mt-1">Expands interface workspace</p>
                </div>
                <button
                  className={`relative h-6 w-11 rounded-full p-1 transition-all duration-300 ${
                    sidebarCollapsed ? "bg-blue-600" : "bg-slate-700"
                  }`}
                  onClick={onToggleSidebarDefault}
                >
                  <div
                    className={`h-4 w-4 rounded-full bg-white shadow-lg transition-all duration-300 ${
                      sidebarCollapsed ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          </section>

          <section className="space-y-4">
             <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
               <Bell className="h-3.5 w-3.5" />
               Signal Preferences
            </h3>
            <div className="rounded-2xl border border-white/5 bg-white/5 p-5 text-center">
               <div className="flex flex-col items-center gap-3 opacity-20">
                  <div className="h-12 w-12 rounded-full border-2 border-dashed border-slate-600 flex items-center justify-center">
                     <Bell className="h-6 w-6" />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Advanced Protocols Locked</p>
               </div>
               <button className="mt-4 w-full rounded-xl bg-blue-600/10 py-2.5 text-[9px] font-black uppercase tracking-widest text-blue-500 hover:bg-blue-600 hover:text-white transition-all">
                  Upgrade Access
               </button>
            </div>
          </section>
        </div>
        
        <div className="absolute bottom-0 w-full p-8 border-t border-white/5 bg-slate-900/40">
           <button className="w-full rounded-2xl bg-white/5 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 transition-all hover:bg-rose-500 hover:text-white">
              Terminate Session
           </button>
        </div>
      </div>
    </div>
  );
}
