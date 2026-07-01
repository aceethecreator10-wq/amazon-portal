// ============================================================
// Database types matching the Supabase schema.
// Generate these automatically with:
//   npx supabase gen types typescript --linked > lib/supabase/types.ts
// ============================================================

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow;
        Insert: ProfileInsert;
        Update: ProfileUpdate;
      };
      deals: {
        Row: DealRow;
        Insert: DealInsert;
        Update: DealUpdate;
      };
      orders: {
        Row: OrderRow;
        Insert: OrderInsert;
        Update: OrderUpdate;
      };
      refund_requests: {
        Row: RefundRequestRow;
        Insert: RefundRequestInsert;
        Update: RefundRequestUpdate;
      };
      status_logs: {
        Row: StatusLogRow;
        Insert: StatusLogInsert;
        Update: StatusLogUpdate;
      };
      notifications: {
        Row: NotificationRow;
        Insert: NotificationInsert;
        Update: NotificationUpdate;
      };
      audit_logs: {
        Row: AuditLogRow;
        Insert: AuditLogInsert;
        Update: AuditLogUpdate;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

// ---- Profiles ----
export interface ProfileRow {
  id: string;
  full_name: string;
  email: string;
  whatsapp: string | null;
  role: "buyer" | "mediator" | "admin";
  avatar_url: string | null;
  status: "active" | "suspended";
  created_at: string;
  updated_at: string;
}
export interface ProfileInsert {
  id: string;
  full_name: string;
  email: string;
  whatsapp?: string | null;
  role?: "buyer" | "mediator" | "admin";
  avatar_url?: string | null;
  status?: "active" | "suspended";
}
export interface ProfileUpdate {
  full_name?: string;
  email?: string;
  whatsapp?: string | null;
  role?: "buyer" | "mediator" | "admin";
  avatar_url?: string | null;
  status?: "active" | "suspended";
}

// ---- Deals ----
export interface DealRow {
  id: string;
  title: string;
  platform: string;
  category: string | null;
  description: string | null;
  original_price: number | null;
  deal_price: number | null;
  cashback_amount: number | null;
  effective_price: number | null;
  deal_url: string | null;
  image_url: string | null;
  status: "active" | "closing_soon" | "expired" | "draft";
  created_by: string | null;
  created_at: string;
  updated_at: string;
}
export interface DealInsert {
  title: string;
  platform: string;
  category?: string | null;
  description?: string | null;
  original_price?: number | null;
  deal_price?: number | null;
  cashback_amount?: number | null;
  effective_price?: number | null;
  deal_url?: string | null;
  image_url?: string | null;
  status?: "active" | "closing_soon" | "expired" | "draft";
  created_by?: string | null;
}
export interface DealUpdate {
  title?: string;
  platform?: string;
  category?: string | null;
  description?: string | null;
  original_price?: number | null;
  deal_price?: number | null;
  cashback_amount?: number | null;
  effective_price?: number | null;
  deal_url?: string | null;
  image_url?: string | null;
  status?: "active" | "closing_soon" | "expired" | "draft";
}

// ---- Orders ----
export interface OrderRow {
  id: string;
  tracking_id: string;
  buyer_id: string | null;
  buyer_name: string;
  email: string | null;
  whatsapp: string | null;
  deal_id: string | null;
  platform: string | null;
  order_number: string | null;
  amount: number | null;
  order_date: string | null;
  screenshot_url: string | null;
  status: "submitted" | "under_review" | "approved" | "rejected" | "refund_processing" | "completed";
  assigned_mediator_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}
export interface OrderInsert {
  tracking_id?: string;
  buyer_id?: string | null;
  buyer_name: string;
  email?: string | null;
  whatsapp?: string | null;
  deal_id?: string | null;
  platform?: string | null;
  order_number?: string | null;
  amount?: number | null;
  order_date?: string | null;
  screenshot_url?: string | null;
  status?: "submitted" | "under_review" | "approved" | "rejected" | "refund_processing" | "completed";
  assigned_mediator_id?: string | null;
  notes?: string | null;
}
export interface OrderUpdate {
  buyer_name?: string;
  email?: string | null;
  whatsapp?: string | null;
  deal_id?: string | null;
  platform?: string | null;
  order_number?: string | null;
  amount?: number | null;
  order_date?: string | null;
  screenshot_url?: string | null;
  status?: "submitted" | "under_review" | "approved" | "rejected" | "refund_processing" | "completed";
  assigned_mediator_id?: string | null;
  notes?: string | null;
}

// ---- Refund Requests ----
export interface RefundRequestRow {
  id: string;
  refund_id: string;
  order_id: string | null;
  tracking_id: string | null;
  buyer_id: string | null;
  payment_method: "upi" | "bank_transfer" | null;
  upi_masked: string | null;
  bank_last4: string | null;
  account_holder: string | null;
  ifsc: string | null;
  whatsapp: string | null;
  reason: string | null;
  review_screenshot_url: string | null;
  delivery_screenshot_url: string | null;
  status: "submitted" | "documents_received" | "verification" | "approved" | "rejected" | "paid";
  assigned_mediator_id: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}
export interface RefundRequestInsert {
  refund_id?: string;
  order_id?: string | null;
  tracking_id?: string | null;
  buyer_id?: string | null;
  payment_method?: "upi" | "bank_transfer" | null;
  upi_masked?: string | null;
  bank_last4?: string | null;
  account_holder?: string | null;
  ifsc?: string | null;
  whatsapp?: string | null;
  reason?: string | null;
  review_screenshot_url?: string | null;
  delivery_screenshot_url?: string | null;
  status?: "submitted" | "documents_received" | "verification" | "approved" | "rejected" | "paid";
  assigned_mediator_id?: string | null;
  admin_notes?: string | null;
}
export interface RefundRequestUpdate {
  payment_method?: "upi" | "bank_transfer" | null;
  upi_masked?: string | null;
  bank_last4?: string | null;
  account_holder?: string | null;
  ifsc?: string | null;
  whatsapp?: string | null;
  reason?: string | null;
  review_screenshot_url?: string | null;
  delivery_screenshot_url?: string | null;
  status?: "submitted" | "documents_received" | "verification" | "approved" | "rejected" | "paid";
  assigned_mediator_id?: string | null;
  admin_notes?: string | null;
}

// ---- Status Logs ----
export interface StatusLogRow {
  id: string;
  entity_type: "order" | "refund";
  entity_id: string;
  old_status: string | null;
  new_status: string;
  note: string | null;
  changed_by: string | null;
  created_at: string;
}
export interface StatusLogInsert {
  entity_type: "order" | "refund";
  entity_id: string;
  old_status?: string | null;
  new_status: string;
  note?: string | null;
  changed_by?: string | null;
}
export interface StatusLogUpdate {
  note?: string | null;
}

// ---- Notifications ----
export interface NotificationRow {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string | null;
  read: boolean;
  created_at: string;
}
export interface NotificationInsert {
  user_id: string;
  title: string;
  message: string;
  type?: string | null;
  read?: boolean;
}
export interface NotificationUpdate {
  read?: boolean;
}

// ---- Audit Logs ----
export interface AuditLogRow {
  id: string;
  actor_id: string | null;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  metadata: Json | null;
  created_at: string;
}
export interface AuditLogInsert {
  actor_id?: string | null;
  action: string;
  entity_type?: string | null;
  entity_id?: string | null;
  metadata?: Json | null;
}
export interface AuditLogUpdate {
  metadata?: Json | null;
}
