import React, { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import OrderSearch from "../components/sales/OrderSearch";
import OrderTable from "../components/sales/OrderTable";
import OrderModal from "../components/sales/OrderModal";

export default function SalesOrders({
  orders = [],
  onAddOrder,
  onUpdateStatus,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Safe filter untuk data dari backend maupun hook
  const filteredOrders = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();
    if (!query) return orders;

    return orders.filter((item) => {
      const custName = item.customer?.nama || item.customer || "";
      const orderNo = item.nomor_so || item.id || "";
      return (
        custName.toLowerCase().includes(query) ||
        orderNo.toLowerCase().includes(query)
      );
    });
  }, [orders, searchTerm]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Sales Orders
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola dan pantau seluruh alur transaksi pesanan
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#08D9D6] hover:bg-[#06b6b3] text-[#252A34] px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer active:scale-95"
        >
          <Plus size={16} />
          Create New Order
        </button>
      </div>

      <OrderSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <OrderTable
        orders={filteredOrders}
        onUpdateStatus={onUpdateStatus}
      />

      <OrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={onAddOrder}
      />
    </div>
  );
}