'use client';
import React from 'react';
import RetentionTool from '../../../components/RetentionTool';
import { useAppContext } from '../../../context/AppContext';

export default function Page() {
  const { clients } = useAppContext();
  return <RetentionTool clients={clients} />;
}
