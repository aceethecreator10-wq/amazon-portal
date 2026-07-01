-- ============================================================================
-- DealFlow Portal — Complete Database Schema
-- PostgreSQL Migration for Supabase
-- ============================================================================
-- PRODUCTION NOTE: Run this migration in a transaction. Test on a staging
-- database first. This migration is idempotent for idempotent blocks but
-- should be managed via Supabase Migration UI or CLI (`supabase migration up`).
-- ============================================================================

-- 1. EXTENSIONS
-- ============================================================================

create extension if not exists "pgcrypto";

-- 2. UPDATED AT TRIGGER FUNCTION
-- ============================================================================

create or replace function update_updated_at()
returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- 3. ID GENERATOR FUNCTIONS
-- ============================================================================

create or replace function generate_order_tracking_id()
returns text
language plpgsql stable
as $$
declare
  seq_id int;
  tracking text;
begin
  seq_id := nextval('order_tracking_seq');
  tracking := 'DF-ORD-' || lpad(seq_id::text, 6, '0');
  return tracking;
end;
$$;

create or replace function generate_refund_id()
returns text
language plpgsql stable
as $$
declare
  seq_id int;
  refund text;
begin
  seq_id := nextval('refund_seq');
  refund := 'DF-REF-' || lpad(seq_id::text, 6, '0');
  return refund;
end;
$$;

create or replace function generate_payout_id()
returns text
language plpgsql stable
as $$
declare
  seq_id int;
  payout text;
begin
  seq_id := nextval('payout_seq');
  payout := 'DF-PAY-' || lpad(seq_id::text, 6, '0');
  return payout;
end;
$$;

create sequence if not exists order_tracking_seq start 100001;
create sequence if not exists refund_seq start 100001;
create sequence if not exists payout_seq start 100001;

-- 4. ROLE HELPER FUNCTIONS
-- ============================================================================

create or replace function current_user_role()
returns text
language plpgsql stable
security definer
as $$
declare
  user_role text;
begin
  select p.role into user_role
    from profiles p
   where p.id = auth.uid();
  return user_role;
end;
$$;

create or replace function is_admin()
returns boolean
language plpgsql stable
security definer
as $$
begin
  return current_user_role() = 'admin';
end;
$$;

create or replace function is_mediator()
returns boolean
language plpgsql stable
security definer
as $$
begin
  return current_user_role() = 'mediator';
end;
$$;

create or replace function is_buyer()
returns boolean
language plpgsql stable
security definer
as $$
begin
  return current_user_role() = 'buyer';
end;
$$;

-- 5. TABLES
-- ============================================================================

