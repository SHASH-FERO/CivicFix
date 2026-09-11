import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getIssueById } from '@/lib/services/issues';
import { formatCurrency, formatDate, getDisplayFunding, getStatusBadge, getSeverityBadge } from '@/lib/utils';
import ContributionPanel from '@/components/issues/ContributionPanel';
import { 
  MapPin, 
  ArrowLeft, 
  Sparkles, 
  Coins, 
  Wrench, 
  CheckCircle2, 
  Building2, 
  Calendar,
  ThumbsUp
} from 'lucide-react';

export const revalidate = 0;

export default async function IssueDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const issue = await getIssueById(id);

  if (!issue) {
    notFound();
  }

  const statusInfo = getStatusBadge(issue.status);
  const severityInfo = getSeverityBadge(issue.severity);
  const funding = getDisplayFunding(issue);
  const fundingPercent = funding.target > 0
    ? Math.min(100, Math.round((funding.raised / funding.target) * 100))
    : 0;

  // Work components from AI analysis
  const workComponents = Array.isArray(issue.ai_work_components)
    ? (issue.ai_work_components as Array<{ item: string; quantity: number; unit: string; rate?: number }>)
    : [];

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Link
        href="/issues"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Civic Feed
      </Link>

      {/* Main Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
              {issue.category?.name || 'Civic Issue'}
            </span>

            {severityInfo && (
              <span className={`text-xs font-semibold px-2.5 py-1 rounded border ${severityInfo.color}`}>
                {severityInfo.label}
              </span>
            )}
          </div>

          <span className={`text-xs font-bold px-3 py-1 rounded-full border ${statusInfo.color}`}>
            {statusInfo.label}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
          {issue.title}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 text-slate-400" />
            <span>{issue.address || `${issue.latitude?.toFixed(4)}, ${issue.longitude?.toFixed(4)}`}</span>
          </div>

          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            <span>Reported {formatDate(issue.created_at)}</span>
          </div>

          {issue.reporter?.full_name && (
            <div>
              By <span className="font-medium text-slate-700">{issue.reporter.full_name}</span>
            </div>
          )}
        </div>

        <p className="mt-6 text-sm sm:text-base text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
          {issue.description}
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left 2 Cols: AI Analysis + Repair Evidence */}
        <div className="md:col-span-2 space-y-6">
          {/* AI Analysis Panel */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-blue-100 text-blue-700">
                  <Sparkles className="h-4 w-4" />
                </div>
                <h2 className="text-base font-bold text-slate-900">AI Diagnosis & Work Components</h2>
              </div>

              {issue.ai_confidence && (
                <span className="text-xs font-medium text-slate-500">
                  Confidence: {Math.round(issue.ai_confidence * 100)}%
                </span>
              )}
            </div>

            {issue.ai_summary ? (
              <p className="text-xs sm:text-sm text-slate-600 mb-4 leading-relaxed">
                {issue.ai_summary}
              </p>
            ) : (
              <p className="text-xs text-slate-400 italic mb-4">
                Automated vision assessment ready for edge pipeline.
              </p>
            )}

            {workComponents.length > 0 ? (
              <div className="overflow-hidden rounded-lg border border-slate-200">
                <table className="min-w-full divide-y divide-slate-200 text-xs text-left">
                  <thead className="bg-slate-50 text-slate-700 font-semibold">
                    <tr>
                      <th className="px-3 py-2">Component / Task</th>
                      <th className="px-3 py-2">Estimated Units</th>
                      <th className="px-3 py-2 text-right">Standard Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {workComponents.map((comp, idx) => (
                      <tr key={idx}>
                        <td className="px-3 py-2.5 font-medium text-slate-800 capitalize">
                          {comp.item.replace(/_/g, ' ')}
                        </td>
                        <td className="px-3 py-2.5 text-slate-600">
                          {comp.quantity} {comp.unit}
                        </td>
                        <td className="px-3 py-2.5 text-right font-semibold text-slate-900">
                          {comp.rate ? formatCurrency(comp.rate) : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-xs text-slate-400 bg-slate-50 p-3 rounded-md">
                Approximate prototype estimate: standard category unit rate applies ({formatCurrency(issue.category?.base_unit_rate || 50)}/unit).
              </div>
            )}
          </div>

          {/* Repair & Evidence Photos (if applicable) */}
          {issue.repair && (
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-md bg-emerald-100 text-emerald-700">
                    <Wrench className="h-4 w-4" />
                  </div>
                  <h2 className="text-base font-bold text-slate-900">Repair Evidence & Verification</h2>
                </div>

                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Status: {issue.repair.status}
                </span>
              </div>

              {issue.repair.completion_notes && (
                <div className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200 mb-4">
                  <span className="font-semibold text-slate-900">Fixer Notes: </span>
                  {issue.repair.completion_notes}
                </div>
              )}

              {/* Before & After Photo Comparison */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Before Repair
                  </div>
                  {issue.repair.before_image_urls?.[0] ? (
                    <img
                      src={issue.repair.before_image_urls[0]}
                      alt="Before Repair"
                      className="w-full h-44 object-cover rounded-lg border border-slate-200"
                    />
                  ) : (
                    <div className="w-full h-44 bg-slate-100 rounded-lg flex items-center justify-center text-xs text-slate-400">
                      No initial photo
                    </div>
                  )}
                </div>

                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1.5">
                    After Repair (Completed)
                  </div>
                  {issue.repair.after_image_urls?.[0] ? (
                    <img
                      src={issue.repair.after_image_urls[0]}
                      alt="After Repair"
                      className="w-full h-44 object-cover rounded-lg border border-emerald-300 shadow-xs"
                    />
                  ) : (
                    <div className="w-full h-44 bg-slate-100 rounded-lg flex items-center justify-center text-xs text-slate-400">
                      Awaiting completion photo
                    </div>
                  )}
                </div>
              </div>

              {/* Community Approvals List */}
              {issue.verifications && issue.verifications.length > 0 && (
                <div className="mt-5 pt-4 border-t border-slate-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Community Sign-Offs ({issue.verifications.length} of 3 needed):
                  </h3>
                  <div className="space-y-2">
                    {issue.verifications.map((v, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs bg-slate-50 p-2 rounded border border-slate-100">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-slate-800">{v.vote}: </span>
                          <span className="text-slate-600">{v.comment || 'Verified safe'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Municipal Case Tracker (if AUTHORITY_REQUIRED) */}
          {issue.resolution_type === 'AUTHORITY_REQUIRED' && issue.authority_case && (
            <div className="rounded-xl border border-purple-200 bg-purple-50/50 p-6 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-purple-200 mb-4">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-purple-700" />
                  <h2 className="text-base font-bold text-purple-900">Municipal Agency Case</h2>
                </div>

                <span className="text-xs font-bold uppercase tracking-wider text-purple-800 bg-purple-100 px-2.5 py-0.5 rounded border border-purple-300">
                  {issue.authority_case.status}
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="font-semibold text-slate-600">Department: </span>
                  <span className="font-bold text-slate-900">
                    {issue.authority_case.department?.name || 'Public Works'}
                  </span>
                </div>

                <div>
                  <span className="font-semibold text-slate-600">Official Ticket: </span>
                  <span className="font-mono font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded">
                    {issue.authority_case.ticket_number}
                  </span>
                </div>

                {issue.authority_case.official_notes && (
                  <div>
                    <span className="font-semibold text-slate-600">Official Dispatch Update: </span>
                    <p className="mt-1 text-slate-700 bg-white p-3 rounded border border-purple-100">
                      {issue.authority_case.official_notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right 1 Col: Crowdfunding & Action Center */}
        <div className="space-y-6">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              CivicFix workflow
            </div>
            <div className="mt-2 text-sm font-semibold text-slate-800">
              Find it. Fund it. Fix it. Verify it.
            </div>
          </div>

          {/* Crowdfunding Card */}
          {issue.resolution_type !== 'AUTHORITY_REQUIRED' && funding.target > 0 && (
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <Coins className="h-5 w-5 text-amber-600" />
                <h3 className="text-base font-bold text-slate-900">Civic Micro-Funding</h3>
              </div>

              <div className="mt-2">
                <div className="text-3xl font-extrabold text-slate-900">
                  {formatCurrency(funding.raised)}
                </div>
                <div className="text-xs text-slate-500">
                  of {formatCurrency(funding.target)} target funded
                </div>
              </div>

              <div className="mt-3 w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    fundingPercent >= 100 ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                  style={{ width: `${fundingPercent}%` }}
                />
              </div>

              <div className="mt-2 flex justify-between text-xs text-slate-500">
                <span>{fundingPercent}% funded</span>
                <span>{issue.contributions?.length || 0} contributors</span>
              </div>
              {fundingPercent >= 100 && (
                <div className="mt-2 text-xs font-bold text-emerald-700">Funding Complete</div>
              )}

              {/* Sandbox Test Contribution CTA */}
              <div className="mt-6 pt-4 border-t border-slate-100">
                <ContributionPanel issueId={issue.id} />
              </div>

              {/* Contributors list */}
              {issue.contributions && issue.contributions.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">Contributors</h4>
                  <div className="space-y-1.5">
                    {issue.contributions.map((c) => (
                      <div key={c.id} className="flex items-center justify-between text-xs">
                        <span className="text-slate-700">
                          {c.is_anonymous ? 'Anonymous Neighbor' : c.contributor?.full_name || 'Citizen'}
                        </span>
                        <span className="font-semibold text-slate-900">{formatCurrency(c.amount)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Verification Voting Card */}
          {issue.status === 'VERIFYING' && (
            <div className="rounded-xl border border-cyan-200 bg-cyan-50/50 p-6 shadow-xs">
              <div className="flex items-center gap-2 mb-2 text-cyan-900">
                <ThumbsUp className="h-5 w-5 text-cyan-700" />
                <h3 className="text-base font-bold">Community Verification</h3>
              </div>
              <p className="text-xs text-slate-600 mb-4">
                Have you inspected this repaired area? Cast your vote to confirm it meets community safety standards.
              </p>

              <button
                type="button"
                className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white shadow-xs hover:bg-emerald-500 transition-colors mb-2 cursor-pointer"
              >
                Approve Fix Quality (Vote 3/3)
              </button>

              <button
                type="button"
                className="w-full rounded-lg bg-white border border-slate-300 px-4 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Report Quality Issue
              </button>
            </div>
          )}

          {/* Meta Info */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 text-xs text-slate-500 space-y-2">
            <div><span className="font-semibold text-slate-700">Issue ID: </span><span className="font-mono">{issue.id.slice(0, 8)}...</span></div>
            <div><span className="font-semibold text-slate-700">Workflow: </span>{issue.resolution_type || 'COMMUNITY_RESOLVABLE'}</div>
            <div><span className="font-semibold text-slate-700">Geo SRID: </span>WGS84 (EPSG:4326)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
