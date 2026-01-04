import React from "react";

type Router = { push: (path: string) => void };
type Props = { router?: Router };

export function ClientCalendar({ router }: Props) {
  return (
    <div className="max-w-3xl mx-auto py-10 px-6 text-white">
      <button
        className="mb-6 px-4 py-2 bg-white text-black rounded"
        onClick={() => router?.push("/client/service")}
      >
        Voltar
      </button>

      <h1 className="text-3xl font-bold mb-2">Calendário</h1>
      <p className="opacity-80 mb-8">Página de calendário a funcionar (passo a passo).</p>

      <button
        className="px-4 py-3 bg-white text-black rounded"
        onClick={() => router?.push("/client/time")}
      >
        Continuar
      </button>
    </div>
  );
}
