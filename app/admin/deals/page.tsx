"use client";

import { useState, useEffect, useMemo } from "react";
import MobileCardTable from "@/components/MobileCardTable";
import StatusBadge from "@/components/StatusBadge";
import SearchFilterBar from "@/components/SearchFilterBar";
import AuthGuard from "@/components/AuthGuard";
import ConfirmationModal from "@/components/ConfirmationModal";
import { fetchAllDeals, createDeal, updateDeal, deleteDeal } from "@/lib/supabase/deals";
import { formatPrice, formatDate } from "@/lib/utils";
import { addToast } from "@/lib/store";

export default function AdminDealsPage() {
  const [deals, setDealsState] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [deleteModal, setDeleteModal] = useState<string | null>(null);
  const [editDeal, setEditDeal] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);

  const emptyDeal = { id: "", title: "", platform: "Amazon", category: "Electronics", original_price: 0, deal_price: 0, cashback_amount: 0, status: "active" };
  const [form, setForm] = useState<any>(emptyDeal);

  useEffect(() => {
    if (!loaded) {
      fetchAllDeals().then((res) => { setDealsState(res.deals); setLoaded(true); });
    }
  }, [loaded]);

  const filtered = useMemo(() => {
    if (!search) return deals;
    const q = search.toLowerCase();
    return deals.filter((d) => d.title?.toLowerCase().includes(q) || d.platform?.toLowerCase().includes(q));
  }, [deals, search]);

  const openEdit = (deal: any) => { setForm({ ...deal }); setEditDeal(deal); setShowForm(true); };
  const openNew = () => { setForm({ ...emptyDeal }); setEditDeal(null); setShowForm(true); };

  const saveDeal = async () => {
    if (!form.title || !form.deal_price) { addToast("error", "Title and deal price required"); return; }
    const data = { title: form.title, platform: form.platform, category: form.category, original_price: Number(form.original_price), deal_price: Number(form.deal_price), cashback_amount: Number(form.cashback_amount), status: form.status };
    let res;
    if (editDeal) res = await updateDeal(editDeal.id, data);
    else res = await createDeal(data);
    if (res.error) { addToast("error", res.error); return; }
    fetchAllDeals().then((r) => setDealsState(r.deals));
    setShowForm(false); setEditDeal(null);
    addToast("success", editDeal ? "Deal updated" : "Deal created");
  };

  const handleDelete = async () => {
    if (!deleteModal) return;
    const res = await deleteDeal(deleteModal);
    if (res.error) { addToast("error", res.error); return; }
    fetchAllDeals().then((r) => setDealsState(r.deals));
    addToast("success", "Deal deleted");
    setDeleteModal(null);
  };

  const columns = [
    { key: "title", header: "Title", className: "max-w-[200px]", render: (r: any) => <span className="text-xs font-medium truncate block">{r.title}</span>, mobileCardHeader: (r: any) => <div className="flex items-center justify-between w-full"><span className="text-xs font-medium truncate block">{r.title}</span><StatusBadge status={r.status} /></div> },
    { key: "platform", header: "Platform" },
    { key: "deal_price", header: "Deal Price", render: (r: any) => formatPrice(r.deal_price) },
    { key: "cashback_amount", header: "Cashback", render: (r: any) => formatPrice(r.cashback_amount) },
    { key: "status", header: "Status", render: (r: any) => <StatusBadge status={r.status} /> },
    { key: "created_at", header: "Created", render: (r: any) => <span className="text-xs text-slate-500">{formatDate(r.created_at)}</span> },
    { key: "actions", header: "Actions", hideOnMobile: true, render: (r: any) => (
      <div className="flex gap-1">
        <button onClick={() => openEdit(r)} className="px-2 py-1 text-[10px] font-medium bg-white border border-slate-300 text-slate-600 rounded hover:bg-slate-50">Edit</button>
        <button onClick={() => setDeleteModal(r.id)} className="px-2 py-1 text-[10px] font-medium bg-red-50 border border-red-200 text-red-600 rounded hover:bg-red-100">Delete</button>
      </div>
    ), mobileCardFooter: (r: any) => (
      <div className="flex gap-1">
        <button onClick={() => openEdit(r)} className="px-2 py-1 text-[10px] font-medium bg-white border border-slate-300 text-slate-600 rounded hover:bg-slate-50">Edit</button>
        <button onClick={() => setDeleteModal(r.id)} className="px-2 py-1 text-[10px] font-medium bg-red-50 border border-red-200 text-red-600 rounded hover:bg-red-100">Delete</button>
      </div>
    )},
  ];

  return (
    <AuthGuard role="admin" fallback="/admin/login">
      <div>
        <div className="flex items-center justify-between mb-6">
          <div><h1 className="text-xl font-bold text-slate-900">Manage Deals</h1><p className="text-sm text-slate-500 mt-1">Add, edit, or remove deals</p></div>
          <button onClick={openNew} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">+ New Deal</button>
        </div>
        <div className="mb-4"><SearchFilterBar searchPlaceholder="Search deals..." searchValue={search} onSearchChange={setSearch} /></div>
        {showForm && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm mb-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">{editDeal ? "Edit Deal" : "New Deal"}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-3">
                <label className="block text-xs font-medium text-slate-700 mb-1">Title</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg" />
              </div>
              <div><label className="block text-xs font-medium text-slate-700 mb-1">Platform</label>
                <select value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white">
                  {["Amazon", "Flipkart", "Myntra", "Other"].map((p) => <option key={p} value={p}>{p}</option>)}</select></div>
              <div><label className="block text-xs font-medium text-slate-700 mb-1">Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white">
                  {["Electronics", "Fashion", "Audio", "Appliances", "Other"].map((c) => <option key={c} value={c}>{c}</option>)}</select></div>
              <div><label className="block text-xs font-medium text-slate-700 mb-1">Status</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white">
                  {["active", "closing_soon", "expired", "draft"].map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}</select></div>
              <div><label className="block text-xs font-medium text-slate-700 mb-1">Original Price</label>
                <input type="number" value={form.original_price || ""} onChange={(e) => setForm({ ...form, original_price: Number(e.target.value) })} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg" /></div>
              <div><label className="block text-xs font-medium text-slate-700 mb-1">Deal Price</label>
                <input type="number" value={form.deal_price || ""} onChange={(e) => setForm({ ...form, deal_price: Number(e.target.value) })} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg" /></div>
              <div><label className="block text-xs font-medium text-slate-700 mb-1">Cashback</label>
                <input type="number" value={form.cashback_amount || ""} onChange={(e) => setForm({ ...form, cashback_amount: Number(e.target.value) })} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg" /></div>
            </div>
            <div className="flex gap-3 mt-4 justify-end">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">Cancel</button>
              <button onClick={saveDeal} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">{editDeal ? "Update" : "Create"}</button>
            </div>
          </div>
        )}
        <MobileCardTable columns={columns} data={filtered} keyExtractor={(r: any) => r.id} emptyMessage="No deals found." />
        <ConfirmationModal open={deleteModal !== null} title="Delete Deal" message="Are you sure you want to delete this deal?" onConfirm={handleDelete} onCancel={() => setDeleteModal(null)} variant="danger" />
      </div>
    </AuthGuard>
  );
}
