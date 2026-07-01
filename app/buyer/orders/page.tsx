"use client";

import { useState, useEffect, useMemo } from "react";
import MobileCardTable from "@/components/MobileCardTable";
import StatusBadge from "@/components/StatusBadge";
import SearchFilterBar from "@/components/SearchFilterBar";
import AuthGuard from "@/components/AuthGuard";
import { getOrders } from "@/lib/storage";
import { getCurrentUser } from "@/lib/auth";
import { formatPrice, formatDate } from "@/lib/utils";
import type { Order } from "@/lib/types";

export default function BuyerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!loaded) {
      const user = getCurrentUser();
      if (user) {
        setOrders(getOrders().filter((o) => o.buyerId === user.id));
        setLoaded(true);
      }
    }
  }, [loaded]);

  const filtered = useMemo(() => {
    if (!search) return orders;
    const q = search.toLowerCase();
    return orders.filter(
      (o) =>
        o.trackingId.toLowerCase().includes(q) ||
        o.platform.toLowerCase().includes(q) ||
        o.orderId.toLowerCase().includes(q)
    );
  }, [orders, search]);

  const columns = [
    { key: "trackingId", header: "Tracking ID", render: (r: Order) => <span className="font-mono text-xs font-medium text-blue-600">{r.trackingId}</span> },
    { key: "platform", header: "Platform" },
    { key: "orderId", header: "Order ID", render: (r: Order) => <span className="font-mono text-xs">{r.orderId}</span> },
    { key: "amount", header: "Amount", render: (r: Order) => formatPrice(r.amount) },
    { key: "status", header: "Status", render: (r: Order) => <StatusBadge status={r.status} /> },
    { key: "createdAt", header: "Date", render: (r: Order) => <span className="text-xs text-slate-500">{formatDate(r.createdAt)}</span> },
  ];

  return (
    <AuthGuard role="buyer" fallback="/buyer/login">
      <div>
        <div className="mb-6">
          <h1 className="text-xl font-bold text-slate-900">My Orders</h1>
          <p className="text-sm text-slate-500 mt-1">View all your submitted orders</p>
        </div>
        <div className="mb-4">
          <SearchFilterBar searchPlaceholder="Search by tracking ID, platform..." searchValue={search} onSearchChange={setSearch} />
        </div>
        <MobileCardTable
          columns={columns}
          data={filtered}
          keyExtractor={(r) => r.id}
          emptyMessage="No orders found."
          mobileCardHeader={(r) => (
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-medium text-blue-600">{r.trackingId}</span>
              <StatusBadge status={r.status} />
            </div>
          )}
          mobileCardFooter={(r) => (
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>{r.platform} &middot; {formatPrice(r.amount)}</span>
              <span>{formatDate(r.createdAt)}</span>
            </div>
          )}
        />
      </div>
    </AuthGuard>
  );
}
