"use client";

import { useState, useEffect, useMemo } from "react";
import MobileCardTable from "@/components/MobileCardTable";
import StatusBadge from "@/components/StatusBadge";
import SearchFilterBar from "@/components/SearchFilterBar";
import AuthGuard from "@/components/AuthGuard";
import ConfirmationModal from "@/components/ConfirmationModal";
import { getDeals, setDeals } from "@/lib/storage";
import { formatPrice, formatDate } from "@/lib/utils";
import { addToast } from "@/lib/store";
import type { Deal } from "@/lib/types";

export default function AdminDealsPage() {
  const [deals, setDealsState] = useState<Deal[]>([]);
  const [search, setSearch] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [deleteModal, setDeleteModal] = useState<string | null>(null);
  const [editDeal, setEditDeal] = useState<Deal | null>(null);
  const [showForm, setShowForm] = useState(false);

  const emptyDeal: Deal = {
    id: "", title: "", platform: "Amazon", category: "Electronics",
    originalPrice: 0, dealPrice: 0, cashbackAmount: 0, effectivePrice: 0,
    status: "active", createdAt: new Date().toISOString(),
  };

  const [form, setForm] = useState<Deal>(emptyDeal);

  useEffect(() => {
    if (!loaded) {
      setDealsState(getDeals());
      setLoaded(true);
    }
  }, [loaded]);

  const filtered = useMemo(() => {
    if (!search) return deals;
    const q = search.toLowerCase();
    return deals.filter((d) => d.title.toLowerCase().includes(q) || d.platform.toLowerCase().includes(q));
  }, [deals, search]);

  const openEdit = (deal: Deal) => {
    setForm({ ...deal });
    setEditDeal(deal);
    setShowForm(true);
  };

  const openNew = () => {
    setForm({ ...emptyDeal, id: `deal-${Date.now()}` });
    setEditDeal(null);
    setShowForm(true);
  };

  const saveDeal = () => {
    if (!form.title || !form.dealPrice) {
      addToast("error", "Title and deal price required");
      return;
    }
    form.effectivePrice = form.dealPrice - form.cashbackAmount;
    const all = getDeals();
    if (editDeal) {
      const idx = all.findIndex((d) => d.id === editDeal.id);
      if (idx !== -1) all[idx] = { ...form };
    } else {
      all.push({ ...form, createdAt: new Date().toISOString() });
    }
    setDeals(all);
    setDealsState(getDeals());
    setShowForm(false);
    setEditDeal(null);
    addToast("success", editDeal ? "Deal updated" : "Deal created");
  };

  const deleteDeal = () => {
    if (!deleteModal) return;
    const all = getDeals().filter((d) => d.id !== deleteModal);
    setDeals(all);
    setDealsState(getDeals());
    addToast("success", "Deal deleted");
    setDeleteModal(null);
  };

  const toggleStatus = (id: string) => {
    const all = getDeals();
    const idx = all.findIndex((d) => d.id === id);
    if (idx === -1) return;
    const current = all[idx].status;
    const next = current === "active" ? "expired" : current === "expired" ? "active" : "active";
    all[idx] = { ...all[idx], status: next as Deal["status"] };
    setDeals(all);
    setDealsState(getDeals());
    addToast("success", `Deal ${next}`);
  };

  const columns = [
    { key: "title", header: "Title", className: "max-w-[200px]", render: (r: Deal) => <span className="text-xs font-medium truncate block">{r.title}</span>, mobileCardHeader: (r: Deal) => <div className="flex items-center justify-between w-full"><span className="text-xs font-medium truncate block">{r.title}</span><StatusBadge status={r.status} /></div> },
    { key: "platform", header: "Platform" },
    { key: "dealPrice", header: "Deal Price", render: (r: Deal) => formatPrice(r.dealPrice) },
    { key: "cashbackAmount", header: "Cashback", render: (r: Deal) => formatPrice(r.cashbackAmount) },
    { key: "status", header: "Status", render: (r: Deal) => <StatusBadge status={r.status} /> },
    { key: "createdAt", header: "Created", render: (r: Deal) => <span className="text-xs text-slate-500">{formatDate(r.createdAt)}</span> },
    {
      key: "actions", header: "Actions", hideOnMobile: true, render: (r: Deal) => (
        <div className="flex gap-1">
          <button onClick={() => openEdit(r)} className="px-2 py-1 text-[10px] font-medium bg-white border border-slate-300 text-slate-600 rounded hover:bg-slate-50">Edit</button>
          <button onClick={() => toggleStatus(r.id)} className="px-2 py-1 text-[10px] font-medium bg-white border border-slate-300 text-slate-600 rounded hover:bg-slate-50">Toggle</button>
          <button onClick={() => setDeleteModal(r.id)} className="px-2 py-1 text-[10px] font-medium bg-red-50 border border-red-200 text-red-600 rounded hover:bg-red-100">Delete</button>
        </div>
      ),
      mobileCardFooter: (r: Deal) => (
        <div className="flex gap-1">
          <button onClick={() => openEdit(r)} className="px-2 py-1 text-[10px] font-medium bg-white border border-slate-300 text-slate-600 rounded hover:bg-slate-50">Edit</button>
          <button onClick={() => toggleStatus(r.id)} className="px-2 py-1 text-[10px] font-medium bg-white border border-slate-300 text-slate-600 rounded hover:bg-slate-50">Toggle</button>
          <button onClick={() => setDeleteModal(r.id)} className="px-2 py-1 text-[10px] font-medium bg-red-50 border border-red-200 text-red-600 rounded hover:bg-red-100">Delete</button>
        </div>
      ),
    },
  ];

  return (
    <AuthGuard role="admin" fallback="/admin/login">
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Manage Deals</h1>
            <p className="text-sm text-slate-500 mt-1">Add, edit, or remove deals</p>
          </div>
          <button onClick={openNew} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
            + New Deal
          </button>
        </div>

        <div className="mb-4">
          <SearchFilterBar searchPlaceholder="Search deals..." searchValue={search} onSearchChange={setSearch} />
        </div>

        {showForm && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm mb-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">{editDeal ? "Edit Deal" : "New Deal"}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-3">
                <label className="block text-xs font-medium text-slate-700 mb-1">Title</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Platform</label>
                <select value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white">
                  {["Amazon", "Flipkart", "Myntra", "Other"].map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white">
                  {["Electronics", "Fashion", "Audio", "Appliances", "Other"].map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Status</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Deal["status"] })} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white">
                  {["active", "closing_soon", "expired"].map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Original Price</label>
                <input type="number" value={form.originalPrice || ""} onChange={(e) => setForm({ ...form, originalPrice: Number(e.target.value) })} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Deal Price</label>
                <input type="number" value={form.dealPrice || ""} onChange={(e) => setForm({ ...form, dealPrice: Number(e.target.value) })} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Cashback</label>
                <input type="number" value={form.cashbackAmount || ""} onChange={(e) => setForm({ ...form, cashbackAmount: Number(e.target.value) })} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg" />
              </div>
            </div>
            <div className="flex gap-3 mt-4 justify-end">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">Cancel</button>
              <button onClick={saveDeal} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">{editDeal ? "Update" : "Create"}</button>
            </div>
          </div>
        )}

        <MobileCardTable columns={columns} data={filtered} keyExtractor={(r) => r.id} emptyMessage="No deals found." />

        <ConfirmationModal open={deleteModal !== null} title="Delete Deal" message="Are you sure you want to delete this deal?" onConfirm={deleteDeal} onCancel={() => setDeleteModal(null)} variant="danger" />
      </div>
    </AuthGuard>
  );
}
