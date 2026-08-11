import React, { useState } from "react";
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

  const filteredOrders = orders.filter(
    (item) =>
      item.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase()),
  );

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
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer"
        >
          <Plus size={16} />
          Create New Order
        </button>
      </div>
      <OrderSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <OrderTable
        orders={filteredOrders}
        onUpdateStat
        us={onUpdateStatus}
      />{" "}
      <OrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={onAddOrder}
      />
    </div>
  );
}
