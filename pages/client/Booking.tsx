'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, User, Smartphone, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';

interface UserData {
  name: string;
  phone: string;
  verified: boolean;
}

export const ClientBooking: React.FC = () => {
  const router = useRouter();
  const [step, setStep] = useState<'loading' | 'form' | 'welcome'>('loading');
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('beauty_user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      if (user.verified) {
        router.push('/client/my-bookings');
        return;
      }
      setCurrentUser(user);
      setStep('welcome');
    } else {
      setStep('form');
    }
  }, [router]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    const newUser = { ...formData, verified: false };
    localStorage.setItem('beauty_user', JSON.stringify(newUser));
    router.push('/client/otp');
  };

  const handleLogout = () => {
    localStorage.removeItem('beauty_user');
    setStep('form');
    setFormData({ name: '', phone: '' });
  };

  if (step === 'loading') return null;

  return (
    <div className="max-w-md mx-auto py-6 px-4">
      <button onClick={() => router.push('/')} className="mb-8 text-gray-500 hover:text-white flex items-center gap-2 text-sm transition-colors">
        <ArrowLeft size={16} /> Voltar à entrada
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-2 flex items-center gap-3 uppercase italic">
          Nova Marcação <Sparkles className="text-accent w-6 h-6 animate-pulse" />
        </h1>
        <p className="text-gray-400">
          {step === 'welcome' ? 'Que bom ver-te novamente!' : 'Vamos começar. O BeautyAgent trata de tudo.'}
        </p>
      </div>

      {step === 'welcome' && currentUser ? (
        <div className="bg-surface rounded-3xl p-8 border border-white/5 space-y-6 animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#1E1E1E] rounded-2xl flex items-center justify-center border border-white/5 text-primary text-2xl font-black italic">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white uppercase italic">{currentUser.name}</h2>
              <p className="text-sm text-gray-500">{currentUser.phone}</p>
            </div>
          </div>
          <div className="pt-4 space-y-3">
            <Button fullWidth onClick={() => router.push('/client/otp')}>Validar Conta <ArrowRight size={18} /></Button>
            <Button variant="ghost" fullWidth onClick={handleLogout} className="text-xs text-red-400">Não és tu? Sair</Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleFormSubmit} className="bg-surface rounded-3xl p-8 border border-white/5 space-y-6">
          <Input label="Nome Completo" placeholder="Ex: Joana Silva" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
          <Input label="Telemóvel" placeholder="Ex: 912345678" type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} required icon={<Smartphone size={16} />} />
          <div className="pt-4"><Button fullWidth type="submit">Continuar</Button></div>
          <p className="text-center text-[10px] text-gray-500 mt-4 uppercase tracking-widest">Segurança de elite BeautyAgent.</p>
        </form>
      )}
    </div>
  );
};