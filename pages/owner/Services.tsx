
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus, 
  Sparkles, 
  Clock, 
  Euro, 
  Trash2, 
  Edit2, 
  Layers, 
  Palette,
  X,
  Check
} from 'lucide-react';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';

interface ServiceGroup {
  id: string;
  name: string;
  color: string;
}

interface ServiceItem {
  id: string;
  name: string;
  duration: string; 
  price: string;
  groupId?: string;
}

const GROUP_COLORS = [
  'bg-pink-500', 'bg-purple-500', 'bg-indigo-500', 'bg-blue-500', 
  'bg-teal-500', 'bg-emerald-500', 'bg-orange-500', 'bg-rose-500'
];

export const OwnerServices: React.FC = () => {
  const navigate = useNavigate();

  const [services, setServices] = useState<ServiceItem[]>([]);
  const [groups, setGroups] = useState<ServiceGroup[]>([]);

  const [isServiceModalOpen, setServiceModalOpen] = useState(false);
  const [isGroupModalOpen, setGroupModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [editingGroup, setEditingGroup] = useState<ServiceGroup | null>(null);

  const [serviceForm, setServiceForm] = useState({ name: '', duration: '', price: '', groupId: '' });
  const [groupForm, setGroupForm] = useState({ name: '' });

  // 1. Load Data (Strict Real Mode)
  useEffect(() => {
    const savedServices = localStorage.getItem('owner_services_db');
    const savedGroups = localStorage.getItem('owner_groups_db');

    if (savedServices) {
      setServices(JSON.parse(savedServices));
    }
    if (savedGroups) {
      setGroups(JSON.parse(savedGroups));
    }
  }, []);

  const saveServices = (newServices: ServiceItem[]) => {
    setServices(newServices);
    localStorage.setItem('owner_services_db', JSON.stringify(newServices));
  };

  const saveGroups = (newGroups: ServiceGroup[]) => {
    setGroups(newGroups);
    localStorage.setItem('owner_groups_db', JSON.stringify(newGroups));
  };

  const handleOpenServiceModal = (service?: ServiceItem) => {
    if (service) {
      setEditingService(service);
      setServiceForm({ 
        name: service.name, 
        duration: service.duration, 
        price: service.price,
        groupId: service.groupId || ''
      });
    } else {
      setEditingService(null);
      setServiceForm({ name: '', duration: '60', price: '', groupId: '' });
    }
    setServiceModalOpen(true);
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingService) {
      const updated = services.map(s => s.id === editingService.id ? { ...editingService, ...serviceForm } : s);
      saveServices(updated);
    } else {
      const newService: ServiceItem = {
        id: Math.random().toString(36).substr(2, 9),
        ...serviceForm
      };
      saveServices([...services, newService]);
    }
    setServiceModalOpen(false);
  };

  const handleDeleteService = (id: string) => {
    if (window.confirm('Eliminar este serviço?')) {
      saveServices(services.filter(s => s.id !== id));
    }
  };

  const handleOpenGroupModal = (group?: ServiceGroup) => {
    if (group) {
      setEditingGroup(group);
      setGroupForm({ name: group.name });
    } else {
      setEditingGroup(null);
      setGroupForm({ name: '' });
    }
    setGroupModalOpen(true);
  };

  const handleSaveGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingGroup) {
      const updated = groups.map(g => g.id === editingGroup.id ? { ...editingGroup, ...groupForm } : g);
      saveGroups(updated);
    } else {
      const randomColor = GROUP_COLORS[Math.floor(Math.random() * GROUP_COLORS.length)];
      const newGroup: ServiceGroup = {
        id: Math.random().toString(36).substr(2, 9),
        name: groupForm.name,
        color: randomColor
      };
      saveGroups([...groups, newGroup]);
    }
    setGroupModalOpen(false);
  };

  const handleDeleteGroup = (id: string) => {
    if (window.confirm('Eliminar este grupo?')) {
      saveGroups(groups.filter(g => g.id !== id));
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 animate-fade-in pb-32">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
           <button onClick={() => navigate('/owner/dashboard')} className="mb-4 text-muted hover:text-white flex items-center gap-2 text-sm transition-colors group">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Voltar ao Dashboard
           </button>
           <h1 className="text-3xl font-black text-white tracking-tighter flex items-center gap-3">
              Serviços do Salão <Sparkles className="text-accent" size={28} />
           </h1>
           <p className="text-muted font-medium text-sm">Gira o teu menu de serviços e preçário.</p>
        </div>
        
        <button onClick={() => handleOpenServiceModal()} className="bg-accent hover:bg-accent/90 text-[#1E1E1E] px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-xs shadow-lg flex items-center gap-2 transition-all active:scale-95">
           <Plus size={16} strokeWidth={3} /> Novo Serviço
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
        {services.length === 0 ? (
          <div className="col-span-full py-12 text-center border border-dashed border-white/10 rounded-2xl">
            <p className="text-muted text-sm font-medium">Nenhum serviço criado.</p>
            <p className="text-zinc-600 text-xs mt-2">Crie o primeiro serviço para aparecer na App.</p>
          </div>
        ) : (
          services.map(service => {
            const group = groups.find(g => g.id === service.groupId);
            return (
              <div key={service.id} className="group bg-surface hover:bg-[#353535] p-5 rounded-2xl border border-white/5 hover:border-accent/30 transition-all duration-300 relative shadow-sm hover:shadow-lg">
                 <div className="flex justify-between items-start">
                    <div className="flex-grow">
                       <h3 className="text-lg font-bold text-white mb-1">{service.name}</h3>
                       <div className="flex items-center gap-4 text-xs font-medium text-muted uppercase tracking-wider">
                          <span className="flex items-center gap-1.5"><Clock size={12} className="text-accent" /> {service.duration} min</span>
                          <span className="w-1 h-1 rounded-full bg-white/10"></span>
                          <span className="flex items-center gap-1.5 text-white"><Euro size={12} className="text-accent" /> {service.price}€</span>
                       </div>
                       {group && (
                         <div className="mt-3 inline-block">
                           <span className={`text-[9px] font-black px-2 py-0.5 rounded-md ${group.color} bg-opacity-20 text-white uppercase tracking-widest border border-white/10`}>
                             {group.name}
                           </span>
                         </div>
                       )}
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button onClick={() => handleOpenServiceModal(service)} className="p-2 hover:bg-white/10 rounded-lg text-muted hover:text-white transition-colors"><Edit2 size={16} /></button>
                       <button onClick={() => handleDeleteService(service.id)} className="p-2 hover:bg-red-500/10 rounded-lg text-muted hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                    </div>
                 </div>
              </div>
            );
          })
        )}
      </div>

      {/* Secção Grupos */}
      <div className="border-t border-white/5 pt-12">
        <div className="flex justify-between items-center mb-8">
           <h2 className="text-xl font-bold text-white flex items-center gap-2"><Layers size={20} className="text-muted" /> Grupos de Serviços</h2>
           <button onClick={() => handleOpenGroupModal()} className="text-xs font-bold text-accent hover:text-white uppercase tracking-widest flex items-center gap-2 border border-accent/20 hover:border-accent hover:bg-accent/10 px-4 py-2 rounded-lg transition-all">
              <Plus size={14} /> Novo Grupo
           </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           {groups.map(group => (
              <div key={group.id} className="bg-surface p-4 rounded-xl border border-white/5 flex items-center justify-between group hover:shadow-md transition-all">
                 <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${group.color} shadow-sm`}></div>
                    <span className="text-sm font-bold text-white">{group.name}</span>
                 </div>
                 <div className="flex gap-1">
                    <button onClick={() => handleOpenGroupModal(group)} className="p-1.5 text-muted hover:text-white opacity-0 group-hover:opacity-100 transition-all"><Edit2 size={12} /></button>
                    <button onClick={() => handleDeleteGroup(group.id)} className="p-1.5 text-muted hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={12} /></button>
                 </div>
              </div>
           ))}
        </div>
      </div>

      {isServiceModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/90 backdrop-blur-sm" onClick={() => setServiceModalOpen(false)}></div>
          <div className="bg-[#252525] w-full max-w-md rounded-3xl p-8 relative z-10 border border-white/10 shadow-2xl">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white uppercase italic">{editingService ? 'Editar Serviço' : 'Novo Serviço'}</h3>
                <button onClick={() => setServiceModalOpen(false)}><X className="text-muted hover:text-white" size={20}/></button>
             </div>
             <form onSubmit={handleSaveService} className="space-y-4">
                <Input label="Nome do Serviço" required value={serviceForm.name} onChange={e => setServiceForm({...serviceForm, name: e.target.value})} placeholder="Ex: Tratamento Facial"/>
                <div className="grid grid-cols-2 gap-4">
                   <Input label="Preço (€)" type="number" required value={serviceForm.price} onChange={e => setServiceForm({...serviceForm, price: e.target.value})} icon={<Euro size={14}/>}/>
                   <Input label="Duração (min)" type="number" required value={serviceForm.duration} onChange={e => setServiceForm({...serviceForm, duration: e.target.value})} icon={<Clock size={14}/>}/>
                </div>
                <div className="flex flex-col gap-2">
                   <label className="text-sm font-medium text-gray-400 ml-1">Grupo (Opcional)</label>
                   <select className="bg-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent transition-all appearance-none" value={serviceForm.groupId} onChange={e => setServiceForm({...serviceForm, groupId: e.target.value})}>
                      <option value="">Sem grupo</option>
                      {groups.map(g => (<option key={g.id} value={g.id}>{g.name}</option>))}
                   </select>
                </div>
                <div className="pt-4"><Button fullWidth type="submit" className="bg-accent text-[#1E1E1E] font-bold uppercase tracking-widest shadow-xl"><Check size={18} className="mr-2" /> Guardar</Button></div>
             </form>
          </div>
        </div>
      )}

      {isGroupModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/90 backdrop-blur-sm" onClick={() => setGroupModalOpen(false)}></div>
          <div className="bg-[#252525] w-full max-w-sm rounded-3xl p-8 relative z-10 border border-white/10 shadow-2xl">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white uppercase italic">{editingGroup ? 'Editar Grupo' : 'Novo Grupo'}</h3>
                <button onClick={() => setGroupModalOpen(false)}><X className="text-muted hover:text-white" size={20}/></button>
             </div>
             <form onSubmit={handleSaveGroup} className="space-y-6">
                <Input label="Nome do Grupo" required value={groupForm.name} onChange={e => setGroupForm({...groupForm, name: e.target.value})} placeholder="Ex: Tratamentos Faciais" icon={<Palette size={14}/>}/>
                <div className="pt-2"><Button fullWidth type="submit" className="bg-accent text-[#1E1E1E] font-bold uppercase tracking-widest shadow-xl"><Check size={18} className="mr-2" /> Guardar Grupo</Button></div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};
