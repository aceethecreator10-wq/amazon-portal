// PRODUCTION NOTE: Replace with NextAuth.js, Supabase Auth, or Clerk before going live
// WARNING: This mock auth stores session in localStorage. Not secure for production.

"use client";

import type { User } from "./types";
import { getUsers } from "./storage";

const SESSION_KEY = "df_session";

export interface Session {
  user: User;
  expiresAt: string;
}

export function login(email: string, password: string): User | null {
  const users = getUsers();
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) return null;
  const session: Session = {
    user,
    expiresAt: new Date(Date.now() + 86400000).toISOString(),
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return user;
}

export function logout(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session: Session = JSON.parse(raw);
    if (new Date(session.expiresAt) < new Date()) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function getCurrentUser(): User | null {
  return getSession()?.user ?? null;
}

export function isAuthenticated(): boolean {
  return getSession() !== null;
}

export function registerUser(
  name: string,
  email: string,
  password: string,
  whatsapp: string
): User {
  const users = getUsers();
  const newUser: User = {
    id: `user-${Date.now()}`,
    name,
    email,
    password,
    role: "buyer",
    whatsapp,
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  localStorage.setItem("df_users", JSON.stringify(users));
  login(email, password);
  return newUser;
}
