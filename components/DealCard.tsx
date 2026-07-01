import Link from "next/link";
import type { Deal } from "@/lib/types";
import { formatPrice, getStatusColor, getStatusLabel } from "@/lib/utils";
import StatusBadge from "./StatusBadge";

export default function DealCard({ deal }: { deal: Deal }) {
  const savings = deal.originalPrice - deal.effectivePrice;
  const savingPercent = Math.round((savings / deal.originalPrice) * 100);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all hover:border-blue-200 flex flex-col">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900 text-sm leading-snug line-clamp-2">{deal.title}</h3>
          <p className="text-xs text-slate-500 mt-1">{deal.platform} &middot; {deal.category}</p>
        </div>
        <StatusBadge status={deal.status} />
      </div>

      <div className="space-y-1.5 mt-2 flex-1">
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Original</span>
          <span className="text-slate-400 line-through">{formatPrice(deal.originalPrice)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Deal Price</span>
          <span className="font-semibold text-slate-900">{formatPrice(deal.dealPrice)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Cashback</span>
          <span className="text-emerald-600 font-medium">{formatPrice(deal.cashbackAmount)}</span>
        </div>
        <div className="border-t border-slate-100 pt-1.5 mt-1.5 flex justify-between">
          <span className="text-sm font-medium text-slate-700">Effective Price</span>
          <span className="text-lg font-bold text-blue-600">{formatPrice(deal.effectivePrice)}</span>
        </div>
        <div className="text-xs text-emerald-600 font-medium">
          Save {formatPrice(savings)} ({savingPercent}% off)
        </div>
      </div>

      <Link
        href={`/order?deal=${deal.id}`}
        className="mt-4 w-full text-center px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
      >
        Submit Order
      </Link>
    </div>
  );
}
