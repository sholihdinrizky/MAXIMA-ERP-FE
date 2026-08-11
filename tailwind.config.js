/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                sans: ['"Plus Jakarta Sans"', "sans-serif"],
            },
            fontSize: {
                micro: ["10px", "14px"],
                caption: ["11px", "16px"],
                xs: ["12px", "18px"],
                sm: ["14px", "20px"],
                base: ["16px", "24px"],
                lg: ["18px", "28px"],
                xl: ["20px", "28px"],
                "2xl": ["24px", "32px"],
            },
            colors: {
                erp: {
                    sidebar: "#1e222d",
                    "sidebar-active": "#2a2f3d",
                    "sidebar-hover": "#252a37",
                    bg: "#f8fafc",
                    card: "#ffffff",
                    border: "#e2e8f0",
                    muted: "#64748b",
                    teal: {
                        DEFAULT: "#0d9488",
                        light: "#ccfbf1",
                        dark: "#0f766e",
                    },
                    // Status Siklus Sales Order (Presisi UI ERP)
                    status: {
                        so: "#0d9488", // Teal
                        do: "#d97706", // Amber
                        invoice: "#2563eb", // Blue
                        closed: "#e11d48", // Rose
                    },
                },
            },
            boxShadow: {
                "erp-card":
                    "0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px 0 rgba(0, 0, 0, 0.02)",
                "erp-hover": "0 4px 12px -2px rgba(0, 0, 0, 0.08)",
            },
        },
    },
    plugins: [],
};
