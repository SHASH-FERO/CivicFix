import React from 'react';
import Link from 'next/link';
import { getIssues } from '@/lib/services/issues';
import IssueCard from '@/components/issues/IssueCard';
import { CivicMap } from '@/components/map';
import { PlusCircle, ShieldCheck, HeartHandshake, CheckCircle, Clock } from 'lucide-react';

export const revalidate = 0;

export default async function DashboardPage() {
  const issues = await getIssues();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Citizen Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Find it. Fund it. Fix it. Verify it. Track neighborhood problems, funding, and community verification.
          </p>
        </div>

        <Link
          href="/report"
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-emerald-500 transition-colors self-start sm:self-auto"
        >
          <PlusCircle className="h-4 w-4" />
          Report New Issue
        </Link>
      </div>

      {/* Summary KPI Cards */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Active Reports</span>
            <div className="p-2 rounded-lg bg-slate-100 text-slate-700">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900">{issues.length}</div>
          <p className="mt-1 text-xs text-slate-500">Live in downtown civic zone</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">In Crowdfunding</span>
            <div className="p-2 rounded-lg bg-amber-100 text-amber-700">
              <HeartHandshake className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-amber-600">
            {issues.filter(i => i.status === 'FUNDING').length}
          </div>
          <p className="mt-1 text-xs text-slate-500">Awaiting full pledge targets</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Awaiting Verification</span>
            <div className="p-2 rounded-lg bg-cyan-100 text-cyan-700">
              <CheckCircle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-cyan-600">
            {issues.filter(i => i.status === 'VERIFYING' || i.status === 'REPAIRED').length}
          </div>
          <p className="mt-1 text-xs text-slate-500">Need 3 citizen votes to release payout</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Authority Routed</span>
            <div className="p-2 rounded-lg bg-purple-100 text-purple-700">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-purple-600">
            {issues.filter(i => i.resolution_type === 'AUTHORITY_REQUIRED').length}
          </div>
          <p className="mt-1 text-xs text-slate-500">Heavy public works infrastructure</p>
        </div>
      </div>

      {/* Map Preview */}
      <div className="mt-8">
        <h2 className="text-lg font-bold text-slate-900 mb-3">Nearby Civic Map</h2>
        <CivicMap issues={issues} height="320px" />
      </div>

      {/* Issues Feed */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">Community Issue Feed</h2>
          <span className="text-xs text-slate-500">{issues.length} items loaded</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {issues.map(issue => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </div>
      </div>
    </div>
  );
}
