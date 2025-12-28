'use client';

import React, { useState } from 'react';
import {
  Plus,
  X,
  Calendar as CalendarIcon,
  Clock,
  Check,
  Video,
  DollarSign,
  Timer,
  Settings,
  CalendarDays,
} from 'lucide-react';
import {
  Appointment,
  Client,
  FinancialRecord,
  GlobalSettings,
} from '../types/types';

interface ScheduleProps {
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
  clients: Client[];
  setFinances: React.Dispatch<React.SetStateAction<FinancialRecord[]>>;
  settings: GlobalSettings;
  setSettings: React.Dispatch<React.SetStateAction<GlobalSettings>>;
}

const ScheduleManagement: React.FC<ScheduleProps> = ({
  appointments,
  setAppointments,
  clients,
  setFinances,
  settings,
  setSettings,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');
  const [currentDate, setCurrentDate] = useState(new Date());

  // Helper to format date YYYY-MM-DD
  const formatDate = (date: Date) => date.toISOString().split('T')[0];

  // Helper to get week days
  const getWeekDays = (date: Date) => {
    const start = new Date(date);
    const day = start.getDay(); // 0 is Sunday
    // Adjust to start on Monday (if desired) or Sunday. Let's assume Monday start for work week
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(start.setDate(diff));

    const days = [];
    for (let i = 0; i < 5; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      days.push(d);
    }
    return days;
  };
  const [newApp, setNewApp] = useState<Partial<Appointment>>({
    clientId: '',
    date: '',
    time: '',
    type: 'Clinical',
    status: 'scheduled',
    price: settings.defaultPrice,
    duration: settings.defaultDuration,
  });

  const handleAddAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newApp.clientId || !newApp.date || !newApp.time) return;

    const appointmentPrice = Number(newApp.price) || settings.defaultPrice;
    const client = clients.find((c) => c.id === newApp.clientId);

    const app: Appointment = {
      id: Date.now().toString(),
      clientId: newApp.clientId!,
      date: newApp.date!,
      time: newApp.time!,
      type: (newApp.type as any) || 'Clinical',
      status: 'scheduled',
      meetLink: `https://meet.google.com/kezya-${Math.random()
        .toString(36)
        .substring(7)}`,
      price: appointmentPrice,
      duration: Number(newApp.duration) || settings.defaultDuration,
    };

    setAppointments((prev) => [...prev, app]);

    setAppointments((prev) => [...prev, app]);

    // Financial record is NO LONGER created here. Moved to handleStartTelehealth.
    // However, for manual appointments that might not be telehealth, we might want to consider...
    // But the request implies "Start Telehealth" -> "Add Value".
    // For manual physical appointments, we might need a "Check-in" or "Pay" button?
    // The request specifically says "4.1 adicionar valor as receitas" ao clicar em "Iniciar Teleatendimento".
    // Leaving it out here consistent with the plan.

    setShowModal(false);

    setShowModal(false);
    setNewApp({
      clientId: '',
      date: '',
      time: '',
      type: 'Clinical',
      status: 'scheduled',
      price: settings.defaultPrice,
      duration: settings.defaultDuration,
    });
  };

  const markCompleted = (id: string) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'completed' } : a)),
    );
  };

  const handleTypeChange = (type: 'Clinical' | 'Neuropsychology') => {
    // Reusing Clinical for Therapy and Neuropsychology for Evaluation/Special test
    const defaultPrice =
      type === 'Neuropsychology' ? 350 : settings.defaultPrice;
    const defaultDuration =
      type === 'Neuropsychology' ? 90 : settings.defaultDuration;
    setNewApp({
      ...newApp,
      type,
      price: defaultPrice,
      duration: defaultDuration,
    });
  };

  const handleStartTelehealth = (app: Appointment) => {
    const client = clients.find((c) => c.id === app.clientId);
    const financialRecord: FinancialRecord = {
      id: `f-${Date.now()}`,
      description: `Atendimento (${app.type}) - ${client?.name || 'Cliente'}`,
      amount: app.price,
      type: 'income',
      date: new Date().toISOString().split('T')[0], // Revenue date is today
      category: 'Atendimento',
    };
    setFinances((prev) => [...prev, financialRecord]);

    if (app.meetLink) {
      window.open(app.meetLink, '_blank');
    }
  };

  return (
    <div className="space-y-10 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">
            Agenda Clínica
          </h2>
          <p className="text-slate-500 font-bold mt-2">
            Organize suas sessões de fonoaudiologia com precisão.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 text-white px-10 py-5 rounded-[2rem] font-black flex items-center gap-3 hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-100 active:scale-95"
        >
          <Plus size={24} /> Novo Agendamento
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Settings and Stats */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-indigo-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
            <div className="relative z-10 space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Settings size={28} />
                </div>
                <h3 className="text-xl font-black uppercase tracking-widest">
                  Configurações Base
                </h3>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-indigo-300 uppercase tracking-widest block mb-2">
                    Valor da Sessão (R$)
                  </label>
                  <div className="relative">
                    <DollarSign
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400"
                      size={18}
                    />
                    <input
                      type="number"
                      value={settings.defaultPrice}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          defaultPrice: Number(e.target.value),
                        })
                      }
                      className="w-full bg-white/10 border border-white/20 rounded-2xl py-4 pl-12 pr-6 font-black text-2xl outline-none focus:bg-white/20 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black text-indigo-300 uppercase tracking-widest block mb-2">
                    Duração Padrão (min)
                  </label>
                  <div className="relative">
                    <Timer
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400"
                      size={18}
                    />
                    <input
                      type="number"
                      value={settings.defaultDuration}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          defaultDuration: Number(e.target.value),
                        })
                      }
                      className="w-full bg-white/10 border border-white/20 rounded-2xl py-4 pl-12 pr-6 font-black text-2xl outline-none focus:bg-white/20 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-sky-100 text-sky-600 rounded-2xl flex items-center justify-center">
                <CalendarDays size={28} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Total Hoje
                </p>
                <p className="text-2xl font-black text-slate-800">
                  {
                    appointments.filter(
                      (a) => a.date === new Date().toISOString().split('T')[0],
                    ).length
                  }{' '}
                  Sessões
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Schedule Grid */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Clock size={20} className="text-indigo-600" />
              <h3 className="text-xl font-black text-slate-800">
                Próximos Atendimentos
              </h3>
            </div>
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setViewMode('day')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  viewMode === 'day'
                    ? 'bg-white shadow-sm text-indigo-600'
                    : 'text-slate-500 hover:text-indigo-600'
                }`}
              >
                Dia
              </button>
              <button
                onClick={() => setViewMode('week')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  viewMode === 'week'
                    ? 'bg-white shadow-sm text-indigo-600'
                    : 'text-slate-500 hover:text-indigo-600'
                }`}
              >
                Semana
              </button>
            </div>
          </div>

          {viewMode === 'day' && (
            <div className="flex items-center justify-center gap-4 mb-6">
              <button
                onClick={() =>
                  setCurrentDate(
                    new Date(currentDate.setDate(currentDate.getDate() - 1)),
                  )
                }
                className="p-2 hover:bg-slate-100 rounded-full"
              >
                <CalendarIcon size={20} />
              </button>
              <span className="font-black text-lg text-slate-800 capitalize">
                {currentDate.toLocaleDateString('pt-BR', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                })}
              </span>
              <button
                onClick={() =>
                  setCurrentDate(
                    new Date(currentDate.setDate(currentDate.getDate() + 1)),
                  )
                }
                className="p-2 hover:bg-slate-100 rounded-full"
              >
                <CalendarIcon size={20} />
              </button>
            </div>
          )}

          {viewMode === 'day' ? (
            <div className="grid grid-cols-1 gap-6">
              {appointments
                .filter((a) => a.date === formatDate(currentDate))
                .sort((a, b) => a.time.localeCompare(b.time))
                .map((app) => {
                  const client = clients.find((c) => c.id === app.clientId);
                  return (
                    <div
                      key={app.id}
                      className={`p-6 rounded-[2.5rem] border-2 transition-all flex items-center justify-between gap-6 ${
                        app.status === 'completed'
                          ? 'bg-slate-50 border-slate-100 opacity-60'
                          : 'bg-white border-indigo-50 shadow-xl shadow-indigo-100/30'
                      }`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-lg font-black text-slate-900">
                            {app.time}
                          </span>
                          <div
                            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                              app.type === 'Clinical'
                                ? 'bg-indigo-100 text-indigo-700'
                                : 'bg-sky-100 text-sky-700'
                            }`}
                          >
                            {app.type === 'Clinical' ? 'Terapia' : 'Avaliação'}
                          </div>
                        </div>
                        <h4 className="text-xl font-bold text-slate-700 mb-1">
                          {client?.name || 'Paciente'}
                        </h4>
                        <p className="text-sm text-slate-400 font-medium">
                          Duração: {app.duration} min
                        </p>
                      </div>

                      <div className="flex flex-col gap-2">
                        {app.meetLink && app.status === 'scheduled' && (
                          <button
                            onClick={() => handleStartTelehealth(app)}
                            className="flex items-center justify-center gap-2 text-white bg-indigo-600 px-6 py-3 rounded-2xl text-xs font-black hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                          >
                            <Video size={16} /> Iniciar
                          </button>
                        )}
                        {app.status === 'scheduled' && (
                          <button
                            onClick={() => markCompleted(app.id)}
                            className="flex items-center justify-center gap-2 text-emerald-600 bg-emerald-50 px-6 py-3 rounded-2xl text-xs font-black hover:bg-emerald-100 transition-all border border-emerald-100"
                          >
                            <Check size={16} /> Concluir
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              {appointments.filter((a) => a.date === formatDate(currentDate))
                .length === 0 && (
                <div className="p-12 text-center text-slate-400 font-medium bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                  Nenhum agendamento para este dia.
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-5 gap-4 overflow-x-auto pb-4">
              {getWeekDays(new Date()).map((day) => {
                const dateStr = formatDate(day);
                const daysApps = appointments
                  .filter((a) => a.date === dateStr)
                  .sort((a, b) => a.time.localeCompare(b.time));

                const isToday = dateStr === formatDate(new Date());

                return (
                  <div
                    key={dateStr}
                    className={`min-w-[200px] rounded-3xl p-4 border-2 ${
                      isToday
                        ? 'bg-indigo-50/50 border-indigo-200'
                        : 'bg-white border-slate-100'
                    }`}
                  >
                    <div className="text-center mb-4 pb-4 border-b border-slate-100">
                      <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                        {day.toLocaleDateString('pt-BR', { weekday: 'short' })}
                      </p>
                      <p
                        className={`text-xl font-black ${
                          isToday ? 'text-indigo-600' : 'text-slate-800'
                        }`}
                      >
                        {day.getDate()}
                      </p>
                    </div>
                    <div className="space-y-3">
                      {daysApps.map((app) => {
                        const client = clients.find(
                          (c) => c.id === app.clientId,
                        );
                        return (
                          <div
                            key={app.id}
                            className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all"
                          >
                            <p className="text-xs font-black text-indigo-600 mb-1">
                              {app.time}
                            </p>
                            <p
                              className="text-sm font-bold text-slate-700 truncate"
                              title={client?.name}
                            >
                              {client?.name?.split(' ')[0]}
                            </p>
                            <div className="flex justify-end mt-2">
                              {app.meetLink && app.status === 'scheduled' && (
                                <button
                                  onClick={() => handleStartTelehealth(app)}
                                  className="text-indigo-600 p-1 hover:bg-indigo-50 rounded-lg"
                                  title="Iniciar"
                                >
                                  <Video size={14} />
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white rounded-[3rem] shadow-3xl w-full max-w-xl overflow-hidden animate-scale-up">
            <div className="p-10 bg-indigo-600 text-white flex justify-between items-center">
              <div>
                <h3 className="text-3xl font-black tracking-tight">
                  Novo Registro
                </h3>
                <p className="text-indigo-200 font-bold mt-1 uppercase text-xs tracking-widest">
                  Agendamento Manual
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="bg-white/10 p-3 rounded-full hover:bg-white/20 transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleAddAppointment} className="p-10 space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Paciente
                </label>
                <select
                  required
                  value={newApp.clientId}
                  onChange={(e) =>
                    setNewApp({ ...newApp, clientId: e.target.value })
                  }
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 font-black focus:border-indigo-500 outline-none"
                >
                  <option value="">Selecione o paciente</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Data
                  </label>
                  <input
                    type="date"
                    required
                    value={newApp.date}
                    onChange={(e) =>
                      setNewApp({ ...newApp, date: e.target.value })
                    }
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 font-black focus:border-indigo-500 outline-none"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Horário
                  </label>
                  <input
                    type="time"
                    required
                    value={newApp.time}
                    onChange={(e) =>
                      setNewApp({ ...newApp, time: e.target.value })
                    }
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 font-black focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Tipo de Sessão
                </label>
                <div className="flex gap-4">
                  <label className="flex-1 cursor-pointer">
                    <input
                      type="radio"
                      name="type"
                      className="hidden peer"
                      checked={newApp.type === 'Clinical'}
                      onChange={() => handleTypeChange('Clinical')}
                    />
                    <div className="py-4 border-2 border-slate-100 rounded-2xl text-center peer-checked:bg-indigo-50 peer-checked:border-indigo-500 peer-checked:text-indigo-700 font-black transition-all">
                      Terapia
                    </div>
                  </label>
                  <label className="flex-1 cursor-pointer">
                    <input
                      type="radio"
                      name="type"
                      className="hidden peer"
                      checked={newApp.type === 'Neuropsychology'}
                      onChange={() => handleTypeChange('Neuropsychology')}
                    />
                    <div className="py-4 border-2 border-slate-100 rounded-2xl text-center peer-checked:bg-indigo-50 peer-checked:border-indigo-500 peer-checked:text-indigo-700 font-black transition-all">
                      Avaliação
                    </div>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-6 rounded-[2rem] font-black text-xl hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-100 active:scale-95"
              >
                Salvar Agendamento
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleManagement;
