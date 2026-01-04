'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Download, 
  Calendar, 
  TrendingUp, 
  DollarSign, 
  Users, 
  ChevronDown, 
  FileText, 
  AlertCircle,
  CheckCircle2,
  Wallet,
  PieChart,
  Ban,
  Sparkles,
  Info,
  Clock,
  User,
  Loader2
} from 'lucide-react';
import { Button } from '../../components/Button';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface UnifiedBooking {
  id: string;
  date: string;
  time: string;
  client: string;
  service: string; // Garantido como string primitiva
  price: number;
  proName: string;
  status: string;
  commissionRate: number;
  source: 'app' | 'manual';
}

const parsePrice = (priceStr: string | number): number => {
  if (typeof priceStr === 'number') return priceStr;
  if (!priceStr) return 0;
  return parseFloat(priceStr.toString().replace('€', '').replace(',', '.').trim()) || 0;
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(value);
};

const MONTHS = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

export const OwnerReports: React.FC = () => {
  const router = useRouter();
  const now = new Date();
  
  const [loading, setLoading] = useState(true);
  const [periodMode, setPeriodMode] = useState<'month' | 'custom'>('month');
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [bookings, setBookings] = useState<UnifiedBooking[]>([]);
  const [salonName, setSalonName] = useState('Beauty Salon');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const settings = JSON.parse(localStorage.getItem('beauty_settings') || '{}');
      if (settings.salonName) setSalonName(settings.salonName);

      const staffDb = JSON.parse(localStorage.getItem('owner_staff_db') || '[]');
      const getCommission = (proId: string) => {
        const staff = staffDb.find((s:any) => s.id === proId);
        return staff ? parseFloat(staff.commission) : 0;
      };
      const getStaffName = (proId: string) => {
         const staff = staffDb.find((s:any) => s.id === proId);
         return staff ? staff.name : 'Staff';
      };

      const clientBookingsRaw = JSON.parse(localStorage.getItem('beauty_bookings') || '[]');
      const normalizedClient = clientBookingsRaw.map((b: any) => ({
        id: b.id,
        date: b.date,
        time: b.time,
        client: String(b.userName || 'Cliente App'),
        service: String(b.service?.name || b.service || 'Serviço'), // Prevenção de Erro #31
        price: parsePrice(b.service?.price || 0),
        proName: b.professional === 'agent' ? 'Agente AI' : String(b.professional?.name || 'Staff'),
        status: b.status,
        commissionRate: getCommission(b.professional === 'agent' ? 'p1' : (b.professional?.id || 'p1')),
        source: 'app'
      }));

      const ownerBookingsRaw = JSON.parse(localStorage.getItem('owner_bookings_db') || '[]');
      const normalizedOwner = ownerBookingsRaw.map((b: any) => ({
        id: b.id,
        date: b.date,
        time: b.time,
        client: String(b.client || 'Cliente'),
        service: String(b.service || 'Serviço'), // Prevenção de Erro #31
        price: b.priceValue || 45,
        proName: getStaffName(b.proId),
        status: b.status,
        commissionRate: getCommission(b.proId),
        source: 'manual'
      }));

      setBookings([...normalizedClient, ...normalizedOwner]);
      setLoading(false);
    };

    fetchData();
  }, []);

  const filteredData = useMemo(() => {
    return bookings.filter(b => {
      if (b.status === 'cancelled') return false;
      const bDate = new Date(b.date);
      if (periodMode === 'month') {
        return bDate.getMonth() === selectedMonth && bDate.getFullYear() === selectedYear;
      }
      return true;
    }).sort((a, b) => b.date.localeCompare(a.date));
  }, [bookings, periodMode, selectedMonth, selectedYear]);

  const stats = useMemo(() => {
    let revenue = 0;
    let occupancy = 0;
    filteredData.forEach(b => {
      if (b.status === 'completed') revenue += b.price;
      if (b.status !== 'cancelled') occupancy++;
    });
    return { revenue, occupancy: Math.min(100, Math.round(occupancy * 2)) };
  }, [filteredData]);

  const handleExportPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [['Data', 'Cliente', 'Serviço', 'Valor', 'Estado']],
      body: filteredData.map(b => [b.date, b.client, b.service, `${b.price}€`, b.status])
    });
    doc.save(`Relatorio_${salonName.replace(/\s/g, '_')}.pdf`);
  };

  return (
    <div className="min-h-screen bg-background text-white pb-32">
      <div className="px-6 py-10 bg-[#1a1a1c] border-b border-white/5">
         <div className="w-full flex justify-between items-center">
            <div className="flex items-center gap-6">
               <button onClick={() => router.push('/owner/dashboard')} className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 text-zinc-400">
                  <ArrowLeft size={24} />
               </button>
               <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white">Relatórios</h1>
            </div>
            <Button variant="outline" onClick={handleExportPDF} className="h-10 text-[11px]">Download PDF</Button>
         </div>
      </div>

      <div className="w-full px-6 py-10 animate-fade-in">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-surface border border-white/5 rounded-[2.5rem] p-8">
               <p className="text-[11px] font-black text-primary uppercase tracking-[0.2em] mb-4">Faturação Caixa</p>
               <h3 className="text-4xl font-black text-white italic">{formatCurrency(stats.revenue)}</h3>
            </div>
            <div className="bg-surface border border-white/5 rounded-[2.5rem] p-8">
               <p className="text-[11px] font-black text-blue-400 uppercase tracking-[0.2em] mb-4">Ocupação</p>
               <h3 className="text-4xl font-black text-white italic">{stats.occupancy}%</h3>
            </div>
         </div>

         <div className="bg-surface rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead>
                     <tr className="bg-white/[0.02]">
                        <th className="px-8 py-6 text-[11px] font-black text-zinc-500 uppercase tracking-widest">Data</th>
                        <th className="px-8 py-6 text-[11px] font-black text-zinc-500 uppercase tracking-widest">Cliente</th>
                        <th className="px-8 py-6 text-[11px] font-black text-zinc-500 uppercase tracking-widest">Serviço</th>
                        <th className="px-8 py-6 text-[11px] font-black text-zinc-500 uppercase tracking-widest text-right">Valor</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                     {filteredData.map(row => (
                        <tr key={row.id} className="hover:bg-white/[0.02]">
                           <td className="px-8 py-6 font-bold text-[12px]">{row.date}</td>
                           <td className="px-8 py-6 font-bold text-[12px] uppercase">{row.client}</td>
                           <td className="px-8 py-6 text-[12px] text-zinc-400">{row.service}</td>
                           <td className="px-8 py-6 text-right font-black text-[12px] text-white italic">{row.price.toFixed(2)}€</td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      </div>
    </div>
  );
};