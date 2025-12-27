'use client';
import React from 'react';
import ScheduleManagement from '../../../components/ScheduleManagement';
import { useAppContext } from '../../../context/AppContext';

export default function Page() {
  const {
    appointments,
    setAppointments,
    clients,
    setFinances,
    settings,
    setSettings,
  } = useAppContext();
  return (
    <ScheduleManagement
      appointments={appointments}
      setAppointments={setAppointments}
      clients={clients}
      setFinances={setFinances}
      settings={settings}
      setSettings={setSettings}
    />
  );
}
