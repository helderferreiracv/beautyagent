
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Megaphone, Bell, Sparkles, AlertTriangle, CheckCircle2, Clock, Trash2, Check } from 'lucide-react';
import { useToast } from '../../components/Toast';

type MsgType = 'admin' | 'alert' | 'ai' | 'waiting' | 'info';

interface Message {
  id: string;
  type: MsgType;
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
}

export const OwnerMessages: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = () => {
    const logs = JSON.parse(localStorage.getItem('beauty_logs_db') || '[]');
    const readIds = JSON.parse(localStorage.getItem('beauty_read_messages') || '[]');
    const broadcast = localStorage.getItem('beauty_global_broadcast');

    const mappedMessages: Message[] = [];

    // 1. Broadcast Global (Admin)
    if (broadcast) {
       // Hash simples do conteúdo para ID
       const bId = 'global_broadcast_' + broadcast.length;
       mappedMessages.push({
          id: bId,
          type: 'admin',
          title: 'Mensagem da Administração',
          body: broadcast,
          timestamp: new Date().toISOString(), // Sempre topo
          read: readIds.includes(bId)
       });
    }

    // 2. Logs convertidos em Mensagens
    logs.forEach((log: any) => {
       let type: MsgType = 'info';
       let title = log.message;
       
       // Detectar tipo baseado no log type e conteúdo
       if (log.type === 'alert' || log.message.toLowerCase().includes('no-show')) type = 'alert';
       else if (log.type === 'ai') type = 'ai';
       else if (log.message.toLowerCase().includes('lista de espera')) {
          type = 'waiting';
          title = 'Pedido Lista de Espera';
       }

       // Filtrar apenas logs relevantes para a Inbox
       if (['alert', 'ai', 'client'].includes(log.type)) {
          mappedMessages.push({
             id: log.id,
             type,
             title,
             body: log.details || 'Sem detalhes adicionais.',
             timestamp: log.timestamp,
             read: readIds.includes(log.id)
          });
       }
    });

    setMessages(mappedMessages);
  };

  const handleMarkRead = (id: string) => {
    const readIds = JSON.parse(localStorage.getItem('beauty_read_messages') || '[]');
    if (!readIds.includes(id)) {
       const updated = [...readIds, id];
       localStorage.setItem('beauty_read_messages', JSON.stringify(updated));
       
       // Update local state
       setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
    }
  };

  const handleMarkAllRead = () => {
    const allIds = messages.map(m => m.id);
    const currentRead = JSON.parse(localStorage.getItem('beauty_read_messages') || '[]');
    const uniqueIds = Array.from(new Set([...currentRead, ...allIds]));
    
    localStorage.setItem('beauty_read_messages', JSON.stringify(uniqueIds));
    setMessages(prev => prev.map(m => ({ ...m, read: true })));
    showToast('success', 'Tudo limpo', 'Todas as mensagens marcadas como lidas.');
  };

  const handleDeleteBroadcast = () => {
     localStorage.removeItem('beauty_global_broadcast');
     loadMessages();
     showToast('info', 'Removido', 'Aviso global removido.');
  };

  const getIcon = (type: MsgType) => {
     switch(type) {
        case 'admin': return <Megaphone size={18} className="text-white" />;
        case 'alert': return <AlertTriangle size={18} className="text-red-400" />;
        case 'ai': return <Sparkles size={18} className="text-primary" />;
        case 'waiting': return <Clock size={18} className="text-blue-400" />;
        default: return <Bell size={18} className="text-zinc-400" />;
     }
  };

  const getColors = (type: MsgType) => {
     switch(type) {
        case 'admin': return 'bg-gradient-to-r from-purple-600 to-blue-600 border-white/10';
        case 'alert': return 'bg-red-500/10 border-red-500/20';
        case 'ai': return 'bg-primary/5 border-primary/20';
        case 'waiting': return 'bg-blue-500/10 border-blue-500/20';
        default: return 'bg-surface border-white/5';
     }
  };

  const displayedMessages = filter === 'unread' ? messages.filter(m => !m.read) : messages;

  return (
    <div className="min-h-screen bg-background pb-32">
      
      {/* HEADER */}
      <div className="sticky top-0 z-30 bg-[#1a1a1c]/90 backdrop-blur-xl border-b border-white/5 px-6 py-6 md:px-12">
         <div className="max-w-3xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-4">
               <button onClick={() => navigate('/owner/dashboard')} className="p-2.5 bg-surface border border-white/5 rounded-xl text-zinc-400 hover:text-white transition-colors">
                  <ArrowLeft size={18} />
               </button>
               <div>
                  <h1 className="text-2xl font-black italic uppercase tracking-tighter text-white flex items-center gap-2">
                     Notificações <MessageSquare className="text-primary" size={20} />
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
                     <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Centro de Mensagens</p>
                     {messages.filter(m => !m.read).length > 0 && (
                        <span className="bg-primary text-black text-[9px] font-black px-2 py-0.5 rounded-full">{messages.filter(m => !m.read).length} Novas</span>
                     )}
                  </div>
               </div>
            </div>
            
            <div className="flex gap-2">
               <button 
                  onClick={() => setFilter(filter === 'all' ? 'unread' : 'all')}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${filter === 'unread' ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-transparent border-white/10 text-zinc-500 hover:text-white'}`}
               >
                  {filter === 'unread' ? 'Ver Todas' : 'Apenas Não Lidas'}
               </button>
               <button 
                  onClick={handleMarkAllRead}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-zinc-400 hover:text-white text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2"
               >
                  <CheckCircle2 size={14} /> Marcar Lidas
               </button>
            </div>
         </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 md:px-12 py-8 animate-fade-in space-y-4">
         
         {displayedMessages.length === 0 ? (
            <div className="py-20 text-center border border-dashed border-white/10 rounded-[2.5rem] bg-surface/20">
               <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5 text-zinc-700">
                  <Check size={24} />
               </div>
               <p className="text-xs font-bold text-zinc-600 uppercase tracking-widest">Tudo limpo por aqui.</p>
            </div>
         ) : (
            displayedMessages.map(msg => (
               <div 
                  key={msg.id} 
                  onClick={() => handleMarkRead(msg.id)}
                  className={`
                     relative p-5 rounded-2xl border transition-all cursor-pointer group hover:scale-[1.01] active:scale-[0.99]
                     ${getColors(msg.type)}
                     ${msg.read ? 'opacity-60 grayscale-[0.5]' : 'opacity-100 shadow-lg'}
                  `}
               >
                  {!msg.read && <div className="absolute top-5 right-5 w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_8px_#ebff57]"></div>}
                  
                  <div className="flex gap-4 items-start">
                     <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-black/20 backdrop-blur-sm`}>
                        {getIcon(msg.type)}
                     </div>
                     <div className="flex-grow min-w-0 pr-6">
                        <div className="flex justify-between items-start mb-1">
                           <h3 className="text-sm font-bold text-white uppercase tracking-tight truncate">{msg.title}</h3>
                           <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest whitespace-nowrap ml-2">
                              {new Date(msg.timestamp).toLocaleDateString('pt-PT', {day:'2-digit', month:'2-digit'})}
                           </span>
                        </div>
                        <p className="text-xs text-zinc-300 font-medium leading-relaxed">{msg.body}</p>
                     </div>
                  </div>

                  {/* Ação especial para Broadcast Admin */}
                  {msg.type === 'admin' && (
                     <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                           onClick={(e) => { e.stopPropagation(); handleDeleteBroadcast(); }}
                           className="p-2 bg-black/20 hover:bg-black/40 rounded-lg text-white/50 hover:text-white transition-colors"
                           title="Dispensar Aviso"
                        >
                           <Trash2 size={14} />
                        </button>
                     </div>
                  )}
               </div>
            ))
         )}

      </div>
    </div>
  );
};
