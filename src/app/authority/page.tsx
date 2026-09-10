import React from 'react';
import Link from 'next/link';
import { getAuthorityCases } from '@/lib/services/providers';
import { formatDate } from '@/lib/utils';
import { Building2, AlertTriangle, ArrowRight, ShieldCheck, Clock } from 'lucide-react';

export const revalidate = 0;

export default async function AuthorityPage() {
  const cases = await getAuthorityCases();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="pb-6 border-b border-slate-200">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold uppercase tracking-wider mb-2 border border-purple-200">
          <Building2 className="h-3.5 w-3.5" />
          Municipal Liaison Interface
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
          Authority Tracking Portal
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Civic infrastructure issues requiring municipal machinery, utility excavation, or code enforcement.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase">Routed Agency Cases</span>
          <div className="mt-2 text-2xl font-bold text-purple-700">{cases.length}</div>
          <p className="mt-1 text-xs text-slate-500">Under municipal agency jurisdiction</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase">Active Utility Dispatches</span>
          <div className="mt-2 text-2xl font-bold text-amber-600">
            {cases.filter(c => c.status === 'IN_PROGRESS' || c.status === 'FORWARDED').length}
          </div>
          <p className="mt-1 text-xs text-slate-500">Scheduled for physical utility crews</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase">Resolved Municipal Cases</span>
          <div className="mt-2 text-2xl font-bold text-emerald-600">
            {cases.filter(c => c.status === 'RESOLVED').length}
          </div>
          <p className="mt-1 text-xs text-slate-500">Closed with official department sign-off</p>
        </div>
      </div>

      {/* Cases Table */}
      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Official Department Dispatch Tickets</h2>

        {cases.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">No active municipal cases.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-xs text-left">
              <thead className="bg-slate-50 text-slate-700 font-semibold">
                <tr>
                  <th className="px-4 py-3">Ticket Number</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Issue Title</th>
                  <th className="px-4 py-3">Agency Status</th>
                  <th className="px-4 py-3">Official Update</th>
                  <th className="px-4 py-3 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {cases.map((c) => (
                  <tr key={c.id}>
                    <td className="px-4 py-3 font-mono font-bold text-purple-700">
                      {c.ticket_number}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      {/* @ts-expect-error join issue */}
                      {c.department?.name || 'Water & Sewer Bureau'}
                    </td>
                    <td className="px-4 py-3 text-slate-700 max-w-xs truncate">
                      {/* @ts-expect-error join issue */}
                      {c.issue?.title || 'Water Main Burst'}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
                        {c.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 max-w-sm truncate">
                      {c.official_notes || 'Emergency utility crew dispatched.'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/issues/${c.issue_id}`}
                        className="inline-flex items-center gap-1 font-semibold text-emerald-600 hover:text-emerald-800"
                      >
                        Details <ArrowRight className="h-3 w-3" />
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
