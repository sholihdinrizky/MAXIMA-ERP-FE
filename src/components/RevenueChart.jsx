import React from "react";
import Card from "./ui/Card";

export default function RevenueChart() {
    const data = [
        { month: "Jul '23", amount: 520 },
        { month: "Aug '23", amount: 360 },
        { month: "Sep '23", amount: 650 },
        { month: "Oct '23", amount: 350 },
    ];

    const maxAmount = 800;

    return (
        <Card className="flex flex-col justify-between h-full">
            {/* Header Chart */}
            <div className="mb-4">
                <h2 className="text-base font-bold text-slate-900 leading-tight">
                    Monthly Sales Revenue
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                    Revenue booked per month
                </p>
            </div>

            {/* Area Grafik */}
            <div className="flex flex-col w-full">
                {/* 1. Area Batang & Garis Grid (Tinggi Pas 160px) */}
                <div className="relative h-36 w-full">
                    {/* Garis Grid Horizontal */}
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[10px] text-slate-300">
                        <div className="border-b border-dashed border-slate-100 pb-0.5">
                            800Jt
                        </div>
                        <div className="border-b border-dashed border-slate-100 pb-0.5">
                            600Jt
                        </div>
                        <div className="border-b border-dashed border-slate-100 pb-0.5">
                            400Jt
                        </div>
                        <div className="border-b border-dashed border-slate-100 pb-0.5">
                            200Jt
                        </div>
                        <div className="border-b border-slate-300 pb-0.5 font-bold text-slate-400">
                            0Jt
                        </div>
                    </div>

                    {/* Batang Grafik (Nempel Pas di Dasar Garis 0Jt) */}
                    <div className="absolute inset-0 pl-8 flex items-end justify-around z-10">
                        {data.map((item) => {
                            const heightPercent =
                                (item.amount / maxAmount) * 100;
                            return (
                                <div
                                    key={item.month}
                                    className="flex items-end justify-center h-full w-12 group"
                                >
                                    <div
                                        style={{ height: `${heightPercent}%` }}
                                        className="w-10 bg-teal-400/80 rounded-t-lg transition-all duration-300 group-hover:bg-teal-600 cursor-pointer"
                                        title={`Rp ${item.amount} Juta`}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* 2. Area Label Bulan (Di Bawah Garis 0Jt) */}
                <div className="pl-8 flex justify-around mt-3">
                    {data.map((item) => (
                        <span
                            key={item.month}
                            className="w-12 text-center text-[11px] font-medium text-slate-400"
                        >
                            {item.month}
                        </span>
                    ))}
                </div>
            </div>
        </Card>
    );
}
