import React from "react";

export default function ClientConfirmation({ router }: any) {
  return (
    <div className="max-w-3xl mx-auto py-10 px-6 text-white">
      <h1 className="text-3xl font-bold mb-2">Confirmação</h1>
      <p className="opacity-80 mb-8">Confirmação da marcação a funcionar.</p>

      <div className="flex gap-4">
        <button
          className="px-4 py-3 bg-white text-black rounded"
          onClick={() => router?.push("/client/time")}
        >
          Voltar
        </button>

        <button
          className="px-4 py-3 bg-white text-black rounded"
          onClick={() => router?.push("/")}
        >
          Concluir
        </button>
      </div>
    </div>
  );
}
