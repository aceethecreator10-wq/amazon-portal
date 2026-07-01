"use client";

import { useState } from "react";
import FormInput from "@/components/FormInput";
import { getRefundRequests, setRefundRequests, getOrders } from "@/lib/storage";
import { generateRefundId } from "@/lib/types";
import { getCurrentUser } from "@/lib/auth";
import { addToast } from "@/lib/store";
import type { RefundRequest } from "@/lib/types";

export default function RefundPage() {
  const [submitted, setSubmitted] = useState(false);
  const [refundId, setRefundId] = useState("");
  const [showUpi, setShowUpi] = useState(true);

  const [form, setForm] = useState({
    trackingId: "",
    paymentMethod: "upi",
    upiId: "",
    bankLast4: "",
    accountHolder: "",
    ifsc: "",
    whatsapp: "",
    reason: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.trackingId.trim()) errs.trackingId = "Tracking ID is required";
    if (!form.accountHolder.trim()) errs.accountHolder = "Account holder name is required";
    if (!form.whatsapp.trim()) errs.whatsapp = "WhatsApp number is required";
    if (!form.reason.trim()) errs.reason = "Reason is required";

    if (form.paymentMethod === "upi") {
      if (!form.upiId.trim()) errs.upiId = "UPI ID is required";
    } else {
      if (!form.bankLast4.trim() || form.bankLast4.length > 4 || !/^\d{1,4}$/.test(form.bankLast4))
        errs.bankLast4 = "Enter up to 4 digits (last 4 digits only)";
      if (!form.ifsc.trim()) errs.ifsc = "IFSC code is required";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const user = getCurrentUser();
    const orders = getOrders();
    const foundOrder = orders.find(
      (o) => o.trackingId.toLowerCase() === form.trackingId.trim().toLowerCase()
    );

    const rid = generateRefundId();

    // Mask UPI: only show first 3 chars + @domain
    const upiMasked = form.upiId
      ? form.upiId.substring(0, 3) + "***@" + form.upiId.split("@")[1]
      : "";

    const newRefund: RefundRequest = {
      id: `ref-${Date.now()}`,
      refundId: rid,
      trackingId: form.trackingId,
      orderId: foundOrder?.id || "",
      buyerId: user?.id || "user-1",
      paymentMethod: form.paymentMethod as "upi" | "bank_transfer",
      upiMasked,
      bankLast4: form.bankLast4,
      accountHolder: form.accountHolder,
      ifsc: form.ifsc,
      whatsapp: form.whatsapp,
      reason: form.reason,
      status: "submitted",
      statusLogs: [
        {
          id: `log-${Date.now()}`,
          status: "submitted",
          note: "Refund request submitted",
          changedBy: user?.name || "Buyer",
          createdAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const refunds = getRefundRequests();
    refunds.unshift(newRefund);
    setRefundRequests(refunds);

    setRefundId(rid);
    setSubmitted(true);
    addToast("success", `Refund request submitted! ID: ${rid}`);
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
          <h2 className="text-xl font-bold text-slate-900 mb-2">Refund Request Submitted!</h2>
          <p className="text-sm text-slate-500 mb-4">Your refund request has been submitted. Track its progress below.</p>
          <div className="bg-slate-50 rounded-lg p-4 mb-6 inline-block">
            <p className="text-xs text-slate-500 mb-1">Refund ID</p>
            <p className="text-lg font-mono font-bold text-amber-600">{refundId}</p>
          </div>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigator.clipboard.writeText(refundId)}
              className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Copy Refund ID
            </button>
            <a
              href={`/track?id=${form.trackingId}`}
              className="px-4 py-2 text-sm font-medium bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Track Status
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Request Refund</h1>
        <p className="text-sm text-slate-500 mt-1">
          Submit a refund request for an eligible order
        </p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
        <div className="flex gap-3">
          <svg className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 1.502-1.667.875-2.5L13.732 4c-.627-.833-1.543-.833-2.17 0L4.066 16.5c-.627.833-.665 2.5.875 2.5z" />
          </svg>
          <div>
            <p className="text-sm font-semibold text-amber-800">Demo Only - Do Not Enter Real Bank Details</p>
            <p className="text-xs text-amber-700 mt-1">
              This is a demo application. Do not enter real payment information, bank account numbers, or personal financial data. All data is stored locally in your browser only.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 shadow-sm">
        {/* Section: Order Info */}
        <div className="p-5 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Order Information</h3>
          <div className="space-y-4">
            <FormInput
              label="Tracking ID"
              id="trackingId"
              value={form.trackingId}
              onChange={(e) => setForm({ ...form, trackingId: e.target.value })}
              error={errors.trackingId}
              placeholder="DF-ORD-1001"
            />
            <FormInput
              label="WhatsApp Number"
              id="whatsappRefund"
              type="tel"
              inputMode="tel"
              value={form.whatsapp}
              onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
              error={errors.whatsapp}
              placeholder="+91-9876543210"
            />
          </div>
        </div>

        {/* Section: Payment Details */}
        <div className="p-5 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Payment Details</h3>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700">Payment Method</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer p-3 rounded-lg border border-slate-200 has-checked:border-blue-500 has-checked:bg-blue-50 flex-1">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="upi"
                    checked={form.paymentMethod === "upi"}
                    onChange={() => { setForm({ ...form, paymentMethod: "upi" }); setShowUpi(true); }}
                    className="text-blue-600"
                  />
                  <span className="text-sm text-slate-700 font-medium">UPI</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer p-3 rounded-lg border border-slate-200 has-checked:border-blue-500 has-checked:bg-blue-50 flex-1">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="bank_transfer"
                    checked={form.paymentMethod === "bank_transfer"}
                    onChange={() => { setForm({ ...form, paymentMethod: "bank_transfer" }); setShowUpi(false); }}
                    className="text-blue-600"
                  />
                  <span className="text-sm text-slate-700 font-medium">Bank</span>
                </label>
              </div>
            </div>

            <FormInput
              label="Account Holder Name"
              id="accountHolder"
              value={form.accountHolder}
              onChange={(e) => setForm({ ...form, accountHolder: e.target.value })}
              error={errors.accountHolder}
              placeholder="John Doe"
            />

            {showUpi ? (
              <FormInput
                label="UPI ID"
                id="upiId"
                value={form.upiId}
                onChange={(e) => setForm({ ...form, upiId: e.target.value })}
                error={errors.upiId}
                placeholder="example@paytm"
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput
                  label="Bank Account (Last 4 Digits Only)"
                  id="bankLast4"
                  inputMode="numeric"
                  value={form.bankLast4}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").slice(0, 4);
                    setForm({ ...form, bankLast4: val });
                  }}
                  error={errors.bankLast4}
                  placeholder="6789"
                  maxLength={4}
                />
                <FormInput
                  label="IFSC Code"
                  id="ifsc"
                  value={form.ifsc}
                  onChange={(e) => setForm({ ...form, ifsc: e.target.value.toUpperCase() })}
                  error={errors.ifsc}
                  placeholder="HDFC0001234"
                />
              </div>
            )}
          </div>
        </div>

        {/* Section: Reason & Attachments */}
        <div className="p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Reason & Attachments</h3>
          <div className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="reason" className="block text-sm font-medium text-slate-700">
                Refund Reason
              </label>
              <textarea
                id="reason"
                rows={3}
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                className={`w-full px-3 py-3 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white resize-none ${
                  errors.reason ? "border-red-300" : "border-slate-300"
                }`}
                placeholder="Explain why you are requesting a refund..."
              />
              {errors.reason && <p className="text-xs text-red-500">{errors.reason}</p>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700">Rating/Review Screenshot</label>
                <label className="cursor-pointer inline-block px-4 py-3 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors touch-target">
                  Choose File
                </label>
                <input type="file" accept="image/*" className="hidden" />
                <p className="text-[10px] text-slate-400 mt-1">Demo placeholder</p>
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700">Delivery Screenshot</label>
                <label className="cursor-pointer inline-block px-4 py-3 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors touch-target">
                  Choose File
                </label>
                <input type="file" accept="image/*" className="hidden" />
                <p className="text-[10px] text-slate-400 mt-1">Demo placeholder</p>
              </div>
            </div>
            <button
              type="submit"
              className="w-full px-6 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-colors text-[16px] touch-target"
            >
              Submit Refund Request
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
