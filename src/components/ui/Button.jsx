import React from "react";

const variantStyles = {
    primary: "bg-erp-teal hover:bg-erp-teal-dark text-white shadow-sm",
    secondary:
        "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200",
    ghost: "hover:bg-slate-100 text-slate-600",
};

export default function Button({
    children,
    variant = "primary",
    className = "",
    ...props
}) {
    const baseStyle =
        "inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-150 active:scale-95 disabled:opacity-50";
    const selectedVariant = variantStyles[variant] || variantStyles.primary;

    return (
        <button
            className={`${baseStyle} ${selectedVariant} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
