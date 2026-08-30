import React, { useState, useEffect, useCallback, useRef } from "react";
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
  const idleTimerRef = useRef(null);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = useCallback((isAuto = false) => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    if (isAuto) {
      alert("Sesi Anda telah berakhir karena tidak ada aktivitas selama 5 menit demi keamanan.");
    }
  }, []);

  // Inactivity Auto-Logout Tracker (5 Menit)
  useEffect(() => {
    if (!isLoggedIn) return;

    const INACTIVITY_LIMIT = 5 * 60 * 1000; // 5 Menit

    const resetTimer = () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => {
        handleLogout(true);
      }, INACTIVITY_LIMIT);
    };

    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    events.forEach((evt) => window.addEventListener(evt, resetTimer));

    resetTimer();

    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      events.forEach((evt) => window.removeEventListener(evt, resetTimer));
    };
  }, [isLoggedIn, handleLogout]);

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
    <div className="flex h-screen w-full bg-[#f8fafc] font-sans text-slate-800 overflow-hidden">
      <Sidebar
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        onLogout={() => handleLogout(false)}
      />

      <main
        className={`flex-1 p-6 flex flex-col ${
          activeMenu === "dashboard"
            ? "h-screen overflow-hidden justify-between"
            : "h-screen overflow-y-auto"
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
                <RevenueChart orders={orders} />
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