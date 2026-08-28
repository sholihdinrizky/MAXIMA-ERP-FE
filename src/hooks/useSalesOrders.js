import { useState, useEffect, useCallback, useMemo } from "react";
import api from "../services/api";

export function useSalesOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/sales-orders");
      if (res.data?.data) {
        const mapped = res.data.data.map((o) => ({
          id: o.nomor_so || `SO-${o.id}`,
          rawId: o.id,
          nomor_so: o.nomor_so,
          customer: o.customer?.nama || `Customer #${o.customer_id}`,
          customerId: o.customer_id,
          date: o.tanggal ? new Date(o.tanggal).toLocaleDateString("id-ID", { day: '2-digit', month: 'short', year: 'numeric' }) : "-",
          amount: parseFloat(o.total_harga || 0),
          total: parseFloat(o.total_harga || 0),
          status: o.status || "Needs DO",
          items: o.items || [],
        }));
        setOrders(mapped);
      }
    } catch (err) {
      console.error("Gagal load sales orders dari database:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const addOrder = async (orderPayload) => {
    try {
      await api.post("/sales-orders", {
        customer_id: parseInt(orderPayload.customerId, 10),
        items: (orderPayload.items || []).map((i) => ({
          product_id: parseInt(i.productId, 10),
          jumlah: parseInt(i.quantity, 10),
        })),
      });

      await fetchOrders(); // Ambil data baru langsung dari PostgreSQL
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Gagal membuat Sales Order";
      alert(msg);
      return { success: false, message: msg };
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const target = orders.find((o) => o.id === orderId || o.rawId === orderId);
      const idToSend = target?.rawId || orderId;
      await api.patch(`/sales-orders/${idToSend}/status`, { status: newStatus });
      await fetchOrders();
    } catch (err) {
      alert("Gagal update status pesanan");
    }
  };

  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, o) => sum + (Number(o.amount) || 0), 0);
  }, [orders]);

  const totalOrders = orders.length;

  const pendingActions = useMemo(() => {
    return orders.filter(
      (o) => o.status === "Draft" || o.status === "Confirmed" || o.status === "Needs DO" || o.status === "Needs Invoice"
    ).length;
  }, [orders]);

  return {
    orders,
    loading,
    totalRevenue,
    totalOrders,
    pendingActions,
    addOrder,
    updateOrderStatus,
    refetchOrders: fetchOrders,
  };
}