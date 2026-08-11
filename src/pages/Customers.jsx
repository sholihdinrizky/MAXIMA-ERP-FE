import React, { useState, useMemo } from "react";
import Card from "../components/ui/Card";
import { Plus, Search } from "lucide-react";

// Deterministic Status Mapping Table (O(1) Memory Overhead)
const STATUS_STYLES = {
  Active: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
  Inactive: "bg-slate-100 text-slate-500 border-slate-200",
};

export default function Customers({ customers = [] }) {
  const [searchTerm, setSearchTerm] = useState("");

  // Memoized Filter (Prevents unnecessary array iterations during unrelated renders)
  const filteredCustomers = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();
    if (!query) return customers;

    return customers.filter(
      (item) =>
        item.name?.toLowerCase().includes(query) ||
        item.id?.toLowerCase().includes(query),
    );
  }, [customers, searchTerm]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#252A34] tracking-tight">
            Customer Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola database klien dan mitra bisnis
          </p>
        </div>
        <button className="flex items-center gap-2 bg-[#08D9D6] hover:bg-[#06b6b3] text-[#252A34] px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer active:scale-95">
          <Plus size={16} />
          Add Customer
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
            placeholder="Cari nama atau ID Customer..."
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
                <th className="pb-3">CUSTOMER ID</th>
                <th className="pb-3">COMPANY NAME</th>
                <th className="pb-3">EMAIL</th>
                <th className="pb-3">PHONE</th>
                <th className="pb-3">TOTAL ORDERS</th>
                <th className="pb-3">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((item) => {
                  const statusClass =
                    STATUS_STYLES[item.status] ||
                    "bg-slate-50 text-slate-600 border-slate-200";

                  return (
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
                      <td className="py-3 text-slate-500">{item.email}</td>
                      <td className="py-3 text-slate-500">{item.phone}</td>
                      <td className="py-3 font-bold text-[#252A34]">
                        {item.totalOrders} Orders
                      </td>
                      <td className="py-3">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusClass}`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="py-6 text-center text-slate-400">
                    Data customer tidak ditemukan.
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
