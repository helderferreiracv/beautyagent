
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, ArrowRight, Check, User, Star, AlertTriangle } from 'lucide-react';
import { Button } from '../../components/Button';
import { BookingProgressBar } from '../../components/BookingProgressBar';
import { Professional } from '../../types';

interface StaffMember {
  id: string;
  name: string;
  role: string;
  vacations: { start: string; end: string }[];
}

export const ClientProfessionalSelection: React.FC = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'agent' | 'manual'>('manual');
  const [selectedPro, setSelectedPro] = useState<Professional | null>(null);
  const [availableProfessionals, setAvailableProfessionals] = useState<(Professional & { role: string })[]>([]);
  const [isForcedAI, setIsForcedAI] = useState(false);
  const [servicesCount, setServicesCount] = useState(1);
  
  useEffect(() => {
    const settings = JSON.parse(localStorage.getItem('beauty_settings') || '{}');
    if (settings.forceAIProSelection) {
      setMode('agent');
      setIsForcedAI(true);
    }

    const draftStr = localStorage.getItem('beauty_booking_draft');
    if (!draftStr) { navigate('/client/calendar'); return; }
    const draft = JSON.parse(draftStr);
    
    if (draft.services) setServicesCount(draft.services.length);
    
    let staffDb = JSON.parse(localStorage.getItem('owner_staff_db') || '[]');
    
    if (staffDb.length === 0) {
      staffDb = [
        { id: 'p1', name: 'Ana Silva', role: 'Master Hairstylist', vacations: [] },
        { id: 'p2', name: 'Sara Borges', role: 'Nail Artist', vacations: [] },
        { id: 'p3', name: 'Beatriz Costa', role: 'Lash Designer', vacations: [] }
      ];
    }

    const targetDate = new Date(draft.date);
    targetDate.setHours(0,0,0,0);

    const filteredStaff = staffDb.filter((member: any) => {
        const isOnVacation = member.vacations?.some((vac: any) => {
            const start = new Date(vac.start);
            const end = new Date(vac.end);
            return targetDate >= start && targetDate <= end;
        });
        return !isOnVacation;
    }).map((s: any) => ({ id: s.id, name: s.name, role: s.role }));

    setAvailableProfessionals(filteredStaff);
  }, [navigate]);

  const handleContinue = () => {
    const draft = JSON.parse(localStorage.getItem('beauty_booking_draft') || '{}');
    localStorage.setItem('beauty_booking_draft', JSON.stringify({
      ...draft,
      professional: mode === 'agent' ? 'agent' : selectedPro
    }));
    
    const user = JSON.parse(localStorage.getItem('beauty_user') || '{}');
    if (user.verified) {
      navigate('/client/confirm');
    } else {
      navigate('/client/auth');
    }
  };

  return (
    <div className="max-w-md mx-auto py-6 pb-32 px-4 animate-fade-in">
      <button onClick={() => navigate(-1)} className="mb-8 text-muted hover:text-white flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all group">
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Voltar
      </button>

      <BookingProgressBar currentStep={3} />

      <div className="mb-8">
        <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none mb-3">O Especialista</h1>
        <p className="text-muted text-sm font-medium">Quem te vai cuidar hoje?</p>
      </div>

      {servicesCount > 1 && mode === 'manual' && (
         <div className="mb-6 p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex gap-3 animate-in slide-in-from-top-2">
            <AlertTriangle className="text-orange-400 shrink-0" size={20} />
            <p className="text-[10px] text-zinc-300 font-medium leading-relaxed">
               Selecionaste <b>{servicesCount} serviços</b>. Certifica-te que o profissional escolhido realiza todos os tratamentos, ou escolhe o <b>Agente AI</b> para alocação automática.
            </p>
         </div>
      )}

      {!isForcedAI && (
        <div className="flex bg-zinc-900/50 p-1 rounded-2xl border border-white/5 mb-8">
          <button 
            onClick={() => { setMode('manual'); setSelectedPro(null); }} 
            className={`flex-1 py-2.5 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all ${mode === 'manual' ? 'bg-primary text-background shadow-lg' : 'text-zinc-600'}`}
          >
            Escolha Livre
          </button>
          <button 
            onClick={() => { setMode('agent'); setSelectedPro(null); }} 
            className={`flex-1 py-2.5 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 ${mode === 'agent' ? 'bg-primary text-background shadow-lg' : 'text-zinc-600'}`}
          >
            <Sparkles size={12} /> Agente AI
          </button>
        </div>
      )}

      <div className="space-y-4 mb-10">
        {mode === 'agent' ? (
          <div className="bg-surface border border-white/5 rounded-[2rem] p-10 text-center animate-fade-in relative overflow-hidden group shadow-2xl">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity"><Sparkles size={60} className="text-primary" /></div>
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary border border-primary/20">
               <Sparkles size={32} />
            </div>
            <h3 className="text-xl font-black text-white italic uppercase tracking-tighter mb-2">Alocação Inteligente</h3>
            <p className="text-muted text-xs font-medium leading-relaxed px-4">
               O BeautyAgent selecionará o melhor especialista para cada um dos teus {servicesCount} serviços, garantindo a melhor experiência.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {availableProfessionals.map((pro) => (
              <button 
                key={pro.id} 
                onClick={() => setSelectedPro(pro)} 
                className={`flex items-center gap-4 p-5 rounded-[2rem] border transition-all text-left relative overflow-hidden ${selectedPro?.id === pro.id ? 'bg-surface border-primary shadow-xl scale-[1.02]' : 'bg-surface border-white/5 hover:border-white/20'}`}
              >
                <div className={`w-14 h-14 rounded-2xl bg-background border flex items-center justify-center text-lg font-black italic transition-colors ${selectedPro?.id === pro.id ? 'text-primary border-primary/20' : 'text-zinc-700 border-white/5'}`}>
                  {pro.name.charAt(0)}
                </div>
                <div className="flex-grow">
                  <span className="font-black text-white block uppercase italic tracking-tight text-base leading-none mb-1">{pro.name}</span>
                  <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">{pro.role}</span>
                </div>
                {selectedPro?.id === pro.id && (
                   <div className="bg-primary p-1.5 rounded-full text-background animate-in zoom-in">
                      <Check size={14} strokeWidth={4} />
                   </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 w-full p-6 bg-background/90 backdrop-blur-xl border-t border-white/5 md:static md:bg-transparent md:border-none md:p-0 z-50">
        <Button 
          fullWidth 
          onClick={handleContinue} 
          disabled={mode === 'manual' && !selectedPro} 
          className={`py-5 text-sm shadow-2xl transition-all ${mode === 'manual' && !selectedPro ? 'opacity-30 grayscale cursor-not-allowed' : 'active:scale-95'}`}
        >
           Prosseguir para Checkout <ArrowRight size={18} className="ml-1" />
        </Button>
      </div>
    </div>
  );
};
