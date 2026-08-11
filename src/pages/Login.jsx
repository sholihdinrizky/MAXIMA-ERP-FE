import React, { useState } from "react";
import { LogIn, ShieldCheck, Lock, Mail } from "lucide-react";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("sholihdinrizky@its.ac.id");
  const [password, setPassword] = useState("••••••••");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Deterministic Auth Trigger
    onLogin();
  };

  return (
    <div className="min-h-screen w-full bg-[#1E222B] flex items-center justify-center p-4 font-sans select-none">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 space-y-6 border border-slate-100 animate-in zoom-in-95 duration-200">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#08D9D6] to-[#06b6b3] text-[#252A34] font-black text-2xl flex items-center justify-center mx-auto shadow-lg shadow-[#08D9D6]/20">
            ◇
          </div>
          <h1 className="text-2xl font-bold text-[#252A34] tracking-tight">
            MAXIMA <span className="text-[#06b6b3]">ERP</span>
          </h1>
          <p className="text-xs text-slate-400">
            Enterprise Resource Planning & Executive Control
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#08D9D6] focus:ring-1 focus:ring-[#08D9D6] transition-all"
                placeholder="name@company.com"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#08D9D6] focus:ring-1 focus:ring-[#08D9D6] transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#08D9D6] hover:bg-[#06b6b3] text-[#252A34] font-bold text-xs rounded-xl shadow-md shadow-[#08D9D6]/20 transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-2 mt-2"
          >
            <LogIn size={16} />
            Sign In to Dashboard
          </button>
        </form>

        {/* Footer Info */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-400">
          <ShieldCheck size={14} className="text-[#06b6b3]" />
          <span>Protected Root Administrator Access</span>
        </div>
      </div>
    </div>
  );
}
