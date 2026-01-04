import React, { useState } from "react";
import { useRouter } from "../App";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Bot,
  Lock,
  X
} from "lucide-react";
import { Button } from "./Button";
import { Input } from "./Input";
import { useToast } from "./Toast";

export const LandingContent: React.FC = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");

  const handleAdminAccess = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === "437501") {
      sessionStorage.setItem("admin_auth", "true");
      router.push("/admin/global");
      showToast("success", "Acesso Mestre Concedido");
    } else {
      showToast("error", "Falha de Segurança");
      setAdminPassword("");
    }
  };

  return (
    <div className="relative overflow-x-hidden">
      {/* GLOW DECORATIONS */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[120vw] h-[80vh] bg-[#ebff57]/5 rounded-b-[100%] blur-[120px] pointer-events-none z-0"></div>

      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 bg-[#050505]/90 backdrop-blur-xl border-b border-white/5 h-20">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => router.push("/")}
          >
            <div className="w-10 h-10 bg-[#ebff57] text-black rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(235,255,87,0.4)]">
              <Sparkles size={20} strokeWidth={3} />
            </div>
            <span className="text-xl font-black text-white italic uppercase tracking-tighter">
              BeautyAgent
            </span>
          </div>

          <div className="flex items-center gap-4 md:gap-10">
            <button
              onClick={() => router.push("/owner/dashboard")}
              className="text-xs font-black text-zinc-300 hover:text-white uppercase tracking-widest transition-colors"
            >
              Login
            </button>
            <Button
              onClick={() => router.push("/trial/register")}
              className="shadow-xl px-8 h-11 text-xs"
            >
              Trial Grátis
            </Button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-48 pb-24 px-6 z-10 text-center max-w-6xl mx-auto">
        <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-xs font-black uppercase tracking-[0.2em] text-[#ebff57] mb-10 animate-fade-in shadow-2xl backdrop-blur-md">
          <Bot size={16} /> Intelligence Core 3.0
        </div>

        <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter text-white leading-[0.9] uppercase italic mb-10 drop-shadow-2xl">
          A Inteligência que <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#ebff57] to-emerald-200 pr-4 pb-2 inline-block">
            o teu salão merece.
          </span>
        </h1>

        <p className="text-zinc-300 text-lg md:text-2xl font-medium max-w-3xl mx-auto mb-16 leading-relaxed">
          O BeautyAgent é o teu agente AI para marcações, fidelização e otimização da agenda.{" "}
          <br className="hidden md:block" />
          <span className="text-white font-bold underline decoration-[#ebff57]/40 underline-offset-8">
            Simples, moderno e eficiente.
          </span>
        </p>

        <div className="flex flex-col items-center gap-8">
          <Button
            onClick={() => router.push("/trial/register")}
            className="w-full sm:w-auto px-16 py-8 text-base shadow-[0_0_50px_rgba(235,255,87,0.25)] hover:scale-105"
          >
            Começar Trial Grátis{" "}
            <ArrowRight className="ml-2" size={22} strokeWidth={3} />
          </Button>

          <div className="flex flex-wrap justify-center gap-6 md:gap-10">
            <p className="text-xs font-black text-[#ebff57] uppercase tracking-widest flex items-center gap-2.5">
              <ShieldCheck size={20} /> Sem cartão necessário
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 bg-[#050505] pt-32 pb-16 px-6 relative z-10">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-xs font-bold text-zinc-600 uppercase tracking-[0.4em]">
            © {new Date().getFullYear()} BeautyAgent • v3.2 Gold Master
          </p>
          <button
            onClick={() => setIsAdminModalOpen(true)}
            className="mt-8 text-xs text-zinc-800 hover:text-[#ebff57] font-black uppercase tracking-widest"
          >
            Admin
          </button>
        </div>
      </footer>

      {/* ADMIN MODAL */}
      {isAdminModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/98 backdrop-blur-xl"
            onClick={() => setIsAdminModalOpen(false)}
          ></div>

          <div className="bg-[#343436] w-full max-w-[380px] rounded-[3rem] p-10 relative z-10 border border-white/10 shadow-2xl">
            <div className="flex justify-between items-center mb-10">
              <Lock size={20} className="text-[#ebff57]" />
              <button
                onClick={() => setIsAdminModalOpen(false)}
                className="p-3 text-zinc-500 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleAdminAccess} className="space-y-8">
              <Input
                type="password"
                placeholder="CHAVE MESTRE"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="text-center tracking-[0.6em] font-mono text-xl h-16"
                autoFocus
              />
              <Button fullWidth type="submit" className="py-5">
                Autenticar Sistema
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
