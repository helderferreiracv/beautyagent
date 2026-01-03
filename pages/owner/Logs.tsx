
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Sparkles, 
  User, 
  ShieldCheck, 
  Smartphone, 
  AlertTriangle, 
  Trash2, 
  Activity,
  Clock,
  Zap,
  CheckCircle2
} from 'lucide-react';

type LogType = 'ai' | 'system' | 'staff' | 'client' | 'alert';

interface LogEntry {
  id: string;
  type: LogType;
  message: string;
  details?: string;
  timestamp: string;
}

export const OwnerLogs: React.FC = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filter, setFilter] = useState<LogType | 'all'>('all');

  useEffect(() => {
    const savedLogs = localStorage.getItem('beauty_logs_db');
    if (savedLogs) {
      setLogs(JSON.parse(savedLogs));
    }
  }, []);

  const handleClearLogs = () => {
    if (confirm('Tem a certeza que deseja limpar todo o histórico de atividade?')) {
      setLogs([]);
      localStorage.setItem('beauty_logs_db', '[]');
    }
  };

  const getLogStyle = (type: LogType) => {
    switch (type) {
      case 'ai': return { 
        icon: <Sparkles size={16} />, 
        bg: 'bg-primary/10', 
        text: 'text-primary', 
        border: 'border-primary/20',
        label: 'Agente AI'
      };
      case 'staff': return { 
        icon: <User size={16} />, 
        bg: 'bg-blue-500/10', 
        text: 'text-blue-400', 
        border: 'border-blue-500/20',
        label: 'Staff'
      };
      case 'system': return { 
        icon: <ShieldCheck size={16} />, 
        bg: 'bg-purple-500/10', 
        text: 'text-purple-400', 
        border: 'border-purple-500/20',
        label: 'Dono'
      };
      case 'client': return { 
        icon: <Smartphone size={16} />, 
        bg: 'bg-emerald-500/10', 
        text: 'text-emerald-400', 
        border: 'border-emerald-500/20',
        label: 'Cliente'
      };
      case 'alert': return { 
        icon: <AlertTriangle size={16} />, 
        bg: 'bg-red-500/10', 
        text: 'text-red-400', 
        border: 'border-red-500/20',
        label: 'Crítico'
      };
      default: return { 
        icon: <Activity size={16} />, 
        bg: 'bg-zinc-800', 
        text: 'text-zinc-400', 
        border: 'border-white/5',
        label: 'Geral'
      };
    }
  };

  const filteredLogs = filter === 'all' ? logs : logs.filter(l => l.type === filter);

  return (
    <div className="min-h-screen bg-background text-white pb-32">
      
      {/* HEADER */}
      <div className="sticky top-0 z-30 bg-[#1a1a1c]/90 backdrop-blur-xl border-b border-white/5 px-6 py-6 md:px-12">
         <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-4">
               <button onClick={() => navigate('/owner/dashboard')} className="p-2.5 bg-surface border border-white/5 rounded-xl text-zinc-400 hover:text-white transition-colors">
                  <ArrowLeft size={18} />
               </button>
               <div>
                  <h1 className="text-2xl font-black italic uppercase tracking-tighter text-white flex items-center gap-2">
                     BeautyAgent em Ação <Sparkles className="text-primary" size={18} />
                  </h1>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5 flex items-center gap-1">
                     <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Sistema Online
                  </p>
               </div>
            </div>

            {logs.length > 0 && (
               <button 
                  onClick={handleClearLogs}
                  className="px-4 py-2 bg-red-500/5 text-red-500/60 hover:text-red-400 hover:bg-red-500/10 border border-red-500/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2"
               >
                  <Trash2 size={14} /> Limpar
               </button>
            )}
         </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-12 py-8 animate-fade-in">
         
         {/* FILTROS */}
         <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 mb-8">
            {[
               { id: 'all', label: 'Todos' },
               { id: 'ai', label: 'AI Agent' },
               { id: 'staff', label: 'Staff' },
               { id: 'system', label: 'Dono' },
               { id: 'client', label: 'Cliente' },
               { id: 'alert', label: 'Alertas' },
            ].map(f => {
               const isActive = filter === f.id;
               return (
                  <button
                     key={f.id}
                     onClick={() => setFilter(f.id as any)}
                     className={`
                        px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border
                        ${isActive 
                           ? 'bg-white text-black border-white shadow-lg scale-105' 
                           : 'bg-surface text-zinc-500 border-white/5 hover:text-white hover:bg-white/5'
                        }
                     `}
                  >
                     {f.label}
                  </button>
               );
            })}
         </div>

         {/* TIMELINE */}
         <div className="relative space-y-4">
            {/* Linha Vertical Decorativa */}
            <div className="absolute left-6 top-4 bottom-4 w-px bg-white/5 hidden md:block"></div>

            {filteredLogs.length === 0 ? (
               <div className="py-20 text-center border border-dashed border-white/10 rounded-[2.5rem] bg-surface/20">
                  <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
                     <Zap size={24} className="text-zinc-700" />
                  </div>
                  <p className="text-xs font-bold text-zinc-600 uppercase tracking-widest">Sem atividade registada</p>
               </div>
            ) : (
               filteredLogs.map((log) => {
                  const style = getLogStyle(log.type);
                  const dateObj = new Date(log.timestamp);
                  const timeStr = dateObj.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });
                  const dateStr = dateObj.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' });

                  return (
                     <div key={log.id} className="relative pl-0 md:pl-12 group">
                        {/* Dot Timeline */}
                        <div className={`absolute left-[21px] top-6 w-2.5 h-2.5 rounded-full border-2 border-[#121212] z-10 hidden md:block ${style.text.replace('text-', 'bg-')}`}></div>
                        
                        <div className={`
                           bg-surface border rounded-2xl p-5 flex flex-col sm:flex-row gap-5 items-start sm:items-center transition-all hover:shadow-lg
                           ${style.border} ${log.type === 'alert' ? 'bg-red-500/5' : 'hover:border-white/10'}
                        `}>
                           {/* Icon Badge */}
                           <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${style.bg} ${style.text} border ${style.border}`}>
                              {style.icon}
                           </div>

                           <div className="flex-grow min-w-0">
                              <div className="flex flex-wrap items-center gap-2 mb-1">
                                 <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${style.bg} ${style.text} border-transparent`}>
                                    {style.label}
                                 </span>
                                 <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider flex items-center gap-1">
                                    <Clock size={10} /> {dateStr} às {timeStr}
                                 </span>
                              </div>
                              <h3 className="text-sm font-bold text-white leading-tight">{log.message}</h3>
                              {log.details && (
                                 <p className="text-xs text-zinc-400 mt-1 leading-relaxed line-clamp-2 group-hover:line-clamp-none transition-all">
                                    {log.details}
                                 </p>
                              )}
                           </div>

                           {/* Status Indicator (Optional Visual) */}
                           {log.type === 'ai' && (
                              <div className="hidden sm:flex items-center gap-1 text-[9px] font-bold text-primary uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                 <CheckCircle2 size={12} /> Processado
                              </div>
                           )}
                        </div>
                     </div>
                  );
               })
            )}
         </div>

      </div>
    </div>
  );
};
