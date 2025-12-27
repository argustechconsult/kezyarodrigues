'use client';
import React from 'react';
import AdminDashboard from '../../components/AdminDashboard';
import { useAppContext } from '../../context/AppContext';

export default function Page() {
  const { clients, appointments, finances } = useAppContext();
  return (
    <AdminDashboard
      clients={clients}
      appointments={appointments}
      finances={finances}
    />
  );
}
