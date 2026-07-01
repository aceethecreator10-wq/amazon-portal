interface StatCardProps {
  label: string;
  value: string | number;
  icon?: string;
  trend?: { label: string; positive: boolean };
  color?: string;
}

export default function StatCard({ label, value, trend, color = "blue" }: StatCardProps) {
  const gradients: Record<string, string> = {
    blue: "from-blue-500 to-blue-600",
    emerald: "from-emerald-500 to-emerald-600",
    amber: "from-amber-500 to-amber-600",
    violet: "from-violet-500 to-violet-600",
    cyan: "from-cyan-500 to-cyan-600",
    rose: "from-rose-500 to-rose-600",
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</p>
          <p className="text-2xl font-bold text-slate-900">{value}</p>
          {trend && (
            <p className={`text-xs font-medium ${trend.positive ? "text-emerald-600" : "text-red-500"}`}>
              {trend.label}
            </p>
          )}
        </div>
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${gradients[color] || gradients.blue} flex items-center justify-center shadow-sm`}>
          <span className="text-white font-bold text-lg">{label.charAt(0)}</span>
        </div>
      </div>
    </div>
  );
}
