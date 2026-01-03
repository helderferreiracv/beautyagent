
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, HelpCircle, ChevronRight } from 'lucide-react';

const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => (
  <div className="bg-surface/50 border border-white/5 p-6 rounded-2xl mb-4">
    <h3 className="text-white font-bold text-sm mb-3 uppercase tracking-tight italic flex items-center gap-2">
      <ChevronRight size={14} className="text-rose-400" /> {question}
    </h3>
    <p className="text-muted text-xs leading-relaxed font-medium">{answer}</p>
  </div>
);

export const FAQPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto py-20 px-6 animate-fade-in">
      <button 
        onClick={() => navigate('/')} 
        className="mb-10 text-muted hover:text-white flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all group"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Voltar
      </button>

      <div className="mb-12">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-rose-500/10 rounded-2xl border border-rose-500/20">
            <HelpCircle size={24} className="text-rose-400" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">Perguntas Frequentes</h1>
        </div>
        <p className="text-muted font-medium text-sm">Tudo o que precisas de saber sobre o BeautyAgent.</p>
      </div>

      <div className="space-y-2">
        <FAQItem 
          question="Como funciona o período de Trial?" 
          answer="Ao registares o teu salão, recebes 7 dias de acesso total e ilimitado a todas as ferramentas do BeautyAgent. Não pedimos cartão de crédito na ativação."
        />
        <FAQItem 
          question="Posso cancelar a subscrição a qualquer momento?" 
          answer="Sim. Não existem contratos de fidelização. Podes cancelar a renovação do teu plano mensal ou anual diretamente no painel de definições."
        />
        <FAQItem 
          question="Os meus dados e os das minhas clientes estão seguros?" 
          answer="Sim. Utilizamos encriptação de nível bancário e todos os dados são processados em conformidade com o RGPD dentro da União Europeia."
        />
        <FAQItem 
          question="Como funciona o Agente AI?" 
          answer="A nossa IA analisa a tua agenda em tempo real, sugere otimizações, envia lembretes automáticos e até ajuda a recuperar clientes que abandonaram o processo de marcação."
        />
        <FAQItem 
          question="É necessário instalar alguma aplicação?" 
          answer="Não. O BeautyAgent é uma plataforma SaaS 100% web. Podes aceder a partir de qualquer dispositivo (PC, Tablet ou Smartphone) através do navegador."
        />
      </div>
      
      <div className="mt-20 text-center opacity-30">
        <p className="text-[9px] font-bold uppercase tracking-[0.3em]">© {new Date().getFullYear()} BeautyAgent Intelligence</p>
      </div>
    </div>
  );
};
