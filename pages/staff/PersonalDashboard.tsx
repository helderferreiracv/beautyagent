
import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  const { staffId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { bookings, staff, refresh, updateBookingStatus } = useBeautyData();
  
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

  const member = useMemo(() => staff.find((s: any) => s.id === staffId), [staff, staffId]);
  
  const myBookings = useMemo(() => {
    if (!staffId) return [];
    const id = staffId.replace('p', '');
    return bookings
      .filter(b => b.proId === staffId || b.proId === id)
      .sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime());
  }, [bookings, staffId]);

  const referralCount = useMemo(() => {
     // Simulação: na v3.0 a lista unificada terá referralId
     return 12; 
  }, []);

  const handleOpenPayment = (id: string) => {
    setSelectedBookingId(id);
    setIsPaymentModalOpen(true);
  };

  const handleCompletePayment = (method: 'cash' | 'card' | 'mbway') => {
    if (selectedBookingId) {
      updateBookingStatus(selectedBookingId, 'completed', method);
      setIsPaymentModalOpen(false);
      setSelectedBookingId(null);
      showToast('success', 'Pagamento Registado', `Recebido via ${method === 'cash' ? 'Dinheiro' : method === 'card' ? 'Multibanco' : 'MBWay'}.`);
    }
  };

  const handleStatusUpdate = (id: string, newStatus: string) => {
    if (newStatus === 'completed') {
      handleOpenPayment(id);
    } else {
      updateBookingStatus(id, newStatus);
      showToast(newStatus === 'no-show' ? 'error' : 'info', 'Estado Atualizado');
    }
  };

  const copyReferralLink = () => {
    const baseUrl = window.location.origin + window.location.pathname;
    const link = `${baseUrl}#/referral/${staffId}`;
    navigator.clipboard.writeText(link).then(() => {
       showToast('ai', 'Link Copiado', 'Pronto para enviar às tuas clientes.');
    });
  };

  // Finanças
  const financialStats = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const commRate = member ? parseFloat(member.commission) / 100 : 0.15;

    const monthlyCompleted = myBookings.filter(b => {
      const d = new Date(b.date);
      return b.status === 'completed' && d.getMonth() === currentMonth;
    });

    const totalRevenue = monthlyCompleted.reduce((acc, b) => acc + b.priceValue, 0);
    const estimatedEarnings = totalRevenue * commRate;

    const weeklyGains = [0, 0, 0, 0];
    monthlyCompleted.forEach(b => {
      const day = new Date(b.date).getDate();
      const weekIdx = Math.min(Math.floor((day - 1) / 7), 3);
      weeklyGains[weekIdx] += b.priceValue * commRate;
    });

    return { estimatedEarnings, totalRevenue, weeklyGains, completedCount: monthlyCompleted.length };
  }, [myBookings, member]);

  if (!member) return <div className="py-20 text-center text-muted animate-pulse font-bold uppercase tracking-widest text-[11px]">A sincronizar...</div>;

  const todayStr = new Date().toISOString().split('T')[0];
  const todayBookings = myBookings.filter(b => b.date === todayStr);
  const futureBookings = myBookings.filter(b => b.date > todayStr);

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 pb-32 animate-fade-in">
       <button 
        onClick={() => navigate('/staff/agenda')} 
        className="mb-8 text-muted hover:text-white flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest transition-all group"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Vista Geral
      </button>

       {/* Profile Header */}
       <div className="bg-surface rounded-[2.5rem] p-8 mb-6 border border-white/5 relative overflow-hidden shadow-2xl group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-all duration-700"></div>
          <div className="relative z-10">
             <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
                <div className="w-20 h-20 rounded-3xl bg-background border border-primary/20 flex items-center justify-center text-2xl font-black text-primary shadow-xl italic">
                   {member.name.charAt(0)}
                </div>
                <div className="text-center sm:text-left">
                   <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-[11px] font-black uppercase tracking-widest mb-2 border border-primary/10">
                      <TrendingUp size={10} /> Consola Especialista
                   </div>
                   <h1 className="text-3xl font-black text-white tracking-tighter italic uppercase leading-none">{member.name}</h1>
                   <p className="text-muted text-[11px] font-bold uppercase tracking-[0.2em] mt-2">{member.role}</p>
                </div>
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="bg-background/40 p-5 rounded-2xl border border-white/5 flex flex-col justify-between">
                   <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-widest mb-4">Glow Club</p>
                   <div className="flex items-end justify-between">
                      <p className="text-3xl font-black text-white italic">{referralCount}</p>
                      <div className="p-2 bg-primary/10 rounded-lg text-primary"><Users size={18} /></div>
                   </div>
                </div>
                <button onClick={copyReferralLink} className="bg-primary hover:bg-white hover:text-background text-white p-5 rounded-2xl font-black flex flex-col items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-primary/20 border border-primary/20">
                   <Share2 size={24} />
                   <span className="text-[11px] uppercase tracking-widest">Partilhar Link</span>
                </button>
             </div>
          </div>
       </div>

       {/* Finanças */}
       <div className="bg-surface rounded-[2.5rem] p-8 mb-10 border border-rose-500/10 relative overflow-hidden shadow-xl group">
          <div className="relative z-10">
             <div className="flex justify-between items-start mb-8">
                <div>
                   <div className="flex items-center gap-2 mb-2">
                      <Wallet size={14} className="text-rose-400" />
                      <h2 className="text-[11px] font-black text-rose-400 uppercase tracking-[0.2em]">Ganhos Estimados</h2>
                   </div>
                   <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-black text-white italic tracking-tighter">{financialStats.estimatedEarnings.toFixed(2)}€</span>
                      <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">({member.commission}%)</span>
                   </div>
                </div>
                <div className="bg-rose-500/10 p-3 rounded-2xl border border-rose-500/20"><BarChart3 size={20} className="text-rose-400" /></div>
             </div>
             <div className="flex items-end gap-3 h-24 mb-4">
                {financialStats.weeklyGains.map((gain, i) => {
                  const maxGain = Math.max(...financialStats.weeklyGains, 100);
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group/bar">
                       <div className="w-full bg-zinc-800/50 rounded-lg h-full relative overflow-hidden border border-white/5">
                          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-rose-500/40 to-rose-400/60 transition-all duration-700 ease-out rounded-t-lg" style={{ height: `${(gain / maxGain) * 100}%` }}></div>
                       </div>
                       <span className="text-[11px] font-black text-zinc-700 uppercase tracking-tighter">S{i+1}</span>
                    </div>
                  );
                })}
             </div>
          </div>
       </div>

       {/* Agenda List */}
       <div className="space-y-10">
          <section>
             <div className="flex items-center justify-between mb-6">
                <h2 className="text-[11px] font-black text-white uppercase tracking-[0.3em] italic flex items-center gap-2"><Clock size={14} className="text-primary" /> Hoje ({todayBookings.length})</h2>
                <div className="h-px flex-grow bg-white/5 ml-4"></div>
             </div>
             <div className="space-y-4">
                {todayBookings.length === 0 ? (
                  <div className="py-12 text-center text-zinc-600 font-bold text-[11px] uppercase tracking-widest border border-dashed border-white/5 rounded-3xl">Sem marcações para hoje.</div>
                ) : (
                  todayBookings.map(booking => (
                    <div key={booking.id} className={`bg-surface p-5 rounded-3xl border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${booking.status === 'completed' ? 'opacity-40 grayscale' : 'hover:border-primary/30'}`}>
                       <div className="flex items-center gap-5">
                          <div className="bg-background rounded-2xl p-3 text-center min-w-[65px] border border-white/5">
                             <span className="block text-primary font-black text-lg italic leading-none mb-1">{booking.time}</span>
                             <span className="block text-[11px] text-zinc-600 font-bold uppercase tracking-tighter">Hoje</span>
                          </div>
                          <div>
                             <h3 className="font-black text-white text-base italic uppercase">{booking.client}</h3>
                             <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-widest">{booking.service as string}</p>
                             <div className="flex items-center gap-2 mt-2">
                                <span className={`text-[11px] font-black px-2 py-0.5 rounded border uppercase tracking-widest ${booking.status === 'confirmed' ? 'bg-blue-500/10 text-blue-400 border-blue-500/10' : booking.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/10' : 'bg-amber-500/10 text-amber-400 border-amber-500/10'}`}>
                                   {booking.status}
                                </span>
                             </div>
                          </div>
                       </div>
                       {(booking.status === 'confirmed' || booking.status === 'waiting') && (
                          <div className="flex gap-2">
                             <button onClick={() => handleStatusUpdate(booking.id, 'completed')} className="flex-1 sm:flex-none px-6 py-3 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white rounded-xl border border-emerald-500/20 transition-all font-black text-[11px] uppercase tracking-widest active:scale-95">Finalizar</button>
                             <button onClick={() => handleStatusUpdate(booking.id, 'no-show')} className="p-3 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-xl border border-red-500/20 transition-all active:scale-95"><XCircle size={18} /></button>
                          </div>
                       )}
                    </div>
                  ))
                )}
             </div>
          </section>
          {futureBookings.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.3em] italic flex items-center gap-2"><Calendar size={14} /> Próximos Dias ({futureBookings.length})</h2>
                <div className="h-px flex-grow bg-white/5 ml-4"></div>
              </div>
              <div className="space-y-3">
                 {futureBookings.map(booking => (
                   <div key={booking.id} className="bg-surface/30 p-4 rounded-2xl border border-white/5 flex items-center justify-between opacity-60">
                      <div className="flex items-center gap-4">
                         <span className="text-[11px] font-black text-zinc-500 uppercase">{new Date(booking.date).toLocaleDateString('pt-PT', {day: '2-digit', month: 'short'})}</span>
                         <div>
                            <p className="text-[12px] font-bold text-white uppercase">{booking.client}</p>
                            <p className="text-[11px] text-zinc-600 font-bold uppercase">{booking.service as string} • {booking.time}</p>
                         </div>
                      </div>
                      <ChevronRight size={14} className="text-zinc-800" />
                   </div>
                 ))}
              </div>
            </section>
          )}
       </div>

       {/* Payment Modal (POS) */}
       {isPaymentModalOpen && (
         <div className="fixed inset-0 z-[200] flex items-end md:items-center justify-center p-0 md:p-4 animate-in fade-in duration-200">
            <div className="absolute inset-0 bg-background/95 backdrop-blur-xl" onClick={() => setIsPaymentModalOpen(false)}></div>
            <div className="bg-surface w-full max-w-sm rounded-t-[3rem] md:rounded-[3rem] p-8 border-t md:border border-white/10 shadow-2xl relative z-10 animate-in slide-in-from-bottom-full duration-300">
               <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Receber Pagamento</h3>
                  <button onClick={() => setIsPaymentModalOpen(false)} className="p-2 bg-white/5 rounded-full text-zinc-500 hover:text-white transition-colors"><X size={20} /></button>
               </div>
               <div className="space-y-3">
                  <button onClick={() => handleCompletePayment('cash')} className="w-full p-5 rounded-2xl bg-zinc-900 border border-white/5 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all flex items-center gap-4 group">
                     <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform"><Banknote size={24} /></div>
                     <div className="text-left"><p className="font-black text-white uppercase tracking-tight">Dinheiro</p><p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Registar em caixa</p></div>
                  </button>
                  <button onClick={() => handleCompletePayment('card')} className="w-full p-5 rounded-2xl bg-zinc-900 border border-white/5 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all flex items-center gap-4 group">
                     <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform"><CreditCard size={24} /></div>
                     <div className="text-left"><p className="font-black text-white uppercase tracking-tight">Multibanco / Cartão</p><p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">TPA Terminal</p></div>
                  </button>
                  <button onClick={() => handleCompletePayment('mbway')} className="w-full p-5 rounded-2xl bg-zinc-900 border border-white/5 hover:border-rose-500/30 hover:bg-rose-500/5 transition-all flex items-center gap-4 group">
                     <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center group-hover:scale-110 transition-transform"><Smartphone size={24} /></div>
                     <div className="text-left"><p className="font-black text-white uppercase tracking-tight">MBWay</p><p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Digital</p></div>
                  </button>
               </div>
            </div>
         </div>
       )}
    </div>
  );
};
