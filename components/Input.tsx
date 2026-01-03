
'use client';

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, error, icon, className = '', ...props }) => {
  return (
    <div className="flex flex-col gap-2 w-full group">
      {label && (
        <label className="text-[12px] font-black text-zinc-400 uppercase tracking-[0.2em] ml-1 group-focus-within:text-[#ebff57] transition-colors">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-[#ebff57] pointer-events-none">
            {icon}
          </div>
        )}
        <input
          className={`
            w-full bg-[#343436] border border-white/10 rounded-xl px-4 py-3.5
            text-sm text-[#f1f0e6] placeholder-zinc-500 
            focus:outline-none focus:bg-white/[0.02] focus:border-[#ebff57]/40
            transition-all font-bold tracking-tight
            ${icon ? 'pl-12' : 'pl-4'}
            ${error ? 'border-red-500/50' : ''} 
            ${className}
          `}
          {...props}
        />
      </div>
    </div>
  );
};
