
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './components/AdminDashboard';
import ClientManagement from './components/ClientManagement';
import ScheduleManagement from './components/ScheduleManagement';
import FinancialManagement from './components/FinancialManagement';
import KanbanBoard from './components/KanbanBoard';
import RetentionTool from './components/RetentionTool';
import SessionReportManagement from './components/SessionReportManagement';
import { Client, Appointment, FinancialRecord, KanbanTask, SessionReport, GlobalSettings } from './types';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('kezya_auth') === 'true';
  });

  const [settings, setSettings] = useState<GlobalSettings>(() => {
    const saved = localStorage.getItem('kezya_settings');
    return saved ? JSON.parse(saved) : { defaultPrice: 180, defaultDuration: 40 };
  });

  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem('kezya_clients');
    return saved ? JSON.parse(saved) : [
      { id: '1', name: 'Arthur Lima', address: 'Rua das Palmeiras, 45', phone: '2197777777', email: 'arthur@email.com', status: 'active', treatmentStage: 'In Treatment', lastSessionDate: '2023-11-05' },
      { id: '2', name: 'Beatriz Costa', address: 'Av. das Américas, 500', phone: '2196666666', email: 'beatriz@email.com', status: 'active', treatmentStage: 'Evaluation', lastSessionDate: '2023-11-10' },
    ];
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('kezya_appointments');
    if (saved) return JSON.parse(saved);
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    return [
      { 
        id: 'app-1', 
        clientId: '1', 
        date: tomorrowStr, 
        time: '14:00', 
        type: 'Clinical', 
        status: 'scheduled', 
        meetLink: 'https://meet.google.com/kezya-arthur-sessao',
        price: 180,
        duration: 40
      }
    ];
  });

  const [sessionReports, setSessionReports] = useState<SessionReport[]>(() => {
    const saved = localStorage.getItem('kezya_reports');
    return saved ? JSON.parse(saved) : [];
  });

  const [finances, setFinances] = useState<FinancialRecord[]>(() => {
    const saved = localStorage.getItem('kezya_finances');
    return saved ? JSON.parse(saved) : [];
  });

  const [kanbanTasks, setKanbanTasks] = useState<KanbanTask[]>(() => {
    const saved = localStorage.getItem('kezya_kanban');
    return saved ? JSON.parse(saved) : [
      { id: 'k1', title: 'Avaliação de Linguagem - Arthur', status: 'doing' },
      { id: 'k2', title: 'Relatório de Triagem - Beatriz', status: 'todo' },
    ];
  });

  useEffect(() => {
    localStorage.setItem('kezya_clients', JSON.stringify(clients));
    localStorage.setItem('kezya_appointments', JSON.stringify(appointments));
    localStorage.setItem('kezya_reports', JSON.stringify(sessionReports));
    localStorage.setItem('kezya_finances', JSON.stringify(finances));
    localStorage.setItem('kezya_kanban', JSON.stringify(kanbanTasks));
    localStorage.setItem('kezya_settings', JSON.stringify(settings));
  }, [clients, appointments, sessionReports, finances, kanbanTasks, settings]);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('kezya_auth', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('kezya_auth');
  };

  const registerNewBooking = (clientData: { name: string, email: string, phone: string }, appointmentData: { date: string, time: string }) => {
    let existingClient = clients.find(c => c.email.toLowerCase() === clientData.email.toLowerCase());
    let clientId = '';

    if (!existingClient) {
      clientId = Date.now().toString();
      const newClient: Client = {
        id: clientId,
        name: clientData.name,
        email: clientData.email,
        phone: clientData.phone,
        address: 'Pendente',
        status: 'pending',
        treatmentStage: 'First Contact'
      };
      setClients(prev => [...prev, newClient]);
    } else {
      clientId = existingClient.id;
    }

    const price = settings.defaultPrice;
    const duration = settings.defaultDuration;
    
    const newAppointment: Appointment = {
      id: `app-${Date.now()}`,
      clientId: clientId,
      date: appointmentData.date,
      time: appointmentData.time,
      type: 'Clinical',
      status: 'scheduled',
      meetLink: `https://meet.google.com/kezya-${Math.random().toString(36).substring(7)}`,
      price: price,
      duration: duration
    };
    
    setAppointments(prev => [...prev, newAppointment]);

    const newFinancialRecord: FinancialRecord = {
      id: `f-${Date.now()}`,
      description: `Agendamento Online - ${clientData.name}`,
      amount: price,
      type: 'income',
      date: appointmentData.date,
      category: 'Atendimento'
    };
    setFinances(prev => [...prev, newFinancialRecord]);
    
    return newAppointment;
  };

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LandingPage appointments={appointments} onBookingComplete={registerNewBooking} settings={settings} />} />
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        
        {isAuthenticated ? (
          <Route path="/admin" element={<AdminLayout onLogout={handleLogout} />}>
            <Route index element={<AdminDashboard clients={clients} appointments={appointments} finances={finances} />} />
            <Route path="clients" element={<ClientManagement clients={clients} setClients={setClients} />} />
            <Route path="schedule" element={<ScheduleManagement 
                appointments={appointments} 
                setAppointments={setAppointments} 
                clients={clients} 
                setFinances={setFinances}
                settings={settings}
                setSettings={setSettings}
              />} 
            />
            <Route path="reports" element={<SessionReportManagement appointments={appointments} clients={clients} reports={sessionReports} setReports={setSessionReports} />} />
            <Route path="finance" element={<FinancialManagement finances={finances} setFinances={setFinances} />} />
            <Route path="kanban" element={<KanbanBoard tasks={kanbanTasks} setTasks={setKanbanTasks} />} />
            <Route path="retention" element={<RetentionTool clients={clients} />} />
          </Route>
        ) : (
          <Route path="/admin/*" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
    </HashRouter>
  );
};

export default App;
