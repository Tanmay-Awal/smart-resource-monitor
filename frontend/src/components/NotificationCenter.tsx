"use client";

type Notification = {
  id: number;
  message: string;
  type: "warning" | "critical" | "info";
  time: string;
};

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    message: "CPU spike detected while Chrome and VS Code are open.",
    type: "warning",
    time: "10:23 AM",
  },
  {
    id: 2,
    message: "High RAM usage from chrome.exe (1.2 GB).",
    type: "critical",
    time: "10:18 AM",
  },
];

export default function NotificationCenter() {
  const items = INITIAL_NOTIFICATIONS;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Notifications (mock)</h2>
        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
          Quiet mode & real-time wiring will be added later
        </span>
      </div>
      {items.length === 0 && (
        <p className="text-sm text-gray-400">No alerts. System is calm.</p>
      )}
      {items.map((n) => (
        <div
          key={n.id}
          className={`flex items-start justify-between rounded-xl border px-3 py-2 text-sm ${
            n.type === "critical"
              ? "border-red-300 bg-red-50"
              : n.type === "warning"
              ? "border-yellow-300 bg-yellow-50"
              : "border-blue-200 bg-blue-50"
          }`}
        >
          <div>
            <p className="font-medium">
              {n.type === "critical"
                ? "🚨 Critical"
                : n.type === "warning"
                ? "⚠️ Warning"
                : "ℹ️ Info"}
            </p>
            <p className="mt-1 text-xs text-gray-800">{n.message}</p>
            <p className="mt-1 text-[10px] text-gray-500">{n.time}</p>
          </div>
          <button className="ml-3 text-xs text-gray-400 hover:text-gray-700">
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}

