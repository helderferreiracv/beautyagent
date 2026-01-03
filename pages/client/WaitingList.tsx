
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, BellRing, Sparkles, Loader2, Check, Calendar, ChevronRight, User } from 'lucide-react';
import { Button } from '../../components/Button';

export const ClientWaitingList: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [joined, setJoined] = useState(false);
  const [userPhone, setUserPhone] = useState('');
  
  const dateStr = searchParams.get('date');
  const action = searchParams.get('action');

  useEffect(() => {
    // Se voltamos do login com instrução de auto-join, executar imediatamente
    if (action === 'auto_join') {
      executeJoinLogic();
    }
  }, [action]);

  const executeJoinLogic = () => {
    setLoading(true);
    
    setTimeout(() => {
      const userStr = localStorage.getItem('beauty_user');
      const user = userStr ? JSON.parse(userStr) : { name: 'Cliente', phone: 'Teu Telemóvel' };
      setUserPhone(user.phone);

      const existingLogs = JSON.parse(localStorage.getItem('beauty_logs_db') || '[]');
      const newLog = {
        id: Math.random().toString(36).substr(2, 9),
        type: 'ai',
        message: `Lista de Espera: ${user.name}`,
        details: `Solicitou alerta prioritário para o dia ${dateStr}.`,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('beauty_logs_db', JSON.stringify([newLog, ...existingLogs]));

      // Limpar pendentes
      localStorage.removeItem('beauty_pending_waitlist');

      setLoading(false);
      setJoined(true);
    }, 1500);
  };

  const handleJoinClick = () => {
    const userStr = localStorage.getItem('beauty_user');
    const user = userStr ? JSON.parse(userStr) : null;

    // VALIDAR SE O UTILIZADOR JÁ ESTÁ AUTENTICADO
    if (user && user.verified) {
      executeJoinLogic();
    } else {
      // Se não, guardar intenção e mandar para auth
      localStorage.setItem('beauty_pending_waitlist', JSON.stringify({ date: dateStr }));
      navigate('/client/auth');
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4 animate-fade-in pb-40">
      {!joined && (
        <button 
          onClick={() => navigate('/client/calendar')} 
          className="mb-8 text-muted hover:text-white flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Calendário
        </button>
      )}

      <div className="text-center">
        <div className={`
          w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border transition-all duration-700
          ${joined 
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 shadow-2xl shadow-emerald-500/10 scale-110' 
            : 'bg-primary/10 border-primary/20 text-primary shadow-2xl shadow-primary/5'}
        `}>
          {loading ? (
            <Loader2 className="animate-spin" size={36} />
          ) : joined ? (
            <Check size={40} strokeWidth={3} className="animate-in zoom-in" />
          ) : (
            <BellRing size={40} />
          )}
        </div>

        <h2 className="text-4xl font-black text-white mb-3 tracking-tighter italic uppercase leading-none">
          {joined ? 'Monitorização Ativa' : 'Dia Esgotado'}
        </h2>
        <p className="text-muted text-sm mb-12 px-4 font-medium leading-relaxed">
          {joined 
            ? <span>Confirmado! O BeautyAgent enviará um SMS para <b>{userPhone}</b> assim que surgir uma vaga para {dateStr}.</span>
            : `A agenda para ${dateStr} está completa. Gostarias de entrar na nossa lista de prioridade AI?`
          }
        </p>

        {joined ? (
          <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
             <div className="bg-surface p-8 rounded-[2.5rem] border border-white/5 text-left relative overflow-hidden shadow-2xl mb-8">
                <div className="absolute top-0 right-0 p-4 opacity-5"><Sparkles size={40} className="text-primary"/></div>
                <h3 className="text-sm font-black text-white uppercase italic tracking-tight mb-4">O que desejas fazer agora?</h3>
                <div className="space-y-3">
                   <button 
                      onClick={() => navigate('/client/calendar')}
                      className="w-full flex items-center justify-between p-5 bg-background hover:bg-zinc-800 rounded-2xl border border-white/5 transition-all group"
                   >
                      <div className="flex items-center gap-4">
                         <div className="p-3 bg-primary/10 rounded-xl text-primary group-hover:scale-110 transition-transform"><Calendar size={20}/></div>
                         <span className="text-xs font-black uppercase italic tracking-widest text-zinc-300">Marcar noutro dia</span>
                      </div>
                      <ChevronRight size={16} className="text-zinc-700" />
                   </button>
                   <button 
                      onClick={() => navigate('/client/my-bookings')}
                      className="w-full flex items-center justify-between p-5 bg-background hover:bg-zinc-800 rounded-2xl border border-white/5 transition-all group"
                   >
                      <div className="flex items-center gap-4">
                         <div className="p-3 bg-zinc-900 rounded-xl text-zinc-500 group-hover:scale-110 transition-transform"><User size={20}/></div>
                         <span className="text-xs font-black uppercase italic tracking-widest text-zinc-300">Ver minhas visitas</span>
                      </div>
                      <ChevronRight size={16} className="text-zinc-700" />
                   </button>
                </div>
             </div>
          </div>
        ) : (
          <div className="bg-surface border border-white/5 rounded-[3rem] p-10 text-left shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
               <Sparkles size={50} className="text-primary" />
            </div>
            
            <h3 className="text-[11px] font-black text-primary uppercase tracking-[0.3em] mb-5 flex items-center gap-2">
               <Sparkles size={14} /> Sistema Inteligente de Vagas
            </h3>
            <p className="text-sm text-zinc-400 mb-10 leading-relaxed font-medium">
              O BeautyAgent monitoriza cancelamentos em tempo real. Identifica-te para receberes um alerta SMS prioritário.
            </p>
            
            <Button fullWidth onClick={handleJoinClick} disabled={loading} className="py-6 font-black tracking-widest uppercase text-xs shadow-xl shadow-primary/10">
              {loading ? 'A validar...' : 'Ativar Alerta Prioritário'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
