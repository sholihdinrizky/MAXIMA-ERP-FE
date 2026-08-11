import { useState } from "react";

export function useReports() {
    const [reports] = useState([
        {
            id: "REP-2026-08",
            title: "Laporan Penjualan Agustus 2026",
            type: "Sales",
            date: "05 Aug 2026",
            totalAmount: "Rp 1.225.000.000",
            status: "Ready",
        },
        {
            id: "REP-2026-07",
            title: "Laporan Penjualan Juli 2026",
            type: "Sales",
            date: "31 Jul 2026",
            totalAmount: "Rp 1.779.500.000",
            status: "Ready",
        },
        {
            id: "REP-INV-001",
            title: "Laporan Stok & Inventaris Produk",
            type: "Inventory",
            date: "01 Aug 2026",
            totalAmount: "1.735 Items",
            status: "Ready",
        },
    ]);

    return { reports };
}
