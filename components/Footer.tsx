import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-3">DealFlow Portal</h3>
            <p className="text-xs text-slate-500">
              Manage deals, orders & refunds in one place.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Links</h3>
            <ul className="space-y-2">
              <li><Link href="/deals" className="text-xs text-slate-500 hover:text-blue-600">Live Deals</Link></li>
              <li><Link href="/order" className="text-xs text-slate-500 hover:text-blue-600">Submit Order</Link></li>
              <li><Link href="/track" className="text-xs text-slate-500 hover:text-blue-600">Track Status</Link></li>
              <li><Link href="/refund" className="text-xs text-slate-500 hover:text-blue-600">Refund Request</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Support</h3>
            <ul className="space-y-2">
              <li><Link href="/help" className="text-xs text-slate-500 hover:text-blue-600">Help / Contact</Link></li>
              <li><Link href="/privacy" className="text-xs text-slate-500 hover:text-blue-600">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-xs text-slate-500 hover:text-blue-600">Terms</Link></li>
              <li><Link href="/refund-policy" className="text-xs text-slate-500 hover:text-blue-600">Refund Policy</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Contact</h3>
            <p className="text-xs text-slate-500">
              support@dealflowportal.demo<br />
              +91-1800-123-4567
            </p>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-400">
            &copy; {new Date().getFullYear()} DealFlow Portal. Demo application. No real transactions.
          </p>
        </div>
      </div>
    </footer>
  );
}
