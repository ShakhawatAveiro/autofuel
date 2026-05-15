import { getStations } from '@/app/actions';
import { MapPin } from 'lucide-react';
import MapWrapper from '@/components/MapWrapper';

export default async function MapPage() {
  const stations = await getStations();

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
        <MapWrapper stations={stations} />
      </div>
    </div>
  );
}
