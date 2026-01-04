'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  LogOut, 
  Sparkles, 
  Megaphone,
  X,
  Check,
  Ban
} from 'lucide-react';

export const StaffAgenda: React.FC = () => {
  const router = useRouter();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [globalBroadcast, setGlobalBroadcast] = useState<string | null>(null);

  useEffect(() => {
    const loadRealData = () => {
      const clientBookings = JSON.parse(localStorage.getItem('beauty_bookings') || '[]');
      const ownerBookings = JSON.parse(localStorage.getItem('owner_bookings_db') || '[]');
      const todayStr = new Date().toISOString().split('T')[0];
      
      const normalize = (b: any) => {
        // Força service e client a serem strings para evitar Erro #31
        let sName = "Serviço";
        if (typeof b.service === 'string') sName = b.service;
        else if (b.service && b.service.name) sName = String(b.service.name);

        return {
          id: b.id,
          time: b.time,
          client: String(b.userName || b.client || 'Cliente'),
          service: sName,
          price: b.service?.price || (b.priceValue ? `${b.priceValue}€` : '45€'),
          status: b.status,
          date: b.date
        };
      };

      const filtered = [...clientBookings, ...ownerBookings]
        .filter((b: any) => b.date === todayStr && (b.proId === 'p1' || b.professional?.id === 'p1'))
        .map(normalize);

      filtered.sort((a, b) => a.time.localeCompare(b.time));
      setAppointments(filtered);
    };

    loadRealData();
    setGlobalBroadcast(localStorage.getItem('beauty_global_broadcast'));
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

  return (
    <div className="max-w-2xl mx-auto pb-40 px-4 animate-fade-in pt-10">
      {globalBroadcast && (
        <div className="mb-8 bg-rose-500/10 border border-rose-500/20 p-5 rounded-3xl flex items-center justify-between shadow-xl">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-rose-500/20 rounded-xl flex items-center justify-center text-rose-400 animate-pulse"><Megaphone size={18} /></div>
              <p className="text-xs font-black text-white uppercase italic">{globalBroadcast}</p>
           </div>
           <button onClick={() => setGlobalBroadcast(null)} className="p-2 text-zinc-500 hover:text-white"><X size={16} /></button>
        </div>
      )}

      <div className="flex justify-between items-center mb-12">
        <div>
           <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic flex items-center gap-3 leading-none">Olá, Ana <Sparkles className="text-primary" size={24} /></h1>
           <p className="text-muted text-[11px] mt-3 font-black uppercase tracking-[0.3em]">Agenda do Dia</p>
        </div>
        <button onClick={() => router.push('/')} className="px-6 py-3 bg-surface border border-white/5 rounded-xl text-[10px] font-black uppercase text-muted hover:text-white transition-all flex items-center gap-2"><LogOut size={14} /> Sair</button>
      </div>

      <div className="space-y-6">
         {appointments.length === 0 ? (
            <div className="py-24 text-center border border-dashed border-white/5 rounded-[2.5rem] bg-surface/20 text-zinc-700 font-black uppercase text-[10px] tracking-widest">Sem tarefas</div>
         ) : (
           appointments.map((app) => (
              <div key={app.id} className={`flex gap-6 transition-all ${app.status === 'completed' ? 'opacity-30 grayscale' : ''}`}>
                 <div className="flex flex-col items-center min-w-[50px] pt-4">
                    <div className="w-12 h-12 rounded-2xl bg-background border border-primary/20 flex items-center justify-center text-xs font-black text-primary">{app.time}</div>
                    <div className="w-px h-full bg-border/30 mt-4"></div>
                 </div>
                 <div className="flex-grow p-6 rounded-[2.5rem] bg-surface border border-white/5 shadow-sm">
                    <div className="flex justify-between items-start mb-6">
                       <div>
                          <h3 className="text-lg font-black text-white uppercase italic mb-1">{app.client}</h3>
                          <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">{app.service}</p>
                       </div>
                       <span className="text-white font-black text-lg italic">{app.price}</span>
                    </div>
                    {app.status === 'confirmed' && (
                       <div className="flex justify-end gap-3 pt-6 border-t border-white/5">
                          <button onClick={() => handleStatusChange(app.id, 'no-show')} className="w-12 h-12 bg-white/5 text-zinc-500 hover:text-red-400 border border-white/5 rounded-2xl flex items-center justify-center"><Ban size={18} /></button>
                          <button onClick={() => handleStatusChange(app.id, 'completed')} className="h-12 px-6 bg-primary text-black rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all hover:bg-white active:scale-95 flex items-center gap-2 shadow-lg shadow-primary/10"><Check size={16} strokeWidth={3} /> Concluir</button>
                       </div>
                    )}
                 </div>
              </div>
           ))
         )}
      </div>
    </div>
  );
};