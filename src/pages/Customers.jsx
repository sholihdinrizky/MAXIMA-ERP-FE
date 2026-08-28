import React, { useState, useEffect, useMemo } from "react";
import { Plus, Search, X, Building2, Lock } from "lucide-react";
import api from "../services/api";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    kode: "",
    nama: "",
    email: "",
    telepon: "",
    alamat: "",
  });

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/customers");
      if (res.data?.data) {
        setCustomers(res.data.data);
      }
    } catch (err) {
      console.error("Gagal load customer:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Buka modal & Auto-Generate Kode Customer selanjutnya
  const handleOpenModal = () => {
    const nextNum = customers.length + 1;
    const autoKode = `CUST-${String(nextNum).padStart(3, "0")}`;
    setFormData({
      kode: autoKode,
      nama: "",
      email: "",
      telepon: "",
      alamat: "",
    });
    setErrorMsg("");
    setIsModalOpen(true);
  };

  // Sanitasi Nama Perusahaan (Hanya huruf, angka, spasi, titik, koma, strip)
  const handleNamaChange = (e) => {
    const val = e.target.value;
    const sanitized = val.replace(/[^a-zA-Z0-9\s.,-]/g, "");
    setFormData({ ...formData, nama: sanitized });
  };

  // Sanitasi Telepon (Hanya Angka)
  const handleTeleponChange = (e) => {
    const val = e.target.value;
    const numericOnly = val.replace(/\D/g, "");
    setFormData({ ...formData, telepon: numericOnly });
  };

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    // Validasi ketat nama perusahaan (tidak boleh kosong atau cuma simbol strip)
    if (!formData.nama.trim() || formData.nama.trim().replace(/[-.,\s]/g, "").length < 2) {
      setErrorMsg("Nama perusahaan harus valid (minimal 2 karakter huruf/angka).");
      return;
    }

    if (formData.telepon.length < 8) {
      setErrorMsg("Nomor telepon minimal 8 digit angka.");
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/customers", {
        ...formData,
        nama: formData.nama.trim(),
        email: formData.email.trim(),
        telepon: formData.telepon.trim(),
        alamat: formData.alamat.trim() || "-",
      });
      setIsModalOpen(false);
      await fetchCustomers();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Gagal menambahkan pelanggan");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredCustomers = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();
    if (!query) return customers;

    return customers.filter(
      (c) =>
        c.nama?.toLowerCase().includes(query) ||
        c.kode?.toLowerCase().includes(query) ||
        c.email?.toLowerCase().includes(query)
    );
  }, [customers, searchTerm]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#252A34] tracking-tight">
            Customer Directory
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola data mitra bisnis dan kontak pelanggan ERP
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenModal}
          className="flex items-center gap-2 bg-[#08D9D6] hover:bg-[#06b6b3] text-[#252A34] px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer active:scale-95"
        >
          <Plus size={16} />
          Add Customer
        </button>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Cari nama, kode, atau email pelanggan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#08D9D6] focus:ring-1 focus:ring-[#08D9D6] transition-all"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 font-semibold tracking-wide">
              <th className="pb-3">KODE</th>
              <th className="pb-3">NAMA PERUSAHAAN / MITRA</th>
              <th className="pb-3">EMAIL</th>
              <th className="pb-3">TELEPON</th>
              <th className="pb-3">ALAMAT</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {loading ? (
              <tr>
                <td colSpan="5" className="py-6 text-center text-slate-400">
                  Memuat data pelanggan dari PostgreSQL...
                </td>
              </tr>
            ) : filteredCustomers.length > 0 ? (
              filteredCustomers.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50/80 transition-colors duration-150"
                >
                  <td className="py-3 font-semibold text-[#252A34]">{item.kode}</td>
                  <td className="py-3 font-medium text-slate-900 flex items-center gap-2">
                    <Building2 size={14} className="text-slate-400" />
                    {item.nama}
                  </td>
                  <td className="py-3 text-slate-500">{item.email || "-"}</td>
                  <td className="py-3 text-slate-600">{item.telepon || "-"}</td>
                  <td className="py-3 text-slate-500 max-w-xs truncate">{item.alamat || "-"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-6 text-center text-slate-400">
                  Belum ada pelanggan di database PostgreSQL.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Add Customer */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 border border-slate-100 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-[#252A34]">
                Tambah Pelanggan Baru
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer outline-none"
              >
                <X size={18} />
              </button>
            </div>

            {errorMsg && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 text-[#FF2E63] text-xs rounded-xl font-medium">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleAddCustomer} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-500 flex items-center justify-between">
                  <span>Kode Customer (Auto-Generated)</span>
                  <Lock size={12} className="text-slate-400" />
                </label>
                <input
                  type="text"
                  disabled
                  value={formData.kode}
                  className="w-full mt-1 px-3 py-2 text-xs bg-slate-100 border border-slate-200 rounded-xl text-slate-500 font-mono font-bold cursor-not-allowed"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-500">
                  Nama Perusahaan / Client *
                </label>
                <input
                  required
                  type="text"
                  placeholder="Contoh: PT Maju Bersama Digital"
                  value={formData.nama}
                  onChange={handleNamaChange}
                  className="w-full mt-1 px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-[#08D9D6]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-500">
                    Email *
                  </label>
                  <input
                    required
                    type="email"
                    placeholder="contact@majubersama.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full mt-1 px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-[#08D9D6]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-500">
                    No Telepon (Angka) *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="08123456789"
                    value={formData.telepon}
                    onChange={handleTeleponChange}
                    className="w-full mt-1 px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-[#08D9D6]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-500">
                  Alamat Kantor
                </label>
                <textarea
                  rows="2"
                  placeholder="Jl. Raya Darmo No. 45, Surabaya"
                  value={formData.alamat}
                  onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                  className="w-full mt-1 px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-[#08D9D6] resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-xs font-bold text-[#252A34] bg-[#08D9D6] hover:bg-[#06b6b3] rounded-xl shadow-sm cursor-pointer disabled:opacity-50 active:scale-95"
                >
                  {submitting ? "Menyimpan..." : "Simpan Customer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}