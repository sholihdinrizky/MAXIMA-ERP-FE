import React from "react";

const variantClasses = {
    so: "bg-teal-50 text-erp-status-so border-teal-200",
    do: "bg-amber-50 text-erp-status-do border-amber-200",
    invoice: "bg-blue-50 text-erp-status-invoice border-blue-200",
    closed: "bg-rose-50 text-erp-status-closed border-rose-200",
    default: "bg-slate-100 text-slate-600 border-slate-200",
};

export default function Badge({ children, variant = "default" }) {
    const selectedVariant =
        variantClasses[variant.toLowerCase()] || variantClasses.default;

    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-caption font-semibold border ${selectedVariant}`}
        >
            {children}
        </span>
    );
}
