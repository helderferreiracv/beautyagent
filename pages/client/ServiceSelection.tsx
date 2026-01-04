import React, { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Clock, Sparkles, Ban, Phone, Check, Receipt } from "lucide-react";
import { Button } from "../../components/Button";
import { BookingProgressBar } from "../../components/BookingProgressBar";
import { Service } from "../../types";

type Router = { push: (path: string) => void };
type Props = { router: Router };

export default function ServiceSelection({ router }: Props) {
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    const savedUserStr = localStorage.getItem("beauty_user");
    if (savedUserStr) {
      const user = JSON.parse(savedUserStr);
      const clientsDb = JSON.parse(localStorage.getItem("owner_clients_db") || "[]");
      const clientProfile = clientsDb.find((c: any) => c.phone === user.phone);
      if (clientProfile?.isBlocked) setIsBlocked(true);
    }

    const ownerServices = JSON.parse(localStorage.getItem("owner_services_db") || "[]");
    if (ownerServices.length > 0) {
      setServices(ownerServices);
    } else {
      setServices([
        { id: "1", name: "Unhas de Gel", duration: "60", price: "35" },
        { id: "2", name: "Extensão de Pestanas", duration: "90", price: "60" },
        { id: "3", name: "Corte de Cabelo", duration: "45", price: "40" },
        { id: "4", name: "Coloração Raiz", duration: "90", price: "50" },
        { id: "5", name: "Lifting de Pestanas", duration: "45", price: "45" }
      ] as any);
    }
  }, []);

  const toggleService = (service: Service) => {
    if (selectedServices.find((s) => s.id === service.id)) {
      setSelectedServices(selectedServices.filter((s) => s.id !== service.id));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const parsePrice = (p: string | number) => parseFloat(String(p).replace("€", ""));

  const stats = {
    count: selectedServices.length,
    price: selectedServices.reduce((acc, s) => acc + parsePrice(s.price as any), 0),
    duration: selectedServices.reduce((acc, s) => acc + parseInt(String(s.duration)), 0)
  };

  const handleContinue = () => {
    if (selectedServices.length === 0 || isBlocked) return;

    const totalPrice = stats.price;
    const totalDuration = stats.duration;

    const draft = JSON.parse(localStorage.getItem("beauty_booking_draft") || "{}");
    localStorage.setItem(
      "beauty_booking_draft",
      JSON.stringify({
        ...draft,
        services: selectedServices,
        totalDuration,
        totalPrice
      })
    );

    router.push("/client/calendar");
  };

  if (isBlocked) {
    return (
      <div className="max-w-md mx-auto py-20 px-6 animate-fade-in text-center">
        <div className="w-20 h-20 bg-red-500/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-red-500/20 text-red-500 shadow-2xl">
          <Ban size={32} />
        </div>
        <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic mb-4">
          Acesso Restrito
        </h1>
        <p className="text-zinc-400 text-sm leading-relaxed mb-8 font-medium max-w-[250px] mx-auto">
          Marcações online indisponíveis. <br /> Por favor contacte o salão.
        </p>
        <Button
          onClick={() => (window.location.href = "tel:912345678")}
          className="w-full h-14 text-xs font-black uppercase tracking-widest"
        >
          <Phone size={16} className="mr-2" /> Ligar Agora
        </Button>
      </div>
    );
  }

  const SummaryContent = () => (
    <>
      <div className="flex justify-between items-end mb-6">
        <div>
          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-1">
            Total Estimado
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white italic tracking-tighter">
              {stats.price}€
            </span>
            <span className="text-xs font-bold text-zinc-500">/ {stats.duration} min</span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded uppercase tracking-widest">
            {stats.count} {stats.count === 1 ? "item" : "itens"}
          </span>
        </div>
      </div>

      <Button
        fullWidth
        onClick={handleContinue}
        disabled={stats.count === 0}
        className={`py-5 shadow-2xl text-xs transition-all ${
          stats.count === 0 ? "opacity-50 grayscale cursor-not-allowed" : "active:scale-95"
        }`}
      >
        Continuar <ArrowRight size={16} className="ml-2" />
      </Button>
    </>
  );

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 md:px-8 animate-fade-in pb-40 md:pb-12">
      <button
        onClick={() => router.push("/")}
        className="mb-8 text-muted hover:text-white flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all group"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Voltar
      </button>

      <div className="max-w-xl mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter leading-none mb-4">
          Menu
        </h1>
        <p className="text-muted text-sm font-medium">
          Seleciona os tratamentos que desejas realizar hoje.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
        <div className="md:col-span-7 lg:col-span-8 space-y-4">
          <BookingProgressBar currentStep={1} />

          <div className="space-y-3 mt-8">
            {services.map((service) => {
              const isSelected = selectedServices.some((s) => s.id === service.id);
              return (
                <button
                  key={String(service.id)}
                  onClick={() => toggleService(service)}
                  className={`
                    group w-full p-5 rounded-[2rem] border transition-all duration-300 relative overflow-hidden text-left flex items-center gap-5
                    ${
                      isSelected
                        ? "bg-surface border-primary shadow-[0_0_30px_rgba(235,255,87,0.15)] scale-[1.02] z-10"
                        : "bg-surface border-white/5 hover:border-white/20 active:scale-[0.98]"
                    }
                  `}
                >
                  <div
                    className={`
                     w-14 h-14 rounded-2xl flex items-center justify-center text-xl transition-colors duration-300 shrink-0 border
                     ${
                       isSelected
                         ? "bg-primary text-black border-primary"
                         : "bg-background text-zinc-600 border-white/5 group-hover:text-white group-hover:border-white/10"
                     }
                  `}
                  >
                    {isSelected ? <Check size={20} strokeWidth={3} /> : <Sparkles size={20} />}
                  </div>

                  <div className="flex-grow min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <span
                        className={`text-sm md:text-base font-black uppercase italic tracking-tight truncate pr-2 ${
                          isSelected ? "text-white" : "text-zinc-300 group-hover:text-white"
                        }`}
                      >
                        {String(service.name)}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 bg-background/50 px-2 py-1 rounded-lg border border-white/5">
                        <Clock size={10} className={isSelected ? "text-primary" : "text-zinc-500"} />
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                          {String(service.duration)}m
                        </span>
                      </div>
                      <span
                        className={`text-[11px] font-black tracking-widest ${
                          isSelected ? "text-primary" : "text-zinc-500"
                        }`}
                      >
                        {String(service.price)}€
                      </span>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="absolute right-0 top-0 p-3">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_10px_#ebff57]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="hidden md:block md:col-span-5 lg:col-span-4">
          <div className="sticky top-24">
            <div className="bg-surface border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                <Receipt size={64} />
              </div>

              <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                <Sparkles size={14} className="text-primary" /> O Teu Pedido
              </h3>

              {selectedServices.length > 0 ? (
                <div className="space-y-4 mb-8 max-h-[30vh] overflow-y-auto pr-2 scrollbar-hide">
                  {selectedServices.map((s) => (
                    <div key={String(s.id)} className="flex justify-between items-center text-sm group">
                      <span className="text-zinc-300 font-medium truncate pr-4 group-hover:text-white transition-colors">
                        {String(s.name)}
                      </span>
                      <span className="text-zinc-500 font-bold whitespace-nowrap">
                        {String(s.price)}€
                      </span>
                    </div>
                  ))}
                  <div className="border-t border-white/5 pt-4 mt-4">
                    <SummaryContent />
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-zinc-600">
                  <p className="text-xs font-medium italic">
                    Seleciona um serviço à esquerda para começar.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div
        className={`
        md:hidden fixed bottom-0 left-0 w-full p-6 bg-background/80 backdrop-blur-xl border-t border-white/10 z-50 transition-all duration-500
        ${stats.count > 0 ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"}
      `}
      >
        <div className="max-w-md mx-auto">
          <SummaryContent />
        </div>
      </div>
    </div>
  );
}
