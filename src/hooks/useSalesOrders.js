import { useState } from "react";

export function useSalesOrders() {
  const [orders, setOrders] = useState([
    {
      id: "SO-2026-008",
      customer: "PT Makmur Jaya",
      date: "04 Aug 2026",
      amount: 450000000,
      status: "Needs DO",
    },
    {
      id: "SO-2026-007",
      customer: "CV Sejahtera Bersama",
      date: "03 Aug 2026",
      amount: 125000000,
      status: "Needs Invoice",
    },
    {
      id: "SO-2026-006",
      customer: "PT Nusantara Sentosa",
      date: "01 Aug 2026",
      amount: 650000000,
      status: "Closed",
    },
    {
      id: "SO-2026-005",
      customer: "PT Abadi Metal",
      date: "28 Jul 2026",
      amount: 320000000,
      status: "SO Active",
    },
  ]);

  // Hitung otomatis metrics untuk Dashboard
  const totalRevenue = orders.reduce((sum, item) => sum + item.amount, 0);
  const totalOrders = orders.length;
  const pendingActions = orders.filter(
    (o) => o.status === "Needs DO" || o.status === "Needs Invoice",
  ).length;

  const addOrder = (newOrder) => {
    const entry = {
      id: `SO-2026-00${orders.length + 5}`,
      customer: newOrder.customer,
      date: "05 Aug 2026",
      amount: Number(newOrder.amount),
      status: newOrder.status,
    };
    setOrders([entry, ...orders]);
  };

  const updateOrderStatus = (orderId, nextStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: nextStatus } : order,
      ),
    );
  };

  return {
    orders,
    totalRevenue,
    totalOrders,
    pendingActions,
    addOrder,
    updateOrderStatus, // <-- Ekspor fungsi ini
  };
}
