import React, { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Search,
  X,
  Lock,
  Pencil,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import api from "../services/api";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [formData, setFormData] = useState({
    sku: "",
    nama: "",
    kategori: "Hardware",
    harga: "",
    stok: "",
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

  const handleOpenAddModal = () => {
    setIsEditMode(false);
    setSelectedProductId(null);
    const nextNum = products.length + 1;
    const autoSku = `MAX-${String(nextNum).padStart(3, "0")}`;
    setFormData({
      sku: autoSku,
      nama: "",
      kategori: "Hardware",
      harga: "",
      stok: "",
    });
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    const pId = item.id || item.id_produk;
    setIsEditMode(true);
    setSelectedProductId(pId);
    setFormData({
      sku: item.sku || item.kode || `MAX-${String(pId || 0).padStart(3, "0")}`,
      nama: item.nama_produk || item.nama || "",
      kategori: item.kategori || "Hardware",
      harga:
        item.harga_jual !== undefined
          ? String(item.harga_jual)
          : item.harga !== undefined
          ? String(item.harga)
          : "",
      stok: item.stok !== undefined ? String(item.stok) : "",
    });
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!formData.nama.trim()) {
      setErrorMsg("Nama produk wajib diisi.");
      return;
    }

    const hargaNum = Number(formData.harga);
    const stokNum = Number(formData.stok);

    if (isNaN(hargaNum) || hargaNum <= 0) {
      setErrorMsg("Harga harus berupa angka valid lebih dari 0.");
      return;
    }

    if (isNaN(stokNum) || stokNum < 0) {
      setErrorMsg("Stok harus berupa angka valid minimal 0.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        sku: formData.sku,
        nama_produk: formData.nama.trim(),
        kategori: formData.kategori,
        harga_jual: hargaNum,
        stok: stokNum,
      };

      if (isEditMode) {
        await api.put(`/products/${selectedProductId}`, payload);
      } else {
        await api.post("/products", payload);
      }

      setIsModalOpen(false);
      await fetchProducts();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Gagal menyimpan data produk");
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;

    const pId =
      productToDelete.id ||
      productToDelete.id_produk ||
      productToDelete.ID ||
      productToDelete.sku;

    if (!pId) {
      alert("ID produk tidak valid atau tidak terbaca.");
      return;
    }

    setDeleting(true);
    try {
      await api.delete(`/products/${pId}`);
      setDeleteModalOpen(false);
      setProductToDelete(null);
      await fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal menghapus produk");
    } finally {
      setDeleting(false);
    }
  };

  const filteredProducts = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();
    if (!query) return products;

    return products.filter((p) => {
      const nama = (p.nama_produk || p.nama || "").toLowerCase();
      const sku = (p.sku || p.kode || "").toLowerCase();
      const kategori = (p.kategori || "").toLowerCase();
      return (
        nama.includes(query) || sku.includes(query) || kategori.includes(query)
      );
    });
  }, [products, searchTerm]);

  return (
    <div className="space-y-6">
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
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 bg-[#08D9D6] hover:bg-[#06b6b3] text-[#252A34] px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer active:scale-95"
        >
          <Plus size={16} />
          Add Product
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
            placeholder="Cari nama atau SKU produk..."
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
              <th className="pb-3">PRODUCT ID / SKU</th>
              <th className="pb-3">PRODUCT NAME</th>
              <th className="pb-3">CATEGORY</th>
              <th className="pb-3">UNIT PRICE</th>
              <th className="pb-3">STOCK</th>
              <th className="pb-3 text-right">AKSI</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {loading ? (
              <tr>
                <td colSpan="6" className="py-6 text-center text-slate-400">
                  Memuat data produk...
                </td>
              </tr>
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((item, idx) => {
                const pId = item.id || item.id_produk || idx + 1;
                const pSku =
                  item.sku ||
                  item.kode ||
                  `MAX-${String(pId).padStart(3, "0")}`;
                const pNama = item.nama_produk || item.nama || "-";
                const pKat = item.kategori || "General";
                const pHarga = Number(item.harga_jual ?? item.harga ?? 0);
                const pStok = item.stok ?? 0;

                return (
                  <tr
                    key={pId}
                    className="hover:bg-slate-50/80 transition-colors duration-150"
                  >
                    <td className="py-3 font-semibold text-[#252A34]">{pSku}</td>
                    <td className="py-3 font-medium text-slate-900">{pNama}</td>
                    <td className="py-3 text-slate-500">{pKat}</td>
                    <td className="py-3 font-semibold text-slate-900">
                      Rp {pHarga.toLocaleString("id-ID")}
                    </td>
                    <td className="py-3 text-slate-600">{pStok} unit</td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(item)}
                          title="Edit Produk"
                          className="p-1.5 text-slate-400 hover:text-[#06b6b3] hover:bg-slate-100 rounded-lg transition cursor-pointer"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setProductToDelete(item);
                            setDeleteModalOpen(true);
                          }}
                          title="Hapus Produk"
                          className="p-1.5 text-slate-400 hover:text-[#FF2E63] hover:bg-rose-50 rounded-lg transition cursor-pointer"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="py-6 text-center text-slate-400">
                  Belum ada produk di database.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Add / Edit Product */}
      {isModalOpen && (
        <div className="!fixed !top-0 !left-0 !right-0 !bottom-0 !w-screen !h-screen !m-0 !p-0 z-[999999] bg-slate-900/70 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-[#252A34]">
                {isEditMode ? "Edit Produk" : "Tambah Produk Baru"}
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

            <form onSubmit={handleSubmitProduct} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-500 flex items-center justify-between">
                  <span>SKU / Product ID (Auto-Generated)</span>
                  <Lock size={12} className="text-slate-400" />
                </label>
                <input
                  type="text"
                  disabled
                  value={formData.sku}
                  className="w-full mt-1 px-3 py-2 text-xs bg-slate-100 border border-slate-200 rounded-xl text-slate-500 font-mono font-bold cursor-not-allowed"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-500">
                  Nama Produk *
                </label>
                <input
                  required
                  type="text"
                  placeholder="Contoh: Server Rak 2U Enterprise"
                  value={formData.nama}
                  onChange={(e) =>
                    setFormData({ ...formData, nama: e.target.value })
                  }
                  className="w-full mt-1 px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-[#08D9D6]"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-500">
                  Kategori
                </label>
                <select
                  value={formData.kategori}
                  onChange={(e) =>
                    setFormData({ ...formData, kategori: e.target.value })
                  }
                  className="w-full mt-1 px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-[#08D9D6] bg-white"
                >
                  <option value="Hardware">Hardware</option>
                  <option value="Software">Software</option>
                  <option value="Service">Service</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-500">
                    Harga Satuan (Rp) *
                  </label>
                  <input
                    required
                    type="number"
                    min="0"
                    placeholder="25000000"
                    value={formData.harga}
                    onChange={(e) =>
                      setFormData({ ...formData, harga: e.target.value })
                    }
                    className="w-full mt-1 px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-[#08D9D6]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-500">
                    Stok Unit *
                  </label>
                  <input
                    required
                    type="number"
                    min="0"
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
                  className="px-4 py-2 text-xs font-bold text-[#252A34] bg-[#08D9D6] hover:bg-[#06b6b3] rounded-xl shadow-sm cursor-pointer disabled:opacity-50 active:scale-95"
                >
                  {submitting
                    ? "Menyimpan..."
                    : isEditMode
                    ? "Simpan Perubahan"
                    : "Simpan Produk"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Warning Delete */}
      {deleteModalOpen && (
        <div className="!fixed !top-0 !left-0 !right-0 !bottom-0 !w-screen !h-screen !m-0 !p-0 z-[999999] bg-slate-900/70 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl space-y-4 border border-rose-100">
            <div className="flex items-center gap-3 text-[#FF2E63]">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 flex items-center justify-center border border-rose-100">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#252A34]">
                  Hapus Produk Ini?
                </h3>
                <p className="text-[10px] text-slate-400">
                  Tindakan ini tidak dapat dibatalkan
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
              Apakah Anda yakin ingin menghapus{" "}
              <strong className="text-slate-800">
                {productToDelete?.nama_produk || productToDelete?.nama} (
                {productToDelete?.sku ||
                  `MAX-${String(
                    productToDelete?.id || productToDelete?.id_produk || 0
                  ).padStart(3, "0")}`}
                )
              </strong>{" "}
              dari database?
            </p>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                disabled={deleting}
                onClick={() => {
                  setDeleteModalOpen(false);
                  setProductToDelete(null);
                }}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-xs font-bold text-white bg-[#FF2E63] hover:bg-rose-600 rounded-xl shadow-sm cursor-pointer disabled:opacity-50 active:scale-95"
              >
                {deleting ? "Menghapus..." : "Ya, Hapus Produk"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}