import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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

export default function LandingContent() {
  const navigate = useNavigate();
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");

  const handleAdminAccess = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === "437501") {
      sessionStorage.setItem("admin_auth", "true");
      navigate("/admin");
    } else {
      setAdminPassword("");
      alert("Falha de Segurança");
    }
  };

  return (
    <div className="relative overflow-x-hidden bg-black text-white min-h-screen">
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur border-b border-white/10 h-20">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#ebff57] text-black rounded-xl flex items-center justify-center">
              <Sparkles size={20} />
            </div>
            <span className="text-xl font-black italic uppercase">
              BeautyAgent
            </span>
          </div>
          <Button onClick={() => navigate("/cliente")}>
            Entrar
          </Button>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-48 text-center px-6">
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 text-xs uppercase tracking-widest text-[#ebff57] mb-8">
          <Bot size={14} /> Intelligence Core
        </div>

        <h1 className="text-6xl md:text-8xl font-black italic uppercase leading-tight mb-8">
          A inteligência que <br />
          <span className="text-[#ebff57]">o teu salão merece</span>
        </h1>

        <p className="text-zinc-300 max-w-2xl mx-auto mb-12">
          Marcações, agenda e clientes num só sistema moderno e automático.
        </p>

        <Button
          className="px-12 py-6 text-lg"
          onClick={() => navigate("/cliente")}
        >
          Começar agora <ArrowRight className="ml-2" />
        </Button>

        <p className="mt-6 text-xs text-[#ebff57] uppercase tracking-widest flex justify-center gap-2 items-center">
          <ShieldCheck size={14} /> Sem cartão
        </p>
      </section>

      {/* ADMIN MODAL */}
      {isAdminModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
          <div className="bg-zinc-900 p-8 rounded-3xl w-full max-w-sm">
            <div className="flex justify-between mb-6">
              <Lock />
              <button onClick={() => setIsAdminModalOpen(false)}>
                <X />
              </button>
            </div>
            <form onSubmit={handleAdminAccess} className="space-y-4">
              <Input
                type="password"
                placeholder="CHAVE MESTRE"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
              />
              <Button fullWidth type="submit">
                Entrar
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
