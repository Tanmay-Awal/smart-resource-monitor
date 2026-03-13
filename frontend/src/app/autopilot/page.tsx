import ProcessTable from "@/components/ProcessTable";

export default function AutoPilotPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Auto-Pilot Mode</h1>
          <p className="text-sm text-gray-500">
            Mock view of auto-pilot toggle, history and processes. Will be wired
            to backend later.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-500">
          <span className="h-2 w-2 rounded-full bg-green-500" />
          Auto-pilot:{" "}
          <span className="font-semibold text-green-600">ON (mock)</span>
        </div>
      </div>
      <ProcessTable />
    </div>
  );
}

