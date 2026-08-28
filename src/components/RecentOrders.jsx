import React from "react";
import Card from "./ui/Card";

const CURRENCY = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export default function RecentOrders({ orders = [] }) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold text-[#252A34]">Recent Transactions</h2>
        <span className="text-[10px] text-slate-400 font-semibold">Live PostgreSQL Feed</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 font-semibold text-[10px] uppercase">
              <th className="pb-2">Order ID</th>
              <th className="pb-2">Customer</th>
              <th className="pb-2">Total</th>
              <th className="pb-2 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {orders.length > 0 ? (
              orders.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50">
                  <td className="py-2.5 font-semibold text-[#06b6b3]">{item.nomor_so || item.id}</td>
                  <td className="py-2.5 font-medium text-slate-800">
                    {typeof item.customer === "string" ? item.customer : item.customer?.nama}
                  </td>
                  <td className="py-2.5 font-bold text-[#252A34]">
                    {CURRENCY.format(item.amount ?? item.total_harga ?? 0)}
                  </td>
                  <td className="py-2.5 text-right">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600">
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-4 text-center text-slate-400 text-xs">
                  Belum ada transaksi terbaru.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}