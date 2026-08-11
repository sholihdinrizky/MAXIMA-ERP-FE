import React from "react";
import Card from "./ui/Card";

export default function StatusDistributionChart() {
    const statuses = [
        { label: "SO", count: 2, color: "bg-teal-500", hex: "#0d9488" },
        { label: "DO", count: 2, color: "bg-amber-500", hex: "#d97706" },
        {
            label: "Sales Invoice",
            count: 2,
            color: "bg-blue-500",
            hex: "#2563eb",
        },
        { label: "Closed", count: 2, color: "bg-rose-500", hex: "#e11d48" },
    ];

    return (
        <Card className="flex flex-col justify-between h-full">
            {/* Header Chart */}
            <div className="mb-4">
                <h2 className="text-base font-bold text-slate-900 leading-tight">
                    Order Status Distribution
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                    SO vs DO vs Invoice vs Closed
                </p>
            </div>

            {/* Visual Donut & Legend */}
            <div className="flex items-center justify-between gap-6 py-4">
                {/* Lingkaran Donut Cincin */}
                <div
                    className="relative w-36 h-36 rounded-full flex items-center justify-center shrink-0"
                    style={{
                        background: `conic-gradient(
                 #0d9488 0% 25%,
                 #d97706 25% 50%,
                 #2563eb 50% 75%,
                 #e11d48 75% 100%
               )`,
                    }}
                >
                    {/* Lubang Tengah Donut */}
                    <div className="w-20 h-20 bg-white rounded-full shadow-inner flex items-center justify-center">
                        <span className="text-caption font-semibold text-slate-400">
                            Total 8
                        </span>
                    </div>
                </div>

                {/* Legend Status di Kanan */}
                <div className="flex flex-col gap-2.5 w-full">
                    {statuses.map((item) => (
                        <div
                            key={item.label}
                            className="flex items-center justify-between text-xs"
                        >
                            <div className="flex items-center gap-2">
                                <span
                                    className={`w-2.5 h-2.5 rounded-full ${item.color}`}
                                />
                                <span className="font-medium text-slate-600">
                                    {item.label}
                                </span>
                            </div>
                            <span className="font-bold text-slate-800">
                                {item.count}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );
}
