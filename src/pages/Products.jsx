import React, { useState, useMemo } from "react";
import Card from "../components/ui/Card";
import { Plus, Search } from "lucide-react";

// Pure Formatter (O(1) Memory Overhead)
const CURRENCY_FORMATTER = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export default function Products({ products = [] }) {
  const [searchTerm, setSearchTerm] = useState("");

  // Memoized Filter (Prevents unnecessary iterations during unrelated re-renders)
  const filteredProducts = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();
    if (!query) return products;

    return products.filter(
      (item) =>
        item.name?.toLowerCase().includes(query) ||
        item.id?.toLowerCase().includes(query),
    );
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
        <button className="flex items-center gap-2 bg-[#08D9D6] hover:bg-[#06b6b3] text-[#252A34] px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer active:scale-95">
          <Plus size={16} />
          Add Product
        </button>
      </div>

      <Card className="flex items-center justify-between gap-4 py-3">
        <div className="relative flex-1 max-w-md">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Cari nama atau ID produk..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#08D9D6] focus:ring-1 focus:ring-[#08D9D6] transition-all"
          />
        </div>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold tracking-wide">
                <th className="pb-3">PRODUCT ID</th>
                <th className="pb-3">PRODUCT NAME</th>
                <th className="pb-3">CATEGORY</th>
                <th className="pb-3">UNIT PRICE</th>
                <th className="pb-3">STOCK</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/80 transition-colors duration-150"
                  >
                    <td className="py-3 font-semibold text-[#252A34]">
                      {item.id}
                    </td>
                    <td className="py-3 font-medium text-slate-900">
                      {item.name}
                    </td>
                    <td className="py-3 text-slate-500">{item.category}</td>
                    <td className="py-3 font-bold text-[#252A34]">
                      {CURRENCY_FORMATTER.format(item.price)}
                    </td>
                    <td className="py-3 font-semibold text-slate-700">
                      {item.stock} {item.unit}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-6 text-center text-slate-400">
                    Data produk tidak ditemukan.
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
