export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Privacy Policy</h1>
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm text-sm text-slate-600 space-y-4">
        {/* PRODUCTION NOTE: Replace this placeholder with a legally reviewed privacy policy */}
        <p>This is a demo application. No real user data is collected, stored, or processed.</p>
        <h2 className="text-base font-semibold text-slate-900">1. Information We Collect</h2>
        <p>In this demo, we store only the information you voluntarily enter in forms. This data is stored locally in your browser only and is not transmitted to any server.</p>
        <h2 className="text-base font-semibold text-slate-900">2. How We Use Information</h2>
        <p>Demo data is used solely for demonstrating the application workflow. We do not share, sell, or process data for any real purpose.</p>
        <h2 className="text-base font-semibold text-slate-900">3. Data Security</h2>
        <p>All data in this demo is stored in your browser&apos;s localStorage. This is not a secure storage method. Do not enter real personal or financial information.</p>
        <h2 className="text-base font-semibold text-slate-900">4. Contact</h2>
        <p>For questions about this policy, contact support@dealflowportal.demo</p>
        <p className="text-xs text-slate-400 mt-4">Last updated: June 2026</p>
      </div>
    </div>
  );
}
