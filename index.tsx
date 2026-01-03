
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Reset da Hash para garantir arranque na Landing Page
// Simplificado para evitar erros de 'replaceState' em ambientes sandbox/blob
try {
  if (window.location.hash && window.location.hash !== '#/') {
    window.location.hash = '/';
  }
} catch (e) {
  console.warn("Hash reset warning:", e);
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
