"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Cpu, ShieldCheck, Zap, ArrowRight, Lock, Mail } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    if (!email || !password) {
      setError("Please enter your credentials.");
      setLoading(false);
      return;
    }
    setError("");
    setTimeout(() => {
       router.push("/dashboard");
    }, 600);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-[#020617] font-sans">
      <div className="w-full max-w-sm px-6 animate-in fade-in zoom-in-95 duration-500">
        
        <div className="flex flex-col items-center mb-10">
           <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 shadow-lg mb-4">
              <Cpu className="h-6 w-6 text-white" />
           </div>
           <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
             SRM Intelligence
           </h1>
           <p className="text-xs text-slate-500 mt-1">Resource monitoring and automation</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm dark:border-white/5 dark:bg-[#0b1222]">
          {error && (
            <div className="mb-6 flex items-center gap-2 rounded-lg border border-rose-100 bg-rose-50 p-3 text-xs font-bold text-rose-600 dark:bg-rose-500/10 dark:border-rose-500/20 dark:text-rose-500">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-1.5">
               <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Account ID</label>
               <div className="relative group">
                <Mail className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                <input
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-4 text-xs font-medium text-slate-900 outline-none focus:border-blue-500 focus:bg-white dark:border-white/5 dark:bg-white/5 dark:text-white transition-all shadow-sm"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
               <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Access Key</label>
               <div className="relative group">
                <Lock className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-4 text-xs font-medium text-slate-900 outline-none focus:border-blue-500 focus:bg-white dark:border-white/5 dark:bg-white/5 dark:text-white transition-all shadow-sm"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between px-1 py-1">
               <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Remember device</span>
               </label>
               <a href="#" className="text-[10px] font-bold text-blue-600 uppercase tracking-widest hover:underline">Reset?</a>
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className="group relative flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 dark:bg-blue-600 py-3 text-xs font-bold text-white shadow-lg transition-all hover:bg-slate-800 dark:hover:bg-blue-500 active:scale-[0.98] disabled:opacity-50 mt-2"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Authenticate
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-6 opacity-30 grayscale">
           <ShieldCheck className="h-5 w-5" />
           <Zap className="h-5 w-5" />
           <Cpu className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function Loader2({ className }: { className: string }) {
  return (
    <div className={`h-4 w-4 rounded-full border-2 border-white/20 border-t-white animate-spin ${className}`} />
  );
}
