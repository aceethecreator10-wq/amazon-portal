-- ============================================================
-- DealFlow Portal — Seed Data
-- ============================================================
-- IMPORTANT: Before running this seed:
-- 1. Create auth users in Supabase Auth dashboard (Authentication > Users)
-- 2. Copy their UUIDs and replace the hardcoded IDs below
-- 3. Then run this SQL in Supabase SQL Editor
-- ============================================================

-- Demo user UUIDs (REPLACE with actual Supabase Auth user IDs)
-- Create these users in Supabase Auth with passwords:
--   buyer@demo.com / Demo@123
--   mediator@demo.com / Demo@123
--   admin@demo.com / Admin@123
-- ============================================================

DO $$
DECLARE
  buyer_id UUID := '00000000-0000-0000-0000-000000000001';
  mediator_id UUID := '00000000-0000-0000-0000-000000000002';
  admin_id UUID := '00000000-0000-0000-0000-000000000003';
  deal1_id UUID; deal2_id UUID; deal3_id UUID; deal4_id UUID;
  deal5_id UUID; deal6_id UUID; deal7_id UUID; deal8_id UUID;
  ord1_id UUID; ord2_id UUID; ord3_id UUID; ord4_id UUID; ord5_id UUID;
  ord6_id UUID; ord7_id UUID; ord8_id UUID; ord9_id UUID; ord10_id UUID;
  ref1_id UUID; ref2_id UUID; ref3_id UUID; ref4_id UUID; ref5_id UUID; ref6_id UUID;
BEGIN

-- ============================================================
-- PROFILES (only if auth users exist)
-- ============================================================
INSERT INTO public.profiles (id, full_name, email, whatsapp, role, status) VALUES
  (buyer_id, 'Demo Buyer', 'buyer@demo.com', '+91-9876543210', 'buyer', 'active'),
  (mediator_id, 'Demo Mediator', 'mediator@demo.com', '+91-9876543211', 'mediator', 'active'),
  (admin_id, 'Demo Admin', 'admin@demo.com', '+91-9876543212', 'admin', 'active')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- DEALS
-- ============================================================
INSERT INTO public.deals (title, platform, category, original_price, deal_price, cashback_amount, effective_price, status, created_by) VALUES
  ('iPhone 15 Pro Max 256GB', 'Amazon', 'Electronics', 159900, 142990, 8500, 134490, 'active', admin_id)
  RETURNING id INTO deal1_id;

INSERT INTO public.deals (title, platform, category, original_price, deal_price, cashback_amount, effective_price, status, created_by) VALUES
  ('Samsung Galaxy S24 Ultra', 'Flipkart', 'Electronics', 134999, 119999, 8000, 111999, 'active', admin_id)
  RETURNING id INTO deal2_id;

INSERT INTO public.deals (title, platform, category, original_price, deal_price, cashback_amount, effective_price, status, created_by) VALUES
  ('Sony WH-1000XM5 Headphones', 'Amazon', 'Audio', 29990, 25990, 3000, 22990, 'closing_soon', admin_id)
  RETURNING id INTO deal3_id;

INSERT INTO public.deals (title, platform, category, original_price, deal_price, cashback_amount, effective_price, status, created_by) VALUES
  ('Nike Air Max 270 Shoes', 'Myntra', 'Fashion', 16995, 11995, 2000, 9995, 'active', admin_id)
  RETURNING id INTO deal4_id;

INSERT INTO public.deals (title, platform, category, original_price, deal_price, cashback_amount, effective_price, status, created_by) VALUES
  ('MacBook Air M3 15-inch', 'Amazon', 'Electronics', 164900, 149900, 12000, 137900, 'active', admin_id)
  RETURNING id INTO deal5_id;

INSERT INTO public.deals (title, platform, category, original_price, deal_price, cashback_amount, effective_price, status, created_by) VALUES
  ('Dyson V15 Detect Vacuum', 'Flipkart', 'Appliances', 62900, 54900, 5000, 49900, 'expired', admin_id)
  RETURNING id INTO deal6_id;

INSERT INTO public.deals (title, platform, category, original_price, deal_price, cashback_amount, effective_price, status, created_by) VALUES
  ('H&M Slim Fit Blazer', 'Myntra', 'Fashion', 5999, 3499, 1000, 2499, 'closing_soon', admin_id)
  RETURNING id INTO deal7_id;

INSERT INTO public.deals (title, platform, category, original_price, deal_price, cashback_amount, effective_price, status, created_by) VALUES
  ('boAt Airdopes 141 Pro', 'Amazon', 'Audio', 2999, 1799, 500, 1299, 'active', admin_id)
  RETURNING id INTO deal8_id;

