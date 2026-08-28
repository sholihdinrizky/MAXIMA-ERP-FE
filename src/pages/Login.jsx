import React, { useState } from "react";
import { Lock, Mail, ArrowRight, Eye, EyeOff, ShieldCheck } from "lucide-react";
import api from "../services/api";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("admin@maxima.id");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });
      if (res.data?.data?.token) {
        localStorage.setItem("token", res.data.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.data.user || {}));
        onLogin();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Email atau password salah");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1F232B] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl space-y-6">
        <div className="text-center space-y-1">
          <div className="w-12 h-12 bg-[#08D9D6]/15 rounded-2xl flex items-center justify-center mx-auto mb-3 text-[#06b6b3]">
            <div className="w-6 h-6 border-2 border-[#06b6b3] rotate-45 rounded-sm" />
          </div>
          <h1 className="text-2xl font-bold text-[#252A34] tracking-tight">
            MAXIMA <span className="text-[#06b6b3]">ERP</span>
          </h1>
          <p className="text-xs text-slate-400">
            Enterprise Resource Planning & Executive Control
          </p>
        </div>

        {error && (
          <div className="bg-rose-50 text-[#FF2E63] text-xs p-3 rounded-xl border border-rose-100 font-medium text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1 text-left">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
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
                placeholder="nama@perusahaan.com"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#08D9D6] focus:bg-white transition"
              />
            </div>
          </div>

          <div className="space-y-1 text-left">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                className="w-full pl-10 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#08D9D6] focus:bg-white transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#08D9D6] hover:bg-[#06b6b3] text-[#252A34] font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
          >
            {loading ? "Memverifikasi..." : "Sign In to Dashboard"}
            <ArrowRight size={15} />
          </button>
        </form>

        <div className="pt-2 border-t border-slate-100 text-center space-y-1.5">
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 font-medium">
            <ShieldCheck size={14} className="text-[#06b6b3]" />
            <span>Protected Root Administrator Access</span>
          </div>
          <p className="text-[10px] text-slate-400">
            Registrasi akun baru hanya melalui konsultasi / persetujuan System Administrator.
          </p>
        </div>
      </div>
    </div>
  );
}