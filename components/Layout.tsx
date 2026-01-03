'use client';

import React, { useEffect, useState } from 'react';
import { Sparkles, Menu, X, CreditCard, Sun, Moon, Lock } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { BottomNavbar } from './BottomNavbar';
import { useAppTheme } from '../app/providers';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { isLight, toggleTheme } = useAppTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [trialStatus, setTrialStatus] = useState<{ daysLeft: number, isExpired: boolean } | null>(null);

  const isManagement = pathname?.startsWith('/owner') || pathname?.startsWith('/staff') || pathname?.startsWith('/admin');
  const isOwner = pathname?.startsWith('/owner');
  const isLanding = pathname === '/' || pathname === '';

  useEffect(() => {
    if (typeof window !== 'undefined' && isOwner) {
      const startStr = localStorage.getItem('beauty_trial_start');
      if (startStr) {
        const startDate = new Date(startStr);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - startDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        const totalTrialDays = 7;
        const daysLeft = totalTrialDays - diffDays;

        setTrialStatus({
          daysLeft: Math.max(0, daysLeft),
          isExpired: daysLeft <= 0
        });
      }
    }
  }, [isOwner, pathname]);

  return (
    <div className={`flex flex-col min-h-screen text-[#f1f0e6] bg-[#1a1a1c] transition-colors duration-300 ${isLight ? 'light-mode' : ''} ${isManagement ? 'h-screen overflow-hidden' : ''}`}>
      
      {isOwner && trialStatus && (
        <div className={`shrink-0 px-4 py-2 text-center text-[11px] font-black uppercase tracking-widest flex justify-center items-center gap-4 relative z-[60] ${trialStatus.isExpired ? 'bg-rose-500 text-white' : 'bg-[#ebff57] text-black'}`}>
           {trialStatus.isExpired ? (
             <span className="flex items-center gap-2"><Lock size={14} /> Trial Expirado.</span>
           ) : (
             <span className="flex items-center gap-2"><CreditCard size={14} /> {trialStatus.daysLeft} dias de trial restantes.</span>
           )}
        </div>
      )}

      {!isManagement && (
        <header className="fixed top-0 w-full z-50 transition-all duration-300">
          <div className={`absolute inset-0 transition-all duration-500 ${isLanding ? 'bg-transparent' : 'bg-[#242426]/80 backdrop-blur-xl border-b border-white/5'}`}></div>
          
          <div className="container mx-auto px-6 h-20 flex items-center justify-between relative z-10">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 group-hover:border-[#ebff57]/50 flex items-center justify-center transition-all">
                <Sparkles size={18} className="text-[#ebff57]" />
              </div>
              <span className="text-xl font-black tracking-tighter text-white uppercase italic">BeautyAgent</span>
            </Link>

            <nav className="hidden md:flex items-center gap-10">
              <button onClick={toggleTheme} className="p-2.5 rounded-xl bg-white/5 text-zinc-400 hover:text-[#ebff57] transition-colors">
                {isLight ? <Moon size={20} /> : <Sun size={20} />}
              </button>
              <div className="flex items-center gap-6">
                <Link href="/owner/dashboard" className="text-[12px] font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">Login</Link>
                <Link href="/trial/register" className="px-8 py-3 rounded-xl text-[12px] font-black uppercase tracking-widest text-black bg-[#ebff57] hover:bg-white transition-all shadow-[0_0_20px_rgba(235,255,87,0.2)]">Trial Grátis</Link>
              </div>
            </nav>

            <div className="md:hidden flex items-center gap-4">
              <button className="p-2 text-zinc-400" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </header>
      )}

      <main className={`flex-1 flex flex-col relative ${isManagement ? 'w-full overflow-hidden' : isLanding ? 'w-full p-0' : 'container mx-auto pt-24 pb-20'}`}>
        {children}
      </main>

      {!isManagement && <BottomNavbar />}
    </div>
  );
};