-- Profiles — extends Supabase auth.users
create table if not exists profiles (
  id          uuid        primary key references auth.users(id) on delete cascade,
  full_name   text        not null,
  email       text        unique not null,
  whatsapp    text,
  role        text        not null default 'buyer' check (role in ('buyer','mediator','admin')),
  avatar_url  text,
  status      text        not null default 'active' check (status in ('active','suspended')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Deals
create table if not exists deals (
  id               uuid         primary key default gen_random_uuid(),
  title            text         not null,
  platform         text         not null,
  category         text,
  description      text,
  original_price   numeric(10,2),
  deal_price       numeric(10,2),
  cashback_amount  numeric(10,2) not null default 0,
  effective_price  numeric(10,2),
  deal_url         text,
  image_url        text,
  status           text         not null default 'active' check (status in ('active','closing_soon','expired','draft')),
  created_by       uuid         references profiles(id),
  created_at       timestamptz  not null default now(),
  updated_at       timestamptz  not null default now()
);

-- Orders
create table if not exists orders (
  id                  uuid        primary key default gen_random_uuid(),
  tracking_id         text        unique not null default generate_order_tracking_id(),
  buyer_id            uuid        references profiles(id),
  buyer_name          text        not null,
  email               text,
  whatsapp            text,
  deal_id             uuid        references deals(id),
  platform            text,
  order_number        text,
  amount              numeric(10,2),
  order_date          date,
  screenshot_url      text,
  status              text        not null default 'submitted' check (status in ('submitted','under_review','approved','rejected','refund_processing','completed')),
  assigned_mediator_id uuid       references profiles(id),
  notes               text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- Refund Requests
create table if not exists refund_requests (
  id                     uuid        primary key default gen_random_uuid(),
  refund_id              text        unique not null default generate_refund_id(),
  order_id               uuid        references orders(id),
  tracking_id            text,
  buyer_id               uuid        references profiles(id),
  payment_method         text        check (payment_method in ('upi','bank_transfer')),
  upi_masked             text,
  bank_last4             text,
  account_holder         text,
  ifsc                   text,
  whatsapp               text,
  reason                 text,
  review_screenshot_url  text,
  delivery_screenshot_url text,
  status                 text        not null default 'submitted' check (status in ('submitted','documents_received','verification','approved','rejected','payout_queued','paid','failed')),
  assigned_mediator_id   uuid        references profiles(id),
  admin_notes            text,
  payout_id              uuid,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

-- Payout Beneficiaries (safely stored payout destinations)
create table if not exists payout_beneficiaries (
  id                      uuid        primary key default gen_random_uuid(),
  user_id                 uuid        references profiles(id) not null,
  beneficiary_name        text        not null,
  payment_method          text        not null check (payment_method in ('upi','bank_transfer')),
  upi_masked              text,
  bank_last4              text,
  ifsc                    text,
  provider_contact_id     text,
  provider_fund_account_id text,
  verification_status     text        not null default 'pending' check (verification_status in ('pending','verified','failed')),
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

-- Payouts (disbursements to beneficiaries)
create table if not exists payouts (
  id                uuid        primary key default gen_random_uuid(),
  payout_id         text        unique not null default generate_payout_id(),
  refund_request_id uuid        references refund_requests(id),
  beneficiary_id    uuid        references payout_beneficiaries(id),
  amount            numeric(10,2) not null,
  provider          text        not null default 'manual' check (provider in ('razorpayx','cashfree','manual')),
  provider_payout_id text,
  idempotency_key   text        unique,
  status            text        not null default 'created' check (status in ('created','queued','processing','processed','failed','cancelled','manual_required')),
  failure_reason    text,
  created_by        uuid        references profiles(id),
  processed_by      uuid        references profiles(id),
  processed_at      timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- Add payout_id FK to refund_requests after payouts table exists
alter table if exists refund_requests
  add constraint fk_refund_requests_payout
  foreign key (payout_id) references payouts(id)
  not valid;

-- Status Logs (audit trail for state transitions)
create table if not exists status_logs (
  id          uuid        primary key default gen_random_uuid(),
  entity_type text        not null check (entity_type in ('order','refund','payout')),
  entity_id   uuid        not null,
  old_status  text,
  new_status  text        not null,
  note        text,
  changed_by  uuid        references profiles(id),
  created_at  timestamptz not null default now()
);

-- Notifications
create table if not exists notifications (
  id         uuid        primary key default gen_random_uuid(),
  user_id    uuid        references profiles(id) not null,
  title      text        not null,
  message    text        not null,
  type       text,
  read       boolean     not null default false,
  created_at timestamptz not null default now()
);

-- Audit Logs (admin events, sensitive operations)
create table if not exists audit_logs (
  id          uuid        primary key default gen_random_uuid(),
  actor_id    uuid        references profiles(id),
  action      text        not null,
  entity_type text,
  entity_id   uuid,
  metadata    jsonb,
  ip_address  text,
  user_agent  text,
  created_at  timestamptz not null default now()
);

-- 6. INDEXES
-- ============================================================================

create index if not exists idx_orders_buyer_id            on orders(buyer_id);
create index if not exists idx_orders_tracking_id         on orders(tracking_id);
create index if not exists idx_orders_assigned_mediator_id on orders(assigned_mediator_id);
create index if not exists idx_orders_status              on orders(status);

create index if not exists idx_refund_requests_buyer_id             on refund_requests(buyer_id);
create index if not exists idx_refund_requests_order_id             on refund_requests(order_id);
create index if not exists idx_refund_requests_assigned_mediator_id on refund_requests(assigned_mediator_id);
create index if not exists idx_refund_requests_status               on refund_requests(status);

create index if not exists idx_payouts_refund_request_id on payouts(refund_request_id);
create index if not exists idx_payouts_status             on payouts(status);
create index if not exists idx_payout_beneficiaries_user_id on payout_beneficiaries(user_id);

create index if not exists idx_status_logs_entity on status_logs(entity_type, entity_id);

create index if not exists idx_notifications_user_read on notifications(user_id, read);

create index if not exists idx_audit_logs_created_at on audit_logs(created_at);

create index if not exists idx_deals_status on deals(status);

-- 7. TRIGGERS
-- ============================================================================

create trigger update_updated_at
  before update on profiles
  for each row
  execute function update_updated_at();

create trigger update_updated_at
  before update on deals
  for each row
  execute function update_updated_at();

create trigger update_updated_at
  before update on orders
  for each row
  execute function update_updated_at();

create trigger update_updated_at
  before update on refund_requests
  for each row
  execute function update_updated_at();

create trigger update_updated_at
  before update on payout_beneficiaries
  for each row
  execute function update_updated_at();

create trigger update_updated_at
  before update on payouts
  for each row
  execute function update_updated_at();

-- 8. ROW-LEVEL SECURITY
-- ============================================================================

-- Enable RLS on all tables
alter table if exists profiles             enable row level security;
alter table if exists deals                enable row level security;
alter table if exists orders               enable row level security;
alter table if exists refund_requests      enable row level security;
alter table if exists payout_beneficiaries enable row level security;
alter table if exists payouts              enable row level security;
alter table if exists status_logs          enable row level security;
alter table if exists notifications        enable row level security;
alter table if exists audit_logs           enable row level security;

-- ----------------------------------------------------------------------------
-- PROFILES
-- ----------------------------------------------------------------------------

create policy "Users can select own profile"
  on profiles for select
  using (id = auth.uid());

create policy "Users can update own profile (not role or status)"
  on profiles for update
  using (id = auth.uid())
  with check (
    id = auth.uid()
    and (role = (select role from profiles where id = auth.uid()))
    and (status = (select status from profiles where id = auth.uid()))
  );

create policy "Admins can select all profiles"
  on profiles for select
  using (is_admin());

create policy "Admins can update any profile"
  on profiles for update
  using (is_admin())
  with check (is_admin());

-- ----------------------------------------------------------------------------
-- DEALS
-- ----------------------------------------------------------------------------

create policy "Anyone can select active or closing_soon deals"
  on deals for select
  using (status in ('active','closing_soon'));

create policy "Mediators can select all non-draft deals"
  on deals for select
  using (is_mediator() and status != 'draft');

create policy "Admins can select all deals"
  on deals for select
  using (is_admin());

create policy "Admins can insert deals"
  on deals for insert
  with check (is_admin());

create policy "Admins can update deals"
  on deals for update
  using (is_admin())
  with check (is_admin());

create policy "Admins can delete deals"
  on deals for delete
  using (is_admin());

-- ----------------------------------------------------------------------------
-- ORDERS
-- ----------------------------------------------------------------------------

create policy "Buyers can select own orders"
  on orders for select
  using (buyer_id = auth.uid());

create policy "Mediators can select assigned or unassigned orders"
  on orders for select
  using (is_mediator() and (assigned_mediator_id = auth.uid() or assigned_mediator_id is null));

create policy "Admins can select all orders"
  on orders for select
  using (is_admin());

create policy "Buyers can insert orders"
  on orders for insert
  with check (buyer_id = auth.uid());

create policy "Mediators can update assigned orders"
  on orders for update
  using (assigned_mediator_id = auth.uid())
  with check (assigned_mediator_id = auth.uid());

create policy "Admins can update any order"
  on orders for update
  using (is_admin())
  with check (is_admin());

create policy "Admins can delete any order"
  on orders for delete
  using (is_admin());

-- ----------------------------------------------------------------------------
-- REFUND REQUESTS
-- ----------------------------------------------------------------------------

create policy "Buyers can select own refund requests"
  on refund_requests for select
  using (buyer_id = auth.uid());

create policy "Mediators can select assigned or unassigned refunds"
  on refund_requests for select
  using (is_mediator() and (assigned_mediator_id = auth.uid() or assigned_mediator_id is null));

create policy "Admins can select all refund requests"
  on refund_requests for select
  using (is_admin());

create policy "Buyers can insert refund requests"
  on refund_requests for insert
  with check (buyer_id = auth.uid());

create policy "Mediators can update assigned refund requests"
  on refund_requests for update
  using (assigned_mediator_id = auth.uid())
  with check (assigned_mediator_id = auth.uid());

create policy "Admins can update any refund request"
  on refund_requests for update
  using (is_admin())
  with check (is_admin());

create policy "Admins can delete any refund request"
  on refund_requests for delete
  using (is_admin());

-- ----------------------------------------------------------------------------
-- PAYOUT BENEFICIARIES
-- ----------------------------------------------------------------------------

create policy "Buyers can select own beneficiaries"
  on payout_beneficiaries for select
  using (user_id = auth.uid());

create policy "Buyers can insert own beneficiaries"
  on payout_beneficiaries for insert
  with check (user_id = auth.uid());

create policy "Buyers can update own beneficiaries"
  on payout_beneficiaries for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "Admins can select all beneficiaries"
  on payout_beneficiaries for select
  using (is_admin());

create policy "Admins can update beneficiaries"
  on payout_beneficiaries for update
  using (is_admin())
  with check (is_admin());

-- ----------------------------------------------------------------------------
-- PAYOUTS
-- ----------------------------------------------------------------------------

create policy "Buyers can select own payouts"
  on payouts for select
  using (
    exists (
      select 1 from refund_requests r
      where r.id = payouts.refund_request_id
        and r.buyer_id = auth.uid()
    )
  );

create policy "Mediators can select payouts for assigned refunds"
  on payouts for select
  using (
    exists (
      select 1 from refund_requests r
      where r.id = payouts.refund_request_id
        and r.assigned_mediator_id = auth.uid()
    )
  );

create policy "Admins can select all payouts"
  on payouts for select
  using (is_admin());

create policy "Admins can insert payouts"
  on payouts for insert
  with check (is_admin());

create policy "Admins can update payouts"
  on payouts for update
  using (is_admin())
  with check (is_admin());

-- ----------------------------------------------------------------------------
-- STATUS LOGS
-- ----------------------------------------------------------------------------

create policy "Anyone can insert status logs"
  on status_logs for insert
  with check (true);

create policy "Users can select logs for own orders"
  on status_logs for select
  using (
    exists (
      select 1 from orders o
      where o.id = status_logs.entity_id
        and status_logs.entity_type = 'order'
        and o.buyer_id = auth.uid()
    )
    or exists (
      select 1 from refund_requests r
      where r.id = status_logs.entity_id
        and status_logs.entity_type = 'refund'
        and r.buyer_id = auth.uid()
    )
    or exists (
      select 1 from payouts p
      join refund_requests r on r.id = p.refund_request_id
      where p.id = status_logs.entity_id
        and status_logs.entity_type = 'payout'
        and r.buyer_id = auth.uid()
    )
  );

create policy "Mediators can select logs for assigned entities"
  on status_logs for select
  using (
    exists (
      select 1 from orders o
      where o.id = status_logs.entity_id
        and status_logs.entity_type = 'order'
        and o.assigned_mediator_id = auth.uid()
    )
    or exists (
      select 1 from refund_requests r
      where r.id = status_logs.entity_id
        and status_logs.entity_type = 'refund'
        and r.assigned_mediator_id = auth.uid()
    )
    or exists (
      select 1 from payouts p
      join refund_requests r on r.id = p.refund_request_id
      where p.id = status_logs.entity_id
        and status_logs.entity_type = 'payout'
        and r.assigned_mediator_id = auth.uid()
    )
  );

create policy "Admins can select all status logs"
  on status_logs for select
  using (is_admin());

-- ----------------------------------------------------------------------------
-- NOTIFICATIONS
-- ----------------------------------------------------------------------------

create policy "Users can select own notifications"
  on notifications for select
  using (user_id = auth.uid());

create policy "Users can update own notifications"
  on notifications for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "Admins can insert notifications"
  on notifications for insert
  with check (is_admin());

-- ----------------------------------------------------------------------------
-- AUDIT LOGS
-- ----------------------------------------------------------------------------

create policy "Admins can select audit logs"
  on audit_logs for select
  using (is_admin());

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================
