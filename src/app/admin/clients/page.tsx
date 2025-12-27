'use client';
import React from 'react';
import ClientManagement from '../../../components/ClientManagement';
import { useAppContext } from '../../../context/AppContext';

export default function Page() {
  const { clients, setClients } = useAppContext();
  return <ClientManagement clients={clients} setClients={setClients} />;
}
