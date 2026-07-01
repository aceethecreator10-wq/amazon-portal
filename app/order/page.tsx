"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import FormInput from "@/components/FormInput";
import { getDeals, getOrders, setOrders } from "@/lib/storage";
import { generateTrackingId } from "@/lib/types";
import { getCurrentUser } from "@/lib/auth";
import { addToast } from "@/lib/store";
import type { Deal, Order } from "@/lib/types";

function OrderFormContent() {
  const searchParams = useSearchParams();
  const preselectedDeal = searchParams.get("deal") || "";

  const [deals, setDealsState] = useState<Deal[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [trackingId, setTrackingId] = useState("");

  const [form, setForm] = useState({
    buyerName: "",
    whatsapp: "",
    email: "",
    dealId: preselectedDeal,
    orderId: "",
    amount: "",
    orderDate: "",
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setDealsState(getDeals().filter((d) => d.status !== "expired"));
  }, []);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.buyerName.trim()) errs.buyerName = "Name is required";
    if (!form.whatsapp.trim()) errs.whatsapp = "WhatsApp number is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Invalid email";
    if (!form.dealId) errs.dealId = "Select a deal";
    if (!form.orderId.trim()) errs.orderId = "Order ID is required";
    if (!form.amount || Number(form.amount) <= 0) errs.amount = "Valid amount required";
    if (!form.orderDate) errs.orderDate = "Order date is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const user = getCurrentUser();
    const tid = generateTrackingId();
    const deal = deals.find((d) => d.id === form.dealId);

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      trackingId: tid,
      buyerId: user?.id || "user-1",
      buyerName: form.buyerName,
      whatsapp: form.whatsapp,
      email: form.email,
      dealId: form.dealId,
      platform: deal?.platform || "",
      orderId: form.orderId,
      amount: Number(form.amount),
      status: "submitted",
      notes: form.notes,
      statusLogs: [
        {
          id: `log-${Date.now()}`,
          status: "submitted",
          note: "Order submitted successfully",
          changedBy: user?.name || "Buyer",
          createdAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const orders = getOrders();
    orders.unshift(newOrder);
    setOrders(orders);

    setTrackingId(tid);
    setSubmitted(true);
    addToast("success", `Order submitted! Tracking ID: ${tid}`);
  };

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16">
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center shadow-sm">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Order Submitted!</h2>
          <p className="text-sm text-slate-500 mb-4">Your order has been submitted successfully.</p>
          <div className="bg-slate-50 rounded-lg p-4 mb-6 inline-block">
            <p className="text-xs text-slate-500 mb-1">Tracking ID</p>
            <p className="text-lg font-mono font-bold text-blue-600">{trackingId}</p>
          </div>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigator.clipboard.writeText(trackingId)}
              className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Copy Tracking ID
            </button>
            <a
              href={`/track?id=${trackingId}`}
              className="px-4 py-2 text-sm font-medium bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Track Order
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Submit Order</h1>
        <p className="text-sm text-slate-500 mt-1">
          Fill in the details below to submit your order for processing
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 shadow-sm">
        {/* Section: Personal Details */}
        <div className="p-5 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Personal Details</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                label="Buyer Name"
                id="buyerName"
                value={form.buyerName}
                onChange={(e) => setForm({ ...form, buyerName: e.target.value })}
                error={errors.buyerName}
                placeholder="John Doe"
              />
              <FormInput
                label="WhatsApp Number"
                id="whatsapp"
                type="tel"
                inputMode="tel"
                value={form.whatsapp}
                onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                error={errors.whatsapp}
                placeholder="+91-9876543210"
              />
            </div>
            <FormInput
              label="Email"
              id="email"
              type="email"
              inputMode="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              error={errors.email}
              placeholder="buyer@example.com"
            />
          </div>
        </div>

        {/* Section: Order Details */}
        <div className="p-5 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Order Details</h3>
          <div className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="dealId" className="block text-sm font-medium text-slate-700">
                Select Deal
              </label>
              <select
                id="dealId"
                value={form.dealId}
                onChange={(e) => setForm({ ...form, dealId: e.target.value })}
                className={`w-full px-3 py-3 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white ${
                  errors.dealId ? "border-red-300" : "border-slate-300"
                }`}
              >
                <option value="">-- Select a deal --</option>
                {deals.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.title} - {d.platform} ({d.dealPrice})
                  </option>
                ))}
              </select>
              {errors.dealId && <p className="text-xs text-red-500">{errors.dealId}</p>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                label="Order ID"
                id="orderId"
                value={form.orderId}
                onChange={(e) => setForm({ ...form, orderId: e.target.value })}
                error={errors.orderId}
                placeholder="AMZ-ORD-12345"
              />
              <FormInput
                label="Order Amount"
                id="amount"
                type="number"
                inputMode="numeric"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                error={errors.amount}
                placeholder="14999"
              />
            </div>
            <FormInput
              label="Order Date"
              id="orderDate"
              type="date"
              value={form.orderDate}
              onChange={(e) => setForm({ ...form, orderDate: e.target.value })}
              error={errors.orderDate}
            />
          </div>
        </div>

        {/* Section: Attachments & Notes */}
        <div className="p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Attachments & Notes</h3>
          <div className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="screenshot" className="block text-sm font-medium text-slate-700">
                Order Screenshot (optional - demo)
              </label>
              <div className="flex items-center gap-3">
                <label
                  htmlFor="screenshot"
                  className="cursor-pointer px-4 py-3 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors touch-target"
                >
                  Choose File
                </label>
                <span className="text-xs text-slate-500">No file chosen</span>
              </div>
              <input id="screenshot" type="file" accept="image/*" className="hidden" />
              <p className="text-[10px] text-slate-400">Demo: file is not actually uploaded.</p>
            </div>
            <div className="space-y-1">
              <label htmlFor="notes" className="block text-sm font-medium text-slate-700">
                Notes
              </label>
              <textarea
                id="notes"
                rows={3}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="w-full px-3 py-3 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white resize-none"
                placeholder="Any additional notes..."
              />
            </div>
            <button
              type="submit"
              className="w-full px-6 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-colors text-[16px] touch-target"
            >
              Submit Order
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function OrderPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-20"><div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>}>
      <OrderFormContent />
    </Suspense>
  );
}
