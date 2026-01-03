
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Users, 
  Clock, 
  Check, 
  Plus, 
  Trash2, 
  Building2,
  Euro,
  Loader2
} from 'lucide-react';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { useToast } from '../../components/Toast';

// --- Types ---
interface ServiceItem {
  id: string;
  name: string;
  duration: string;
  price: string;
}

interface StaffItem {
  id: string;
  name: string;
  role: string;
  commission: string;
  color: string;
}

const STEPS = [
  { id: 1, title: 'Menu de Serviços', desc: 'O que o teu salão oferece?', icon: Sparkles },
  { id: 2, title: 'Equipa', desc: 'Quem faz a magia acontecer?', icon: Users },
  { id: 3, title: 'Horários', desc: 'Quando estão abertos?', icon: Clock },
];

const INITIAL_SERVICES: ServiceItem[] = [
  { id: 's1', name: 'Corte de Cabelo', duration: '60', price: '45' },
  { id: 's2', name: 'Manicure Gel', duration: '90', price: '35' },
  { id: 's3', name: 'Brushing', duration: '45', price: '25' },
];

const INITIAL_STAFF: StaffItem[] = [
  { id: 'p1', name: 'Ana Silva', role: 'Hairstylist', commission: '50', color: 'rose' },
  { id: 'p2', name: 'Beatriz Costa', role: 'Nail Artist', commission: '50', color: 'purple' },
];

const WEEKDAYS = [
  { id: 'seg', label: 'Seg' },
  { id: 'ter', label: 'Ter' },
  { id: 'qua', label: 'Qua' },
  { id: 'qui', label: 'Qui' },
  { id: 'sex', label: 'Sex' },
  { id: 'sab', label: 'Sáb' },
  { id: 'dom', label: 'Dom' }
];

