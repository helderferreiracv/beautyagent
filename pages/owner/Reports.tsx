
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
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

const ReportSkeleton = () => (
  <div className="space-y-12 animate-fade-in">
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="h-48 bg-surface rounded-[2.5rem] border border-white/5 animate-pulse"></div>
      ))}
    </div>
    <div className="h-96 bg-surface rounded-[3rem] border border-white/5 animate-pulse"></div>
  </div>
);

interface UnifiedBooking {
  id: string;
  date: string;
  time: string;
  client: string;
  service: string;
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
  const navigate = useNavigate();
  const now = new Date();
  
  const [loading, setLoading] = useState(true);
  const [periodMode, setPeriodMode] = useState<'month' | 'custom'>('month');
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [bookings, setBookings] = useState<UnifiedBooking[]>([]);
  const [showCommissions, setShowCommissions] = useState(false);
  const [salonName, setSalonName] = useState('Beauty Salon');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1200)); // Simulate heavy load

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
        client: b.userName || 'Cliente App',
        service: b.service.name,
        price: parsePrice(b.service.price),
        proName: b.professional === 'agent' ? 'Agente AI' : (b.professional.name || 'Staff'),
        status: b.status,
        commissionRate: getCommission(b.professional === 'agent' ? 'p1' : b.professional.id),
        source: 'app'
      }));

      const ownerBookingsRaw = JSON.parse(localStorage.getItem('owner_bookings_db') || '[]');
      const normalizedOwner = ownerBookingsRaw.map((b: any) => ({
        id: b.id,
        date: b.date,
        time: b.time,
        client: b.client,
        service: b.service,
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
      bDate.setHours(0,0,0,0);
      if (periodMode === 'month') {
        return bDate.getMonth() === selectedMonth && bDate.getFullYear() === selectedYear;
      } else {
        if (!customStart || !customEnd) return true;
        const start = new Date(customStart); start.setHours(0,0,0,0);
        const end = new Date(customEnd); end.setHours(23,59,59,999);
        return bDate >= start && bDate <= end;
      }
    }).sort((a, b) => new Date(`${b.date}T${b.time}`).getTime() - new Date(`${a.date}T${a.time}`).getTime());
  }, [bookings, periodMode, selectedMonth, selectedYear, customStart, customEnd]);

  const stats = useMemo(() => {
    let realizedRevenue = 0;
    let forecastRevenue = 0;
    let totalCommissions = 0;
    let noShows = 0;
    let uniqueClients = new Set();

    filteredData.forEach(b => {
      uniqueClients.add(b.client);
      if (b.status === 'completed') {
        realizedRevenue += b.price;
        totalCommissions += b.price * (b.commissionRate / 100);
      } else if (b.status === 'confirmed') {
        forecastRevenue += b.price;
      } else if (b.status === 'no-show') {
        noShows++;
      }
    });

    const occupancyRate = filteredData.length > 0 ? Math.min(100, Math.round((filteredData.length / 100) * 100)) : 0;

    return { realizedRevenue, forecastRevenue, totalCommissions, noShows, totalBookings: filteredData.length, uniqueClients: uniqueClients.size, occupancyRate };
  }, [filteredData]);

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.save(`Relatorio_${salonName.replace(/\s/g, '_')}.pdf`);
  };

  return (
    <div className="min-h-screen bg-background text-white pb-32">
      <div className="px-6 md:px-12 lg:px-16 pt-10 lg:pt-14 pb-8 bg-[#1a1a1c] border-b border-white/5">
         <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-6">
               <button onClick={() => navigate('/owner/dashboard')} className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors text-zinc-400 hover:text-white">
                  <ArrowLeft size={24} />
               </button>
               <div>
                  <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-white flex items-center gap-4">
                     Relatórios <Sparkles className="text-primary" size={32} />
                  </h1>
                  <p className="text-[11px] lg:text-xs font-bold text-zinc-500 uppercase tracking-[0.3em] mt-1">Sincronização Ativa • 100% Real</p>
               </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
               <div className="flex items-center bg-surface border border-white/10 rounded-2xl p-1">
                  <button onClick={() => setPeriodMode('month')} className={`px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${periodMode === 'month' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-white'}`}>Mensal</button>
                  <button onClick={() => setPeriodMode('custom')} className={`px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${periodMode === 'custom' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-white'}`}>Custom</button>
               </div>
               {periodMode === 'month' && (
                  <select value={selectedMonth} onChange={e => setSelectedMonth(parseInt(e.target.value))} className="bg-surface border border-white/10 rounded-2xl px-5 py-3 text-xs font-bold text-white uppercase outline-none">
                     {MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)}
                  </select>
               )}
            </div>
         </div>
      </div>

      <div className="w-full px-6 md:px-12 lg:px-16 py-10 lg:py-14 animate-fade-in">
         {loading ? <ReportSkeleton /> : (
            <>
               <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-12">
                  <div className="bg-surface border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden group hover:border-primary/30 transition-all shadow-xl">
                     <p className="text-[11px] font-black text-primary uppercase tracking-[0.2em] mb-4 flex items-center gap-2"><CheckCircle2 size={14}/> Faturação Caixa</p>
                     <h3 className="text-3xl lg:text-5xl font-black text-white italic tracking-tighter leading-none mb-2">{formatCurrency(stats.realizedRevenue)}</h3>
                  </div>
                  <div className="bg-surface border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden group hover:border-rose-400/30 transition-all shadow-xl">
                     <p className="text-[11px] font-black text-rose-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2"><Wallet size={14}/> Previsto em Agenda</p>
                     <h3 className="text-3xl lg:text-5xl font-black text-white italic tracking-tighter leading-none mb-2">{formatCurrency(stats.forecastRevenue)}</h3>
                  </div>
                  <div className="bg-surface border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden group transition-all shadow-xl">
                     <p className="text-[11px] font-black text-blue-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2"><PieChart size={14}/> Ocupação</p>
                     <h3 className="text-3xl lg:text-5xl font-black text-white italic tracking-tighter leading-none mb-2">{stats.occupancyRate}%</h3>
                  </div>
                  <div className="bg-surface border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden group transition-all shadow-xl">
                     <p className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2"><Ban size={14}/> No-Shows</p>
                     <h3 className="text-3xl lg:text-5xl font-black text-white italic tracking-tighter leading-none mb-2">{stats.noShows}</h3>
                  </div>
               </div>

               <div className="bg-surface rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl">
                  <div className="p-8 lg:p-10 border-b border-white/5 flex justify-between items-center bg-[#1a1a1c]">
                     <h3 className="text-lg font-black text-white uppercase italic tracking-tight">Tabela de Movimentos</h3>
                     <Button variant="outline" onClick={handleExportPDF} className="h-10 text-[11px]">Download PDF</Button>
                  </div>
                  <div className="overflow-x-auto">
                     <table className="w-full text-left">
                        <thead>
                           <tr className="bg-white/[0.02]">
                              <th className="px-8 py-6 text-[11px] font-black text-zinc-500 uppercase tracking-widest">Data / Hora</th>
                              <th className="px-8 py-6 text-[11px] font-black text-zinc-500 uppercase tracking-widest">Cliente</th>
                              <th className="px-8 py-6 text-[11px] font-black text-zinc-500 uppercase tracking-widest">Serviço</th>
                              <th className="px-8 py-6 text-[11px] font-black text-zinc-500 uppercase tracking-widest text-right">Valor</th>
                              <th className="px-8 py-6 text-[11px] font-black text-zinc-500 uppercase tracking-widest text-center">Estado</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                           {filteredData.map(row => (
                              <tr key={row.id} className="hover:bg-white/[0.02] transition-colors">
                                 <td className="px-8 py-6">
                                    <span className="block text-[12px] font-black text-white">{new Date(row.date).toLocaleDateString('pt-PT')}</span>
                                    <span className="text-[11px] text-zinc-500 font-bold uppercase">{row.time}</span>
                                 </td>
                                 <td className="px-8 py-6 font-bold text-[12px] uppercase">{row.client}</td>
                                 <td className="px-8 py-6 text-[12px] text-zinc-400">{row.service}</td>
                                 <td className="px-8 py-6 text-right font-black text-[12px] text-white italic">{row.price.toFixed(2)}€</td>
                                 <td className="px-8 py-6 text-center">
                                    <span className={`text-[11px] font-black px-3 py-1 rounded-lg uppercase border ${row.status === 'completed' ? 'border-emerald-500/20 text-emerald-400 bg-emerald-500/10' : 'border-white/10 text-zinc-500'}`}>{row.status}</span>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>
            </>
         )}
      </div>
    </div>
  );
};
