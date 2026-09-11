'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export interface GeoCoordinates {
  latitude: number;
  longitude: number;
  accuracy: number;
}

export type GeolocationStatus = 'idle' | 'detecting' | 'active' | 'error';

export interface GeolocationState {
  coordinates: GeoCoordinates | null;
  status: GeolocationStatus;
  error: string | null;
}

const GEO_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  maximumAge: 0,
  timeout: 10000,
};

function getGeolocationError(error: GeolocationPositionError): string {
  if (error.code === error.PERMISSION_DENIED) {
    return 'Location permission denied. Enable location access to use live GPS.';
  }

  if (error.code === error.POSITION_UNAVAILABLE) {
    return 'Unable to detect your location. Please check your device location settings.';
  }

  return 'Unable to detect your location. Please try again.';
}

/**
 * Tracks the real device location with one browser watchPosition subscription.
 * The watch is cleaned up on unmount so pages do not accumulate GPS listeners.
 */
export function useGeolocation(): GeolocationState & { requestLocation: () => void } {
  const watchIdRef = useRef<number | null>(null);
  const [state, setState] = useState<GeolocationState>({
    coordinates: null,
    status: 'idle',
    error: null,
  });

  const startTracking = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setState({
        coordinates: null,
        status: 'error',
        error: 'Location services are not supported by this browser.',
      });
      return;
    }

    setState((current) => ({ ...current, status: 'detecting', error: null }));

    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        setState({
          coordinates: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          },
          status: 'active',
          error: null,
        });
      },
      (error) => {
        setState((current) => ({
          ...current,
          status: 'error',
          error: getGeolocationError(error),
        }));
      },
      GEO_OPTIONS,
    );
  }, []);

  useEffect(() => {
    // Defer the first permission request until after the initial client render.
    const startTimeout = window.setTimeout(startTracking, 0);

    return () => {
      window.clearTimeout(startTimeout);
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [startTracking]);

  return { ...state, requestLocation: startTracking };
}
