import { useState, useEffect, useCallback, useMemo } from "react";
import api from "../services/api";

export function useReports() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReportData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/sales-orders");
      setOrders(res.data?.data || []);
    } catch (err) {
      console.error("Gagal load data report:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReportData();
  }, [fetchReportData]);

  // Agregasi Data Finansial
  const summary = useMemo(() => {
    const totalSales = orders.reduce((sum, o) => sum + (parseFloat(o.total_harga) || 0), 0);
    const completedOrders = orders.filter((o) => o.status === "Closed");
    const settledRevenue = completedOrders.reduce((sum, o) => sum + (parseFloat(o.total_harga) || 0), 0);
    const pendingRevenue = totalSales - settledRevenue;

    return {
      totalSales,
      settledRevenue,
      pendingRevenue,
      totalTransactions: orders.length,
      completedTransactions: completedOrders.length,
    };
  }, [orders]);

  return {
    orders,
    summary,
    loading,
    refetchReports: fetchReportData,
  };
}