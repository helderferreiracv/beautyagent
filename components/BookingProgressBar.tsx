
import React from 'react';

interface ProgressBarProps {
  currentStep: number; // 1: Service, 2: Date/Time, 3: Pro, 4: Auth
}

export const BookingProgressBar: React.FC<ProgressBarProps> = ({ currentStep }) => {
  const steps = [
    { id: 1, label: 'Serviço' },
    { id: 2, label: 'Horário' },
    { id: 3, label: 'Especialista' },
    { id: 4, label: 'Contacto' }
  ];

  return (
    <div className="w-full px-4 mb-8">
      <div className="flex justify-between mb-2">
        {steps.map((step) => (
          <span 
            key={step.id} 
            className={`text-[9px] font-black uppercase tracking-widest transition-colors duration-500 ${
              currentStep >= step.id ? 'text-primary' : 'text-zinc-700'
            }`}
          >
            {step.label}
          </span>
        ))}
      </div>
      <div className="h-1 w-full bg-surface rounded-full overflow-hidden flex gap-1">
        {steps.map((step) => (
          <div 
            key={step.id}
            className={`h-full flex-1 transition-all duration-700 ease-out rounded-full ${
              currentStep >= step.id ? 'bg-primary shadow-[0_0_10px_rgba(235,255,87,0.5)]' : 'bg-zinc-800'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
