
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Clock, ArrowRight, Layers, Zap, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '../../components/Button';
import { BookingProgressBar } from '../../components/BookingProgressBar';

const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", 
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00"
];

export const ClientTimeSelection: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dateStr = searchParams.get('date'); 
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [totalDuration, setTotalDuration] = useState(60);
  const [serviceCount, setServiceCount] = useState(1);
  const [occupiedSlots, setOccupiedSlots] = useState<string[]>([]);

  useEffect(() => {
    if (!dateStr) { navigate('/client/calendar'); return; }

    const draft = JSON.parse(localStorage.getItem('beauty_booking_draft') || '{}');
    if (draft.totalDuration) setTotalDuration(draft.totalDuration);
    if (draft.services) setServiceCount(draft.services.length);

    // Carregar ocupação real do dia
    const ownerBookings = JSON.parse(localStorage.getItem('owner_bookings_db') || '[]');
    const clientBookings = JSON.parse(localStorage.getItem('beauty_bookings') || '[]');
    
    const dayBookings = [...ownerBookings, ...clientBookings].filter((b: any) => 
        b.date === dateStr && b.status !== 'cancelled'
    );

    let busyTimes = dayBookings.map((b: any) => b.time);

    // Demo Logic: Quinta-feira complexa
    const d = new Date(dateStr + 'T12:00:00');
    if (d.getDay() === 4) { 
        busyTimes = [...busyTimes, "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "16:30", "17:00", "17:30", "18:00"];
    }
    
    setOccupiedSlots(busyTimes);
  }, [dateStr, navigate]);

  const isTimeInPast = (timeSlot: string) => {
    if (!dateStr) return false;
    const now = new Date();
    const [slotHour, slotMinute] = timeSlot.split(':').map(Number);
    
    const today = new Date();
    today.setHours(0,0,0,0);
    
    const checkDate = new Date(dateStr);
    checkDate.setHours(0,0,0,0);
    
    if (checkDate < today) return true;
    if (checkDate.getTime() === today.getTime()) {
        const currentTotalMinutes = now.getHours() * 60 + now.getMinutes() + 30; // 30min margem
        const slotTotalMinutes = slotHour * 60 + slotMinute;
        return slotTotalMinutes <= currentTotalMinutes;
    }
    return false;
  };

  const hasEnoughTime = (startTime: string) => {
    const slotsNeeded = Math.ceil(totalDuration / 30);
    const startIndex = TIME_SLOTS.indexOf(startTime);
    
    if (startIndex === -1) return false;
    if (startIndex + slotsNeeded > TIME_SLOTS.length) return false;

    for (let i = 0; i < slotsNeeded; i++) {
        const slotToCheck = TIME_SLOTS[startIndex + i];
        if (occupiedSlots.includes(slotToCheck)) return false;
    }
    return true;
  };

  const handleTimeSelect = (time: string) => {
    if (occupiedSlots.includes(time) || isTimeInPast(time) || !hasEnoughTime(time)) return;
    setSelectedTime(time);
  };

  const handleContinue = () => {
    if (!selectedTime || !dateStr) return;
    const draft = JSON.parse(localStorage.getItem('beauty_booking_draft') || '{}');
    localStorage.setItem('beauty_booking_draft', JSON.stringify({
      ...draft,
      date: dateStr,
      time: selectedTime
    }));
    
    if (draft.reschedulingId) {
      navigate('/client/confirm');
    } else {
      navigate('/client/professional');
    }
  };

  // Dinamicamente verificar se o dia está cheio
  const isFullDay = useMemo(() => {
      return !TIME_SLOTS.some(t => !occupiedSlots.includes(t) && !isTimeInPast(t) && hasEnoughTime(t));
  }, [occupiedSlots, totalDuration, dateStr]);

  if (isFullDay) {
    return (
      <div className="max-w-md mx-auto py-20 text-center pb-32 px-6 animate-fade-in">
        <BookingProgressBar currentStep={2} />
        <div className="w-20 h-20 bg-background rounded-full border border-white/5 flex items-center justify-center mx-auto mb-6">
           <Clock size={32} className="text-zinc-600" />
        </div>
        <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-4">Dia Esgotado</h2>
        <p className="text-zinc-400 text-sm mb-12 px-4 leading-relaxed font-medium">
           Não encontrámos um bloco de <b>{totalDuration} min</b> para hoje.
        </p>
        <div className="flex flex-col gap-4">
           <Button onClick={() => navigate(`/client/waiting?date=${dateStr}`)} className="py-5 text-xs font-black uppercase tracking-widest">
             <Zap size={16} className="mr-2" /> Entrar na lista de espera
           </Button>
           <button onClick={() => navigate('/client/calendar')} className="text-xs font-bold text-zinc-500 uppercase tracking-widest hover:text-white transition-colors py-3">
             Escolher outro dia
           </button>
        </div>
      </div>
    );
  }

  const formattedDate = dateStr 
    ? new Date(dateStr).toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long' }) 
    : '';

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 animate-fade-in pb-40 md:pb-12">
      <button onClick={() => navigate('/client/calendar')} className="mb-8 text-muted hover:text-white flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all group">
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Voltar
      </button>

      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12">
         <div className="max-w-lg">
            <h1 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter leading-none mb-4">Horário</h1>
            <div className="flex flex-wrap items-center gap-4">
               <div className="bg-primary/10 text-primary px-4 py-1.5 rounded-lg border border-primary/20 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                  <CalendarIcon size={12} /> {formattedDate}
               </div>
               <div className="bg-surface text-zinc-400 px-4 py-1.5 rounded-lg border border-white/5 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                  <Clock size={12} /> {totalDuration} min
               </div>
            </div>
         </div>
         
         <div className="hidden md:block">
            {/* Desktop Action Button Placement */}
            <Button 
               onClick={handleContinue}
               disabled={!selectedTime}
               className={`px-10 py-4 shadow-2xl text-xs transition-all ${!selectedTime ? 'opacity-30 grayscale cursor-not-allowed' : 'active:scale-95 animate-in fade-in'}`}
            >
               Continuar <ArrowRight size={16} className="ml-2" />
            </Button>
         </div>
      </div>

      <BookingProgressBar currentStep={2} />

      {/* Grid Responsiva: 2 colunas mobile, 4 colunas desktop */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-12 mt-8">
        {TIME_SLOTS.map((time) => {
          const isOccupied = occupiedSlots.includes(time);
          const isPast = isTimeInPast(time);
          const fitsDuration = hasEnoughTime(time);
          const isDisabled = isOccupied || isPast || !fitsDuration;
          const isSelected = selectedTime === time;
          
          return (
            <button
              key={time}
              disabled={isDisabled}
              onClick={() => handleTimeSelect(time)}
              className={`
                py-5 md:py-6 rounded-2xl text-base md:text-lg font-black transition-all duration-300 relative overflow-hidden uppercase tracking-widest
                ${isDisabled 
                  ? 'bg-zinc-900/30 text-zinc-700 border border-transparent cursor-not-allowed' 
                  : isSelected
                    ? 'bg-primary text-black border-primary shadow-[0_0_30px_rgba(235,255,87,0.3)] scale-105 z-10 italic'
                    : 'bg-surface text-zinc-300 hover:text-white border border-white/5 hover:border-white/20 hover:bg-surface/80'
                }
              `}
            >
              {time}
            </button>
          );
        })}
      </div>

      {/* Mobile Sticky Footer */}
      <div className="md:hidden fixed bottom-0 left-0 w-full p-6 bg-background/80 backdrop-blur-xl border-t border-white/10 z-50 transition-all duration-500">
        <div className="max-w-md mx-auto">
           <Button 
             fullWidth 
             onClick={handleContinue}
             disabled={!selectedTime}
             className={`py-5 shadow-2xl text-xs transition-all ${!selectedTime ? 'opacity-50 grayscale cursor-not-allowed' : 'animate-in zoom-in-95'}`}
           >
             Continuar <ArrowRight size={16} className="ml-2" />
           </Button>
        </div>
      </div>
    </div>
  );
};
