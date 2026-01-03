
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowLeft, KeyRound, Lock } from 'lucide-react';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '437501') {
      sessionStorage.setItem('admin_auth', 'true');
      navigate('/admin/global');
    } else {
      setError('Credenciais inválidas.');
      setPassword('');
    }
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 animate-fade-in">
      <div className="w-full max-w-[360px]">
        <button 
          onClick={() => navigate('/')} 
          className="mb-8 text-muted hover:text-white flex items-center gap-2 text-xs font-medium transition-all"
        >
          <ArrowLeft size={14} /> Início
        </button>

        <div className="bg-surface rounded-xl border border-border p-8 shadow-2xl">
          <div className="mb-8">
            <div className="w-10 h-10 bg-background rounded-lg border border-border flex items-center justify-center mb-6 text-primary">
              <Lock size={20} />
            </div>
            <h1 className="text-lg font-semibold text-white mb-1 tracking-tight">Consola de Administração</h1>
            <p className="text-muted text-[13px] leading-relaxed">Introduza a chave mestre para aceder ao orquestrador global.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-muted uppercase tracking-[0.1em] ml-1">Chave de Auditoria</label>
              <Input 
                type="password"
                placeholder="Introduzir código"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                error={error}
                className="bg-background border-border focus:border-primary/50 text-center tracking-[0.3em] h-12"
                required
                autoFocus
              />
            </div>
            
            <Button fullWidth type="submit" className="bg-primary hover:bg-indigo-500 text-white font-semibold rounded-lg h-12 text-sm shadow-lg shadow-primary/10">
              Validar Sistema
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-border text-center">
            <p className="text-[9px] text-zinc-600 font-medium uppercase tracking-widest">
              Acesso Restrito • BeautyAgent v1.2
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};