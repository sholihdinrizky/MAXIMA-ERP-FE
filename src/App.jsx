import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import StatCard from "./components/StatCard";
import RevenueChart from "./components/RevenueChart";
import StatusDistributionChart from "./components/StatusDistributionChart";
import RecentOrders from "./components/RecentOrders";
import SalesOrder from "./pages/SalesOrders";
import Customers from "./pages/Customers";
import { useCustomers } from "./hooks/useCustomers";
import Products from "./pages/Products";
import { useProducts } from "./hooks/useProducts";
import Reports from "./pages/Report";
import { useReports } from "./hooks/useReport";
import { useSalesOrders } from "./hooks/useSalesOrders";
import {
  TrendingUp,
  ShoppingBag,
  AlertTriangle,
  Building2,
} from "lucide-react";

export default function App() {
  const [activeMenu, setActiveMenu] = useState("dashboard");

  // Ambil data dan fungsi update dari Pusat Data Utama
  const {
    orders,
    totalRevenue,
    totalOrders,
    pendingActions,
    addOrder,
    updateOrderStatus,
  } = useSalesOrders();

  const formattedRevenue = `Rp ${totalRevenue.toLocaleString("id-ID")}`;

  const { customers } = useCustomers();
  const { products } = useProducts();
  const { reports } = useReports();

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-800">
      <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />

      <main
        className={`flex-1 p-6 flex flex-col ${
          activeMenu === "dashboard"
            ? "h-screen overflow-hidden justify-between"
            : "overflow-y-auto"
        }`}
      >
        {activeMenu === "dashboard" && (
          <>
            <header className="mb-2">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Executive Dashboard
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                High-level performance across the sales cycle
              </p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Total Revenue"
                value={formattedRevenue}
                icon={TrendingUp}
                trend="+12.4%"
                badgeType="teal"
              />
              <StatCard
                title="Total Orders"
                value={`${totalOrders} Orders`}
                icon={ShoppingBag}
                badgeType="teal"
              />
              <StatCard
                title="Needs DO / Invoice"
                value={`${pendingActions} Orders`}
                icon={AlertTriangle}
                badgeText="Pending Action"
                badgeType="rose"
              />
              <StatCard
                title="Active Customers"
                value={`${customers?.length || 8} Companies`}
                icon={Building2}
                badgeType="teal"
              />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2">
                <RevenueChart />
              </div>
              <div>
                <StatusDistributionChart />
              </div>
            </div>

            <div>
              <RecentOrders orders={orders.slice(0, 3)} />
            </div>
          </>
        )}

        {/* Kirim data, handler addOrder, DAN updateOrderStatus ke SalesOrder */}
        {activeMenu === "sales" && (
          <SalesOrder
            orders={orders}
            onAddOrder={addOrder}
            onUpdateStatus={updateOrderStatus}
          />
        )}

        {activeMenu === "customer" && <Customers customers={customers} />}

        {activeMenu === "product" && <Products products={products} />}

        {(activeMenu === "reports" || activeMenu === "Reports") && (
          <Reports reports={reports} />
        )}
      </main>
    </div>
  );
}
