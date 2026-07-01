"use client";

import { useState, useEffect, useMemo } from "react";
import MobileCardTable from "@/components/MobileCardTable";
import StatusBadge from "@/components/StatusBadge";
import SearchFilterBar from "@/components/SearchFilterBar";
import AuthGuard from "@/components/AuthGuard";
import { getUsers } from "@/lib/storage";
import { formatDate } from "@/lib/utils";
import type { User } from "@/lib/types";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!loaded) {
      setUsers(getUsers());
      setLoaded(true);
    }
  }, [loaded]);

  const filtered = useMemo(() => {
    let result = users;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
    }
    if (roleFilter !== "all") result = result.filter((u) => u.role === roleFilter);
    return result;
  }, [users, search, roleFilter]);

  const columns = [
    { key: "name", header: "Name", render: (r: User) => <span className="font-medium text-slate-900">{r.name}</span> },
    { key: "email", header: "Email" },
    { key: "role", header: "Role", render: (r: User) => <StatusBadge status={r.role} /> },
    { key: "whatsapp", header: "WhatsApp" },
    { key: "createdAt", header: "Joined", render: (r: User) => <span className="text-xs text-slate-500">{formatDate(r.createdAt)}</span> },
  ];

  return (
    <AuthGuard role="admin" fallback="/admin/login">
      <div>
        <div className="mb-6">
          <h1 className="text-xl font-bold text-slate-900">Users</h1>
          <p className="text-sm text-slate-500 mt-1">View all platform users</p>
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
          mobileCardHeader={(r) => (
            <div className="flex items-center justify-between">
              <span className="font-medium text-slate-900 text-sm">{r.name}</span>
              <StatusBadge status={r.role} />
            </div>
          )}
          mobileCardFooter={(r) => (
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>{r.email}</span>
              <span>{formatDate(r.createdAt)}</span>
            </div>
          )}
        />
      </div>
    </AuthGuard>
  );
}
