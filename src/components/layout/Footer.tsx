import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-600 text-white">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <span className="text-base font-bold text-slate-900">
              Civic<span className="text-emerald-600">Fix</span>
            </span>
            <span className="text-xs text-slate-500 ml-2">
              — "See it. Fund it. Fix it. Verify it."
            </span>
          </div>

          <div className="flex items-center gap-6 text-sm text-slate-600">
            <Link href="/dashboard" className="hover:text-slate-900">Citizen Dashboard</Link>
            <Link href="/issues" className="hover:text-slate-900">Civic Feed</Link>
            <Link href="/provider" className="hover:text-slate-900">Fixer Network</Link>
            <Link href="/authority" className="hover:text-slate-900">Authority Routing</Link>
          </div>

          <p className="text-xs text-slate-400">
            Built for civic impact with Next.js & Supabase.
          </p>
        </div>
      </div>
    </footer>
  );
}
