"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Cog, Moon, Sun, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/autopilot", label: "Auto-Pilot" },
  { href: "/disk", label: "Disk & Tasks" },
  { href: "/stories", label: "AI Stories" },
  { href: "/notifications", label: "Notifications" },
];

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

  return (
    <header className="sticky top-0 z-10 w-full border-b border-[var(--border)] bg-[var(--topbar-bg)] backdrop-blur">
      <div className="flex items-center gap-3 px-4 py-3">
        <button
          onClick={onToggleSidebar}
          className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-2 text-[var(--text)] shadow-sm transition hover:shadow"
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {sidebarCollapsed ? (
            <PanelLeftOpen className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </button>

        <div className="hidden sm:block">
          <p className="text-sm font-semibold text-[var(--text)]">
            Smart Resource Monitor
          </p>
          <p className="text-[11px] text-[var(--muted)]">
            Live insights • proactive optimization
          </p>
        </div>

        <nav className="mx-auto hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  active
                    ? "bg-[var(--surface)] text-[var(--text)] shadow-sm"
                    : "text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--text)]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-2 text-[var(--text)] shadow-sm transition hover:shadow"
            aria-label="Toggle theme"
            title="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>

          <button
            onClick={onOpenSettings}
            className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-2 text-[var(--text)] shadow-sm transition hover:shadow"
            aria-label="Open settings"
            title="Settings"
          >
            <Cog className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}