-- ============================================================
-- ORDERS
-- ============================================================
INSERT INTO public.orders (tracking_id, buyer_id, buyer_name, email, whatsapp, deal_id, platform, order_number, amount, status, assigned_mediator_id, notes)
  VALUES ('DF-ORD-100001', buyer_id, 'Demo Buyer', 'buyer@demo.com', '+91-9876543210', deal1_id, 'Amazon', 'AMZ-ORD-98765', 142990, 'completed', NULL, 'Order delivered on time')
  RETURNING id INTO ord1_id;

INSERT INTO public.orders (tracking_id, buyer_id, buyer_name, email, whatsapp, deal_id, platform, order_number, amount, status, assigned_mediator_id)
  VALUES ('DF-ORD-100002', buyer_id, 'Demo Buyer', 'buyer@demo.com', '+91-9876543210', deal2_id, 'Flipkart', 'FLP-ORD-54321', 119999, 'under_review', mediator_id)
  RETURNING id INTO ord2_id;

INSERT INTO public.orders (tracking_id, buyer_id, buyer_name, email, whatsapp, deal_id, platform, order_number, amount, status)
  VALUES ('DF-ORD-100003', buyer_id, 'Demo Buyer', 'buyer@demo.com', '+91-9876543210', deal4_id, 'Myntra', 'MYN-ORD-11223', 11995, 'submitted')
  RETURNING id INTO ord3_id;

INSERT INTO public.orders (tracking_id, buyer_id, buyer_name, email, whatsapp, deal_id, platform, order_number, amount, status, assigned_mediator_id, notes)
  VALUES ('DF-ORD-100004', buyer_id, 'Demo Buyer', 'buyer@demo.com', '+91-9876543210', deal5_id, 'Amazon', 'AMZ-ORD-77665', 149900, 'approved', mediator_id, 'Payment verified')
  RETURNING id INTO ord4_id;

INSERT INTO public.orders (tracking_id, buyer_id, buyer_name, email, whatsapp, deal_id, platform, order_number, amount, status, assigned_mediator_id, notes)
  VALUES ('DF-ORD-100005', buyer_id, 'Demo Buyer', 'buyer@demo.com', '+91-9876543210', deal3_id, 'Amazon', 'AMZ-ORD-33442', 25990, 'rejected', mediator_id, 'Invalid order ID')
  RETURNING id INTO ord5_id;

INSERT INTO public.orders (tracking_id, buyer_id, buyer_name, email, whatsapp, deal_id, platform, order_number, amount, status, assigned_mediator_id, notes)
  VALUES ('DF-ORD-100006', buyer_id, 'Demo Buyer', 'buyer@demo.com', '+91-9876543210', deal1_id, 'Amazon', 'AMZ-ORD-99881', 142990, 'refund_processing', mediator_id, 'Refund initiated')
  RETURNING id INTO ord6_id;

INSERT INTO public.orders (tracking_id, buyer_id, buyer_name, email, whatsapp, deal_id, platform, order_number, amount, status)
  VALUES ('DF-ORD-100007', buyer_id, 'Demo Buyer', 'buyer@demo.com', '+91-9876543210', deal8_id, 'Amazon', 'AMZ-ORD-55443', 1799, 'submitted')
  RETURNING id INTO ord7_id;

INSERT INTO public.orders (tracking_id, buyer_id, buyer_name, email, whatsapp, deal_id, platform, order_number, amount, status, assigned_mediator_id, notes)
  VALUES ('DF-ORD-100008', buyer_id, 'Demo Buyer', 'buyer@demo.com', '+91-9876543210', deal4_id, 'Myntra', 'MYN-ORD-66778', 11995, 'under_review', mediator_id, 'Awaiting confirmation')
  RETURNING id INTO ord8_id;

INSERT INTO public.orders (tracking_id, buyer_id, buyer_name, email, whatsapp, deal_id, platform, order_number, amount, status)
  VALUES ('DF-ORD-100009', buyer_id, 'Demo Buyer', 'buyer@demo.com', '+91-9876543210', deal2_id, 'Flipkart', 'FLP-ORD-22334', 119999, 'completed')
  RETURNING id INTO ord9_id;

