import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { geocodeCityLocal } from './indianCities';

// Fix Leaflet default marker icon issue with webpack
delete L.Icon.Default.prototype._getIconUrl;

// Custom marker icons
const createIcon = (color, emoji) => {
  return L.divIcon({
    className: 'custom-map-marker',
    html: `<div style="
      background: ${color};
      width: 36px;
      height: 36px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 3px 10px rgba(0,0,0,0.25);
      border: 3px solid white;
    ">
      <span style="transform: rotate(45deg); font-size: 16px;">${emoji}</span>
    </div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });
};

const fromIcon = createIcon('#3b82f6', '🚀');
const toIcon = createIcon('#10b981', '📍');

// Component to fit map bounds to markers
const FitBounds = ({ positions }) => {
  const map = useMap();
  useEffect(() => {
    if (positions.length >= 2) {
      const bounds = L.latLngBounds(positions);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
    } else if (positions.length === 1) {
      map.setView(positions[0], 10);
    }
  }, [map, positions]);
  return null;
};

// Geocode: uses local Indian cities database first, then API fallback

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const geocodeCity = async (city) => {
  if (!city || city.trim().length < 2) return null;
  
  // Try local database first (instant, no API call)
  const local = geocodeCityLocal(city);
  if (local) return local;
  
  // Fallback to API proxy
  try {
    const res = await fetch(`${API_BASE}/geocode?q=${encodeURIComponent(city)}`);
    const data = await res.json();
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
        displayName: data[0].display_name,
      };
    }
  } catch (err) {
    console.warn('Geocoding API fallback failed for:', city);
  }
  return null;
};

const RideMap = ({ from, to, height = '300px', showRoute = true, className = '' }) => {
  const [fromCoords, setFromCoords] = useState(null);
  const [toCoords, setToCoords] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const mapRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    const timer = setTimeout(async () => {
      setLoading(true);
      setError(false);
      setFromCoords(null);
      setToCoords(null);

      if (!from && !to) {
        setLoading(false);
        return;
      }

      const results = await Promise.all([
        from ? geocodeCity(from) : null,
        to ? geocodeCity(to) : null,
      ]);

      if (cancelled) return;

      const [fromResult, toResult] = results;
      
      if (fromResult) setFromCoords(fromResult);
      if (toResult) setToCoords(toResult);
      
      if (!fromResult && !toResult && (from || to)) {
        setError(true);
      }
      
      setLoading(false);
    }, 500); // debounce 500ms

    return () => { cancelled = true; clearTimeout(timer); };
  }, [from, to]);

  if (!from && !to) return null;

  if (loading) {
    return (
      <div
        className={`rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center ${className}`}
        style={{ height }}
      >
        <div className="flex flex-col items-center gap-2">
          <div className="map-loading-spinner" />
          <span className="text-sm text-slate-500">Loading map...</span>
        </div>
      </div>
    );
  }

  if (error || (!fromCoords && !toCoords)) {
    return (
      <div
        className={`rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center ${className}`}
        style={{ height }}
      >
        <div className="text-center">
          <span className="text-3xl">🗺️</span>
          <p className="text-sm text-slate-500 mt-2">Map unavailable for this route</p>
        </div>
      </div>
    );
  }

  const positions = [
    ...(fromCoords ? [[fromCoords.lat, fromCoords.lng]] : []),
    ...(toCoords ? [[toCoords.lat, toCoords.lng]] : []),
  ];

  const defaultCenter = fromCoords
    ? [fromCoords.lat, fromCoords.lng]
    : toCoords
    ? [toCoords.lat, toCoords.lng]
    : [20.5937, 78.9629]; // India center

  return (
    <div className={`rounded-2xl overflow-hidden border border-slate-200 shadow-sm ${className}`} style={{ height }}>
      <MapContainer
        center={defaultCenter}
        zoom={6}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitBounds positions={positions} />

        {fromCoords && (
          <Marker position={[fromCoords.lat, fromCoords.lng]} icon={fromIcon}>
            <Popup>
              <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                <strong style={{ color: '#3b82f6' }}>🚀 Departure</strong>
                <br />
                <span style={{ fontSize: '14px', fontWeight: 600 }}>{from}</span>
                <br />
                <span style={{ fontSize: '11px', color: '#64748b' }}>
                  {fromCoords.displayName?.split(',').slice(0, 3).join(',')}
                </span>
              </div>
            </Popup>
          </Marker>
        )}

        {toCoords && (
          <Marker position={[toCoords.lat, toCoords.lng]} icon={toIcon}>
            <Popup>
              <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                <strong style={{ color: '#10b981' }}>📍 Destination</strong>
                <br />
                <span style={{ fontSize: '14px', fontWeight: 600 }}>{to}</span>
                <br />
                <span style={{ fontSize: '11px', color: '#64748b' }}>
                  {toCoords.displayName?.split(',').slice(0, 3).join(',')}
                </span>
              </div>
            </Popup>
          </Marker>
        )}

        {showRoute && fromCoords && toCoords && (
          <Polyline
            positions={[
              [fromCoords.lat, fromCoords.lng],
              [toCoords.lat, toCoords.lng],
            ]}
            pathOptions={{
              color: '#3b82f6',
              weight: 3,
              dashArray: '10, 8',
              opacity: 0.8,
            }}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default RideMap;
