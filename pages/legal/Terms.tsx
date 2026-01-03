
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Zap } from 'lucide-react';

export const TermsPage: React.FC = () => {
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
          <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
            <FileText size={24} className="text-blue-400" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">Termos de Utilização</h1>
        </div>
        <p className="text-muted font-medium text-sm">Regras de utilização do ecossistema BeautyAgent.</p>
      </div>

      <div className="prose prose-invert max-w-none space-y-8 text-sm text-gray-300 font-medium leading-relaxed">
        <section>
          <h2 className="text-white font-black uppercase italic tracking-tight text-lg mb-4 flex items-center gap-2">
            <Zap size={16} className="text-rose-400" /> 1. O Serviço
          </h2>
          <p>
            O BeautyAgent é uma plataforma SaaS (Software as a Service) de gestão. O acesso é concedido mediante subscrição ativa ou período de teste (Trial) válido.
          </p>
        </section>

        <section>
          <h2 className="text-white font-black uppercase italic tracking-tight text-lg mb-4 flex items-center gap-2">
            <Zap size={16} className="text-rose-400" /> 2. Pagamentos e Faturação
          </h2>
          <p>
            As subscrições são renovadas automaticamente no final de cada período (mensal ou anual). O utilizador é responsável por manter os dados de pagamento atualizados. Faturas são emitidas eletronicamente.
          </p>
        </section>

        <section>
          <h2 className="text-white font-black uppercase italic tracking-tight text-lg mb-4 flex items-center gap-2">
            <Zap size={16} className="text-rose-400" /> 3. Responsabilidade
          </h2>
          <p>
            O BeautyAgent não se responsabiliza por perdas de faturação decorrentes de erros de agendamento manual ou má utilização da plataforma por parte do staff do salão. A IA fornece sugestões, cabendo ao gestor a decisão final.
          </p>
        </section>

        <section>
          <h2 className="text-white font-black uppercase italic tracking-tight text-lg mb-4 flex items-center gap-2">
            <Zap size={16} className="text-rose-400" /> 4. Suspensão de Conta
          </h2>
          <p>
            Contas com trial expirado ou pagamentos em atraso por mais de 5 dias úteis serão suspensas automaticamente. O acesso será restaurado imediatamente após a regularização.
          </p>
        </section>
      </div>

      <div className="mt-20 pt-12 border-t border-white/5 text-center opacity-30">
        <p className="text-[9px] font-bold uppercase tracking-[0.3em]">BeautyAgent v1.2 Core Terms</p>
      </div>
    </div>
  );
};
