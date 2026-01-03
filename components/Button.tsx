
'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'danger';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "h-12 px-6 rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.97] text-[12px] uppercase tracking-[0.15em] cursor-pointer touch-manipulation disabled:opacity-50 select-none";
  
  const variants = {
    primary: "bg-[#ebff57] text-black hover:bg-white border border-transparent shadow-[0_0_20px_rgba(235,255,87,0.3)]",
    outline: "bg-transparent border border-white/10 text-[#f1f0e6] hover:text-white hover:bg-white/5",
    ghost: "bg-transparent hover:bg-white/5 text-zinc-400 hover:text-white border-none",
    danger: "bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : 'w-auto'} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
