import React from 'react';
import Link from 'next/link';
import { IssueWithDetails } from '@/types';
import { formatCurrency, formatDate, getDisplayFunding, getStatusBadge, getSeverityBadge } from '@/lib/utils';
import { MapPin, ArrowRight, ShieldCheck, Building2, Wrench } from 'lucide-react';

interface IssueCardProps {
  issue: IssueWithDetails;
}

export default function IssueCard({ issue }: IssueCardProps) {
  const statusInfo = getStatusBadge(issue.status);
  const severityInfo = getSeverityBadge(issue.severity);
  const funding = getDisplayFunding(issue);
  const fundingPercent = funding.target > 0
    ? Math.min(100, Math.round((funding.raised / funding.target) * 100))
    : 0;

  return (
    <div className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-slate-300 hover:shadow-md">
      <div>
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {issue.category?.name || 'Civic Issue'}
            </span>

            {severityInfo && (
              <span className={`text-[11px] font-medium px-2 py-0.5 rounded border ${severityInfo.color}`}>
                {severityInfo.label}
              </span>
            )}
          </div>

          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${statusInfo.color}`}>
            {statusInfo.label}
          </span>
        </div>

        {/* Title & Description */}
        <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
          <Link href={`/issues/${issue.id}`}>
            {issue.title}
          </Link>
        </h3>

        <p className="mt-1.5 text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {issue.description}
        </p>

        {/* Location / Address */}
        <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
          <span className="truncate">{issue.address || `${issue.latitude?.toFixed(4)}, ${issue.longitude?.toFixed(4)}`}</span>
        </div>
      </div>

      {/* Footer / Workflow Info */}
      <div className="mt-4 pt-3 border-t border-slate-100">
        {issue.resolution_type === 'AUTHORITY_REQUIRED' ? (
          <div className="flex items-center justify-between text-xs text-purple-700 bg-purple-50 px-2.5 py-1.5 rounded-md border border-purple-200">
            <div className="flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5" />
              <span>Municipal Case: {issue.authority_case?.ticket_number || 'Routed'}</span>
            </div>
            <span className="font-medium text-purple-800">{issue.authority_case?.status || 'Pending'}</span>
          </div>
        ) : funding.target > 0 ? (
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-600">Crowdfunding Progress</span>
              <span className="font-semibold text-slate-900">
                {formatCurrency(funding.raised)} / {formatCurrency(funding.target)}
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  fundingPercent >= 100 ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
                style={{ width: `${fundingPercent}%` }}
              />
            </div>
          </div>
        ) : issue.repair ? (
          <div className="flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <Wrench className="h-3.5 w-3.5 text-emerald-600" />
              <span>{issue.repair.provider?.business_name || 'Assigned Fixer'}</span>
            </div>
            <span className="font-medium text-emerald-700">Repair {issue.repair.status}</span>
          </div>
        ) : (
          <div className="text-xs text-slate-400">Reported on {formatDate(issue.created_at)}</div>
        )}

        <div className="mt-3 flex justify-end">
          <Link
            href={`/issues/${issue.id}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-800 transition-colors"
          >
            Inspect Details <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
