const MOCK_STORY =
  "Today your laptop handled a steady workload with a few CPU spikes during browsing and coding sessions. " +
  "Memory usage stayed healthy, and no critical crashes were predicted. Great day for your system overall!";

export default function StoryCard() {
  return (
    <div className="rounded-xl border bg-gradient-to-br from-purple-50 to-white p-4 shadow-sm">
      <p className="text-sm font-semibold text-purple-700">
        📖 Today&apos;s System Story (mock)
      </p>
      <p className="mt-3 text-sm leading-relaxed text-gray-700">{MOCK_STORY}</p>
    </div>
  );
}

