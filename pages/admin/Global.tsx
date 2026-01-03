
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Building2, 
  Users, 
  CreditCard, 
  Activity, 
  Search, 
  Power, 
  Sparkles, 
  Plus, 
  LogOut, 
  ChevronRight,
  TrendingUp,
  ExternalLink,
  Crown,
  Globe,
  Zap,
  Server,
  Megaphone,
  X,
  Calendar,
  Smartphone,
  Check,
  Ban,
  MessageSquarePlus,
  ArrowUpRight
} from 'lucide-react';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { useToast } from '../../components/Toast';

type SubscriptionType = 'Trial' | 'Mensal' | 'Anual' | 'VIP';

interface SalonInstance {
  id: string;
  name: string;
  ownerPhone: string;
  regDate: string;
  status: 'Ativo' | 'Suspenso';
  subType: SubscriptionType;
  trialStart?: string;
  globalBookings: number;
}

const INITIAL_DATA: SalonInstance[] = [
  { id: 's1', name: 'Elite Glamour Lisboa', ownerPhone: '912345678', regDate: '2023-12-10', status: 'Ativo', subType: 'Mensal', globalBookings: 1450 },
  { id: 's2', name: 'Studio Nails Porto', ownerPhone: '934567890', regDate: '2024-01-15', status: 'Ativo', subType: 'Anual', globalBookings: 890 },
  { id: 's3', name: 'Beauty Space Braga', ownerPhone: '966778899', regDate: '2024-03-20', status: 'Ativo', subType: 'Trial', trialStart: new Date(Date.now() - 86400000 * 3).toISOString(), globalBookings: 45 },
  { id: 's4', name: 'Rosa Chic Algarve', ownerPhone: '911222333', regDate: '2024-02-10', status: 'Suspenso', subType: 'Mensal', globalBookings: 120 },
  { id: 's5', name: 'Beleza Pura VIP', ownerPhone: '922444666', regDate: '2023-11-20', status: 'Ativo', subType: 'VIP', globalBookings: 2150 },
];

