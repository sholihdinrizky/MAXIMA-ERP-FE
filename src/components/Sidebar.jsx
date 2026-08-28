import React, { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  FileBarChart,
  LogOut,
  X,
  User,
  Mail,
  ShieldCheck,
} from "lucide-react";

export default function Sidebar({ activeMenu, setActiveMenu, onLogout }) {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "customer", label: "Customer", icon: Users },
    { id: "product", label: "Product", icon: Package },
    { id: "sales", label: "Sales Order", icon: ShoppingCart },
    { id: "reports", label: "Reports", icon: FileBarChart },
  ];

  const handleLogout = (e) => {
    e.stopPropagation();
    if (window.confirm("Apakah Anda yakin ingin keluar dari MAXIMA ERP?")) {
      if (onLogout) onLogout();
    }
  };

  return (
    <>
      <aside className="w-64 bg-[#1E222B] text-slate-300 flex flex-col justify-between h-screen p-4 border-r border-slate-800/50 select-none shrink-0">
        {/* Brand Logo Header */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-2 pt-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#08D9D6] to-[#06b6b3] flex items-center justify-center text-[#252A34] font-black text-lg shadow-md shadow-[#08D9D6]/10">
              ◇
            </div>
            <div>
              <h1 className="text-base font-bold text-white tracking-wider leading-none">
                MAXIMA
              </h1>
              <span className="text-[10px] font-bold text-[#08D9D6] tracking-widest uppercase">
                ERP
              </span>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="space-y-1">
            <span className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              MAIN MENU
            </span>
            <nav className="mt-2 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeMenu === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveMenu(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer outline-none focus:outline-none focus:ring-0 ${
                      isActive
                        ? "bg-slate-800/80 text-white border border-slate-700/60 shadow-sm"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent"
                    }`}
                  >
                    <Icon
                      size={16}
                      className={isActive ? "text-[#08D9D6]" : "text-slate-400"}
                    />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Profile Card Bottom Section */}
        <div
          onClick={() => setIsProfileModalOpen(true)}
          className="bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 rounded-2xl p-3 flex items-center justify-between transition-all duration-150 cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#08D9D6]/10 border border-[#08D9D6]/20 flex items-center justify-center text-[#08D9D6] font-bold text-xs">
              R
            </div>
            <div className="text-left">
              <h4 className="text-xs font-bold text-white group-hover:text-[#08D9D6] transition-colors">
                Rizky
              </h4>
              <p className="text-[10px] text-slate-400 font-medium">
                ITS - Online
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            title="Logout"
            className="p-1.5 text-slate-400 hover:text-[#FF2E63] hover:bg-[#FF2E63]/10 rounded-lg transition-all cursor-pointer outline-none focus:outline-none focus:ring-0"
          >
            <LogOut size={15} />
          </button>
        </div>
      </aside>

      {/* Profile Detail Modal */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
            onClick={() => setIsProfileModalOpen(false)}
          />

          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-5 z-10 border border-slate-100 animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#252A34] text-[#08D9D6] font-bold text-lg flex items-center justify-center shadow-md">
                  R
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#252A34]">
                    Muhammad Sholihuddin Rizky
                  </h3>
                  <span className="inline-block px-2 py-0.5 rounded-md bg-[#08D9D6]/10 text-[#06b6b3] text-[10px] font-bold">
                    System Administrator
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsProfileModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer outline-none"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <div className="flex items-center gap-2.5">
                <User size={14} className="text-[#06b6b3]" />
                <span>Batch 2024 — Informatics ITS</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail size={14} className="text-[#06b6b3]" />
                <span>sholihdinrizky@its.ac.id</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck size={14} className="text-[#06b6b3]" />
                <span>Full Access (Root Admin)</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsProfileModalOpen(false);
                handleLogout({ stopPropagation: () => {} });
              }}
              className="w-full py-2.5 bg-[#FF2E63] hover:bg-[#e02653] text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-2 outline-none"
            >
              <LogOut size={14} />
              Log Out Account
            </button>
          </div>
        </div>
      )}
    </>
  );
}