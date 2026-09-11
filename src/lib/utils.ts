import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Demo records created before CivicFix adopted INR may contain very small
 * prototype targets. This display-only adapter keeps Supabase data intact
 * while presenting believable community funding ranges in the hackathon UI.
 */
export function getDisplayFunding(issue: {
  funding_raised: number;
  funding_target: number;
  resolution_type?: string | null;
  severity?: string | null;
}) {
  if (issue.resolution_type === 'AUTHORITY_REQUIRED' || issue.funding_target <= 0) {
    return { raised: issue.funding_raised, target: issue.funding_target };
  }

  const target =
    issue.funding_target >= 1000 && issue.funding_target <= 5000
      ? issue.funding_target
      : issue.severity === 'LOW'
        ? 1500
        : issue.severity === 'MEDIUM'
          ? 3000
          : 5000;

  // Preserve the original progress ratio when legacy demo records use
  // sub-thousand values, rather than showing a misleading zero progress.
  const originalProgress = issue.funding_target > 0
    ? Math.min(1, Math.max(0, issue.funding_raised / issue.funding_target))
    : 0;
  const raised = Math.round(originalProgress * target);

  return { raised, target };
}

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function getStatusBadge(status: string) {
  switch (status) {
    case 'REPORTED':
      return { label: 'Reported', color: 'bg-slate-100 text-slate-800 border-slate-300' };
    case 'ANALYZING':
    case 'ANALYZED':
      return { label: 'AI Analyzed', color: 'bg-blue-100 text-blue-800 border-blue-300' };
    case 'FUNDING':
      return { label: 'Crowdfunding', color: 'bg-amber-100 text-amber-800 border-amber-300' };
    case 'FUNDED':
      return { label: 'Fully Funded', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
    case 'ASSIGNED':
      return { label: 'Provider Assigned', color: 'bg-indigo-100 text-indigo-800 border-indigo-300' };
    case 'IN_PROGRESS':
      return { label: 'In Progress', color: 'bg-purple-100 text-purple-800 border-purple-300' };
    case 'REPAIRED':
    case 'VERIFYING':
      return { label: 'Community Verifying', color: 'bg-cyan-100 text-cyan-800 border-cyan-300' };
    case 'RESOLVED':
      return { label: 'Resolved & Verified', color: 'bg-green-100 text-green-800 border-green-300' };
    case 'CLOSED':
      return { label: 'Closed', color: 'bg-gray-100 text-gray-800 border-gray-300' };
    case 'REJECTED':
      return { label: 'Declined', color: 'bg-rose-100 text-rose-800 border-rose-300' };
    default:
      return { label: status, color: 'bg-slate-100 text-slate-800 border-slate-300' };
  }
}

export function getSeverityBadge(severity: string | null | undefined) {
  switch (severity) {
    case 'CRITICAL':
      return { label: 'Critical Hazard', color: 'bg-red-100 text-red-800 border-red-300' };
    case 'HIGH':
      return { label: 'High Priority', color: 'bg-orange-100 text-orange-800 border-orange-300' };
    case 'MEDIUM':
      return { label: 'Medium', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' };
    case 'LOW':
      return { label: 'Low', color: 'bg-green-100 text-green-800 border-green-300' };
    default:
      return null;
  }
}
