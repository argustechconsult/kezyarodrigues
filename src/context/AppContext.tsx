'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import {
  Client,
  Appointment,
  FinancialRecord,
  KanbanTask,
  SessionReport,
  GlobalSettings,
} from '../types/types';

interface AppContextProps {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  isLoading: boolean;
  settings: GlobalSettings;
  setSettings: React.Dispatch<React.SetStateAction<GlobalSettings>>;
  clients: Client[];
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
  sessionReports: SessionReport[];
  setSessionReports: React.Dispatch<React.SetStateAction<SessionReport[]>>;
  finances: FinancialRecord[];
  setFinances: React.Dispatch<React.SetStateAction<FinancialRecord[]>>;
  kanbanTasks: KanbanTask[];
  setKanbanTasks: React.Dispatch<React.SetStateAction<KanbanTask[]>>;
  registerNewBooking: (
    clientData: { name: string; email: string; phone: string },
    appointmentData: { date: string; time: string },
  ) => Appointment;
  login: () => void;
  logout: () => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const [settings, setSettings] = useState<GlobalSettings>({
    defaultPrice: 180,
    defaultDuration: 40,
  });
  const [clients, setClients] = useState<Client[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [sessionReports, setSessionReports] = useState<SessionReport[]>([]);
  const [finances, setFinances] = useState<FinancialRecord[]>([]);
  const [kanbanTasks, setKanbanTasks] = useState<KanbanTask[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load initial state from localStorage on mount (client-side only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = localStorage.getItem('kezya_auth') === 'true';
      setIsAuthenticated(auth);

      const savedSettings = localStorage.getItem('kezya_settings');
      if (savedSettings) setSettings(JSON.parse(savedSettings));

      const savedClients = localStorage.getItem('kezya_clients');
      if (savedClients) {
        setClients(JSON.parse(savedClients));
      } else {
        setClients([
          {
            id: '1',
            name: 'Arthur Lima',
            address: 'Rua das Palmeiras, 45',
            phone: '2197777777',
            email: 'arthur@email.com',
            status: 'active',
            treatmentStage: 'In Treatment',
            lastSessionDate: '2023-11-05',
          },
          {
            id: '2',
            name: 'Beatriz Costa',
            address: 'Av. das Américas, 500',
            phone: '2196666666',
            email: 'beatriz@email.com',
            status: 'active',
            treatmentStage: 'Evaluation',
            lastSessionDate: '2023-11-10',
          },
        ]);
      }

      const savedAppointments = localStorage.getItem('kezya_appointments');
      if (savedAppointments) {
        setAppointments(JSON.parse(savedAppointments));
      } else {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split('T')[0];
        setAppointments([
          {
            id: 'app-1',
            clientId: '1',
            date: tomorrowStr,
            time: '14:00',
            type: 'Clinical',
            status: 'scheduled',
            meetLink: 'https://meet.google.com/kezya-arthur-sessao',
            price: 180,
            duration: 40,
          },
        ]);
      }

      const savedReports = localStorage.getItem('kezya_reports');
      if (savedReports) setSessionReports(JSON.parse(savedReports));

      const savedFinances = localStorage.getItem('kezya_finances');
      if (savedFinances) setFinances(JSON.parse(savedFinances));

      const savedKanban = localStorage.getItem('kezya_kanban');
      if (savedKanban) {
        setKanbanTasks(JSON.parse(savedKanban));
      } else {
        setKanbanTasks([
          {
            id: 'k1',
            title: 'Avaliação de Linguagem - Arthur',
            status: 'doing',
          },
          { id: 'k2', title: 'Relatório de Triagem - Beatriz', status: 'todo' },
        ]);
      }
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('kezya_auth', String(isAuthenticated));
      localStorage.setItem('kezya_settings', JSON.stringify(settings));
      localStorage.setItem('kezya_clients', JSON.stringify(clients));
      localStorage.setItem('kezya_appointments', JSON.stringify(appointments));
      localStorage.setItem('kezya_reports', JSON.stringify(sessionReports));
      localStorage.setItem('kezya_finances', JSON.stringify(finances));
      localStorage.setItem('kezya_kanban', JSON.stringify(kanbanTasks));
    }
  }, [
    isAuthenticated,
    settings,
    clients,
    appointments,
    sessionReports,
    finances,
    kanbanTasks,
  ]);

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const registerNewBooking = (
    clientData: { name: string; email: string; phone: string },
    appointmentData: { date: string; time: string },
  ) => {
    let existingClient = clients.find(
      (c) => c.email.toLowerCase() === clientData.email.toLowerCase(),
    );
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
        treatmentStage: 'First Contact',
      };
      setClients((prev) => [...prev, newClient]);
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
      meetLink: `https://meet.google.com/kezya-${Math.random()
        .toString(36)
        .substring(7)}`,
      price: price,
      duration: duration,
    };

    setAppointments((prev) => [...prev, newAppointment]);

    return newAppointment;
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        isLoading,
        settings,
        setSettings,
        clients,
        setClients,
        appointments,
        setAppointments,
        sessionReports,
        setSessionReports,
        finances,
        setFinances,
        kanbanTasks,
        setKanbanTasks,
        registerNewBooking,
        login,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
