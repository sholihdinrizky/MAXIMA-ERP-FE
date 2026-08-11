import React from "react";
import {
    LayoutGrid,
    Users,
    Package,
    ShoppingBag,
    FileText,
    LogOut,
} from "lucide-react";

export default function Sidebar({
    activeMenu = "dashboard",
    setActiveMenu,
    onLogout,
}) {
    const menuItems = [
        { id: "dashboard", label: "Dashboard", icon: LayoutGrid },
        { id: "customer", label: "Customer", icon: Users },
        { id: "product", label: "Product", icon: Package },
        { id: "sales-order", label: "Sales Order", icon: ShoppingBag },
        { id: "reports", label: "Reports", icon: FileText },
    ];

    return (
        <aside className="w-64 h-screen sticky top-0 flex flex-col justify-between bg-[#1a1b26] p-6 shrink-0 overflow-hidden">
            {/* BAGIAN ATAS: Logo + Menu */}
            <div className="flex flex-col gap-8">
                {/* Header Logo */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                        <div className="w-4 h-4 border-2 border-teal-400 rotate-45" />
                    </div>
                    <div>
                        <h1 className="font-bold text-white text-base tracking-wide leading-none">
                            MAXIMA
                        </h1>
                        <span className="text-[10px] font-semibold text-teal-400 tracking-wider">
                            ERP
                        </span>
                    </div>
                </div>

                {/* Menu Navigasi */}
                <nav className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase mb-2">
                        Main Menu
                    </span>

                    {/* Item Menu */}
                    {[
                        {
                            id: "dashboard",
                            label: "Dashboard",
                            icon: "LayoutDashboard",
                        },
                        { id: "customer", label: "Customer", icon: "Users" },
                        { id: "product", label: "Product", icon: "Package" },
                        {
                            id: "sales",
                            label: "Sales Order",
                            icon: "ShoppingBag",
                        },
                        { id: "reports", label: "Reports", icon: "FileText" },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveMenu(item.id)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                                activeMenu === item.id
                                    ? "bg-slate-800 text-teal-400 shadow-sm"
                                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                            }`}
                        >
                            {item.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* BAGIAN BAWAH: Profil User (Nempel di Dasar) */}
            <div className="pt-4 border-t border-slate-800/60">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/40 border border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 font-bold flex items-center justify-center text-xs">
                            R
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-white leading-tight">
                                Rizky
                            </span>
                            <span className="text-[10px] text-slate-400">
                                ITS - Online
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={onLogout}
                        className="text-slate-400 hover:text-rose-400 transition-colors p-1"
                        title="Logout"
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </aside>
    );
}
