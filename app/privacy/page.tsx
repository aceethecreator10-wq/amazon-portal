export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Privacy Policy</h1>
      <div className="prose prose-sm prose-slate max-w-none">
        <p className="text-slate-500 text-sm mb-4">Last updated: July 2026</p>

        <h2 className="text-lg font-semibold text-slate-900 mt-8 mb-3">1. Information We Collect</h2>
        <p className="text-sm text-slate-600 leading-relaxed mb-4">
          DealFlow Portal collects information you provide when creating an account, submitting orders, or requesting refunds.
          This includes your name, email address, phone number, and order details. We do not store full payment card numbers
          or complete bank account details. Any financial information you provide is masked or truncated.
        </p>

        <h2 className="text-lg font-semibold text-slate-900 mt-8 mb-3">2. How We Use Your Information</h2>
        <p className="text-sm text-slate-600 leading-relaxed mb-4">
          We use your information to process orders, manage refunds, communicate with you about your account, and improve our
          services. We do not sell your personal data to third parties.
        </p>

        <h2 className="text-lg font-semibold text-slate-900 mt-8 mb-3">3. Data Storage & Security</h2>
        <p className="text-sm text-slate-600 leading-relaxed mb-4">
          Your data is stored securely using industry-standard encryption. We use Supabase for database and authentication,
          with row-level security ensuring that only authorized users can access their own data.
        </p>

        <h2 className="text-lg font-semibold text-slate-900 mt-8 mb-3">4. Data Retention</h2>
        <p className="text-sm text-slate-600 leading-relaxed mb-4">
          We retain your account data for as long as your account is active. You may request deletion of your account and
          associated data by contacting us. Order and refund records may be retained for legitimate business purposes.
        </p>

        <h2 className="text-lg font-semibold text-slate-900 mt-8 mb-3">5. Contact</h2>
        <p className="text-sm text-slate-600 leading-relaxed mb-4">
          For privacy-related inquiries, contact us at support@dealflowportal.com.
        </p>

        <div className="mt-8 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <p className="text-xs text-slate-400">
            Template privacy policy. Review and customize for your jurisdiction before launch.
          </p>
        </div>
      </div>
    </div>
  );
}
