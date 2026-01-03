import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  LogOut, 
  Sparkles, 
  Megaphone,
  X,
  BarChart3,
  Check,
  Ban
} from 'lucide-react';
import { Button } from '../../components/Button';

const MOCK_STAFF_PROFILE = {
  id: 'p1',
  name: 'Ana Silva',
  role: 'Hairstylist',
  referralsThisMonth: 12
};

interface BookingItem {
  id: string;
  time: string;
  client: string;
  service: string;
  price: string;
  status: string;
  duration: string;
  date: string;
}

export const StaffAgenda: React.FC = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<BookingItem[]>([]);
  const [globalBroadcast, setGlobalBroadcast] = useState<string | null>(null);

  useEffect(() => {
    const loadRealData = () => {
      const clientBookingsStr = localStorage.getItem('beauty_bookings');
      const clientBookings = clientBookingsStr ? JSON.parse(clientBookingsStr) : [];
      const ownerBookingsStr = localStorage.getItem('owner_bookings_db');
      const ownerBookings = ownerBookingsStr ? JSON.parse(ownerBookingsStr) : [];
      const todayStr = new Date().toISOString().split('T')[0];
      
      const normalize = (b: any, source: 'client' | 'owner') => {
        let sName = 'Serviço';
        if (typeof b.service === 'string') sName = b.service;
        else if (b.service && typeof b.service === 'object') sName = b.service.name || 'Serviço';

        if (source === 'client') {
          return {
            id: b.id,
            time: b.time,
            client: b.userName || 'Cliente App',
            service: sName,
            price: typeof b.service?.price === 'string' ? b.service.price : `${b.service?.price || 0}€`,
            status: b.status,
            duration: b.service?.duration || '0 min',
            date: b.date
          };
        } else {
          return {
            id: b.id,
            time: b.time,
            client: b.client,
            service: sName,
            price: b.priceValue ? `${b.priceValue}€` : '45€',
            status: b.status,
            duration: '60 min',
            date: b.date
          };
        }
      };

      const normalizedClient = clientBookings
        .filter((b: any) => b.date === todayStr && (b.professional === 'agent' || b.professional?.id === 'p1'))
        .map((b: any) => normalize(b, 'client'));

      const normalizedOwner = ownerBookings
        .filter((b: any) => b.date === todayStr && b.proId === 'p1')
        .map((b: any) => normalize(b, 'owner'));

      let combined = [...normalizedClient, ...normalizedOwner];
      combined.sort((a, b) => a.time.localeCompare(b.time));
      setAppointments(combined);
    };

    loadRealData();
    const broadcast = localStorage.getItem('beauty_global_broadcast');
    if (broadcast) setGlobalBroadcast(broadcast);
  }, []);

  const handleStatusChange = (id: string, newStatus: string) => {
    const updated = appointments.map(app => app.id === id ? { ...app, status: newStatus } : app);
    setAppointments(updated);
    
    const clientBookings = JSON.parse(localStorage.getItem('beauty_bookings') || '[]');
    const ownerBookings = JSON.parse(localStorage.getItem('owner_bookings_db') || '[]');
    const updateFn = (list: any[]) => list.map(b => b.id === id ? { ...b, status: newStatus } : b);
    localStorage.setItem('beauty_bookings', JSON.stringify(updateFn(clientBookings)));
    localStorage.setItem('owner_bookings_db', JSON.stringify(updateFn(ownerBookings)));
  };

  const remaining = appointments.filter(a => a.status === 'confirmed' || a.status === 'waiting').length;
  const completedCount = appointments.filter(a => a.status === 'completed').length;

  return (
    <div className="max-w-2xl mx-auto pb-40 px-4 animate-fade-in pt-10">
      {globalBroadcast && (
        <div className="mb-8 bg-rose-500/10 border border-rose-500/20 p-5 rounded-3xl flex items-center justify-between shadow-xl">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-rose-500/20 rounded-xl flex items-center justify-center text-rose-400 animate-pulse">
                <Megaphone size={18} />
              </div>
              <p className="text-xs font-black text-white uppercase tracking-tight italic">{globalBroadcast}</p>
           </div>
           <button onClick={() => setGlobalBroadcast(null)} className="p-2 text-zinc-500 hover:text-white transition-colors">
              <X size={16} />
           </button>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
        <div>
           <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic flex items-center gap-3 leading-none">
             Olá, {MOCK_STAFF_PROFILE.name.split(' ')[0]} <Sparkles className="text-primary" size={24} />
           </h1>
           <p className="text-muted text-[11px] mt-3 font-black uppercase tracking-[0.3em]">
             Tens <span className="text-white">{remaining} tarefas</span> ativas
           </p>
        </div>
        
        <button onClick={() => navigate('/')} className="px-6 py-3 bg-surface border border-border rounded-xl text-[10px] font-black uppercase tracking-widest text-muted hover:text-white transition-all flex items-center gap-2 active:scale-95">
          <LogOut size={14} /> Sair
        </button>
      </div>

      <div className="flex items-center justify-between mb-8 px-2">
         <h2 className="text-[11px] font-black text-white uppercase tracking-[0.3em] italic">Agenda do Dia</h2>
         <div className="text-[9px] font-black text-muted bg-surface px-4 py-2 rounded-full border border-border uppercase tracking-[0.2em]">
            {completedCount} Finalizados
         </div>
      </div>

      <div className="relative space-y-6">
         {appointments.length === 0 ? (
            <div className="py-24 text-center border border-dashed border-border rounded-[2.5rem] bg-surface/20 opacity-30">
               <p className="text-[11px] font-black uppercase tracking-[0.4em]">Dia Livre</p>
            </div>
         ) : (
           appointments.map((app) => {
              const isCompleted = app.status === 'completed';
              const isNoShow = app.status === 'no-show';

              return (
                <div key={app.id} className={`relative transition-all duration-500 ${isCompleted ? 'opacity-30 grayscale' : ''}`}>
                   <div className="flex gap-6">
                      <div className="flex flex-col items-center min-w-[50px] pt-4">
                         <div className={`w-12 h-12 rounded-2xl bg-background border flex items-center justify-center text-xs font-black italic uppercase transition-all ${isCompleted ? 'border-white/5 text-zinc-700' : 'border-primary/20 text-primary shadow-lg shadow-primary/5'}`}>
                            {app.time}
                         </div>
                         <div className="w-px h-full bg-border/30 mt-4"></div>
                      </div>

                      <div className={`flex-grow p-6 rounded-[2.5rem] border transition-all duration-500 shadow-sm ${isCompleted ? 'bg-zinc-900/20 border-white/5' : 'bg-surface border-border hover:border-primary/30'}`}>
                         <div className="flex justify-between items-start mb-6">
                            <div>
                               <h3 className="text-lg font-black text-white uppercase italic tracking-tight mb-1 truncate max-w-[150px]">{app.client}</h3>
                               <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest flex items-center gap-2">
                                  <Sparkles size={12} className="text-primary" /> {app.service}
                               </p>
                            </div>
                            <div className="text-right">
                               <span className="block text-white font-black text-lg italic tracking-tighter">{app.price}</span>
                               <span className="text-[9px] text-muted font-black uppercase tracking-widest">{app.duration}</span>
                            </div>
                         </div>

                         {!isCompleted && !isNoShow ? (
                           <div className="flex justify-end gap-3 pt-6 border-t border-white/5">
                              <button onClick={() => handleStatusChange(app.id, 'no-show')} className="w-12 h-12 bg-white/5 hover:bg-red-500/10 text-zinc-500 hover:text-red-400 border border-white/5 rounded-2xl transition-all active:scale-90 flex items-center justify-center">
                                 <Ban size={18} />
                              </button>
                              <button onClick={() => handleStatusChange(app.id, 'completed')} className="h-12 px-6 bg-primary text-black rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all hover:bg-white active:scale-95 flex items-center gap-2 shadow-lg shadow-primary/10">
                                 <Check size={16} strokeWidth={3} /> Concluir
                              </button>
                           </div>
                         ) : (
                           <div className={`mt-2 inline-flex items-center gap-2.5 px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest ${
                             isCompleted ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-500/60' : 'bg-red-500/5 border-red-500/10 text-red-500/60'
                           }`}>
                              {isCompleted ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                              <span className="ml-1 uppercase">{app.status}</span>
                           </div>
                         )}
                      </div>
                   </div>
                </div>
              );
           })
         )}
      </div>

      <div className="fixed bottom-32 left-1/2 -translate-x-1/2 md:hidden">
         <button onClick={() => navigate(`/staff/view/${MOCK_STAFF_PROFILE.id}`)} className="bg-primary text-black px-8 py-4 rounded-full font-black uppercase text-[11px] tracking-widest shadow-[0_20px_50px_rgba(235,255,87,0.4)] flex items-center gap-3 active:scale-95 transition-all border-[4px] border-background">
            <BarChart3 size={18} /> Painel Financeiro
         </button>
      </div>
    </div>
  );
};