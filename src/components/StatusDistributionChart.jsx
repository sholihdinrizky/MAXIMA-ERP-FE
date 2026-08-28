import React, { useMemo } from "react";
import Card from "./ui/Card";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const STATUS_COLORS = {
  "Needs DO": "#F59E0B",
  "Confirmed": "#F59E0B",
  "Needs Invoice": "#FF2E63",
  "Delivered": "#3B82F6",
  "Closed": "#10B981",
};

export default function StatusDistributionChart({ orders = [] }) {
  const chartData = useMemo(() => {
    if (!orders.length) return [];

    const counts = orders.reduce((acc, o) => {
      const status = o.status || "Confirmed";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
      color: STATUS_COLORS[name] || "#08D9D6",
    }));
  }, [orders]);

  const total = orders.length;

  return (
    <Card className="p-5 flex flex-col justify-between h-[300px]">
      <div>
        <h2 className="text-sm font-bold text-[#252A34]">Order Status Distribution</h2>
        <p className="text-[10px] text-slate-400">Proporsi siklus status order aktif</p>
      </div>

      <div className="relative h-44 flex items-center justify-center">
        {total > 0 ? (
          <>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                  isAnimationActive={false}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            {/* Teks Angka di Tengah Donut Tetap Bersih */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-bold text-[#252A34]">{total}</span>
              <span className="text-[9px] text-slate-400 font-semibold uppercase">Total SO</span>
            </div>
          </>
        ) : (
          <p className="text-xs text-slate-400">Belum ada data pesanan</p>
        )}
      </div>

      {/* Legenda di Bawah Diagram */}
      <div className="flex flex-wrap gap-2 justify-center pt-2 border-t border-slate-100 text-[10px]">
        {chartData.map((item) => (
          <div key={item.name} className="flex items-center gap-1.5 font-medium text-slate-600">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
            <span>{item.name}: {item.value}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}