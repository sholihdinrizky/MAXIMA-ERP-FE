import React from "react";
import Card from "./ui/Card";

export default function StatCard({
    title,
    value,
    subtitle,
    icon: Icon,
    trend,
    badgeText,
    badgeType = "neutral",
}) {
    // 1. Tabel pemetaan warna background ikon
    const iconBgStyles = {
        teal: "bg-teal-50 text-erp-teal",
        amber: "bg-amber-50 text-amber-600",
        rose: "bg-rose-50 text-rose-600",
        neutral: "bg-slate-100 text-slate-600",
    };

    // 2. Tabel pemetaan warna badge status
    const badgeStyles = {
        teal: "bg-teal-50 text-erp-teal border-teal-200",
        rose: "bg-rose-50 text-rose-600 border-rose-200",
        neutral: "bg-slate-100 text-slate-600 border-slate-200",
    };

    return (
        <Card className="relative overflow-hidden">
            {/* --- AREA ATAS: Ikon & Indikator Status --- */}
            <div className="flex items-center justify-between mb-4">
                {/* Render Ikon jika ada */}
                {Icon && (
                    <div
                        className={`p-2.5 rounded-xl ${iconBgStyles[badgeType] || iconBgStyles.neutral}`}
                    >
                        <Icon size={20} />
                    </div>
                )}

                {/* Render Persentase Trend jika ada (misal: +12.4%) */}
                {trend && (
                    <span className="text-caption font-bold text-erp-teal bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full">
                        {trend}
                    </span>
                )}

                {/* Render Badge Status jika ada (misal: Pending Action) */}
                {badgeText && (
                    <span
                        className={`text-caption font-semibold px-2.5 py-0.5 rounded-full border ${badgeStyles[badgeType] || badgeStyles.neutral}`}
                    >
                        {badgeText}
                    </span>
                )}
            </div>

            {/* --- AREA BAWAH: Angka Utama & Judul --- */}
            <div>
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight leading-none mb-1">
                    {value}
                </h3>
                <p className="text-xs font-medium text-slate-500">{title}</p>
                {subtitle && (
                    <p className="text-caption text-slate-400 mt-0.5">
                        {subtitle}
                    </p>
                )}
            </div>
        </Card>
    );
}
