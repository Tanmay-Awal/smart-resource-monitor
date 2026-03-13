"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/autopilot", label: "Auto-Pilot", icon: "⚙️" },
  { href: "/disk", label: "Disk & Tasks", icon: "💾" },
  { href: "/stories", label: "AI Stories", icon: "📖" },
  { href: "/notifications", label: "Notifications", icon: "🔔" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-20 flex h-screen w-56 flex-col bg-gray-900 p-4 text-white">
      <p className="mb-6 text-sm font-bold text-blue-400">
        🖥️ Smart Resource Monitor
      </p>
      <nav className="space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                active
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

