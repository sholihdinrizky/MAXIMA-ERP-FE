import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import api from "../../services/api";

const CURRENCY_FORMATTER = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export default function OrderModal({ isOpen, onClose, onSubmit }) {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // Load Customer & Product aktif untuk Dropdown
  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        try {
          const [resCust, resProd] = await Promise.all([
            api.get("/customers"),
            api.get("/products"),
          ]);
          setCustomers(resCust.data?.data || []);
          setProducts(resProd.data?.data || []);
        } catch (err) {
          console.error("Gagal load dropdown data:", err);
        }
      };
      fetchData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Hitung estimasi total secara real-time
  const currentProduct = products.find((p) => String(p.id) === String(selectedProduct));
  const estimatedTotal = currentProduct ? (currentProduct.harga_jual || 0) * quantity : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCustomer || !selectedProduct) {
      alert("Pilih Customer dan Produk terlebih dahulu!");
      return;
    }

    setSubmitting(true);
    const res = await onSubmit({
      customerId: selectedCustomer,
      items: [
        {
          productId: selectedProduct,
          quantity: quantity,
        },
      ],
    });
    setSubmitting(false);

    if (res?.success !== false) {
      setSelectedCustomer("");
      setSelectedProduct("");
      setQuantity(1);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 border border-slate-100">
        <div className="flex justify-between items-center">
          <h3 className="text-base font-bold text-[#252A34]">
            Buat Sales Order Baru
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Pilih Mitra / Customer
            </label>
            <select
              required
              value={selectedCustomer}
              onChange={(e) => setSelectedCustomer(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#08D9D6] focus:ring-1 focus:ring-[#08D9D6]"
            >
              <option value="">-- Pilih Customer --</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.kode} - {c.nama}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Pilih Item Produk
            </label>
            <select
              required
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#08D9D6] focus:ring-1 focus:ring-[#08D9D6]"
            >
              <option value="">-- Pilih Produk --</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.sku} - {p.nama_produk} (Sisa Stok: {p.stok})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Jumlah Pesanan (Qty)
            </label>
            <input
              type="number"
              min="1"
              max={currentProduct?.stok || 9999}
              required
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#08D9D6] focus:ring-1 focus:ring-[#08D9D6]"
            />
          </div>

          {currentProduct && (
            <div className="p-3 bg-slate-50 rounded-xl flex justify-between items-center text-xs">
              <span className="text-slate-500">Estimasi Total:</span>
              <span className="font-bold text-[#252A34]">
                {CURRENCY_FORMATTER.format(estimatedTotal)}
              </span>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-xl cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-xs font-bold text-[#252A34] bg-[#08D9D6] hover:bg-[#06b6b3] rounded-xl shadow-sm cursor-pointer disabled:opacity-50"
            >
              {submitting ? "Memproses..." : "Konfirmasi Order"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}