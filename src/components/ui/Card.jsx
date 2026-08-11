import React from "react";

export default function Card({ children, className = "" }) {
    return (
        <div
            className={`bg-erp-card border border-erp-border rounded-2xl p-5 shadow-erp-card transition-shadow duration-200 hover:shadow-erp-hover ${className}`}
        >
            {children}
        </div>
    );
}
