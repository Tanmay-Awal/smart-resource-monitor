"use client";

import { useState, useEffect, useRef } from "react";
import api from "@/lib/api";
import { Send, Bot, User, Loader2, Command } from "lucide-react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    const fetchHistory = async () => {
      try {
        const res = await api.get("/chat/history");
        const history = res.data.length > 0
          ? res.data.map((m: any) => ({
            role: m.sender === "user" ? "user" : "assistant",
            content: m.message
          }))
          : [
            { role: "assistant", content: "AI synchronized. Analyzing system logs for insights..." },
          ];
        if (cancelled) return;
        setMessages((prev) => {
          const hasActiveConversation = prev.some((msg) => msg.role === "user") || prev.length > 1;
          return hasActiveConversation ? prev : history;
        });
      } catch (err) {
        if (cancelled) return;
        setMessages((prev) => {
          const hasActiveConversation = prev.some((msg) => msg.role === "user") || prev.length > 1;
          if (hasActiveConversation) return prev;
          return [{ role: "assistant", content: "Connection to core offline. Local diagnostics only." }];
        });
      }
    };
    fetchHistory();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await api.post("/chat/ask", { message: input });
      const assistantMessage: Message = {
        role: "assistant",
        content: res.data.response,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error communicating with intelligence core." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col bg-white dark:bg-[#0b1222]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 px-6 py-3 bg-slate-50/50 dark:bg-white/5">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
             <Bot className="h-4 w-4" />
          </div>
          <div>
             <h3 className="text-xs font-bold text-slate-900 dark:text-white">SRM Intelligence</h3>
             <div className="flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Core Stable</span>
             </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef} 
        className="flex-1 space-y-4 overflow-y-auto p-6 custom-scrollbar"
      >
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
             <div className={`flex gap-3 max-w-[90%] ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg border ${
                  m.role === "user" ? "bg-slate-100 text-slate-600 border-slate-200" : "bg-blue-600/10 text-blue-600 border-blue-600/20"
                }`}>
                   {m.role === "user" ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
                </div>
                <div className={`rounded-lg px-3.5 py-2 text-xs shadow-sm ${
                  m.role === "user" 
                    ? "bg-slate-900 dark:bg-slate-800 text-white font-medium" 
                    : "bg-white dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-white/5 leading-relaxed"
                }`}>
                  {m.content}
                </div>
             </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-3 max-w-[90%]">
               <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600/10 text-blue-600 border border-blue-600/20">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
               </div>
               <div className="rounded-lg bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 px-4 py-2">
                  <div className="flex gap-1.5">
                     <span className="h-1 w-1 rounded-full bg-slate-300 animate-bounce" />
                     <span className="h-1 w-1 rounded-full bg-slate-300 animate-bounce [animation-delay:0.2s]" />
                     <span className="h-1 w-1 rounded-full bg-slate-300 animate-bounce [animation-delay:0.4s]" />
                  </div>
               </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5">
        <div className="flex items-center gap-2 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0b1222] px-2 py-1.5 focus-within:border-blue-500 transition-all">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask AI..."
            className="flex-1 bg-transparent px-3 text-xs text-slate-900 dark:text-white outline-none"
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 text-white shadow-sm hover:bg-blue-500 active:scale-95 disabled:opacity-50 transition-all"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="mt-2 flex items-center justify-between px-1 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
           <span className="flex items-center gap-1"><Command className="h-2.5 w-2.5" /> ENTER</span>
           <span>v1.0 AI</span>
        </div>
      </div>
    </div>
  );
}
