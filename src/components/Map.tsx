'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Station } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { Navigation2 } from 'lucide-react';

// Fix Leaflet's default icon path issues in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icon for the user's location
const userIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3603/3603850.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

// Component to recenter map when user location changes
function RecenterAutomatically({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 13);
  }, [lat, lng, map]);
  return null;
}

export default function Map({ stations }: { stations: Station[] }) {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        () => {
          // Fallback to London if geolocation is denied
          setUserLocation([51.505, -0.09]);
        }
      );
    } else {
      setUserLocation([51.505, -0.09]);
    }
  }, []);

  if (!userLocation) {
    return <div className="h-[500px] w-full flex items-center justify-center bg-card rounded-xl border border-border animate-pulse">
      <p className="text-zinc-500 flex items-center gap-2"><Navigation2 className="animate-spin w-5 h-5"/> Locating you...</p>
    </div>;
  }

  return (
    <div className="h-[500px] w-full rounded-xl overflow-hidden shadow-2xl ring-1 ring-border relative z-0">
      <MapContainer center={userLocation} zoom={13} scrollWheelZoom={true} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="map-tiles"
        />
        
        <RecenterAutomatically lat={userLocation[0]} lng={userLocation[1]} />

        {/* User Location Marker */}
        <Marker position={userLocation} icon={userIcon}>
          <Popup>
            <div className="font-semibold text-black">You are here</div>
          </Popup>
        </Marker>

        {/* Station Markers */}
        {stations.map((station) => (
          <Marker key={station.id} position={[station.latitude, station.longitude]}>
            <Popup>
              <div className="p-1">
                <h3 className="font-bold text-black text-lg mb-1">{station.name}</h3>
                <p className="text-sm text-zinc-600 mb-3">{station.address}</p>
                <button 
                  onClick={() => router.push(`/station/${station.id}`)}
                  className="w-full bg-primary hover:bg-primary-hover text-white font-medium py-1.5 rounded-md transition-colors"
                >
                  Log Fuel Here
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
