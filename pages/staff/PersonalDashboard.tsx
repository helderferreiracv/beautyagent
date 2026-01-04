'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Share2, 
  User, 
  Users, 
  ArrowLeft, 
  TrendingUp,
  BarChart3,
  Wallet,
  ArrowUpRight,
  CreditCard,
  Banknote,
  Smartphone,
  X,
  ChevronRight
} from 'lucide-react';
import { Button } from '../../components/Button';
import { useToast } from '../../components/Toast';
import { useBeautyData } from '../../hooks/useBeautyData';

export const StaffPersonalDashboard: React.FC = () => {
  const params = useParams();
  const staffId = params?.staffId as string;
  const router = useRouter();
  const { showToast } = useToast();
  const { bookings, staff, updateBookingStatus } = useBeautyData();
  
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

  const member = useMemo(() => staff.find((s: any) => s.id === staffId), [staff, staffId]);
  
  const myBookings = useMemo(() => {
    if (!staffId) return [];
    return bookings
      .filter(b => b.proId === staffId)
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [bookings, staffId]);

  const handleOpenPayment = (id: string) => {
    setSelectedBookingId(id);
    setIsPaymentModalOpen(true);
  };

  const handleCompletePayment = (method: 'cash' | 'card' | 'mbway') => {
    if (selectedBookingId) {
      updateBookingStatus(selectedBookingId, 'completed', method);
      setIsPaymentModalOpen(false);
      setSelectedBookingId(null);
      showToast('success', 'Pagamento Registado');
    }
  };

  if (!member) return null;

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 pb-32 animate-fade-in">
       <button 
        onClick={() => router.push('/staff/agenda')} 
        className="mb-8 text-muted hover:text-white flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest transition-all"
      >
        <ArrowLeft size={14} /> Vista Geral
      </button>

       <div className="bg-surface rounded-[2.5rem] p-8 mb-6 border border-white/5 relative overflow-hidden shadow-2xl">
          <div className="relative z-10 flex items-center gap-6">
             <div className="w-20 h-20 rounded-3xl bg-background border border-primary/20 flex items-center justify-center text-2xl font-black text-primary italic">
                {member.name.charAt(0)}
             </div>
             <div>
                <h1 className="text-3xl font-black text-white tracking-tighter italic uppercase leading-none">{member.name}</h1>
                <p className="text-muted text-[11px] font-bold uppercase tracking-[0.2em] mt-2">{member.role}</p>
             </div>
          </div>
       </div>

       <div className="space-y-6">
          {myBookings.map(booking => (
            <div key={booking.id} className={`bg-surface p-5 rounded-3xl border border-white/5 flex items-center justify-between gap-4 transition-all ${booking.status === 'completed' ? 'opacity-40 grayscale' : 'hover:border-primary/30'}`}>
               <div className="flex items-center gap-5">
                  <div className="bg-background rounded-2xl p-3 text-center min-w-[65px] border border-white/5">
                     <span className="block text-primary font-black text-lg italic leading-none">{booking.time}</span>
                  </div>
                  <div>
                     <h3 className="font-black text-white text-base italic uppercase">{String(booking.client)}</h3>
                     <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-widest">{String(booking.service)}</p>
                  </div>
               </div>
               {booking.status === 'confirmed' && (
                  <button onClick={() => handleOpenPayment(booking.id)} className="px-6 py-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20 transition-all font-black text-[11px] uppercase">Finalizar</button>
               )}
            </div>
          ))}
       </div>

       {isPaymentModalOpen && (
         <div className="fixed inset-0 z-[200] flex items-end md:items-center justify-center p-0 md:p-4">
            <div className="absolute inset-0 bg-background/95 backdrop-blur-xl" onClick={() => setIsPaymentModalOpen(false)}></div>
            <div className="bg-surface w-full max-w-sm rounded-t-[3rem] p-8 border border-white/10 shadow-2xl relative z-10">
               <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-black text-white uppercase italic">Receber Pagamento</h3>
                  <button onClick={() => setIsPaymentModalOpen(false)}><X size={20} /></button>
               </div>
               <div className="space-y-3">
                  <button onClick={() => handleCompletePayment('cash')} className="w-full p-5 rounded-2xl bg-zinc-900 border border-white/5 flex items-center gap-4 group">
                     <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center"><Banknote size={24} /></div>
                     <p className="font-black text-white uppercase">Dinheiro</p>
                  </button>
                  <button onClick={() => handleCompletePayment('card')} className="w-full p-5 rounded-2xl bg-zinc-900 border border-white/5 flex items-center gap-4 group">
                     <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center"><CreditCard size={24} /></div>
                     <p className="font-black text-white uppercase">Multibanco</p>
                  </button>
                  <button onClick={() => handleCompletePayment('mbway')} className="w-full p-5 rounded-2xl bg-zinc-900 border border-white/5 flex items-center gap-4 group">
                     <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center"><Smartphone size={24} /></div>
                     <p className="font-black text-white uppercase">MBWay</p>
                  </button>
               </div>
            </div>
         </div>
       )}
    </div>
  );
};