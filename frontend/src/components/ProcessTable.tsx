"use client";

type MockProcess = {
  pid: number;
  name: string;
  cpu: number;
  ramMb: number;
  status: "running" | "sleeping";
};

const MOCK_PROCESSES: MockProcess[] = [
  { pid: 1234, name: "chrome.exe", cpu: 18.3, ramMb: 850, status: "running" },
  { pid: 4321, name: "code.exe", cpu: 12.1, ramMb: 720, status: "running" },
  { pid: 8765, name: "discord.exe", cpu: 6.2, ramMb: 410, status: "sleeping" },
  { pid: 5678, name: "spotify.exe", cpu: 3.9, ramMb: 260, status: "sleeping" },
];

export default function ProcessTable() {
  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-hover)]">
      <div className="border-b border-[var(--border)] px-4 py-3 text-sm font-semibold text-[var(--text)]">
        Top Processes (mock)
      </div>
      <div className="max-h-80 overflow-y-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-[var(--surface-2)] text-xs uppercase text-[var(--muted)]">
            <tr>
              <th className="px-3 py-2">PID</th>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">CPU %</th>
              <th className="px-3 py-2">RAM (MB)</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_PROCESSES.map((p) => (
              <tr
                key={p.pid}
                className="border-t border-[var(--border)] text-xs transition-colors hover:bg-[var(--surface-2)]"
              >
                <td className="px-3 py-2 text-[var(--muted)]">{p.pid}</td>
                <td className="px-3 py-2 font-semibold text-[var(--text)]">
                  {p.name}
                </td>
                <td className="px-3 py-2 font-extrabold text-amber-500">
                  {p.cpu.toFixed(1)}
                </td>
                <td className="px-3 py-2 text-[var(--text)]">{p.ramMb}</td>
                <td className="px-3 py-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] ${
                      p.status === "running"
                        ? "bg-emerald-500/15 text-emerald-400"
                        : "bg-white/5 text-[var(--muted)]"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="px-3 py-2 text-right">
                  <button className="rounded-xl bg-rose-500/15 px-2 py-1 text-[10px] font-extrabold text-rose-400 transition hover:-translate-y-[1px] hover:bg-rose-500/20 active:translate-y-0">
                    Kill (mock)
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

