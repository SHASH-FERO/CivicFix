import React from 'react';
import Link from 'next/link';
import { getIssues } from '@/lib/services/issues';
import IssueCard from '@/components/issues/IssueCard';
import { CivicMap } from '@/components/map';
import { 
  ShieldCheck, 
  Camera, 
  Coins, 
  Wrench, 
  CheckCircle2, 
  ArrowRight, 
  Building2,
  AlertTriangle,
  Users
} from 'lucide-react';

export const revalidate = 0; // Fresh on each request

export default async function HomePage() {
  const issues = await getIssues();

  // Metrics from real Supabase data
  const totalIssues = issues.length;
  const fundingIssues = issues.filter(i => i.status === 'FUNDING').length;
  const verifyingIssues = issues.filter(i => i.status === 'VERIFYING' || i.status === 'REPAIRED').length;
  const authorityIssues = issues.filter(i => i.resolution_type === 'AUTHORITY_REQUIRED').length;

  return (
    <div className="flex flex-col gap-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white py-16 sm:py-24">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-6">
            <ShieldCheck className="h-4 w-4" />
            Civic Technology Platform
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight max-w-3xl mx-auto leading-tight">
            Find it. Fund it. <br className="hidden sm:inline" />
            <span className="text-emerald-400">Fix it. Verify it.</span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            CivicFix empowers neighborhood residents to report local hazards, crowdfund repairs, dispatch vetted contractors, and verify completed fixes before funds are released.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/report"
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 transition-colors"
            >
              <Camera className="h-4 w-4" />
              Report an Issue
            </Link>

            <Link
              href="/issues"
              className="inline-flex items-center gap-2 rounded-lg bg-slate-800 border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
            >
              Explore Map & Feed
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Quick Metrics */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="rounded-lg bg-slate-800/60 border border-slate-700/60 p-4">
              <div className="text-2xl font-bold text-white">{totalIssues}</div>
              <div className="text-xs text-slate-400 mt-1">Live Civic Reports</div>
            </div>
            <div className="rounded-lg bg-slate-800/60 border border-slate-700/60 p-4">
              <div className="text-2xl font-bold text-amber-400">{fundingIssues}</div>
              <div className="text-xs text-slate-400 mt-1">Actively Crowdfunding</div>
            </div>
            <div className="rounded-lg bg-slate-800/60 border border-slate-700/60 p-4">
              <div className="text-2xl font-bold text-emerald-400">{verifyingIssues}</div>
              <div className="text-xs text-slate-400 mt-1">In Community Verification</div>
            </div>
            <div className="rounded-lg bg-slate-800/60 border border-slate-700/60 p-4">
              <div className="text-2xl font-bold text-purple-400">{authorityIssues}</div>
              <div className="text-xs text-slate-400 mt-1">Municipal Routed Cases</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Pillars Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            How CivicFix Works
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Closing the loop from civic frustration to verified neighborhood restoration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="h-10 w-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg mb-4">
              1
            </div>
            <h3 className="text-base font-bold text-slate-900">1. Find It</h3>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              Citizens capture photos and GPS coordinates. AI vision categorizes severity, lists repair components, and calculates deterministic costs.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="h-10 w-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-lg mb-4">
              2
            </div>
            <h3 className="text-base font-bold text-slate-900">2. Fund It</h3>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              Community micro-contributions pool funds transparently. Once the target is hit, the job automatically unlocks for local vetted contractors.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="h-10 w-10 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-lg mb-4">
              3
            </div>
            <h3 className="text-base font-bold text-slate-900">3. Fix It</h3>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              Verified trade professionals accept assignments, execute physical repairs, and upload before/after photographic evidence.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="h-10 w-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg mb-4">
              4
            </div>
            <h3 className="text-base font-bold text-slate-900">4. Verify It</h3>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              Neighborhood residents review before/after photo proof. When 3 community approvals are logged, the fix is officially resolved and payout released.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Map & Live Feed Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Live Civic Reports
            </h2>
            <p className="text-sm text-slate-500">
              Real infrastructure items loaded directly from the CivicFix Supabase backend.
            </p>
          </div>

          <Link
            href="/issues"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 hover:text-emerald-700"
          >
            View all {issues.length} items <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Map */}
        <div className="mb-8">
          <CivicMap issues={issues} height="380px" />
        </div>

        {/* Grid of Issues */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {issues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </div>
      </section>
    </div>
  );
}
