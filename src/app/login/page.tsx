'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { ShieldCheck, UserCircle, Wrench, Building2, Lock, ArrowRight, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const demoAccounts = [
    {
      role: 'Citizen Reporter',
      name: 'Sarah Jenkins',
      email: 'sarah.citizen@gmail.com',
      password: 'CitizenPass2026!',
      icon: UserCircle,
      desc: 'Submit issues, pledge funds, and verify repairs',
      redirect: '/dashboard',
    },
    {
      role: 'Verified Fixer',
      name: 'Mike Martinez (Apex Repairs)',
      email: 'mike@apexrepairs.com',
      password: 'ProviderPass2026!',
      icon: Wrench,
      desc: 'Accept jobs, upload repair proof, receive demo payout',
      redirect: '/provider',
    },
    {
      role: 'Municipal Officer',
      name: 'Dave Reynolds (Transit/Water)',
      email: 'traffic.dept@metro.gov',
      password: 'AuthorityPass2026!',
      icon: Building2,
      desc: 'Track and update municipal dispatch tickets',
      redirect: '/authority',
    },
    {
      role: 'Platform Admin',
      name: 'CivicFix Administrator',
      email: 'admin@civicfix.org',
      password: 'CivicFixAdmin2026!',
      icon: ShieldCheck,
      desc: 'Full system management and catalog rates',
      redirect: '/admin',
    },
  ];

  const handleLogin = async (loginEmail: string, loginPass: string, redirectUrl: string = '/dashboard') => {
    setErrorMsg(null);
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPass,
      });

      if (error) throw error;
      router.push(redirectUrl);
    } catch (err: unknown) {
      console.error('Login error:', err);
      const message = err instanceof Error ? err.message : 'Invalid credentials';
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-lg mx-auto mb-10">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm mb-4">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
          Sign In to Civic<span className="text-emerald-600">Fix</span>
        </h1>
        <p className="text-sm text-slate-500 mt-2">
          Find it. Fund it. Fix it. Verify it.
        </p>
        <p className="text-sm text-slate-500 mt-2">
          Connect with Supabase Auth to participate in community crowdfunding and infrastructure verification.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Email/Password Form */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 mb-4">Account Credentials</h2>

          {errorMsg && (
            <div className="flex items-center gap-2 p-3 text-xs text-red-700 bg-red-50 rounded-lg border border-red-200 mb-4">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin(email, password);
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-xs hover:bg-emerald-500 disabled:opacity-50 transition-colors cursor-pointer"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        </div>

        {/* Demo Fast-Switch Panel for Hackathon Presentation */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-2 mb-2">
            <Lock className="h-4 w-4 text-emerald-600" />
            <h2 className="text-base font-bold text-slate-900">Live Demo Quick-Login</h2>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Click any pre-seeded persona to sign in instantly during the presentation:
          </p>

          <div className="space-y-2.5">
            {demoAccounts.map((account) => {
              const Icon = account.icon;
              return (
                <button
                  key={account.email}
                  type="button"
                  onClick={() => {
                    setEmail(account.email);
                    setPassword(account.password);
                    handleLogin(account.email, account.password, account.redirect);
                  }}
                  className="w-full flex items-start gap-3 p-3 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 text-left transition-all group cursor-pointer"
                >
                  <div className="p-2 rounded-lg bg-slate-100 group-hover:bg-emerald-100 text-slate-700 group-hover:text-emerald-700 shrink-0 mt-0.5">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{account.role}</span>
                      <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-emerald-600 transition-transform group-hover:translate-x-0.5" />
                    </div>
                    <div className="text-xs font-medium text-slate-600 truncate">{account.name}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{account.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
