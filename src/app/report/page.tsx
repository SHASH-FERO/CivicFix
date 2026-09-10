'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { IssueCategory } from '@/types';
import { Camera, MapPin, Sparkles, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ReportPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<IssueCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [address, setAddress] = useState('45 George St, Downtown');
  const [latitude, setLatitude] = useState('-33.8688');
  const [longitude, setLongitude] = useState('151.2093');

  useEffect(() => {
    async function loadCategories() {
      const { data } = await supabase.from('issue_categories').select('*').order('name');
      if (data) {
        setCategories(data);
        if (data.length > 0) setCategoryId(data[0].id);
      }
      setLoadingCategories(false);
    }
    loadCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);

    try {
      const latNum = parseFloat(latitude);
      const lonNum = parseFloat(longitude);

      if (isNaN(latNum) || isNaN(lonNum)) {
        throw new Error('Please enter valid numeric latitude and longitude coordinates.');
      }

      // Default reporter ID to the demo citizen user
      const demoCitizenId = 'a0000000-0000-0000-0000-000000000002';
      const pointWkt = `POINT(${lonNum} ${latNum})`;

      const { data, error } = await supabase
        .from('issues')
        .insert({
          title,
          description,
          category_id: categoryId || null,
          location: pointWkt,
          address,
          reporter_id: demoCitizenId,
          status: 'REPORTED',
        })
        .select()
        .single();

      if (error) throw error;

      if (data?.id) {
        router.push(`/issues/${data.id}`);
      } else {
        router.push('/issues');
      }
    } catch (err: unknown) {
      console.error('Submission error:', err);
      const message = err instanceof Error ? err.message : 'An error occurred while submitting report.';
      setErrorMsg(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold uppercase tracking-wider mb-2 border border-emerald-200">
          <Camera className="h-3.5 w-3.5" />
          Citizen Reporting Portal
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
          Report a Civic Hazard
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Document an infrastructure problem. In the next phase, our AI Vision model will automatically analyze severity, components, and approximate restoration cost.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
        {errorMsg && (
          <div className="flex items-center gap-2 p-3 text-xs text-red-700 bg-red-50 rounded-lg border border-red-200">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Issue Title *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Broken Storm Drain Grate on 5th Ave"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Category
          </label>
          {loadingCategories ? (
            <div className="text-xs text-slate-400">Loading categories...</div>
          ) : (
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name} ({cat.default_resolution_type === 'AUTHORITY_REQUIRED' ? 'Municipal Agency' : 'Community Resolvable'})
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Image Upload Box (Phase 1 UI / Storage Ready) */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Photographic Evidence
          </label>
          <div className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-xl p-6 text-center transition-colors bg-slate-50 cursor-pointer">
            <Camera className="mx-auto h-8 w-8 text-slate-400 mb-2" />
            <span className="block text-xs font-semibold text-slate-700">
              Drag & drop photo or click to upload
            </span>
            <span className="block text-[11px] text-slate-400 mt-1">
              Supports JPEG, PNG, WEBP (Max 10 MB). Tied to Supabase `issue-images` bucket.
            </span>
          </div>
        </div>

        {/* Location & GPS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Street Address / Landmark
            </label>
            <input
              type="text"
              placeholder="e.g. Near Civic Center Library Entrance"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Latitude (GPS WGS84)
            </label>
            <input
              type="text"
              required
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm font-mono text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Longitude (GPS WGS84)
            </label>
            <input
              type="text"
              required
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm font-mono text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Issue Description *
          </label>
          <textarea
            rows={4}
            required
            placeholder="Describe the physical hazard, how long it has been there, and any safety concerns..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* AI Notice */}
        <div className="flex items-start gap-2.5 bg-blue-50/70 p-3.5 rounded-xl border border-blue-200 text-xs text-blue-800">
          <Sparkles className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
          <p>
            <span className="font-semibold">AI Vision Pipeline: </span>
            Upon submission, the issue will be diagnosed for work components (e.g., bags of asphalt, labor hours) and assigned a deterministic cost based on verified standard rates.
          </p>
        </div>

        {/* Submit Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-xs hover:bg-emerald-500 disabled:opacity-50 transition-colors cursor-pointer"
          >
            {submitting ? 'Submitting to Supabase...' : 'Submit Civic Report'}
          </button>
        </div>
      </form>
    </div>
  );
}
