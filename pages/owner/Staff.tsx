
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus, 
  Users, 
  User, 
  Percent, 
  CalendarOff, 
  Trash2, 
  Edit2, 
  X, 
  Check, 
  Palmtree,
  Share2
} from 'lucide-react';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { useToast } from '../../components/Toast';

interface VacationPeriod {
  id: string;
  start: string;
  end: string;
}

interface StaffMember {
  id: string;
  name: string;
  role: string;
  color: string;
  commission: string;
  phone: string;
  vacations: VacationPeriod[];
}

const COLOR_PRESETS = [
  { id: 'rose', name: 'Rosa', bg: 'bg-rose-500', text: 'text-rose-400', border: 'border-rose-500/20', soft: 'bg-rose-500/10' },
  { id: 'blue', name: 'Azul', bg: 'bg-blue-500', text: 'text-blue-400', border: 'border-blue-500/20', soft: 'bg-blue-500/10' },
  { id: 'emerald', name: 'Verde', bg: 'bg-emerald-500', text: 'text-emerald-400', border: 'border-emerald-500/20', soft: 'bg-emerald-500/10' },
  { id: 'purple', name: 'Roxo', bg: 'bg-purple-500', text: 'text-purple-400', border: 'border-purple-500/20', soft: 'bg-purple-500/10' },
  { id: 'amber', name: 'Âmbar', bg: 'bg-amber-500', text: 'text-amber-400', border: 'border-amber-500/20', soft: 'bg-amber-500/10' },
  { id: 'cyan', name: 'Ciano', bg: 'bg-cyan-500', text: 'text-cyan-400', border: 'border-cyan-500/20', soft: 'bg-cyan-500/10' },
];

