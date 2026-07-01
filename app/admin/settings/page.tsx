"use client";

import AuthGuard from "@/components/AuthGuard";

export default function AdminSettingsPage() {
  return (
    <AuthGuard role="admin" fallback="/admin/login">
      <div>
        <div className="mb-6">
          <h1 className="text-xl font-bold text-slate-900">Settings</h1>
          <p className="text-sm text-slate-500 mt-1">Platform configuration</p>
        </div>

        <div className="space-y-4 max-w-xl">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900 mb-4">Demo Configuration</h2>
            <p className="text-xs text-slate-500 mb-4">
              These are placeholder settings for the demo application.
              In production, this page would contain platform-wide configuration options.
            </p>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <div>
                  <p className="text-sm font-medium text-slate-900">Maintenance Mode</p>
                  <p className="text-xs text-slate-500">Toggle platform availability</p>
                </div>
                <div className="w-10 h-5 rounded-full bg-slate-200 relative cursor-not-allowed opacity-50">
                  <div className="w-4 h-4 rounded-full bg-white absolute top-0.5 left-0.5 shadow-sm" />
                </div>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <div>
                  <p className="text-sm font-medium text-slate-900">New Registrations</p>
                  <p className="text-xs text-slate-500">Allow new user signups</p>
                </div>
                <div className="w-10 h-5 rounded-full bg-emerald-400 relative cursor-not-allowed opacity-50">
                  <div className="w-4 h-4 rounded-full bg-white absolute top-0.5 right-0.5 shadow-sm" />
                </div>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-slate-900">Auto-Assign Mediator</p>
                  <p className="text-xs text-slate-500">Automatically assign orders to mediators</p>
                </div>
                <div className="w-10 h-5 rounded-full bg-slate-200 relative cursor-not-allowed opacity-50">
                  <div className="w-4 h-4 rounded-full bg-white absolute top-0.5 left-0.5 shadow-sm" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
            <h2 className="text-sm font-semibold text-amber-800 mb-2">Production Notes</h2>
            <ul className="text-xs text-amber-700 space-y-1 list-disc pl-4">
              <li>Settings are not persisted - this is a demo UI only</li>
              <li>Replace with real configuration management (e.g., database or env vars)</li>
              <li>Add audit logging for all configuration changes</li>
              <li>Implement proper role-based access to settings</li>
            </ul>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
