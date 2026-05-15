'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { logFuel } from '@/app/actions';
import { Fuel, CheckCircle2, ArrowLeft, CreditCard } from 'lucide-react';
import Link from 'next/link';

export default function StationPage() {
  const params = useParams();
  const stationId = params.id as string;
  const router = useRouter();
  
  const [liters, setLiters] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem('userId');
    if (!id) {
      router.push('/');
    } else {
      setUserId(id);
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !liters) return;
    
    setLoading(true);
    const res = await logFuel(userId, stationId, parseFloat(liters));
    
    if (res.success) {
      setSuccess(true);
      setTimeout(() => {
        router.push('/feed');
      }, 2000);
    } else {
      alert(res.error);
    }
    setLoading(false);
  };

  if (!userId) return null;

  return (
    <div className="max-w-lg mx-auto w-full animate-in fade-in zoom-in-95 duration-500 mt-12">
      <Link href="/map" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Map
      </Link>
      
      <div className="glass rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        {success ? (
          <div className="flex flex-col items-center justify-center py-12 text-center animate-in zoom-in duration-500">
            <CheckCircle2 className="w-20 h-20 text-primary mb-4" />
            <h2 className="text-2xl font-bold mb-2">Fuel Logged Successfully!</h2>
            <p className="text-zinc-400">Redirecting to the community feed...</p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-primary/20 text-primary rounded-xl ring-1 ring-primary/30">
                <Fuel className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Log Fuel</h1>
                <p className="text-zinc-400">Record your fill-up details</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Amount (Liters)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    step="0.01"
                    min="0.1"
                    required
                    value={liters}
                    onChange={e => setLiters(e.target.value)}
                    className="w-full bg-black/50 border border-border rounded-lg py-3 pl-4 pr-12 text-xl font-medium text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    placeholder="0.00"
                  />
                  <span className="absolute right-4 top-3 text-zinc-500 font-medium text-lg">L</span>
                </div>
              </div>

              {/* Future Online Payment Placeholder */}
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 border-dashed">
                <div className="flex items-center gap-3 text-primary/80 mb-2">
                  <CreditCard className="w-5 h-5" />
                  <span className="font-semibold">Future Feature</span>
                </div>
                <p className="text-sm text-zinc-400">Online payment integration is coming soon. For now, please pay at the station counter.</p>
              </div>

              <button 
                type="submit" 
                disabled={loading || !liters}
                className="w-full bg-primary hover:bg-primary-hover text-black font-bold text-lg py-4 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all disabled:opacity-50 disabled:shadow-none mt-4"
              >
                {loading ? 'Processing...' : 'Confirm & Log Fuel'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
