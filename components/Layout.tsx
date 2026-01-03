
import React, { useEffect, useState } from 'react';
import { Sparkles, Menu, X, ArrowRight, LogIn, Settings, Lock, CreditCard, Sun, Moon } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BottomNavbar } from './BottomNavbar';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLightMode, setIsLightMode] = useState(localStorage.getItem('theme') === 'light');
  const [trialStatus, setTrialStatus] = useState<{ daysLeft: number, isExpired: boolean } | null>(null);

  const isManagement = location.pathname.startsWith('/owner') || location.pathname.startsWith('/staff') || location.pathname.startsWith('/admin');
  const isOwner = location.pathname.startsWith('/owner');
  const isLanding = location.pathname === '/';

  useEffect(() => {
    if (isLightMode) {
      document.body.classList.add('light-mode');
      localStorage.setItem('theme', 'light');
    } else {
      document.body.classList.remove('light-mode');
      localStorage.setItem('theme', 'dark');
    }
  }, [isLightMode]);

  useEffect(() => {
    if (isOwner) {
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
  }, [isOwner, location]);

  const toggleTheme = () => setIsLightMode(!isLightMode);

  return (
    <div className={`flex flex-col font-sans text-text selection:bg-primary/20 bg-background ${isManagement ? 'h-screen overflow-hidden' : 'min-h-screen'}`}>
      
      {isOwner && trialStatus && (
        <div className={`shrink-0 px-4 py-2 text-center text-[11px] font-black uppercase tracking-widest flex justify-center items-center gap-4 relative z-[60] ${trialStatus.isExpired ? 'bg-red-500 text-white' : 'bg-primary text-black'}`}>
           {trialStatus.isExpired ? (
             <>
               <span className="flex items-center gap-2"><Lock size={14} /> Trial Expirado. Acesso limitado.</span>
               <button className="bg-white text-red-500 px-3 py-1 rounded-md hover:bg-zinc-100 transition-colors">Subscrever Agora</button>
             </>
           ) : (
             <>
               <span className="flex items-center gap-2"><CreditCard size={14} /> {trialStatus.daysLeft} dias restantes no Trial Grátis.</span>
               <button className="underline decoration-black/50 hover:decoration-black transition-all">Ver Planos</button>
             </>
           )}
        </div>
      )}

      {!isManagement && (
        <header className="fixed top-0 w-full z-50 transition-all duration-300">
          <div className={`absolute inset-0 transition-all duration-500 ${isLanding ? 'bg-transparent' : 'bg-surface/80 backdrop-blur-xl border-b border-white/5'}`}></div>
          
          <div className="container mx-auto px-6 h-16 flex items-center justify-between relative z-10">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="p-2 rounded-lg bg-white/5 border border-white/5 group-hover:border-primary/50 transition-colors">
                <Sparkles size={16} className="text-primary" />
              </div>
              <span className="text-base font-black tracking-tighter text-white uppercase italic">
                BeautyAgent
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              <button onClick={toggleTheme} className="p-2 rounded-xl bg-white/5 text-zinc-400 hover:text-primary transition-colors">
                {isLightMode ? <Moon size={18} /> : <Sun size={18} />}
              </button>
              <div className="flex items-center gap-4">
                {isOwner ? (
                  <>
                    <button onClick={() => navigate('/owner/dashboard')} className="text-[12px] font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">Dashboard</button>
                    <button onClick={() => navigate('/owner/settings')} className="text-[12px] font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors flex items-center gap-2"><Settings size={14} /> Definições</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => navigate('/owner/dashboard')} className="px-5 py-2 rounded-lg text-[12px] font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-all hover:bg-white/5 flex items-center gap-2"><LogIn size={14} /> Login</button>
                    <button onClick={() => navigate('/trial/register')} className="px-6 py-2.5 rounded-xl text-[12px] font-black uppercase tracking-widest text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center gap-2 active:scale-95">Trial <ArrowRight size={14} strokeWidth={3} /></button>
                  </>
                )}
              </div>
            </nav>

            <div className="md:hidden flex items-center gap-4">
              <button onClick={toggleTheme} className="p-2 rounded-xl bg-white/5 text-zinc-400">
                {isLightMode ? <Moon size={20} /> : <Sun size={20} />}
              </button>
              <button className="text-zinc-400 hover:text-white p-1 active:scale-90 transition-transform" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {isMenuOpen && (
            <div className="md:hidden absolute top-16 left-0 w-full bg-surface border-b border-white/10 p-6 flex flex-col gap-6 shadow-2xl animate-fade-in z-50">
              <button onClick={() => { navigate('/trial/register'); setIsMenuOpen(false); }} className="text-2xl font-black text-white uppercase italic text-left tracking-tight">Começar Trial</button>
              <button onClick={() => { navigate('/owner/dashboard'); setIsMenuOpen(false); }} className="text-sm font-bold text-zinc-400 uppercase tracking-widest text-left">Painel Salão</button>
              <button onClick={() => { navigate('/client/service'); setIsMenuOpen(false); }} className="text-sm font-bold text-primary uppercase tracking-widest text-left flex items-center gap-2"><Sparkles size={16}/> Demo Cliente</button>
            </div>
          )}
        </header>
      )}

      <main className={`flex-1 flex flex-col relative min-h-0 ${isManagement ? 'w-full overflow-hidden' : isLanding ? 'w-full p-0' : 'container mx-auto pt-20 pb-12'}`}>
        {isManagement ? (
           <div className="w-full h-full overflow-y-auto">
              {/* Header inside management to handle theme toggle */}
              <div className="absolute top-6 right-8 z-50 hidden md:block">
                 <button onClick={toggleTheme} className="p-3 rounded-2xl bg-surface/50 backdrop-blur-md border border-white/5 text-zinc-400 hover:text-primary transition-all shadow-xl">
                    {isLightMode ? <Moon size={20} /> : <Sun size={20} />}
                 </button>
              </div>
              {children}
           </div>
        ) : children}
      </main>

      <BottomNavbar />
    </div>
  );
};
