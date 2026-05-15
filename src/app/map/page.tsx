'use client';

import { useEffect, useState } from 'react';
import { getStations } from '@/app/actions';
import { MapPin } from 'lucide-react';
import MapWrapper from '@/components/MapWrapper';

export default function MapPage() {
  const [stations, setStations] = useState<any[]>([]);

  useEffect(() => {
    const fetchStations = async () => {
      const data = await getStations();
      setStations(data);
    };
    fetchStations();
  }, []);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <MapPin className="text-primary w-8 h-8" />
            Nearby Stations
          </h1>
          <p className="text-zinc-400 mt-1">Select a station on the map to log your fuel.</p>
        </div>
      </div>
      
      <div className="bg-card p-2 rounded-2xl shadow-xl ring-1 ring-border">
        {stations.length > 0 ? (
          <MapWrapper stations={stations} />
        ) : (
          <div className="h-[500px] w-full bg-card rounded-xl border border-border animate-pulse flex items-center justify-center">
            Loading Map...
          </div>
        )}
      </div>
    </div>
  );
}
