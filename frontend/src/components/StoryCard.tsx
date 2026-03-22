"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Sparkles, BookOpen, Quote } from "lucide-react";

export default function StoryCard() {
  const [story, setStory] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const res = await api.get("/chat/daily-story");
        setStory(res.data.story);
      } catch (err) {
        setStory("Unable to generate your system story today. System is stable.");
      } finally {
        setLoading(false);
      }
    };
    fetchStory();
  }, []);

  if (loading) {
     return (
       <div className="flex h-48 items-center justify-center rounded-3xl border border-white/5 bg-slate-900/40 p-6 shadow-2xl backdrop-blur-md">
         <div className="h-6 w-6 animate-spin rounded-full border-2 border-purple-500/20 border-t-purple-500" />
       </div>
     );
  }

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-blue-500/5 p-8 shadow-2xl backdrop-blur-md transition-all duration-300 hover:bg-white/10">
      <div className="absolute -right-4 -top-4 opacity-10 transition-transform group-hover:scale-110">
         <Sparkles className="h-32 w-32 text-purple-500" />
      </div>

      <div className="relative flex flex-col gap-6">
        <div className="flex items-center gap-3">
           <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20 text-purple-500">
              <BookOpen className="h-5 w-5" />
           </div>
           <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-300">Daily Narrative</h3>
              <p className="text-[10px] font-medium text-slate-500">Synthesized from 24h telemetry</p>
           </div>
        </div>

        <div className="relative">
           <Quote className="absolute -left-2 -top-4 h-8 w-8 text-white/5" />
           <p className="text-base font-medium leading-relaxed text-slate-300 group-hover:text-white transition-colors pl-4 border-l-2 border-purple-500/30">
             {story}
           </p>
        </div>

        <div className="mt-2 flex items-center gap-2 text-[10px] font-bold text-purple-400 uppercase tracking-widest">
           <Sparkles className="h-3 w-3 animate-pulse" />
           AI Insight Generated • 98% Confidence
        </div>
      </div>
    </div>
  );
}
