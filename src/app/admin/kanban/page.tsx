'use client';
import React from 'react';
import KanbanBoard from '../../../components/KanbanBoard';
import { useAppContext } from '../../../context/AppContext';

export default function Page() {
  const { kanbanTasks, setKanbanTasks } = useAppContext();
  return <KanbanBoard tasks={kanbanTasks} setTasks={setKanbanTasks} />;
}
