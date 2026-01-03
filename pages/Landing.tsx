
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  BarChart3, 
  Clock, 
  ShieldCheck, 
  Lock, 
  X, 
  Smartphone, 
  Users, 
  Bot, 
  Calendar, 
  Star,
  Check
} from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useToast } from '../components/Toast';

const BenefitCard = ({ title, desc, icon: Icon }: { title: string, desc: string, icon: any }) => (
  <div className="bg-surface border border-white/5 p-8 rounded-[2rem] hover:border-primary/30 transition-all duration-500 group flex flex-col items-start text-left hover:bg-[#3a3a3c] h-full shadow-lg">
    <div className="w-12 h-12 bg-background rounded-2xl flex items-center justify-center mb-6 text-primary border border-white/5 group-hover:scale-110 transition-transform duration-500">
      <Icon size={24} />
    </div>
    <h3 className="text-white font-black text-lg mb-2 uppercase tracking-tight italic">{title}</h3>
    <p className="text-zinc-400 text-xs md:text-sm leading-relaxed font-medium">{desc}</p>
  </div>
);

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

  // Scroll to pricing if needed
  useEffect(() => {
    if (location.hash === '#pricing') {
      const el = document.getElementById('pricing');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location]);

  const handleAdminAccess = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === '437501') {
      sessionStorage.setItem('admin_auth', 'true');
      navigate('/admin/global');
      showToast('success', 'Acesso Mestre Concedido', 'Orquestrador Global ativo.');
    } else {
      showToast('error', 'Falha de Segurança', 'Chave de auditoria inválida.');
      setAdminPassword('');
    }
  };

  return (
    <div className="relative min-h-screen bg-background overflow-x-hidden selection:bg-primary/30 font-sans text-text">
      
      {/* GLOW BACKGROUND */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[120vw] h-[80vh] bg-primary/5 rounded-b-[100%] blur-[120px] pointer-events-none z-0"></div>
      
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 h-20 transition-all duration-300">
         <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 bg-primary text-black rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(235,255,87,0.3)]">
                  <Sparkles size={16} strokeWidth={3} />
               </div>
               <span className="text-lg font-black text-white italic uppercase tracking-tighter">BeautyAgent</span>
            </div>
            <div className="flex items-center gap-4 md:gap-8">
               <button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} className="text-[11px] font-bold text-zinc-400 hover:text-white uppercase tracking-widest hidden md:block transition-colors">Funcionalidades</button>
               <button onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })} className="text-[11px] font-bold text-zinc-400 hover:text-white uppercase tracking-widest hidden md:block transition-colors">Preços</button>
               <div className="h-4 w-px bg-white/10 hidden md:block"></div>
               <button onClick={() => navigate('/owner/dashboard')} className="text-[11px] font-bold text-zinc-400 hover:text-white uppercase tracking-widest transition-colors">Login</button>
               <Button onClick={() => navigate('/trial/register')} className="shadow-lg shadow-primary/20 px-6 h-10 text-[11px]">Trial Grátis</Button>
            </div>
         </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-48 pb-24 px-6 z-10 text-center max-w-5xl mx-auto">
         <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-[11px] font-black uppercase tracking-[0.2em] text-primary mb-8 animate-fade-in shadow-xl backdrop-blur-md">
            <Bot size={14} /> Intelligence Core 3.0
         </div>

         <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter text-white leading-[0.95] uppercase italic mb-8 animate-fade-in drop-shadow-2xl">
            A Inteligência que <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-primary to-emerald-200 pr-4 pb-2 inline-block">
               o teu salão merece.
            </span>
         </h1>

         <p className="text-zinc-300 text-base md:text-xl font-medium max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-in delay-100">
            O BeautyAgent é o teu agente AI para marcações, <br className="hidden md:block"/>
            fidelização e otimização da agenda. <br className="hidden md:block"/>
            <span className="text-white font-bold">Simples, moderno e eficiente.</span>
         </p>

         <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in delay-200">
            <Button onClick={() => navigate('/trial/register')} className="w-full sm:w-auto px-12 py-6 text-sm shadow-[0_0_40px_rgba(235,255,87,0.2)] hover:shadow-[0_0_60px_rgba(235,255,87,0.4)] transition-shadow">
               Começar Trial Grátis <ArrowRight className="ml-2" size={18} strokeWidth={3} />
            </Button>
            <p className="text-[11px] font-bold text-primary uppercase tracking-widest mt-4 sm:mt-0 sm:ml-4 flex items-center gap-2">
               <ShieldCheck size={18} className="text-primary" /> Sem cartão necessário • 7 dias grátis
            </p>
         </div>
      </section>

      {/* FEATURES GRID */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20 z-10 relative scroll-mt-20">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <BenefitCard 
               title="Reduz No-Shows" 
               desc="Lembretes inteligentes por SMS e WhatsApp reduzem as faltas em até 80%." 
               icon={Zap} 
            />
            <BenefitCard 
               title="Agenda Smart" 
               desc="A nossa AI organiza a tua agenda para eliminar buracos e maximizar o lucro." 
               icon={Calendar} 
            />
            <BenefitCard 
               title="Relatórios Reais" 
               desc="Métricas financeiras precisas, cálculo de comissões automático e previsões." 
               icon={BarChart3} 
            />
            <BenefitCard 
               title="Fidelização Auto" 
               desc="Glow Club integrado. O sistema retém os teus melhores clientes automaticamente." 
               icon={Star} 
            />
         </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="max-w-5xl mx-auto px-6 py-20 relative z-10 scroll-mt-20">
         <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter mb-4">Um Preço. Tudo Incluído.</h2>
            <p className="text-zinc-400 text-sm md:text-base font-medium">Investe no crescimento do teu negócio sem surpresas.</p>
         </div>

         {/* Toggle */}
         <div className="flex justify-center mb-12">
            <div className="bg-surface p-1 rounded-full border border-white/10 flex items-center relative shadow-inner">
               <button 
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-8 py-3 rounded-full text-[11px] font-black uppercase tracking-widest transition-all z-10 ${billingCycle === 'monthly' ? 'text-black' : 'text-zinc-400 hover:text-white'}`}
               >
                  Mensal
               </button>
               <button 
                  onClick={() => setBillingCycle('yearly')}
                  className={`px-8 py-3 rounded-full text-[11px] font-black uppercase tracking-widest transition-all z-10 ${billingCycle === 'yearly' ? 'text-black' : 'text-zinc-400 hover:text-white'}`}
               >
                  Anual
               </button>
               
               <div className={`absolute top-1 bottom-1 w-[50%] bg-primary rounded-full transition-all duration-300 shadow-lg ${billingCycle === 'yearly' ? 'translate-x-full' : 'translate-x-0'}`}></div>
            </div>
         </div>

         {/* Pricing Card */}
         <div className="bg-[#1E1E1E] rounded-[3rem] border border-white/10 p-10 md:p-16 relative overflow-hidden shadow-2xl group transition-all hover:border-primary/20">
            
            {/* Badge Recomendado (Anual) */}
            {billingCycle === 'yearly' && (
               <div className="absolute top-8 right-8 md:top-10 md:right-10 bg-primary text-black text-[11px] font-black uppercase px-5 py-2 rounded-lg tracking-widest shadow-lg animate-in fade-in slide-in-from-top-2">
                  Recomendado
               </div>
            )}

            {/* Background Gradient */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-b from-primary/5 to-transparent rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3"></div>

            <div className="flex flex-col lg:flex-row items-center gap-12 relative z-10">
               <div className="flex-1 space-y-8 text-center lg:text-left">
                  <div>
                     <div className="inline-block bg-white/5 px-4 py-2 rounded-lg border border-white/5 mb-4">
                        <span className="text-[11px] font-black text-white uppercase tracking-widest">Plano Profissional</span>
                     </div>
                     <h3 className="text-3xl font-black text-white italic tracking-tight mb-2">Acesso Total</h3>
                     <p className="text-zinc-400 text-sm md:text-base">Todas as ferramentas para escalar o teu negócio.</p>
                  </div>
                  
                  <div className="space-y-5 max-w-sm mx-auto lg:mx-0">
                     {[
                        "Agente AI 24/7 Ilimitado", 
                        "Lembretes SMS & WhatsApp", 
                        "Gestão de Staff & Comissões", 
                        "App para Clientes (PWA)", 
                        "Relatórios Financeiros Avançados",
                        "Suporte Prioritário"
                     ].map((feat, i) => (
                        <div key={i} className="flex items-center gap-3">
                           <div className="p-1 rounded-full bg-primary/20 text-primary"><Check size={14} strokeWidth={4} /></div>
                           <span className="text-zinc-300 font-bold text-xs md:text-sm uppercase tracking-wide">{feat}</span>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Pricing Column */}
               <div className="w-full lg:w-auto text-center border-t lg:border-t-0 lg:border-l border-white/5 pt-10 lg:pt-0 lg:pl-16 flex flex-col items-center justify-center">
                  <div className="mb-6">
                     <div className="flex items-baseline justify-center gap-1">
                        <span className="text-6xl md:text-7xl font-black text-white italic tracking-tighter transition-all duration-300">
                           {billingCycle === 'yearly' ? '490€' : '49€'}
                        </span>
                        <span className="text-zinc-500 font-bold text-lg uppercase tracking-widest">{billingCycle === 'yearly' ? '/ano' : '/mês'}</span>
                     </div>
                     {billingCycle === 'yearly' && (
                        <p className="text-[11px] font-black text-emerald-400 uppercase tracking-widest mt-2 bg-emerald-500/10 px-4 py-1.5 rounded-full inline-block border border-emerald-500/20">
                           Poupa 98€ (2 meses oferta)
                        </p>
                     )}
                  </div>
                  
                  <Button fullWidth onClick={() => navigate('/trial/register')} className="py-6 px-12 shadow-xl shadow-primary/10 text-sm w-full sm:w-auto">
                     Começar Trial Grátis <ArrowRight size={18} className="ml-2" />
                  </Button>
                  
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-6 flex items-center gap-2 justify-center">
                     <Lock size={12} /> Pagamento Seguro • Cancele quando quiser
                  </p>
               </div>
            </div>
         </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 bg-[#050505] pt-20 pb-10 px-6 relative z-10">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex flex-col items-center md:items-start gap-4">
               <div className="flex items-center gap-3">
                  <Sparkles size={20} className="text-zinc-700" />
                  <span className="text-lg font-black text-zinc-700 italic uppercase tracking-tighter">BeautyAgent</span>
               </div>
               <p className="text-[11px] text-zinc-600 font-medium max-w-xs text-center md:text-left leading-relaxed">
                  Plataforma SaaS líder em gestão de beleza e bem-estar com inteligência artificial integrada.
               </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-8 md:gap-12">
               <Link to="/faq" className="text-[11px] font-bold text-zinc-500 hover:text-white uppercase tracking-widest transition-colors">FAQ</Link>
               <Link to="/privacy" className="text-[11px] font-bold text-zinc-500 hover:text-white uppercase tracking-widest transition-colors">Privacidade</Link>
               <Link to="/terms" className="text-[11px] font-bold text-zinc-500 hover:text-white uppercase tracking-widest transition-colors">Termos</Link>
               <button onClick={() => setIsAdminModalOpen(true)} className="text-[11px] font-bold text-zinc-800 hover:text-primary uppercase tracking-widest transition-colors">Admin</button>
            </div>
         </div>
         <div className="mt-16 text-center border-t border-white/5 pt-8">
            <p className="text-[10px] font-bold text-zinc-800 uppercase tracking-[0.3em]">
               © {new Date().getFullYear()} BeautyAgent • Made in Portugal
            </p>
         </div>
      </footer>

      {/* ADMIN MODAL */}
      {isAdminModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/95 backdrop-blur-xl" onClick={() => setIsAdminModalOpen(false)}></div>
          <div className="bg-surface w-full max-w-[380px] rounded-[3rem] p-10 relative z-10 border border-white/10 shadow-2xl animate-in zoom-in-95">
             <div className="flex justify-between items-center mb-10">
                <div className="w-12 h-12 bg-background rounded-2xl border border-white/10 flex items-center justify-center text-primary"><Lock size={20} /></div>
                <button onClick={() => setIsAdminModalOpen(false)} className="p-3 text-zinc-500 hover:text-white transition-all"><X size={24} /></button>
             </div>
             <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-10">Global Access</h3>
             <form onSubmit={handleAdminAccess} className="space-y-8">
                <Input 
                  type="password" 
                  placeholder="CHAVE MESTRE" 
                  value={adminPassword} 
                  onChange={(e) => setAdminPassword(e.target.value)} 
                  className="text-center tracking-[0.6em] font-mono text-xl h-16 rounded-2xl" 
                  autoFocus 
                />
                <Button fullWidth type="submit" className="py-5">Autenticar Auditoria</Button>
             </form>
          </div>
        </div>
      )}

    </div>
  );
};
