import React from "react";

export default function TimeSelection({ router }: any) {
  return (
    <div className="max-w-3xl mx-auto py-10 px-6 text-white">
      <button
        className="mb-6 px-4 py-2 bg-white text-black rounded"
        onClick={() => router?.push("/client/calendar")}
      >
        Voltar
      </button>

      <h1 className="text-3xl font-bold mb-2">Horário</h1>
      <p className="opacity-80 mb-8">Seleção de horário a funcionar (passo a passo).</p>

      <button
        className="px-4 py-3 bg-white text-black rounded"
        onClick={() => router?.push("/client/confirm")}
      >
        Continuar
      </button>
    </div>
  );
}
