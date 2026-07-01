export default function RefundPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Refund Policy</h1>
      <p className="text-sm text-slate-500 mb-8">Last updated: July 2026</p>

      <div className="space-y-8 text-sm text-slate-600 leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-3">Eligibility</h2>
          <p>Refund requests must be submitted within 30 days of the order date. Eligible reasons include: item not delivered, defective product, incorrect item shipped, or order cancelled by the platform. Each request is reviewed on a case-by-case basis.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-3">Required Documentation</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Valid tracking ID (DF-ORD-XXXXXX format)</li>
            <li>Proof of purchase or order screenshot</li>
            <li>Reason for refund with supporting evidence</li>
            <li>Valid payout destination (UPI ID or bank account last 4 digits + IFSC)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-3">Processing Timeline</h2>
          <div className="space-y-3">
            <div className="flex gap-3"><span className="font-medium text-slate-900 w-32 shrink-0">1. Submitted</span><span>Refund request is received and awaits initial review.</span></div>
            <div className="flex gap-3"><span className="font-medium text-slate-900 w-32 shrink-0">2. Documents</span><span>Supporting documents are verified.</span></div>
            <div className="flex gap-3"><span className="font-medium text-slate-900 w-32 shrink-0">3. Verification</span><span>Order details and eligibility are confirmed.</span></div>
            <div className="flex gap-3"><span className="font-medium text-slate-900 w-32 shrink-0">4. Approved</span><span>Refund is approved and queued for payout.</span></div>
            <div className="flex gap-3"><span className="font-medium text-slate-900 w-32 shrink-0">5. Paid</span><span>Refund amount is disbursed to the provided payout destination.</span></div>
          </div>
          <p className="mt-4">Estimated processing time: 5&ndash;10 business days after document verification.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-3">Rejection Reasons</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Refund requested after 30-day window</li>
            <li>Insufficient or fraudulent documentation</li>
            <li>Order already refunded by the original platform</li>
            <li>Violation of terms of service</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-3">Contact</h2>
          <p>For refund-related inquiries, contact support@dealflowportal.com.</p>
        </section>
      </div>

      <p className="text-xs text-slate-400 mt-10 border-t border-slate-100 pt-4">This policy is a template and should be reviewed by legal counsel before official launch.</p>
    </div>
  );
}
