"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { getOrders, getRefundRequests } from "@/lib/storage";
import StatusBadge from "@/components/StatusBadge";
import StatusTimeline from "@/components/StatusTimeline";
import { formatPrice, formatDateTime } from "@/lib/utils";
import type { Order, RefundRequest } from "@/lib/types";

const orderStatuses = ["submitted", "under_review", "approved", "processing", "completed"];
const refundStatuses = ["submitted", "documents_received", "verification", "approved", "paid"];

function TrackContent() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get("id") || "";

  const [query, setQuery] = useState(initialId);
  const [order, setOrder] = useState<Order | null>(null);
  const [refund, setRefund] = useState<RefundRequest | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    if (!query.trim()) return;
    setSearched(true);

    const orders = getOrders();
    const foundOrder = orders.find(
      (o) =>
        o.trackingId.toLowerCase() === query.trim().toLowerCase() ||
        o.id.toLowerCase() === query.trim().toLowerCase() ||
        o.orderId.toLowerCase() === query.trim().toLowerCase()
    );
    setOrder(foundOrder || null);

    if (foundOrder) {
      const refunds = getRefundRequests();
      const foundRefund = refunds.find(
        (r) =>
          r.trackingId === foundOrder.trackingId ||
          r.orderId === foundOrder.id
      );
      setRefund(foundRefund || null);
    } else {
      setRefund(null);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Track Status</h1>
        <p className="text-sm text-slate-500 mt-1">
          Enter your tracking ID or order ID to check status
        </p>
      </div>

      <div className="flex gap-3 mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="e.g. DF-ORD-1001"
          className="flex-1 px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />
        <button
          onClick={handleSearch}
          className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Search
        </button>
      </div>

      {searched && !order && (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center shadow-sm">
          <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-3">
            <svg className="w-7 h-7 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 1.502-1.667.875-2.5L13.732 4c-.627-.833-1.543-.833-2.17 0L4.066 16.5c-.627.833-.665 2.5.875 2.5z" />
            </svg>
          </div>
          <h3 className="font-semibold text-slate-900 mb-1">Order Not Found</h3>
          <p className="text-sm text-slate-500">
            No order found with the provided ID. Please check and try again.
          </p>
        </div>
      )}

      {order && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs text-slate-500 mb-1">Tracking ID</p>
                <p className="text-lg font-mono font-bold text-slate-900">{order.trackingId}</p>
              </div>
              <StatusBadge status={order.status} />
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-slate-500">Buyer</p>
                <p className="font-medium text-slate-900">{order.buyerName}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Platform</p>
                <p className="font-medium text-slate-900">{order.platform}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Amount</p>
                <p className="font-medium text-slate-900">{formatPrice(order.amount)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Submitted</p>
                <p className="font-medium text-slate-900">{formatDateTime(order.createdAt)}</p>
              </div>
            </div>

            {order.notes && (
              <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500 mb-1">Notes</p>
                <p className="text-sm text-slate-700">{order.notes}</p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900 text-sm mb-4">Order Timeline</h3>
            <StatusTimeline
              logs={order.statusLogs}
              currentStatus={order.status}
              allStatuses={orderStatuses}
            />
          </div>

          {refund && (
            <>
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Refund ID</p>
                    <p className="text-lg font-mono font-bold text-amber-600">{refund.refundId}</p>
                  </div>
                  <StatusBadge status={refund.status} />
                </div>
                <p className="text-xs text-slate-500 mb-1">Reason</p>
                <p className="text-sm text-slate-700 mb-3">{refund.reason}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-slate-500">Payment Method</p>
                    <p className="font-medium text-slate-900">
                      {refund.paymentMethod === "upi" ? "UPI" : "Bank Transfer"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Submitted</p>
                    <p className="font-medium text-slate-900">{formatDateTime(refund.createdAt)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <h3 className="font-semibold text-slate-900 text-sm mb-4">Refund Timeline</h3>
                <StatusTimeline
                  logs={refund.statusLogs}
                  currentStatus={refund.status}
                  allStatuses={refundStatuses}
                />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-20"><div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>}>
      <TrackContent />
    </Suspense>
  );
}
