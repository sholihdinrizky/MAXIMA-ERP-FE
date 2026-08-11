import React, { useState } from "react";
import { X } from "lucide-react";

export default function OrderModal({ isOpen, onClose, onSubmit }) {
    const [formData, setFormData] = useState({
        customer: "",
        amount: "",
        status: "Needs DO",
    });

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        setFormData({ customer: "", amount: "", status: "Needs DO" });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl border border-slate-100">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-base font-bold text-slate-900">
                        Buat Sales Order Baru
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600"
                    >
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                            Nama Customer
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="Contoh: PT Surya Utama"
                            value={formData.customer}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    customer: e.target.value,
                                })
                            }
                            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                            Nilai Transaksi (Rp)
                        </label>
                        <input
                            type="number"
                            required
                            placeholder="Contoh: 250000000"
                            value={formData.amount}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    amount: e.target.value,
                                })
                            }
                            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                            Status Awal
                        </label>
                        <select
                            value={formData.status}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    status: e.target.value,
                                })
                            }
                            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
                        >
                            <option value="Needs DO">Needs DO</option>
                            <option value="Needs Invoice">Needs Invoice</option>
                            <option value="Closed">Closed</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-lg"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg"
                        >
                            Simpan Order
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