INSERT INTO public.orders (tracking_id, buyer_id, buyer_name, email, whatsapp, deal_id, platform, order_number, amount, status)
  VALUES ('DF-ORD-100010', buyer_id, 'Demo Buyer', 'buyer@demo.com', '+91-9876543210', deal7_id, 'Myntra', 'MYN-ORD-88990', 3499, 'submitted')
  RETURNING id INTO ord10_id;

-- ============================================================
-- REFUND REQUESTS
-- ============================================================
INSERT INTO public.refund_requests (refund_id, order_id, tracking_id, buyer_id, payment_method, upi_masked, bank_last4, account_holder, ifsc, whatsapp, reason, status)
  VALUES ('DF-REF-500001', ord1_id, 'DF-ORD-100001', buyer_id, 'upi', 'demo***@paytm', '6789', 'Demo Buyer', 'PAYTM0123456', '+91-9876543210', 'Product not delivered within promised timeframe', 'paid')
  RETURNING id INTO ref1_id;

INSERT INTO public.refund_requests (refund_id, order_id, tracking_id, buyer_id, payment_method, upi_masked, bank_last4, account_holder, ifsc, whatsapp, reason, status, assigned_mediator_id)
  VALUES ('DF-REF-500002', ord2_id, 'DF-ORD-100002', buyer_id, 'bank_transfer', '', '3456', 'Demo Buyer', 'HDFC0001234', '+91-9876543210', 'Wrong color variant received', 'verification', mediator_id)
  RETURNING id INTO ref2_id;

INSERT INTO public.refund_requests (refund_id, order_id, tracking_id, buyer_id, payment_method, upi_masked, bank_last4, account_holder, ifsc, whatsapp, reason, status)
  VALUES ('DF-REF-500003', ord4_id, 'DF-ORD-100004', buyer_id, 'upi', 'demo***@phonepe', '9012', 'Demo Buyer', 'PHONPE0123456', '+91-9876543210', 'Item defective - screen has dead pixels', 'submitted')
  RETURNING id INTO ref3_id;

INSERT INTO public.refund_requests (refund_id, order_id, tracking_id, buyer_id, payment_method, upi_masked, bank_last4, account_holder, ifsc, whatsapp, reason, status, assigned_mediator_id)
  VALUES ('DF-REF-500004', ord5_id, 'DF-ORD-100005', buyer_id, 'bank_transfer', '', '5678', 'Demo Buyer', 'ICICI0005678', '+91-9876543210', 'Order cancelled by seller after payment', 'documents_received', mediator_id)
  RETURNING id INTO ref4_id;

INSERT INTO public.refund_requests (refund_id, order_id, tracking_id, buyer_id, payment_method, upi_masked, bank_last4, account_holder, ifsc, whatsapp, reason, status, assigned_mediator_id)
  VALUES ('DF-REF-500005', ord6_id, 'DF-ORD-100006', buyer_id, 'upi', 'demo***@gpay', '2345', 'Demo Buyer', 'GPay0123456', '+91-9876543210', 'Product damaged during shipping', 'approved', mediator_id)
  RETURNING id INTO ref5_id;

INSERT INTO public.refund_requests (refund_id, order_id, tracking_id, buyer_id, payment_method, upi_masked, bank_last4, account_holder, ifsc, whatsapp, reason, status)
  VALUES ('DF-REF-500006', ord3_id, 'DF-ORD-100003', buyer_id, 'upi', 'demo***@paytm', '7890', 'Demo Buyer', 'PAYTM0987654', '+91-9876543210', 'Size mismatch - ordered M, received L', 'submitted')
  RETURNING id INTO ref6_id;

-- ============================================================
-- STATUS LOGS
-- ============================================================
INSERT INTO public.status_logs (entity_type, entity_id, old_status, new_status, note, changed_by) VALUES
  ('order', ord1_id, NULL, 'submitted', 'Order submitted', buyer_id),
  ('order', ord1_id, 'submitted', 'under_review', 'Payment verified', mediator_id),
  ('order', ord1_id, 'under_review', 'approved', 'Order approved', mediator_id),
  ('order', ord1_id, 'approved', 'refund_processing', 'Processing refund', mediator_id),
  ('order', ord1_id, 'refund_processing', 'completed', 'Order completed', admin_id);

INSERT INTO public.status_logs (entity_type, entity_id, old_status, new_status, note, changed_by) VALUES
  ('order', ord2_id, NULL, 'submitted', 'Order submitted', buyer_id),
  ('order', ord2_id, 'submitted', 'under_review', 'Under review', mediator_id);

INSERT INTO public.status_logs (entity_type, entity_id, old_status, new_status, note, changed_by) VALUES
  ('order', ord3_id, NULL, 'submitted', 'Order submitted', buyer_id);

