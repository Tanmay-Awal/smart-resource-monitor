"use client";

import ProcessTable from "@/components/ProcessTable";
import { useState } from "react";

export default function AutoPilotPage() {
  const [enabled, setEnabled] = useState(true);
  return (
    <div className="space-y-6 p-6">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow)]">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text)]">
              Auto-Pilot Mode
            </h1>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Mock view of auto-pilot toggle, history and processes. Will be
              wired to backend later.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              className={`h-9 w-16 rounded-full border border-[var(--border)] p-1 transition ${
                enabled ? "bg-[var(--accent)]" : "bg-[var(--surface-2)]"
              }`}
              onClick={() => setEnabled((p) => !p)}
              aria-label="Toggle auto-pilot (mock)"
              title="Toggle auto-pilot (mock)"
            >
              <span
                className={`block h-7 w-7 rounded-full bg-white shadow transition-transform ${
                  enabled ? "translate-x-7" : "translate-x-0"
                }`}
              />
            </button>
            <div className="text-xs">
              <p className="font-semibold text-[var(--text)]">
                Status:{" "}
                <span
                  className={enabled ? "text-emerald-500" : "text-[var(--muted)]"}
                >
                  {enabled ? "ACTIVE" : "OFF"}
                </span>
              </p>
              <p className="text-[11px] text-[var(--muted)]">
                Automatically terminates processes causing performance issues.
              </p>
            </div>
          </div>
        </div>
      </div>
      <ProcessTable />
    </div>
  );
}

