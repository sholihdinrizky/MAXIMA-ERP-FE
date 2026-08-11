import React from "react";
import { X, Building2, Phone, MapPin, FileDown } from "lucide-react";

const CURRENCY_FORMATTER = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

const STATUS_STYLES = {
  "Needs DO": "bg-amber-50 text-amber-700 border-amber-200/80",
  "Needs Invoice": "bg-[#FF2E63]/10 text-[#FF2E63] border-[#FF2E63]/20",
  Closed: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
  "SO Active": "bg-[#08D9D6]/10 text-[#06b6b3] border-[#08D9D6]/30",
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

  // Dynamic Action State & Target Status Next Step
  const getActionButton = (status) => {
    switch (status) {
      case "Needs DO":
        return {
          label: "Process Delivery Order",
          nextStatus: "Needs Invoice",
          style:
            "bg-amber-500 hover:bg-amber-600 text-white shadow-sm active:scale-95",
        };
      case "Needs Invoice":
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

  // Dynamic Print Handler
  const handleExportPDF = () => {
    const printWindow = window.open("", "", "width=800,height=700");
    if (!printWindow) return;

    printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Invoice - ${order.id}</title>
              <style>
                body { font-family: sans-serif; padding: 40px; color: #252A34; }
                .header { border-bottom: 2px solid #08D9D6; padding-bottom: 10px; margin-bottom: 20px; }
                .total { font-weight: bold; color: #FF2E63; font-size: 18px; margin-top: 20px; }
              </style>
            </head>
            <body>
              <div class="header">
                <h2>MAXIMA ERP — INVOICE</h2>
                <p>Order ID: ${order.id} | Date: ${order.date}</p>
              </div>
              <p><strong>Customer:</strong> ${order.customerName || order.customer}</p>
              <p class="total">Total Amount: ${CURRENCY_FORMATTER.format(order.amount || 450000000)}</p>
              <script>window.onload = function() { window.print(); window.close(); };</script>
            </body>
          </html>
        `);
    printWindow.document.close();
  };

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
                {order.id}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">{order.date}</p>
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
                Customer
              </span>
              <h3 className="text-sm font-bold text-[#252A34]">
                {order.customerName || order.customer}
              </h3>
              <div className="space-y-1.5 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <Building2 size={14} className="text-[#06b6b3]" />
                  <span>
                    {order.institution || "Institut Teknologi Sepuluh Nopember"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-[#06b6b3]" />
                  <span>{order.phone || "031-5994251"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-[#06b6b3]" />
                  <span>
                    {order.address || "Jl. Raya ITS, Sukolilo, Surabaya"}
                  </span>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="space-y-3">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-semibold text-[10px] uppercase">
                      <th className="pb-2">NAMA_PRODUK</th>
                      <th className="pb-2 text-center">QTY</th>
                      <th className="pb-2 text-right">HARGA</th>
                      <th className="pb-2 text-right">SUBTOTAL</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {(order.items && order.items.length > 0
                      ? order.items
                      : [
                          {
                            name: "Laptop ASUS Vivobook 14 i5",
                            qty: 40,
                            price: 9850000,
                          },
                          {
                            name: "Logitech Wireless Mouse M331",
                            qty: 40,
                            price: 285000,
                          },
                        ]
                    ).map((item, idx) => (
                      <tr key={idx}>
                        <td className="py-3 font-semibold text-[#252A34] max-w-[140px]">
                          {item.name}
                        </td>
                        <td className="py-3 text-center font-medium text-slate-500">
                          {item.qty}
                        </td>
                        <td className="py-3 text-right text-slate-500">
                          {CURRENCY_FORMATTER.format(item.price)}
                        </td>
                        <td className="py-3 text-right font-bold text-[#252A34]">
                          {CURRENCY_FORMATTER.format(item.qty * item.price)}
                        </td>
                      </tr>
                    ))}
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
                {CURRENCY_FORMATTER.format(order.amount || 450000000)}
              </span>
            </div>

            {/* Progress Stepper Bar */}
            <div className="grid grid-cols-4 gap-1.5 pt-2">
              <div className="h-1.5 rounded-full bg-[#08D9D6]" />
              <div
                className={`h-1.5 rounded-full ${order.status !== "SO Active" ? "bg-[#08D9D6]" : "bg-slate-200"}`}
              />
              <div
                className={`h-1.5 rounded-full ${order.status === "Closed" || order.status === "Needs Invoice" ? "bg-[#08D9D6]" : "bg-slate-200"}`}
              />
              <div
                className={`h-1.5 rounded-full ${order.status === "Closed" ? "bg-[#08D9D6]" : "bg-slate-200"}`}
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t border-slate-100 bg-white flex items-center justify-between gap-3">
            <button
              onClick={handleActionClick}
              disabled={!actionBtn.nextStatus}
              className={`flex-1 font-bold text-xs py-3 rounded-xl transition-all cursor-pointer ${actionBtn.style}`}
            >
              {actionBtn.label}
            </button>
            <button
              onClick={handleExportPDF}
              className="flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-50 text-[#252A34] font-bold text-xs px-4 py-3 rounded-xl transition-all cursor-pointer active:scale-95"
            >
              <FileDown size={15} />
              Export PDF Invoice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
