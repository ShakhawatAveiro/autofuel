'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerUser, loginUser } from './actions';
import { Car, User, Lock, Fuel } from 'lucide-react';

export default function Home() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [carNumber, setCarNumber] = useState('');
  const [carBrand, setCarBrand] = useState('');
  const [fuelType, setFuelType] = useState('Octane');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    let res;
    if (isLogin) {
      res = await loginUser(carNumber, password);
    } else {
      res = await registerUser(name, carNumber, carBrand, fuelType, password);
    }

    if (res.success && res.user) {
      // Very basic MVP auth state (don't use this in real production, use NextAuth)
      localStorage.setItem('userId', res.user.id);
      localStorage.setItem('userName', res.user.name);
      router.push('/map');
    } else {
      setError(res.error || 'Something went wrong');
    }
    setLoading(false);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-12">
      <div className="text-center mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="inline-flex items-center justify-center p-4 bg-primary/20 text-primary rounded-full mb-6 ring-1 ring-primary/30">
          <Fuel className="w-10 h-10" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
          Welcome to <span className="text-primary">AutoFuel</span>
        </h1>
        <p className="text-zinc-400 text-lg max-w-md mx-auto">
          Automating your fueling experience. Find nearby stations and log your fill-ups seamlessly.
        </p>
      </div>

      <div className="w-full max-w-md glass rounded-2xl p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-500 delay-150">
        <div className="flex bg-black/40 p-1 rounded-lg mb-8">
          <button 
            type="button"
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${isLogin ? 'bg-primary text-black shadow-lg' : 'text-zinc-400 hover:text-white'}`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button 
            type="button"
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${!isLogin ? 'bg-primary text-black shadow-lg' : 'text-zinc-400 hover:text-white'}`}
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-300 ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-zinc-500" />
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-black/50 border border-border rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-300 ml-1">Car Brand</label>
                <div className="relative">
                  <Car className="absolute left-3 top-3 w-5 h-5 text-zinc-500" />
                  <input 
                    type="text" 
                    required
                    value={carBrand}
                    onChange={e => setCarBrand(e.target.value)}
                    className="w-full bg-black/50 border border-border rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    placeholder="e.g. Toyota, BMW"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-300 ml-1">Fuel Type</label>
                <div className="relative">
                  <Fuel className="absolute left-3 top-3 w-5 h-5 text-zinc-500" />
                  <select
                    value={fuelType}
                    onChange={e => setFuelType(e.target.value)}
                    className="w-full bg-black/50 border border-border rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none"
                  >
                    <option value="Octane">Octane</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Petrol">Petrol</option>
                    <option value="Electric">Electric</option>
                  </select>
                </div>
              </div>
            </>
          )}

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-300 ml-1">Car Number</label>
            <div className="relative">
              <Car className="absolute left-3 top-3 w-5 h-5 text-zinc-500" />
              <input 
                type="text" 
                required
                value={carNumber}
                onChange={e => setCarNumber(e.target.value)}
                className="w-full bg-black/50 border border-border rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                placeholder="e.g. ঢাকা মেট্রো-গ ১২-৩৪৫৬ or ABC-1234"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-300 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-zinc-500" />
              <input 
                type="password" 
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-black/50 border border-border rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-hover text-black font-semibold py-3 rounded-lg mt-6 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all disabled:opacity-70 flex justify-center items-center gap-2"
          >
            {loading ? 'Processing...' : isLogin ? 'Access Account' : 'Register Vehicle'}
          </button>
        </form>
      </div>
    </div>
  );
}
