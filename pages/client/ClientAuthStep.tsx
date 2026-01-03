
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Smartphone, User, ArrowLeft, ShieldCheck, ArrowRight } from 'lucide-react';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { BookingProgressBar } from '../../components/BookingProgressBar';

export const ClientAuthStep: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', phone: '' });

  useEffect(() => {
    const savedUser = localStorage.getItem('beauty_user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      if (user.verified) {
        navigate('/client/confirm');
      }
    }
    
    if (!localStorage.getItem('beauty_booking_draft')) {
      navigate('/client/service');
    }
  }, [navigate]);

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    localStorage.setItem('beauty_user', JSON.stringify({ ...formData, verified: false }));
    navigate('/client/otp');
  };

  return (
    <div className="max-w-md mx-auto py-10 px-6 pb-32 animate-fade-in">
      <button 
        onClick={() => navigate(-1)} 
        className="mb-10 text-muted hover:text-white flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] transition-all group"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Voltar
      </button>

      <BookingProgressBar currentStep={4} />

      <div className="mb-12 text-center">
        <h1 className="text-5xl font-black text-white italic uppercase tracking-tighter mb-4 leading-none">
          Identificação
        </h1>
        <p className="text-muted text-sm font-medium tracking-tight px-4">
          Quase lá! Só precisamos de validar o teu contacto.
        </p>
      </div>

      <div className="bg-surface rounded-[3.5rem] p-10 border border-white/5 shadow-[0_40px_80px_rgba(0,0,0,0.6)] relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none opacity-40"></div>
        
        <form onSubmit={handleContinue} className="space-y-10 relative z-10">
          <div className="space-y-8">
            <Input 
              label="Nome Completo" 
              placeholder="COMO TE CHAMAS?"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              required
              icon={<User />}
            />
            <Input 
              label="Telemóvel" 
              type="tel"
              placeholder="9XXXXXXXX"
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
              required
              icon={<Smartphone />}
            />
          </div>
          
          <div className="pt-4">
            <Button 
              fullWidth 
              type="submit" 
              className="py-6 rounded-full shadow-2xl shadow-primary/30 group whitespace-nowrap"
            >
              Receber Código SMS 
              <div className="ml-2 bg-background/20 p-2 rounded-full group-hover:bg-background/40 transition-colors">
                <ArrowRight size={16} strokeWidth={3} />
              </div>
            </Button>
          </div>
        </form>
        
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col items-center gap-4">
           <div className="flex items-center gap-3 text-[9px] text-zinc-500 font-black uppercase tracking-[0.3em]">
              <ShieldCheck size={14} className="text-emerald-500/60" /> 
              Dados Encriptados & Seguros
           </div>
           <p className="text-[8px] text-zinc-700 font-bold uppercase tracking-[0.4em] italic">
              Powered by BeautyAgent AI Core
           </p>
        </div>
      </div>

      <div className="mt-10 text-center">
         <p className="text-[10px] text-zinc-600 font-medium leading-relaxed px-10">
           Ao continuar, concordas com os nossos <span className="text-zinc-500 underline decoration-zinc-800 cursor-pointer">Termos</span> e <span className="text-zinc-500 underline decoration-zinc-800 cursor-pointer">Privacidade</span>.
         </p>
      </div>
    </div>
  );
};
