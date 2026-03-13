"use client";

import { X } from "lucide-react";
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
    <div className="fixed inset-0 z-50">
      <button
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-label="Close settings"
      />
      <div className="absolute right-0 top-0 h-full w-full max-w-md border-l border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow)]">
        <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-[var(--text)]">Settings</p>
            <p className="text-[11px] text-[var(--muted)]">
              Customize appearance and layout
            </p>
          </div>
          <button
            className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-2 text-[var(--text)] transition hover:brightness-95"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-6 p-4">
          <section className="space-y-2">
            <p className="text-xs font-semibold text-[var(--muted)]">Theme</p>
            <div className="flex gap-2">
              <button
                className={`flex-1 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                  theme === "light"
                    ? "border-[var(--accent)] bg-[var(--surface-2)] text-[var(--text)]"
                    : "border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--text)]"
                }`}
                onClick={() => setTheme("light")}
              >
                Light
              </button>
              <button
                className={`flex-1 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                  theme === "dark"
                    ? "border-[var(--accent)] bg-[var(--surface-2)] text-[var(--text)]"
                    : "border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--text)]"
                }`}
                onClick={() => setTheme("dark")}
              >
                Dark
              </button>
            </div>
          </section>

          <section className="space-y-2">
            <p className="text-xs font-semibold text-[var(--muted)]">Sidebar</p>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-[var(--text)]">
                  Collapsed
                </p>
                <button
                  className={`h-6 w-12 rounded-full border border-[var(--border)] p-0.5 transition ${
                    sidebarCollapsed ? "bg-[var(--accent)]" : "bg-[var(--surface)]"
                  }`}
                  onClick={onToggleSidebarDefault}
                  aria-label="Toggle sidebar collapsed"
                >
                  <span
                    className={`block h-5 w-5 rounded-full bg-white shadow transition-transform ${
                      sidebarCollapsed ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
              <p className="mt-2 text-[11px] text-[var(--muted)]">
                Collapse the sidebar to focus on your dashboard.
              </p>
            </div>
          </section>

          <section className="space-y-2">
            <p className="text-xs font-semibold text-[var(--muted)]">
              Coming soon
            </p>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3">
              <p className="text-xs font-semibold text-[var(--text)]">
                Notifications preferences
              </p>
              <p className="mt-1 text-[11px] text-[var(--muted)]">
                Quiet hours, grouping, and alert thresholds will appear here once
                backend is wired.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

