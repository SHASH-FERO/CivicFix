import React from 'react';
import Link from 'next/link';
import { getProviders, getRepairs } from '@/lib/services/providers';
import { getIssues } from '@/lib/services/issues';
import { formatCurrency, formatDate } from '@/lib/utils';
import { 
  Wrench, 
  ShieldCheck, 
  Star, 
  MapPin, 
  Coins, 
  CheckCircle2, 
  ArrowRight,
  Clock
} from 'lucide-react';

export const revalidate = 0;

export default async function ProviderPage() {
  const [providers, repairs, issues] = await Promise.all([
    getProviders(),
    getRepairs(),
    getIssues(),
  ]);

  // Demo active provider (Mike Martinez / Apex Repairs)
  const activeProvider = providers[0];

  // Jobs ready for assignment (status: FUNDED)
  const availableJobs = issues.filter(i => i.status === 'FUNDED');

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold uppercase tracking-wider mb-2 border border-emerald-200">
            <Wrench className="h-3.5 w-3.5" />
            Vetted Fixer Network
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            Provider Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Fix it and verify it: accept funded repair orders, submit photographic proof, and receive simulated payouts.
          </p>
        </div>

        {activeProvider && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3.5 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                {activeProvider.business_name}
                <span className="text-[10px] bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded font-bold">
                  VERIFIED
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-600 mt-0.5">
                <span className="flex items-center gap-0.5 text-amber-600 font-semibold">
                  <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                  {activeProvider.rating}
                </span>
                <span>• {activeProvider.completed_repairs} completed fixes</span>
                <span>• {activeProvider.service_radius_meters / 1000} km radius</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Fixer Stats */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase">Available Funded Jobs</span>
          <div className="mt-2 text-2xl font-bold text-emerald-600">{availableJobs.length}</div>
          <p className="mt-1 text-xs text-slate-500">Ready for instant assignment</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase">Active / Submitted Repairs</span>
          <div className="mt-2 text-2xl font-bold text-slate-900">{repairs.length}</div>
          <p className="mt-1 text-xs text-slate-500">In execution or community review</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase">Simulated Payout Balance</span>
          <div className="mt-2 text-2xl font-bold text-amber-600">
            {formatCurrency(repairs.reduce((acc, r) => acc + (r.quoted_amount || 0), 0))}
          </div>
          <p className="mt-1 text-xs text-slate-500">Held in simulated demo escrow</p>
        </div>
      </div>

      {/* Repairs Table */}
      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Assigned Work Orders & Verification</h2>

        {repairs.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">No assigned repairs recorded.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-xs text-left">
              <thead className="bg-slate-50 text-slate-700 font-semibold">
                <tr>
                  <th className="px-4 py-3">Job ID</th>
                  <th className="px-4 py-3">Issue Title</th>
                  <th className="px-4 py-3">Compensation</th>
                  <th className="px-4 py-3">Repair Status</th>
                  <th className="px-4 py-3">Demo Payout</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {repairs.map((r) => (
                  <tr key={r.id}>
                    <td className="px-4 py-3 font-mono font-medium text-slate-800">
                      {r.id.slice(0, 8)}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      {/* @ts-expect-error join issue */}
                      {r.issue?.title || 'Sidewalk Hazard Fix'}
                    </td>
                    <td className="px-4 py-3 font-bold text-emerald-600">
                      {formatCurrency(r.quoted_amount)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                        {r.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        {r.simulated_payout}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/issues/${r.issue_id}`}
                        className="inline-flex items-center gap-1 font-semibold text-emerald-600 hover:text-emerald-800"
                      >
                        Inspect <ArrowRight className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
