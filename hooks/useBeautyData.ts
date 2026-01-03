
'use client';

import { useState, useEffect, useCallback } from 'react';

export interface UnifiedBooking {
  id: string;
  date: string;
  time: string;
  client: string;
  phone?: string;
  service: string;
  priceValue: number;
  status: 'confirmed' | 'completed' | 'cancelled' | 'no-show' | 'pending-no-show' | 'waiting' | 'blocked';
  proId: string;
  source: 'app' | 'manual';
  paymentMethod?: 'cash' | 'card' | 'mbway';
}

export const useBeautyData = () => {
  const [bookings, setBookings] = useState<UnifiedBooking[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({});
  const [waitingList, setWaitingList] = useState<any[]>([]);
  const [isDemo, setIsDemo] = useState(false);
  
  const [stats, setStats] = useState({
    totalClients: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    todayBookingsCount: 0
  });

  const loadData = useCallback(() => {
    if (typeof window === 'undefined') return;

    const settingsData = JSON.parse(localStorage.getItem('beauty_settings') || '{}');
    const demoFlag = localStorage.getItem('beauty_is_demo_active') === 'true';
    setSettings(settingsData);
    setIsDemo(demoFlag);

    const staffData = JSON.parse(localStorage.getItem('owner_staff_db') || '[]');
    const servicesData = JSON.parse(localStorage.getItem('owner_services_db') || '[]');
    const clientsData = JSON.parse(localStorage.getItem('owner_clients_db') || '[]');
    
    setStaff(staffData);
    setServices(servicesData);
    setClients(clientsData);

    const clientBookingsRaw = JSON.parse(localStorage.getItem('beauty_bookings') || '[]');
    const ownerBookingsRaw = JSON.parse(localStorage.getItem('owner_bookings_db') || '[]');

    const normalizedClient = clientBookingsRaw.map((b: any) => ({
      id: b.id,
      date: b.date,
      time: b.time,
      client: b.userName || 'Cliente App',
      phone: b.userPhone,
      service: b.service.name, 
      priceValue: parseFloat(b.service.price?.toString().replace('€','')) || 0,
      status: b.status,
      proId: b.professional === 'agent' ? 'p1' : b.professional.id,
      source: 'app',
      paymentMethod: b.paymentMethod
    }));

    const normalizedOwner = ownerBookingsRaw.map((b: any) => ({
      id: b.id,
      date: b.date,
      time: b.time,
      client: b.client,
      phone: b.phone,
      service: b.service,
      priceValue: b.priceValue || 0,
      status: b.status,
      proId: b.proId,
      source: 'manual',
      paymentMethod: b.paymentMethod
    }));

    const allBookings = [...normalizedOwner, ...normalizedClient];
    setBookings(allBookings);

    const logs = JSON.parse(localStorage.getItem('beauty_logs_db') || '[]');
    const waitingLogs = logs.filter((l: any) => l.type === 'ai' && l.message.includes('Lista de Espera'));
    setWaitingList(waitingLogs);

    calculateStats(allBookings, clientsData);
  }, []);

  const calculateStats = (allBookings: UnifiedBooking[], clientsData: any[]) => {
    const today = new Date().toISOString().split('T')[0];
    const currentMonth = new Date().getMonth();
    
    const uniquePhones = new Set();
    clientsData.forEach((c: any) => uniquePhones.add(c.phone));
    allBookings.forEach(b => { if(b.phone) uniquePhones.add(b.phone); });
    
    let totalRev = 0;
    let monthRev = 0;
    let todayCount = 0;

    allBookings.forEach(b => {
       if (b.status === 'completed') {
          totalRev += b.priceValue;
          if (new Date(b.date).getMonth() === currentMonth) monthRev += b.priceValue;
       }
       if (b.date === today && b.status !== 'cancelled') todayCount++;
    });

    setStats({
       totalClients: uniquePhones.size,
       totalRevenue: totalRev,
       monthlyRevenue: monthRev,
       todayBookingsCount: todayCount
    });
  };

  useEffect(() => {
    loadData();
  }, [loadData]);

  const updateBookingStatus = (id: string, status: string, paymentMethod?: string) => {
    const clientBookings = JSON.parse(localStorage.getItem('beauty_bookings') || '[]');
    const ownerBookings = JSON.parse(localStorage.getItem('owner_bookings_db') || '[]');

    const updateFn = (list: any[]) => list.map(b => 
      b.id === id ? { ...b, status, paymentMethod: paymentMethod || b.paymentMethod } : b
    );

    localStorage.setItem('beauty_bookings', JSON.stringify(updateFn(clientBookings)));
    localStorage.setItem('owner_bookings_db', JSON.stringify(updateFn(ownerBookings)));
    loadData();
  };

  return { bookings, staff, services, clients, settings, waitingList, stats, isDemo, refresh: loadData, updateBookingStatus };
};