export const AdminGlobal: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [salons, setSalons] = useState<SalonInstance[]>(INITIAL_DATA);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modais
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [newSalon, setNewSalon] = useState({ name: '', ownerPhone: '', subType: 'Trial' as SubscriptionType });
  const [broadcastMsg, setBroadcastMsg] = useState('');

  useEffect(() => {
    const auth = sessionStorage.getItem('admin_auth');
    if (!auth) navigate('/');
  }, [navigate]);

  const stats = useMemo(() => {
    const active = salons.filter(s => s.status === 'Ativo');
    const mrr = active.reduce((acc, s) => {
      if (s.subType === 'VIP' || s.subType === 'Trial') return acc;
      return acc + (s.subType === 'Anual' ? 490 / 12 : 49);
    }, 0);
    const totalBookings = salons.reduce((acc, s) => acc + s.globalBookings, 0);
    return {
      total: salons.length,
      active: active.length,
      mrr,
      bookings: totalBookings
    };
  }, [salons]);

  const calculateTrialDays = (startDate?: string) => {
    if (!startDate) return 0;
    const diff = Date.now() - new Date(startDate).getTime();
    const remaining = 7 - Math.floor(diff / (1000 * 60 * 60 * 24));
    return Math.max(0, remaining);
  };

  const handleToggleVIP = (id: string) => {
    setSalons(prev => prev.map(s => {
      if (s.id === id) {
        const isCurrentlyVIP = s.subType === 'VIP';
        const nextSub: SubscriptionType = isCurrentlyVIP ? 'Mensal' : 'VIP';
        showToast('ai', nextSub === 'VIP' ? 'Upgrade VIP' : 'Subscrição Standard', `${s.name} atualizado.`);
        return { ...s, subType: nextSub };
      }
      return s;
    }));
  };

  const handleToggleSuspend = (id: string) => {
    setSalons(prev => prev.map(s => {
      if (s.id === id) {
        const nextStatus = s.status === 'Suspenso' ? 'Ativo' : 'Suspenso';
        showToast(nextStatus === 'Suspenso' ? 'error' : 'success', 'Estado Alterado', `${s.name} está agora ${nextStatus}.`);
        return { ...s, status: nextStatus as any };
      }
      return s;
    }));
  };

  const handleAddSalon = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `s${salons.length + 1}`;
    const entry: SalonInstance = {
      id,
      name: newSalon.name,
      ownerPhone: newSalon.ownerPhone,
      regDate: new Date().toISOString().split('T')[0],
      status: 'Ativo',
      subType: newSalon.subType,
      trialStart: newSalon.subType === 'Trial' ? new Date().toISOString() : undefined,
      globalBookings: 0
    };
    setSalons([entry, ...salons]);
    setIsAddModalOpen(false);
    showToast('success', 'Instância Criada', `${entry.name} foi adicionado ao ecossistema.`);
  };

  const handleSendBroadcast = () => {
    if (!broadcastMsg.trim()) return;
    localStorage.setItem('beauty_global_broadcast', broadcastMsg);
    showToast('success', 'Broadcast Enviado', 'Mensagem enviada para todos os painéis owner.');
    setIsBroadcastModalOpen(false);
    setBroadcastMsg('');
  };

  const filtered = salons.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.ownerPhone.includes(searchTerm)
  );

  return (
    <div className="max-w-7xl mx-auto pb-40 px-4 animate-fade-in">
      {/* HEADER ESTRATÉGICO */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-8 py-10">
        <div className="flex items-center gap-5">
           <div className="p-4 bg-primary/10 rounded-[1.5rem] border border-primary/20 shadow-2xl">
              <Server size={28} className="text-primary" />
           </div>
           <div>
              <div className="flex items-center gap-2 mb-1">
                <Globe size={12} className="text-muted" />
                <span className="text-[11px] font-black text-muted uppercase tracking-[0.3em]">Orquestrador Global SaaS</span>
              </div>
              <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">Console Master</h1>
           </div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setIsBroadcastModalOpen(true)} className="px-6 py-4 bg-surface border border-border rounded-2xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-zinc-800 transition-all flex items-center gap-2">
            <Megaphone size={16} /> Broadcast
          </button>
          <button onClick={() => setIsAddModalOpen(true)} className="px-6 py-4 bg-primary text-background rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all flex items-center gap-2">
            <Plus size={16} strokeWidth={3} /> Adicionar Salão
          </button>
        </div>
      </div>

      {/* KPI GRID SAAS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {[
          { label: 'Total Salões', value: stats.total, icon: Building2, color: 'text-white' },
          { label: 'Receita MRR', value: `${stats.mrr.toFixed(0)}€`, icon: CreditCard, color: 'text-emerald-400' },
          { label: 'Marcações Globais', value: stats.bookings, icon: Activity, color: 'text-primary' },
          { label: 'Crescimento', value: '+12%', icon: ArrowUpRight, color: 'text-blue-400' },
        ].map((kpi, idx) => (
          <div key={idx} className="bg-surface border border-white/5 p-6 rounded-[2.2rem] shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
               <kpi.icon size={40} />
            </div>
            <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-2">{kpi.label}</p>
            <h3 className={`text-3xl font-black italic tracking-tighter ${kpi.color}`}>{kpi.value}</h3>
          </div>
        ))}
      </div>

      {/* LISTA DE SALÕES */}
      <div className="bg-surface border border-white/5 rounded-[2.8rem] overflow-hidden shadow-2xl">
         <div className="p-8 border-b border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6 bg-zinc-900/30">
            <div className="flex items-center gap-3">
               <Zap size={16} className="text-primary" />
               <h2 className="text-[11px] font-black text-white uppercase tracking-[0.3em] italic">Instâncias Ativas</h2>
            </div>
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700" size={16} />
              <input 
                type="text" 
                placeholder="NOME OU TELEMÓVEL..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="w-full bg-background border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-[10px] font-black text-white placeholder-zinc-800 outline-none uppercase tracking-widest focus:border-primary/40" 
              />
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-zinc-900/50">
                     <th className="px-8 py-5 text-[10px] font-black text-muted uppercase tracking-widest">Salão / Dono</th>
                     <th className="px-8 py-5 text-[10px] font-black text-muted uppercase tracking-widest">Registo</th>
                     <th className="px-8 py-5 text-[10px] font-black text-muted uppercase tracking-widest">Subscrição</th>
                     <th className="px-8 py-5 text-[10px] font-black text-muted uppercase tracking-widest text-center">Estado</th>
                     <th className="px-8 py-5 text-[10px] font-black text-muted uppercase tracking-widest text-right">Ações</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                  {filtered.map(salon => (
                     <tr key={salon.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-4">
                              <div className={`w-12 h-12 rounded-2xl bg-background border border-white/5 flex items-center justify-center font-black italic text-lg ${salon.subType === 'VIP' ? 'text-amber-500' : 'text-primary'}`}>
                                 {salon.subType === 'VIP' ? <Crown size={20} /> : salon.name.charAt(0)}
                              </div>
                              <div>
                                 <span className="text-sm font-black text-white block leading-none mb-1.5 uppercase italic tracking-tight">{salon.name}</span>
                                 <span className="text-[10px] text-muted font-bold uppercase tracking-widest flex items-center gap-1.5"><Smartphone size={10}/> {salon.ownerPhone}</span>
                              </div>
                           </div>
                        </td>
                        <td className="px-8 py-6">
                           <span className="text-[11px] text-zinc-400 font-bold uppercase tracking-tighter">{new Date(salon.regDate).toLocaleDateString('pt-PT')}</span>
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex flex-col gap-1">
                              <span className={`text-[9px] font-black px-2 py-1 rounded-lg uppercase tracking-widest w-fit border ${
                                 salon.subType === 'VIP' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                 salon.subType === 'Trial' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              }`}>
                                 {salon.subType === 'VIP' ? 'VIP ISENTO' : salon.subType}
                              </span>
                              {salon.subType === 'Trial' && (
                                 <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-tight ml-1">
                                    {calculateTrialDays(salon.trialStart)} dias restantes
                                 </span>
                              )}
                           </div>
                        </td>
                        <td className="px-8 py-6 text-center">
                           <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                              salon.status === 'Ativo' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
                           }`}>
                              {salon.status}
                           </span>
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex items-center justify-end gap-2">
                              <button onClick={() => handleToggleVIP(salon.id)} title="Toggle VIP" className={`p-2.5 rounded-xl border transition-all ${salon.subType === 'VIP' ? 'bg-amber-500 text-background' : 'bg-white/5 border-white/5 text-muted hover:text-amber-500'}`}><Crown size={16} /></button>
                              <button onClick={() => handleToggleSuspend(salon.id)} title="Suspender/Ativar" className={`p-2.5 rounded-xl border transition-all ${salon.status === 'Suspenso' ? 'bg-red-500 text-white' : 'bg-white/5 border-white/5 text-muted hover:text-red-500'}`}><Ban size={16} /></button>
                              <button onClick={() => navigate('/owner/dashboard')} title="Entrar no Salão" className="p-2.5 bg-white/5 border border-white/5 rounded-xl text-muted hover:text-white transition-all"><ExternalLink size={16} /></button>
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>

      {/* MODAL ADICIONAR SALÃO */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-background/98 backdrop-blur-xl animate-fade-in" onClick={() => setIsAddModalOpen(false)}></div>
           <div className="bg-surface w-full max-w-md rounded-[3rem] p-10 border border-white/10 shadow-2xl relative animate-in zoom-in-95 max-h-[85vh] overflow-y-auto pb-40">
              <div className="flex justify-between items-center mb-8">
                 <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">Novo Salão Manual</h3>
                 <button onClick={() => setIsAddModalOpen(false)} className="p-2 text-muted hover:text-white"><X size={24}/></button>
              </div>
              <form onSubmit={handleAddSalon} className="space-y-6">
                 <Input label="Nome do Estabelecimento" required value={newSalon.name} onChange={e => setNewSalon({...newSalon, name: e.target.value})} placeholder="EX: STUDIO ELITE..." />
                 <Input label="Telemóvel do Dono" required value={newSalon.ownerPhone} onChange={e => setNewSalon({...newSalon, ownerPhone: e.target.value})} placeholder="9XXXXXXXX" />
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Nível de Subscrição</label>
                    <select 
                      value={newSalon.subType}
                      onChange={e => setNewSalon({...newSalon, subType: e.target.value as SubscriptionType})}
                      className="w-full bg-background border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-primary outline-none appearance-none font-bold uppercase text-[11px] tracking-widest"
                    >
                      <option value="Trial">Trial (7 dias)</option>
                      <option value="Mensal">Plano Mensal</option>
                      <option value="Anual">Plano Anual</option>
                      <option value="VIP">VIP Isento</option>
                    </select>
                 </div>
                 <Button fullWidth type="submit" className="py-5 shadow-xl">Ativar Instância</Button>
              </form>
           </div>
        </div>
      )}

      {/* MODAL BROADCAST */}
      {isBroadcastModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-background/98 backdrop-blur-xl animate-fade-in" onClick={() => setIsBroadcastModalOpen(false)}></div>
           <div className="bg-surface w-full max-w-md rounded-[3rem] p-10 border border-white/10 shadow-2xl relative animate-in zoom-in-95 max-h-[85vh] overflow-y-auto pb-40">
              <div className="flex justify-between items-center mb-8">
                 <div className="flex items-center gap-3">
                    <Megaphone className="text-primary" size={24} />
                    <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">Mensagem Global</h3>
                 </div>
                 <button onClick={() => setIsBroadcastModalOpen(false)} className="p-2 text-muted hover:text-white"><X size={24}/></button>
              </div>
              <div className="space-y-6">
                 <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Conteúdo do Aviso</label>
                    <textarea 
                      className="bg-background border border-white/10 rounded-2xl p-5 text-white placeholder-zinc-800 outline-none focus:border-primary/40 min-h-[150px] font-bold text-sm"
                      placeholder="ESCREVA AQUI O AVISO PARA TODOS OS SALÕES..."
                      value={broadcastMsg}
                      onChange={e => setBroadcastMsg(e.target.value)}
                    />
                 </div>
                 <Button fullWidth onClick={handleSendBroadcast}>Transmitir para Rede</Button>
                 <p className="text-[9px] text-zinc-600 font-bold uppercase text-center tracking-widest">Este aviso aparecerá no topo do dashboard de cada salão ativo.</p>
              </div>
           </div>
        </div>
      )}

      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 text-center opacity-30 pointer-events-none">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 italic">BeautyAgent Enterprise Infrastructure • v2.6.4</p>
      </div>
    </div>
  );
};
