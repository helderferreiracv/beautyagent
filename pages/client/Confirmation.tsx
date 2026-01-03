
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Clock, Sparkles, User, ArrowRight, Layers, Check } from 'lucide-react';
import { Button } from '../../components/Button';
import { Booking, Service } from '../../types';

const ConfettiEffect = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
    {Array.from({ length: 20 }).map((_, i) => (
      <div 
        key={i} 
        className="confetti-piece animate-confetti"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          backgroundColor: i % 2 === 0 ? '#ebff57' : '#F472B6',
          animationDelay: `${Math.random() * 0.5}s`,
          transform: `rotate(${Math.random() * 360}deg)`
        }}
      />
    ))}
  </div>
);

export const ClientConfirmation: React.FC = () => {
  const navigate = useNavigate();
  const [booking, setBooking] = useState<any>(null);
  const [isReschedule, setIsReschedule] = useState(false);
  const [showCelebration, setShowCelebration] = useState(true);

  useEffect(() => {
    const draftStr = localStorage.getItem('beauty_booking_draft');
    if (!draftStr) {
        navigate('/client/service');
        return;
    }

    const draft = JSON.parse(draftStr);
    const userStr = localStorage.getItem('beauty_user');
    const user = userStr ? JSON.parse(userStr) : { name: 'Cliente', phone: '' };
    
    const referralContextStr = localStorage.getItem('beauty_referral_context');
    const referralContext = referralContextStr ? JSON.parse(referralContextStr) : null;

    const existingBookingsStr = localStorage.getItem('beauty_bookings');
    let existingBookings = existingBookingsStr ? JSON.parse(existingBookingsStr) : [];

    let updatedBooking;
    const rawServices = draft.services || (draft.service ? [draft.service] : []);
    const servicesList: Service[] = rawServices.filter((s: any) => s && s.id);

    if (servicesList.length === 0) {
        navigate('/client/service');
        return;
    }
    
    const firstService = servicesList[0];
    const compositeService = {
        id: servicesList.map(s => s.id).join('+'),
        name: servicesList.length > 1 ? `${firstService.name} + ${servicesList.length - 1}` : firstService.name,
        price: `${draft.totalPrice || firstService.price}€`,
        duration: `${draft.totalDuration || firstService.duration}`
    };

    if (draft.reschedulingId) {
      setIsReschedule(true);
      existingBookings = existingBookings.map((b: any) => {
        if (b.id === draft.reschedulingId) {
          updatedBooking = {
            ...b,
            date: draft.date,
            time: draft.time,
            status: 'confirmed',
            updatedAt: new Date().toISOString()
          };
          return updatedBooking;
        }
        return b;
      });
      localStorage.setItem('beauty_bookings', JSON.stringify(existingBookings));
    } else {
      updatedBooking = {
        id: Math.random().toString(36).substr(2, 9),
        date: draft.date,
        time: draft.time,
        service: compositeService,
        services: servicesList,
        professional: draft.professional,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
        userName: user.name,
        userPhone: user.phone,
        referralId: referralContext?.staffId
      };
      localStorage.setItem('beauty_bookings', JSON.stringify([updatedBooking, ...existingBookings]));
    }

    localStorage.removeItem('beauty_cart_abandoned');
    const existingLogs = JSON.parse(localStorage.getItem('beauty_logs_db') || '[]');
    const newLog = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'client',
      message: draft.reschedulingId ? `Reagendamento: ${user.name}` : `Nova Marcação: ${user.name}`,
      details: `${servicesList.length} serviços marcados para ${updatedBooking.date} às ${updatedBooking.time}.`,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('beauty_logs_db', JSON.stringify([newLog, ...existingLogs]));

    setBooking(updatedBooking);
    localStorage.removeItem('beauty_booking_draft');
    localStorage.removeItem('beauty_referral_context');

    setTimeout(() => setShowCelebration(false), 3000);
  }, [navigate]);

  if (!booking) return null;

  const servicesRender = booking.services || (booking.service ? [booking.service] : []);
  const mainServiceRender = servicesRender[0] || { name: 'Serviço', duration: '0', price: '0€' };

  return (
    <div className="max-w-md mx-auto py-12 text-center animate-fade-in px-4 relative">
      {showCelebration && <ConfettiEffect />}
      
      <div className="inline-flex items-center justify-center w-28 h-28 rounded-full bg-emerald-500/10 text-emerald-400 mb-8 relative border border-emerald-500/20 animate-check-pop shadow-[0_0_40px_rgba(16,185,129,0.2)]">
        <Check size={56} strokeWidth={4} />
        <div className="absolute -top-2 -right-2 bg-surface p-2 rounded-full shadow-xl border border-primary/20">
            <Sparkles className="text-primary" size={24} />
        </div>
      </div>

      <h1 className="text-4xl font-black text-white mb-4 tracking-tighter italic uppercase leading-none">
        {isReschedule ? 'Horário Atualizado!' : 'Confirmado! ✨'}
      </h1>
      <p className="text-zinc-400 text-base mb-10 px-4 leading-relaxed font-medium">
        Tudo pronto para a tua visita.<br/>
        Os detalhes foram enviados para <b>{booking.userPhone}</b>.
      </p>

      <div className="bg-surface rounded-[2.5rem] p-8 border border-white/5 text-left mb-10 relative overflow-hidden shadow-2xl group transition-all hover:border-primary/20">
        <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-[80px] group-hover:bg-primary/10 transition-all pointer-events-none"></div>
        
        <div className="space-y-6 relative z-10">
          <div className="flex items-center gap-5 border-b border-white/5 pb-6">
             <div className="w-16 h-16 rounded-2xl bg-background flex flex-col items-center justify-center text-primary font-black text-xl border border-white/5">
                <span className="text-2xl leading-none">{new Date(booking.date).getDate()}</span>
                <span className="text-[11px] uppercase tracking-widest text-zinc-500 font-black">
                   {new Date(booking.date).toLocaleString('pt-PT', { month: 'short' }).replace('.','').toUpperCase()}
                </span>
             </div>
             <div>
                <p className="text-white font-black text-lg uppercase italic tracking-tight leading-none mb-1.5">
                   {servicesRender.length > 1 ? 'Sessão Completa' : mainServiceRender.name}
                </p>
                <div className="flex gap-3 text-[11px] font-black uppercase tracking-widest text-zinc-500">
                   <span>{booking.service?.duration || mainServiceRender.duration} min</span>
                   <span>•</span>
                   <span className="text-primary">{booking.service?.price || mainServiceRender.price}</span>
                </div>
             </div>
          </div>

          <div className="pt-2 border-t border-white/5 grid grid-cols-2 gap-4">
            <div>
               <p className="text-[11px] text-zinc-600 font-black uppercase tracking-widest mb-1.5">Horário</p>
               <p className="text-white font-black text-base flex items-center gap-2">
                 <Clock size={16} className="text-primary" /> {booking.time}
               </p>
            </div>
            <div>
               <p className="text-[11px] text-zinc-600 font-black uppercase tracking-widest mb-1.5">Staff</p>
               <p className="text-white font-black text-base flex items-center gap-2 truncate">
                 <User size={16} className="text-primary" /> 
                 {booking.professional === 'agent' ? 'AI' : (booking.professional?.name?.split(' ')[0] || 'Staff')}
               </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Button fullWidth onClick={() => navigate('/client/my-bookings')} className="py-5 text-sm shadow-xl font-black">
          Ver Minhas Marcações <ArrowRight size={18} />
        </Button>
        <button onClick={() => navigate('/')} className="text-zinc-500 hover:text-white text-[11px] font-black uppercase tracking-[0.3em] transition-all py-2">
          Voltar ao Início
        </button>
      </div>
    </div>
  );
};
