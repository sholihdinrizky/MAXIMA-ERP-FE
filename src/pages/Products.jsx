import React, { useState, useEffect, useMemo } from "react";
import { Plus, Search, X } from "lucide-react";
import api from "../services/api";

const CURRENCY_FORMATTER = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export default function Products() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    sku: "",
    nama_produk: "",
    kategori: "Hardware",
    harga_jual: "",
    stok: "",
    deskripsi: "-",
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/products");
      if (res.data?.data) {
        setProducts(res.data.data);
      }
    } catch (err) {
      console.error("Gagal load produk:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/products", {
        sku: formData.sku,
        nama_produk: formData.nama_produk,
        kategori: formData.kategori,
        harga_jual: parseFloat(formData.harga_jual),
        stok: parseInt(formData.stok, 10),
        deskripsi: formData.deskripsi || "-",
      });

      setIsModalOpen(false);
      setFormData({
        sku: "",
        nama_produk: "",
        kategori: "Hardware",
        harga_jual: "",
        stok: "",
        deskripsi: "-",
      });
      await fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal menambahkan produk");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredProducts = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();
    if (!query) return products;

    return products.filter(
      (item) =>
        item.nama_produk?.toLowerCase().includes(query) ||
        item.sku?.toLowerCase().includes(query) ||
        item.kategori?.toLowerCase().includes(query)
    );
  }, [products, searchTerm]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#252A34] tracking-tight">
            Product Catalog
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola daftar produk dan stok inventaris
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            console.log("Button clicked!");
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-[#08D9D6] hover:bg-[#06b6b3] text-[#252A34] px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer active:scale-95"
        >
          <Plus size={16} />
          Add Product
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Cari nama atau SKU produk..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#08D9D6] focus:ring-1 focus:ring-[#08D9D6] transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 font-semibold tracking-wide">
              <th className="pb-3">PRODUCT ID / SKU</th>
              <th className="pb-3">PRODUCT NAME</th>
              <th className="pb-3">CATEGORY</th>
              <th className="pb-3">UNIT PRICE</th>
              <th className="pb-3">STOCK</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {loading ? (
              <tr>
                <td colSpan="5" className="py-6 text-center text-slate-400">
                  Memuat data dari PostgreSQL...
                </td>
              </tr>
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50/80 transition-colors duration-150"
                >
                  <td className="py-3 font-semibold text-[#252A34]">{item.sku}</td>
                  <td className="py-3 font-medium text-slate-900">{item.nama_produk}</td>
                  <td className="py-3 text-slate-500">{item.kategori || "Hardware"}</td>
                  <td className="py-3 font-bold text-[#252A34]">
                    {CURRENCY_FORMATTER.format(item.harga_jual || 0)}
                  </td>
                  <td className="py-3 font-semibold text-slate-700">
                    {item.stok} unit
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-6 text-center text-slate-400">
                  Belum ada produk di database PostgreSQL.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Add Product (Native Fixed Overlay) */}
      {isModalOpen && (
        <div
          style={{ backgroundColor: "rgba(0,0,0,0.6)", zIndex: 9999 }}
          className="fixed inset-0 flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 border border-slate-100 relative">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-[#252A34]">
                Tambah Produk Baru
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-500">
                  SKU
                </label>
                <input
                  required
                  type="text"
                  placeholder="MAX-001"
                  value={formData.sku}
                  onChange={(e) =>
                    setFormData({ ...formData, sku: e.target.value })
                  }
                  className="w-full mt-1 px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-[#08D9D6]"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-500">
                  Nama Produk
                </label>
                <input
                  required
                  type="text"
                  placeholder="Server Rak 2U Enterprise"
                  value={formData.nama_produk}
                  onChange={(e) =>
                    setFormData({ ...formData, nama_produk: e.target.value })
                  }
                  className="w-full mt-1 px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-[#08D9D6]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-500">
                    Harga Satuan (Rp)
                  </label>
                  <input
                    required
                    type="number"
                    placeholder="25000000"
                    value={formData.harga_jual}
                    onChange={(e) =>
                      setFormData({ ...formData, harga_jual: e.target.value })
                    }
                    className="w-full mt-1 px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-[#08D9D6]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-500">
                    Stok
                  </label>
                  <input
                    required
                    type="number"
                    placeholder="10"
                    value={formData.stok}
                    onChange={(e) =>
                      setFormData({ ...formData, stok: e.target.value })
                    }
                    className="w-full mt-1 px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-[#08D9D6]"
                  />
                </div>
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
                  className="px-4 py-2 text-xs font-bold text-[#252A34] bg-[#08D9D6] hover:bg-[#06b6b3] rounded-xl shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {submitting ? "Menyimpan..." : "Simpan Produk"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}