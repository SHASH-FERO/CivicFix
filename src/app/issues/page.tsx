import React from 'react';
import Link from 'next/link';
import { getIssues, getCategories } from '@/lib/services/issues';
import IssueCard from '@/components/issues/IssueCard';
import { CivicMap } from '@/components/map';
import { Filter, PlusCircle } from 'lucide-react';

export const revalidate = 0;

export default async function IssuesPage() {
  const [issues, categories] = await Promise.all([
    getIssues(),
    getCategories(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Civic Feed & Map
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Find it. Fund it. Fix it. Verify it. Browse, locate, and support infrastructure problems across your district.
          </p>
        </div>

        <Link
          href="/report"
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-emerald-500 transition-colors"
        >
          <PlusCircle className="h-4 w-4" />
          Report Issue
        </Link>
      </div>

      {/* Map */}
      <div className="mt-6">
        <CivicMap issues={issues} height="400px" />
      </div>

      {/* Categories Bar */}
      <div className="mt-8 flex items-center gap-2 overflow-x-auto pb-2">
        <span className="text-xs font-semibold text-slate-400 uppercase mr-1">Categories:</span>
        <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-slate-900 text-white cursor-pointer">
          All ({issues.length})
        </span>
        {categories.map(cat => (
          <span
            key={cat.id}
            className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer whitespace-nowrap transition-colors"
          >
            {cat.name}
          </span>
        ))}
      </div>

      {/* Issues Grid */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {issues.map(issue => (
          <IssueCard key={issue.id} issue={issue} />
        ))}
      </div>
    </div>
  );
}