export const OwnerOnboarding: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  // Form States
  const [services, setServices] = useState<ServiceItem[]>(INITIAL_SERVICES);
  const [staff, setStaff] = useState<StaffItem[]>(INITIAL_STAFF);
  const [schedule, setSchedule] = useState({
    openDays: ['seg', 'ter', 'qua', 'qui', 'sex', 'sab'],
    openTime: '09:00',
    closeTime: '19:00',
    lunchStart: '13:00',
    lunchEnd: '14:00'
  });

  // --- Handlers Services ---
  const handleServiceChange = (id: string, field: keyof ServiceItem, value: string) => {
    setServices(services.map(s => s.id === id ? { ...s, [field]: value } : s));
  };
  const addService = () => {
    setServices([...services, { id: `s${Date.now()}`, name: '', duration: '60', price: '' }]);
  };
  const removeService = (id: string) => {
    setServices(services.filter(s => s.id !== id));
  };

  // --- Handlers Staff ---
  const handleStaffChange = (id: string, field: keyof StaffItem, value: string) => {
    setStaff(staff.map(s => s.id === id ? { ...s, [field]: value } : s));
  };
  const addStaff = () => {
    const colors = ['rose', 'blue', 'emerald', 'purple', 'amber', 'cyan'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setStaff([...staff, { id: `p${Date.now()}`, name: '', role: '', commission: '50', color: randomColor }]);
  };
  const removeStaff = (id: string) => {
    setStaff(staff.filter(s => s.id !== id));
  };

  // --- Handlers Schedule ---
  const toggleDay = (dayId: string) => {
    if (schedule.openDays.includes(dayId)) {
      setSchedule({ ...schedule, openDays: schedule.openDays.filter(d => d !== dayId) });
    } else {
      setSchedule({ ...schedule, openDays: [...schedule.openDays, dayId] });
    }
  };

  // --- Finalize & Generate Data ---
  const handleFinish = async () => {
    setIsProcessing(true);
    
    // Simular processamento AI
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 1. Guardar Configurações Base
    const existingSettings = JSON.parse(localStorage.getItem('beauty_settings') || '{}');
    localStorage.setItem('beauty_settings', JSON.stringify({
      ...existingSettings,
      openDays: schedule.openDays,
      openTime: schedule.openTime,
      closeTime: schedule.closeTime,
      lunchStart: schedule.lunchStart,
      lunchEnd: schedule.lunchEnd,
      isOnboarded: true
    }));

    localStorage.setItem('owner_services_db', JSON.stringify(services));
    localStorage.setItem('owner_staff_db', JSON.stringify(staff.map(s => ({
      ...s,
      phone: '910000000', // Default phone
      vacations: []
    }))));

    // 2. Gerar Dados Fake Consistentes (50 marcações)
    const bookings: any[] = [];
    const clients = [
      { id: 'c1', name: 'Marta Oliveira', phone: '912345678' },
      { id: 'c2', name: 'Joana Silva', phone: '966666666' },
      { id: 'c3', name: 'Carla Mendes', phone: '934567890' },
      { id: 'c4', name: 'Beatriz Costa', phone: '911111111' },
      { id: 'c5', name: 'Diana Sousa', phone: '922222222' },
      { id: 'c6', name: 'Sara Nunes', phone: '913333333' },
      { id: 'c7', name: 'Patrícia Lima', phone: '914444444' },
      { id: 'c8', name: 'Sofia Rocha', phone: '915555555' }
    ];
    localStorage.setItem('owner_clients_db', JSON.stringify(clients.map(c => ({ ...c, email: 'cliente@exemplo.com', firstVisit: '2024-01-01', isBlocked: false }))));

    const times = ["09:00", "09:30", "10:30", "11:00", "14:00", "14:30", "16:00", "17:30", "18:00"];
    
    // Gerar 50 marcações (passado e futuro próximo)
    // Distribuição: -20 dias a +10 dias
    for(let i = 0; i < 50; i++) {
        const dateOffset = Math.floor(Math.random() * 30) - 20; // -20 a +10
        const date = new Date();
        date.setDate(date.getDate() + dateOffset);
        
        // Skip Sundays if not open
        if (date.getDay() === 0 && !schedule.openDays.includes('dom')) continue;

        const dateStr = date.toISOString().split('T')[0];
        const service = services[Math.floor(Math.random() * services.length)];
        const member = staff[Math.floor(Math.random() * staff.length)];
        const client = clients[Math.floor(Math.random() * clients.length)];
        
        if (!service || !member) continue;

        const isPast = dateOffset < 0;
        // Logic: Past is mostly completed or no-show. Future is confirmed.
        let status = 'confirmed';
        if (isPast) {
           const rand = Math.random();
           status = rand > 0.8 ? 'no-show' : rand > 0.7 ? 'cancelled' : 'completed';
        }

        bookings.push({
            id: `b_gen_${i}_${Date.now()}`,
            date: dateStr,
            time: times[Math.floor(Math.random() * times.length)],
            client: client.name,
            phone: client.phone,
            service: service.name,
            proId: member.id,
            priceValue: parseFloat(service.price.replace('€', '')),
            status,
            source: Math.random() > 0.4 ? 'app' : 'manual'
        });
    }

    localStorage.setItem('owner_bookings_db', JSON.stringify(bookings.filter(b => b.source === 'manual')));
    
    // App bookings need specific structure
    const appBookings = bookings.filter(b => b.source === 'app').map(b => ({
       id: b.id,
       date: b.date,
       time: b.time,
       status: b.status,
       userName: b.client,
       userPhone: b.phone,
       service: { name: b.service, price: `${b.priceValue}€`, duration: services.find(s => s.name === b.service)?.duration || '60' },
       professional: { id: b.proId, name: staff.find(s => s.id === b.proId)?.name || 'Staff' }
    }));
    localStorage.setItem('beauty_bookings', JSON.stringify(appBookings));

    // Logs Iniciais
    const logs = [
      { id: 'l1', type: 'system', message: 'Sistema Iniciado', details: 'Setup inicial concluído com sucesso.', timestamp: new Date().toISOString() },
      { id: 'l2', type: 'ai', message: 'Agenda Otimizada', details: 'A IA preencheu o calendário com base no histórico simulado.', timestamp: new Date().toISOString() },
      { id: 'l3', type: 'ai', message: 'Previsão de Faturação', details: 'Análise de tendência: Crescimento de 15% esperado.', timestamp: new Date().toISOString() }
    ];
    localStorage.setItem('beauty_logs_db', JSON.stringify(logs));
    localStorage.setItem('beauty_is_demo_active', 'true');

    showToast('success', 'Configuração Concluída!', 'O teu salão está pronto.');
    navigate('/owner/dashboard');
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
    else handleFinish();
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="min-h-screen bg-background text-white flex flex-col font-sans animate-fade-in">
      {/* Header Progresso */}
      <div className="pt-8 pb-6 px-6 border-b border-white/5 bg-surface/50 backdrop-blur-md sticky top-0 z-50">
         <div className="max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-6">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20">
                     <Building2 size={20} />
                  </div>
                  <div>
                     <h1 className="text-lg font-black uppercase italic tracking-tighter leading-none">Setup Inicial</h1>
                     <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Passo {currentStep} de 3</p>
                  </div>
               </div>
               <div className="flex gap-1">
                  {[1, 2, 3].map(s => (
                     <div key={s} className={`w-3 h-3 rounded-full transition-all duration-500 ${currentStep >= s ? 'bg-primary shadow-[0_0_10px_rgba(235,255,87,0.3)]' : 'bg-zinc-800'}`}></div>
                  ))}
               </div>
            </div>
            
            <h2 className="text-2xl font-black text-white italic uppercase tracking-tight mb-2">
               {STEPS[currentStep-1].title}
            </h2>
            <p className="text-sm text-zinc-400 font-medium">
               {STEPS[currentStep-1].desc}
            </p>
         </div>
      </div>

      {/* Conteúdo */}
      <div className="flex-grow overflow-y-auto px-6 py-8">
         <div className="max-w-3xl mx-auto space-y-8 pb-32">
            
            {/* STEP 1: SERVICES */}
            {currentStep === 1 && (
               <div className="space-y-4 animate-in slide-in-from-right duration-300">
                  {services.map((service, idx) => (
                     <div key={service.id} className="bg-surface p-5 rounded-3xl border border-white/5 flex gap-4 items-start group hover:border-white/10 transition-all shadow-sm">
                        <div className="w-8 h-8 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-xs font-black text-zinc-500 shrink-0 mt-2">
                           {idx + 1}
                        </div>
                        <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-4">
                           <div className="md:col-span-1">
                              <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1.5 block">Nome</label>
                              <input 
                                 value={service.name} 
                                 onChange={e => handleServiceChange(service.id, 'name', e.target.value)}
                                 className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white focus:border-primary focus:bg-white/10 transition-colors outline-none placeholder-zinc-600"
                                 placeholder="Ex: Corte"
                              />
                           </div>
                           <div className="grid grid-cols-2 gap-3 md:col-span-2">
                              <div>
                                 <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1.5 block">Preço (€)</label>
                                 <input 
                                    type="number"
                                    value={service.price} 
                                    onChange={e => handleServiceChange(service.id, 'price', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white focus:border-primary focus:bg-white/10 transition-colors outline-none placeholder-zinc-600"
                                    placeholder="0"
                                 />
                              </div>
                              <div className="relative">
                                 <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1.5 block">Duração (min)</label>
                                 <input 
                                    type="number"
                                    value={service.duration} 
                                    onChange={e => handleServiceChange(service.id, 'duration', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white focus:border-primary focus:bg-white/10 transition-colors outline-none placeholder-zinc-600"
                                    placeholder="60"
                                 />
                                 <button onClick={() => removeService(service.id)} className="absolute -right-3 -top-6 p-2 text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Trash2 size={16} />
                                 </button>
                              </div>
                           </div>
                        </div>
                     </div>
                  ))}
                  <button onClick={addService} className="w-full py-4 border border-dashed border-white/10 rounded-2xl text-zinc-500 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2">
                     <Plus size={16} /> Adicionar Serviço
                  </button>
               </div>
            )}

            {/* STEP 2: STAFF */}
            {currentStep === 2 && (
               <div className="space-y-4 animate-in slide-in-from-right duration-300">
                  {staff.map((member, idx) => (
                     <div key={member.id} className="bg-surface p-5 rounded-3xl border border-white/5 flex gap-4 items-start group hover:border-white/10 transition-all shadow-sm">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white shrink-0 mt-2 bg-${member.color}-500/20 text-${member.color}-400 border border-${member.color}-500/30`}>
                           {member.name.charAt(0) || '?'}
                        </div>
                        <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div>
                              <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1.5 block">Nome</label>
                              <input 
                                 value={member.name} 
                                 onChange={e => handleStaffChange(member.id, 'name', e.target.value)}
                                 className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white focus:border-primary focus:bg-white/10 transition-colors outline-none placeholder-zinc-600"
                                 placeholder="Ex: Ana"
                              />
                           </div>
                           <div className="relative">
                              <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1.5 block">Cargo</label>
                              <input 
                                 value={member.role} 
                                 onChange={e => handleStaffChange(member.id, 'role', e.target.value)}
                                 className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white focus:border-primary focus:bg-white/10 transition-colors outline-none placeholder-zinc-600"
                                 placeholder="Ex: Cabeleireira"
                              />
                              <button onClick={() => removeStaff(member.id)} className="absolute -right-3 -top-6 p-2 text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                 <Trash2 size={16} />
                              </button>
                           </div>
                        </div>
                     </div>
                  ))}
                  <button onClick={addStaff} className="w-full py-4 border border-dashed border-white/10 rounded-2xl text-zinc-500 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2">
                     <Plus size={16} /> Adicionar Membro
                  </button>
               </div>
            )}

            {/* STEP 3: SCHEDULE */}
            {currentStep === 3 && (
               <div className="space-y-8 animate-in slide-in-from-right duration-300">
                  <div className="bg-surface p-6 rounded-[2rem] border border-white/5">
                     <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4 block">Dias de Funcionamento</label>
                     <div className="flex flex-wrap gap-2">
                        {WEEKDAYS.map(day => (
                           <button
                              key={day.id}
                              onClick={() => toggleDay(day.id)}
                              className={`
                                 flex-1 min-w-[3rem] py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border
                                 ${schedule.openDays.includes(day.id)
                                    ? 'bg-primary border-primary text-background shadow-lg shadow-primary/20 scale-105' 
                                    : 'bg-white/5 border-white/10 text-zinc-500 hover:text-white hover:bg-white/10'
                                 }
                              `}
                           >
                              {day.label}
                           </button>
                        ))}
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div className="bg-surface p-5 rounded-[2rem] border border-white/5">
                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3">Horário Geral</p>
                        <div className="space-y-3">
                           <div>
                              <span className="text-[9px] text-zinc-600 font-bold uppercase block mb-1">Abertura</span>
                              <input type="time" value={schedule.openTime} onChange={e => setSchedule({...schedule, openTime: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white focus:border-primary focus:bg-white/10 transition-colors outline-none" />
                           </div>
                           <div>
                              <span className="text-[9px] text-zinc-600 font-bold uppercase block mb-1">Fecho</span>
                              <input type="time" value={schedule.closeTime} onChange={e => setSchedule({...schedule, closeTime: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white focus:border-primary focus:bg-white/10 transition-colors outline-none" />
                           </div>
                        </div>
                     </div>
                     <div className="bg-surface p-5 rounded-[2rem] border border-white/5">
                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3">Pausa Almoço</p>
                        <div className="space-y-3">
                           <div>
                              <span className="text-[9px] text-zinc-600 font-bold uppercase block mb-1">Início</span>
                              <input type="time" value={schedule.lunchStart} onChange={e => setSchedule({...schedule, lunchStart: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white focus:border-primary focus:bg-white/10 transition-colors outline-none" />
                           </div>
                           <div>
                              <span className="text-[9px] text-zinc-600 font-bold uppercase block mb-1">Fim</span>
                              <input type="time" value={schedule.lunchEnd} onChange={e => setSchedule({...schedule, lunchEnd: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white focus:border-primary focus:bg-white/10 transition-colors outline-none" />
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            )}

         </div>
      </div>

      {/* Footer Navigation */}
      <div className="p-6 border-t border-white/5 bg-background/80 backdrop-blur-md">
         <div className="max-w-3xl mx-auto flex gap-4">
            {currentStep > 1 && (
               <button 
                  onClick={prevStep}
                  className="px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white font-black uppercase text-xs tracking-widest transition-all"
               >
                  <ArrowLeft size={16} />
               </button>
            )}
            <Button 
               fullWidth 
               onClick={nextStep} 
               disabled={isProcessing}
               className="py-4 shadow-xl"
            >
               {isProcessing ? (
                  <Loader2 className="animate-spin" />
               ) : currentStep === 3 ? (
                  <>Finalizar & Gerar Dashboard <Sparkles size={16} className="ml-2" /></>
               ) : (
                  <>Próximo Passo <ArrowRight size={16} className="ml-2" /></>
               )}
            </Button>
         </div>
      </div>
    </div>
  );
};
