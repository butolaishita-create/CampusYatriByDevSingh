import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import { geocodeCityLocal } from './indianCities';

delete L.Icon.Default.prototype._getIconUrl;

// Cache for geocoded cities
const geoCache = {};

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const geocodeCity = async (city) => {
  const key = city.toLowerCase().trim();
  if (geoCache[key]) return geoCache[key];
  
  // Try local database first (instant)
  const local = geocodeCityLocal(city);
  if (local) {
    geoCache[key] = { lat: local.lat, lng: local.lng };
    return geoCache[key];
  }
  
  // Fallback to API
  try {
    const res = await fetch(`${API_BASE}/geocode?q=${encodeURIComponent(city)}`);
    const data = await res.json();
    if (data && data.length > 0) {
      const result = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
      geoCache[key] = result;
      return result;
    }
  } catch (err) {
    console.warn('Geocoding failed:', city);
  }
  return null;
};

const createRideIcon = (index) =>
  L.divIcon({
    className: 'custom-map-marker',
    html: `<div style="
      background: linear-gradient(135deg, #3b82f6, #2563eb);
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px rgba(59,130,246,0.4);
      border: 2px solid white;
      color: white;
      font-size: 12px;
      font-weight: 700;
      font-family: 'Plus Jakarta Sans', sans-serif;
    ">${index + 1}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -16],
  });

const FitAllBounds = ({ points }) => {
  const map = useMap();
  useEffect(() => {
    if (points.length > 0) {
      const bounds = L.latLngBounds(points.map(p => [p.lat, p.lng]));
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 10 });
    }
  }, [map, points]);
  return null;
};

const RidesMapView = ({ rides }) => {
  const [rideGeoData, setRideGeoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const geocodeAll = async () => {
      const results = [];

      // Batch geocode with small delays to respect Nominatim rate limits
      for (let i = 0; i < rides.length && i < 20; i++) {
        const ride = rides[i];
        const [fromCoords, toCoords] = await Promise.all([
          geocodeCity(ride.from),
          geocodeCity(ride.to),
        ]);

        if (!cancelled && fromCoords) {
          results.push({
            ride,
            fromCoords,
            toCoords,
            index: i,
          });
        }

        // Small delay between batches to respect rate limits
        if (i > 0 && i % 2 === 0) {
          await new Promise(r => setTimeout(r, 300));
        }
      }

      if (!cancelled) {
        setRideGeoData(results);
        setLoading(false);
      }
    };

    if (rides.length > 0) {
      geocodeAll();
    } else {
      setLoading(false);
    }

    return () => { cancelled = true; };
  }, [rides]);

  if (loading) {
    return (
      <div className="rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center" style={{ height: '350px' }}>
        <div className="flex flex-col items-center gap-2">
          <div className="map-loading-spinner" />
          <span className="text-sm text-slate-500">Loading rides on map...</span>
        </div>
      </div>
    );
  }

  if (rideGeoData.length === 0) {
    return null;
  }

  const allPoints = rideGeoData.flatMap(r => [
    r.fromCoords,
    ...(r.toCoords ? [r.toCoords] : []),
  ]);

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  const formatTime = (d) => new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

  return (
    <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm" style={{ height: '350px' }}>
      <MapContainer
        center={[22.5, 78.9]}
        zoom={5}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitAllBounds points={allPoints} />

        {rideGeoData.map(({ ride, fromCoords, toCoords, index }) => (
          <React.Fragment key={ride._id}>
            <Marker position={[fromCoords.lat, fromCoords.lng]} icon={createRideIcon(index)}>
              <Popup>
                <div
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", cursor: 'pointer', minWidth: '160px' }}
                  onClick={() => navigate(`/rides/${ride._id}`)}
                >
                  <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '4px' }}>
                    {ride.from} → {ride.to}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    {formatDate(ride.date)} • {formatTime(ride.date)}
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#3b82f6', marginTop: '4px' }}>
                    ₹{ride.price}/seat • {ride.seatsAvailable} seats left
                  </div>
                  <div style={{ fontSize: '11px', color: '#3b82f6', marginTop: '6px', textDecoration: 'underline' }}>
                    View details →
                  </div>
                </div>
              </Popup>
            </Marker>

            {toCoords && (
              <Polyline
                positions={[
                  [fromCoords.lat, fromCoords.lng],
                  [toCoords.lat, toCoords.lng],
                ]}
                pathOptions={{
                  color: '#3b82f6',
                  weight: 2,
                  opacity: 0.4,
                  dashArray: '6, 6',
                }}
              />
            )}
          </React.Fragment>
        ))}
      </MapContainer>
    </div>
  );
};

export default RidesMapView;
