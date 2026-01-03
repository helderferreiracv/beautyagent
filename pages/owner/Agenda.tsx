
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  X,
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  Clock,
  User,
  Calendar as CalendarIcon,
  LayoutGrid,
  List,
  Sparkles,
  Ban,
  CheckCircle2,
  RefreshCw,
  Phone,
  MoreHorizontal,
  AlertTriangle,
  Filter,
  Check,
  Monitor,
  Coffee,
  Lock,
  ShoppingBag,
  Euro
} from 'lucide-react';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { useToast } from '../../components/Toast';
import { useBeautyData } from '../../hooks/useBeautyData';

// --- CONFIGURAÇÃO VISUAL & CORES STAFF ---
const STAFF_THEMES = [
  { id: 'rose', bg: 'bg-rose-500/10', border: 'border-rose-500', text: 'text-rose-400', badge: 'bg-rose-500 text-white' },
  { id: 'blue', bg: 'bg-blue-500/10', border: 'border-blue-500', text: 'text-blue-400', badge: 'bg-blue-500 text-white' },
  { id: 'emerald', bg: 'bg-emerald-500/10', border: 'border-emerald-500', text: 'text-emerald-400', badge: 'bg-emerald-500 text-black' },
  { id: 'purple', bg: 'bg-purple-500/10', border: 'border-purple-500', text: 'text-purple-400', badge: 'bg-purple-500 text-white' },
  { id: 'amber', bg: 'bg-amber-500/10', border: 'border-amber-500', text: 'text-amber-400', badge: 'bg-amber-500 text-black' },
];

const TIME_SLOTS = Array.from({ length: 19 }, (_, i) => {
  const hour = Math.floor(i / 2) + 9; // 09:00 start
  const minute = i % 2 === 0 ? '00' : '30';
  return `${String(hour).padStart(2, '0')}:${minute}`;
});

const WEEKDAYS_SHORT = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];
const MONTHS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

