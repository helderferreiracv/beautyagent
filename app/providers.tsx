'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ToastProvider } from '../components/Toast';

const ThemeContext = createContext({ isLight: false, toggleTheme: () => {} });

// Defining an explicit interface for the Providers component props to ensure TypeScript compatibility
interface ProvidersProps {
  children: ReactNode;
}

// Fix: Using React.FC to explicitly define that this component accepts children, addressing the TS error in app/layout.tsx
// which incorrectly flagged the component as missing children when used with nested elements.
export const Providers: React.FC<ProvidersProps> = ({ children }) => {
  const [isLight, setIsLight] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme') === 'light';
      setIsLight(saved);
      if (saved) document.body.classList.add('light-mode');
      setMounted(true);
    }
  }, []);

  const toggleTheme = () => {
    const newVal = !isLight;
    setIsLight(newVal);
    if (typeof window !== 'undefined') {
      if (newVal) {
        document.body.classList.add('light-mode');
        localStorage.setItem('theme', 'light');
      } else {
        document.body.classList.remove('light-mode');
        localStorage.setItem('theme', 'dark');
      }
    }
  };

  // Previne renderização no servidor de partes que dependem do cliente (localStorage)
  if (!mounted) {
    return <div className="invisible">{children}</div>;
  }

  return (
    <ThemeContext.Provider value={{ isLight, toggleTheme }}>
      <ToastProvider>
        {children}
      </ToastProvider>
    </ThemeContext.Provider>
  );
}

export const useAppTheme = () => useContext(ThemeContext);
