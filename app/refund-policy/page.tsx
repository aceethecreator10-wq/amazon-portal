export default function RefundPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Refund Policy</h1>
      <div className="prose prose-sm prose-slate max-w-none">
        <p className="text-slate-500 text-sm mb-4">Last updated: July 2026</p>

        <h2 className="text-lg font-semibold text-slate-900 mt-8 mb-3">Eligibility</h2>
        <p className="text-sm text-slate-600 leading-relaxed mb-4">
          Refund requests are accepted for orders within 30 days of the order date. Eligible reasons include:
          product not delivered, wrong item received, defective product, or order cancelled by seller after payment.
        </p>

        <h2 className="text-lg font-semibold text-slate-900 mt-8 mb-3">Required Documentation</h2>
        <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1 mb-4">
          <li>Tracking ID or order reference number</li>
          <li>Proof of purchase (order confirmation screenshot)</li>
          <li>Reason for refund request</li>
          <li>Payment details for return (UPI or bank account)</li>
        </ul>

        <h2 className="text-lg font-semibold text-slate-900 mt-8 mb-3">Processing Timeline</h2>
        <div className="space-y-3 mb-4">
          {[
            { step: "1. Submitted", desc: "Your request is received and queued for review" },
            { step: "2. Documents Received", desc: "Uploaded documents are verified" },
            { step: "3. Verification", desc: "Case is reviewed by a mediator" },
            { step: "4. Approved / Rejected", desc: "Decision is made based on policy" },
            { step: "5. Paid", desc: "Refund amount is processed to your account" },
          ].map((s) => (
            <div key={s.step} className="flex gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-slate-900">{s.step}</p>
                <p className="text-xs text-slate-500">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-lg font-semibold text-slate-900 mt-8 mb-3">Rejection Reasons</h2>
        <p className="text-sm text-slate-600 leading-relaxed mb-4">
          Refund requests may be rejected if the documentation is insufficient, the order is outside the eligible
          window, or the reason does not match our refund policy criteria.
        </p>

        <h2 className="text-lg font-semibold text-slate-900 mt-8 mb-3">Contact</h2>
        <p className="text-sm text-slate-600 leading-relaxed mb-4">
          For questions about this policy, contact us at support@dealflowportal.com.
        </p>

        <div className="mt-8 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <p className="text-xs text-slate-400">
            Template refund policy. Review and customize for your business before launch.
          </p>
        </div>
      </div>
    </div>
  );
}
