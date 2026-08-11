import React, { useMemo } from "react";
import Card from "./ui/Card";

// Pure Formatter (O(1) Allocation - Prevents Garbage Collection Pressure)
const CURRENCY_FORMATTER = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

// Deterministic Status Mapping Table
const STATUS_STYLES = {
  "Needs DO": "bg-amber-50 text-amber-700 border-amber-200/80",
  "Needs Invoice": "bg-[#FF2E63]/10 text-[#FF2E63] border-[#FF2E63]/20",
  Closed: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
  "SO Active": "bg-[#08D9D6]/10 text-[#06b6b3] border-[#08D9D6]/30",
};

export default function RecentOrders({ orders = [] }) {
  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-[#252A34] tracking-tight">
            Recent Sales Orders
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Transaksi operasional terbaru yang masuk ke sistem
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 font-semibold tracking-wide">
              <th className="pb-3">ORDER ID</th>
              <th className="pb-3">CUSTOMER</th>
              <th className="pb-3">DATE</th>
              <th className="pb-3">AMOUNT</th>
              <th className="pb-3">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {orders.length > 0 ? (
              orders.map((item) => {
                const statusClass =
                  STATUS_STYLES[item.status] ||
                  "bg-slate-50 text-slate-600 border-slate-200";

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/80 transition-colors duration-150"
                  >
                    <td className="py-3 font-semibold text-[#252A34]">
                      {item.id}
                    </td>
                    <td className="py-3 font-medium text-slate-800">
                      {item.customer}
                    </td>
                    <td className="py-3 text-slate-400">{item.date}</td>
                    <td className="py-3 font-bold text-[#252A34]">
                      {CURRENCY_FORMATTER.format(item.amount)}
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusClass}`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="py-6 text-center text-slate-400">
                  Tidak ada data pesanan terbaru.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
