"use client";

import { useEffect, useRef, useState } from "react";

type Message = {
  id: number;
  role: "user" | "ai";
  text: string;
};

const INITIAL_MESSAGES: Message[] = [
  {
    id: 1,
    role: "ai",
    text: "Hi! I'm your system assistant (mock). Ask things like “Why is my CPU high?” or “Is my disk healthy?”",
  },
];

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    const nextId = messages.length ? messages[messages.length - 1].id + 1 : 1;
    const userMsg: Message = { id: nextId, role: "user", text: trimmed };
    const aiMsg: Message = {
      id: nextId + 1,
      role: "ai",
      text: "This is a mock reply. Later this will come from the real AI backend with live system context.",
    };
    setMessages((prev) => [...prev, userMsg, aiMsg]);
    setInput("");
  };

  return (
    <div className="flex h-[420px] flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-hover)]">
      <div className="bg-[linear-gradient(90deg,var(--accent),var(--accent-2))] px-4 py-2 text-sm font-semibold text-white">
        🤖 AI System Assistant (mock)
      </div>
      <div className="flex-1 space-y-2 overflow-y-auto bg-[var(--surface-2)] p-3 text-sm">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${
              m.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs rounded-2xl px-3 py-2 transition-all duration-150 ${
                m.role === "user"
                  ? "rounded-br-sm bg-[var(--accent)] text-white shadow-sm"
                  : "rounded-bl-sm bg-[var(--surface)] text-[var(--text)] shadow-sm"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="flex items-center gap-2 border-t border-[var(--border)] bg-[var(--surface)] p-3">
        <input
          className="flex-1 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs text-[var(--text)] outline-none focus:ring-2 focus:ring-[var(--accent)]"
          placeholder="Ask: Why is my laptop hot?"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
        />
        <button
          className="rounded-full bg-[var(--accent)] px-4 py-2 text-xs font-extrabold text-white shadow-sm transition-all duration-200 hover:-translate-y-[1px] hover:brightness-110 active:translate-y-0"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  );
}

