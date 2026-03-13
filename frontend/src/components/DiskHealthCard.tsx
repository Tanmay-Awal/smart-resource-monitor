const MOCK_DISK = {
  model: "Samsung SSD 970 EVO 500GB",
  health: "PASS",
  temperature: 46,
};

export default function DiskHealthCard() {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <p className="text-sm font-semibold">💾 Disk Health (mock)</p>
      <p className="mt-1 text-xs text-gray-500">{MOCK_DISK.model}</p>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-gray-500">Overall</span>
        <span className="rounded-full bg-green-100 px-3 py-0.5 text-xs font-semibold text-green-700">
          {MOCK_DISK.health}
        </span>
      </div>
      <div className="mt-4">
        <div className="mb-1 flex justify-between text-xs text-gray-500">
          <span>Temperature</span>
          <span>{MOCK_DISK.temperature}°C</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-2 rounded-full bg-green-500"
            style={{ width: `${Math.min((MOCK_DISK.temperature / 60) * 100, 100)}%` }}
          />
        </div>
      </div>
      <p className="mt-3 text-xs text-gray-500">
        No issues detected. Keep an eye on temperatures during heavy gaming or
        long compile sessions.
      </p>
    </div>
  );
}

