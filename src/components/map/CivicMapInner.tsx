'use client';

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { IssueWithDetails } from '@/types';
import { formatCurrency, getDisplayFunding } from '@/lib/utils';
import { useGeolocation } from '@/hooks/useGeolocation';

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
  const issueLayerRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const hasInitialLocationRef = useRef(false);
  const { coordinates, status, error, requestLocation } = useGeolocation();

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
      issueLayerRef.current = L.layerGroup().addTo(map);
    }
  }, [center, zoom]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    const issueLayer = issueLayerRef.current;
    if (!map || !issueLayer) return;

    issueLayer.clearLayers();
    const markers: L.Marker[] = [];

    issues.forEach((issue) => {
      const lat = issue.latitude;
      const lon = issue.longitude;
      const funding = getDisplayFunding(issue);

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
              funding.target > 0
                ? `<div style="font-size: 12px; color: #059669; margin-top: 2px;">
                    Funding: ${formatCurrency(funding.raised)} / ${formatCurrency(funding.target)}
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

        const marker = L.marker([lat, lon]).addTo(issueLayer).bindPopup(popupContent);
        markers.push(marker);
      }
    });

    if (markers.length > 0 && !hasInitialLocationRef.current) {
      const group = L.featureGroup(markers);
      map.fitBounds(group.getBounds().pad(0.2));
    }
  }, [issues]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !coordinates) return;

    const userIcon = L.divIcon({
      className: 'civicfix-user-marker',
      html: '<span class="civicfix-user-marker__dot"></span><span class="civicfix-user-marker__label">You are here</span>',
      iconSize: [112, 34],
      iconAnchor: [12, 12],
    });

    if (!userMarkerRef.current) {
      userMarkerRef.current = L.marker([coordinates.latitude, coordinates.longitude], {
        icon: userIcon,
        zIndexOffset: 1000,
      })
        .addTo(map)
        .bindPopup('You are here<br />Live device GPS location');
    } else {
      userMarkerRef.current.setLatLng([coordinates.latitude, coordinates.longitude]);
      userMarkerRef.current.setIcon(userIcon);
    }

    if (!hasInitialLocationRef.current) {
      map.setView([coordinates.latitude, coordinates.longitude], Math.max(map.getZoom(), 15));
      hasInitialLocationRef.current = true;
    }
  }, [coordinates]);

  useEffect(() => () => {
    mapInstanceRef.current?.remove();
    mapInstanceRef.current = null;
    issueLayerRef.current = null;
    userMarkerRef.current = null;
  }, []);

  return (
    <div className="relative">
      <div
        ref={mapContainerRef}
        style={{ height, width: '100%' }}
        className="rounded-xl border border-slate-200 overflow-hidden shadow-xs z-10"
      />
      <div className="absolute right-3 top-3 z-20 max-w-[calc(100%-1.5rem)] rounded-lg border border-white/80 bg-white/95 p-2 shadow-md">
        <button
          type="button"
          onClick={() => {
            requestLocation();
            if (coordinates) mapInstanceRef.current?.setView([coordinates.latitude, coordinates.longitude], 16);
          }}
          className="rounded-md bg-emerald-600 px-2.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-500"
        >
          Locate Me
        </button>
        <div className="mt-1 text-[10px] text-slate-600">
          {status === 'detecting' && 'Detecting your location...'}
          {status === 'active' && `Live location active · ±${Math.round(coordinates?.accuracy || 0)} m`}
          {status === 'error' && error}
          {status === 'idle' && 'Live GPS ready'}
        </div>
      </div>
    </div>
  );
}
