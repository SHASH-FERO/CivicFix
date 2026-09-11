'use client';

import { useState } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { formatCurrency } from '@/lib/utils';

interface ContributionPanelProps {
  issueId: string;
}

/**
 * Uses the existing contributions table for sandbox pledges. The numeric
 * values remain unchanged in Supabase; only their presentation is INR.
 */
export default function ContributionPanel({ issueId }: ContributionPanelProps) {
  const [submittingAmount, setSubmittingAmount] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleContribution(amount: number) {
    setSubmittingAmount(amount);
    setMessage(null);
    setError(null);

    try {
      const { error: insertError } = await supabase.from('contributions').insert({
        issue_id: issueId,
        contributor_id: 'a0000000-0000-0000-0000-000000000002',
        amount,
        is_anonymous: false,
        status: 'CONFIRMED',
      });

      if (insertError) throw insertError;
      setMessage(`Prototype contribution of ${formatCurrency(amount)} recorded.`);
    } catch (submissionError: unknown) {
      console.error('Contribution error:', submissionError);
      setError('The prototype contribution could not be recorded. Please try again.');
    } finally {
      setSubmittingAmount(null);
    }
  }

  return (
    <div className="mt-6 border-t border-slate-100 pt-4">
      <div className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-700">
        Quick Contribution
      </div>
      <div className="grid grid-cols-2 gap-2">
        {[1000, 5000].map((amount) => (
          <button
            key={amount}
            type="button"
            disabled={submittingAmount !== null}
            onClick={() => handleContribution(amount)}
            className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm font-bold text-emerald-800 transition-colors hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submittingAmount === amount ? 'Recording...' : formatCurrency(amount)}
          </button>
        ))}
      </div>
      {message && (
        <p className="mt-2 flex items-center gap-1 text-[11px] text-emerald-700">
          <CheckCircle2 className="h-3.5 w-3.5" /> {message}
        </p>
      )}
      {error && (
        <p className="mt-2 flex items-center gap-1 text-[11px] text-red-700">
          <AlertCircle className="h-3.5 w-3.5" /> {error}
        </p>
      )}
      <p className="mt-1.5 text-[11px] text-center text-slate-400">
        Prototype contribution — no real payment required.
      </p>
    </div>
  );
}
