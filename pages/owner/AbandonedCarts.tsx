
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ShoppingCart, 
  MessageCircle, 
  Trash2, 
  Clock, 
  User, 
  Smartphone, 
  ExternalLink,
  Zap,
  Sparkles,
  Calendar
} from 'lucide-react';
import { Button } from '../../components/Button';
import { useToast } from '../../components/Toast';

interface AbandonedCart {
  id: string;
  client: string;
  phone: string;
  serviceName: string;
  date: string;
  time: string;
  timestamp: string;
}

export const OwnerAbandonedCarts: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [carts, setCarts] = useState<AbandonedCart[]>([]);

  useEffect(() => {
    const loadCarts = () => {
      const stored = localStorage.getItem('beauty_abandoned_list');
      if (stored) setCarts(JSON.parse(stored));
      else {
        // Seed demo se estiver vazio
        const demo = [
          { id: '1', client: 'Rita Fonseca', phone: '912345678', serviceName: 'Unhas de Gel', date: '2024-03-25', time: '10:00', timestamp: new Date(Date.now() - 3600000).toISOString() },
          { id: '2', client: 'Sónia Meira', phone: '934567890', serviceName: 'Extensão de Pestanas', date: '2024-03-26', time: '14:30', timestamp: new Date(Date.now() - 7200000).toISOString() },
        ];
        localStorage.setItem('beauty_abandoned_list', JSON.stringify(demo));
        setCarts(demo);
      }
    };
    loadCarts();
  }, []);

  const handleDelete = (id: string) => {
    const updated = carts.filter(c => c.id !== id);
    setCarts(updated);
    localStorage.setItem('beauty_abandoned_list', JSON.stringify(updated));
    showToast('info', 'Removido', 'Carrinho eliminado do registo.');
  };

  const handleRecover = (cart: AbandonedCart) => {
    const message = `Olá ${cart.client.split(' ')[0]}! Notamos que estavas a marcar ${cart.serviceName} para dia ${cart.date} às ${cart.time} mas não chegaste a concluir. Ainda tens interesse? O lugar ainda está reservado por pouco tempo! ✨`;
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/351${cart.phone}?text=${encoded}`, '_blank');
    showToast('ai', 'Ação Registada', 'Convite de recuperação enviado via WhatsApp.');
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 animate-fade-in pb-32">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
           <button onClick={() => navigate('/owner/dashboard')} className="mb-4 text-muted hover:text-white flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-all group">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Dashboard
           </button>
           <h1 className="text-3xl font-black text-white tracking-tighter flex items-center gap-3">
              Carrinhos <span className="text-primary italic">Abandonados</span> <ShoppingCart className="text-primary" size={28} />
           </h1>
           <p className="text-muted font-medium text-sm">Clientes que pararam no checkout. Recupere-as com um clique.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {carts.length === 0 ? (
          <div className="py-24 text-center border border-dashed border-border rounded-[2.5rem] bg-surface/30">
             <Sparkles size={48} className="mx-auto text-zinc-800 mb-6" />
             <p className="text-[11px] font-black uppercase text-muted tracking-widest">Sem desistências recentes</p>
          </div>
        ) : (
          carts.map(cart => (
            <div key={cart.id} className="bg-surface p-6 rounded-[2rem] border border-white/5 hover:border-primary/20 transition-all flex flex-col md:flex-row items-center justify-between gap-6 group shadow-sm">
               <div className="flex items-center gap-6 w-full md:w-auto">
                  <div className="w-16 h-16 rounded-2xl bg-background border border-white/10 flex items-center justify-center text-primary">
                     <User size={24} />
                  </div>
                  <div>
                     <h3 className="text-lg font-black text-white uppercase italic tracking-tight mb-1">{cart.client}</h3>
                     <div className="flex flex-wrap gap-4 text-[10px] font-black uppercase tracking-widest text-muted">
                        <span className="flex items-center gap-1.5"><Smartphone size={12} className="text-primary" /> {cart.phone}</span>
                        <span className="flex items-center gap-1.5"><Clock size={12} className="text-zinc-600" /> {new Date(cart.timestamp).toLocaleTimeString()}</span>
                     </div>
                  </div>
               </div>

               <div className="bg-background/50 px-6 py-4 rounded-2xl border border-white/5 flex-grow max-w-sm">
                  <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1.5 italic">Tentativa de Marcação</p>
                  <p className="text-xs font-bold text-zinc-300 uppercase leading-none">{cart.serviceName}</p>
                  <p className="text-[11px] text-primary font-black uppercase tracking-tighter mt-2">{cart.date} • {cart.time}</p>
               </div>

               <div className="flex gap-2 w-full md:w-auto">
                  <button 
                    onClick={() => handleRecover(cart)}
                    className="flex-grow md:flex-none bg-emerald-500 text-background px-8 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-emerald-500/10 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={16} /> Recuperar
                  </button>
                  <button 
                    onClick={() => handleDelete(cart.id)}
                    className="p-4 bg-white/5 hover:bg-red-500/10 text-muted hover:text-red-400 rounded-xl border border-white/5 transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
               </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
