"use client";

import { useState, useEffect, useMemo } from "react";
import MobileCardTable from "@/components/MobileCardTable";
import StatusBadge from "@/components/StatusBadge";
import SearchFilterBar from "@/components/SearchFilterBar";
import AuthGuard from "@/components/AuthGuard";
import ConfirmationModal from "@/components/ConfirmationModal";
import { getRefundRequests, getUsers, setRefundRequests } from "@/lib/storage";
import { formatDate } from "@/lib/utils";
import { addToast } from "@/lib/store";
import type { RefundRequest } from "@/lib/types";

const flow = ["submitted", "documents_received", "verification", "approved", "rejected", "paid"];

export default function AdminRefundsPage() {
  const [refunds, setRefundsState] = useState<RefundRequest[]>([]);
  const [users, setUsersState] = useState<{ id: string; name: string; email: string; role: string }[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loaded, setLoaded] = useState(false);
  const [modal, setModal] = useState<{ id: string; status: string } | null>(null);
  const [assignModal, setAssignModal] = useState<{ id: string } | null>(null);
  const [selectedMediator, setSelectedMediator] = useState("");

  useEffect(() => {
    if (!loaded) {
      setRefundsState(getRefundRequests());
      setUsersState(getUsers());
      setLoaded(true);
    }
  }, [loaded]);

  const mediators = useMemo(() => users.filter((u) => u.role === "mediator"), [users]);

  const filtered = useMemo(() => {
    let result = refunds;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((r) => r.refundId.toLowerCase().includes(q) || r.trackingId.toLowerCase().includes(q) || r.reason.toLowerCase().includes(q));
    }
    if (statusFilter !== "all") result = result.filter((r) => r.status === statusFilter);
    return result;
  }, [refunds, search, statusFilter]);

  const updateStatus = (id: string, status: string) => {
    const all = getRefundRequests();
    const idx = all.findIndex((r) => r.id === id);
    if (idx === -1) return;
    all[idx] = {
      ...all[idx],
      status: status as RefundRequest["status"],
      statusLogs: [...all[idx].statusLogs, { id: `log-${Date.now()}`, status, note: "Updated by admin", changedBy: "Admin", createdAt: new Date().toISOString() }],
      updatedAt: new Date().toISOString(),
    };
    setRefundRequests(all);
    setRefundsState(getRefundRequests());
    addToast("success", `Refund ${status.replace("_", " ")}`);
    setModal(null);
  };

  const assignMediator = (refundId: string) => {
    if (!selectedMediator) return;
    const all = getRefundRequests();
    const idx = all.findIndex((r) => r.id === refundId);
    if (idx === -1) return;
    all[idx] = { ...all[idx], assignedMediatorId: selectedMediator, updatedAt: new Date().toISOString() };
    setRefundRequests(all);
    setRefundsState(getRefundRequests());
    addToast("success", "Refund assigned to mediator");
    setAssignModal(null);
    setSelectedMediator("");
  };

  const columns = [
    { key: "refundId", header: "Refund ID", render: (r: RefundRequest) => <span className="font-mono text-xs font-medium text-amber-600">{r.refundId}</span>, mobileCardHeader: (r: RefundRequest) => <div className="flex items-center justify-between w-full"><span className="font-mono text-xs font-medium text-amber-600">{r.refundId}</span><StatusBadge status={r.status} /></div> },
    { key: "trackingId", header: "Tracking", render: (r: RefundRequest) => <span className="font-mono text-xs">{r.trackingId}</span> },
    { key: "accountHolder", header: "Account Holder" },
    { key: "reason", header: "Reason", className: "max-w-[150px]", render: (r: RefundRequest) => <span className="text-xs truncate block">{r.reason}</span> },
    { key: "status", header: "Status", render: (r: RefundRequest) => <StatusBadge status={r.status} /> },
    { key: "createdAt", header: "Date", render: (r: RefundRequest) => <span className="text-xs text-slate-500">{formatDate(r.createdAt)}</span> },
    {
      key: "actions", header: "Actions", hideOnMobile: true, render: (r: RefundRequest) => (
        <div className="flex gap-1 flex-wrap">
          {flow.indexOf(r.status) < flow.length - 1 && (
            <button onClick={() => setModal({ id: r.id, status: flow[flow.indexOf(r.status) + 1] })} className="px-2 py-1 text-[10px] font-medium bg-amber-600 text-white rounded hover:bg-amber-700">
              {flow[flow.indexOf(r.status) + 1].replace("_", " ")}
            </button>
          )}
          <button onClick={() => { setAssignModal({ id: r.id }); setSelectedMediator(r.assignedMediatorId || ""); }} className="px-2 py-1 text-[10px] font-medium bg-white border border-slate-300 text-slate-600 rounded hover:bg-slate-50">
            Assign
          </button>
        </div>
      ),
      mobileCardFooter: (r: RefundRequest) => (
        <div className="flex gap-1 flex-wrap">
          {flow.indexOf(r.status) < flow.length - 1 && (
            <button onClick={() => setModal({ id: r.id, status: flow[flow.indexOf(r.status) + 1] })} className="px-2 py-1 text-[10px] font-medium bg-amber-600 text-white rounded hover:bg-amber-700">
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
          <h1 className="text-xl font-bold text-slate-900">All Refunds</h1>
          <p className="text-sm text-slate-500 mt-1">Manage all refund requests</p>
        </div>
        <div className="mb-4 space-y-3">
          <SearchFilterBar searchPlaceholder="Search refunds..." searchValue={search} onSearchChange={setSearch} />
          <div className="flex gap-2 flex-wrap">
            {["all", ...flow].map((s) => (
              <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${statusFilter === s ? "bg-amber-600 text-white border-amber-600" : "bg-white text-slate-600 border-slate-300 hover:bg-slate-50"}`}>
                {s === "all" ? "All" : s.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>
        <MobileCardTable columns={columns} data={filtered} keyExtractor={(r) => r.id} emptyMessage="No refund requests found." />

        <ConfirmationModal
          open={modal !== null}
          title="Update Refund Status"
          message={`Change refund status to "${modal?.status?.replace("_", " ")}"?`}
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
