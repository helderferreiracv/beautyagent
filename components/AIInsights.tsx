
import React, { useState } from 'react';
import { Sparkles, BrainCircuit, TrendingUp, X, Loader2, Lightbulb } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { Button } from './Button';

interface AIInsightsProps {
  onClose: () => void;
}

const InsightSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    {/* Bloco Título Pulsante */}
    <div className="flex items-center gap-3">
       <div className="w-8 h-8 bg-zinc-800 rounded-lg"></div>
       <div className="h-4 bg-zinc-800 rounded-full w-1/3"></div>
    </div>
    
    {/* Bloco Texto Pulsante */}
    <div className="space-y-3">
      <div className="h-3 bg-zinc-800 rounded-full w-full"></div>
      <div className="h-3 bg-zinc-800 rounded-full w-5/6"></div>
      <div className="h-3 bg-zinc-800 rounded-full w-4/6"></div>
    </div>

    {/* Bloco Estrutural Secundário */}
    <div className="pt-4 border-t border-white/5 space-y-3">
       <div className="h-2 bg-zinc-900 rounded-full w-3/4"></div>
       <div className="h-2 bg-zinc-900 rounded-full w-1/2"></div>
    </div>
  </div>
);

export const AIInsights: React.FC<AIInsightsProps> = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState<string | null>(null);

  const generateBusinessInsight = async () => {
    setLoading(true);
    try {
      const bookings = localStorage.getItem('beauty_bookings') || '[]';
      const ownerBookings = localStorage.getItem('owner_bookings_db') || '[]';
      const services = localStorage.getItem('owner_services_db') || '[]';
      
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const prompt = `
        Atua como um Consultor de Gestão de Salões de Beleza de Elite. 
        Analisa estes dados reais do meu salão e dá-me 3 sugestões estratégicas curtas para aumentar a faturação ou otimizar a agenda na próxima semana.
        
        DADOS DO SALÃO:
        - Marcações App: ${bookings}
        - Marcações Manuais: ${ownerBookings}
        - Menu de Serviços: ${services}

        Responde em Português de Portugal, com um tom profissional, moderno e inspirador. 
        Usa emojis discretos. Sê muito conciso (máximo 150 palavras).
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setInsight(response.text || "Não foi possível gerar insights de momento.");
    } catch (error) {
      console.error("AI Error:", error);
      setInsight("Erro ao ligar ao Agente AI. Verifica a tua ligação.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-background/95 backdrop-blur-md" onClick={onClose}></div>
      
      <div className="relative w-full max-w-lg bg-surface border border-primary/20 rounded-[3rem] overflow-hidden shadow-[0_0_80px_rgba(255,182,193,0.1)] animate-in zoom-in-95 duration-300">
        <div className="bg-gradient-to-br from-primary/15 via-primary/5 to-transparent p-10 pb-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-primary rounded-2xl shadow-xl shadow-primary/20 text-background">
                <BrainCircuit size={28} strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-white tracking-tighter uppercase italic">Agente AI</h3>
                <p className="text-[10px] text-muted font-black uppercase tracking-[0.3em] mt-0.5">Intelligence Audit</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-muted hover:text-white transition-all active:scale-75">
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-10 pt-6">
          {!insight && !loading ? (
            <div className="text-center py-10">
              <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center mx-auto mb-8 border border-white/5 shadow-inner">
                <Sparkles className="text-primary animate-pulse" size={40} />
              </div>
              <h4 className="text-white font-black text-lg mb-3 uppercase italic tracking-tight">Análise Preditiva Pronta</h4>
              <p className="text-muted text-sm leading-relaxed mb-10 font-medium px-6">
                Vou analisar os teus padrões de marcação e sugerir ações de lucro imediato.
              </p>
              <Button fullWidth onClick={generateBusinessInsight} className="py-5 text-base">
                Gerar Relatório Estratégico
              </Button>
            </div>
          ) : loading ? (
            <div className="py-10">
               <div className="flex items-center gap-3 mb-10 text-primary animate-pulse">
                  <Loader2 size={18} className="animate-spin" />
                  <span className="text-[11px] font-black uppercase tracking-[0.3em]">O Agente está a orquestrar os dados...</span>
               </div>
               <InsightSkeleton />
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
              <div className="bg-background/60 border border-white/10 rounded-[2rem] p-8 mb-8 shadow-inner">
                <div className="flex items-center gap-3 mb-6 text-primary">
                  <Lightbulb size={20} />
                  <span className="text-[11px] font-black uppercase tracking-[0.3em]">Directivas Master</span>
                </div>
                <div className="text-gray-200 text-base leading-relaxed whitespace-pre-line font-medium italic">
                  {insight}
                </div>
              </div>
              
              <div className="flex gap-4">
                <Button variant="outline" fullWidth onClick={() => setInsight(null)} className="py-4 text-[11px]">Recalcular</Button>
                <Button fullWidth onClick={onClose} className="py-4 text-[11px]">Implementar Agora</Button>
              </div>
            </div>
          )}
        </div>

        <div className="px-10 py-5 bg-zinc-900/80 border-t border-white/5 text-center">
          <p className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.4em] italic">
            BeautyAgent Advanced Infrastructure • v2.5
          </p>
        </div>
      </div>
    </div>
  );
};
