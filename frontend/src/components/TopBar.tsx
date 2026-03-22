"use client";

import { usePathname } from "next/navigation";
import { Cog, Moon, Sun, PanelLeftClose, PanelLeftOpen, Search } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

export function TopBar({
  sidebarCollapsed,
  onToggleSidebar,
  onOpenSettings,
}: {
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  onOpenSettings: () => void;
}) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  const getPageTitle = () => {
    const segment = pathname.split("/").pop();
    if (!segment || segment === "") return "Dashboard";
    return segment.charAt(0).toUpperCase() + segment.slice(1);
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center border-b border-slate-200 bg-white/80 px-6 backdrop-blur-md dark:border-white/5 dark:bg-[#020617]/80">
      <button
        onClick={onToggleSidebar}
        className="mr-4 flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 dark:hover:text-white"
        aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {sidebarCollapsed ? (
          <PanelLeftOpen className="h-4 w-4" />
        ) : (
          <PanelLeftClose className="h-4 w-4" />
        )}
      </button>

      <div className="flex flex-col">
        <h1 className="text-sm font-bold text-slate-900 dark:text-white">
          {getPageTitle()}
        </h1>
        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
          <span className="h-1 w-1 rounded-full bg-blue-500 mr-1" />
          Neural Engine Connected
        </div>
      </div>

      <div className="relative ml-8 hidden max-w-sm flex-1 md:block">
         <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
         <input 
           placeholder="Search metrics or tasks..." 
           className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-4 text-xs text-slate-900 outline-none focus:border-blue-500 focus:bg-white dark:border-white/5 dark:bg-white/5 dark:text-white dark:focus:border-blue-500 transition-all shadow-sm"
         />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 dark:hover:text-white"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </button>

        <button
          onClick={onOpenSettings}
          className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 dark:hover:text-white"
          aria-label="Open settings"
        >
          <Cog className="h-4 w-4" />
        </button>
        
        <div className="h-6 w-[1px] bg-slate-200 dark:bg-white/10 mx-2" />
        
        <div className="flex items-center gap-2">
           <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 dark:bg-white/5 text-[10px] font-bold text-slate-600 dark:text-slate-400">
              TM
           </div>
        </div>
      </div>
    </header>
  );
}
