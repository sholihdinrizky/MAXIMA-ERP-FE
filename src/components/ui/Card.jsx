import React from "react";

export default function Card({ children, className = "" }) {
  return (
    <div className={`bg-white rounded-2xl p-5 shadow-sm border border-slate-100 ${className}`}>
      {children}
    </div>
  );
}
