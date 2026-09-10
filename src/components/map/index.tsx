'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import { IssueWithDetails } from '@/types';

interface CivicMapProps {
  issues: IssueWithDetails[];
  center?: [number, number];
  zoom?: number;
  height?: string;
  onMarkerClick?: (issue: IssueWithDetails) => void;
}

export const CivicMap = dynamic<CivicMapProps>(
  () => import('./CivicMapInner'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-80 flex flex-col items-center justify-center bg-slate-100 rounded-xl border border-slate-200 text-slate-500 animate-pulse">
        <span className="text-sm font-medium">Loading CivicFix GIS Map...</span>
      </div>
    ),
  }
);
