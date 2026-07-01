// PRODUCTION NOTE: Replace with database models (e.g. Prisma/Supabase) before going live

export type UserRole = "buyer" | "mediator" | "admin";

export type DealStatus = "active" | "closing_soon" | "expired";

export type OrderStatus =
  | "submitted"
  | "under_review"
  | "approved"
  | "processing"
  | "completed"
  | "rejected";

export type RefundStatus =
  | "submitted"
  | "documents_received"
  | "verification"
  | "approved"
  | "paid"
  | "rejected";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  whatsapp: string;
  createdAt: string;
}

export interface Deal {
  id: string;
  title: string;
  platform: string;
  category: string;
  originalPrice: number;
  dealPrice: number;
  cashbackAmount: number;
  effectivePrice: number;
  status: DealStatus;
  image?: string;
  createdAt: string;
}

export interface Order {
  id: string;
  trackingId: string;
  buyerId: string;
  buyerName: string;
  whatsapp: string;
  email: string;
  dealId: string;
  platform: string;
  orderId: string;
  amount: number;
  status: OrderStatus;
  assignedMediatorId?: string;
  screenshotUrl?: string;
  notes: string;
  statusLogs: StatusLog[];
  createdAt: string;
  updatedAt: string;
}

export interface RefundRequest {
  id: string;
  refundId: string;
  trackingId: string;
  orderId: string;
  buyerId: string;
  paymentMethod: "upi" | "bank_transfer";
  upiMasked: string;
  bankLast4: string;
  accountHolder: string;
  ifsc: string;
  whatsapp: string;
  reason: string;
  status: RefundStatus;
  assignedMediatorId?: string;
  statusLogs: StatusLog[];
  createdAt: string;
  updatedAt: string;
}

export interface StatusLog {
  id: string;
  status: string;
  note: string;
  changedBy: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

// PRODUCTION NOTE: Replace with real UUID/DB-generated IDs
export function generateId(prefix: string): string {
  const num = Math.floor(Math.random() * 9000) + 1000;
  return `${prefix}-${num}`;
}

export function generateTrackingId(): string {
  return generateId("DF-ORD");
}

export function generateRefundId(): string {
  return generateId("DF-REF");
}
