
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export const ReferralEntry: React.FC = () => {
  const { staffId } = useParams();
  const navigate = useNavigate();
  const [referrerName, setReferrerName] = useState('Profissional');

  useEffect(() => {
    if (!staffId) {
      navigate('/client/booking');
      return;
    }

    // Tenta encontrar o nome do staff para uma mensagem personalizada
    const staffDbStr = localStorage.getItem('owner_staff_db');
    if (staffDbStr) {
      const staffDb = JSON.parse(staffDbStr);
      const member = staffDb.find((s: any) => s.id === staffId);
      if (member) {
        setReferrerName(member.name);
      }
    }

    // Guarda o contexto da indicação no localStorage
    // Este item será lido durante o fluxo de marcação
    localStorage.setItem('beauty_referral_context', JSON.stringify({
      staffId: staffId,
      staffName: referrerName, // pode ser atualizado se encontrado
      timestamp: new Date().toISOString()
    }));

    // Pequeno delay para UX
    const timer = setTimeout(() => {
      navigate('/client/booking');
    }, 2000);

    return () => clearTimeout(timer);
  }, [staffId, navigate, referrerName]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 animate-fade-in">
       <div className="w-20 h-20 bg-surface rounded-full flex items-center justify-center mb-6 shadow-2xl relative">
          <Sparkles className="text-accent" size={40} />
          <div className="absolute inset-0 bg-accent/20 rounded-full animate-ping"></div>
       </div>
       
       <h1 className="text-2xl font-bold text-white mb-2">A carregar convite...</h1>
       <p className="text-gray-400">
         Foste indicado(a) por <span className="text-accent font-bold">{referrerName}</span>.
       </p>
       <p className="text-xs text-gray-500 mt-8">Redirecionando para a marcação...</p>
    </div>
  );
};
