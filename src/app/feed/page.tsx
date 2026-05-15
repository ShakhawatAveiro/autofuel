'use client';

import { useEffect, useState } from 'react';
import { getFuelLogs } from '@/app/actions';
import { Activity, Droplet, Clock, Car } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function FeedPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      const data = await getFuelLogs();
      setLogs(data);
      setLoading(false);
    };
    fetchLogs();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24 text-zinc-400 animate-pulse text-lg">
        Loading feed logs...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500 max-w-3xl mx-auto w-full">
      <div className="flex items-center justify-between border-b border-border/50 pb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Activity className="text-primary w-8 h-8" />
            Community Feed
          </h1>
          <p className="text-zinc-400 mt-1">See who is fueling up right now.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full ring-1 ring-primary/20">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          <span className="text-sm font-medium">Live</span>
        </div>
      </div>

      <div className="space-y-4">
        {logs.length === 0 ? (
          <div className="text-center py-12 text-zinc-500 glass rounded-2xl">
            <Droplet className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>No fuel logs yet. Be the first!</p>
          </div>
        ) : (
          logs.map((log: any) => (
            <div key={log.id} className="glass p-5 sm:p-6 rounded-2xl flex flex-col sm:flex-row gap-4 sm:items-center justify-between hover:bg-white/[0.02] transition-colors group">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full text-primary group-hover:bg-primary/20 transition-colors">
                  <Car className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    {log.user.name} 
                    <span className="text-xs bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded uppercase tracking-wider font-mono">
                      {log.user.carNumber}
                    </span>
                  </h3>
                  <p className="text-zinc-400 text-sm mt-1">
                    Driving a <span className="text-zinc-200 font-medium">{log.user.carBrand}</span>
                  </p>
                  <p className="text-zinc-400 text-sm mt-0.5">
                    Filled up <span className="text-primary/90 font-medium">{log.user.fuelType}</span> at <span className="text-zinc-200 font-medium">{log.station.name}</span>
                  </p>
                </div>
              </div>
              
              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 border-t border-border/50 sm:border-none pt-4 sm:pt-0 mt-2 sm:mt-0">
                <div className="flex items-center gap-1.5 text-primary font-bold text-xl">
                  <Droplet className="w-5 h-5 fill-primary/20" />
                  {log.liters.toFixed(2)} L
                </div>
                <div className="flex items-center gap-1.5 text-zinc-500 text-sm">
                  <Clock className="w-3.5 h-3.5" />
                  {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
