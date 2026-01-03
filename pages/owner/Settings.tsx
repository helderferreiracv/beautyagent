
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Clock, 
  Calendar as CalendarIcon, 
  Sparkles, 
  Wallet, 
  Trophy, 
  Users, 
  Plus, 
  Trash2, 
  Check, 
  X, 
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Palette,
  Power
} from 'lucide-react';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { useToast } from '../../components/Toast';

// --- TYPES ---
interface StaffMember {
  id: string;
  name: string;
  role: string;
  commission: string;
  color: string;
  vacations: { id: string, start: string, end: string }[];
}

interface ServiceItem {
  id: string;
  name: string;
  duration: string;
  price: string;
  groupId?: string;
}

interface ServiceGroup {
  id: string;
  name: string;
  color: string;
}

// --- CONSTANTS ---
const WEEKDAYS = [
  { id: 'seg', label: 'Segunda' },
  { id: 'ter', label: 'Terça' },
  { id: 'qua', label: 'Quarta' },
  { id: 'qui', label: 'Quinta' },
  { id: 'sex', label: 'Sexta' },
  { id: 'sab', label: 'Sábado' },
  { id: 'dom', label: 'Domingo' }
];

const COLORS = [
  { id: 'rose', bg: 'bg-rose-500', text: 'text-rose-400' },
  { id: 'blue', bg: 'bg-blue-500', text: 'text-blue-400' },
  { id: 'emerald', bg: 'bg-emerald-500', text: 'text-emerald-400' },
  { id: 'purple', bg: 'bg-purple-500', text: 'text-purple-400' },
  { id: 'amber', bg: 'bg-amber-500', text: 'text-amber-400' },
  { id: 'cyan', bg: 'bg-cyan-500', text: 'text-cyan-400' },
];

const GROUP_COLORS = [
  'bg-pink-500', 'bg-purple-500', 'bg-indigo-500', 'bg-blue-500', 
  'bg-teal-500', 'bg-emerald-500', 'bg-orange-500', 'bg-rose-500'
];

