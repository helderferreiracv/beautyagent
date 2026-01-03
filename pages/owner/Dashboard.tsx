
'use client';

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  LayoutGrid, 
  Calendar as CalendarIcon, 
  Users, 
  Sparkles, 
  Settings, 
  TrendingUp,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { useBeautyData } from '../../hooks/useBeautyData';
import { AIInsights } from '../../components/AIInsights';

const SidebarLink = ({ icon: Icon, label, active = false, onClick, count }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center justify-between px-6 py-4 transition-all duration-200 border-l-2 group
      ${active 
        ? 'border-[#ebff57] bg-[#343436] text-white' 
        : 'border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.02]'
      }`}
  >
    <div className="flex items-center gap-4">
      <Icon size={18} className={active ? 'text-[#ebff57]' : ''} />
      <span className={`text-[13px] font-medium tracking-wide ${active ? 'font-bold' : ''}`}>{label}</span>
    </div>
    {count > 0 && (
      <span className="bg-[#ebff57] text-black text-[9px] font-black px-2 py-0.5 rounded-full">
        {count}
      </span>
    )}
  </button>
);

const KPICard = ({ title, value, change, isPositive, prefix = '' }: any) => (
  <div className="bg-[#343436] p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden group hover:border-[#ebff57]/20 transition-all shadow-lg">
    <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.01] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-[#ebff57]/[0.02] transition-colors"></div>
    <h3 className="text-4xl lg:text-5xl font-black text-white mb-3 tracking-tighter relative z-10 italic">{prefix}{value}</h3>
    <div className="flex items-center justify-between relative z-10">
      <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">{title}</p>
      <span className={`text-[10px] font-black px-3 py-1 rounded-full ${isPositive ? 'text-[#ebff57] bg-[#ebff57]/10' : 'text-rose-400 bg-rose-400/10'}`}>
        {change}
      </span>
    </div>
  </div>
);

export const OwnerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { bookings, stats, isDemo } = useBeautyData();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [unreadCount, setUnreadCount] = useState(0);
  const [isAiOpen, setIsAiOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const checkNotifications = () => {
      const logs = JSON.parse(localStorage.getItem('beauty_logs_db') || '[]');
      const readIds = JSON.parse(localStorage.getItem('beauty_read_messages') || '[]');
      const unreadLogs = logs.filter((l: any) => ['alert', 'ai', 'client'].includes(l.type) && !readIds.includes(l.id)).length;
      setUnreadCount(unreadLogs);
    };
    checkNotifications();
    const id = setInterval(checkNotifications, 10000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex h-full w-full bg-[#29292b] font-sans text-[#f1f0e6] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 lg:w-80 bg-[#1a1a1c] border-r border-white/5 flex flex-col shrink-0 z-30 hidden md:flex">
        <div className="h-24 flex items-center px-8">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-[#ebff57] text-black rounded-xl flex items-center justify-center shadow-xl shadow-[#ebff57]/10">
               <Sparkles size={20} strokeWidth={3} />
             </div>
             <span className="text-xl font-black text-white uppercase italic tracking-tighter">BeautyAgent</span>
          </div>
        </div>
        
        <nav className="flex-1 py-10 space-y-2">
          <SidebarLink icon={LayoutGrid} label="Início" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <SidebarLink icon={CalendarIcon} label="Agenda Mestre" onClick={() => navigate('/owner/agenda')} />
          <SidebarLink icon={Users} label="CRM Clientes" onClick={() => navigate('/owner/clients')} />
          <SidebarLink icon={TrendingUp} label="Relatórios" onClick={() => navigate('/owner/reports')} />
          <SidebarLink icon={Settings} label="Configurações" onClick={() => navigate('/owner/settings')} />
        </nav>

        <div className="p-8 border-t border-white/5">
           <button onClick={() => navigate('/')} className="flex items-center gap-4 text-zinc-500 hover:text-rose-400 text-xs font-black uppercase tracking-widest w-full transition-colors group">
              <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" /> Sair do Painel
           </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 relative bg-[#151516]">
        <header className="h-24 px-8 lg:px-12 flex items-center justify-between bg-[#1a1a1c]/50 backdrop-blur-md border-b border-white/5">
          <div className="flex items-center gap-4">
             <h1 className="text-2xl font-black text-white uppercase italic tracking-tighter">Visão Geral</h1>
             {isDemo && <span className="px-3 py-1 rounded-full bg-[#ebff57]/10 text-[#ebff57] text-[9px] font-black uppercase tracking-widest border border-[#ebff57]/20">Demo Mode</span>}
          </div>
          
          <div className="flex items-center gap-6">
            <button onClick={() => setIsAiOpen(true)} className="flex items-center gap-3 px-6 py-2.5 bg-[#ebff57] text-black rounded-full font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#ebff57]/10">
               <Sparkles size={14} /> AI Insights
            </button>
            <button onClick={() => navigate('/owner/messages')} className="p-3 bg-[#1a1a1c] border border-white/10 rounded-2xl text-zinc-400 relative hover:text-white transition-colors">
              <Bell size={20} />
              {unreadCount > 0 && <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-[#1a1a1c]"></span>}
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 lg:p-12">
          <div className="max-w-7xl mx-auto space-y-12">
            
            {/* KPI Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <KPICard title="Total de Clientes" value={stats.totalClients} change="+12% este mês" isPositive={true} />
              <KPICard title="Receita (Mês)" value={stats.monthlyRevenue} prefix="€" change="Em crescimento" isPositive={true} />
              <KPICard title="Visitas Hoje" value={stats.todayBookingsCount} change="Agenda Completa" isPositive={true} />
            </div>
            
            {/* Action Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <div onClick={() => navigate('/owner/agenda')} className="bg-[#343436] p-10 rounded-[3rem] border border-white/5 cursor-pointer hover:border-[#ebff57]/40 transition-all group relative overflow-hidden">
                  <div className="absolute top-10 right-10 opacity-10 group-hover:opacity-20 transition-opacity">
                     <CalendarIcon size={80} />
                  </div>
                  <h3 className="text-2xl font-black text-white uppercase italic mb-4 tracking-tight">Gerir Agenda</h3>
                  <p className="text-zinc-400 text-sm mb-8 max-w-xs">Visualiza e edita todas as tuas marcações em tempo real.</p>
                  <div className="flex items-center gap-2 text-[#ebff57] text-[10px] font-black uppercase tracking-widest">
                     Abrir Calendário <ChevronRight size={14} />
                  </div>
               </div>

               <div onClick={() => navigate('/owner/reports')} className="bg-[#343436] p-10 rounded-[3rem] border border-white/5 cursor-pointer hover:border-[#ebff57]/40 transition-all group relative overflow-hidden">
                  <div className="absolute top-10 right-10 opacity-10 group-hover:opacity-20 transition-opacity">
                     <TrendingUp size={80} />
                  </div>
                  <h3 className="text-2xl font-black text-white uppercase italic mb-4 tracking-tight">Análise de Performance</h3>
                  <p className="text-zinc-400 text-sm mb-8 max-w-xs">Descobre quem são os teus melhores funcionários e serviços.</p>
                  <div className="flex items-center gap-2 text-[#ebff57] text-[10px] font-black uppercase tracking-widest">
                     Ver Relatórios <ChevronRight size={14} />
                  </div>
               </div>
            </div>

          </div>
        </div>
      </main>

      {isAiOpen && <AIInsights onClose={() => setIsAiOpen(false)} />}
    </div>
  );
};
