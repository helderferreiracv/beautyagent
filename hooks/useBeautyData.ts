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
  status: string;
  proId: string;
  source: string;
  paymentMethod?: string;
}

export const useBeautyData = () => {
  const [bookings, setBookings] = useState<UnifiedBooking[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalClients: 0, monthlyRevenue: 0, todayBookingsCount: 0 });
  // Fix: Added isDemo state to fix "Property 'isDemo' does not exist" error
  const [isDemo, setIsDemo] = useState(false);

  const extractString = (val: any): string => {
    if (typeof val === 'string') return val;
    if (typeof val === 'number') return String(val);
    if (val && typeof val === 'object') {
      if (val.name) return String(val.name);
      if (val.title) return String(val.title);
      return "Info";
    }
    return "";
  };

  const loadData = useCallback(() => {
    const staffData = JSON.parse(localStorage.getItem('owner_staff_db') || '[]');
    const servicesData = JSON.parse(localStorage.getItem('owner_services_db') || '[]');
    const clientBookingsRaw = JSON.parse(localStorage.getItem('beauty_bookings') || '[]');
    const ownerBookingsRaw = JSON.parse(localStorage.getItem('owner_bookings_db') || '[]');
    // Fix: Set isDemo based on localStorage key
    setIsDemo(localStorage.getItem('beauty_is_demo_active') === 'true');

    const normalized = [
      ...clientBookingsRaw.map((b: any) => ({
        id: extractString(b.id),
        date: extractString(b.date),
        time: extractString(b.time),
        client: extractString(b.userName || 'Cliente'),
        service: extractString(b.service),
        priceValue: parseFloat(String(b.service?.price || 0).replace('€','')),
        status: b.status || 'confirmed',
        proId: b.professional?.id || 'p1',
        source: 'app',
        paymentMethod: b.paymentMethod
      })),
      ...ownerBookingsRaw.map((b: any) => ({
        id: extractString(b.id),
        date: extractString(b.date),
        time: extractString(b.time),
        client: extractString(b.client || 'Cliente'),
        service: extractString(b.service),
        priceValue: parseFloat(String(b.priceValue || 0)),
        status: b.status || 'confirmed',
        proId: extractString(b.proId),
        source: 'manual',
        paymentMethod: b.paymentMethod
      }))
    ];

    setStaff(staffData);
    setServices(servicesData);
    setBookings(normalized);

    // Calc basic stats
    const today = new Date().toISOString().split('T')[0];
    const revenue = normalized.reduce((acc, b) => b.status === 'completed' ? acc + b.priceValue : acc, 0);
    const todayCount = normalized.filter(b => b.date === today).length;
    
    setStats({
      totalClients: new Set(normalized.map(b => b.client)).size,
      monthlyRevenue: revenue,
      todayBookingsCount: todayCount
    });
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // Fix: Added optional paymentMethod argument to fix "Expected 2 arguments, but got 3" error in PersonalDashboard
  const updateBookingStatus = (id: string, status: string, paymentMethod?: string) => {
    const c = JSON.parse(localStorage.getItem('beauty_bookings') || '[]');
    const o = JSON.parse(localStorage.getItem('owner_bookings_db') || '[]');
    const up = (l: any[]) => l.map(b => b.id === id ? { ...b, status, paymentMethod: paymentMethod || b.paymentMethod } : b);
    localStorage.setItem('beauty_bookings', JSON.stringify(up(c)));
    localStorage.setItem('owner_bookings_db', JSON.stringify(up(o)));
    loadData();
  };

  // Fix: Included isDemo in return object
  return { bookings, staff, services, stats, isDemo, updateBookingStatus, refresh: loadData };
};