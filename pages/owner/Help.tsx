
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, HelpCircle, ChevronDown, MessageSquare, ExternalLink, Zap, LifeBuoy } from 'lucide-react';

const FAQItem = ({ question, answer }: { question: string, answer: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-surface border border-white/5 rounded-2xl overflow-hidden mb-3 transition-all hover:border-white/10 h-fit">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left"
      >
        <h3 className="text-xs lg:text-sm font-bold text-white uppercase tracking-tight pr-4">{question}</h3>
        <ChevronDown size={16} className={`text-zinc-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div className={`px-5 pb-5 text-xs text-zinc-400 font-medium leading-relaxed transition-all duration-300 ${isOpen ? 'block' : 'hidden'}`}>
        {answer}
      </div>
    </div>
  );
};

export const OwnerHelp: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-32">
      
      {/* HEADER */}
      <div className="sticky top-0 z-30 bg-[#1a1a1c]/90 backdrop-blur-xl border-b border-white/5 px-6 py-6 md:px-12">
         <div className="max-w-6xl mx-auto flex items-center gap-6">
            <button onClick={() => navigate('/owner/dashboard')} className="p-3 bg-surface border border-white/5 rounded-2xl text-zinc-400 hover:text-white transition-colors">
               <ArrowLeft size={20} />
            </button>
            <div>
               <h1 className="text-3xl lg:text-4xl font-black italic uppercase tracking-tighter text-white flex items-center gap-3">
                  Centro de Ajuda <LifeBuoy className="text-rose-400" size={28} />
               </h1>
               <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-1">Suporte & Documentação</p>
            </div>
         </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-12 py-10 animate-fade-in">
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="bg-surface border border-white/5 p-8 rounded-[2.5rem] flex flex-col items-center text-center hover:border-primary/30 transition-all group shadow-xl">
               <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 border border-primary/20 group-hover:scale-110 transition-transform">
                  <Zap size={28} />
               </div>
               <h3 className="text-xl font-black text-white uppercase italic tracking-tight mb-2">Início Rápido</h3>
               <p className="text-sm text-zinc-400 mb-8 px-4 leading-relaxed">Guia passo-a-passo para configurar o teu salão em menos de 5 minutos.</p>
               <button onClick={() => navigate('/owner/onboarding')} className="text-xs font-black uppercase tracking-widest text-primary border-b border-primary/30 pb-0.5 hover:text-white hover:border-white transition-all">Reiniciar Setup</button>
            </div>

            <div className="bg-surface border border-white/5 p-8 rounded-[2.5rem] flex flex-col items-center text-center hover:border-rose-400/30 transition-all group shadow-xl">
               <div className="w-16 h-16 bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-400 mb-6 border border-rose-500/20 group-hover:scale-110 transition-transform">
                  <MessageSquare size={28} />
               </div>
               <h3 className="text-xl font-black text-white uppercase italic tracking-tight mb-2">Suporte Direto</h3>
               <p className="text-sm text-zinc-400 mb-8 px-4 leading-relaxed">Tens uma dúvida complexa? Fala diretamente com a nossa equipa.</p>
               <a href="mailto:suporte@beautyagent.pt" className="text-xs font-black uppercase tracking-widest text-rose-400 border-b border-rose-400/30 pb-0.5 hover:text-white hover:border-white transition-all">Enviar Email</a>
            </div>
         </div>

         <h2 className="text-sm font-black text-zinc-500 uppercase tracking-widest mb-8 px-2 border-b border-white/5 pb-2 w-fit">Perguntas Frequentes</h2>

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
            <div className="space-y-1">
                <FAQItem 
                   question="Como funciona o período de Trial?" 
                   answer="Tens 7 dias de acesso ilimitado a todas as funcionalidades (Dashboard, IA, App Cliente). Após esse período, podes escolher um plano mensal ou anual. Não pedimos cartão de crédito para começar." 
                />
                <FAQItem 
                   question="Como adicionar um novo membro da equipa?" 
                   answer={<span>Vai a <b>Configurações > Equipa</b> e clica em 'Adicionar'. Podes definir a cor do calendário, comissões e cargo. Cada membro terá a sua própria agenda visual.</span>} 
                />
                <FAQItem 
                   question="O que é a Lista de Espera Inteligente?" 
                   answer="Quando um cliente tenta marcar num dia cheio, o BeautyAgent sugere a lista de espera. Se houver um cancelamento (no-show ou manual), o sistema notifica automaticamente esses clientes via SMS para preencher a vaga." 
                />
            </div>
            <div className="space-y-1">
                <FAQItem 
                   question="Como exportar relatórios financeiros?" 
                   answer={<span>Acede a <b>Relatórios</b> no menu lateral. Podes filtrar por mês ou datas personalizadas e clicar em 'Exportar PDF' ou 'CSV' no final da página para contabilidade.</span>} 
                />
                <FAQItem 
                   question="O BeautyAgent envia lembretes automáticos?" 
                   answer="Sim! Por defeito, enviamos um SMS 24h antes da marcação. Podes ajustar este tempo em Definições > Agente AI." 
                />
                <FAQItem 
                   question="Como bloquear um cliente problemático?" 
                   answer={<span>Vai a <b>Clientes</b>, procura o perfil e clica no botão 'Bloquear'. O cliente deixará de conseguir fazer marcações pela app, mas poderá ligar para o salão.</span>} 
                />
            </div>
         </div>

         <div className="mt-16 p-8 bg-zinc-900/50 rounded-[2rem] border border-white/5 text-center">
            <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mb-2">Versão do Sistema</p>
            <p className="text-sm text-zinc-400 font-mono">BeautyAgent Elite v3.0.0 (Build 2024.06)</p>
         </div>

      </div>
    </div>
  );
};
