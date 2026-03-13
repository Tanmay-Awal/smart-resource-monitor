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
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <div className="border-b px-4 py-2 text-sm font-semibold text-gray-700">
        Top Processes (mock)
      </div>
      <div className="max-h-80 overflow-y-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
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
              <tr key={p.pid} className="border-t text-xs">
                <td className="px-3 py-2 text-gray-500">{p.pid}</td>
                <td className="px-3 py-2 font-medium text-gray-800">
                  {p.name}
                </td>
                <td className="px-3 py-2 font-semibold text-orange-600">
                  {p.cpu.toFixed(1)}
                </td>
                <td className="px-3 py-2">{p.ramMb}</td>
                <td className="px-3 py-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] ${
                      p.status === "running"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="px-3 py-2 text-right">
                  <button className="rounded bg-red-100 px-2 py-1 text-[10px] font-semibold text-red-700 hover:bg-red-200">
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

