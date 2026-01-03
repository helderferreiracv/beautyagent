
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Building2, 
  Smartphone, 
  Sparkles, 
  Check, 
  Loader2,
  ShieldCheck
} from 'lucide-react';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';

export const TrialRegister: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'details' | 'otp' | 'success'>('details');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ salonName: '', phone: '', ownerName: '' });
  const [otp, setOtp] = useState('');

  const handleStartTrial = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simular envio de SMS
    setTimeout(() => {
      setLoading(false);
      setStep('otp');
    }, 1200);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp !== '123456') {
      alert("Código inválido. Usa 123456 para a demo.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      // Setup inicial do salão no localStorage
      localStorage.setItem('beauty_trial_start', new Date().toISOString());
      localStorage.setItem('beauty_settings', JSON.stringify({
        requireNoShowApproval: false,
        notifyOnCancel: true,
        loyaltyEnabled: true,
        aiAggressiveness: 'medium',
        forceAIProSelection: false,
        openTime: '09:00',
        closeTime: '19:00',
        salonName: formData.salonName
      }));
      
      setLoading(false);
      setStep('success');
    }, 1500);
  };

  if (step === 'success') {
    return (
      <div className="max-w-md mx-auto py-20 text-center animate-fade-in">
        <div className="w-24 h-24 bg-primary/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border border-primary/20">
          <Check className="text-primary" size={48} strokeWidth={3} />
        </div>
        <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic mb-4">Bem-vinda a Bordo!</h1>
        <p className="text-muted text-sm leading-relaxed mb-10 font-medium">
          O teu trial de 7 dias grátis está ativo. <br/>
          Vamos configurar o teu menu de serviços e equipa.
        </p>
        <Button fullWidth onClick={() => navigate('/owner/dashboard')} className="py-5 bg-primary text-black hover:bg-white shadow-lg shadow-primary/20 font-black">
          Aceder ao Painel Owner
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-12 animate-fade-in px-4">
      <button 
        onClick={() => navigate('/')} 
        className="mb-10 text-muted hover:text-white flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all group"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Voltar
      </button>

      <div className="mb-10">
        <h1 className="text-3xl font-black text-white mb-2 tracking-tighter uppercase italic">
          {step === 'details' ? 'Começa o teu Trial' : 'Verifica o teu Telemóvel'}
        </h1>
        <p className="text-muted text-sm font-medium">
          {step === 'details' 
            ? '7 dias de acesso total à elite da gestão estética.' 
            : 'Enviámos um código de validação por SMS.'}
        </p>
      </div>

      <div className="bg-surface rounded-[2.5rem] p-10 border border-white/5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
        
        {step === 'details' ? (
          <form onSubmit={handleStartTrial} className="space-y-6">
            <Input 
              label="Nome do Salão" 
              placeholder="Ex: Studio Beauty Elite"
              required
              value={formData.salonName}
              onChange={e => setFormData({...formData, salonName: e.target.value})}
              icon={<Building2 size={16} />}
            />
            <Input 
              label="O Teu Nome" 
              placeholder="Ex: Maria Joana"
              required
              value={formData.ownerName}
              onChange={e => setFormData({...formData, ownerName: e.target.value})}
            />
            <Input 
              label="Telemóvel" 
              placeholder="912 345 678"
              type="tel"
              required
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
              icon={<Smartphone size={16} />}
            />

            <div className="pt-4">
              <Button fullWidth type="submit" disabled={loading} className="py-5 font-black">
                {loading ? <Loader2 className="animate-spin" /> : 'Ativar 7 Dias Grátis'}
              </Button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-8">
            <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 text-center">
               <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Demo Mode</p>
               <p className="text-white font-mono font-bold text-lg">Código: 123456</p>
            </div>
            
            <Input 
              label="Código SMS" 
              placeholder="000000"
              maxLength={6}
              value={otp}
              onChange={e => setOtp(e.target.value)}
              className="text-center tracking-[0.5em] font-mono text-xl"
              icon={<ShieldCheck size={18} />}
            />

            <Button fullWidth type="submit" disabled={loading} className="py-5 font-black">
              {loading ? <Loader2 className="animate-spin" /> : 'Verificar & Iniciar'}
            </Button>
            
            <button 
              type="button"
              onClick={() => setStep('details')}
              className="w-full text-[10px] font-black text-zinc-600 uppercase tracking-widest hover:text-white transition-colors"
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
