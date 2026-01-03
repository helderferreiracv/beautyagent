
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Lock } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
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
          <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
            <ShieldCheck size={24} className="text-emerald-400" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">Privacidade e RGPD</h1>
        </div>
        <p className="text-muted font-medium text-sm">O teu compromisso com a segurança de dados é a nossa prioridade.</p>
      </div>

      <div className="prose prose-invert max-w-none space-y-8 text-sm text-gray-300 font-medium leading-relaxed">
        <section>
          <h2 className="text-white font-black uppercase italic tracking-tight text-lg mb-4 flex items-center gap-2">
            <Lock size={16} className="text-rose-400" /> 1. Recolha de Dados
          </h2>
          <p>
            O BeautyAgent recolhe apenas os dados estritamente necessários para a prestação do serviço de gestão de salão: nome do estabelecimento, contactos profissionais, nomes e contactos de clientes para efeitos de marcação.
          </p>
        </section>

        <section>
          <h2 className="text-white font-black uppercase italic tracking-tight text-lg mb-4 flex items-center gap-2">
            <Lock size={16} className="text-rose-400" /> 2. Processamento na UE
          </h2>
          <p>
            Todos os servidores do BeautyAgent estão localizados dentro da União Europeia, garantindo que o processamento de dados pessoais segue as diretrizes mais rigorosas do Regulamento Geral de Proteção de Dados (RGPD).
          </p>
        </section>

        <section>
          <h2 className="text-white font-black uppercase italic tracking-tight text-lg mb-4 flex items-center gap-2">
            <Lock size={16} className="text-rose-400" /> 3. Direitos dos Utilizadores
          </h2>
          <p>
            Tanto os donos de salão como as suas clientes têm o direito de acesso, retificação e o "direito ao esquecimento" (eliminação permanente de dados). Estas solicitações podem ser feitas diretamente através do suporte técnico.
          </p>
        </section>

        <section>
          <h2 className="text-white font-black uppercase italic tracking-tight text-lg mb-4 flex items-center gap-2">
            <Lock size={16} className="text-rose-400" /> 4. Cookies e Rastreio
          </h2>
          <p>
            Utilizamos apenas cookies técnicos essenciais para manter a sessão ativa e garantir a segurança da plataforma. Não utilizamos cookies de rastreio publicitário de terceiros.
          </p>
        </section>
      </div>

      <div className="mt-20 pt-12 border-t border-white/5 text-center opacity-30">
        <p className="text-[9px] font-bold uppercase tracking-[0.3em]">Última atualização: {new Date().toLocaleDateString('pt-PT')}</p>
      </div>
    </div>
  );
};
