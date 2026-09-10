'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ShieldCheck, 
  MapPin, 
  PlusCircle, 
  Wrench, 
  Building2, 
  LayoutDashboard, 
  UserCircle 
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/issues', label: 'Civic Feed', icon: MapPin },
    { href: '/report', label: 'Report Issue', icon: PlusCircle, highlight: true },
    { href: '/provider', label: 'Fixers', icon: Wrench },
    { href: '/authority', label: 'Authority', icon: Building2 },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur shadow-xs">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-sm">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                Civic<span className="text-emerald-600">Fix</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-medium tracking-wide uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                Civic Tech MVP
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    link.highlight
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : isActive
                      ? 'bg-slate-100 text-emerald-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${link.highlight ? 'text-white' : ''}`} />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="hidden lg:inline-flex items-center text-xs font-medium text-slate-500 hover:text-slate-800 px-2 py-1 rounded hover:bg-slate-100"
          >
            Admin Portal
          </Link>

          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-xs hover:bg-slate-50 transition-colors"
          >
            <UserCircle className="h-4 w-4 text-slate-500" />
            <span>Sign In</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
