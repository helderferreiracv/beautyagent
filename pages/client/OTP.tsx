
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, KeyRound, ShieldCheck, CheckCircle2, Sparkles } from 'lucide-react';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';

export const ClientOTP: React.FC = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    
    // --- TODO: INTEGRATION TWILIO ---
    // 1. Chamar endpoint backend: /api/verify-otp { code, phone }
    // 2. Se 200 OK -> Prosseguir
    // 3. Se 400 ERROR -> setError('Código incorreto')
    
    if (code === '123456') {
      const savedUser = localStorage.getItem('beauty_user');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        localStorage.setItem('beauty_user', JSON.stringify({ ...user, verified: true }));
      }
      
      // Lógica de Redirecionamento Inteligente
      const pendingWaitlist = localStorage.getItem('beauty_pending_waitlist');
      const draft = localStorage.getItem('beauty_booking_draft');

      if (pendingWaitlist) {
        // Se estava a tentar entrar na Waiting List, devolve lá com action auto_join
        const { date } = JSON.parse(pendingWaitlist);
        navigate(`/client/waiting?date=${date}&action=auto_join`);
      } else if (draft) {
        // Se tinha um carrinho de compras normal
        navigate('/client/confirm');
      } else {
        // Fallback normal
        navigate('/client/my-bookings');
      }
    } else {
      setError('Código inválido. Tenta novamente.');
    }
  };

  return (
    <div className="max-w-md mx-auto py-6 px-4 pb-32 animate-fade-in">
      <button 
        onClick={() => navigate('/client/auth')} 
        className="mb-8 text-muted hover:text-white flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Alterar Dados
      </button>

      <div className="mb-10">
        <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-2 leading-none">Segurança</h1>
        <p className="text-muted text-sm font-medium leading-relaxed">
          Enviámos um código para o teu telemóvel para validar a tua identidade.
        </p>
      </div>

      <div className="bg-surface rounded-[2.5rem] p-10 border border-white/5 space-y-10 shadow-2xl relative overflow-hidden">
        {/* Glow Decorativo */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
        
        {/* Bloco Acesso Rápido Demo - Redesenhado */}
        <div className="bg-background/40 border border-primary/20 rounded-[2rem] p-6 text-center relative group overflow-hidden">
          <div className="absolute -right-2 -top-2 opacity-10 group-hover:opacity-20 transition-opacity">
            <Sparkles size={40} className="text-primary" />
          </div>
          <p className="text-[9px] text-primary uppercase tracking-[0.3em] mb-3 font-black italic">Acesso Rápido Demo</p>
          <div className="flex items-center justify-center gap-4 bg-zinc-900/50 py-3 rounded-xl border border-white/5">
             <span className="text-white font-mono font-black text-3xl tracking-[0.25em] ml-2">123456</span>
             <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <CheckCircle2 size={18} className="animate-pulse" />
             </div>
          </div>
        </div>

        <form onSubmit={handleVerify} className="space-y-8 relative z-10">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-1">Código de Confirmação</label>
            <div className="relative">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-primary/40">
                <KeyRound size={20} />
              </div>
              <input 
                type="text"
                placeholder="000 000"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.replace(/\D/g, ''));
                  setError('');
                }}
                maxLength={6}
                className={`
                  w-full bg-background border border-white/10 rounded-2xl px-12 py-5 
                  text-white placeholder-zinc-800 focus:outline-none focus:border-primary/50 
                  transition-all text-center font-mono text-3xl tracking-[0.4em] font-black
                  ${error ? 'border-red-500/50' : ''}
                `}
              />
            </div>
            {error && <span className="text-[10px] font-black text-red-400 ml-1 uppercase tracking-widest">{error}</span>}
          </div>
          
          <Button fullWidth type="submit" className="py-6 font-black uppercase tracking-widest shadow-xl shadow-primary/10">
            Validar
          </Button>
        </form>

        <button className="w-full text-[9px] font-black text-zinc-600 hover:text-white uppercase tracking-widest transition-colors flex items-center justify-center gap-2">
          Não recebeste o SMS? <span className="text-primary">Reenviar Código</span>
        </button>
      </div>
    </div>
  );
};
