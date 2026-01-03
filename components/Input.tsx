
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
        <label className="text-[12px] font-black text-muted uppercase tracking-[0.2em] ml-1 group-focus-within:text-primary transition-colors duration-300">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted transition-colors group-focus-within:text-primary pointer-events-none">
            {React.cloneElement(icon as React.ReactElement<any>, { size: 18, strokeWidth: 2.5 })}
          </div>
        )}
        <input
          className={`
            w-full bg-surface border border-white/10 rounded-xl px-4 py-3.5
            text-sm text-text placeholder-zinc-500 
            focus:outline-none focus:bg-white/[0.02] focus:border-primary/40
            transition-all font-bold tracking-tight
            ${icon ? 'pl-12' : 'pl-4'}
            ${error ? 'border-red-500/50' : ''} 
            ${className}
          `}
          style={{ fontSize: '16px' }} // Prevent iOS zoom
          {...props}
        />
      </div>
      {error && <span className="text-[11px] font-black text-red-400 ml-1 uppercase tracking-widest flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block animate-pulse"></span> {error}
      </span>}
    </div>
  );
};
