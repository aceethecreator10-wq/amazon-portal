export default function HelpPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Help / Contact</h1>
      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-3">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-slate-900">How do I track my order?</h3>
              <p className="text-sm text-slate-500 mt-1">Go to the Track page and enter your Tracking ID (e.g., DF-ORD-1001) to see your order status.</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-slate-900">How do I request a refund?</h3>
              <p className="text-sm text-slate-500 mt-1">Visit the Refund page, enter your Tracking ID, fill in the required details, and submit your request.</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-slate-900">What is the refund processing time?</h3>
              <p className="text-sm text-slate-500 mt-1">Refunds are typically processed within 5-7 business days after document verification.</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-slate-900">How do I become a mediator?</h3>
              <p className="text-sm text-slate-500 mt-1">Contact the admin team to discuss mediator partnership opportunities.</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-3">Contact Us</h2>
          <div className="text-sm text-slate-600 space-y-2">
            <p>Email: support@dealflowportal.demo</p>
            <p>Phone: +91-1800-123-4567</p>
            <p>Working Hours: Mon - Sat, 10:00 AM - 7:00 PM IST</p>
          </div>
        </div>
      </div>
    </div>
  );
}
