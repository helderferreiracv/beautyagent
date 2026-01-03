
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, User, Smartphone, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';

interface UserData {
  name: string;
  phone: string;
  verified: boolean;
}

export const ClientBooking: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'loading' | 'form' | 'welcome'>('loading');
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('beauty_user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      
      // ALTERAÇÃO: Se já estiver verificado, vai direto para a dashboard
      if (user.verified) {
        navigate('/client/my-bookings');
        return;
      }

      setCurrentUser(user);
      setStep('welcome');
    } else {
      setStep('form');
    }
  }, [navigate]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    // Save temporary state (unverified)
    const newUser = { ...formData, verified: false };
    localStorage.setItem('beauty_user', JSON.stringify(newUser));
    navigate('/client/otp');
  };

  const handleLogout = () => {
    localStorage.removeItem('beauty_user');
    setStep('form');
    setFormData({ name: '', phone: '' });
  };

  if (step === 'loading') return null;

  return (
    <div className="max-w-md mx-auto py-6">
      <button 
        onClick={() => navigate('/')} 
        className="mb-8 text-gray-500 hover:text-white flex items-center gap-2 text-sm transition-colors"
      >
        <ArrowLeft size={16} /> Voltar à entrada
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          Nova Marcação <Sparkles className="text-accent w-6 h-6 animate-pulse" />
        </h1>
        <p className="text-gray-400">
          {step === 'welcome' 
            ? 'Que bom ver-te novamente!' 
            : 'Vamos começar. O BeautyAgent trata de tudo.'}
        </p>
      </div>

      {step === 'welcome' && currentUser ? (
        <div className="bg-surface rounded-2xl p-8 border border-white/5 space-y-6 animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#1E1E1E] rounded-full flex items-center justify-center border border-white/5">
              <User size={32} className="text-accent" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Olá, {currentUser.name.split(' ')[0]}</h2>
              <p className="text-sm text-gray-500">{currentUser.phone}</p>
            </div>
          </div>

          <div className="pt-4 space-y-3">
            {/* Como o useEffect redireciona os verificados, este ecrã só aparece para não-verificados que tenham dados guardados (raro, mas possível) */}
            <Button fullWidth onClick={() => navigate('/client/otp')}>
              Validar Conta <ArrowRight size={18} />
            </Button>
            <Button variant="ghost" fullWidth onClick={handleLogout} className="text-xs text-red-400 hover:text-red-300">
              Não és tu? Sair
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleFormSubmit} className="bg-surface rounded-2xl p-8 border border-white/5 space-y-6">
          <Input 
            label="Nome Completo" 
            placeholder="Ex: Joana Silva"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
          <Input 
            label="Telemóvel" 
            placeholder="Ex: 912345678"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            required
            icon={<Smartphone size={16} />}
          />
          
          <div className="pt-4">
            <Button fullWidth type="submit">
              Continuar
            </Button>
          </div>
          <p className="text-center text-xs text-gray-500 mt-4">
            Ao continuar, aceitas a nossa Política de Privacidade.
          </p>
        </form>
      )}
    </div>
  );
};
