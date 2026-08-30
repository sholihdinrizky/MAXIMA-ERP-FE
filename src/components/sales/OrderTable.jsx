import React, { useState } from "react";
import Card from "../ui/Card";
import OrderDetailDrawer from "./OrderDetailDrawer";
import { ArrowRight } from "lucide-react";

export default function OrderTable({ orders = [], onUpdateStatus }) {
  const [selectedOrder, setSelectedOrder] = useState(null);

  const formatRupiah = (number) => {
    const validNum = Number(number) || 0;
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(validNum);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Needs DO":
      case "Confirmed":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Needs Invoice":
      case "Delivered":
        return "bg-[#FF2E63]/10 text-[#FF2E63] border-[#FF2E63]/20";
      case "Closed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Cancelled":
        return "bg-slate-100 text-slate-500 border-slate-200";
      default:
        return "bg-[#08D9D6]/10 text-[#06b6b3] border-[#08D9D6]/30";
    }
  };

  const handleDrawerUpdateStatus = async (id, nextStatus) => {
    if (onUpdateStatus) {
      await onUpdateStatus(id, nextStatus);
    }
    if (selectedOrder) {
      setSelectedOrder((prev) =>
        prev ? { ...prev, status: nextStatus } : null
      );
    }
  };

  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 font-semibold tracking-wider text-[11px]">
              <th className="pb-3">ORDER ID</th>
              <th className="pb-3">CUSTOMER</th>
              <th className="pb-3">DATE</th>
              <th className="pb-3">AMOUNT</th>
              <th className="pb-3">STATUS</th>
              <th className="pb-3 text-right">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {orders.length > 0 ? (
              orders.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => setSelectedOrder(item)}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 font-semibold text-[#06b6b3]">
                    {item.nomor_so || item.id}
                  </td>
                  <td className="py-3.5 font-medium text-slate-900">
                    {typeof item.customer === "string"
                      ? item.customer
                      : item.customer?.nama || "-"}
                  </td>
                  <td className="py-3.5 text-slate-400">
                    {item.date ||
                      (item.tanggal
                        ? new Date(item.tanggal).toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "-")}
                  </td>
                  <td className="py-3.5 font-bold text-slate-900">
                    {formatRupiah(item.amount ?? item.total_harga)}
                  </td>
                  <td className="py-3.5">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusStyle(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#06b6b3] hover:text-[#08D9D6] transition-colors"
                    >
                      View
                      <ArrowRight
                        size={13}
                        className="group-hover:translate-x-0.5 transition-transform"
                      />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-6 text-center text-slate-400">
                  Data transaksi tidak ditemukan di PostgreSQL.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <OrderDetailDrawer
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        order={selectedOrder}
        onUpdateStatus={handleDrawerUpdateStatus}
      />
    </Card>
  );
}