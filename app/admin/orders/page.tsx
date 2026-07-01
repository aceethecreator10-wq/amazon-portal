"use client";

import { useState, useEffect, useMemo } from "react";
import MobileCardTable from "@/components/MobileCardTable";
import StatusBadge from "@/components/StatusBadge";
import SearchFilterBar from "@/components/SearchFilterBar";
import AuthGuard from "@/components/AuthGuard";
import ConfirmationModal from "@/components/ConfirmationModal";
import { getOrders, getUsers, setOrders } from "@/lib/storage";
import { formatPrice, formatDate } from "@/lib/utils";
import { addToast } from "@/lib/store";
import type { Order, User } from "@/lib/types";

const flow = ["submitted", "under_review", "approved", "rejected", "processing", "completed"];

export default function AdminOrdersPage() {
  const [orders, setOrdersState] = useState<Order[]>([]);
  const [users, setUsersState] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loaded, setLoaded] = useState(false);

  const [modal, setModal] = useState<{ id: string; status: string } | null>(null);
  const [assignModal, setAssignModal] = useState<{ id: string } | null>(null);
  const [selectedMediator, setSelectedMediator] = useState("");

  useEffect(() => {
    if (!loaded) {
      setOrdersState(getOrders());
      setUsersState(getUsers());
      setLoaded(true);
    }
  }, [loaded]);

  const mediators = useMemo(() => users.filter((u) => u.role === "mediator"), [users]);

  const filtered = useMemo(() => {
    let result = orders;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((o) => o.trackingId.toLowerCase().includes(q) || o.buyerName.toLowerCase().includes(q) || o.platform.toLowerCase().includes(q));
    }
    if (statusFilter !== "all") result = result.filter((o) => o.status === statusFilter);
    return result;
  }, [orders, search, statusFilter]);

  const updateStatus = (id: string, status: string) => {
    const all = getOrders();
    const idx = all.findIndex((o) => o.id === id);
    if (idx === -1) return;
    all[idx] = {
      ...all[idx],
      status: status as Order["status"],
      statusLogs: [...all[idx].statusLogs, { id: `log-${Date.now()}`, status, note: "Updated by admin", changedBy: "Admin", createdAt: new Date().toISOString() }],
      updatedAt: new Date().toISOString(),
    };
    setOrders(all);
    setOrdersState(getOrders());
    addToast("success", `Order ${status.replace("_", " ")}`);
    setModal(null);
  };

  const assignMediator = (orderId: string) => {
    if (!selectedMediator) return;
    const all = getOrders();
    const idx = all.findIndex((o) => o.id === orderId);
    if (idx === -1) return;
    all[idx] = { ...all[idx], assignedMediatorId: selectedMediator, updatedAt: new Date().toISOString() };
    setOrders(all);
    setOrdersState(getOrders());
    addToast("success", "Order assigned to mediator");
    setAssignModal(null);
    setSelectedMediator("");
  };

  const columns = [
    { key: "trackingId", header: "Tracking ID", render: (r: Order) => <span className="font-mono text-xs font-medium text-blue-600">{r.trackingId}</span>, mobileCardHeader: (r: Order) => <div className="flex items-center justify-between w-full"><span className="font-mono text-xs font-medium text-blue-600">{r.trackingId}</span><StatusBadge status={r.status} /></div> },
    { key: "buyerName", header: "Buyer" },
    { key: "platform", header: "Platform" },
    { key: "amount", header: "Amount", render: (r: Order) => formatPrice(r.amount) },
    { key: "status", header: "Status", render: (r: Order) => <StatusBadge status={r.status} /> },
    { key: "createdAt", header: "Date", render: (r: Order) => <span className="text-xs text-slate-500">{formatDate(r.createdAt)}</span> },
    {
      key: "actions", header: "Actions", hideOnMobile: true, render: (r: Order) => (
        <div className="flex gap-1 flex-wrap">
          {flow.indexOf(r.status) < flow.length - 1 && (
            <button onClick={() => setModal({ id: r.id, status: flow[flow.indexOf(r.status) + 1] })} className="px-2 py-1 text-[10px] font-medium bg-blue-600 text-white rounded hover:bg-blue-700">
              {flow[flow.indexOf(r.status) + 1].replace("_", " ")}
            </button>
          )}
          <button onClick={() => { setAssignModal({ id: r.id }); setSelectedMediator(r.assignedMediatorId || ""); }} className="px-2 py-1 text-[10px] font-medium bg-white border border-slate-300 text-slate-600 rounded hover:bg-slate-50">
            Assign
          </button>
        </div>
      ),
      mobileCardFooter: (r: Order) => (
        <div className="flex gap-1 flex-wrap">
          {flow.indexOf(r.status) < flow.length - 1 && (
            <button onClick={() => setModal({ id: r.id, status: flow[flow.indexOf(r.status) + 1] })} className="px-2 py-1 text-[10px] font-medium bg-blue-600 text-white rounded hover:bg-blue-700">
              {flow[flow.indexOf(r.status) + 1].replace("_", " ")}
            </button>
          )}
          <button onClick={() => { setAssignModal({ id: r.id }); setSelectedMediator(r.assignedMediatorId || ""); }} className="px-2 py-1 text-[10px] font-medium bg-white border border-slate-300 text-slate-600 rounded hover:bg-slate-50">
            Assign
          </button>
        </div>
      ),
    },
  ];

  return (
    <AuthGuard role="admin" fallback="/admin/login">
      <div>
        <div className="mb-6">
          <h1 className="text-xl font-bold text-slate-900">All Orders</h1>
          <p className="text-sm text-slate-500 mt-1">Manage all platform orders</p>
        </div>
        <div className="mb-4 space-y-3">
          <SearchFilterBar searchPlaceholder="Search orders..." searchValue={search} onSearchChange={setSearch} />
          <div className="flex gap-2 flex-wrap">
            {["all", ...flow].map((s) => (
              <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${statusFilter === s ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-600 border-slate-300 hover:bg-slate-50"}`}>
                {s === "all" ? "All" : s.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>
        <MobileCardTable columns={columns} data={filtered} keyExtractor={(r) => r.id} emptyMessage="No orders found." />

        <ConfirmationModal
          open={modal !== null}
          title="Update Order Status"
          message={`Change order status to "${modal?.status?.replace("_", " ")}"?`}
          onConfirm={() => modal && updateStatus(modal.id, modal.status)}
          onCancel={() => setModal(null)}
        />

        {assignModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl border border-slate-200 p-6 max-w-sm w-full mx-4">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Assign to Mediator</h3>
              <select
                value={selectedMediator}
                onChange={(e) => setSelectedMediator(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white mb-4"
              >
                <option value="">Select mediator...</option>
                {mediators.map((m) => (
                  <option key={m.id} value={m.id}>{m.name} ({m.email})</option>
                ))}
              </select>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setAssignModal(null)} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">Cancel</button>
                <button onClick={() => assignMediator(assignModal.id)} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">Assign</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
