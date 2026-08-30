import React, { useState, useEffect, useMemo } from "react";
import { Plus } from "lucide-react";
import api from "../services/api";
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
  const [customersList, setCustomersList] = useState([]);

  // Ambil data customer lengkap dari database untuk melengkapi profil di Drawer
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await api.get("/customers");
        if (res.data?.data) {
          setCustomersList(res.data.data);
        }
      } catch (err) {
        console.error("Gagal load customer list:", err);
      }
    };
    fetchCustomers();
  }, []);

  // Gabungkan info telepon & alamat customer ke dalam data order
  const enrichedOrders = useMemo(() => {
    return orders.map((item) => {
      // Cari customer yang cocok berdasarkan id, customer_id, atau nama
      const matchedCustomer = customersList.find(
        (c) =>
          c.id === item.customer_id ||
          c.id === item.customer?.id ||
          c.nama?.toLowerCase() === (item.customer?.nama || item.customer || "").toLowerCase()
      );

      const customerObj = {
        nama:
          matchedCustomer?.nama ||
          item.customer?.nama ||
          (typeof item.customer === "string" ? item.customer : "Customer"),
        telepon:
          matchedCustomer?.telepon ||
          item.customer?.telepon ||
          "-",
        alamat:
          matchedCustomer?.alamat ||
          item.customer?.alamat ||
          "-",
      };

      return {
        ...item,
        customer: customerObj,
      };
    });
  }, [orders, customersList]);

  // Safe filter untuk search bar
  const filteredOrders = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();
    if (!query) return enrichedOrders;

    return enrichedOrders.filter((item) => {
      const custName = item.customer?.nama || "";
      const orderNo = item.nomor_so || item.id || "";
      return (
        custName.toLowerCase().includes(query) ||
        orderNo.toLowerCase().includes(query)
      );
    });
  }, [enrichedOrders, searchTerm]);

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