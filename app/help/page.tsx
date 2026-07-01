export default function HelpPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Help & FAQ</h1>

      <div className="space-y-4 mb-12">
        {[
          { q: "How do I submit an order?", a: "Browse Live Deals, select a deal, and click 'Submit Order'. Fill in your details and the order will be processed." },
          { q: "How do I track my order?", a: "Go to the Track page and enter your Tracking ID (e.g., DF-ORD-100001). You can see the current status and timeline." },
          { q: "How do I request a refund?", a: "Go to the Refund page, enter your Tracking ID, provide payment details and reason, and submit the request." },
          { q: "Who can use the mediator dashboard?", a: "Mediators are assigned cases by administrators. They can review and update status on assigned orders and refunds." },
          { q: "How do I contact support?", a: "For support inquiries, email support@dealflowportal.com. We aim to respond within 24 hours." },
        ].map((faq, i) => (
          <details key={i} className="bg-white rounded-xl border border-slate-200 group">
            <summary className="px-5 py-4 cursor-pointer text-sm font-medium text-slate-900 list-none flex items-center justify-between">
              {faq.q}
              <svg className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="px-5 pb-4 text-sm text-slate-600 leading-relaxed">{faq.a}</div>
          </details>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-2">Still need help?</h2>
        <p className="text-sm text-slate-600 mb-4">Contact our support team and we&apos;ll get back to you.</p>
        <p className="text-sm text-blue-600 font-medium">support@dealflowportal.com</p>
      </div>
    </div>
  );
}
