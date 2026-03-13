interface CrashAlertBannerProps {
  probability: number;
  timeMin: number;
  visible: boolean;
}

export default function CrashAlertBanner({
  probability,
  timeMin,
  visible,
}: CrashAlertBannerProps) {
  if (!visible || probability < 1) return null;

  const severity =
    probability >= 80
      ? "bg-red-100 border-red-400 text-red-800"
      : "bg-orange-100 border-orange-400 text-orange-800";

  return (
    <div
      className={`mb-4 flex items-start justify-between rounded-xl border px-4 py-3 text-sm ${severity}`}
    >
      <div>
        <p className="font-semibold">
          ⚠️ Crash Predicted – {probability}% probability
        </p>
        <p className="mt-1 text-xs">
          Based on recent CPU/RAM behaviour, your system may crash in{" "}
          <span className="font-semibold">{timeMin} minutes</span>. Save your
          work and close heavy apps.
        </p>
      </div>
      <button className="ml-4 rounded-md bg-red-600 px-3 py-1 text-xs font-medium text-white shadow hover:bg-red-700">
        Auto-fix (mock)
      </button>
    </div>
  );
}

