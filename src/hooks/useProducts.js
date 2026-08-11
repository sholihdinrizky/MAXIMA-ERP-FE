import { useState } from "react";

export function useProducts() {
    const [products, setProducts] = useState([
        {
            id: "PROD-001",
            name: "Semen Bag 50kg",
            category: "Material Utama",
            price: 65000,
            stock: 450,
            unit: "Sak",
        },
        {
            id: "PROD-002",
            name: "Besi Beton 10mm",
            category: "Besi & Baja",
            price: 82000,
            stock: 1200,
            unit: "Batang",
        },
        {
            id: "PROD-003",
            name: "Cat Tembok 20kg",
            category: "Finishing",
            price: 450000,
            stock: 85,
            unit: "Pail",
        },
    ]);

    return { products };
}
