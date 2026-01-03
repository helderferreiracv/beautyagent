
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, Lock } from 'lucide-react';
import { BookingProgressBar } from '../../components/BookingProgressBar';

type DayStatus = 'available' | 'low' | 'full' | 'closed';

const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();
const DAY_MAP = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'];

export const ClientCalendar: React.FC = () => {
  const navigate = useNavigate();
  const [today] = useState(new Date());
  const [displayDate, setDisplayDate] = useState(new Date());
  
  const year = displayDate.getFullYear();
  const month = displayDate.getMonth();
  
  const [bookingsByDay, setBookingsByDay] = useState<Record<string, number>>({});
  const [openDays, setOpenDays] = useState<string[]>([]);
  const [totalDuration, setTotalDuration] = useState(0);

  useEffect(() => {
    const settings = JSON.parse(localStorage.getItem('beauty_settings') || '{}');
    setOpenDays(settings.openDays || ['seg', 'ter', 'qua', 'qui', 'sex', 'sab']);

    const draft = JSON.parse(localStorage.getItem('beauty_booking_draft') || '{}');
    if (!draft.services) {
       navigate('/client/service');
       return;
    }
    setTotalDuration(draft.totalDuration || 60);

    const ownerBookings = JSON.parse(localStorage.getItem('owner_bookings_db') || '[]');
    const clientBookings = JSON.parse(localStorage.getItem('beauty_bookings') || '[]');
    const all = [...ownerBookings, ...clientBookings];
    
    const counts: Record<string, number> = {};
    all.forEach((b: any) => {
      if (b.status !== 'cancelled') {
        counts[b.date] = (counts[b.date] || 0) + 1;
      }
    });
    setBookingsByDay(counts);
  }, [navigate]);

  const handlePrevMonth = () => {
    if (month === today.getMonth() && year === today.getFullYear()) return;
    setDisplayDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => setDisplayDate(new Date(year, month + 1, 1));

  const isPast = (day: number) => {
    const checkDate = new Date(year, month, day);
    const todayZero = new Date();
    todayZero.setHours(0, 0, 0, 0);
    return checkDate < todayZero;
  };

  const getDayStatus = (day: number): DayStatus => {
    const dateObj = new Date(year, month, day);
    const dayOfWeekIndex = dateObj.getDay(); 
    const dayId = DAY_MAP[dayOfWeekIndex];
    
    if (!openDays.includes(dayId)) return 'closed';

    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const count = bookingsByDay[dateStr] || 0;

    if (dayOfWeekIndex === 2) return 'full'; // Demo logic: Terças cheias
    if (dayOfWeekIndex === 4 && totalDuration > 90) return 'full'; // Demo logic
    
    if (count >= 12) return 'full'; 
    if (count >= 6) return 'low';
    return 'available';
  };

  const handleDayClick = (day: number, status: DayStatus) => {
    if (isPast(day) || status === 'closed') return;
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    if (status === 'full') navigate(`/client/waiting?date=${dateStr}`);
    else navigate(`/client/time?date=${dateStr}`);
  };

  const daysInMonth = getDaysInMonth(year, month);
  const startDay = getFirstDayOfMonth(year, month);
  const monthNames = ["JANEIRO", "FEVEREIRO", "MARÇO", "ABRIL", "MAIO", "JUNHO", "JULHO", "AGOSTO", "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO"];
  const isCurrentMonth = month === today.getMonth() && year === today.getFullYear();

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 animate-fade-in pb-32">
      <button onClick={() => navigate('/client/service')} className="mb-8 text-muted hover:text-white flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all group">
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> VOLTAR
      </button>

      <div className="mb-8 md:mb-12">
        <h1 className="text-5xl md:text-6xl font-black text-white italic uppercase tracking-tighter leading-none mb-4">DATA</h1>
        <p className="text-zinc-400 text-sm font-medium">Escolhe o dia ideal para a tua visita.</p>
      </div>

      <BookingProgressBar currentStep={2} />

      {/* Calendar Widget Container - Dark Glass Style */}
      <div className="mt-8 bg-[#1E1E1E] rounded-[2.5rem] p-6 md:p-8 border border-white/5 relative overflow-hidden shadow-2xl">
        
        {/* Header Navegação */}
        <div className="flex items-center justify-between mb-8 px-2">
          <button 
            onClick={handlePrevMonth}
            disabled={isCurrentMonth}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${isCurrentMonth ? 'border-transparent text-zinc-800 cursor-not-allowed' : 'border-white/5 bg-black/20 text-white hover:bg-white/10'}`}
          >
            <ChevronLeft size={20}/>
          </button>
          
          <div className="text-center">
             <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">
               {monthNames[month]}
             </h2>
             <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-[0.2em]">{year}</p>
          </div>
          
          <button onClick={handleNextMonth} className="w-12 h-12 rounded-2xl flex items-center justify-center border border-white/5 bg-black/20 text-white hover:bg-white/10 transition-all">
            <ChevronRight size={20}/>
          </button>
        </div>

        {/* Days Header */}
        <div className="grid grid-cols-7 mb-4 text-center">
          {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => (
            <div key={i} className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{d}</div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 md:gap-3">
          {Array.from({ length: startDay }).map((_, i) => <div key={`e-${i}`} />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const status = getDayStatus(day);
            const isToday = day === today.getDate() && isCurrentMonth;
            const past = isPast(day);
            const isClosed = status === 'closed';

            // Lógica de Contraste Melhorada (SOLID LIME)
            let cellClass = "border border-transparent bg-transparent";
            let textClass = "";
            
            if (past) {
               textClass = "text-zinc-700 opacity-40 cursor-not-allowed";
            } else if (isClosed) {
               textClass = "text-zinc-700 cursor-not-allowed"; 
            } else if (status === 'full') {
               cellClass = "bg-white/[0.02] border-white/[0.02]";
               textClass = "text-zinc-500"; 
            } else if (status === 'low') {
               cellClass = "bg-white/[0.03] border-white/5 hover:border-white/20 hover:bg-white/10";
               textClass = "text-zinc-300 hover:text-white"; 
            } else if (isToday) {
               // SOLID LIME FOR TODAY
               cellClass = "bg-primary text-black border-primary shadow-[0_0_20px_rgba(235,255,87,0.3)] z-10 scale-105";
               textClass = "font-black";
            } else {
               cellClass = "bg-[#252525] border-white/5 hover:border-white/20 hover:bg-[#2a2a2a]";
               textClass = "text-zinc-200 hover:text-white"; 
            }

            return (
              <button
                key={day}
                disabled={past || isClosed}
                onClick={() => handleDayClick(day, status)}
                className={`
                  aspect-square rounded-xl md:rounded-2xl flex flex-col items-center justify-center text-sm font-bold transition-all duration-200 relative group
                  ${cellClass} ${textClass}
                  ${!past && !isClosed ? 'active:scale-95' : ''}
                `}
              >
                <span className={status === 'full' ? 'opacity-50' : ''}>{day}</span>
                {status === 'full' && !past && (
                   <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-zinc-600 rounded-full"></div>
                )}
                {isToday && <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-black rounded-full animate-pulse"></div>}
                {isClosed && !past && <Lock size={10} className="absolute opacity-30 top-2 right-2" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-10 flex justify-center gap-8 opacity-60">
         <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-zinc-500"></div>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Livre</span>
         </div>
         <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Hoje</span>
         </div>
         <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-zinc-800 border border-zinc-700"></div>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Esgotado</span>
         </div>
      </div>
    </div>
  );
};