export const OwnerAgenda: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { bookings: allBookings, staff, services, waitingList, refresh, updateBookingStatus } = useBeautyData();

  // Estados de Navegação
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day');
  
  // Estados de Modal
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [isNewBookingOpen, setIsNewBookingOpen] = useState(false);
  const [newBookingData, setNewBookingData] = useState<any>({});

  // Estados de Pausa Rápida & Upsell
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [blockData, setBlockData] = useState({ time: '', proId: '', duration: 30, reason: 'Pausa' });
  
  const [isUpsellModalOpen, setIsUpsellModalOpen] = useState(false);
  const [upsellData, setUpsellData] = useState({ name: '', price: '' });

  // --- HELPER DATA ---
  const dateKey = selectedDate.toISOString().split('T')[0];

  const getStaffTheme = (staffId: string) => {
     const idx = staff.findIndex(s => s.id === staffId);
     return STAFF_THEMES[(idx >= 0 ? idx : 0) % STAFF_THEMES.length];
  };

  const handleDateChange = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const handleToday = () => {
    setSelectedDate(new Date());
    setViewMode('day');
  };

  // --- ACTIONS ---
  const handleOpenNew = (time: string, proId: string) => {
    setNewBookingData({ 
        time, 
        proId, 
        date: dateKey,
        client: '',
        service: services[0]?.name || ''
    });
    setIsNewBookingOpen(true);
  };

  const handleOpenBlock = (time: string, proId: string) => {
    setBlockData({ time, proId, duration: 30, reason: 'Pausa' });
    setIsBlockModalOpen(true);
  };

  const handleSaveBlock = () => {
    const conflict = allBookings.find(b => 
       b.date === dateKey && 
       b.time === blockData.time && 
       b.proId === blockData.proId &&
       b.status !== 'cancelled'
    );

    if (conflict) {
       showToast('error', 'Ocupado', 'Já existe uma marcação neste horário.');
       return;
    }

    const newBlock = {
        id: Math.random().toString(36).substr(2, 9),
        date: dateKey,
        time: blockData.time,
        proId: blockData.proId,
        client: blockData.reason,
        service: `Bloqueio (${blockData.duration}m)`,
        status: 'blocked',
        priceValue: 0,
        source: 'manual'
    };

    const current = JSON.parse(localStorage.getItem('owner_bookings_db') || '[]');
    localStorage.setItem('owner_bookings_db', JSON.stringify([newBlock, ...current]));
    
    refresh();
    setIsBlockModalOpen(false);
    showToast('info', 'Bloqueado', `${blockData.reason} registada.`);
  };

  const handleApplyAiSuggestion = (suggestion: any, time: string, proId: string) => {
     const clientName = suggestion.message.split(': ')[1] || 'Cliente Lista';
     setNewBookingData({
        time,
        proId,
        date: dateKey,
        client: clientName,
        service: 'Sugestão AI',
        isAiSuggestion: true
     });
     setIsNewBookingOpen(true);
  };

  const handleSaveBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const conflict = allBookings.find(b => 
       b.date === newBookingData.date && 
       b.time === newBookingData.time && 
       b.proId === newBookingData.proId &&
       b.status !== 'cancelled'
    );

    if (conflict) {
       showToast('error', 'Horário ocupado', 'Tenta outro horário.');
       return;
    }

    const newBooking = {
        id: Math.random().toString(36).substr(2, 9),
        ...newBookingData,
        status: 'confirmed',
        source: 'manual',
        priceValue: 45 // Stub value
    };
    
    const current = JSON.parse(localStorage.getItem('owner_bookings_db') || '[]');
    localStorage.setItem('owner_bookings_db', JSON.stringify([newBooking, ...current]));
    
    refresh();
    setIsNewBookingOpen(false);
    showToast('success', 'Marcação guardada com sucesso');
  };

  const handleUpdateStatus = (status: string) => {
     if (!selectedBooking) return;
     updateBookingStatus(selectedBooking.id, status);
     
     let msg = 'Estado atualizado.';
     if (status === 'completed') msg = 'Serviço concluído e faturado.';
     if (status === 'no-show') msg = 'Cliente marcado como falta.';
     if (status === 'cancelled') msg = 'Marcação cancelada e vaga libertada.';

     showToast(status === 'no-show' || status === 'cancelled' ? 'error' : 'success', 'Atualizado', msg);
     setSelectedBooking(null);
  };

  const handleOpenUpsell = () => {
    setUpsellData({ name: '', price: '' });
    setIsUpsellModalOpen(true);
  };

  const handleSaveUpsell = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking || !upsellData.name || !upsellData.price) return;

    const extraPrice = parseFloat(upsellData.price);
    const updatedPrice = (selectedBooking.priceValue || 0) + extraPrice;
    
    const clientBookings = JSON.parse(localStorage.getItem('beauty_bookings') || '[]');
    const ownerBookings = JSON.parse(localStorage.getItem('owner_bookings_db') || '[]');

    const updateFn = (list: any[]) => list.map(b => 
      b.id === selectedBooking.id 
        ? { 
            ...b, 
            priceValue: b.priceValue + extraPrice,
            service: (b.service.name || b.service) + ` + ${upsellData.name}`
          } 
        : b
    );

    if (selectedBooking.source === 'app') {
       localStorage.setItem('beauty_bookings', JSON.stringify(updateFn(clientBookings)));
    } else {
       localStorage.setItem('owner_bookings_db', JSON.stringify(updateFn(ownerBookings)));
    }

    refresh();
    setIsUpsellModalOpen(false);
    setSelectedBooking(null);
    showToast('success', 'Upsell Adicionado', `Valor atualizado para ${updatedPrice}€`);
  };

  // --- RENDERERS ---

  const renderMonthView = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const today = new Date();

    return (
      <div className="p-4 md:p-12 animate-fade-in pb-32 h-full overflow-y-auto">
         <div className="grid grid-cols-7 gap-1 md:gap-4 mb-4 text-center">
            {WEEKDAYS_SHORT.map(d => (
               <div key={d} className="text-[10px] lg:text-xs font-black uppercase text-zinc-500 tracking-[0.2em]">
                  {d}
               </div>
            ))}
         </div>

         <div className="grid grid-cols-7 gap-1 md:gap-4 lg:gap-6">
            {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
               const day = i + 1;
               const currentStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
               const count = allBookings.filter(b => b.date === currentStr && b.status !== 'cancelled').length;
               
               const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
               
               let style = 'bg-[#252525] border-white/5 text-zinc-400 hover:bg-white/5';
               let dotColor = 'bg-zinc-600';

               if (isToday) {
                  style = 'bg-primary text-black font-black shadow-[0_0_20px_rgba(235,255,87,0.3)] scale-[1.02] border-transparent z-10';
               } else if (count >= 10) {
                  style = 'bg-rose-500/10 border-rose-500/30 text-white shadow-[0_0_10px_rgba(244,63,94,0.1)]';
                  dotColor = 'bg-rose-500';
               } else if (count >= 5) {
                  style = 'bg-orange-500/10 border-orange-500/30 text-white';
                  dotColor = 'bg-orange-500';
               } else if (count > 0) {
                  style = 'bg-emerald-500/10 border-emerald-500/30 text-white';
                  dotColor = 'bg-emerald-500';
               }

               return (
                  <button 
                    key={day}
                    onClick={() => { setSelectedDate(new Date(currentStr)); setViewMode('day'); }}
                    className={`aspect-square rounded-xl md:rounded-[1.5rem] border flex flex-col items-center justify-center relative transition-all hover:scale-105 active:scale-95 ${style}`}
                  >
                     <span className={`text-sm md:text-xl lg:text-3xl ${isToday ? 'font-black' : 'font-bold'}`}>{day}</span>
                     {count > 0 && (
                        <div className={`w-1.5 h-1.5 md:w-2 md:h-2 lg:w-3 lg:h-3 rounded-full mt-1 lg:mt-3 ${isToday ? 'bg-black' : dotColor}`}></div>
                     )}
                     {isToday && (
                        <span className="text-[7px] md:text-[8px] lg:text-[10px] font-black uppercase tracking-wider text-black/70 absolute bottom-2">Hoje</span>
                     )}
                  </button>
               );
            })}
         </div>
      </div>
    );
  };

  const renderWeekView = () => {
     const startOfWeek = new Date(selectedDate);
     startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
     const weekDays = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date(startOfWeek);
        d.setDate(startOfWeek.getDate() + i);
        return d;
     });

     return (
        <div className="p-4 md:p-12 animate-fade-in pb-32 h-full overflow-y-auto">
           <h3 className="text-sm lg:text-base font-black text-zinc-500 uppercase tracking-[0.3em] mb-8 text-center truncate">
              Semana {startOfWeek.getDate()} - {new Date(startOfWeek.getTime() + 6*86400000).getDate()} {MONTHS[startOfWeek.getMonth()]}
           </h3>
           <div className="grid grid-cols-2 md:grid-cols-7 gap-3 md:gap-4 lg:gap-6">
              {weekDays.map((date) => {
                 const dStr = date.toISOString().split('T')[0];
                 const isToday = dStr === new Date().toISOString().split('T')[0];
                 const dailyBookings = allBookings.filter(b => b.date === dStr && b.status !== 'cancelled');
                 const load = dailyBookings.length;
                 const dayIndex = date.getDay();
                 
                 return (
                    <div 
                      key={dStr} 
                      onClick={() => { setSelectedDate(date); setViewMode('day'); }} 
                      className={`
                        border rounded-[1.5rem] lg:rounded-[2rem] p-4 lg:p-6 flex flex-col gap-3 lg:gap-6 cursor-pointer hover:border-primary/50 transition-all min-h-[150px] lg:min-h-[300px] relative overflow-hidden group
                        ${isToday ? 'bg-primary border-primary shadow-xl shadow-primary/20 scale-[1.02] z-10' : 'bg-surface border-white/5'}
                      `}
                    >
                       <div className={`text-center border-b pb-2 lg:pb-4 relative z-10 ${isToday ? 'border-black/10' : 'border-white/5'}`}>
                          <span className={`text-[9px] lg:text-xs font-black uppercase tracking-[0.2em] block mb-1 ${isToday ? 'text-black/60' : 'text-zinc-500'}`}>{WEEKDAYS_SHORT[dayIndex]}</span>
                          <span className={`text-2xl lg:text-5xl font-black ${isToday ? 'text-black' : 'text-white'}`}>{date.getDate()}</span>
                       </div>
                       <div className="flex-1 flex flex-col justify-center items-center gap-1 lg:gap-3 relative z-10">
                          <span className={`text-3xl lg:text-6xl font-black italic tracking-tighter ${isToday ? 'text-black' : load > 8 ? 'text-rose-400' : 'text-white'}`}>{load}</span>
                          <span className={`text-[8px] lg:text-[10px] font-bold uppercase tracking-[0.2em] ${isToday ? 'text-black/60' : 'text-zinc-600'}`}>Marcações</span>
                       </div>
                       <div className={`absolute bottom-0 left-0 w-full h-1.5 lg:h-3 ${isToday ? 'bg-black/10' : 'bg-zinc-800'}`}>
                          <div className={`h-full ${isToday ? 'bg-black' : load > 8 ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(100, load * 10)}%` }}></div>
                       </div>
                    </div>
                 );
              })}
           </div>
        </div>
     );
  };

  const renderDayView = () => {
     const dayBookings = allBookings.filter(b => b.date === dateKey && b.status !== 'cancelled');
     const hasWaitingList = waitingList.length > 0;

     return (
       <div className="flex-1 flex flex-col min-h-0 relative bg-[#151516]">
          {/* --- UNIFIED SCROLLABLE GRID (MOBILE & DESKTOP) --- */}
          <div className="flex-1 overflow-auto scrollbar-hide relative pb-20">
             <div className="flex min-w-full">
                {/* 1. Coluna Horas (Sticky Left) */}
                <div className="w-14 md:w-20 lg:w-24 flex-shrink-0 border-r border-white/5 bg-[#1a1a1c] sticky left-0 z-30 pt-[70px] lg:pt-[90px]">
                   {TIME_SLOTS.map(time => (
                      <div key={time} className="h-28 lg:h-40 flex items-center justify-center text-[10px] lg:text-xs font-black text-zinc-600 border-b border-white/5 relative group">
                         <span className="-top-3 absolute bg-[#1a1a1c] px-1 group-hover:text-white transition-colors tracking-widest">{time}</span>
                      </div>
                   ))}
                </div>

                {/* 2. Colunas Staff (Horizontal Scroll) */}
                {staff.map((pro, idx) => {
                   const theme = getStaffTheme(pro.id);
                   return (
                      <div key={pro.id} className="min-w-[160px] md:min-w-[200px] lg:min-w-[300px] flex-1 border-r border-white/5 relative bg-[#151516]">
                         {/* Staff Header Sticky Top */}
                         <div className="sticky top-0 z-20 bg-[#1a1a1c] border-b border-white/5 p-3 lg:p-6 text-center backdrop-blur-md h-[70px] lg:h-[90px] flex flex-col justify-center">
                            <h3 className={`text-xs lg:text-lg font-black uppercase tracking-wider truncate px-1 ${theme.text}`}>{pro.name}</h3>
                            <p className="text-[9px] lg:text-[11px] text-zinc-500 font-bold uppercase tracking-widest truncate px-1">{pro.role}</p>
                         </div>

                         {/* Slots */}
                         <div>
                            {TIME_SLOTS.map(time => {
                               const booking = dayBookings.find(b => b.time === time && (b.proId === pro.id || (b as any).professional?.id === pro.id));
                               const isWaitingSlot = !booking && hasWaitingList && Math.random() > 0.95;
                               const isBlocked = booking && booking.status === 'blocked';

                               return (
                                  <div key={`${pro.id}-${time}`} className="h-28 lg:h-40 border-b border-white/5 p-1 lg:p-2 relative group transition-colors hover:bg-white/[0.02]">
                                     {booking ? (
                                        isBlocked ? (
                                            // BLOCKED SLOT
                                            <button 
                                              onClick={() => setSelectedBooking(booking)}
                                              className="w-full h-full rounded-xl lg:rounded-2xl bg-zinc-900/50 border border-white/5 flex flex-col items-center justify-center gap-1 lg:gap-2 opacity-60 hover:opacity-100 transition-all"
                                              title="Horário Bloqueado"
                                            >
                                                <Ban size={20} className="text-zinc-500 lg:w-8 lg:h-8" />
                                                <span className="text-[9px] lg:text-xs font-bold text-zinc-600 uppercase tracking-widest">{booking.client}</span>
                                            </button>
                                        ) : (
                                            // BOOKING CARD
                                            <button 
                                              onClick={() => setSelectedBooking(booking)}
                                              className={`w-full h-full rounded-2xl lg:rounded-3xl border-l-4 ${theme.border} ${theme.bg} hover:brightness-125 transition-all text-left p-3 lg:p-5 flex flex-col justify-between relative overflow-hidden shadow-sm hover:shadow-xl group/card`}
                                            >
                                               <div className="w-full min-w-0">
                                                  <p className={`text-xs lg:text-lg font-black uppercase tracking-tight truncate text-white w-full leading-tight`}>{booking.client}</p>
                                                  <p className="text-[9px] lg:text-sm text-zinc-400 font-bold truncate mt-1 w-full uppercase tracking-wider">{booking.service}</p>
                                               </div>
                                               <div className="flex justify-between items-end w-full">
                                                  <span className="text-[10px] lg:text-sm font-mono text-zinc-500 group-hover/card:text-white transition-colors">{booking.priceValue}€</span>
                                                  {booking.status === 'completed' && <div className="bg-emerald-500 text-black text-[8px] lg:text-[10px] font-black px-1.5 lg:px-3 py-0.5 lg:py-1 rounded uppercase tracking-widest"><CheckCircle2 size={12} className="lg:w-4 lg:h-4"/></div>}
                                                  {booking.status === 'no-show' && <div className="bg-red-500 text-white text-[8px] lg:text-[10px] font-black px-1.5 lg:px-3 py-0.5 lg:py-1 rounded uppercase tracking-widest"><Ban size={12} className="lg:w-4 lg:h-4"/></div>}
                                               </div>
                                            </button>
                                        )
                                     ) : isWaitingSlot ? (
                                        // AI SUGGESTION
                                        <button 
                                           onClick={() => handleApplyAiSuggestion(waitingList[0], time, pro.id)}
                                           className="w-full h-full rounded-2xl lg:rounded-3xl border border-dashed border-primary/30 bg-primary/5 flex flex-col items-center justify-center gap-2 lg:gap-3 animate-pulse hover:animate-none hover:bg-primary/10 transition-all group/ai"
                                        >
                                           <Sparkles size={16} className="text-primary lg:w-6 lg:h-6" />
                                           <div className="text-center w-full px-2">
                                              <p className="text-[9px] lg:text-xs font-black text-primary uppercase tracking-widest truncate">Sugestão AI</p>
                                              <p className="text-[8px] lg:text-[10px] text-zinc-500 font-bold uppercase tracking-widest group-hover/ai:text-zinc-300 truncate">Lista de Espera</p>
                                           </div>
                                        </button>
                                     ) : (
                                        // EMPTY SLOT ACTIONS
                                        <div className="w-full h-full flex items-center justify-center gap-2 lg:gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                           <button 
                                             onClick={() => handleOpenNew(time, pro.id)}
                                             className="w-10 h-10 lg:w-14 lg:h-14 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition-all border border-white/5 active:scale-95"
                                             title="Nova Marcação"
                                           >
                                              <Plus size={18} className="lg:w-6 lg:h-6" />
                                           </button>
                                           <button 
                                             onClick={() => handleOpenBlock(time, pro.id)}
                                             className="w-8 h-8 lg:w-12 lg:h-12 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-600 hover:text-zinc-400 flex items-center justify-center transition-all border border-white/5 active:scale-95"
                                             title="Bloquear Tempo"
                                           >
                                              <Coffee size={14} className="lg:w-5 lg:h-5" />
                                           </button>
                                        </div>
                                     )}
                                  </div>
                               );
                            })}
                         </div>
                      </div>
                   );
                })}
             </div>
          </div>
       </div>
     );
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden flex-col md:flex-row">
       
       {/* --- SIDEBAR DESKTOP --- */}
       <aside className="w-80 lg:w-96 bg-[#151516] border-r border-white/5 flex-col hidden lg:flex z-40 shrink-0">
          <div className="p-8 lg:p-10">
             <button onClick={() => navigate('/owner/dashboard')} className="mb-8 lg:mb-12 text-muted hover:text-white flex items-center gap-2 text-[10px] lg:text-xs font-black uppercase tracking-widest transition-all">
                <ArrowLeft size={16} /> Dashboard
             </button>
             <h1 className="text-3xl lg:text-5xl font-black text-white italic uppercase tracking-tighter leading-none mb-3">Agenda</h1>
             <p className="text-xs lg:text-sm font-bold text-zinc-500 uppercase tracking-widest">Torre de Controlo</p>
          </div>

          <div className="px-6 lg:px-8 mb-6 lg:mb-8">
             <div className="bg-surface rounded-[2rem] p-6 border border-white/5">
                <div className="flex justify-between items-center mb-6">
                   <button onClick={() => handleDateChange(-30)} className="p-2 hover:text-white text-zinc-500 hover:bg-white/5 rounded-lg transition-colors"><ChevronLeft size={20}/></button>
                   <span className="text-sm lg:text-base font-black text-white uppercase tracking-widest">
                      {MONTHS[selectedDate.getMonth()]} {selectedDate.getFullYear()}
                   </span>
                   <button onClick={() => handleDateChange(30)} className="p-2 hover:text-white text-zinc-500 hover:bg-white/5 rounded-lg transition-colors"><ChevronRight size={20}/></button>
                </div>
                {/* Mini Calendar */}
                <div className="grid grid-cols-7 gap-2 text-center">
                   {['D','S','T','Q','Q','S','S'].map(d => <span key={d} className="text-[9px] font-black text-zinc-600 uppercase">{d}</span>)}
                   {Array.from({length: 30}).map((_, i) => (
                      <button 
                        key={i} 
                        onClick={() => { 
                           const d = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), i+1);
                           setSelectedDate(d); 
                           setViewMode('day'); 
                        }}
                        className={`text-[11px] font-bold p-2 rounded-xl transition-all ${i+1 === selectedDate.getDate() ? 'bg-primary text-black font-black scale-110 shadow-lg' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
                      >
                         {i+1}
                      </button>
                   ))}
                </div>
             </div>
          </div>

          <div className="px-6 lg:px-8 space-y-3">
             <button onClick={() => setViewMode('day')} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl border transition-all ${viewMode === 'day' ? 'bg-white/10 border-white/10 text-white' : 'border-transparent text-zinc-500 hover:text-white hover:bg-white/5'}`}>
                <LayoutGrid size={20} /> <span className="text-sm font-bold uppercase tracking-wide">Dia</span>
             </button>
             <button onClick={() => setViewMode('week')} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl border transition-all ${viewMode === 'week' ? 'bg-white/10 border-white/10 text-white' : 'border-transparent text-zinc-500 hover:text-white hover:bg-white/5'}`}>
                <List size={20} /> <span className="text-sm font-bold uppercase tracking-wide">Semana</span>
             </button>
             <button onClick={() => setViewMode('month')} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl border transition-all ${viewMode === 'month' ? 'bg-white/10 border-white/10 text-white' : 'border-transparent text-zinc-500 hover:text-white hover:bg-white/5'}`}>
                <CalendarIcon size={20} /> <span className="text-sm font-bold uppercase tracking-wide">Mês</span>
             </button>
          </div>
       </aside>

       {/* --- MAIN AREA --- */}
       <main className="flex-1 flex flex-col min-w-0 bg-[#121212] relative">
          
          {/* Header Responsivo */}
          <header className="h-auto md:h-24 lg:h-32 border-b border-white/5 flex flex-col md:flex-row items-center justify-between px-6 lg:px-10 py-4 md:py-0 bg-[#1a1a1c] shrink-0 gap-4">
             <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
                <button onClick={() => navigate('/owner/dashboard')} className="md:hidden text-zinc-400"><ArrowLeft size={20} /></button>
                
                {/* Data Navigation */}
                <div className="flex items-center gap-4 lg:gap-6">
                   <button onClick={() => handleDateChange(-1)} className="w-10 h-10 lg:w-14 lg:h-14 rounded-2xl bg-surface border border-white/5 flex items-center justify-center hover:bg-white/5 text-zinc-400 hover:text-white transition-colors active:scale-95"><ChevronLeft size={20} className="lg:w-6 lg:h-6"/></button>
                   <div className="text-center w-36 md:w-48 lg:w-64">
                      <h2 className="text-base md:text-2xl lg:text-4xl font-black text-white uppercase italic tracking-tighter leading-none mb-1">
                         {selectedDate.toLocaleDateString('pt-PT', { weekday: 'long' })}
                      </h2>
                      <p className="text-[10px] lg:text-xs text-zinc-500 font-bold uppercase tracking-[0.3em]">{selectedDate.toLocaleDateString('pt-PT', { day: 'numeric', month: 'long' })}</p>
                   </div>
                   <button onClick={() => handleDateChange(1)} className="w-10 h-10 lg:w-14 lg:h-14 rounded-2xl bg-surface border border-white/5 flex items-center justify-center hover:bg-white/5 text-zinc-400 hover:text-white transition-colors active:scale-95"><ChevronRight size={20} className="lg:w-6 lg:h-6"/></button>
                </div>

                <button 
                  onClick={handleToday} 
                  className={`hidden md:block text-[10px] lg:text-xs font-black uppercase tracking-widest px-4 lg:px-6 py-2 lg:py-3 rounded-xl border transition-all ${selectedDate.getDate() === new Date().getDate() ? 'bg-primary text-black border-primary shadow-lg' : 'text-zinc-500 border-transparent hover:text-white bg-surface hover:bg-white/5'}`}
                >
                  Hoje
                </button>
             </div>

             {/* View Toggles Mobile */}
             <div className="flex md:hidden bg-surface p-1 rounded-xl w-full border border-white/5">
                {['day', 'week', 'month'].map(v => (
                   <button 
                     key={v} 
                     onClick={() => setViewMode(v as any)}
                     className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === v ? 'bg-zinc-800 text-white shadow-md' : 'text-zinc-500'}`}
                   >
                      {v === 'day' ? 'Dia' : v === 'week' ? 'Sem' : 'Mês'}
                   </button>
                ))}
             </div>

             <div className="hidden md:block">
                <Button onClick={() => handleOpenNew('09:00', staff[0]?.id)} className="px-8 lg:px-10 lg:py-5 text-[10px] lg:text-xs shadow-xl">
                   <Plus size={16} className="mr-2" strokeWidth={3} /> Nova Marcação
                </Button>
             </div>
          </header>

          {/* View Router */}
          {viewMode === 'month' ? renderMonthView() : viewMode === 'week' ? renderWeekView() : renderDayView()}

       </main>

       {/* --- MODAL DETALHES (SLIDE UP) --- */}
       {selectedBooking && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4">
             <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedBooking(null)}></div>
             <div className="bg-[#1E1E1E] w-full max-w-lg rounded-t-[2.5rem] sm:rounded-[2.5rem] border border-white/10 shadow-2xl relative z-10 animate-in slide-in-from-bottom duration-300 max-h-[90vh] overflow-y-auto pb-10">
                <div className="p-8">
                   <div className="flex justify-between items-start mb-8">
                      <div className="flex items-center gap-4 min-w-0">
                         <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black italic bg-surface border border-white/10 text-white shrink-0`}>
                            {selectedBooking.client.charAt(0)}
                         </div>
                         <div className="min-w-0">
                            <h3 className="text-2xl font-black text-white uppercase italic tracking-tight leading-none mb-1 truncate">{selectedBooking.client}</h3>
                            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                               <Phone size={12} /> {selectedBooking.phone || 'N/A'}
                            </p>
                         </div>
                      </div>
                      <button onClick={() => setSelectedBooking(null)} className="p-2 bg-surface rounded-full text-zinc-500 hover:text-white shrink-0"><X size={20}/></button>
                   </div>

                   <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="bg-surface p-4 rounded-2xl border border-white/5">
                         <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Serviço</p>
                         <p className="text-sm font-black text-white truncate">{selectedBooking.service}</p>
                      </div>
                      <div className="bg-surface p-4 rounded-2xl border border-white/5">
                         <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Hora</p>
                         <p className="text-sm font-black text-white">{selectedBooking.time}</p>
                      </div>
                   </div>

                   {selectedBooking.status === 'blocked' ? (
                        <div className="space-y-3">
                            <div className="bg-zinc-800/50 p-4 rounded-2xl border border-white/5 mb-4 text-center">
                                <p className="text-xs text-zinc-400">Este horário foi bloqueado manualmente.</p>
                            </div>
                            <button 
                                onClick={() => handleUpdateStatus('cancelled')}
                                className="w-full py-4 bg-surface text-white border border-white/10 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-white/10 transition-all"
                            >
                                Libertar Horário
                            </button>
                        </div>
                   ) : (
                       <div className="space-y-3">
                          <button 
                            onClick={handleOpenUpsell}
                            className="w-full py-4 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-purple-500/20 transition-all flex items-center justify-center gap-3 mb-2"
                          >
                             <ShoppingBag size={16} /> Adicionar Produto / Extra
                          </button>

                          <button 
                            onClick={() => handleUpdateStatus('completed')}
                            className="w-full py-4 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-emerald-500 hover:text-white transition-all flex items-center justify-center gap-3"
                          >
                             <CheckCircle2 size={18} /> Marcar como Realizado
                          </button>
                          
                          <div className="grid grid-cols-2 gap-3">
                             <button 
                               onClick={() => handleUpdateStatus('no-show')}
                               className="py-4 bg-red-500/10 text-red-400 border border-red-500/20 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"
                             >
                                <Ban size={16} /> No-Show
                             </button>
                             <button 
                               onClick={() => handleUpdateStatus('cancelled')}
                               className="py-4 bg-surface text-zinc-400 border border-white/10 rounded-2xl font-black uppercase text-xs tracking-widest hover:text-white transition-all flex items-center justify-center gap-2"
                             >
                                <X size={16} /> Cancelar
                             </button>
                          </div>
                       </div>
                   )}
                </div>
             </div>
          </div>
       )}

       {/* --- MODAL NOVA MARCAÇÃO --- */}
       {isNewBookingOpen && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4">
             <div className="absolute inset-0 bg-black/90 backdrop-blur-sm animate-fade-in" onClick={() => setIsNewBookingOpen(false)}></div>
             <div className="bg-background w-full max-w-lg rounded-t-[2.5rem] sm:rounded-[2.5rem] border border-white/10 shadow-2xl relative z-10 animate-in slide-in-from-bottom duration-300 p-8 pb-32 md:pb-8 max-h-[90vh] overflow-y-auto">
                <h3 className="text-xl font-black text-white italic uppercase mb-6">Nova Reserva</h3>
                <form onSubmit={handleSaveBooking} className="space-y-5">
                   <Input 
                      label="Cliente" 
                      value={newBookingData.client} 
                      onChange={e => setNewBookingData({...newBookingData, client: e.target.value})} 
                      required 
                      placeholder="Nome do cliente"
                   />
                   
                   {newBookingData.isAiSuggestion && (
                      <div className="p-3 bg-primary/10 border border-primary/20 rounded-xl flex items-center gap-3 text-xs text-primary font-bold">
                         <Sparkles size={14} /> Sugestão da Lista de Espera aplicada
                      </div>
                   )}

                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Serviço</label>
                      <select 
                        className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3.5 text-sm font-bold text-white outline-none focus:border-primary/50"
                        value={newBookingData.service}
                        onChange={e => setNewBookingData({...newBookingData, service: e.target.value})}
                      >
                         {services.map((s: any) => (
                            <option key={s.id} value={s.name}>{s.name} - {s.price}€</option>
                         ))}
                      </select>
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                      <Input label="Hora" value={newBookingData.time} readOnly className="opacity-50 cursor-not-allowed text-center font-mono" />
                      <div className="space-y-2">
                         <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Profissional</label>
                         <div className="relative">
                            <select
                               className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3.5 text-sm font-bold text-white outline-none focus:border-primary/50 appearance-none"
                               value={newBookingData.proId}
                               onChange={e => setNewBookingData({...newBookingData, proId: e.target.value})}
                            >
                               {staff.map(s => (
                                  <option key={s.id} value={s.id}>{s.name}</option>
                               ))}
                            </select>
                         </div>
                      </div>
                   </div>
                   
                   <Button fullWidth type="submit" className="py-5 shadow-xl mt-4">Confirmar Agendamento</Button>
                </form>
             </div>
          </div>
       )}

       {/* --- MODAL PAUSA RÁPIDA (BLOCK) --- */}
       {isBlockModalOpen && (
          <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center sm:p-4">
             <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setIsBlockModalOpen(false)}></div>
             <div className="bg-surface w-full max-w-sm rounded-t-[2rem] sm:rounded-[2rem] border border-white/10 shadow-2xl relative z-20 p-8 pb-32 md:pb-8 animate-in slide-in-from-bottom duration-300">
                <div className="flex items-center gap-3 mb-6">
                   <div className="p-3 bg-zinc-800 rounded-xl text-zinc-400"><Coffee size={20} /></div>
                   <h3 className="text-lg font-black text-white uppercase italic tracking-tight">Pausa Rápida</h3>
                </div>
                
                <div className="space-y-6">
                   <div>
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3 block">Motivo</label>
                      <div className="flex flex-wrap gap-2">
                         {['Pausa Café', 'Almoço', 'Reunião', 'Admin', 'Outro'].map(r => (
                            <button
                               key={r}
                               onClick={() => setBlockData({...blockData, reason: r})}
                               className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${blockData.reason === r ? 'bg-white text-black border-white' : 'bg-transparent border-white/10 text-zinc-500 hover:text-white'}`}
                            >
                               {r}
                            </button>
                         ))}
                      </div>
                   </div>

                   <div>
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3 block">Duração</label>
                      <div className="flex gap-2">
                         {[15, 30, 60, 90].map(d => (
                            <button
                               key={d}
                               onClick={() => setBlockData({...blockData, duration: d})}
                               className={`flex-1 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest border transition-all ${blockData.duration === d ? 'bg-primary text-black border-primary' : 'bg-transparent border-white/10 text-zinc-500 hover:text-white'}`}
                            >
                               {d}m
                            </button>
                         ))}
                      </div>
                   </div>

                   <Button fullWidth onClick={handleSaveBlock}>Bloquear Horário</Button>
                </div>
             </div>
          </div>
       )}

       {/* --- MODAL UPSELL --- */}
       {isUpsellModalOpen && (
          <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center sm:p-4">
             <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setIsUpsellModalOpen(false)}></div>
             <div className="bg-surface w-full max-w-sm rounded-t-[2rem] sm:rounded-[2rem] border border-white/10 shadow-2xl relative z-20 p-8 pb-32 md:pb-8 animate-in slide-in-from-bottom duration-300">
                <div className="flex items-center gap-3 mb-6">
                   <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400"><ShoppingBag size={20} /></div>
                   <h3 className="text-lg font-black text-white uppercase italic tracking-tight">Adicionar Extra</h3>
                </div>
                
                <form onSubmit={handleSaveUpsell} className="space-y-5">
                   <Input 
                      label="Descrição / Produto" 
                      placeholder="Ex: Ampola Hidratação"
                      value={upsellData.name}
                      onChange={e => setUpsellData({...upsellData, name: e.target.value})}
                      required
                   />
                   <Input 
                      label="Valor a Adicionar (€)" 
                      type="number"
                      placeholder="0.00"
                      value={upsellData.price}
                      onChange={e => setUpsellData({...upsellData, price: e.target.value})}
                      required
                      icon={<Euro size={16}/>}
                   />
                   <Button fullWidth type="submit">Atualizar Conta</Button>
                </form>
             </div>
          </div>
       )}

    </div>
  );
};
