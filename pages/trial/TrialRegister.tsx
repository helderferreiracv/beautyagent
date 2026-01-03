
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Building2, 
  Smartphone, 
  Sparkles, 
  Check, 
  Loader2, 
  ShieldCheck,
  User
} from 'lucide-react';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { useToast } from '../../components/Toast';

export const TrialRegister: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [step, setStep] = useState<'details' | 'otp' | 'success'>('details');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ salonName: '', phone: '', ownerName: '' });
  const [otp, setOtp] = useState('');

  const handleStartTrial = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('otp');
      showToast('info', 'Código Enviado', 'Verifica o SMS (Demo: 123456)');
    }, 1000);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp !== '123456') {
      showToast('error', 'Código Inválido', 'Usa o código 123456 para a demonstração.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      // Configuração Básica do Trial (sem dados pesados, o Onboarding trata disso)
      localStorage.setItem('beauty_trial_start', new Date().toISOString());
      localStorage.setItem('beauty_settings', JSON.stringify({
        requireNoShowApproval: false,
        notifyOnCancel: true,
        loyaltyEnabled: true,
        aiAggressiveness: 'medium',
        forceAIProSelection: false,
        openTime: '09:00',
        closeTime: '19:00',
        salonName: formData.salonName,
        commissionModel: 'salon_pays',
        isOnboarded: false // Flag para controlo
      }));
      
      setLoading(false);
      setStep('success');
      showToast('success', 'Trial Ativado', 'Bem-vindo ao BeautyAgent!');
    }, 1500);
  };

  if (step === 'success') {
    return (
      <div className="max-w-md mx-auto py-20 text-center animate-fade-in px-4">
        <div className="w-24 h-24 bg-primary/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border border-primary/20 shadow-2xl">
          <Sparkles className="text-primary animate-pulse" size={48} strokeWidth={2.5} />
        </div>
        <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic mb-4 leading-none">Conta Criada!</h1>
        <p className="text-muted text-sm leading-relaxed mb-10 font-medium">
          Vamos agora configurar o teu salão em 3 passos simples. <br/>
          Serviços, Staff e Horários.
        </p>
        <Button fullWidth onClick={() => navigate('/owner/onboarding')} className="py-5 font-black shadow-xl shadow-primary/20 rounded-2xl">
          Iniciar Configuração
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-12 animate-fade-in px-4">
      <button onClick={() => navigate('/')} className="mb-10 text-muted hover:text-white flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all group">
        <ArrowLeft size={14} /> Início
      </button>

      <div className="mb-10">
        <h1 className="text-3xl font-black text-white mb-2 tracking-tighter uppercase italic leading-none">Começar Trial</h1>
        <p className="text-muted text-sm font-medium">Ativa a tua instância digital em 60 segundos.</p>
      </div>

      <div className="bg-surface rounded-[2.5rem] p-8 border border-white/5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
        
        {step === 'details' ? (
          <form onSubmit={handleStartTrial} className="space-y-6">
            <Input label="Nome do Salão" placeholder="Ex: Studio Beauty Pro" required value={formData.salonName} onChange={e => setFormData({...formData, salonName: e.target.value})} icon={<Building2 size={16} />} />
            <Input label="O Teu Nome" placeholder="Identificação de Gestora" required value={formData.ownerName} onChange={e => setFormData({...formData, ownerName: e.target.value})} icon={<User size={16} />} />
            <Input label="Telemóvel" placeholder="9xxxxxxxx" type="tel" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} icon={<Smartphone size={16} />} />
            <div className="pt-4">
              <Button fullWidth type="submit" disabled={loading} className="py-5 font-black shadow-lg shadow-primary/20 rounded-2xl">
                {loading ? <Loader2 className="animate-spin" /> : 'Criar Conta Grátis'}
              </Button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-8">
            <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 text-center">
               <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1 italic">Demo Access Code</p>
               <p className="text-white font-mono font-bold text-lg">123456</p>
            </div>
            <Input label="Código de Validação" placeholder="000000" maxLength={6} value={otp} onChange={e => setOtp(e.target.value)} className="text-center tracking-[0.5em] font-mono text-xl h-16 rounded-2xl" icon={<ShieldCheck size={18} />} />
            <Button fullWidth type="submit" disabled={loading} className="py-5 font-black h-auto rounded-2xl shadow-xl shadow-primary/20">
              {loading ? <Loader2 className="animate-spin" /> : 'Verificar & Avançar'}
            </Button>
            
            <button 
              type="button"
              onClick={() => setStep('details')}
              className="w-full text-[10px] font-black text-zinc-500 uppercase tracking-widest hover:text-white transition-colors"
            >
              Alterar número de telefone
            </button>
          </form>
        )}
      </div>

      <div className="mt-8 flex items-center justify-center gap-8 opacity-40">
         <div className="flex items-center gap-2 grayscale">
            <Sparkles size={14} />
            <span className="text-[10px] font-bold uppercase tracking-widest">AI Audit System</span>
         </div>
         <div className="flex items-center gap-2 grayscale">
            <Check size={14} />
            <span className="text-[10px] font-bold uppercase tracking-widest">No Credit Card</span>
         </div>
      </div>
    </div>
  );
};
