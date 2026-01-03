
import React from 'react';

export interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

export enum UserRole {
  CLIENT = 'client',
  STAFF = 'staff',
  OWNER = 'owner',
  ADMIN_GLOBAL = 'admin_global'
}

export interface PageProps {
  title: string;
}

export interface Service {
  id: string;
  name: string;
  duration: string;
  price: string;
}

export interface Professional {
  id: string;
  name: string;
}

export interface Booking {
  id: string;
  date: string;
  time: string;
  service: Service; // Mantido para compatibilidade (Resumo)
  services?: Service[]; // Novo: Lista detalhada
  professional: Professional | 'agent';
  status: 'confirmed' | 'completed' | 'cancelled' | 'waiting';
  createdAt: string;
}
