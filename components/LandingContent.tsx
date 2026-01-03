'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, 
  ArrowRight, 
  Zap, 
  BarChart3, 
  Calendar, 
  Star, 
  ShieldCheck, 
  Bot, 
  Lock, 
  X,
  Shield
} from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';
import { useToast } from './Toast';

export const LandingContent = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');

  const handleAdminAccess = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === '437501') {
      sessionStorage.setItem('admin_auth', 'true');
      router.push('/admin/global');
      showToast('success', 'Acesso Mestre Concedido', 'Consola Global Ativa.');
    } else {
      showToast('error', 'Falha de Segurança', 'Chave inválida.');
      setAdminPassword('');
    }
  };

  return (
    <div className="relative overflow-x-hidden bg-[#1a1a1c]">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[120vw] h-[80vh] bg-[#ebff57]/5 rounded-b-[100%] blur-[120px] pointer-events-none z-0"></div>
      
      <section className="relative pt-48 pb-32 px-6 z-10 text-center max-w-6xl mx-auto">
         <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-xs font-black uppercase tracking-[0.2em] text-[#ebff57] mb-12 animate-fade-in shadow-2xl backdrop-blur-md">
            <Bot size={16} /> Intelligence Core 3.2
         </div>

         <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter text-white leading-[0.85] uppercase italic mb-12 drop-shadow-2xl">
            A Inteligência que <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#ebff57] to-emerald-200 pr-4 pb-2 inline-block">
               o teu salão merece.
            </span>
         </h1>

         <p className="text-zinc-300 text-lg md:text-2xl font-medium max-w-3xl mx-auto mb-16 leading-relaxed">
            O BeautyAgent é o teu agente AI 24/7 para marcações, fidelização e otimização total da faturação do teu espaço. <br className="hidden md:block" />
            <span className="text-white font-bold underline decoration-[#ebff57]/40 underline-offset-8">Minimalista, rápido e inteligente.</span>
         </p>

         <div className="flex flex-col items-center gap-10">
            <Button onClick={() => router.push('/trial/register')} className="w-full sm:w-auto px-16 py-8 text-base shadow-[0_0_50px_rgba(235,255,87,0.2)] hover:scale-105 transition-transform">
               Começar Trial Grátis <ArrowRight className="ml-2" size={22} strokeWidth={3} />
            </Button>
            
            <div className="flex flex-wrap justify-center gap-10 opacity-60">
               <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                  <ShieldCheck size={18} className="text-[#ebff57]" /> Sem cartão de crédito
               </div>
               <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                  <Zap size={18} className="text-[#ebff57]" /> Setup em 60 segundos
               </div>
            </div>
         </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
         {[
            { icon: Calendar, title: "Agenda Smart", desc: "A nossa AI organiza os horários para evitar buracos e maximizar o lucro." },
            { icon: Star, title: "Glow Club", desc: "Fidelização automática que retém clientes e incentiva o retorno constante." },
            { icon: BarChart3, title: "Relatórios Reais", desc: "Métricas precisas de faturação, comissões e produtividade da equipa." }
         ].map((f, i) => (
            <div key={i} className="bg-[#242426] p-10 rounded-[3rem] border border-white/5 hover:border-[#ebff57]/20 transition-all group">
               <div className="w-14 h-14 bg-[#1a1a1c] rounded-2xl flex items-center justify-center text-[#ebff57] mb-8 border border-white/5 group-hover:scale-110 transition-transform">
                  <f.icon size={28} />
               </div>
               <h3 className="text-xl font-black text-white uppercase italic mb-3 tracking-tight">{f.title}</h3>
               <p className="text-zinc-400 text-sm leading-relaxed font-medium">{f.desc}</p>
            </div>
         ))}
      </section>

      <footer className="border-t border-white/5 bg-[#1a1a1c] pt-32 pb-20 px-6 relative z-10">
         <div className="max-w-7xl mx-auto flex flex-col items-center">
            <div className="flex items-center gap-3 mb-10 opacity-30">
               <Sparkles size={24} />
               <span className="text-xl font-black uppercase italic tracking-tighter">BeautyAgent</span>
            </div>
            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] mb-12">
               © {new Date().getFullYear()} BeautyAgent Infrastructure • v3.2 Gold Master
            </p>
            <button 
               onClick={() => setIsAdminModalOpen(true)} 
               className="text-[10px] text-zinc-800 hover:text-[#ebff57] font-black uppercase tracking-widest transition-colors flex items-center gap-2"
            >
               <Shield size={12} /> Admin Console
            </button>
         </div>
      </footer>

      {isAdminModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={() => setIsAdminModalOpen(false)}></div>
          <div className="bg-[#242426] w-full max-w-[380px] rounded-[3rem] p-10 relative z-10 border border-white/10 shadow-2xl animate-in zoom-in-95 duration-200">
             <div className="flex justify-between items-center mb-10">
                <div className="w-12 h-12 rounded-2xl bg-black/20 flex items-center justify-center text-[#ebff57]">
                   <Lock size={20} />
                </div>
                <button onClick={() => setIsAdminModalOpen(false)} className="p-3 text-zinc-500 hover:text-white"><X size={24} /></button>
             </div>
             <h3 className="text-xl font-black text-white uppercase italic tracking-tight mb-8">Acesso Global</h3>
             <form onSubmit={handleAdminAccess} className="space-y-8">
                <Input 
                   type="password" 
                   placeholder="CHAVE MESTRE" 
                   value={adminPassword} 
                   onChange={(e) => setAdminPassword(e.target.value)} 
                   className="text-center tracking-[0.6em] font-mono text-xl h-16 rounded-2xl" 
                   autoFocus 
                />
                <Button fullWidth type="submit" className="py-5 shadow-xl">Autenticar Sistema</Button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};