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

  useEffect(() => {
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

  return (
    <ThemeProvider>
      <Sidebar collapsed={sidebarCollapsed} />
      <div className={sidebarCollapsed ? "pl-16" : "pl-56"}>
        <TopBar
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={toggleSidebar}
          onOpenSettings={() => setSettingsOpen(true)}
        />
        <main className="min-h-[calc(100vh-56px)]">{children}</main>
      </div>
      <SettingsPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebarDefault={toggleSidebar}
      />
    </ThemeProvider>
  );
}

