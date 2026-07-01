export default function RefundPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Refund Policy</h1>
      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm text-sm text-slate-600 space-y-4">
          <h2 className="text-base font-semibold text-slate-900">Refund Eligibility</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Orders must be in <strong>completed</strong> or <strong>processing</strong> status to be eligible for refund</li>
            <li>Refund requests must be submitted within 7 days of order delivery</li>
            <li>Valid reasons include: product not delivered, defective item, wrong variant, or cancellation by seller</li>
            <li>Orders with status <strong>rejected</strong> are not eligible for refund</li>
          </ul>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm text-sm text-slate-600 space-y-4">
          <h2 className="text-base font-semibold text-slate-900">Required Documents</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Order screenshot showing order ID and amount</li>
            <li>Delivery screenshot or tracking confirmation</li>
            <li>Rating/review screenshot (if applicable)</li>
            <li>Valid payment details (UPI ID or bank account last 4 digits)</li>
          </ul>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm text-sm text-slate-600 space-y-4">
          <h2 className="text-base font-semibold text-slate-900">Processing Timeline</h2>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="w-24 text-xs font-medium text-slate-500">Submission</span>
              <div className="h-2 flex-1 rounded-full bg-blue-100"><div className="h-2 rounded-full bg-blue-600" style={{ width: "20%" }} /></div>
              <span className="text-xs text-slate-500">Day 1</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-24 text-xs font-medium text-slate-500">Verification</span>
              <div className="h-2 flex-1 rounded-full bg-amber-100"><div className="h-2 rounded-full bg-amber-500" style={{ width: "40%" }} /></div>
              <span className="text-xs text-slate-500">Day 2-3</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-24 text-xs font-medium text-slate-500">Approval</span>
              <div className="h-2 flex-1 rounded-full bg-emerald-100"><div className="h-2 rounded-full bg-emerald-500" style={{ width: "60%" }} /></div>
              <span className="text-xs text-slate-500">Day 4</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-24 text-xs font-medium text-slate-500">Payment</span>
              <div className="h-2 flex-1 rounded-full bg-cyan-100"><div className="h-2 rounded-full bg-cyan-500" style={{ width: "80%" }} /></div>
              <span className="text-xs text-slate-500">Day 5-7</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm text-sm text-slate-600 space-y-4">
          <h2 className="text-base font-semibold text-slate-900">Rejection Reasons</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Invalid or mismatched order ID</li>
            <li>Insufficient or unclear documentation</li>
            <li>Refund request submitted after eligibility period</li>
            <li>Fraudulent or suspicious activity detected</li>
            <li>Order already refunded through the platform</li>
          </ul>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm text-sm text-slate-600">
          <h2 className="text-base font-semibold text-slate-900 mb-2">Contact Support</h2>
          <p>If you have questions about the refund process, contact us at support@dealflowportal.demo or call +91-1800-123-4567.</p>
        </div>
      </div>
    </div>
  );
}
