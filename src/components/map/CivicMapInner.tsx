'use client';

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { IssueWithDetails } from '@/types';
import Link from 'next/link';

interface CivicMapProps {
  issues: IssueWithDetails[];
  center?: [number, number];
  zoom?: number;
  height?: string;
  onMarkerClick?: (issue: IssueWithDetails) => void;
}

export default function CivicMapInner({
  issues,
  center = [-33.8688, 151.2093], // Default to Sydney demo district
  zoom = 14,
  height = '420px',
}: CivicMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Fix default leaflet icons
    delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: string })._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current).setView(center, zoom);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear existing markers if any
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // Add markers for issues
    const markers: L.Marker[] = [];

    issues.forEach((issue) => {
      const lat = issue.latitude;
      const lon = issue.longitude;

      if (lat != null && lon != null && !isNaN(lat) && !isNaN(lon)) {
        const popupContent = `
          <div style="font-family: sans-serif; min-width: 180px; padding: 4px;">
            <div style="font-size: 11px; font-weight: 600; color: #059669; text-transform: uppercase;">
              ${issue.category?.name || 'Civic Issue'}
            </div>
            <div style="font-weight: 700; font-size: 14px; margin-top: 2px; color: #0f172a;">
              ${issue.title}
            </div>
            <div style="font-size: 12px; color: #64748b; margin-top: 4px;">
              Status: <span style="font-weight: 600; color: #334155;">${issue.status}</span>
            </div>
            ${
              issue.funding_target > 0
                ? `<div style="font-size: 12px; color: #059669; margin-top: 2px;">
                    Funding: $${issue.funding_raised} / $${issue.funding_target}
                   </div>`
                : ''
            }
            <div style="margin-top: 8px;">
              <a href="/issues/${issue.id}" style="display: inline-block; font-size: 12px; font-weight: 600; background: #059669; color: white; padding: 4px 8px; border-radius: 4px; text-decoration: none;">
                View Details &rarr;
              </a>
            </div>
          </div>
        `;

        const marker = L.marker([lat, lon]).addTo(map).bindPopup(popupContent);
        markers.push(marker);
      }
    });

    if (markers.length > 0) {
      const group = L.featureGroup(markers);
      map.fitBounds(group.getBounds().pad(0.2));
    }

    return () => {
      // Do not destroy on every re-render to avoid flashing
    };
  }, [issues, center, zoom]);

  return (
    <div
      ref={mapContainerRef}
      style={{ height, width: '100%' }}
      className="rounded-xl border border-slate-200 overflow-hidden shadow-xs z-10"
    />
  );
}
