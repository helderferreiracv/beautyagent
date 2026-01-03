'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Calendar, 
  BarChart3, 
  UserCircle,
  Settings,
  Plus
} from 'lucide-react';

export const BottomNavbar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const isOwner = pathname?.startsWith('/owner');
  const isStaff = pathname?.startsWith('/staff');

  if (!isOwner && !isStaff) return null;

  const handleAddBooking = () => {
    router.push('/owner/agenda?action=new');
  };

  const ownerItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/owner/dashboard' },
    { label: 'Agenda', icon: Calendar, href: '/owner/agenda' },
    { label: 'Novo', icon: Plus, isAction: true, action: handleAddBooking },
    { label: 'CRM', icon: UserCircle, href: '/owner/clients' },
    { label: 'Definições', icon: Settings, href: '/owner/settings' },
  ];

  const staffItems = [
    { label: 'Agenda', icon: Calendar, href: '/staff/agenda' },
    { label: 'Ganhos', icon: BarChart3, href: `/staff/view/p1` }, 
  ];

  const items = isOwner ? ownerItems : staffItems;

  return (
    <div className="md:hidden fixed bottom-8 left-1/2 -translate-x-1/2 z-[90] w-auto">
      <nav className="bg-surface/80 backdrop-blur-2xl border border-white/10 rounded-full px-2 py-2 flex items-center gap-1 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
        {items.map((item, idx) => {
          if (item.isAction) {
             return (
               <button
                 key="action-btn"
                 onClick={item.action}
                 className="group relative w-14 h-14 mx-2 flex items-center justify-center transition-all active:scale-90 touch-manipulation"
                 aria-label="Nova Marcação"
               >
                 <div className="absolute inset-0 bg-gradient-to-tr from-primary to-rose-400 rounded-full shadow-lg group-hover:shadow-primary/40 transition-all duration-300"></div>
                 <Plus size={28} className="text-black relative z-10" strokeWidth={3} />
               </button>
             );
          }

          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <button
              key={item.href || idx}
              onClick={() => item.href && router.push(item.href)}
              className={`
                relative w-12 h-12 rounded-full flex flex-col items-center justify-center transition-all duration-300 active:scale-90 group
                ${isActive ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}
              `}
            >
              <Icon 
                size={22} 
                strokeWidth={isActive ? 2.5 : 2} 
                className={`transition-all duration-300 ${isActive ? 'scale-110' : ''}`}
              />
              <div className={`
                absolute bottom-1.5 w-1 h-1 rounded-full bg-primary transition-all duration-300
                ${isActive ? 'opacity-100 scale-100 shadow-[0_0_5px_#ebff57]' : 'opacity-0 scale-0'}
              `}></div>
            </button>
          );
        })}
      </nav>
    </div>
  );
};