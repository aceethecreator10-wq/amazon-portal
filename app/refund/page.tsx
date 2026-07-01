"use client";

import { useState } from "react";
import FormInput from "@/components/FormInput";
import FileUpload from "@/components/FileUpload";
import { submitRefund } from "@/lib/supabase/refunds";
import { addToast } from "@/lib/store";

export default function RefundPage() {
  const [submitted, setSubmitted] = useState(false);
  const [refundId, setRefundId] = useState("");
  const [showUpi, setShowUpi] = useState(true);
  const [loading, setLoading] = useState(false);
  const [reviewScreenshot, setReviewScreenshot] = useState("");
  const [deliveryScreenshot, setDeliveryScreenshot] = useState("");

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    const result = await submitRefund({
      trackingId: form.trackingId,
      paymentMethod: form.paymentMethod,
      upiId: form.paymentMethod === "upi" ? form.upiId : undefined,
      bankLast4: form.paymentMethod === "bank_transfer" ? form.bankLast4 : undefined,
      accountHolder: form.accountHolder,
      ifsc: form.paymentMethod === "bank_transfer" ? form.ifsc : undefined,
      whatsapp: form.whatsapp,
      reason: form.reason,
      reviewScreenshotUrl: reviewScreenshot || undefined,
      deliveryScreenshotUrl: deliveryScreenshot || undefined,
    });

    setLoading(false);

    if (result.error) {
      addToast("error", result.error);
      return;
    }

    setRefundId(result.refundId!);
    setSubmitted(true);
    addToast("success", `Refund request submitted! ID: ${result.refundId}`);
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
            <button onClick={() => navigator.clipboard.writeText(refundId)}
              className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Copy Refund ID</button>
            <a href={`/track?id=${form.trackingId}`}
              className="px-4 py-2 text-sm font-medium bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">Track Status</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Request Refund</h1>
        <p className="text-sm text-slate-500 mt-1">Submit a refund request for an eligible order</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="p-5 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Order Information</h3>
          <div className="space-y-4">
            <FormInput label="Tracking ID" id="trackingId" value={form.trackingId} onChange={(e) => setForm({ ...form, trackingId: e.target.value })} error={errors.trackingId} placeholder="DF-ORD-100001" />
            <FormInput label="WhatsApp Number" id="whatsappRefund" type="tel" inputMode="tel" value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} error={errors.whatsapp} placeholder="+91-9876543210" />
          </div>
        </div>

        <div className="p-5 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Payment Details</h3>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700">Payment Method</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer p-3 rounded-lg border border-slate-200 has-checked:border-blue-500 has-checked:bg-blue-50 flex-1">
                  <input type="radio" name="paymentMethod" value="upi" checked={form.paymentMethod === "upi"} onChange={() => { setForm({ ...form, paymentMethod: "upi" }); setShowUpi(true); }} className="text-blue-600" />
                  <span className="text-sm text-slate-700 font-medium">UPI</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer p-3 rounded-lg border border-slate-200 has-checked:border-blue-500 has-checked:bg-blue-50 flex-1">
                  <input type="radio" name="paymentMethod" value="bank_transfer" checked={form.paymentMethod === "bank_transfer"} onChange={() => { setForm({ ...form, paymentMethod: "bank_transfer" }); setShowUpi(false); }} className="text-blue-600" />
                  <span className="text-sm text-slate-700 font-medium">Bank</span>
                </label>
              </div>
            </div>
            <FormInput label="Account Holder Name" id="accountHolder" value={form.accountHolder} onChange={(e) => setForm({ ...form, accountHolder: e.target.value })} error={errors.accountHolder} placeholder="John Doe" />
            {showUpi ? (
              <FormInput label="UPI ID" id="upiId" value={form.upiId} onChange={(e) => setForm({ ...form, upiId: e.target.value })} error={errors.upiId} placeholder="example@paytm" />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput label="Last 4 Digits of Account" id="bankLast4" inputMode="numeric" value={form.bankLast4}
                  onChange={(e) => { const val = e.target.value.replace(/\D/g, "").slice(0, 4); setForm({ ...form, bankLast4: val }); }}
                  error={errors.bankLast4} placeholder="6789" maxLength={4} />
                <FormInput label="IFSC Code" id="ifsc" value={form.ifsc} onChange={(e) => setForm({ ...form, ifsc: e.target.value.toUpperCase() })} error={errors.ifsc} placeholder="HDFC0001234" />
              </div>
            )}
          </div>
        </div>

        <div className="p-5 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Supporting Documents</h3>
          <div className="space-y-4">
            <FileUpload label="Order Review Screenshot (optional)" id="reviewScreenshot" bucket="refund-screenshots" path={`refunds/${form.trackingId || "new"}`} onUploadComplete={setReviewScreenshot} onError={(e) => addToast("error", e)} />
            <FileUpload label="Delivery Screenshot (optional)" id="deliveryScreenshot" bucket="refund-screenshots" path={`refunds/${form.trackingId || "new"}`} onUploadComplete={setDeliveryScreenshot} onError={(e) => addToast("error", e)} />
          </div>
        </div>

        <div className="p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Reason</h3>
          <div className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="reason" className="block text-sm font-medium text-slate-700">Refund Reason</label>
              <textarea id="reason" rows={3} value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })}
                className={`w-full px-3 py-3 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white resize-none ${errors.reason ? "border-red-300" : "border-slate-300"}`}
                placeholder="Explain why you are requesting a refund..." />
              {errors.reason && <p className="text-xs text-red-500">{errors.reason}</p>}
            </div>
            <button type="submit" disabled={loading}
              className="w-full px-6 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 transition-colors text-[16px] touch-target">
              {loading ? "Submitting..." : "Submit Refund Request"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
