import { useState } from "react";

export function useCustomers() {
    const [customers, setCustomers] = useState([
        {
            id: "CUST-001",
            name: "PT Makmur Jaya",
            phone: "081234567890",
            email: "contact@makmurjaya.com",
            totalOrders: 12,
            status: "Active",
        },
        {
            id: "CUST-002",
            name: "CV Sejahtera Bersama",
            phone: "082198765432",
            email: "info@sejahtera.co.id",
            totalOrders: 5,
            status: "Active",
        },
        {
            id: "CUST-003",
            name: "PT Nusantara Sentosa",
            phone: "085711223344",
            email: "admin@nusantara.com",
            totalOrders: 8,
            status: "Inactive",
        },
    ]);

    return { customers };
}
