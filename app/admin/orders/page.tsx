"use client";

import { useState, useEffect, useMemo } from "react";
import MobileCardTable from "@/components/MobileCardTable";
import StatusBadge from "@/components/StatusBadge";
import SearchFilterBar from "@/components/SearchFilterBar";
import AuthGuard from "@/components/AuthGuard";
import ConfirmationModal from "@/components/ConfirmationModal";
import { fetchOrders, updateOrderStatus, assignMediatorToOrder } from "@/lib/supabase/orders";
import { fetchAllProfiles } from "@/lib/supabase/profiles";
import { formatPrice, formatDate } from "@/lib/utils";
import { addToast } from "@/lib/store";

const flow = ["submitted", "under_review", "approved", "rejected", "refund_processing", "completed"];

export default function AdminOrdersPage() {
  const [orders, setOrdersState] = useState<any[]>([]);
  const [users, setUsersState] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loaded, setLoaded] = useState(false);
  const [assignModal, setAssignModal] = useState<string | null>(null);
  const [assignMediatorId, setAssignMediatorId] = useState("");

  useEffect(() => {
    if (!loaded) {
      Promise.all([fetchOrders(), fetchAllProfiles()]).then(([o, u]) => {
        setOrdersState(o.orders);
        setUsersState(u.profiles);
        setLoaded(true);
      });
    }
  }, [loaded]);

  const mediators = useMemo(() => users.filter((u: any) => u.role === "mediator"), [users]);

  const filtered = useMemo(() => {
    let result = orders;
    if (statusFilter !== "all") result = result.filter((o) => o.status === statusFilter);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((o) => o.tracking_id?.toLowerCase().includes(q) || o.buyer_name?.toLowerCase().includes(q) || o.order_number?.toLowerCase().includes(q));
    }
    return result;
  }, [orders, search, statusFilter]);

  const handleStatusUpdate = async (id: string, status: string) => {
    const res = await updateOrderStatus(id, status);
    if (res.error) { addToast("error", res.error); return; }
    const result = await fetchOrders();
    setOrdersState(result.orders);
    addToast("success", `Order ${status.replace("_", " ")}`);
  };

  const handleAssign = async () => {
    if (!assignModal || !assignMediatorId) return;
    const res = await assignMediatorToOrder(assignModal, assignMediatorId);
    if (res.error) { addToast("error", res.error); return; }
    const result = await fetchOrders();
    setOrdersState(result.orders);
    setAssignModal(null);
    addToast("success", "Mediator assigned");
  };

  const columns = [
    { key: "tracking_id", header: "Tracking ID", render: (r: any) => <span className="font-mono text-xs font-medium text-blue-600">{r.tracking_id}</span> },
    { key: "buyer_name", header: "Buyer" },
    { key: "order_number", header: "Order ID", render: (r: any) => <span className="font-mono text-xs">{r.order_number}</span> },
    { key: "amount", header: "Amount", render: (r: any) => formatPrice(r.amount) },
    { key: "status", header: "Status", render: (r: any) => <StatusBadge status={r.status} /> },
    { key: "assigned_mediator_id", header: "Mediator", render: (r: any) => {
      const m = mediators.find((u: any) => u.id === r.assigned_mediator_id);
      return <span className="text-xs text-slate-500">{m?.full_name || "Unassigned"}</span>;
    } },
    { key: "created_at", header: "Date", render: (r: any) => <span className="text-xs text-slate-500">{formatDate(r.created_at)}</span> },
    { key: "actions", header: "Actions", hideOnMobile: true, render: (r: any) => (
      <div className="flex gap-1 flex-wrap">
        {flow.indexOf(r.status) < flow.length - 1 && (
          <button onClick={() => handleStatusUpdate(r.id, flow[flow.indexOf(r.status) + 1])}
            className="px-2 py-1 text-[10px] font-medium bg-emerald-50 border border-emerald-200 text-emerald-700 rounded hover:bg-emerald-100">Advance</button>
        )}
        <button onClick={() => { setAssignModal(r.id); setAssignMediatorId(""); }}
          className="px-2 py-1 text-[10px] font-medium bg-blue-50 border border-blue-200 text-blue-700 rounded hover:bg-blue-100">Assign</button>
      </div>
    ), mobileCardFooter: (r: any) => (
      <div className="flex gap-1 flex-wrap">
        {flow.indexOf(r.status) < flow.length - 1 && (
          <button onClick={() => handleStatusUpdate(r.id, flow[flow.indexOf(r.status) + 1])}
            className="px-2 py-1 text-[10px] font-medium bg-emerald-50 border border-emerald-200 text-emerald-700 rounded hover:bg-emerald-100">Advance</button>
        )}
        <button onClick={() => { setAssignModal(r.id); setAssignMediatorId(""); }}
          className="px-2 py-1 text-[10px] font-medium bg-blue-50 border border-blue-200 text-blue-700 rounded hover:bg-blue-100">Assign</button>
      </div>
    )},
  ];

  return (
    <AuthGuard role="admin" fallback="/admin/login">
      <div>
        <div className="flex items-center justify-between mb-6">
          <div><h1 className="text-xl font-bold text-slate-900">All Orders</h1><p className="text-sm text-slate-500 mt-1">Manage and assign orders</p></div>
        </div>
        <div className="mb-4 flex flex-wrap gap-2">
          <SearchFilterBar searchPlaceholder="Search orders..." searchValue={search} onSearchChange={setSearch} />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 bg-white text-slate-600">
            <option value="all">All Status</option>
            {flow.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
          </select>
        </div>
        <MobileCardTable columns={columns} data={filtered} keyExtractor={(r: any) => r.id} emptyMessage="No orders found."
          mobileCardHeader={(r: any) => <div className="flex items-center justify-between w-full"><span className="font-mono text-xs font-medium text-blue-600">{r.tracking_id}</span><StatusBadge status={r.status} /></div>} />
        <ConfirmationModal open={assignModal !== null} title="Assign Mediator" message="Select a mediator to assign this order."
          confirmLabel="Assign" onConfirm={handleAssign} onCancel={() => setAssignModal(null)}>
          <select value={assignMediatorId} onChange={(e) => setAssignMediatorId(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg mt-3 bg-white">
            <option value="">Select mediator</option>
            {mediators.map((m: any) => <option key={m.id} value={m.id}>{m.full_name} ({m.email})</option>)}
          </select>
        </ConfirmationModal>
      </div>
    </AuthGuard>
  );
}
