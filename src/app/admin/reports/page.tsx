'use client';
import React from 'react';
import SessionReportManagement from '../../../components/SessionReportManagement';
import { useAppContext } from '../../../context/AppContext';

export default function Page() {
  const { appointments, clients, sessionReports, setSessionReports } =
    useAppContext();
  return (
    <SessionReportManagement
      appointments={appointments}
      clients={clients}
      reports={sessionReports}
      setReports={setSessionReports}
    />
  );
}
