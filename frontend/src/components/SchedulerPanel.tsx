const MOCK_TASKS = [
  {
    id: "cleanup",
    label: "🧹 Cache Cleanup",
    description: "Clears temp files and cached data.",
    lastRun: "Yesterday, 9:15 PM",
  },
  {
    id: "memory",
    label: "💾 Memory Optimization",
    description: "Reclaims unused memory from background apps.",
    lastRun: "Today, 8:05 AM",
  },
];

export default function SchedulerPanel() {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <p className="text-sm font-semibold">🗓️ Scheduled Optimization (mock)</p>
      <p className="mt-1 text-xs text-gray-500">
        These tasks will later call real backend endpoints.
      </p>
      <div className="mt-4 space-y-3">
        {MOCK_TASKS.map((task) => (
          <div
            key={task.id}
            className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-xs"
          >
            <div>
              <p className="font-medium text-gray-800">{task.label}</p>
              <p className="text-[11px] text-gray-500">{task.description}</p>
              <p className="mt-1 text-[10px] text-gray-400">
                Last run: {task.lastRun}
              </p>
            </div>
            <button className="rounded bg-blue-600 px-3 py-1 text-[11px] font-semibold text-white hover:bg-blue-700">
              Run now (mock)
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

