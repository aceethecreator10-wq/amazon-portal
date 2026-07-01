export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Terms of Service</h1>
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm text-sm text-slate-600 space-y-4">
        {/* PRODUCTION NOTE: Replace this placeholder with legally reviewed terms */}
        <p>This is a demo application. These terms are placeholder content and are not legally binding.</p>
        <h2 className="text-base font-semibold text-slate-900">1. Acceptance of Terms</h2>
        <p>By using this demo application, you agree to these placeholder terms. This is a demonstration only.</p>
        <h2 className="text-base font-semibold text-slate-900">2. Demo Data</h2>
        <p>All deals, orders, and refunds shown are demo/fake data. No real transactions occur on this platform.</p>
        <h2 className="text-base font-semibold text-slate-900">3. User Responsibilities</h2>
        <p>Users agree not to enter real personal or financial information in this demo application.</p>
        <h2 className="text-base font-semibold text-slate-900">4. Limitation of Liability</h2>
        <p>This demo is provided &ldquo;as is&rdquo; without any warranties. The creators are not responsible for any issues arising from use.</p>
        <p className="text-xs text-slate-400 mt-4">Last updated: June 2026</p>
      </div>
    </div>
  );
}
