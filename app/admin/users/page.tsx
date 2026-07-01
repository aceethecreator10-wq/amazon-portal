"use client";

import { useState, useEffect, useMemo } from "react";
import MobileCardTable from "@/components/MobileCardTable";
import StatusBadge from "@/components/StatusBadge";
import SearchFilterBar from "@/components/SearchFilterBar";
import AuthGuard from "@/components/AuthGuard";
import { fetchAllProfiles, updateProfileRole, updateProfileStatus } from "@/lib/supabase/profiles";
import { formatDate } from "@/lib/utils";
import { addToast } from "@/lib/store";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!loaded) {
      fetchAllProfiles().then((res) => { setUsers(res.profiles); setLoaded(true); });
    }
  }, [loaded]);

  const filtered = useMemo(() => {
    let result = users;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((u) => u.full_name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q));
    }
    if (roleFilter !== "all") result = result.filter((u) => u.role === roleFilter);
    return result;
  }, [users, search, roleFilter]);

  const handleRoleChange = async (userId: string, role: string) => {
    const res = await updateProfileRole(userId, role);
    if (res.error) { addToast("error", res.error); return; }
    fetchAllProfiles().then((r) => setUsers(r.profiles));
    addToast("success", `Role updated to ${role}`);
  };

  const handleStatusChange = async (userId: string, status: string) => {
    const res = await updateProfileStatus(userId, status);
    if (res.error) { addToast("error", res.error); return; }
    fetchAllProfiles().then((r) => setUsers(r.profiles));
    addToast("success", `Profile ${status}`);
  };

  const columns = [
    { key: "full_name", header: "Name", render: (r: any) => <span className="font-medium text-slate-900">{r.full_name}</span> },
    { key: "email", header: "Email", render: (r: any) => <span className="text-xs text-slate-600">{r.email}</span> },
    { key: "role", header: "Role", render: (r: any) => <StatusBadge status={r.role} /> },
    { key: "status", header: "Status", render: (r: any) => (
      <span className={`text-xs font-medium px-2 py-0.5 rounded ${r.status === "active" ? "text-emerald-700 bg-emerald-50" : "text-slate-500 bg-slate-100"}`}>{r.status}</span>
    )},
    { key: "whatsapp", header: "WhatsApp", render: (r: any) => <span className="text-xs">{r.whatsapp || "-"}</span> },
    { key: "created_at", header: "Joined", render: (r: any) => <span className="text-xs text-slate-500">{formatDate(r.created_at)}</span> },
    { key: "actions", header: "Actions", hideOnMobile: true, render: (r: any) => (
      <div className="flex gap-1 flex-wrap">
        <select value={r.role} onChange={(e) => handleRoleChange(r.id, e.target.value)}
          className="px-2 py-1 text-[10px] border border-slate-300 rounded bg-white text-slate-700">
          {["buyer", "mediator", "admin"].map((role) => <option key={role} value={role}>{role}</option>)}
        </select>
        <button onClick={() => handleStatusChange(r.id, r.status === "active" ? "suspended" : "active")}
          className={`px-2 py-1 text-[10px] font-medium rounded border ${r.status === "active" ? "bg-red-50 border-red-200 text-red-600 hover:bg-red-100" : "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"}`}>
          {r.status === "active" ? "Suspend" : "Activate"}
        </button>
      </div>
    ), mobileCardFooter: (r: any) => (
      <div className="flex gap-1 flex-wrap">
        <select value={r.role} onChange={(e) => handleRoleChange(r.id, e.target.value)}
          className="px-2 py-1 text-[10px] border border-slate-300 rounded bg-white text-slate-700">
          {["buyer", "mediator", "admin"].map((role) => <option key={role} value={role}>{role}</option>)}
        </select>
        <button onClick={() => handleStatusChange(r.id, r.status === "active" ? "suspended" : "active")}
          className={`px-2 py-1 text-[10px] font-medium rounded border ${r.status === "active" ? "bg-red-50 border-red-200 text-red-600 hover:bg-red-100" : "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"}`}>
          {r.status === "active" ? "Suspend" : "Activate"}
        </button>
      </div>
    )},
  ];

  return (
    <AuthGuard role="admin" fallback="/admin/login">
      <div>
        <div className="mb-6">
          <h1 className="text-xl font-bold text-slate-900">Users</h1>
          <p className="text-sm text-slate-500 mt-1">View and manage all platform users</p>
        </div>
        <div className="mb-4 space-y-3">
          <SearchFilterBar searchPlaceholder="Search by name or email..." searchValue={search} onSearchChange={setSearch} />
          <div className="flex gap-2 flex-wrap">
            {["all", "buyer", "mediator", "admin"].map((r) => (
              <button key={r} onClick={() => setRoleFilter(r)} className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${roleFilter === r ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-600 border-slate-300 hover:bg-slate-50"}`}>
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <MobileCardTable
          columns={columns}
          data={filtered}
          keyExtractor={(r) => r.id}
          emptyMessage="No users found."
          mobileCardHeader={(r: any) => (
            <div className="flex items-center justify-between w-full">
              <span className="font-medium text-slate-900 text-sm">{r.full_name}</span>
              <StatusBadge status={r.role} />
            </div>
          )}
        />
      </div>
    </AuthGuard>
  );
}
