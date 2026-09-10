import React from 'react';
import Link from 'next/link';
import { getIssues, getCategories } from '@/lib/services/issues';
import { getProviders, getRepairs, getAuthorityCases } from '@/lib/services/providers';
import { formatCurrency } from '@/lib/utils';
import { 
  ShieldCheck, 
  Database, 
  Settings, 
  Users, 
  AlertCircle, 
  FileCheck,
  CheckCircle2
} from 'lucide-react';

export const revalidate = 0;

export default async function AdminPage() {
  const [issues, categories, providers, repairs, authorityCases] = await Promise.all([
    getIssues(),
    getCategories(),
    getProviders(),
    getRepairs(),
    getAuthorityCases(),
  ]);

  const totalRaised = issues.reduce((acc, i) => acc + (i.funding_raised || 0), 0);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="pb-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-900 text-white text-xs font-semibold uppercase tracking-wider mb-2">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            CivicFix Administrative Console
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            Platform Management & Health
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            System overview, rate management, and governance for the CivicFix Supabase backend.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
            <CheckCircle2 className="h-4 w-4" />
            Supabase DB: Active Healthy
          </span>
        </div>
      </div>

      {/* Metrics */}
      <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase">Total Reports</span>
          <div className="mt-2 text-2xl font-bold text-slate-900">{issues.length}</div>
          <p className="mt-1 text-xs text-slate-400">Public schema issues</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase">Total Pledged</span>
          <div className="mt-2 text-2xl font-bold text-emerald-600">{formatCurrency(totalRaised)}</div>
          <p className="mt-1 text-xs text-slate-400">Sandbox community pledges</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase">Verified Fixers</span>
          <div className="mt-2 text-2xl font-bold text-slate-900">{providers.length}</div>
          <p className="mt-1 text-xs text-slate-400">Active contractor accounts</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase">Municipal Cases</span>
          <div className="mt-2 text-2xl font-bold text-purple-700">{authorityCases.length}</div>
          <p className="mt-1 text-xs text-slate-400">Routed department tickets</p>
        </div>
      </div>

      {/* Categories & Base Unit Rates */}
      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Deterministic Cost Catalog</h2>
            <p className="text-xs text-slate-500">
              Configured unit rates applied to AI work component predictions.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 font-semibold">
              <tr>
                <th className="px-4 py-3">Category Name</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Default Workflow</th>
                <th className="px-4 py-3 text-right">Configured Base Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {categories.map((c) => (
                <tr key={c.id}>
                  <td className="px-4 py-3 font-semibold text-slate-900">{c.name}</td>
                  <td className="px-4 py-3 font-mono text-slate-500">{c.slug}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${
                      c.default_resolution_type === 'AUTHORITY_REQUIRED'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-emerald-50 text-emerald-800'
                    }`}>
                      {c.default_resolution_type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-slate-900">
                    {formatCurrency(c.base_unit_rate)} / unit
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
