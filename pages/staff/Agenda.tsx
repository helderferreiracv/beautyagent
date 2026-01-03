
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Share2, 
  LogOut, 
  Sparkles, 
  Calendar, 
  User, 
  ShieldAlert,
  Megaphone,
  X,
  BarChart3,
  Check,
  Ban
} from 'lucide-react';
import { Button } from '../../components/Button';

const MOCK_STAFF_PROFILE = {
  id: 'p1',
  name: 'Ana Silva',
  role: 'Hairstylist',
  referralsThisMonth: 12
};

interface BookingItem {
  id: string;
  time: string;
  client: string;
  service: string;
  price: string;
  status: string;
  duration: string;
  date: string;
}

export const StaffAgenda: React.FC = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<BookingItem[]>([]);
  const [copied, setCopied] = useState(false);
  const [globalBroadcast, setGlobalBroadcast] = useState<string | null>(null);

  useEffect(() => {
    const loadRealData = () => {
      const clientBookingsStr = localStorage.getItem('beauty_bookings');
      const clientBookings = clientBookingsStr ? JSON.parse(clientBookingsStr) : [];
      const ownerBookingsStr = localStorage.getItem('owner_bookings_db');
      const ownerBookings = ownerBookingsStr ? JSON.parse(ownerBookingsStr) : [];
      const todayStr = new Date().toISOString().split('T')[0];
      
      const normalizedClient = clientBookings
        .filter((b: any) => b.date === todayStr && (b.professional === 'agent' || b.professional?.id === '1' || b.professional?.id === 'p1'))
        .map((b: any) => ({
          id: b.id,
          time: b.time,
          client: b.userName || 'Cliente App',
          service: b.service.name,
          price: b.service.price,
          status: b.status,
          duration: b.service.duration,
          date: b.date
        }));

      const normalizedOwner = ownerBookings
        .filter((b: any) => b.date === todayStr && b.proId === 'p1')
        .map((b: any) => ({
          id: b.id,
          time: b.time,
          client: b.client,
          service: b.service,
          price: '45€',
          status: b.status,
          duration: '60 min',
          date: b.date
        }));

      let combined = [...normalizedClient, ...normalizedOwner];

      // SE ESTIVER EM MODO TRIAL/DEMO E VAZIO, ADICIONAR EXEMPLOS
      const isDemo = localStorage.getItem('beauty_is_demo_active') === 'true';
      if (combined.length === 0 && isDemo) {
        combined = [
          { id: 'demo1', time: '09:00', client: 'Maria Cavaco', service: 'Corte & Brushing', price: '45€', status: 'completed', duration: '60 min', date: todayStr },
          { id: 'demo2', time: '11:30', client: 'Beatriz Soares', service: 'Coloração Raiz', price: '50€', status: 'confirmed', duration: '90 min', date: todayStr },
          { id: 'demo3', time: '14:00', client: 'Carla Antunes', service: 'Tratamento Hidratação', price: '30€', status: 'confirmed', duration: '45 min', date: todayStr },
          { id: 'demo4', time: '16:30', client: 'Joana Magalhães', service: 'Corte Feminino', price: '45€', status: 'waiting', duration: '60 min', date: todayStr },
        ];
      }

      combined.sort((a, b) => a.time.localeCompare(b.time));
      setAppointments(combined);
    };

    loadRealData();
    const broadcast = localStorage.getItem('beauty_global_broadcast');
    if (broadcast) setGlobalBroadcast(broadcast);
  }, []);

  const addLog = (message: string, type: 'staff' | 'alert' = 'staff', details?: string) => {
    const existingLogs = JSON.parse(localStorage.getItem('beauty_logs_db') || '[]');
    const newLog = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      message,
      details,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('beauty_logs_db', JSON.stringify([newLog, ...existingLogs]));
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    const settings = JSON.parse(localStorage.getItem('beauty_settings') || '{}');
    const requireApproval = settings.requireNoShowApproval;

    let finalStatus = newStatus;
    let logMessage = `Staff ${MOCK_STAFF_PROFILE.name} alterou estado para ${newStatus}`;
    let logType: 'staff' | 'alert' = 'staff';

    if (newStatus === 'no-show') {
       if (requireApproval) {
          finalStatus = 'pending-no-show';
          logMessage = `⚠️ Solicitação de No-show por ${MOCK_STAFF_PROFILE.name}`;
          logType = 'alert';
       } else {
          logMessage = `🚨 No-show registado por ${MOCK_STAFF_PROFILE.name}`;
          logType = 'alert';
       }
    }

    const updated = appointments.map(app => {
      if (app.id === id) {
         addLog(logMessage, logType, `Cliente: ${app.client} | Hora: ${app.time}`);
         return { ...app, status: finalStatus };
      }
      return app;
    });

    setAppointments(updated);
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/#/referral/${MOCK_STAFF_PROFILE.id}`;
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const remaining = appointments.filter(a => a.status === 'confirmed' || a.status === 'waiting').length;
  const completedCount = appointments.filter(a => a.status === 'completed').length;

  return (
    <div className="max-w-2xl mx-auto pb-40 px-4 animate-fade-in">
      {globalBroadcast && (
        <div className="mb-8 bg-primary/20 border border-primary/30 p-5 rounded-[2rem] flex items-center justify-between shadow-xl">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary animate-pulse">
                <Megaphone size={18} />
              </div>
              <p className="text-xs font-black text-white uppercase tracking-tight italic">{globalBroadcast}</p>
           </div>
           <button 
            onClick={() => setGlobalBroadcast(null)} 
            className="p-2 text-zinc-500 hover:text-white transition-colors"
           >
              <X size={16} />
           </button>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
        <div>
           <div className="flex items-center gap-2 mb-3">
             <span className="bg-primary/10 text-primary text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-[0.2em] border border-primary/20 italic">
               Staff Portal Active
             </span>
           </div>
           <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic flex items-center gap-3 leading-none">
             Olá, {MOCK_STAFF_PROFILE.name.split(' ')[0]} <Sparkles className="text-primary" size={24} />
           </h1>
           <p className="text-muted text-[11px] mt-3 font-black uppercase tracking-[0.3em]">
             Tens <span className="text-white">{remaining} tarefas</span> para hoje
           </p>
        </div>
        
        <button 
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-surface border border-border rounded-xl text-[10px] font-black uppercase tracking-widest text-muted hover:text-white transition-all flex items-center gap-2 active:scale-95"
        >
          <LogOut size={14} /> Sair do Portal
        </button>
      </div>

      <div className="bg-surface p-8 rounded-[2.5rem] border border-border mb-12 relative overflow-hidden group shadow-2xl">
         <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all pointer-events-none"></div>
         <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-8">
            <div className="text-center sm:text-left">
               <h3 className="text-white font-black text-base uppercase tracking-tight italic mb-1">Glow Club: Teu Link Único</h3>
               <p className="text-muted text-[11px] font-bold uppercase tracking-widest mb-4">Geraste {MOCK_STAFF_PROFILE.referralsThisMonth} novos clientes este mês.</p>
               <div className="text-[10px] text-primary bg-background/50 px-4 py-2 rounded-xl border border-white/5 w-fit mx-auto sm:mx-0 font-black font-mono tracking-widest italic">
                  beautyagent.pt/referral/{MOCK_STAFF_PROFILE.id}
               </div>
            </div>
            
            <Button 
              onClick={handleCopyLink}
              className={`whitespace-nowrap px-10 rounded-2xl shadow-xl ${copied ? 'bg-emerald-500 text-background border-emerald-500' : ''}`}
            >
               {copied ? 'Copiado ✨' : 'Partilhar Link'}
            </Button>
         </div>
      </div>

      <div className="flex items-center justify-between mb-8 px-2">
         <h2 className="text-[11px] font-black text-white uppercase tracking-[0.3em] italic">Agenda do Dia</h2>
         <div className="text-[9px] font-black text-muted bg-surface px-4 py-2 rounded-full border border-border uppercase tracking-[0.2em]">
            {completedCount} Concluídos
         </div>
      </div>

      <div className="relative space-y-6">
         {appointments.length === 0 ? (
            <div className="py-24 text-center border border-dashed border-border rounded-[2.5rem] bg-surface/20 opacity-30">
               <p className="text-[11px] font-black uppercase tracking-[0.4em]">Sem movimentos registados</p>
            </div>
         ) : (
           appointments.map((app) => {
              const isCompleted = app.status === 'completed';
              const isNoShow = app.status === 'no-show';
              const isPending = app.status === 'pending-no-show';

              return (
                <div key={app.id} className={`relative group transition-all duration-500 ${isCompleted ? 'opacity-30 grayscale' : ''}`}>
                   <div className="flex gap-6">
                      <div className="flex flex-col items-center min-w-[50px] pt-4">
                         <div className={`w-12 h-12 rounded-2xl bg-background border flex items-center justify-center text-xs font-black italic uppercase transition-all ${isCompleted ? 'border-white/5 text-zinc-700' : 'border-primary/20 text-primary shadow-lg shadow-primary/5'}`}>
                            {app.time}
                         </div>
                         <div className="w-px h-full bg-border/30 mt-4"></div>
                      </div>

                      <div className={`flex-grow p-6 rounded-[2.5rem] border transition-all duration-500 shadow-sm ${isCompleted ? 'bg-zinc-900/20 border-white/5' : 'bg-surface border-border hover:border-primary/30 hover:shadow-2xl'}`}>
                         <div className="flex justify-between items-start mb-6">
                            <div>
                               <h3 className="text-lg font-black text-white uppercase italic tracking-tight mb-1">{app.client}</h3>
                               <p className="text-[10px] text-muted font-black uppercase tracking-widest flex items-center gap-2">
                                  <Sparkles size={12} className="text-primary" /> {app.service}
                               </p>
                            </div>
                            <div className="text-right">
                               <span className="block text-white font-black text-lg italic tracking-tighter">{app.price}</span>
                               <span className="text-[9px] text-muted font-black uppercase tracking-widest">{app.duration}</span>
                            </div>
                         </div>

                         {!isCompleted && !isNoShow && !isPending ? (
                           <div className="flex justify-end gap-3 pt-6 border-t border-white/5">
                              {/* Compact Actions */}
                              <button 
                                onClick={() => handleStatusChange(app.id, 'no-show')}
                                className="w-12 h-12 bg-white/5 hover:bg-red-500/10 text-zinc-500 hover:text-red-400 border border-white/5 hover:border-red-500/20 rounded-2xl transition-all active:scale-90 flex items-center justify-center"
                                title="Registar Ausência"
                              >
                                 <Ban size={18} />
                              </button>
                              <button 
                                onClick={() => handleStatusChange(app.id, 'completed')}
                                className="h-12 px-6 bg-primary text-background rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all hover:bg-white active:scale-95 shadow-lg shadow-primary/10 flex items-center gap-2"
                              >
                                 <Check size={16} strokeWidth={3} /> Concluir
                              </button>
                           </div>
                         ) : (
                           <div className={`mt-2 inline-flex items-center gap-2.5 px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest ${
                             isCompleted ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-500/60' : 
                             isNoShow ? 'bg-red-500/5 border-red-500/10 text-red-500/60' :
                             'bg-amber-500/5 border-amber-500/10 text-amber-500/60'
                           }`}>
                              {isCompleted && <CheckCircle2 size={14} />}
                              {isNoShow && <XCircle size={14} />}
                              {isPending && <ShieldAlert size={14} />}
                              {app.status}
                           </div>
                         )}
                      </div>
                   </div>
                </div>
              );
           })
         )}
      </div>

      <div className="fixed bottom-32 left-1/2 -translate-x-1/2 md:hidden">
         <button 
            onClick={() => navigate(`/staff/view/${MOCK_STAFF_PROFILE.id}`)}
            className="bg-primary text-background px-8 py-4 rounded-full font-black uppercase text-[11px] tracking-widest shadow-[0_20px_50px_rgba(255,182,193,0.4)] flex items-center gap-3 active:scale-95 transition-all border-[4px] border-background"
         >
            <BarChart3 size={18} /> Meus Ganhos
         </button>
      </div>
    </div>
  );
};
