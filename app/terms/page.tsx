export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Terms of Service</h1>
      <p className="text-sm text-slate-500 mb-8">Last updated: July 2026</p>

      <div className="space-y-8 text-sm text-slate-600 leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-3">1. Acceptance of Terms</h2>
          <p>By accessing or using DealFlow Portal, you agree to be bound by these Terms of Service. If you do not agree, you may not use the platform.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-3">2. Account Registration</h2>
          <p>You must provide accurate and complete information when creating an account. You are responsible for maintaining the confidentiality of your credentials and for all activities under your account. You must be at least 18 years old to use this platform.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-3">3. Orders & Refunds</h2>
          <p>Orders submitted through the platform are processed according to our refund policy. Refund eligibility, timelines, and payout methods are as described in the Refund Policy. We reserve the right to reject refund requests that do not meet eligibility criteria.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-3">4. Prohibited Activities</h2>
          <p>You may not: misuse the platform for fraudulent purposes, attempt to access other users&apos; data, interfere with platform operations, or violate any applicable laws.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-3">5. Limitation of Liability</h2>
          <p>The platform is provided &ldquo;as is&rdquo; without warranties. We are not liable for indirect damages arising from platform use. Total liability is limited to the amount paid for services, if any.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-3">6. Changes to Terms</h2>
          <p>We may update these terms at any time. Continued use after changes constitutes acceptance.</p>
        </section>
      </div>

      <p className="text-xs text-slate-400 mt-10 border-t border-slate-100 pt-4">This document is a template and should be reviewed by legal counsel before official launch.</p>
    </div>
  );
}
