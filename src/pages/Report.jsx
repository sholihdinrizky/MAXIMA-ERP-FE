import React, { useState } from "react";
import Card from "../components/ui/Card";
import { useReports } from "../hooks/useReport";
import { FileText, DollarSign, CheckCircle2, Clock, Printer } from "lucide-react";

const CURRENCY = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export default function Reports() {
  const { orders = [], summary, loading } = useReports();
  const [selectedIds, setSelectedIds] = useState([]);

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === orders.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(orders.map((o) => o.id));
    }
  };

  // Dedicated Print Engine (Zero-CSS-Conflict)
  const handlePrint = () => {
    const ordersToPrint = orders.filter((o) => selectedIds.includes(o.id));
    if (ordersToPrint.length === 0) {
      alert("Pilih minimal 1 order yang ingin dicetak!");
      return;
    }

    const printTotalAmount = ordersToPrint.reduce(
      (sum, o) => sum + (parseFloat(o.total_harga) || 0),
      0
    );

    const rowsHtml = ordersToPrint
      .map(
        (o) => `
        <tr>
          <td style="padding: 10px 8px; border-bottom: 1px solid #e2e8f0; font-family: monospace; font-weight: bold;">${o.nomor_so}</td>
          <td style="padding: 10px 8px; border-bottom: 1px solid #e2e8f0; font-weight: 600;">${o.customer?.nama || "-"}</td>
          <td style="padding: 10px 8px; border-bottom: 1px solid #e2e8f0; color: #475569;">
            ${(o.items || []).map((i) => `${i.product?.nama_produk || "Item"} (${i.jumlah} unit)`).join(", ")}
          </td>
          <td style="padding: 10px 8px; border-bottom: 1px solid #e2e8f0;">
            ${o.tanggal ? new Date(o.tanggal).toLocaleDateString("id-ID") : "-"}
          </td>
          <td style="padding: 10px 8px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: bold;">
            ${CURRENCY.format(o.total_harga || 0)}
          </td>
        </tr>
      `
      )
      .join("");

    const printWindow = window.open("", "_blank", "width=900,height=800");
    if (!printWindow) {
      alert("Pop-up diblokir browser. Izinkan pop-up untuk mencetak.");
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>MAXIMA ERP - Settlement Report</title>
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #1e293b; padding: 40px; }
            .header { border-bottom: 3px solid #08D9D6; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-start; }
            .brand { font-size: 24px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px; }
            .subtitle { font-size: 12px; color: #64748b; margin-top: 4px; }
            .meta { text-align: right; font-size: 12px; color: #475569; }
            table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 12px; }
            th { text-align: left; padding: 10px 8px; border-bottom: 2px solid #0f172a; text-transform: uppercase; font-size: 11px; color: #475569; }
            .total-row { border-top: 2px solid #0f172a; font-size: 14px; font-weight: bold; }
            .signatures { margin-top: 60px; display: flex; justify-content: space-between; padding: 0 40px; font-size: 12px; text-align: center; }
            .sig-space { margin-bottom: 70px; }
            .sig-name { font-weight: bold; text-decoration: underline; }
            @media print {
              body { padding: 20px; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="brand">MAXIMA ERP SYSTEM</div>
              <div class="subtitle">Official Sales Order & Financial Settlement Report</div>
            </div>
            <div class="meta">
              <p><strong>Tanggal Cetak:</strong> ${new Date().toLocaleDateString("id-ID")}</p>
              <p><strong>Total Pesanan:</strong> ${ordersToPrint.length} Transaksi</p>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>No. SO</th>
                <th>Mitra / Customer</th>
                <th>Rincian Item</th>
                <th>Tanggal</th>
                <th style="text-align: right;">Nilai Transaksi</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
            <tfoot>
              <tr class="total-row">
                <td colspan="4" style="padding: 14px 8px; text-align: right; text-transform: uppercase;">Total Akumulasi:</td>
                <td style="padding: 14px 8px; text-align: right; color: #0f172a;">${CURRENCY.format(printTotalAmount)}</td>
              </tr>
            </tfoot>
          </table>

          <div class="signatures">
            <div>
              <p class="sig-space">Dibuat Oleh,</p>
              <p class="sig-name">Admin Operasional</p>
            </div>
            <div>
              <p class="sig-space">Disetujui Oleh,</p>
              <p class="sig-name">Finance Director</p>
            </div>
          </div>

          <script>
            window.onload = function() {
              window.focus();
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#252A34] tracking-tight">
            Financial & Executive Reports
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Pilih order transaksi yang ingin dicetak sebagai rekap faktur resmi
          </p>
        </div>
        <button
          type="button"
          onClick={handlePrint}
          disabled={selectedIds.length === 0}
          className="flex items-center gap-2 bg-[#08D9D6] hover:bg-[#06b6b3] text-[#252A34] px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
        >
          <Printer size={16} />
          Print Selected ({selectedIds.length})
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Gross Revenue</span>
            <DollarSign size={16} className="text-[#06b6b3]" />
          </div>
          <div className="text-xl font-bold text-[#252A34]">
            {loading ? "..." : CURRENCY.format(summary.totalSales)}
          </div>
          <p className="text-[10px] text-slate-400">{summary.totalTransactions} Total Transaksi</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Settled (Closed)</span>
            <CheckCircle2 size={16} className="text-emerald-500" />
          </div>
          <div className="text-xl font-bold text-emerald-600">
            {loading ? "..." : CURRENCY.format(summary.settledRevenue)}
          </div>
          <p className="text-[10px] text-slate-400">{summary.completedTransactions} Order Selesai</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Pending Settlement</span>
            <Clock size={16} className="text-amber-500" />
          </div>
          <div className="text-xl font-bold text-amber-600">
            {loading ? "..." : CURRENCY.format(summary.pendingRevenue)}
          </div>
          <p className="text-[10px] text-slate-400">Menunggu Proses</p>
        </div>
      </div>

      {/* Interactive Selection Table */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-[#06b6b3]" />
            <h2 className="text-sm font-bold text-[#252A34]">Pilih Transaksi untuk Dicetak</h2>
          </div>
          <button
            type="button"
            onClick={handleSelectAll}
            className="text-xs font-semibold text-[#06b6b3] hover:underline cursor-pointer"
          >
            {selectedIds.length === orders.length ? "Deselect All" : "Select All"}
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold tracking-wide">
                <th className="pb-3 w-10 text-center">PILIH</th>
                <th className="pb-3">INVOICE / SO</th>
                <th className="pb-3">MITRA / CUSTOMER</th>
                <th className="pb-3">RINCIAN ITEM</th>
                <th className="pb-3">TANGGAL</th>
                <th className="pb-3">TOTAL</th>
                <th className="pb-3 text-center">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-6 text-center text-slate-400">Memuat laporan...</td>
                </tr>
              ) : orders.length > 0 ? (
                orders.map((o) => {
                  const isChecked = selectedIds.includes(o.id);
                  return (
                    <tr
                      key={o.id}
                      onClick={() => handleToggleSelect(o.id)}
                      className={`hover:bg-slate-50/80 transition cursor-pointer ${
                        isChecked ? "bg-cyan-50/40" : ""
                      }`}
                    >
                      <td className="py-3 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="rounded text-[#08D9D6] focus:ring-0 cursor-pointer"
                        />
                      </td>
                      <td className="py-3 font-semibold text-[#06b6b3]">{o.nomor_so}</td>
                      <td className="py-3 font-medium text-slate-900">{o.customer?.nama}</td>
                      <td className="py-3 text-slate-500 max-w-xs truncate">
                        {(o.items || []).map((i) => `${i.product?.nama_produk || "Item"} (${i.jumlah}x)`).join(", ")}
                      </td>
                      <td className="py-3 text-slate-400">
                        {o.tanggal ? new Date(o.tanggal).toLocaleDateString("id-ID") : "-"}
                      </td>
                      <td className="py-3 font-bold text-[#252A34]">{CURRENCY.format(o.total_harga || 0)}</td>
                      <td className="py-3 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                          {o.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="py-6 text-center text-slate-400">Belum ada transaksi.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}