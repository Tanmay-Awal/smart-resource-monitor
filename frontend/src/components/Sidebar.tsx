"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Gauge, HardDrive, Bot, SlidersHorizontal, Cpu, ChevronRight } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Gauge },
  { href: "/autopilot", label: "Auto-Pilot", icon: SlidersHorizontal },
  { href: "/disk", label: "Disk & Tasks", icon: HardDrive },
  { href: "/stories", label: "AI Stories", icon: Bot },
  { href: "/notifications", label: "Notifications", icon: Bell },
];

export function Sidebar({ collapsed = false }: { collapsed?: boolean }) {
  const pathname = usePathname();

  return (
    <aside
      className={`fixed left-0 top-0 bottom-0 z-40 flex flex-col border-r border-slate-200 bg-white dark:border-white/5 dark:bg-[#0b1222] transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="flex h-16 items-center px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 min-w-8 items-center justify-center rounded-lg bg-blue-600">
            <Cpu className="h-5 w-5 text-white" />
          </div>
          {!collapsed && (
            <span className="text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-white">
               SRM Core
            </span>
          )}
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-600/10 dark:text-blue-400"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white"
              } ${collapsed ? "justify-center" : ""}`}
            >
              <Icon className={`h-4 w-4 transition-colors ${active ? "text-blue-600 dark:text-blue-400" : "text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white"}`} />
              {!collapsed && (
                <div className="flex flex-1 items-center justify-between">
                  <span>{item.label}</span>
                  {active && <ChevronRight className="h-3 w-3 opacity-50" />}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto border-t border-slate-100 dark:border-white/5">
        {!collapsed ? (
           <div className="flex items-center gap-3 rounded-lg bg-slate-50 dark:bg-white/5 p-3">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              <div className="flex flex-col">
                 <span className="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-tighter">System Online</span>
                 <span className="text-[10px] text-slate-500">v1.2.4 stable</span>
              </div>
           </div>
        ) : (
           <div className="flex justify-center">
              <div className="h-2 w-2 rounded-full bg-emerald-500" title="System Online" />
           </div>
        )}
      </div>
    </aside>
  );
}
