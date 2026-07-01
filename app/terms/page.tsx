export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Terms of Service</h1>
      <div className="prose prose-sm prose-slate max-w-none">
        <p className="text-slate-500 text-sm mb-4">Last updated: July 2026</p>

        <h2 className="text-lg font-semibold text-slate-900 mt-8 mb-3">1. Acceptance of Terms</h2>
        <p className="text-sm text-slate-600 leading-relaxed mb-4">
          By accessing or using DealFlow Portal, you agree to be bound by these Terms of Service. If you do not agree,
          you may not use the platform.
        </p>

        <h2 className="text-lg font-semibold text-slate-900 mt-8 mb-3">2. Account Registration</h2>
        <p className="text-sm text-slate-600 leading-relaxed mb-4">
          You must provide accurate information when creating an account. You are responsible for maintaining the
          confidentiality of your login credentials. You must notify us immediately of any unauthorized use.
        </p>

        <h2 className="text-lg font-semibold text-slate-900 mt-8 mb-3">3. Orders & Refunds</h2>
        <p className="text-sm text-slate-600 leading-relaxed mb-4">
          Orders are processed according to our Refund Policy. We reserve the right to reject or refund orders at our
          discretion. All refund requests are reviewed on a case-by-case basis.
        </p>

        <h2 className="text-lg font-semibold text-slate-900 mt-8 mb-3">4. Prohibited Activities</h2>
        <p className="text-sm text-slate-600 leading-relaxed mb-4">
          You agree not to use the platform for any unlawful purpose, to impersonate any person, to interfere with the
          platform&apos;s operation, or to attempt to access data that does not belong to you.
        </p>

        <h2 className="text-lg font-semibold text-slate-900 mt-8 mb-3">5. Limitation of Liability</h2>
        <p className="text-sm text-slate-600 leading-relaxed mb-4">
          DealFlow Portal is provided as a demo platform. We are not liable for any damages arising from your use of
          the platform. No real financial transactions occur through this platform.
        </p>

        <div className="mt-8 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <p className="text-xs text-slate-400">
            Template terms of service. Review with legal counsel before launch.
          </p>
        </div>
      </div>
    </div>
  );
}
