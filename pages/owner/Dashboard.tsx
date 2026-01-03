
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Bell, 
  LayoutGrid, 
  Calendar as CalendarIcon, 
  Users, 
  Sparkles, 
  Settings, 
  HelpCircle, 
  MessageSquare,
  TrendingUp,
  TrendingDown,
  Clock,
  LogOut,
  MapPin,
  ChevronDown,
  Monitor,
  Trash2,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { useBeautyData } from '../../hooks/useBeautyData';

// --- COMPONENTS ---

const SidebarLink = ({ icon: Icon, label, active = false, onClick, count }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center justify-between px-6 py-4 transition-all duration-200 border-l-2 group
      ${active 
        ? 'border-primary bg-surface text-white' 
        : 'border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.02]'
      }`}
  >
    <div className="flex items-center gap-4">
      <Icon size={18} strokeWidth={active ? 2.5 : 2} className={active ? 'text-primary' : 'group-hover:text-zinc-300'} />
      <span className={`text-[13px] font-medium tracking-wide ${active ? 'font-bold' : ''}`}>{label}</span>
    </div>
    {count > 0 && (
      <span className="bg-primary text-black text-[9px] font-black px-2 py-0.5 rounded-full shadow-[0_0_10px_rgba(235,255,87,0.4)]">
        {count}
      </span>
    )}
  </button>
);

const KPICard = ({ title, value, change, isPositive, prefix = '' }: any) => (
  <div className="bg-surface p-6 rounded-[2rem] border border-white/5 relative overflow-hidden group hover:border-primary/20 transition-all shadow-lg">
    <div className="relative z-10">
      <h3 className="text-3xl font-black text-white mb-2 tracking-tighter">{prefix}{value}</h3>
      <div className="flex items-center justify-between">
        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">{title}</p>
        <span className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-lg ${isPositive ? 'text-primary bg-primary/10' : 'text-zinc-500 bg-white/5'}`}>
          {isPositive ? <TrendingUp size={12} /> : null}
          {change}
        </span>
      </div>
    </div>
    {/* Glow Effect */}
    <div className="absolute -top-10 -right-10 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all"></div>
  </div>
);

// Cores Fixas para Staff no Widget
const STAFF_THEMES: Record<string, string> = {
  rose: 'border-rose-500 bg-rose-500/10 text-rose-400',
  blue: 'border-blue-500 bg-blue-500/10 text-blue-400',
  emerald: 'border-emerald-500 bg-emerald-500/10 text-emerald-400',
  purple: 'border-purple-500 bg-purple-500/10 text-purple-400',
  amber: 'border-amber-500 bg-amber-500/10 text-amber-400',
  cyan: 'border-cyan-500 bg-cyan-500/10 text-cyan-400'
};

