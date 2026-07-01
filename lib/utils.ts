export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    active: "bg-emerald-100 text-emerald-700 border-emerald-200",
    closing_soon: "bg-amber-100 text-amber-700 border-amber-200",
    expired: "bg-slate-100 text-slate-500 border-slate-200",
    submitted: "bg-blue-100 text-blue-700 border-blue-200",
    under_review: "bg-cyan-100 text-cyan-700 border-cyan-200",
    approved: "bg-emerald-100 text-emerald-700 border-emerald-200",
    processing: "bg-violet-100 text-violet-700 border-violet-200",
    completed: "bg-emerald-100 text-emerald-700 border-emerald-200",
    rejected: "bg-red-100 text-red-700 border-red-200",
    documents_received: "bg-indigo-100 text-indigo-700 border-indigo-200",
    verification: "bg-amber-100 text-amber-700 border-amber-200",
    paid: "bg-emerald-100 text-emerald-700 border-emerald-200",
  };
  return map[status] ?? "bg-slate-100 text-slate-600 border-slate-200";
}

export function getStatusLabel(status: string): string {
  const map: Record<string, string> = {
    submitted: "Submitted",
    under_review: "Under Review",
    approved: "Approved",
    processing: "Refund Processing",
    completed: "Completed",
    rejected: "Rejected",
    closing_soon: "Closing Soon",
    expired: "Expired",
    active: "Active",
    documents_received: "Documents Received",
    verification: "Verification",
    paid: "Paid",
  };
  return map[status] ?? status;
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function maskUpi(upi: string): string {
  if (!upi || upi.length < 3) return upi;
  return upi.substring(0, 3) + "***@" + upi.split("@")[1] || "***";
}

export function maskBankAccount(acc: string): string {
  if (!acc || acc.length < 4) return "****";
  return "****" + acc.slice(-4);
}
