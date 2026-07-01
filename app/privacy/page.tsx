export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Privacy Policy</h1>
      <p className="text-sm text-slate-500 mb-8">Last updated: July 2026</p>

      <div className="space-y-8 text-sm text-slate-600 leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-3">1. Information We Collect</h2>
          <p>We collect information you provide directly when registering and using the platform: name, email address, WhatsApp number, and payout details necessary for processing refunds (UPI ID or bank account last 4 digits and IFSC).</p>
          <p className="mt-2">We do not collect full bank account numbers, UPI PINs, passwords, or any sensitive financial credentials beyond what is minimally required for refund processing.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-3">2. How We Use Your Information</h2>
          <p>Your information is used solely for: processing orders and refunds, communicating status updates, verifying your identity, and improving platform functionality. We do not sell, rent, or share your personal data with third parties except as required to process payouts via our payment partners.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-3">3. Data Storage & Security</h2>
          <p>Data is stored in encrypted databases with row-level security. Each user can only access their own data. File uploads are stored in private storage buckets with signed URL access. We implement industry-standard security measures including encryption in transit and at rest.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-3">4. Data Retention</h2>
          <p>We retain your data for as long as your account is active or as needed to provide services. You may request deletion of your account and associated data by contacting support.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-3">5. Contact</h2>
          <p>For privacy-related inquiries, contact us at support@dealflowportal.com.</p>
        </section>
      </div>

      <p className="text-xs text-slate-400 mt-10 border-t border-slate-100 pt-4">This policy is a template and should be reviewed by legal counsel before official launch.</p>
    </div>
  );
}
