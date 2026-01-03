
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Calendar, 
  Clock, 
  ArrowLeft, 
  XCircle, 
  RefreshCw, 
  Star, 
  Trophy, 
  Plus, 
  LogOut, 
  Layers
} from 'lucide-react';
import { Button } from '../../components/Button';
import { useToast } from '../../components/Toast';

interface BookingCardProps {
  booking: any;
  onCancel: (id: string) => void;
  onReschedule: (booking: any) => void;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking, onCancel, onReschedule }) => {
  const isCancelled = booking.status === 'cancelled';
  const isCompleted = booking.status === 'completed';
  
  // Safe extraction of services
  const rawServices = booking.services || (booking.service ? [booking.service] : []);
  const servicesList = rawServices.filter((s: any) => s); // Filter nulls
  const isMulti = servicesList.length > 1;
  const mainService = servicesList[0];

  // If data is corrupt and no service exists, return null or placeholder
  if (!mainService) return null;

  return (
    <div className={`
      relative rounded-[2rem] p-6 transition-all duration-300 group overflow-hidden
      ${(isCancelled || isCompleted) 
        ? 'bg-surface/20 border border-white/5 opacity-50 grayscale' 
        : 'bg-surface border border-white/5 hover:border-primary/30 shadow-xl'
      }
    `}>
      <div className="flex flex-col gap-5">
        <div className="flex justify-between items-start gap-4">
            <div className="flex gap-5 items-center">
               {/* Ícone de Data Estilo "Elite" - Atualizado */}
               <div className={`
                  w-14 h-14 rounded-2xl flex flex-col items-center justify-center shrink-0 transition-transform group-hover:scale-105 pt-1
                  ${(isCancelled || isCompleted) 
                    ? 'bg-zinc-900 border border-white/5' 
                    : 'bg-[#252525] border border-white/5' // Fundo ligeiramente mais escuro que o card
                  }
                `}>
                  <span className={`text-xl font-black leading-none ${!isCancelled && !isCompleted ? 'text-primary' : 'text-zinc-600'}`}>
                    {new Date(booking.date).getDate()}
                  </span>
                  <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600 mt-0.5">
                    {new Date(booking.date).toLocaleString('pt-PT', { month: 'short' }).toUpperCase().replace('.', '')}
                  </span>
               </div>

               <div>
                   <h3 className="font-black text-base uppercase italic tracking-tight mb-1 text-white leading-tight">
                      {isMulti ? `${mainService.name} + ${servicesList.length - 1}` : mainService.name}
                   </h3>
                   <div className="flex items-center gap-3">
                      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-primary transition-colors">
                         {booking.service?.price || mainService.price}
                         {!(booking.service?.price || mainService.price).toString().includes('€') && '€'}
                      </p>
                      {isMulti && (
                         <span className="text-[9px] font-bold text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded flex items-center gap-1">
                            <Layers size={10} /> {servicesList.length} itens
                         </span>
                      )}
                   </div>
               </div>
            </div>

            <div className="shrink-0">
               {booking.status === 'confirmed' && (
                <div className="bg-emerald-500/10 text-emerald-400 text-[9px] font-black px-3 py-1.5 rounded-full border border-emerald-500/20 flex items-center gap-1.5 uppercase tracking-[0.1em]">
                  <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></div> Confirmada
                </div>
              )}
              {isCancelled && (
                <div className="text-[9px] font-black text-red-400 bg-red-400/5 px-3 py-1.5 rounded-full border border-red-400/10 uppercase tracking-[0.1em]">
                  Cancelada
                </div>
              )}
              {isCompleted && (
                <div className="text-[9px] font-black text-zinc-400 bg-white/5 px-3 py-1.5 rounded-full border border-white/5 uppercase tracking-[0.1em]">
                  Realizada
                </div>
              )}
            </div>
        </div>

        {isMulti && (
           <div className="pl-1 space-y-1 border-l-2 border-white/5 ml-6 py-1">
              {servicesList.slice(0, 3).map((s: any, idx: number) => (
                 <p key={idx} className="text-[10px] text-zinc-500 font-medium pl-3 truncate">{s.name}</p>
              ))}
              {servicesList.length > 3 && <p className="text-[9px] text-zinc-600 pl-3 italic">...</p>}
           </div>
        )}

        <div className="flex flex-wrap items-center gap-4 text-[11px] font-bold text-muted pl-1">
            <span className="flex items-center gap-2">
              <Clock size={14} className="text-primary" /> 
              {booking.time} • {booking.service?.duration || mainService.duration} min
            </span>
            <span className="w-1 h-1 bg-zinc-800 rounded-full"></span>
            <span className="flex items-center gap-2">
              <Star size={14} className="text-primary" />
              {booking.professional === 'agent' ? 'Agente AI' : (booking.professional?.name || 'Especialista')}
            </span>
        </div>

        {booking.status === 'confirmed' && (
          <div className="space-y-4 pt-5 border-t border-white/5">
             <div className="flex gap-2">
               <button 
                  onClick={() => onReschedule(booking)}
                  className="flex-1 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center justify-center gap-2 active:scale-95"
               >
                 <RefreshCw size={14} /> Reagendar
               </button>
               <button 
                  onClick={() => onCancel(booking.id)}
                  className="px-5 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-red-500/60 hover:text-red-400 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 transition-all flex items-center justify-center gap-2 active:scale-95"
               >
                 <XCircle size={14} /> Cancelar
               </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const MyBookings: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [bookings, setBookings] = useState<any[]>([]);
  const [userName, setUserName] = useState('Cliente');
  const [activeTab, setActiveTab] = useState<'upcoming' | 'history'>('upcoming');

  useEffect(() => {
    const userStr = localStorage.getItem('beauty_user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setUserName(user.name.split(' ')[0]);
    }

    const loadBookings = () => {
      const stored = localStorage.getItem('beauty_bookings');
      if (stored) {
        setBookings(JSON.parse(stored));
      }
    };

    loadBookings();
  }, []);

  const handleCancel = (id: string) => {
    if (window.confirm("Desejas libertar esta vaga? Ela será disponibilizada imediatamente para a lista de espera.")) {
      const updated = bookings.map(b => b.id === id ? { ...b, status: 'cancelled' } : b);
      setBookings(updated);
      localStorage.setItem('beauty_bookings', JSON.stringify(updated));
      
      // Feedback Premium
      showToast('success', 'Vaga libertada', 'Notificámos o salão e a lista de espera.');
      
      // Log de Auditoria para o Owner
      const logs = JSON.parse(localStorage.getItem('beauty_logs_db') || '[]');
      const newLog = {
        id: Math.random().toString(36).substr(2, 9),
        type: 'alert',
        message: `Cancelamento: ${userName}`,
        details: `Vaga de ${new Date().toLocaleDateString()} libertada para waiting list.`,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('beauty_logs_db', JSON.stringify([newLog, ...logs]));
    }
  };

  const handleReschedule = (booking: any) => {
    // Safe extraction for draft logic
    const servicesList = booking.services || (booking.service ? [booking.service] : []);
    const validServices = servicesList.filter((s:any) => s);
    
    if (validServices.length === 0) {
        showToast('error', 'Erro', 'Dados da marcação original corrompidos.');
        return;
    }

    localStorage.setItem('beauty_booking_draft', JSON.stringify({
      service: validServices[0],
      services: validServices, // Include services list
      totalDuration: validServices.reduce((acc: number, s: any) => acc + parseInt(s.duration || '0'), 0),
      professional: booking.professional,
      reschedulingId: booking.id
    }));
    showToast('info', 'Modo Reagendamento', 'Escolhe agora a tua nova data.');
    navigate('/client/calendar');
  };

  const handleLogout = () => {
    if(window.confirm("Desejas sair do portal?")) {
      localStorage.removeItem('beauty_user');
      navigate('/');
    }
  };

  const upcomingBookings = bookings
    .filter(b => b.status === 'confirmed')
    .sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime());

  const pastBookings = bookings
    .filter(b => b.status === 'completed' || b.status === 'cancelled')
    .sort((a, b) => new Date(`${b.date}T${b.time}`).getTime() - new Date(`${a.date}T${a.time}`).getTime());

  const totalCompleted = pastBookings.filter(b => b.status === 'completed').length;
  const currentPoints = totalCompleted % 10;
  const visitsNeeded = 10 - currentPoints;

  return (
    <div className="max-w-3xl mx-auto pb-40 px-4 animate-fade-in">
      <div className="flex justify-between items-center mb-10 pt-4">
         <button 
            onClick={() => navigate('/')} 
            className="text-muted hover:text-white flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all group"
         >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> <span className="hidden sm:inline">Página Principal</span>
         </button>
         
         <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-[10px] font-black text-red-500/60 hover:text-red-400 transition-all bg-red-500/5 px-4 py-2 rounded-xl border border-red-500/10"
         >
            <span>Sair</span>
            <LogOut size={14} />
         </button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase leading-none mb-3">
            O Teu <span className="text-primary">Espaço</span>
          </h1>
          <p className="text-muted text-sm font-medium">
            Bem-vinda, <span className="text-white font-bold">{userName}</span>. Gere as tuas visitas e fidelização.
          </p>
        </div>
        
        <Button 
           onClick={() => {
             localStorage.removeItem('beauty_booking_draft');
             navigate('/client/service');
           }}
           className="px-8 py-4 font-bold shadow-2xl w-full md:w-auto transform active:scale-95"
        >
           <Plus size={18} className="mr-2" strokeWidth={3} /> Nova Marcação
        </Button>
      </div>

      {/* Fidelização */}
      <div className="bg-surface rounded-[2.5rem] p-8 border border-white/5 relative overflow-hidden mb-12 shadow-2xl group">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
           <div className="flex-grow space-y-6 w-full">
              <div className="flex items-center gap-3">
                 <div className="p-3 bg-background rounded-2xl border border-primary/20 shadow-lg">
                    <Trophy className="text-primary" size={24} />
                 </div>
                 <div>
                   <h2 className="text-xl font-black text-white tracking-tight uppercase italic leading-none">
                      Glow Club
                   </h2>
                   <p className="text-[10px] text-muted font-black uppercase tracking-[0.2em] mt-1">Programa de Recompensas</p>
                 </div>
              </div>
              
              <div className="w-full">
                 <p className="text-lg font-medium text-white mb-5 leading-tight">
                    Faltam <span className="font-black text-primary italic">{visitsNeeded} visitas</span> para o teu presente!
                 </p>
                 
                 <div className="h-2 bg-background rounded-full overflow-hidden border border-white/5 relative">
                    <div 
                       className="absolute top-0 left-0 h-full bg-primary shadow-[0_0_15px_#FFB6C1] transition-all duration-1000"
                       style={{ width: `${(currentPoints / 10) * 100}%` }}
                    ></div>
                 </div>
                 <div className="flex justify-between mt-3 text-[9px] text-zinc-600 font-black uppercase tracking-[0.2em]">
                    <span>Nível Início</span>
                    <span className="text-primary">{currentPoints} / 10 Visitas Realizadas</span>
                    <span>Presente ✨</span>
                 </div>
              </div>
           </div>
        </div>
      </div>

      <div className="flex gap-10 border-b border-white/5 mb-10 overflow-x-auto scrollbar-hide">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`pb-5 text-[11px] font-black uppercase tracking-widest transition-all relative whitespace-nowrap ${
            activeTab === 'upcoming' ? 'text-white' : 'text-zinc-600 hover:text-zinc-400'
          }`}
        >
          Próximas Visitas ({upcomingBookings.length})
          {activeTab === 'upcoming' && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></div>
          )}
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`pb-5 text-[11px] font-black uppercase tracking-widest transition-all relative whitespace-nowrap ${
            activeTab === 'history' ? 'text-white' : 'text-zinc-600 hover:text-zinc-400'
          }`}
        >
          Arquivo ({pastBookings.length})
          {activeTab === 'history' && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></div>
          )}
        </button>
      </div>

      <div className="space-y-6 animate-fade-in min-h-[300px]">
        {activeTab === 'upcoming' ? (
          upcomingBookings.length > 0 ? (
            upcomingBookings.map(booking => (
              <BookingCard 
                key={booking.id} 
                booking={booking} 
                onCancel={handleCancel}
                onReschedule={handleReschedule}
              />
            ))
          ) : (
            <div className="text-center py-20 bg-surface/20 rounded-[2.5rem] border border-dashed border-white/10 flex flex-col items-center">
              <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mb-6 text-zinc-800 border border-white/5">
                 <Calendar size={32} />
              </div>
              <h3 className="text-lg font-black text-white mb-2 uppercase italic tracking-tight">Agenda Vazia</h3>
              <p className="text-muted text-xs mb-8 max-w-[200px] mx-auto leading-relaxed font-medium">
                Ainda não tens nenhuma visita marcada para os próximos dias.
              </p>
              <Button onClick={() => navigate('/client/service')} className="px-10">
                Marcar Agora
              </Button>
            </div>
          )
        ) : (
          pastBookings.length > 0 ? (
            pastBookings.map(booking => (
              <BookingCard 
                key={booking.id} 
                booking={booking} 
                onCancel={handleCancel}
                onReschedule={handleReschedule}
              />
            ))
          ) : (
            <div className="text-center py-12 text-zinc-700 font-black uppercase text-[10px] tracking-[0.4em]">
              Sem histórico registado.
            </div>
          )
        )}
      </div>
    </div>
  );
};
