import React, { useState } from "react";
import Login from "./pages/Login";
import Sidebar from "./components/Sidebar";
import StatCard from "./components/StatCard";
import RevenueChart from "./components/RevenueChart";
import StatusDistributionChart from "./components/StatusDistributionChart";
import RecentOrders from "./components/RecentOrders";
import SalesOrder from "./pages/SalesOrders";
import Customers from "./pages/Customers";
import { useCustomers } from "./hooks/useCustomers";
import Products from "./pages/Products";
import Reports from "./pages/Report";
import { useSalesOrders } from "./hooks/useSalesOrders";
import { TrendingUp, ShoppingBag, AlertTriangle, Building2 } from "lucide-react";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("token") !== null;
  });

  const [activeMenu, setActiveMenu] = useState("dashboard");

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
  };

  const {
    orders,
    totalRevenue,
    totalOrders,
    pendingActions,
    addOrder,
    updateOrderStatus,
  } = useSalesOrders();

  const { customers } = useCustomers();

  const formattedRevenue = `Rp ${totalRevenue.toLocaleString("id-ID")}`;

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-800">
      <Sidebar
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        onLogout={handleLogout}
      />

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
                trend="+100%"
                badgeType="teal"
              />
              <StatCard
                title="Total Orders"
                value={`${totalOrders} Orders`}
                icon={ShoppingBag}
                badgeType="teal"
              />
              <StatCard
                title="Needs Action"
                value={`${pendingActions} Orders`}
                icon={AlertTriangle}
                badgeText="Action Required"
                badgeType="rose"
              />
              <StatCard
                title="Active Customers"
                value={`${customers ? customers.length : 0} Companies`}
                icon={Building2}
                badgeType="teal"
              />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2">
                <RevenueChart orders={orders}/>
              </div>
              <div>
                <StatusDistributionChart orders={orders} />
              </div>
            </div>

            <div>
              <RecentOrders orders={orders.slice(0, 3)} />
            </div>
          </>
        )}

        {activeMenu === "customer" && <Customers />}
        {activeMenu === "product" && <Products />}
        {activeMenu === "sales" && (
          <SalesOrder
            orders={orders}
            onAddOrder={addOrder}
            onUpdateStatus={updateOrderStatus}
          />
        )}
        {activeMenu === "reports" && <Reports />}
      </main>
    </div>
  );
}