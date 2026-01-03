
'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ToastProvider } from '../components/Toast';

const ThemeContext = createContext({ isLight: false, toggleTheme: () => {} });

export function Providers({ children }: { children: React.ReactNode }) {
  const [isLight, setIsLight] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('theme') === 'light';
    setIsLight(saved);
    if (saved) document.body.classList.add('light-mode');
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const newVal = !isLight;
    setIsLight(newVal);
    if (newVal) {
      document.body.classList.add('light-mode');
      localStorage.setItem('theme', 'light');
    } else {
      document.body.classList.remove('light-mode');
      localStorage.setItem('theme', 'dark');
    }
  };

  if (!mounted) {
    return <div className="opacity-0">{children}</div>;
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
