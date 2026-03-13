import Chatbot from "@/components/Chatbot";
import StoryCard from "@/components/StoryCard";

const ACHIEVEMENTS = [
  { emoji: "🏆", label: "System Stable", desc: "No crashes this week" },
  { emoji: "❄️", label: "Cool Runner", desc: "Temp below 70°C all day" },
  { emoji: "⚡", label: "Optimizer", desc: "Used auto-pilot 5 times" },
];

export default function StoriesPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">
            AI Stories & Assistant
          </h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Understand your system in plain language—daily summaries and a chat
            assistant.
          </p>
        </div>
        <span className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs font-semibold text-[var(--muted)]">
          AI: mock
        </span>
      </div>
      <div className="flex gap-3 overflow-x-auto">
        {ACHIEVEMENTS.map((b) => (
          <div
            key={b.label}
            className="min-w-[160px] rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-xs shadow-[var(--shadow)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-hover)]"
          >
            <p className="text-lg">{b.emoji}</p>
            <p className="mt-1 font-semibold text-[var(--text)]">{b.label}</p>
            <p className="mt-1 text-[11px] text-[var(--muted)]">{b.desc}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <StoryCard />
        <Chatbot />
      </div>
    </div>
  );
}

