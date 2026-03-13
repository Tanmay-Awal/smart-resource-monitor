"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Gauge, HardDrive, Bot, SlidersHorizontal } from "lucide-react";

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
      className={`fixed left-0 top-0 z-20 flex h-screen flex-col border-r border-[var(--border)] bg-[var(--sidebar-bg)] p-3 text-[var(--sidebar-fg)] transition-all duration-200 ${
        collapsed ? "w-16" : "w-56"
      }`}
    >
      <div className="mb-4 flex items-center justify-center">
        <div
          className={`rounded-xl bg-white/5 px-2 py-2 text-center text-xs font-semibold tracking-wide text-[var(--sidebar-fg)] ${
            collapsed ? "w-10" : "w-full"
          }`}
          title="Smart Resource Monitor"
        >
          {collapsed ? "SRM" : "Smart Resource Monitor"}
        </div>
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition-all duration-150 ${
                active
                  ? "bg-white/10 text-[var(--sidebar-fg)] shadow-sm"
                  : "text-[var(--sidebar-muted)] hover:bg-white/10 hover:text-[var(--sidebar-fg)]"
              } ${collapsed ? "justify-center" : ""} hover:-translate-y-[1px]`}
            >
              <Icon className="h-4 w-4" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