export const OwnerStaff: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [isStaffModalOpen, setStaffModalOpen] = useState(false);
  const [isVacationModalOpen, setVacationModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [selectedStaffForVacation, setSelectedStaffForVacation] = useState<StaffMember | null>(null);
  const [staffForm, setStaffForm] = useState({ name: '', role: '', commission: '', phone: '', color: 'rose' });
  const [vacationForm, setVacationForm] = useState({ start: '', end: '' });

  // 1. Load Data (Strict Real Mode)
  useEffect(() => {
    const saved = localStorage.getItem('owner_staff_db');
    if (saved) {
      setStaff(JSON.parse(saved));
    }
  }, []);

  const saveStaffData = (newData: StaffMember[]) => {
    setStaff(newData);
    localStorage.setItem('owner_staff_db', JSON.stringify(newData));
  };

  const handleOpenStaffModal = (member?: StaffMember) => {
    if (member) {
      setEditingStaff(member);
      setStaffForm({ 
        name: member.name, 
        role: member.role, 
        commission: member.commission, 
        phone: member.phone,
        color: member.color 
      });
    } else {
      setEditingStaff(null);
      setStaffForm({ name: '', role: '', commission: '', phone: '', color: 'rose' });
    }
    setStaffModalOpen(true);
  };

  const handleSaveStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStaff) {
      const updated = staff.map(s => s.id === editingStaff.id ? { ...editingStaff, ...staffForm } : s);
      saveStaffData(updated);
      showToast('success', 'Perfil Atualizado', `${staffForm.name} foi guardado.`);
    } else {
      const newMember: StaffMember = {
        id: Math.random().toString(36).substr(2, 9),
        vacations: [],
        ...staffForm
      };
      saveStaffData([...staff, newMember]);
      showToast('success', 'Novo Especialista', `${staffForm.name} adicionado à equipa.`);
    }
    setStaffModalOpen(false);
  };

  const handleDeleteStaff = (id: string) => {
    if (confirm("Tem a certeza? Isto removerá o histórico deste profissional.")) {
      saveStaffData(staff.filter(s => s.id !== id));
      showToast('info', 'Removido', 'Especialista removido da base de dados.');
    }
  };

  const handleCopyReferralLink = (member: StaffMember) => {
    const baseUrl = window.location.origin + window.location.pathname;
    const link = `${baseUrl}#/referral/${member.id}`;
    navigator.clipboard.writeText(link).then(() => {
      showToast('ai', 'Link de Indicação', `Copiado para ${member.name}.`);
    });
  };

  const handleOpenVacationModal = (member: StaffMember) => {
    setSelectedStaffForVacation(member);
    setVacationForm({ start: '', end: '' });
    setVacationModalOpen(true);
  };

  const handleAddVacation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStaffForVacation || !vacationForm.start || !vacationForm.end) return;

    const newVacation: VacationPeriod = {
      id: Math.random().toString(36).substr(2, 9),
      start: vacationForm.start,
      end: vacationForm.end
    };

    const updatedStaff = staff.map(s => {
      if (s.id === selectedStaffForVacation.id) {
        return { ...s, vacations: [...s.vacations, newVacation].sort((a,b) => new Date(a.start).getTime() - new Date(b.start).getTime()) };
      }
      return s;
    });

    saveStaffData(updatedStaff);
    setSelectedStaffForVacation(updatedStaff.find(s => s.id === selectedStaffForVacation.id) || null);
    setVacationForm({ start: '', end: '' });
    showToast('success', 'Férias Registadas', 'O calendário foi bloqueado nestas datas.');
  };

  const handleDeleteVacation = (vacationId: string) => {
    if (!selectedStaffForVacation) return;
    const updatedStaff = staff.map(s => {
      if (s.id === selectedStaffForVacation.id) {
        return { ...s, vacations: s.vacations.filter(v => v.id !== vacationId) };
      }
      return s;
    });
    saveStaffData(updatedStaff);
    setSelectedStaffForVacation(updatedStaff.find(s => s.id === selectedStaffForVacation.id) || null);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 animate-fade-in pb-32">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
           <button onClick={() => navigate('/owner/dashboard')} className="mb-4 text-muted hover:text-white flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-all group">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Voltar ao Dashboard
           </button>
           <h1 className="text-3xl font-black text-white tracking-tighter flex items-center gap-3">
              Equipa do Salão <Users className="text-accent" size={28} />
           </h1>
           <p className="text-muted font-medium text-sm">Gira os teus profissionais, comissões e ausências.</p>
        </div>
        <button onClick={() => handleOpenStaffModal()} className="bg-accent hover:bg-accent/90 text-[#1E1E1E] px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-xs shadow-lg flex items-center gap-2 transition-all active:scale-95">
           <Plus size={16} strokeWidth={3} /> Novo Profissional
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {staff.length === 0 ? (
          <div className="col-span-full py-12 text-center border border-dashed border-white/10 rounded-2xl">
            <p className="text-muted text-sm">Nenhum profissional adicionado.</p>
            <p className="text-zinc-600 text-xs mt-2">Comece por adicionar a sua equipa.</p>
          </div>
        ) : (
          staff.map(member => {
            const colorPreset = COLOR_PRESETS.find(c => c.id === member.color) || COLOR_PRESETS[0];
            const nextVacation = member.vacations.find(v => new Date(v.end) >= new Date());

            return (
              <div key={member.id} className="bg-surface hover:bg-[#353535] p-6 rounded-2xl border border-white/5 hover:border-accent/30 transition-all duration-300 shadow-sm relative group">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div onClick={() => navigate(`/staff/view/${member.id}`)} className={`w-14 h-14 rounded-2xl ${colorPreset.soft} ${colorPreset.border} border flex items-center justify-center text-xl font-bold ${colorPreset.text} cursor-pointer hover:scale-105 transition-transform`}>
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white leading-none mb-1.5">{member.name}</h3>
                      <p className="text-[11px] font-medium text-muted uppercase tracking-wider">{member.role || 'Geral'}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => handleCopyReferralLink(member)} className="p-2 bg-accent/10 hover:bg-accent rounded-lg text-accent hover:text-[#1E1E1E] transition-all"><Share2 size={16} /></button>
                    <div className="w-px h-8 bg-white/10 mx-1"></div>
                    <button onClick={() => handleOpenStaffModal(member)} className="p-2 hover:bg-white/10 rounded-lg text-muted hover:text-white transition-colors"><Edit2 size={16} /></button>
                    <button onClick={() => handleDeleteStaff(member.id)} className="p-2 hover:bg-red-500/10 rounded-lg text-muted hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-background/50 p-3 rounded-xl border border-white/5">
                    <p className="text-[11px] font-bold text-muted uppercase tracking-widest mb-1">Comissão</p>
                    <p className="text-sm font-bold text-white flex items-center gap-1"><Percent size={12} className="text-accent" /> {member.commission || '0'}%</p>
                  </div>
                  <div className="bg-background/50 p-3 rounded-xl border border-white/5">
                    <p className="text-[11px] font-bold text-muted uppercase tracking-widest mb-1">Agenda</p>
                    <button onClick={() => navigate(`/staff/view/${member.id}`)} className="text-[11px] font-bold text-accent hover:underline flex items-center gap-1 uppercase tracking-tighter">Ver Agenda Pessoal</button>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2 text-[11px] text-gray-400 font-bold uppercase tracking-tight">
                     <Palmtree size={14} className={nextVacation ? 'text-orange-400' : 'text-gray-600'} />
                     {nextVacation ? <span>Férias: {new Date(nextVacation.start).getDate()}/{new Date(nextVacation.start).getMonth()+1} a {new Date(nextVacation.end).getDate()}/{new Date(nextVacation.end).getMonth()+1}</span> : <span>Sem férias marcadas</span>}
                  </div>
                  <button onClick={() => handleOpenVacationModal(member)} className="text-[11px] font-bold uppercase tracking-widest text-accent hover:text-white hover:underline transition-all">Gerir Férias</button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {isStaffModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/90 backdrop-blur-sm" onClick={() => setStaffModalOpen(false)}></div>
          <div className="bg-[#252525] w-full max-w-md rounded-3xl p-8 relative z-10 border border-white/10 shadow-2xl">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white uppercase italic">{editingStaff ? 'Editar Profissional' : 'Novo Profissional'}</h3>
                <button onClick={() => setStaffModalOpen(false)}><X className="text-muted hover:text-white" size={20}/></button>
             </div>
             <form onSubmit={handleSaveStaff} className="space-y-5">
                <Input label="Nome Completo" required value={staffForm.name} onChange={e => setStaffForm({...staffForm, name: e.target.value})} icon={<User size={16}/>} />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Cargo / Função" placeholder="Ex: Cabeleireira" required value={staffForm.role} onChange={e => setStaffForm({...staffForm, role: e.target.value})} />
                  <Input label="Comissão (%)" type="number" placeholder="0" required value={staffForm.commission} onChange={e => setStaffForm({...staffForm, commission: e.target.value})} icon={<Percent size={14}/>} />
                </div>
                <div className="space-y-2">
                   <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">Cor Identificadora</label>
                   <div className="flex gap-2 flex-wrap">
                      {COLOR_PRESETS.map(preset => (
                        <button key={preset.id} type="button" onClick={() => setStaffForm({...staffForm, color: preset.id})} className={`w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center ${preset.bg} ${staffForm.color === preset.id ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                          {staffForm.color === preset.id && <Check size={14} className="text-white" />}
                        </button>
                      ))}
                   </div>
                </div>
                <div className="pt-4"><Button fullWidth type="submit" className="bg-accent text-[#1E1E1E] font-bold uppercase tracking-widest shadow-xl"><Check size={18} className="mr-2" /> Guardar Perfil</Button></div>
             </form>
          </div>
        </div>
      )}

      {isVacationModalOpen && selectedStaffForVacation && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/90 backdrop-blur-sm" onClick={() => setVacationModalOpen(false)}></div>
          <div className="bg-[#252525] w-full max-w-md rounded-3xl p-8 relative z-10 border border-white/10 shadow-2xl">
             <div className="flex justify-between items-center mb-6">
                <div><h3 className="text-xl font-bold text-white uppercase italic">Férias</h3><p className="text-xs text-accent font-bold uppercase tracking-widest mt-1">{selectedStaffForVacation.name}</p></div>
                <button onClick={() => setVacationModalOpen(false)}><X className="text-muted hover:text-white" size={20}/></button>
             </div>
             <div className="mb-8 space-y-3 max-h-[200px] overflow-y-auto pr-2 scrollbar-thin">
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Períodos Agendados</p>
                {selectedStaffForVacation.vacations.length === 0 ? <p className="text-sm text-muted italic">Sem férias marcadas.</p> : selectedStaffForVacation.vacations.map(vac => (
                    <div key={vac.id} className="flex items-center justify-between bg-surface p-3 rounded-xl border border-white/5">
                       <div className="flex items-center gap-3"><CalendarOff size={16} className="text-orange-400" /><div className="text-[11px] font-bold uppercase text-gray-200"><span className="font-medium">{new Date(vac.start).toLocaleDateString('pt-PT')}</span><span className="mx-2 text-gray-600">→</span><span className="font-medium">{new Date(vac.end).toLocaleDateString('pt-PT')}</span></div></div>
                       <button onClick={() => handleDeleteVacation(vac.id)} className="p-1.5 text-muted hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"><Trash2 size={14} /></button>
                    </div>
                  ))}
             </div>
             <form onSubmit={handleAddVacation} className="border-t border-white/5 pt-6">
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4">Adicionar Novo Período</p>
                <div className="grid grid-cols-2 gap-4 mb-4"><Input label="Início" type="date" required value={vacationForm.start} onChange={e => setVacationForm({...vacationForm, start: e.target.value})} /><Input label="Fim" type="date" required value={vacationForm.end} onChange={e => setVacationForm({...vacationForm, end: e.target.value})} /></div>
                <Button fullWidth type="submit" className="bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold uppercase tracking-widest text-[11px]"><Plus size={14} className="mr-2" /> Verificar & Adicionar</Button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};
