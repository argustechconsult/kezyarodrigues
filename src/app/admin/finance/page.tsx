'use client';
import React from 'react';
import FinancialManagement from '../../../components/FinancialManagement';
import { useAppContext } from '../../../context/AppContext';

export default function Page() {
  const { finances, setFinances } = useAppContext();
  return <FinancialManagement finances={finances} setFinances={setFinances} />;
}
