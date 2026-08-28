import React from "react";
import Card from "../ui/Card";
import { Search } from "lucide-react";

export default function OrderSearch({ searchTerm, setSearchTerm }) {
    return (
        <Card className="flex items-center justify-between gap-4 py-3">
            <div className="relative flex-1 max-w-md">
                <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                    type="text"
                    placeholder="Cari ID Order atau nama customer..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
                />
            </div>
        </Card>
    );
}
