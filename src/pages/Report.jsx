import React from "react";
import Card from "../components/ui/Card";
import { Download, FileText } from "lucide-react";

// Pure Function cetak terisolasi di luar komponen (Zero Memory Overhead)
const executeSingleRowPrint = (item) => {
  const printWindow = window.open("", "", "width=800,height=700");
  if (!printWindow) return;

  printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Cetak Slip - ${item.id}</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              padding: 40px;
              color: #252A34;
              background: #ffffff;
            }
            .header {
              border-bottom: 3px solid #08D9D6;
              padding-bottom: 12px;
              margin-bottom: 24px;
            }
            .brand {
              font-size: 22px;
              font-weight: 800;
              color: #252A34;
              letter-spacing: -0.5px;
            }
            .sub-brand {
              font-size: 11px;
              color: #64748b;
              text-transform: uppercase;
              letter-spacing: 1px;
              margin-top: 2px;
            }
            .card {
              border: 1px solid #e2e8f0;
              border-radius: 12px;
              padding: 20px;
              background: #f8fafc;
              margin-bottom: 24px;
            }
            .row {
              display: flex;
              justify-content: space-between;
              padding: 10px 0;
              border-bottom: 1px solid #e2e8f0;
              font-size: 13px;
            }
            .row:last-child {
              border-bottom: none;
            }
            .label {
              color: #64748b;
              font-weight: 500;
            }
            .value {
              font-weight: 700;
              color: #252A34;
            }
            .total-row {
              margin-top: 12px;
              padding-top: 12px;
              border-top: 2px solid #08D9D6;
              font-size: 15px;
            }
            .footer {
              margin-top: 60px;
              display: flex;
              justify-content: space-between;
              font-size: 12px;
              text-align: center;
            }
            .sig-space {
              height: 50px;
            }
            .sig-name {
              font-weight: 700;
              text-decoration: underline;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="brand">MAXIMA ERP — EXECUTIVE SLIP</div>
            <div class="sub-brand">Dokumen Cetak Resmi Transaksi Tunggal</div>
          </div>

          <div class="card">
            <div class="row">
              <span class="label">ID Laporan</span>
              <span class="value">${item.id}</span>
            </div>
            <div class="row">
              <span class="label">Nama Dokumen</span>
              <span class="value">${item.title}</span>
            </div>
            <div class="row">
              <span class="label">Kategori Tipe</span>
              <span class="value">${item.type}</span>
            </div>
            <div class="row">
              <span class="label">Tanggal Diterbitkan</span>
              <span class="value">${item.date}</span>
            </div>
            <div class="row total-row">
              <span class="label" style="color: #252A34; font-weight: 700;">Total Valuasi / Jumlah</span>
              <span class="value" style="color: #06b6b3;">${item.totalAmount}</span>
            </div>
          </div>

          <div class="footer">
            <div>
              <div style="color: #64748b;">Dibuat Oleh,</div>
              <div class="sig-space"></div>
              <div class="sig-name">System Administrator</div>
            </div>
            <div>
              <div style="color: #64748b;">Status Otorisasi,</div>
              <div class="sig-space"></div>
              <div class="sig-name" style="color: #06b6b3; text-decoration: none;">VERIFIED & CLOSED</div>
            </div>
          </div>

          <script>
            window.onload = function() {
              window.print();
              window.close();
            };
          </script>
        </body>
      </html>
    `);
  printWindow.document.close();
};

export default function Reports({ reports = [] }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#252A34] tracking-tight">
            Executive Reports
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Rekapitulasi performa penjualan dan operasional
          </p>
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold tracking-wide">
                <th className="pb-3">REPORT ID</th>
                <th className="pb-3">TITLE</th>
                <th className="pb-3">TYPE</th>
                <th className="pb-3">DATE GENERATED</th>
                <th className="pb-3">VALUATION / TOTAL</th>
                <th className="pb-3 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {reports.length > 0 ? (
                reports.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/80 transition-colors duration-150"
                  >
                    <td className="py-3 font-semibold text-[#252A34]">
                      {item.id}
                    </td>
                    <td className="py-3 font-medium text-slate-900 flex items-center gap-2">
                      <FileText size={14} className="text-[#06b6b3]" />
                      {item.title}
                    </td>
                    <td className="py-3 text-slate-500">{item.type}</td>
                    <td className="py-3 text-slate-500">{item.date}</td>
                    <td className="py-3 font-bold text-[#252A34]">
                      {item.totalAmount}
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => executeSingleRowPrint(item)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-[#252A34] bg-[#08D9D6]/10 hover:bg-[#08D9D6]/20 border border-[#08D9D6]/30 rounded-lg transition-all cursor-pointer active:scale-95"
                      >
                        <Download size={13} />
                        Download PDF
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-6 text-center text-slate-400">
                    Data laporan tidak ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
