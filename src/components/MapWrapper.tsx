'use client';

import dynamic from 'next/dynamic';
import { Station } from '@prisma/client';

const MapWithNoSSR = dynamic(() => import('./Map'), {
  ssr: false,
  loading: () => <div className="h-[500px] w-full bg-card rounded-xl border border-border animate-pulse flex items-center justify-center">Loading Map...</div>
});

export default function MapWrapper({ stations }: { stations: Station[] }) {
  return <MapWithNoSSR stations={stations} />;
}
