
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Search, 
  User, 
  Phone, 
  Star, 
  History, 
  Trophy, 
  Mail, 
  Sparkles, 
  Calendar, 
  Edit2, 
  X, 
  Check, 
  UserPlus, 
  AlertTriangle, 
  ShieldCheck, 
  Ban,
  Monitor 
} from 'lucide-react';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { useToast } from '../../components/Toast';

// Interfaces
interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  notes?: string;
  firstVisit?: string;
  lastVisit?: string;
  isBlocked?: boolean;
}

interface BookingHistory {
  id: string;
  date: string;
  service: string;
  price: string;
  status: string;
}

export const OwnerClients: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Estados
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientHistory, setClientHistory] = useState<BookingHistory[]>([]);

  // Estados de Edição/Criação
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Client>>({});
  const [addForm, setAddForm] = useState({ name: '', phone: '', email: '', notes: '' });

  // 1. Load Data (Strict Real Mode - No Fake Seeding)
  useEffect(() => {
    const savedClients = localStorage.getItem('owner_clients_db');
    if (savedClients) {
      setClients(JSON.parse(savedClients));
    }
  }, []);

  // 2. Helpers
  const getFullHistory = () => {
    const ownerBookings = JSON.parse(localStorage.getItem('owner_bookings_db') || '[]');
    const appBookings = JSON.parse(localStorage.getItem('beauty_bookings') || '[]');
    return [
      ...ownerBookings.map((b: any) => ({
        id: b.id,
        date: b.date,
        service: b.service,
        status: b.status,
        clientName: b.client,
        clientPhone: b.phone
      })),
      ...appBookings.map((b: any) => ({
        id: b.id,
        date: b.date,
        service: b.service.name,
        status: b.status,
        clientName: b.userName,
        clientPhone: b.userPhone
      }))
    ];
  };

  const calculateRisk = (client: Client) => {
    const allBookings = getFullHistory();
    const now = new Date();
    const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));

    const clientBadBookings = allBookings.filter(b => 
      (b.clientPhone === client.phone || b.clientName?.toLowerCase().includes(client.name.toLowerCase())) &&
      (b.status === 'cancelled' || b.status === 'no-show') &&
      new Date(b.date) >= thirtyDaysAgo
    );

    const count = clientBadBookings.length;
    if (count > 3) return { level: 'Alto', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', count };
    if (count >= 2) return { level: 'Médio', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', count };
    return { level: 'Baixo', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', count };
  };

  const getClientHistory = (client: Client) => {
    const history = getFullHistory().filter((b: any) => 
      b.clientName?.toLowerCase().includes(client.name.toLowerCase()) || 
      b.clientPhone === client.phone
    ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return history;
  };

  const getClientCategory = (historyCount: number) => {
    if (historyCount >= 10) return { label: 'VIP', color: 'text-amber-300', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: Trophy };
    if (historyCount >= 3) return { label: 'Fidelizada', color: 'text-blue-300', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: Star };
    return { label: 'Nova', color: 'text-emerald-300', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: Sparkles };
  };

  const handleOpenClient = (client: Client) => {
    const history = getClientHistory(client);
    setClientHistory(history);
    setSelectedClient(client);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseClient = () => {
    setSelectedClient(null);
  };

  const handleToggleBlock = (client: Client) => {
    const newState = !client.isBlocked;
    const updatedClients = clients.map(c => 
      c.id === client.id ? { ...c, isBlocked: newState } : c
    );
    setClients(updatedClients);
    localStorage.setItem('owner_clients_db', JSON.stringify(updatedClients));
    setSelectedClient({ ...client, isBlocked: newState });
    
    showToast(
      newState ? 'error' : 'success', 
      newState ? 'Cliente Bloqueado' : 'Acesso Restaurado', 
      newState ? `Reservas suspensas para ${client.name}.` : `${client.name} pode voltar a agendar.`
    );
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient || !editForm.name || !editForm.phone) return;

    const updatedClients = clients.map(c => 
      c.id === selectedClient.id ? { ...c, ...editForm } as Client : c
    );

    setClients(updatedClients);
    localStorage.setItem('owner_clients_db', JSON.stringify(updatedClients));
    setSelectedClient({ ...selectedClient, ...editForm } as Client);
    setIsEditModalOpen(false);
  };

  const handleSaveNewClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.name || !addForm.phone) return;

    const newClient: Client = {
      id: Math.random().toString(36).substr(2, 9),
      ...addForm,
      firstVisit: new Date().toISOString().split('T')[0],
      isBlocked: false
    };

    const updated = [newClient, ...clients];
    setClients(updated);
    localStorage.setItem('owner_clients_db', JSON.stringify(updated));
    setIsAddModalOpen(false);
    setAddForm({ name: '', phone: '', email: '', notes: '' });
    showToast('success', 'Cliente Criado', 'Base de dados atualizada.');
  };

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone.includes(searchTerm)
  );

  // ... (REST OF THE RENDER LOGIC REMAINS IDENTICAL TO ORIGINAL, JUST RE-INSERTING)
  // ... (Keeping View Details & List View logic same, focusing on the empty state in List View)

  if (selectedClient) {
    // ... (Detail View Logic - Same as before)
    const historyCount = clientHistory.length;
    const category = getClientCategory(historyCount);
    const risk = calculateRisk(selectedClient);
    const CategoryIcon = category.icon;

    return (
      <div className="max-w-5xl mx-auto py-8 px-4 animate-in slide-in-from-right duration-300 pb-32">
        <button onClick={handleCloseClient} className="mb-8 text-muted hover:text-white flex items-center gap-2 text-sm transition-colors group px-4 py-2 rounded-lg hover:bg-white/5 w-fit">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Voltar à lista
        </button>

        <div className="relative bg-surface rounded-[2rem] p-8 border border-white/5 overflow-hidden mb-8 shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-[1.5rem] bg-gradient-to-br from-surface to-background border border-white/10 flex items-center justify-center text-4xl font-bold text-white shadow-xl relative">
                {selectedClient.name.charAt(0)}
                {selectedClient.isBlocked && <div className="absolute -top-2 -right-2 bg-red-500 p-2 rounded-full border-4 border-surface text-white"><Ban size={16} /></div>}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">{selectedClient.name}</h1>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${category.bg} ${category.color} ${category.border} flex items-center gap-1.5`}>
                    <CategoryIcon size={12} /> {category.label}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm text-gray-400">
                  <span className="flex items-center gap-2 font-medium"><Phone size={14} className="text-accent" /> {selectedClient.phone}</span>
                  <span className="flex items-center gap-2 font-medium"><Mail size={14} /> {selectedClient.email || 'Sem email'}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <button onClick={() => setIsEditModalOpen(true)} className="flex-1 md:flex-none bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs border border-white/10 flex items-center justify-center gap-2 transition-all active:scale-95"><Edit2 size={16} /> Editar</button>
              <button onClick={() => handleToggleBlock(selectedClient)} className={`flex-1 md:flex-none px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all active:scale-95 border ${selectedClient.isBlocked ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>{selectedClient.isBlocked ? <ShieldCheck size={16} /> : <Ban size={16} />} {selectedClient.isBlocked ? 'Desbloquear' : 'Bloquear'}</button>
            </div>
          </div>
        </div>

        {/* History Section */}
        <div className="bg-surface rounded-2xl p-8 border border-white/5">
           <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><History size={18} className="text-accent" /> Histórico</h3>
           <div className="relative pl-4 space-y-8">
              <div className="absolute left-4 top-2 bottom-4 w-px bg-white/10"></div>
              {clientHistory.length === 0 ? (
                 <p className="text-sm text-muted italic pl-6">Sem histórico disponível.</p>
              ) : (
                clientHistory.map((booking, idx) => (
                  <div key={idx} className="relative pl-8 group">
                     <div className={`absolute left-[11px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-surface transition-all ${booking.status === 'completed' ? 'bg-accent' : booking.status === 'cancelled' ? 'bg-red-400' : 'bg-blue-400'}`}></div>
                     <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                        <div>
                           <div className="flex items-center gap-3 mb-1">
                              <span className="text-white font-bold text-base">{booking.service}</span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase bg-white/5">{booking.status}</span>
                           </div>
                           <div className="flex items-center gap-3 text-xs text-muted"><span className="flex items-center gap-1"><Calendar size={12}/> {new Date(booking.date).toLocaleDateString('pt-PT')}</span></div>
                        </div>
                     </div>
                  </div>
                ))
              )}
           </div>
        </div>

        {isEditModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-background/90 backdrop-blur-sm" onClick={() => setIsEditModalOpen(false)}></div>
            <div className="bg-surface w-full max-w-md rounded-[2.5rem] p-10 relative z-10 border border-white/10 shadow-2xl">
               <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-bold text-white uppercase italic">Editar</h3>
                  <button onClick={() => setIsEditModalOpen(false)}><X size={24} className="text-muted"/></button>
               </div>
               <form onSubmit={handleSaveEdit} className="space-y-5">
                  <Input label="Nome" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} />
                  <Input label="Telemóvel" value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})} />
                  <textarea className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-white text-sm" value={editForm.notes} onChange={e => setEditForm({...editForm, notes: e.target.value})} placeholder="Notas..." />
                  <Button fullWidth type="submit">Atualizar</Button>
               </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 animate-fade-in pb-32">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
           <button onClick={() => navigate('/owner/dashboard')} className="mb-4 text-muted hover:text-white flex items-center gap-2 text-sm transition-colors group"><ArrowLeft size={16} /> Voltar ao Dashboard</button>
           <h1 className="text-4xl font-black text-white tracking-tighter flex items-center gap-3 mb-2">Clientes <span className="text-accent text-2xl bg-accent/10 px-2 py-1 rounded-lg border border-accent/20">{filteredClients.length}</span></h1>
           <p className="text-muted font-medium text-sm">Base de dados de clientes.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
           <div className="relative flex-grow md:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
              <input type="text" placeholder="Procurar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-surface border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-accent transition-all" />
           </div>
           <button onClick={() => setIsAddModalOpen(true)} className="bg-accent hover:bg-accent/90 text-background px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95"><UserPlus size={18} /> Novo Cliente</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClients.length === 0 ? (
          <div className="col-span-full py-24 text-center border border-dashed border-white/10 rounded-3xl bg-surface/30">
            <User size={48} className="mx-auto text-muted mb-4 opacity-20" />
            <p className="text-muted text-sm font-bold uppercase tracking-widest">Nenhum cliente registado.</p>
            <p className="text-zinc-600 text-xs mt-2">Adicione o seu primeiro cliente para começar.</p>
          </div>
        ) : (
          filteredClients.map(client => (
            <button key={client.id} onClick={() => handleOpenClient(client)} className={`group relative w-full bg-surface text-left rounded-[2rem] p-6 border transition-all duration-300 hover:shadow-2xl active:scale-[0.98] overflow-hidden ${client.isBlocked ? 'border-red-500/30' : 'border-white/5 hover:border-primary/30'}`}>
               <div className="flex items-center gap-4 mb-4">
                  <div className={`w-14 h-14 rounded-2xl bg-background border border-white/10 flex items-center justify-center text-xl font-bold transition-colors ${client.isBlocked ? 'text-red-500' : 'text-gray-400 group-hover:text-primary'}`}>{client.name.charAt(0)}</div>
                  <div>
                     <h3 className="text-base font-black text-white italic uppercase tracking-tight truncate max-w-[120px]">{client.name}</h3>
                     <p className="text-[10px] text-muted font-black uppercase tracking-widest mt-1 flex items-center gap-1.5"><Phone size={10} /> {client.phone}</p>
                  </div>
               </div>
            </button>
          ))
        )}
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 animate-in zoom-in-95 duration-200">
          <div className="absolute inset-0 bg-background/95 backdrop-blur-md" onClick={() => setIsAddModalOpen(false)}></div>
          <div className="bg-surface w-full max-w-md rounded-[2.5rem] p-10 relative z-10 border border-white/10 shadow-2xl pb-40">
             <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Novo Cliente</h3>
                <button onClick={() => setIsAddModalOpen(false)}><X size={24} className="text-muted hover:text-white"/></button>
             </div>
             <form onSubmit={handleSaveNewClient} className="space-y-5">
                <Input label="Nome" required value={addForm.name} onChange={e => setAddForm({...addForm, name: e.target.value})} />
                <Input label="Telemóvel" required value={addForm.phone} onChange={e => setAddForm({...addForm, phone: e.target.value})} />
                <Input label="Email" value={addForm.email} onChange={e => setAddForm({...addForm, email: e.target.value})} />
                <div className="pt-6"><Button fullWidth type="submit" className="py-4 font-black uppercase">Registar</Button></div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};
