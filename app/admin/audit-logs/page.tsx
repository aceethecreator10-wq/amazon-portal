"use client";

import { useState, useEffect } from "react";
import MobileCardTable from "@/components/MobileCardTable";
import AuthGuard from "@/components/AuthGuard";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/utils";
import { addToast } from "@/lib/store";

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!loaded) {
      (async () => {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("audit_logs")
          .select("*, actor:actor_id(full_name, email)")
          .order("created_at", { ascending: false })
          .limit(100);
        if (error) { addToast("error", error.message); return; }
        setLogs(data || []);
        setLoaded(true);
      })();
    }
  }, [loaded]);

  const columns = [
    { key: "action", header: "Action", render: (r: any) => <span className="text-xs font-medium text-slate-900">{r.action}</span> },
    { key: "actor_id", header: "Actor", render: (r: any) => <span className="text-xs">{r.actor?.full_name || r.actor?.email || "System"}</span> },
    { key: "entity_type", header: "Entity", render: (r: any) => <span className="text-xs text-slate-500">{r.entity_type || "-"}</span> },
    { key: "ip_address", header: "IP", render: (r: any) => <span className="text-xs text-slate-400 font-mono">{r.ip_address || "-"}</span> },
    { key: "created_at", header: "Date", render: (r: any) => <span className="text-xs text-slate-500">{formatDate(r.created_at)}</span> },
  ];

  return (
    <AuthGuard role="admin" fallback="/admin/login">
      <div>
        <div className="mb-6">
          <h1 className="text-xl font-bold text-slate-900">Audit Logs</h1>
          <p className="text-sm text-slate-500 mt-1">Track all admin actions and sensitive operations</p>
        </div>
        <MobileCardTable columns={columns} data={logs} keyExtractor={(r: any) => r.id} emptyMessage="No audit logs yet."
          mobileCardHeader={(r: any) => (<div className="flex items-center justify-between w-full"><span className="text-xs font-medium">{r.action}</span><span className="text-xs text-slate-400">{formatDate(r.created_at)}</span></div>)} />
      </div>
    </AuthGuard>
  );
}
