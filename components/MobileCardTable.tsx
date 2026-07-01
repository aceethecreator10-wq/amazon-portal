// Renders data as a table on desktop, as stacked cards on mobile
"use client";

interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
  hideOnMobile?: boolean;
}

interface MobileCardTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  emptyMessage?: string;
  mobileCardHeader?: (row: T) => React.ReactNode;
  mobileCardFooter?: (row: T) => React.ReactNode;
}

export default function MobileCardTable<T>({
  columns,
  data,
  keyExtractor,
  emptyMessage = "No data found",
  mobileCardHeader,
  mobileCardFooter,
}: MobileCardTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
        <p className="text-sm text-slate-500">{emptyMessage}</p>
      </div>
    );
  }

  const visibleColumns = columns.filter((c) => !c.hideOnMobile);

  return (
    <>
      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto bg-white rounded-xl border border-slate-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider ${col.className || ""}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((row) => (
              <tr key={keyExtractor(row)} className="hover:bg-slate-50 transition-colors">
                {columns.map((col) => (
                  <td key={col.key} className={`px-4 py-3 text-sm text-slate-700 ${col.className || ""}`}>
                    {col.render
                      ? col.render(row)
                      : String((row as Record<string, unknown>)[col.key] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden space-y-3">
        {data.map((row) => (
          <div key={keyExtractor(row)} className="bg-white rounded-xl border border-slate-200 shadow-sm">
            {mobileCardHeader && (
              <div className="px-4 py-3 border-b border-slate-100">
                {mobileCardHeader(row)}
              </div>
            )}
            <div className="px-4 py-3 space-y-2.5">
              {visibleColumns.map((col) => {
                if (col.key === "actions") return null;
                return (
                  <div key={col.key} className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-medium">{col.header}</span>
                    <span className="text-sm text-slate-900 text-right">
                      {col.render
                        ? col.render(row)
                        : String((row as Record<string, unknown>)[col.key] ?? "")}
                    </span>
                  </div>
                );
              })}
            </div>
            {mobileCardFooter && (
              <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/50 rounded-b-xl">
                {mobileCardFooter(row)}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
