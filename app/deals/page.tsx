"use client";

import { useState, useEffect, useMemo } from "react";
import DealCard from "@/components/DealCard";
import SearchFilterBar from "@/components/SearchFilterBar";
import { fetchDeals } from "@/lib/supabase/deals";

const platforms = ["All", "Amazon", "Flipkart", "Myntra"];
const categories = ["All", "Electronics", "Fashion", "Audio", "Appliances"];

export default function DealsPage() {
  const [deals, setDeals] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [platform, setPlatform] = useState("All");
  const [category, setCategory] = useState("All");
  const [activeOnly, setActiveOnly] = useState(false);
  const [sort, setSort] = useState("newest");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!loaded) {
      fetchDeals().then((res) => { setDeals(res.deals); setLoaded(true); });
    }
  }, [loaded]);

  const filtered = useMemo(() => {
    let result = [...deals];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((d) => d.title.toLowerCase().includes(q) || d.platform.toLowerCase().includes(q));
    }
    if (platform !== "All") result = result.filter((d) => d.platform === platform);
    if (category !== "All") result = result.filter((d) => d.category === category);
    if (activeOnly) result = result.filter((d) => d.status !== "expired");
    result.sort((a, b) => {
      if (sort === "savings") {
        const aSave = (a.original_price || 0) - (a.effective_price || 0);
        const bSave = (b.original_price || 0) - (b.effective_price || 0);
        return bSave - aSave;
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
    return result;
  }, [deals, search, platform, category, activeOnly, sort]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Live Deals</h1>
        <p className="text-sm text-slate-500 mt-1">Browse active deals and submit your order</p>
      </div>
      <div className="space-y-4 mb-6">
        <SearchFilterBar searchPlaceholder="Search deals..." searchValue={search} onSearchChange={setSearch} />
        <div className="flex flex-wrap gap-2">
          {platforms.map((p) => (
            <button key={p} onClick={() => setPlatform(p)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${platform === p ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-600 border-slate-300 hover:bg-slate-50"}`}>{p}</button>
          ))}
          <span className="w-px bg-slate-200 mx-1" />
          {categories.map((c) => (
            <button key={c} onClick={() => setCategory(c)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${category === c ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-600 border-slate-300 hover:bg-slate-50"}`}>{c}</button>
          ))}
          <span className="w-px bg-slate-200 mx-1" />
          <button onClick={() => setActiveOnly(!activeOnly)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${activeOnly ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-slate-600 border-slate-300 hover:bg-slate-50"}`}>Active Only</button>
          <select value={sort} onChange={(e) => setSort(e.target.value)}
            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 bg-white text-slate-600">
            <option value="newest">Newest</option>
            <option value="savings">Best Savings</option>
          </select>
        </div>
      </div>
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
          <p className="text-sm text-slate-500">No deals match your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((deal: any) => <DealCard key={deal.id} deal={deal} />)}
        </div>
      )}
    </div>
  );
}