export const OwnerSettings: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  // --- STATE: GENERAL SETTINGS ---
  const [settings, setSettings] = useState({
    salonName: '',
    openDays: [] as string[],
    openTime: '09:00',
    closeTime: '19:00',
    lunchStart: '',
    lunchEnd: '',
    hasLunchBreak: true,
    vacationMode: false,
    vacationStart: '',
    vacationEnd: '',
    forceAIProSelection: false,
    autoWaitlist: true,
    confirmReminderHours: 24,
    loyaltyEnabled: true,
    loyaltyPointsPerVisit: 1,
    loyaltyThreshold: 10,
    commissionEnabled: true,
    commissionModel: 'salon_pays'
  });

  // --- STATE: COLLECTIONS ---
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [groups, setGroups] = useState<ServiceGroup[]>([]);

  // --- STATE: UI ---
  const [hasChanges, setHasChanges] = useState(false);
  const [isStaffModalOpen, setStaffModalOpen] = useState(false);
  const [isServiceModalOpen, setServiceModalOpen] = useState(false);
  
  // Edit Temps
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [tempStaff, setTempStaff] = useState<any>({});
  const [tempService, setTempService] = useState<any>({});

  // --- LOAD DATA ---
  useEffect(() => {
    const s = JSON.parse(localStorage.getItem('beauty_settings') || '{}');
    const st = JSON.parse(localStorage.getItem('owner_staff_db') || '[]');
    const sv = JSON.parse(localStorage.getItem('owner_services_db') || '[]');
    const gr = JSON.parse(localStorage.getItem('owner_groups_db') || '[]');

    setSettings(prev => ({ ...prev, ...s, hasLunchBreak: !!s.lunchStart }));
    setStaff(st);
    setServices(sv);
    setGroups(gr);
  }, []);

  // --- HANDLERS: CHANGE TRACKING ---
  const handleChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleToggleDay = (dayId: string) => {
    const current = settings.openDays || [];
    const updated = current.includes(dayId) 
      ? current.filter(d => d !== dayId) 
      : [...current, dayId];
    handleChange('openDays', updated);
  };

  // --- HANDLERS: STAFF ---
  const handleEditStaff = (member?: StaffMember) => {
    if (member) {
      setEditingStaff(member);
      setTempStaff({ ...member });
    } else {
      setEditingStaff(null);
      setTempStaff({ name: '', role: '', commission: '0', color: 'rose', vacations: [] });
    }
    setStaffModalOpen(true);
  };

  const saveStaff = () => {
    if (!tempStaff.name) return;
    let updatedStaff;
    if (editingStaff) {
      updatedStaff = staff.map(s => s.id === editingStaff.id ? { ...tempStaff, id: s.id } : s);
    } else {
      updatedStaff = [...staff, { ...tempStaff, id: `p${Date.now()}` }];
    }
    setStaff(updatedStaff);
    setStaffModalOpen(false);
    setHasChanges(true);
  };

  const removeStaff = (id: string) => {
    if(confirm('Remover este membro da equipa?')) {
      setStaff(staff.filter(s => s.id !== id));
      setHasChanges(true);
    }
  };

  const addVacationToStaff = () => {
    const newVac = { id: `v${Date.now()}`, start: '', end: '' };
    setTempStaff({ ...tempStaff, vacations: [...(tempStaff.vacations || []), newVac] });
  };

  const updateVacation = (idx: number, field: 'start'|'end', val: string) => {
    const updated = [...tempStaff.vacations];
    updated[idx] = { ...updated[idx], [field]: val };
    setTempStaff({ ...tempStaff, vacations: updated });
  };

  const removeVacation = (idx: number) => {
    const updated = [...tempStaff.vacations];
    updated.splice(idx, 1);
    setTempStaff({ ...tempStaff, vacations: updated });
  };

  // --- HANDLERS: SERVICES ---
  const handleEditService = (service?: ServiceItem) => {
    if (service) {
      setEditingService(service);
      setTempService({ ...service });
    } else {
      setEditingService(null);
      setTempService({ name: '', duration: '60', price: '', groupId: '' });
    }
    setServiceModalOpen(true);
  };

  const saveService = () => {
    if (!tempService.name) return;
    let updatedServices;
    if (editingService) {
      updatedServices = services.map(s => s.id === editingService.id ? { ...tempService, id: s.id } : s);
    } else {
      updatedServices = [...services, { ...tempService, id: `s${Date.now()}` }];
    }
    setServices(updatedServices);
    setServiceModalOpen(false);
    setHasChanges(true);
  };

  const removeService = (id: string) => {
    if(confirm('Remover este serviço?')) {
      setServices(services.filter(s => s.id !== id));
      setHasChanges(true);
    }
  };

  const handleAddGroup = () => {
    const name = prompt("Nome do novo grupo:");
    if (name) {
      const color = GROUP_COLORS[groups.length % GROUP_COLORS.length];
      const newGroup = { id: `g${Date.now()}`, name, color };
      setGroups([...groups, newGroup]);
      setHasChanges(true);
    }
  };

  // --- SAVE ALL ---
  const handleSaveAll = () => {
    // Save Settings
    const finalSettings = {
      ...settings,
      lunchStart: settings.hasLunchBreak ? settings.lunchStart : '',
      lunchEnd: settings.hasLunchBreak ? settings.lunchEnd : '',
    };
    localStorage.setItem('beauty_settings', JSON.stringify(finalSettings));
    
    // Save DBs
    localStorage.setItem('owner_staff_db', JSON.stringify(staff));
    localStorage.setItem('owner_services_db', JSON.stringify(services));
    localStorage.setItem('owner_groups_db', JSON.stringify(groups));

    setHasChanges(false);
    showToast('success', 'Configurações Guardadas', 'O sistema foi atualizado com sucesso.');
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      
      {/* HEADER */}
      <div className="sticky top-0 z-40 bg-[#1a1a1c]/80 backdrop-blur-xl border-b border-white/5 px-6 py-6 md:px-12">
         <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-6">
               <button onClick={() => navigate('/owner/dashboard')} className="p-3 bg-surface border border-white/5 rounded-2xl text-zinc-400 hover:text-white transition-colors">
                  <ArrowLeft size={20} />
               </button>
               <h1 className="text-3xl lg:text-4xl font-black text-white italic uppercase tracking-tighter flex items-center gap-2">
                  Configurações <Sparkles size={24} className="text-primary" />
               </h1>
            </div>
            
            <Button 
               onClick={handleSaveAll}
               className={`px-8 lg:px-10 py-4 shadow-xl transition-all ${hasChanges ? 'bg-primary text-black scale-105' : 'bg-surface text-zinc-400 border border-white/5 hover:text-white'}`}
            >
               <Save size={18} className="mr-2" /> Guardar Alterações
            </Button>
         </div>
      </div>

      <div className="w-full px-6 md:px-12 py-10 animate-fade-in">
         
         {/* GRID LAYOUT FOR DESKTOP (XL: 3 Columns) */}
         <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 items-start">

            {/* COL 1: HORÁRIOS & OPERAÇÃO */}
            <div className="space-y-8">
               <section className="bg-surface rounded-[2.5rem] border border-white/5 overflow-hidden">
                  <div className="p-8 border-b border-white/5 flex items-center gap-3">
                     <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-400"><Clock size={20} /></div>
                     <h2 className="text-lg font-black text-white uppercase tracking-tight">Horários</h2>
                  </div>
                  <div className="p-8 space-y-8">
                     <div>
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-3">Dias de Abertura</label>
                        <div className="flex flex-wrap gap-2">
                           {WEEKDAYS.map(day => (
                              <button
                                 key={day.id}
                                 onClick={() => handleToggleDay(day.id)}
                                 className={`flex-1 min-w-[60px] py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${settings.openDays.includes(day.id) ? 'bg-blue-500 text-white border-blue-500' : 'bg-background border-white/5 text-zinc-500 hover:border-white/20'}`}
                              >
                                 {day.label.substring(0,3)}
                              </button>
                           ))}
                        </div>
                     </div>
                     
                     <div className="space-y-6">
                        <div className="bg-background/50 p-6 rounded-2xl border border-white/5">
                           <p className="text-[10px] font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2"><Check size={12} className="text-emerald-400"/> Turno Principal</p>
                           <div className="flex gap-4">
                              <Input className="h-14" label="Abertura" type="time" value={settings.openTime} onChange={e => handleChange('openTime', e.target.value)} />
                              <Input className="h-14" label="Fecho" type="time" value={settings.closeTime} onChange={e => handleChange('closeTime', e.target.value)} />
                           </div>
                        </div>

                        <div className={`bg-background/50 p-6 rounded-2xl border transition-all ${settings.hasLunchBreak ? 'border-white/5' : 'border-dashed border-white/10 opacity-60'}`}>
                           <div className="flex justify-between items-center mb-4">
                              <p className="text-[10px] font-black text-white uppercase tracking-widest">Pausa Almoço</p>
                              <button onClick={() => handleChange('hasLunchBreak', !settings.hasLunchBreak)} className={`w-8 h-4 rounded-full p-0.5 transition-colors ${settings.hasLunchBreak ? 'bg-emerald-500' : 'bg-zinc-700'}`}>
                                 <div className={`w-3 h-3 bg-white rounded-full transition-transform ${settings.hasLunchBreak ? 'translate-x-4' : ''}`}></div>
                              </button>
                           </div>
                           {settings.hasLunchBreak && (
                              <div className="flex gap-4 animate-in fade-in">
                                 <Input className="h-14" label="Início" type="time" value={settings.lunchStart} onChange={e => handleChange('lunchStart', e.target.value)} />
                                 <Input className="h-14" label="Fim" type="time" value={settings.lunchEnd} onChange={e => handleChange('lunchEnd', e.target.value)} />
                              </div>
                           )}
                        </div>
                     </div>
                  </div>
               </section>

               <section className="bg-surface rounded-[2.5rem] border border-white/5 overflow-hidden flex flex-col">
                  <div className="p-8 border-b border-white/5 flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-orange-500/10 rounded-xl text-orange-400"><CalendarIcon size={20} /></div>
                        <h2 className="text-lg font-black text-white uppercase tracking-tight">Férias Salão</h2>
                     </div>
                     <button 
                        onClick={() => handleChange('vacationMode', !settings.vacationMode)} 
                        className={`w-10 h-5 rounded-full p-0.5 transition-colors ${settings.vacationMode ? 'bg-orange-500' : 'bg-zinc-700'}`}
                     >
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${settings.vacationMode ? 'translate-x-5' : ''}`}></div>
                     </button>
                  </div>
                  <div className={`p-8 space-y-4 flex-grow transition-opacity ${settings.vacationMode ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
                     <div className="grid grid-cols-2 gap-4">
                        <Input className="h-14" label="Início" type="date" value={settings.vacationStart} onChange={e => handleChange('vacationStart', e.target.value)} />
                        <Input className="h-14" label="Fim" type="date" value={settings.vacationEnd} onChange={e => handleChange('vacationEnd', e.target.value)} />
                     </div>
                  </div>
               </section>
            </div>

            {/* COL 2: STAFF & COMISSÕES */}
            <div className="space-y-8">
               <section className="bg-surface rounded-[2.5rem] border border-white/5 overflow-hidden">
                  <div className="p-8 border-b border-white/5 flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-rose-500/10 rounded-xl text-rose-400"><Users size={20} /></div>
                        <h2 className="text-lg font-black text-white uppercase tracking-tight">Equipa</h2>
                     </div>
                     <button onClick={() => handleEditStaff()} className="text-[10px] font-bold text-white bg-white/5 border border-white/10 hover:bg-white/10 px-4 py-2 rounded-xl uppercase tracking-widest transition-all flex items-center gap-2">
                        <Plus size={14} /> Adicionar
                     </button>
                  </div>
                  
                  <div className="p-8 grid grid-cols-1 gap-4 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin">
                     {staff.map(s => (
                        <div key={s.id} onClick={() => handleEditStaff(s)} className="group bg-background/40 hover:bg-background/80 p-4 rounded-2xl border border-white/5 hover:border-white/20 transition-all cursor-pointer flex items-center justify-between">
                           <div className="flex items-center gap-4">
                              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-white bg-${s.color}-500/20 text-${s.color}-400 border border-${s.color}-500/30 text-lg`}>{s.name.charAt(0)}</div>
                              <div>
                                 <p className="text-sm font-bold text-white">{s.name}</p>
                                 <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">{s.role}</p>
                              </div>
                           </div>
                           <div className="flex items-center gap-3">
                              {s.vacations.length > 0 && <span className="text-[9px] font-bold text-orange-400 bg-orange-500/10 px-2 py-1 rounded border border-orange-500/20">Férias</span>}
                              <span className="text-xs font-bold text-zinc-600 group-hover:text-white transition-colors">{s.commission}%</span>
                           </div>
                        </div>
                     ))}
                  </div>
               </section>

               <section className="bg-surface rounded-[2.5rem] border border-white/5 overflow-hidden">
                  <div className="p-8 border-b border-white/5 flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400"><Wallet size={20} /></div>
                        <h2 className="text-lg font-black text-white uppercase tracking-tight">Comissões</h2>
                     </div>
                     <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{settings.commissionEnabled ? 'Ativo' : 'Off'}</span>
                        <button onClick={() => handleChange('commissionEnabled', !settings.commissionEnabled)} className={`w-8 h-4 rounded-full p-0.5 ${settings.commissionEnabled ? 'bg-emerald-500' : 'bg-zinc-700'}`}><div className={`w-3 h-3 bg-white rounded-full transition-transform ${settings.commissionEnabled ? 'translate-x-4' : ''}`}></div></button>
                     </div>
                  </div>
                  <div className={`p-8 transition-opacity ${settings.commissionEnabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                     <div className="bg-emerald-500/5 p-4 rounded-2xl border border-emerald-500/10">
                        <p className="text-xs text-emerald-200 font-medium italic">As comissões são calculadas automaticamente no fecho de cada serviço.</p>
                     </div>
                  </div>
               </section>
            </div>

            {/* COL 3: SERVICES & AI */}
            <div className="space-y-8">
               <section className="bg-surface rounded-[2.5rem] border border-white/5 overflow-hidden">
                  <div className="p-8 border-b border-white/5 flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-cyan-500/10 rounded-xl text-cyan-400"><Sparkles size={20} /></div>
                        <h2 className="text-lg font-black text-white uppercase tracking-tight">Serviços</h2>
                     </div>
                     <div className="flex gap-2">
                        <button onClick={handleAddGroup} className="p-2 bg-white/5 rounded-xl text-zinc-400 hover:text-white border border-white/5"><Palette size={16} /></button>
                        <button onClick={() => handleEditService()} className="text-[10px] font-bold text-white bg-white/5 border border-white/10 hover:bg-white/10 px-4 py-2 rounded-xl uppercase tracking-widest transition-all flex items-center gap-2">
                           <Plus size={14} /> Adicionar
                        </button>
                     </div>
                  </div>
                  
                  <div className="p-8">
                     {/* Groups Chips */}
                     <div className="flex flex-wrap gap-2 mb-6">
                        {groups.map(g => (
                           <span key={g.id} className={`text-[9px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest text-white ${g.color} bg-opacity-20 border border-white/10`}>
                              {g.name}
                           </span>
                        ))}
                     </div>

                     <div className="grid grid-cols-1 gap-4 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin">
                        {services.map(s => (
                           <div key={s.id} onClick={() => handleEditService(s)} className="group bg-background/40 hover:bg-background/80 p-4 rounded-2xl border border-white/5 hover:border-white/20 transition-all cursor-pointer flex items-center justify-between">
                              <div>
                                 <p className="text-sm font-bold text-white">{s.name}</p>
                                 <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">{s.duration} min</p>
                              </div>
                              <span className="text-sm font-black text-white">{s.price}€</span>
                           </div>
                        ))}
                     </div>
                  </div>
               </section>

               <section className="bg-surface rounded-[2.5rem] border border-white/5 overflow-hidden">
                  <div className="p-8 border-b border-white/5 flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-purple-500/10 rounded-xl text-purple-400"><Sparkles size={20} /></div>
                        <h2 className="text-lg font-black text-white uppercase tracking-tight">Agente AI</h2>
                     </div>
                  </div>
                  <div className="p-8 space-y-6">
                     {[
                        { key: 'forceAIProSelection', label: 'Alocação Inteligente', desc: 'Cliente não escolhe profissional, AI otimiza.' },
                        { key: 'autoWaitlist', label: 'Lista de Espera Auto', desc: 'Sugerir vagas canceladas automaticamente.' },
                     ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between group">
                           <div>
                              <p className="text-sm font-bold text-white">{item.label}</p>
                              <p className="text-[10px] text-zinc-500 font-medium">{item.desc}</p>
                           </div>
                           <button 
                              onClick={() => handleChange(item.key, !(settings as any)[item.key])} 
                              className={`w-12 h-6 rounded-full p-1 transition-colors ${(settings as any)[item.key] ? 'bg-primary' : 'bg-zinc-700'}`}
                           >
                              <div className={`w-4 h-4 bg-black rounded-full shadow-md transition-transform ${(settings as any)[item.key] ? 'translate-x-6' : ''}`}></div>
                           </button>
                        </div>
                     ))}
                  </div>
               </section>
            </div>

         </div>

      </div>

      {/* --- MODAL STAFF --- */}
      {isStaffModalOpen && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-background/90 backdrop-blur-sm" onClick={() => setStaffModalOpen(false)}></div>
            <div className="bg-surface w-full max-w-md rounded-[2.5rem] p-8 relative z-10 border border-white/10 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
               <h3 className="text-xl font-black text-white italic uppercase tracking-tight mb-6">{editingStaff ? 'Editar Staff' : 'Novo Staff'}</h3>
               <div className="space-y-4">
                  <Input className="h-14" label="Nome" value={tempStaff.name} onChange={e => setTempStaff({...tempStaff, name: e.target.value})} />
                  <div className="grid grid-cols-2 gap-4">
                     <Input className="h-14" label="Cargo" value={tempStaff.role} onChange={e => setTempStaff({...tempStaff, role: e.target.value})} />
                     <Input className="h-14" label="Comissão (%)" type="number" value={tempStaff.commission} onChange={e => setTempStaff({...tempStaff, commission: e.target.value})} />
                  </div>
                  
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Cor</label>
                     <div className="flex gap-2">
                        {COLORS.map(c => (
                           <button key={c.id} onClick={() => setTempStaff({...tempStaff, color: c.id})} className={`w-8 h-8 rounded-full border-2 ${c.bg} ${tempStaff.color === c.id ? 'border-white scale-110' : 'border-transparent opacity-50'}`}></button>
                        ))}
                     </div>
                  </div>

                  <div className="pt-4 border-t border-white/10">
                     <div className="flex justify-between items-center mb-3">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Férias Agendadas</label>
                        <button onClick={addVacationToStaff} className="text-[10px] text-primary font-bold uppercase tracking-widest hover:underline">+ Adicionar</button>
                     </div>
                     <div className="space-y-2">
                        {tempStaff.vacations?.map((v: any, idx: number) => (
                           <div key={v.id} className="flex gap-2 items-center">
                              <input type="date" value={v.start} onChange={e => updateVacation(idx, 'start', e.target.value)} className="bg-background border border-white/10 rounded-lg px-2 py-2 text-xs text-white w-full" />
                              <span className="text-zinc-500">-</span>
                              <input type="date" value={v.end} onChange={e => updateVacation(idx, 'end', e.target.value)} className="bg-background border border-white/10 rounded-lg px-2 py-2 text-xs text-white w-full" />
                              <button onClick={() => removeVacation(idx)} className="text-red-400 hover:text-red-300"><X size={16}/></button>
                           </div>
                        ))}
                     </div>
                  </div>

                  <div className="pt-6 flex gap-3">
                     {editingStaff && <button onClick={() => removeStaff(editingStaff.id)} className="p-4 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20"><Trash2 size={18}/></button>}
                     <Button fullWidth onClick={saveStaff}>Guardar</Button>
                  </div>
               </div>
            </div>
         </div>
      )}

      {/* --- MODAL SERVICE --- */}
      {isServiceModalOpen && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-background/90 backdrop-blur-sm" onClick={() => setServiceModalOpen(false)}></div>
            <div className="bg-surface w-full max-w-md rounded-[2.5rem] p-8 relative z-10 border border-white/10 shadow-2xl animate-in zoom-in-95">
               <h3 className="text-xl font-black text-white italic uppercase tracking-tight mb-6">{editingService ? 'Editar Serviço' : 'Novo Serviço'}</h3>
               <div className="space-y-4">
                  <Input className="h-14" label="Nome" value={tempService.name} onChange={e => setTempService({...tempService, name: e.target.value})} />
                  <div className="grid grid-cols-2 gap-4">
                     <Input className="h-14" label="Preço (€)" type="number" value={tempService.price} onChange={e => setTempService({...tempService, price: e.target.value})} />
                     <Input className="h-14" label="Duração (min)" type="number" value={tempService.duration} onChange={e => setTempService({...tempService, duration: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Grupo</label>
                     <select 
                        value={tempService.groupId || ''}
                        onChange={e => setTempService({...tempService, groupId: e.target.value})}
                        className="w-full h-14 bg-background border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white focus:border-primary outline-none appearance-none"
                     >
                        <option value="">Sem grupo</option>
                        {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                     </select>
                  </div>
                  <div className="pt-6 flex gap-3">
                     {editingService && <button onClick={() => removeService(editingService.id)} className="p-4 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20"><Trash2 size={18}/></button>}
                     <Button fullWidth onClick={saveService}>Guardar</Button>
                  </div>
               </div>
            </div>
         </div>
      )}

    </div>
  );
};
