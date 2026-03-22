"use client";

import { useEffect, useState } from "react";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { SettingsPanel } from "@/components/SettingsPanel";

const SIDEBAR_STORAGE_KEY = "srm-sidebar-collapsed";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(SIDEBAR_STORAGE_KEY);
      if (stored === "true" || stored === "false") {
        setSidebarCollapsed(stored === "true");
      }
    } catch {
      // ignore
    }
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(SIDEBAR_STORAGE_KEY, String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  if (!mounted) return null;

  return (
    <ThemeProvider>
      <div className="flex min-h-screen bg-neutral-50 dark:bg-[#020617] transition-colors duration-300">
        <Sidebar collapsed={sidebarCollapsed} />
        
        <div 
          className={`flex flex-1 flex-col transition-all duration-300 ease-in-out ${
            sidebarCollapsed ? "pl-16" : "pl-64"
          }`}
        >
          <TopBar
            sidebarCollapsed={sidebarCollapsed}
            onToggleSidebar={toggleSidebar}
            onOpenSettings={() => setSettingsOpen(true)}
          />
          
          <main className="flex-1 p-6 md:p-8">
            <div className="page-transition mx-auto max-w-[1400px]">
              {children}
            </div>
          </main>
        </div>

        <SettingsPanel
          open={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebarDefault={toggleSidebar}
        />
      </div>
    </ThemeProvider>
  );
}
