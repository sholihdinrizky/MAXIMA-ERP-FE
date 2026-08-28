import { useState, useEffect, useCallback } from "react";
import api from "../services/api";

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data produk dari Go Backend
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/products");
      if (res.data?.data) {
        // Normalisasi format agar kompatibel dengan UI
        const mapped = res.data.data.map((p) => ({
          id: p.sku || `PROD-${p.id}`,
          rawId: p.id,
          sku: p.sku,
          name: p.nama_produk,
          nama_produk: p.nama_produk,
          category: p.kategori || "Hardware",
          kategori: p.kategori || "Hardware",
          price: p.harga_jual,
          harga_jual: p.harga_jual,
          stock: p.stok,
          stok: p.stok,
          unit: "unit",
          description: p.deskripsi,
        }));
        setProducts(mapped);
      }
    } catch (err) {
      console.error("Gagal mengambil data produk:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Tambah produk ke PostgreSQL
  const addProduct = async (productData) => {
    try {
      await api.post("/products", {
        sku: productData.sku,
        nama_produk: productData.name || productData.nama_produk,
        kategori: productData.category || productData.kategori || "Hardware",
        harga_jual: parseFloat(productData.price || productData.harga_jual),
        stok: parseInt(productData.stock || productData.stok, 10),
        deskripsi: productData.description || "-",
      });
      await fetchProducts(); // Refresh data otomatis
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Gagal menambahkan produk";
      alert(msg);
      return { success: false, message: msg };
    }
  };

  return {
    products,
    loading,
    error,
    addProduct,
    refetchProducts: fetchProducts,
  };
}