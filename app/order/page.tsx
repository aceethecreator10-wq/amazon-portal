"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import FormInput from "@/components/FormInput";
import { fetchDeals } from "@/lib/supabase/deals";
import { submitOrder } from "@/lib/supabase/orders";
import { addToast } from "@/lib/store";

function OrderFormContent() {
  const searchParams = useSearchParams();
  const preselectedDeal = searchParams.get("deal") || "";

  const [deals, setDeals] = useState<any[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [trackingId, setTrackingId] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    buyerName: "",
    whatsapp: "",
    email: "",
    dealId: preselectedDeal,
    orderNumber: "",
    amount: "",
    orderDate: "",
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchDeals().then((res) => setDeals(res.deals));
  }, []);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.buyerName.trim()) errs.buyerName = "Name is required";
    if (!form.whatsapp.trim()) errs.whatsapp = "WhatsApp number is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Invalid email";
    if (!form.dealId) errs.dealId = "Select a deal";
    if (!form.orderNumber.trim()) errs.orderNumber = "Order ID is required";
    if (!form.amount || Number(form.amount) <= 0) errs.amount = "Valid amount required";
    if (!form.orderDate) errs.orderDate = "Order date is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    const result = await submitOrder({
      buyerName: form.buyerName,
      email: form.email,
      whatsapp: form.whatsapp,
      dealId: form.dealId,
      orderNumber: form.orderNumber,
      amount: Number(form.amount),
      orderDate: form.orderDate,
      notes: form.notes,
    });

    setLoading(false);

    if (result.error) {
      addToast("error", result.error);
      return;
    }

    setTrackingId(result.trackingId!);
    setSubmitted(true);
    addToast("success", `Order submitted! Tracking ID: ${result.trackingId}`);
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
        <div className="p-5 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Personal Details</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput label="Buyer Name" id="buyerName" value={form.buyerName} onChange={(e) => setForm({ ...form, buyerName: e.target.value })} error={errors.buyerName} placeholder="John Doe" />
              <FormInput label="WhatsApp Number" id="whatsapp" type="tel" inputMode="tel" value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} error={errors.whatsapp} placeholder="+91-9876543210" />
            </div>
            <FormInput label="Email" id="email" type="email" inputMode="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} error={errors.email} placeholder="buyer@example.com" />
          </div>
        </div>

        <div className="p-5 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Order Details</h3>
          <div className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="dealId" className="block text-sm font-medium text-slate-700">Select Deal</label>
              <select id="dealId" value={form.dealId} onChange={(e) => setForm({ ...form, dealId: e.target.value })}
                className={`w-full px-3 py-3 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white ${errors.dealId ? "border-red-300" : "border-slate-300"}`}>
                <option value="">-- Select a deal --</option>
                {deals.map((d: any) => (
                  <option key={d.id} value={d.id}>{d.title} - {d.platform}</option>
                ))}
              </select>
              {errors.dealId && <p className="text-xs text-red-500">{errors.dealId}</p>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput label="Order Number" id="orderNumber" value={form.orderNumber} onChange={(e) => setForm({ ...form, orderNumber: e.target.value })} error={errors.orderNumber} placeholder="AMZ-ORD-12345" />
              <FormInput label="Order Amount" id="amount" type="number" inputMode="numeric" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} error={errors.amount} placeholder="14999" />
            </div>
            <FormInput label="Order Date" id="orderDate" type="date" value={form.orderDate} onChange={(e) => setForm({ ...form, orderDate: e.target.value })} error={errors.orderDate} />
          </div>
        </div>

        <div className="p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Notes</h3>
          <div className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="notes" className="block text-sm font-medium text-slate-700">Notes (optional)</label>
              <textarea id="notes" rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="w-full px-3 py-3 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white resize-none"
                placeholder="Any additional notes..." />
            </div>
            <button type="submit" disabled={loading}
              className="w-full px-6 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 transition-colors text-[16px] touch-target">
              {loading ? "Submitting..." : "Submit Order"}
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