INSERT INTO public.status_logs (entity_type, entity_id, old_status, new_status, note, changed_by) VALUES
  ('order', ord4_id, NULL, 'submitted', 'Order submitted', buyer_id),
  ('order', ord4_id, 'submitted', 'under_review', 'Under review', mediator_id),
  ('order', ord4_id, 'under_review', 'approved', 'Payment verified', mediator_id);

INSERT INTO public.status_logs (entity_type, entity_id, old_status, new_status, note, changed_by) VALUES
  ('order', ord5_id, NULL, 'submitted', 'Order submitted', buyer_id),
  ('order', ord5_id, 'submitted', 'under_review', 'Under review', mediator_id),
  ('order', ord5_id, 'under_review', 'rejected', 'Invalid order ID - rejected', admin_id);

INSERT INTO public.status_logs (entity_type, entity_id, old_status, new_status, note, changed_by) VALUES
  ('order', ord6_id, NULL, 'submitted', 'Order submitted', buyer_id),
  ('order', ord6_id, 'submitted', 'under_review', 'Under review', mediator_id),
  ('order', ord6_id, 'under_review', 'approved', 'Approved', mediator_id),
  ('order', ord6_id, 'approved', 'refund_processing', 'Refund processing started', mediator_id);

INSERT INTO public.status_logs (entity_type, entity_id, old_status, new_status, note, changed_by) VALUES
  ('refund', ref1_id, NULL, 'submitted', 'Refund requested', buyer_id),
  ('refund', ref1_id, 'submitted', 'documents_received', 'Documents received', mediator_id),
  ('refund', ref1_id, 'documents_received', 'verification', 'Verification in progress', mediator_id),
  ('refund', ref1_id, 'verification', 'approved', 'Refund approved', admin_id),
  ('refund', ref1_id, 'approved', 'paid', 'Refund paid successfully', admin_id);

INSERT INTO public.status_logs (entity_type, entity_id, old_status, new_status, note, changed_by) VALUES
  ('refund', ref2_id, NULL, 'submitted', 'Refund requested', buyer_id),
  ('refund', ref2_id, 'submitted', 'documents_received', 'Documents received', mediator_id),
  ('refund', ref2_id, 'documents_received', 'verification', 'Verification in progress', mediator_id);

INSERT INTO public.status_logs (entity_type, entity_id, old_status, new_status, note, changed_by) VALUES
  ('refund', ref3_id, NULL, 'submitted', 'Refund requested', buyer_id);

INSERT INTO public.status_logs (entity_type, entity_id, old_status, new_status, note, changed_by) VALUES
  ('refund', ref4_id, NULL, 'submitted', 'Refund requested', buyer_id),
  ('refund', ref4_id, 'submitted', 'documents_received', 'Documents received', mediator_id);

INSERT INTO public.status_logs (entity_type, entity_id, old_status, new_status, note, changed_by) VALUES
  ('refund', ref5_id, NULL, 'submitted', 'Refund requested', buyer_id),
  ('refund', ref5_id, 'submitted', 'documents_received', 'Documents received', mediator_id),
  ('refund', ref5_id, 'documents_received', 'verification', 'Verification completed', mediator_id),
  ('refund', ref5_id, 'verification', 'approved', 'Refund approved', admin_id);

INSERT INTO public.status_logs (entity_type, entity_id, old_status, new_status, note, changed_by) VALUES
  ('refund', ref6_id, NULL, 'submitted', 'Refund requested', buyer_id);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
INSERT INTO public.notifications (user_id, title, message, type) VALUES
  (buyer_id, 'Order Completed', 'Your order DF-ORD-100001 has been completed.', 'order'),
  (buyer_id, 'Refund Paid', 'Your refund DF-REF-500001 has been paid.', 'refund'),
  (buyer_id, 'Order Under Review', 'Order DF-ORD-100002 is now under review.', 'order'),
  (mediator_id, 'New Order Assigned', 'Order DF-ORD-100002 has been assigned to you.', 'order'),
  (mediator_id, 'New Refund Assigned', 'Refund DF-REF-500002 requires your review.', 'refund'),
  (admin_id, 'New User Registered', 'A new buyer has registered on the platform.', 'system');

-- ============================================================
-- AUDIT LOGS
-- ============================================================
INSERT INTO public.audit_logs (actor_id, action, entity_type, metadata) VALUES
  (admin_id, 'seed_data_inserted', 'system', '{"description": "Initial seed data for demo"}');

END $$;