export const OwnerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { bookings, staff, stats, isDemo, clearDemoData } = useBeautyData();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [unreadCount, setUnreadCount] = useState(0);
  const [showTutorial, setShowTutorial] = useState(false);
  
  // Time slots reduced for dashboard widget (09:00 - 18:00)
  const timeSlots = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];

  useEffect(() => {
    // Check Tutorial Status
    const tutorialSeen = localStorage.getItem('beauty_owner_tutorial_seen');
    if (!tutorialSeen) {
       setShowTutorial(true);
    }

    // Polling function for real-time updates without WebSockets
    const checkNotifications = () => {
      const logs = JSON.parse(localStorage.getItem('beauty_logs_db') || '[]');
      const readIds = JSON.parse(localStorage.getItem('beauty_read_messages') || '[]');
      const broadcast = localStorage.getItem('beauty_global_broadcast');
      
      const relevantLogs = logs.filter((l: any) => 
        ['alert', 'ai', 'client'].includes(l.type)
      );
      
      const unreadLogs = relevantLogs.filter((l: any) => !readIds.includes(l.id)).length;
      const total = unreadLogs + (broadcast ? 1 : 0);
      setUnreadCount(total);
    };

    checkNotifications(); 
    const intervalId = setInterval(checkNotifications, 3000); 

    return () => clearInterval(intervalId);
  }, []);

  const handleClearDemo = () => {
     if(confirm("ATENÇÃO: Isto apagará todos os dados de demonstração (clientes, staff, marcações) para iniciar o uso real. Deseja continuar?")) {
        clearDemoData();
     }
  };

  const completeTutorial = (path?: string) => {
     localStorage.setItem('beauty_owner_tutorial_seen', 'true');
     setShowTutorial(false);
     if (path) navigate(path);
  };

  const displayStaff = useMemo(() => {
    return staff.length > 0 ? staff.slice(0, 4) : [];
  }, [staff]);

  const todayBookings = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return bookings.filter(b => b.date === today && b.status !== 'cancelled');
  }, [bookings]);

  const upcomingList = useMemo(() => {
    return bookings.length > 0 ? bookings.filter(b => b.status === 'confirmed').slice(0, 5) : [];
  }, [bookings]);

  return (
    <div className="flex h-full w-full bg-background font-sans text-text overflow-hidden">
      
      {/* 1. SIDEBAR */}
      <aside className="w-72 bg-[#151516] border-r border-white/5 flex flex-col shrink-0 z-30 hidden md:flex">
        <div className="h-24 flex items-center px-8">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary border border-primary/20">
               <Sparkles size={16} />
             </div>
             <div>
                <span className="text-lg font-black text-white tracking-tighter italic uppercase block leading-none">Beauty</span>
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em]">Agent</span>
             </div>
          </div>
        </div>

        <nav className="flex-1 py-6 space-y-1 overflow-y-auto scrollbar-hide">
          <SidebarLink icon={LayoutGrid} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <SidebarLink icon={CalendarIcon} label="Agenda" onClick={() => navigate('/owner/agenda')} />
          <SidebarLink icon={Users} label="Clientes" onClick={() => navigate('/owner/clients')} />
          <SidebarLink icon={Users} label="Equipa" onClick={() => navigate('/owner/staff')} />
          <SidebarLink icon={Sparkles} label="Serviços" onClick={() => navigate('/owner/services')} />
          <SidebarLink icon={TrendingUp} label="Relatórios" onClick={() => navigate('/owner/reports')} />
          <SidebarLink icon={Settings} label="Definições" onClick={() => navigate('/owner/settings')} />
          
          <div className="pt-8 px-6 pb-2">
            <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-2">Suporte</p>
          </div>
          <SidebarLink icon={HelpCircle} label="Ajuda" onClick={() => navigate('/owner/help')} />
          <SidebarLink icon={MessageSquare} label="Mensagens" onClick={() => navigate('/owner/messages')} count={unreadCount} />
        </nav>

        <div className="p-6 border-t border-white/5 space-y-3">
           {isDemo && (
             <button onClick={handleClearDemo} className="flex items-center gap-3 text-red-400 hover:text-red-300 transition-colors text-xs font-bold uppercase tracking-widest w-full bg-red-500/10 p-3 rounded-xl border border-red-500/20">
                <Trash2 size={16} /> Limpar Demo
             </button>
           )}
           <button onClick={() => navigate('/')} className="flex items-center gap-3 text-zinc-500 hover:text-primary transition-colors text-xs font-bold uppercase tracking-widest w-full pl-2">
              <LogOut size={16} /> Sair
           </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 bg-background relative">
        
        {/* MOBILE BANNER */}
        <div className="md:hidden bg-[#151516] border-b border-white/5 px-6 pt-6 pb-2">
           <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-rose-500/20 rounded-lg text-rose-400"><Monitor size={14} /></div>
                 <div>
                    <p className="text-[10px] font-black text-rose-300 uppercase tracking-widest">Mobile Simplificado</p>
                    <p className="text-[9px] text-rose-400/70 font-medium">Relatórios e gestão completa apenas no Desktop.</p>
                 </div>
              </div>
           </div>
        </div>

        {/* HEADER */}
        <header className="h-24 px-8 flex items-center justify-between shrink-0 bg-[#1a1a1c] border-b border-white/5">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tighter italic uppercase">Dashboard</h1>
            <div className="flex items-center gap-2 mt-1">
               <MapPin size={10} className="text-primary"/>
               <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                  {isDemo ? 'Modo Demonstração' : 'Modo Real • Produção'}
               </p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative hidden lg:block group">
              <input 
                type="text" 
                placeholder="Procurar..." 
                className="bg-[#151516] border border-white/5 rounded-2xl pl-5 pr-12 py-3 text-xs font-bold text-white focus:border-primary/50 outline-none w-72 placeholder-zinc-600 transition-all uppercase tracking-wider"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 group-hover:text-primary transition-colors" size={16} />
            </div>
            
            <button 
              onClick={() => navigate('/owner/messages')}
              className="p-3 bg-[#151516] border border-white/5 rounded-2xl text-zinc-400 hover:text-primary transition-colors relative active:scale-95"
              title="Ver Mensagens"
            >
              <Bell size={20} />
              {unreadCount > 0 && <span className="absolute top-3 right-3 w-2 h-2 bg-primary rounded-full border-2 border-[#151516] animate-pulse"></span>}
            </button>
          </div>
        </header>

        {/* SCROLLABLE DASHBOARD */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-32 md:pb-8 scrollbar-hide bg-[#151516]">
          <div className="max-w-[1600px] mx-auto space-y-8">
            
            {/* ROW 1: KPIs REAIS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <KPICard title="Total Clientes" value={stats.totalClients} change="Base Real" isPositive={stats.totalClients > 0} />
              <KPICard title="Receita (Mês)" value={stats.monthlyRevenue} prefix="€" change="Realizado" isPositive={stats.monthlyRevenue > 0} />
              <KPICard title="Marcações Hoje" value={stats.todayBookingsCount} change="Agenda" isPositive={stats.todayBookingsCount > 0} />
            </div>

            {/* ROW 2: MAIN GRID */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              
              {/* LEFT COLUMN: AGENDA WIDGET */}
              <div className="hidden md:flex xl:col-span-2 flex-col h-[650px]">
                 <div className="bg-surface rounded-[2.5rem] border border-white/5 flex flex-col h-full relative overflow-hidden shadow-xl">
                    <div className="flex justify-between items-center p-8 border-b border-white/5">
                       <h3 className="text-lg font-black text-white italic tracking-tight uppercase">Visão Geral Hoje</h3>
                       <button onClick={() => navigate('/owner/agenda')} className="text-[10px] font-bold text-zinc-500 hover:text-white uppercase tracking-widest transition-colors">
                          Ver Detalhes
                       </button>
                    </div>

                    <div className="flex-1 overflow-y-auto overflow-x-auto scrollbar-thin relative">
                       {displayStaff.length === 0 ? (
                          <div className="flex flex-col items-center justify-center h-full text-zinc-500">
                             <Users size={32} className="mb-4 opacity-50"/>
                             <p className="text-xs font-bold uppercase tracking-widest">Sem equipa configurada.</p>
                             <button onClick={() => navigate('/owner/staff')} className="text-primary text-[10px] font-black uppercase mt-2 hover:underline">Adicionar Staff</button>
                          </div>
                       ) : (
                         <div className="flex min-w-full">
                            {/* Coluna Horas */}
                            <div className="w-14 flex-shrink-0 border-r border-white/5 bg-[#1a1a1c] sticky left-0 z-20 pt-8">
                               {timeSlots.map(time => (
                                  <div key={time} className="h-20 text-center text-[9px] font-black text-zinc-600">
                                     {time}
                                  </div>
                               ))}
                            </div>

                            {/* Colunas Staff */}
                            {displayStaff.map((s: any) => (
                               <div key={s.id} className="flex-1 min-w-[140px] border-r border-white/5 last:border-r-0 pt-8">
                                  <div className="text-center mb-4 sticky top-0 bg-surface z-10 pb-2 border-b border-white/5 mx-2">
                                     <span className="text-[10px] font-black text-white uppercase tracking-widest">{s.name}</span>
                                  </div>
                                  
                                  {timeSlots.map(time => {
                                     const booking = todayBookings.find((b: any) => 
                                        b.time.startsWith(time.split(':')[0]) && 
                                        (b.proId === s.id || (b.professional?.id === s.id))
                                     );
                                     const theme = STAFF_THEMES[s.color || 'blue'];

                                     return (
                                        <div key={`${s.id}-${time}`} className="h-20 p-1 border-b border-white/5 relative">
                                           {booking ? (
                                              <div className={`w-full h-full rounded-xl border-l-2 p-2 ${theme}`}>
                                                 <p className="text-[9px] font-black uppercase truncate">{booking.client}</p>
                                                 <p className="text-[8px] opacity-70 truncate">{booking.service}</p>
                                              </div>
                                           ) : (
                                              <div className="w-full h-full"></div>
                                           )}
                                        </div>
                                     );
                                  })}
                               </div>
                            ))}
                         </div>
                       )}
                    </div>
                 </div>
              </div>

              {/* RIGHT COLUMN: UPCOMING LIST */}
              <div className="xl:col-span-1 bg-surface rounded-[2.5rem] p-6 md:p-8 border border-white/5 flex flex-col h-auto md:h-[650px] shadow-xl">
                 <div className="flex justify-between items-center mb-8">
                    <h3 className="text-lg font-black text-white italic tracking-tight uppercase">Próximos</h3>
                    <button className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1">
                       Hoje <ChevronDown size={12} />
                    </button>
                 </div>

                 {/* Calendar Strip (Static for UI structure) */}
                 <div className="flex justify-between items-center gap-2 mb-8 overflow-x-auto scrollbar-hide pb-2">
                    {['SEG','TER','QUA','QUI','SEX','SAB','DOM'].map((d, idx) => {
                       const isActive = idx === 4; // Mock active for UI balance
                       return (
                         <div 
                            key={idx} 
                            className={`
                              flex flex-col items-center justify-center min-w-[40px] h-[60px] rounded-xl cursor-pointer transition-all border
                              ${isActive 
                                ? 'bg-primary border-primary text-black shadow-sm' 
                                : 'bg-[#252525] border-transparent text-zinc-500 hover:text-white hover:border-white/10'
                              }
                            `}
                         >
                            <span className={`text-[8px] font-black uppercase mb-0.5 ${isActive ? 'text-black' : 'text-zinc-500'}`}>{d}</span>
                            <span className="text-xs font-black">{idx + 10}</span>
                         </div>
                       );
                    })}
                 </div>

                 {/* List */}
                 <div className="flex-1 overflow-y-auto pr-1 scrollbar-thin space-y-3 min-h-[300px] md:min-h-0">
                    {upcomingList.length === 0 ? (
                       <div className="text-center py-10">
                          <Sparkles className="mx-auto text-zinc-700 mb-2" size={24} />
                          <p className="text-zinc-500 text-xs italic">Sem marcações futuras.</p>
                       </div>
                    ) : (
                       upcomingList.map((app: any) => (
                          <div key={app.id} className="flex items-center justify-between p-3 rounded-2xl bg-[#252525] border border-white/5 hover:border-white/10 transition-colors">
                             <div className="flex items-center gap-3 min-w-0">
                                <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center text-xs font-black text-zinc-600 shrink-0">
                                   {app.client.charAt(0)}
                                </div>
                                <div className="min-w-0">
                                   <h4 className="text-xs font-bold text-white truncate">{app.client}</h4>
                                   <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider truncate">{app.service}</p>
                                </div>
                             </div>
                             <div className="text-right shrink-0 ml-2">
                                <p className="text-[10px] font-bold text-white">{app.time}</p>
                                <p className="text-[9px] text-zinc-600 font-mono">{app.priceValue}€</p>
                             </div>
                          </div>
                       ))
                    )}
                 </div>
                 
                 <button className="w-full mt-6 py-4 rounded-2xl border border-white/10 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-white/5 transition-all">
                    Ver Agenda Completa
                 </button>
              </div>

            </div>

          </div>
        </div>
      </main>

      {/* TUTORIAL MODAL */}
      {showTutorial && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/90 backdrop-blur-md transition-opacity duration-300" onClick={() => completeTutorial()} />
          <div className="bg-surface w-full max-w-3xl rounded-[3rem] p-10 md:p-12 relative z-10 border border-white/10 shadow-2xl animate-in zoom-in-95 duration-300">
             
             <div className="text-center mb-10">
                <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-primary/20 text-primary shadow-[0_0_40px_rgba(235,255,87,0.15)] animate-bounce">
                   <Sparkles size={40} strokeWidth={2} />
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-white uppercase italic tracking-tighter mb-4 leading-none">Bem-vindo ao BeautyAgent!</h2>
                <p className="text-zinc-400 text-sm font-medium max-w-md mx-auto leading-relaxed">
                   A Inteligência que o teu salão merece está pronta. <br/>
                   Vamos configurar o essencial em <span className="text-white">3 passos rápidos</span> para começares a faturar.
                </p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                {/* Step 1 */}
                <button 
                  onClick={() => completeTutorial('/owner/staff')}
                  className="bg-[#202022] p-6 rounded-[2.5rem] border border-white/5 hover:border-rose-500/50 hover:bg-rose-500/5 transition-all group text-left relative overflow-hidden"
                >
                   <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-2xl group-hover:bg-rose-500/10 transition-all"></div>
                   <div className="w-12 h-12 bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-400 mb-4 group-hover:scale-110 transition-transform border border-rose-500/20">
                      <Users size={24} />
                   </div>
                   <h3 className="text-sm font-black text-white uppercase tracking-wide mb-2 italic">1. Equipa</h3>
                   <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider leading-relaxed group-hover:text-zinc-400">Adiciona os teus profissionais e define comissões.</p>
                   <div className="mt-4 flex items-center gap-2 text-[9px] font-black text-rose-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                      Configurar <ArrowRight size={12} />
                   </div>
                </button>

                {/* Step 2 */}
                <button 
                  onClick={() => completeTutorial('/owner/services')}
                  className="bg-[#202022] p-6 rounded-[2.5rem] border border-white/5 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all group text-left relative overflow-hidden"
                >
                   <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-all"></div>
                   <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition-transform border border-blue-500/20">
                      <CheckCircle2 size={24} />
                   </div>
                   <h3 className="text-sm font-black text-white uppercase tracking-wide mb-2 italic">2. Serviços</h3>
                   <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider leading-relaxed group-hover:text-zinc-400">Cria o menu de tratamentos, preços e durações.</p>
                   <div className="mt-4 flex items-center gap-2 text-[9px] font-black text-blue-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                      Definir <ArrowRight size={12} />
                   </div>
                </button>

                {/* Step 3 */}
                <button 
                  onClick={() => completeTutorial('/owner/settings')}
                  className="bg-[#202022] p-6 rounded-[2.5rem] border border-white/5 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all group text-left relative overflow-hidden"
                >
                   <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all"></div>
                   <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform border border-emerald-500/20">
                      <Settings size={24} />
                   </div>
                   <h3 className="text-sm font-black text-white uppercase tracking-wide mb-2 italic">3. Regras AI</h3>
                   <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider leading-relaxed group-hover:text-zinc-400">Ajusta horários, cancelamentos e automação.</p>
                   <div className="mt-4 flex items-center gap-2 text-[9px] font-black text-emerald-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                      Ativar <ArrowRight size={12} />
                   </div>
                </button>
             </div>

             <button onClick={() => completeTutorial()} className="w-full py-4 text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] hover:text-white transition-colors hover:bg-white/5 rounded-xl">
                Saltar Tutorial e ir para Dashboard
             </button>
          </div>
        </div>
      )}
    </div>
  );
};
