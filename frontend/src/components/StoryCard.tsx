const MOCK_STORY =
  "Today your laptop handled a steady workload with a few CPU spikes during browsing and coding sessions. " +
  "Memory usage stayed healthy, and no critical crashes were predicted. Great day for your system overall!";

export default function StoryCard() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[linear-gradient(135deg,rgba(124,58,237,0.16),rgba(37,99,235,0.08))] p-4 shadow-[var(--shadow)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-hover)]">
      <p className="text-sm font-semibold text-[var(--text)]">
        📖 Today&apos;s System Story (mock)
      </p>
      <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
        {MOCK_STORY}
      </p>
    </div>
  );
}

