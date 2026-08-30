import React from "react";
import { X, Building2, Phone, MapPin } from "lucide-react";

const CURRENCY_FORMATTER = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

const STATUS_STYLES = {
  "Needs DO": "bg-amber-50 text-amber-700 border-amber-200/80",
  Confirmed: "bg-amber-50 text-amber-700 border-amber-200/80",
  "Needs Invoice": "bg-[#FF2E63]/10 text-[#FF2E63] border-[#FF2E63]/20",
  Delivered: "bg-[#FF2E63]/10 text-[#FF2E63] border-[#FF2E63]/20",
  Closed: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
  "SO Active": "bg-[#08D9D6]/10 text-[#06b6b3] border-[#08D9D6]/30",
  Cancelled: "bg-slate-100 text-slate-500 border-slate-200",
};

export default function OrderDetailDrawer({
  isOpen,
  onClose,
  order,
  onUpdateStatus,
}) {
  if (!isOpen || !order) return null;

  const statusClass =
    STATUS_STYLES[order.status] ||
    "bg-slate-50 text-slate-600 border-slate-200";

  const getActionButton = (status) => {
    switch (status) {
      case "Needs DO":
      case "Confirmed":
        return {
          label: "Process Delivery Order",
          nextStatus: "Needs Invoice",
          style:
            "bg-amber-500 hover:bg-amber-600 text-white shadow-sm active:scale-95",
        };
      case "Needs Invoice":
      case "Delivered":
        return {
          label: "Generate Invoice",
          nextStatus: "Closed",
          style:
            "bg-[#FF2E63] hover:bg-[#e02653] text-white shadow-sm active:scale-95",
        };
      case "Closed":
        return {
          label: "Order Closed (Verified)",
          nextStatus: null,
          style:
            "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed",
        };
      case "Cancelled":
        return {
          label: "Order Cancelled",
          nextStatus: null,
          style:
            "bg-rose-50 text-rose-400 border border-rose-200 cursor-not-allowed",
        };
      default:
        return {
          label: "Process Order",
          nextStatus: "Needs DO",
          style:
            "bg-[#08D9D6] hover:bg-[#06b6b3] text-[#252A34] shadow-sm active:scale-95",
        };
    }
  };

  const actionBtn = getActionButton(order.status);

  const items = order.items || order.sales_order_details || [];
  const customerName =
    order.customer?.nama ||
    (typeof order.customer === "string" ? order.customer : null) ||
    order.customer_name ||
    "Customer";

  const customerPhone =
    order.customer?.telepon ||
    order.customer?.phone ||
    order.customer_telepon ||
    order.telepon ||
    "-";

  const customerAddress =
    order.customer?.alamat ||
    order.customer?.address ||
    order.customer_alamat ||
    order.alamat ||
    "-";

  const totalAmount = Number(
    order.amount ?? order.total_harga ?? order.total ?? 0
  );

  const handleActionClick = () => {
    if (actionBtn.nextStatus && onUpdateStatus) {
      onUpdateStatus(order.id, actionBtn.nextStatus);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-lg bg-white shadow-2xl flex flex-col justify-between border-l border-slate-100 animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-white">
            <div>
              <span className="text-[10px] font-bold text-[#06b6b3] uppercase tracking-wider">
                Sales Order Detail
              </span>
              <h2 className="text-xl font-bold text-[#252A34] tracking-tight mt-0.5">
                {order.nomor_so || order.id}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {order.date ||
                  (order.tanggal
                    ? new Date(order.tanggal).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "-")}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold border ${statusClass}`}
              >
                {order.status}
              </span>
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6 overflow-y-auto flex-1">
            <div className="bg-slate-50/70 rounded-2xl p-4 border border-slate-100 space-y-2.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Customer Information
              </span>
              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2 font-semibold text-slate-800">
                  <Building2 size={15} className="text-[#06b6b3] shrink-0" />
                  <span>{customerName}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <Phone size={14} className="text-[#06b6b3] shrink-0" />
                  <span>{customerPhone}</span>
                </div>
                <div className="flex items-start gap-2 text-slate-500">
                  <MapPin
                    size={14}
                    className="text-[#06b6b3] shrink-0 mt-0.5"
                  />
                  <span className="leading-relaxed">{customerAddress}</span>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="space-y-3">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-semibold text-[10px] uppercase">
                      <th className="pb-2">NAMA PRODUK</th>
                      <th className="pb-2 text-center">QTY</th>
                      <th className="pb-2 text-right">HARGA</th>
                      <th className="pb-2 text-right">SUBTOTAL</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {items.length > 0 ? (
                      items.map((item, idx) => {
                        const prodName =
                          item.product?.nama_produk ||
                          item.nama_produk ||
                          item.nama ||
                          "Item";
                        const qty = item.jumlah || item.qty || 1;
                        const price = Number(
                          item.harga_satuan ?? item.price ?? 0
                        );
                        const sub = Number(item.subtotal ?? qty * price);
                        return (
                          <tr key={idx}>
                            <td className="py-3 font-semibold text-[#252A34] max-w-[140px]">
                              {prodName}
                            </td>
                            <td className="py-3 text-center font-medium text-slate-500">
                              {qty}
                            </td>
                            <td className="py-3 text-right text-slate-500">
                              {CURRENCY_FORMATTER.format(price)}
                            </td>
                            <td className="py-3 text-right font-bold text-[#252A34]">
                              {CURRENCY_FORMATTER.format(sub)}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan="4"
                          className="py-4 text-center text-slate-400"
                        >
                          Data rincian produk tidak tersedia.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Total Amount Box */}
            <div className="bg-[#252A34] text-white rounded-xl p-4 flex items-center justify-between shadow-sm">
              <span className="text-xs text-slate-300 font-medium">
                Total Amount
              </span>
              <span className="text-lg font-bold text-[#08D9D6]">
                {CURRENCY_FORMATTER.format(totalAmount)}
              </span>
            </div>

            {/* Progress Stepper Bar */}
            <div className="grid grid-cols-4 gap-1.5 pt-2">
              <div
                className={`h-1.5 rounded-full ${
                  order.status === "Cancelled"
                    ? "bg-rose-400"
                    : "bg-[#08D9D6]"
                }`}
              />
              <div
                className={`h-1.5 rounded-full ${
                  order.status !== "SO Active" &&
                  order.status !== "Draft" &&
                  order.status !== "Cancelled"
                    ? "bg-[#08D9D6]"
                    : "bg-slate-200"
                }`}
              />
              <div
                className={`h-1.5 rounded-full ${
                  (order.status === "Closed" ||
                    order.status === "Needs Invoice" ||
                    order.status === "Delivered") &&
                  order.status !== "Cancelled"
                    ? "bg-[#08D9D6]"
                    : "bg-slate-200"
                }`}
              />
              <div
                className={`h-1.5 rounded-full ${
                  order.status === "Closed"
                    ? "bg-[#08D9D6]"
                    : "bg-slate-200"
                }`}
              />
            </div>
          </div>

          {/* Footer Actions (Full Width Button) */}
          <div className="p-6 border-t border-slate-100 bg-white">
            <button
              onClick={handleActionClick}
              disabled={!actionBtn.nextStatus}
              className={`w-full font-bold text-xs py-3.5 rounded-xl transition-all cursor-pointer ${actionBtn.style}`}
            >
              {actionBtn.label}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}