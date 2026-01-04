'use client';

import React, { useState } from 'react';
import { useRouter } from '../../App';
import { 
  Plus, X, ArrowLeft, ChevronRight, ChevronLeft, 
  LayoutGrid, Sparkles, CheckCircle2, Phone 
} from 'lucide-react';
import { Button } from '../../components/Button';
import { useBeautyData } from '../../hooks/useBeautyData';

const TIME_SLOTS = Array.from({ length: 19 }, (_, i) => {
  const hour = Math.floor(i / 2) + 9;
  return `${String(hour).padStart(2, '0')}:${i % 2 === 0 ? '00' : '30'}`;
});

export const OwnerAgenda: React.FC = () => {
  const router = useRouter();
  const { bookings, staff, updateBookingStatus } = useBeautyData();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);

  const dateKey = selectedDate.toISOString().split('T')[0];
  const dayBookings = bookings.filter(b => b.date === dateKey && b.status !== 'cancelled');

  const handleUpdateStatus = (status: string) => {
     if (selectedBooking) {
       updateBookingStatus(selectedBooking.id, status);
       setSelectedBooking(null);
     }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
       <aside className="w-80 bg-[#151516] border-r border-white/5 hidden lg:flex flex-col p-10">
          <button onClick={() => router.push('/owner/dashboard')} className="mb-12 text-muted hover:text-white flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"><ArrowLeft size={16} /> Dashboard</button>
          <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-10">Agenda</h1>
          <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
             <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Estado do Salão</p>
             <p className="text-sm font-bold text-emerald-400 flex items-center gap-2">● Online & Operacional</p>
          </div>
       </aside>

       <main className="flex-1 flex flex-col bg-[#121212]">
          <header className="h-24 border-b border-white/5 flex items-center justify-between px-8 bg-[#1a1a1c]">
             <div className="flex items-center gap-6">
                <button onClick={() => {
                  const d = new Date(selectedDate);
                  d.setDate(d.getDate() - 1);
                  setSelectedDate(d);
                }} className="w-12 h-12 rounded-2xl bg-surface border border-white/5 flex items-center justify-center text-zinc-400"><ChevronLeft size={20}/></button>
                <div className="text-center w-48">
                   <h2 className="text-xl font-black text-white uppercase italic leading-none">{selectedDate.toLocaleDateString('pt-PT', { weekday: 'long' })}</h2>
                   <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">{selectedDate.toLocaleDateString('pt-PT', { day: 'numeric', month: 'long' })}</p>
                </div>
                <button onClick={() => {
                  const d = new Date(selectedDate);
                  d.setDate(d.getDate() + 1);
                  setSelectedDate(d);
                }} className="w-12 h-12 rounded-2xl bg-surface border border-white/5 flex items-center justify-center text-zinc-400"><ChevronRight size={20}/></button>
             </div>
             <Button onClick={() => router.push('/owner/dashboard')} className="px-8 text-[10px]">Dashboard</Button>
          </header>

          <div className="flex-1 overflow-auto relative">
             <div className="flex min-w-full">
                <div className="w-20 flex-shrink-0 bg-[#1a1a1c] border-r border-white/5 pt-20">
                   {TIME_SLOTS.map(t => (
                      <div key={t} className="h-28 flex items-center justify-center text-[10px] font-black text-zinc-600 border-b border-white/5 relative">
                         <span className="absolute -top-3 px-1 bg-[#1a1a1c]">{t}</span>
                      </div>
                   ))}
                </div>
                {staff.map(pro => (
                   <div key={pro.id} className="min-w-[220px] flex-1 border-r border-white/5 relative">
                      <div className="sticky top-0 z-20 bg-[#1a1a1c] border-b border-white/5 h-20 flex flex-col justify-center text-center">
                         <h3 className="text-xs font-black uppercase text-rose-400">{pro.name}</h3>
                         <p className="text-[9px] text-zinc-500 font-bold uppercase">{pro.role}</p>
                      </div>
                      {TIME_SLOTS.map(t => {
                         const b = dayBookings.find(bk => bk.time === t && bk.proId === pro.id);
                         return (
                            <div key={t} className="h-28 border-b border-white/5 p-2">
                               {b ? (
                                  <button 
                                    onClick={() => setSelectedBooking(b)}
                                    className="w-full h-full rounded-xl bg-rose-500/10 border-l-4 border-rose-400 text-left p-3 flex flex-col justify-between overflow-hidden"
                                  >
                                     <p className="text-[11px] font-black text-white uppercase truncate">{String(b.client)}</p>
                                     <p className="text-[9px] font-bold text-rose-400 uppercase truncate">{String(b.service)}</p>
                                     {b.status === 'completed' && <CheckCircle2 size={10} className="text-emerald-500 ml-auto" />}
                                  </button>
                               ) : (
                                  <div className="w-full h-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                     <button className="w-8 h-8 rounded-full bg-white/5 text-zinc-600 flex items-center justify-center"><Plus size={14} /></button>
                                  </div>
                                )}
                            </div>
                         );
                      })}
                   </div>
                ))}
             </div>
          </div>
       </main>

       {selectedBooking && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setSelectedBooking(null)}></div>
             <div className="bg-surface w-full max-w-sm rounded-[2.5rem] p-8 border border-white/10 relative z-10">
                <div className="flex justify-between mb-8">
                   <h3 className="text-2xl font-black text-white italic uppercase">{String(selectedBooking.client)}</h3>
                   <button onClick={() => setSelectedBooking(null)}><X size={20}/></button>
                </div>
                <div className="space-y-4 mb-8">
                   <div className="p-4 bg-background rounded-2xl border border-white/5">
                      <p className="text-[9px] text-zinc-500 uppercase font-black">Serviço</p>
                      <p className="text-sm font-bold text-white uppercase">{String(selectedBooking.service)}</p>
                   </div>
                   <div className="p-4 bg-background rounded-2xl border border-white/5">
                      <p className="text-[9px] text-zinc-500 uppercase font-black">Hora</p>
                      <p className="text-sm font-bold text-white">{selectedBooking.time}</p>
                   </div>
                </div>
                <div className="space-y-3">
                   <button onClick={() => handleUpdateStatus('completed')} className="w-full py-4 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl font-black text-[10px] uppercase">Finalizar Visita</button>
                   <button onClick={() => handleUpdateStatus('cancelled')} className="w-full py-4 bg-white/5 text-zinc-500 border border-white/10 rounded-xl font-black text-[10px] uppercase">Cancelar Vaga</button>
                </div>
             </div>
          </div>
       )}
    </div>
  );
};