'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Calendar, 
  Clock, 
  ArrowLeft, 
  XCircle, 
  RefreshCw, 
  Trophy, 
  Plus, 
  LogOut, 
  Star
} from 'lucide-react';
import { Button } from '../../components/Button';
import { useToast } from '../../components/Toast';

// Fixed: Added explicit typing with React.FC to allow 'key' prop when rendering in lists
interface BookingCardProps {
  booking: any;
  onCancel: (id: string) => void;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking, onCancel }) => {
  const isCancelled = booking.status === 'cancelled';
  const isCompleted = booking.status === 'completed';
  
  // Garantia: service deve ser string. Se for objeto legado, extrai o nome.
  const serviceName = typeof booking.service === 'string' 
    ? booking.service 
    : (booking.service?.name || "Serviço");

  const dateObj = new Date(booking.date);

  return (
    <div className={`rounded-[2rem] p-6 transition-all border ${isCancelled || isCompleted ? 'bg-surface/20 border-white/5 opacity-50 grayscale' : 'bg-surface border-white/5 hover:border-rose-400/30'}`}>
      <div className="flex justify-between items-start gap-4 mb-6">
          <div className="flex gap-4 items-center">
             <div className="w-14 h-14 rounded-2xl bg-[#252525] border border-white/5 flex flex-col items-center justify-center pt-1 shrink-0">
                <span className="text-xl font-black leading-none text-rose-400">{dateObj.getDate()}</span>
                <span className="text-[9px] font-black uppercase text-zinc-600">{dateObj.toLocaleString('pt-PT', { month: 'short' }).toUpperCase()}</span>
             </div>
             <div>
                 <h3 className="font-black text-base uppercase italic text-white leading-tight">{serviceName}</h3>
                 <p className="text-[10px] font-black text-zinc-500 uppercase mt-1">{booking.service?.price || '€45'}</p>
             </div>
          </div>
          <div className="shrink-0">
             {booking.status === 'confirmed' && <span className="bg-emerald-500/10 text-emerald-400 text-[9px] font-black px-3 py-1.5 rounded-full border border-emerald-500/20 uppercase tracking-widest">Confirmada</span>}
             {isCancelled && <span className="text-[9px] font-black text-red-400 bg-red-400/5 px-3 py-1.5 rounded-full border border-red-400/10 uppercase tracking-widest">Cancelada</span>}
          </div>
      </div>

      <div className="flex items-center gap-4 text-[11px] font-bold text-zinc-500 mb-6 px-1">
          <span className="flex items-center gap-2"><Clock size={14} className="text-rose-400" /> {booking.time}</span>
          <span className="w-1 h-1 bg-zinc-800 rounded-full"></span>
          <span className="flex items-center gap-2"><Star size={14} className="text-rose-400" /> {booking.professional?.name || 'Staff'}</span>
      </div>

      {booking.status === 'confirmed' && (
        <div className="flex gap-2 pt-4 border-t border-white/5">
           <button onClick={() => onCancel(booking.id)} className="flex-1 py-3.5 rounded-xl text-[10px] font-black uppercase text-red-500/60 hover:text-red-400 bg-red-500/5 border border-red-500/10 transition-all">Cancelar Vaga</button>
        </div>
      )}
    </div>
  );
};

export const MyBookings: React.FC = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const [bookings, setBookings] = useState<any[]>([]);
  const [userName, setUserName] = useState('Cliente');

  useEffect(() => {
    const userStr = localStorage.getItem('beauty_user');
    if (userStr) setUserName(JSON.parse(userStr).name.split(' ')[0]);
    const stored = localStorage.getItem('beauty_bookings');
    if (stored) setBookings(JSON.parse(stored));
  }, []);

  const handleCancel = (id: string) => {
    if (confirm("Desejas libertar esta vaga?")) {
      const updated = bookings.map(b => b.id === id ? { ...b, status: 'cancelled' } : b);
      setBookings(updated);
      localStorage.setItem('beauty_bookings', JSON.stringify(updated));
      showToast('success', 'Vaga libertada');
    }
  };

  const upcoming = bookings.filter(b => b.status === 'confirmed');

  return (
    <div className="max-w-3xl mx-auto pb-40 px-4 animate-fade-in pt-10">
      <div className="flex justify-between items-center mb-10">
         <button onClick={() => router.push('/')} className="text-muted hover:text-white flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"><ArrowLeft size={16} /> Principal</button>
         <button onClick={() => { localStorage.removeItem('beauty_user'); router.push('/'); }} className="text-red-500/60 text-[10px] font-black uppercase flex items-center gap-2"><LogOut size={14} /> Sair</button>
      </div>

      <div className="mb-12">
        <h1 className="text-4xl font-black text-white italic uppercase mb-2">Olá, <span className="text-rose-400">{userName}</span></h1>
        <p className="text-muted text-sm font-medium">Gere as tuas visitas e o teu Glow Club.</p>
      </div>

      <div className="bg-surface rounded-[2.5rem] p-8 border border-white/5 relative overflow-hidden mb-12 shadow-2xl">
         <div className="relative z-10 flex flex-col gap-6">
              <div className="flex items-center gap-3">
                 <div className="p-3 bg-background rounded-2xl border border-rose-500/20 shadow-lg text-rose-400"><Trophy size={24} /></div>
                 <div><h2 className="text-xl font-black text-white uppercase italic">Glow Club</h2><p className="text-[10px] text-muted font-black uppercase mt-1">Nível Bronze</p></div>
              </div>
              <div>
                 <div className="h-2 bg-background rounded-full overflow-hidden border border-white/5"><div className="h-full bg-rose-400" style={{ width: '40%' }}></div></div>
                 <div className="flex justify-between mt-3 text-[9px] text-zinc-600 font-black uppercase tracking-widest"><span>4 / 10 Visitas</span><span className="text-rose-400">Próximo Presente ✨</span></div>
              </div>
         </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between mb-8">
           <h2 className="text-[11px] font-black text-white uppercase tracking-[0.3em] italic">Próximas Visitas</h2>
           <Button onClick={() => router.push('/client/service')} className="px-6 h-10 text-[10px]"><Plus size={14} className="mr-2" /> Nova Marcação</Button>
        </div>
        {upcoming.length > 0 ? upcoming.map(b => <BookingCard key={b.id} booking={b} onCancel={handleCancel} />) : (
          <div className="text-center py-20 bg-surface/20 rounded-[2.5rem] border border-dashed border-white/10 text-zinc-600 text-xs font-bold uppercase">Sem visitas agendadas.</div>
        )}
      </div>
    </div>
  );
};