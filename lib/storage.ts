// PRODUCTION NOTE: Replace localStorage with Supabase/Postgres before going live
// WARNING: localStorage data is not encrypted. Do not store real credentials or PII.

"use client";

import { demoUsers, demoDeals, demoOrders, demoRefundRequests } from "./seed-data";
import type { User, Deal, Order, RefundRequest, Notification } from "./types";

const KEYS = {
  users: "df_users",
  deals: "df_deals",
  orders: "df_orders",
  refunds: "df_refunds",
  notifications: "df_notifications",
  session: "df_session",
} as const;

function getItem<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function seedDemoData(): void {
  if (typeof window === "undefined") return;
  if (!localStorage.getItem(KEYS.users)) {
    setItem(KEYS.users, demoUsers);
    setItem(KEYS.deals, demoDeals);
    setItem(KEYS.orders, demoOrders);
    setItem(KEYS.refunds, demoRefundRequests);
    setItem(KEYS.notifications, []);
  }
}

export function getUsers(): User[] {
  return getItem<User[]>(KEYS.users, demoUsers);
}
export function setUsers(users: User[]): void {
  setItem(KEYS.users, users);
}

export function getDeals(): Deal[] {
  return getItem<Deal[]>(KEYS.deals, demoDeals);
}
export function setDeals(deals: Deal[]): void {
  setItem(KEYS.deals, deals);
}

export function getOrders(): Order[] {
  return getItem<Order[]>(KEYS.orders, demoOrders);
}
export function setOrders(orders: Order[]): void {
  setItem(KEYS.orders, orders);
}

export function getRefundRequests(): RefundRequest[] {
  return getItem<RefundRequest[]>(KEYS.refunds, demoRefundRequests);
}
export function setRefundRequests(refunds: RefundRequest[]): void {
  setItem(KEYS.refunds, refunds);
}

export function getNotifications(): Notification[] {
  return getItem<Notification[]>(KEYS.notifications, []);
}
export function setNotifications(n: Notification[]): void {
  setItem(KEYS.notifications, n);
}

export function addNotification(notif: Notification): void {
  const all = getNotifications();
  all.unshift(notif);
  setNotifications(all);
}

export { KEYS };
