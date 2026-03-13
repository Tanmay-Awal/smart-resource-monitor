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
      <h1 className="text-2xl font-bold">AI Stories & Assistant</h1>
      <div className="flex gap-3 overflow-x-auto">
        {ACHIEVEMENTS.map((b) => (
          <div
            key={b.label}
            className="min-w-[160px] rounded-xl border bg-white px-4 py-3 text-xs shadow-sm"
          >
            <p className="text-lg">{b.emoji}</p>
            <p className="mt-1 font-semibold text-gray-800">{b.label}</p>
            <p className="mt-1 text-[11px] text-gray-500">{b.desc}</p>
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

