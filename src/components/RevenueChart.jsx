import React, { useMemo } from "react";
import Card from "./ui/Card";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Agu", "Sep", "Okt", "Nov", "Des"
];

const CURRENCY = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export default function RevenueChart({ orders = [] }) {
  const chartData = useMemo(() => {
    // Inisialisasi 12 bulan dengan nilai 0
    const monthlyMap = Array(12).fill(0);

    orders.forEach((order) => {
      const rawDate = order.tanggal || order.date || order.created_at;
      let monthIndex = new Date().getMonth(); // Fallback ke bulan berjalan jika parsing gagal

      if (rawDate) {
        // Handle format ISO "2026-08-28..." maupun "28/8/2026"
        if (typeof rawDate === "string" && rawDate.includes("/")) {
          const parts = rawDate.split("/");
          if (parts.length >= 2) {
            monthIndex = parseInt(parts[1], 10) - 1;
          }
        } else {
          const parsed = new Date(rawDate);
          if (!isNaN(parsed.getTime())) {
            monthIndex = parsed.getMonth();
          }
        }
      }

      if (monthIndex >= 0 && monthIndex < 12) {
        const val = parseFloat(order.amount ?? order.total_harga ?? order.total ?? 0);
        monthlyMap[monthIndex] += val;
      }
    });

    const currentMonth = new Date().getMonth();
    const result = [];

    // Tampilkan 5 bulan (2 bulan lalu, bulan ini, 2 bulan ke depan)
    for (let i = Math.max(0, currentMonth - 2); i <= Math.min(11, currentMonth + 2); i++) {
      const rawVal = monthlyMap[i];
      result.push({
        month: MONTH_NAMES[i],
        revenueJt: Math.round(rawVal / 1000000), // Dalam satuan Juta (contoh: 278)
        rawRevenue: rawVal,
      });
    }

    return result;
  }, [orders]);

  return (
    <Card className="p-5 flex flex-col justify-between h-[300px]">
      <div>
        <h2 className="text-sm font-bold text-[#252A34]">Monthly Sales Revenue</h2>
        <p className="text-[10px] text-slate-400">
          Realisasi omzet bulanan dari transaksi penjualan
        </p>
      </div>

      <div className="h-52 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 11 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              tickFormatter={(val) => `${val}Jt`}
            />
            <Tooltip
              formatter={(value, name, item) => [
                CURRENCY.format(item.payload.rawRevenue),
                "Total Revenue",
              ]}
              contentStyle={{
                backgroundColor: "#252A34",
                borderRadius: "12px",
                border: "none",
                color: "#fff",
                fontSize: "11px",
              }}
              itemStyle={{ color: "#08D9D6" }}
            />
            <Bar
              dataKey="revenueJt"
              fill="#08D9D6"
              radius={[6, 6, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}