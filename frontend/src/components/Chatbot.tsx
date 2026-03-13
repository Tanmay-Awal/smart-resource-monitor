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
    <div className="flex h-[420px] flex-col overflow-hidden rounded-xl border bg-white shadow-sm">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2 text-sm font-semibold text-white">
        🤖 AI System Assistant (mock)
      </div>
      <div className="flex-1 space-y-2 overflow-y-auto bg-gray-50 p-3 text-sm">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${
              m.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs rounded-2xl px-3 py-2 ${
                m.role === "user"
                  ? "rounded-br-sm bg-blue-500 text-white"
                  : "rounded-bl-sm bg-white text-gray-800 shadow-sm"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="flex items-center gap-2 border-t bg-white p-3">
        <input
          className="flex-1 rounded-full border px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ask: Why is my laptop hot?"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
        />
        <button
          className="rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  );
}

