
import React, { useState } from 'react';
import { Plus, X, Calendar as CalendarIcon, Clock, Check, Video, ExternalLink, DollarSign, Timer, Settings, CalendarDays } from 'lucide-react';
import { Appointment, Client, FinancialRecord, GlobalSettings } from '../types';

interface ScheduleProps {
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
  clients: Client[];
  setFinances: React.Dispatch<React.SetStateAction<FinancialRecord[]>>;
  settings: GlobalSettings;
  setSettings: React.Dispatch<React.SetStateAction<GlobalSettings>>;
}

const ScheduleManagement: React.FC<ScheduleProps> = ({ appointments, setAppointments, clients, setFinances, settings, setSettings }) => {
  const [showModal, setShowModal] = useState(false);
  const [newApp, setNewApp] = useState<Partial<Appointment>>({
    clientId: '', date: '', time: '', type: 'Clinical', status: 'scheduled', 
    price: settings.defaultPrice, duration: settings.defaultDuration
  });

  const handleAddAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newApp.clientId || !newApp.date || !newApp.time) return;

    const appointmentPrice = Number(newApp.price) || settings.defaultPrice;
    const client = clients.find(c => c.id === newApp.clientId);

    const app: Appointment = {
      id: Date.now().toString(),
      clientId: newApp.clientId!,
      date: newApp.date!,
      time: newApp.time!,
      type: newApp.type as any || 'Clinical',
      status: 'scheduled',
      meetLink: `https://meet.google.com/kezya-${Math.random().toString(36).substring(7)}`,
      price: appointmentPrice,
      duration: Number(newApp.duration) || settings.defaultDuration
    };

    setAppointments(prev => [...prev, app]);

    const financialRecord: FinancialRecord = {
      id: `f-${Date.now()}`,
      description: `Agendamento Fono (${app.type}) - ${client?.name || 'Cliente'}`,
      amount: appointmentPrice,
      type: 'income',
      date: newApp.date!,
      category: 'Atendimento'
    };
    setFinances(prev => [...prev, financialRecord]);

    setShowModal(false);
    setNewApp({ clientId: '', date: '', time: '', type: 'Clinical', status: 'scheduled', price: settings.defaultPrice, duration: settings.defaultDuration });
  };

  const markCompleted = (id: string) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'completed' } : a));
  };

  const handleTypeChange = (type: 'Clinical' | 'Neuropsychology') => {
    // Reusing Clinical for Therapy and Neuropsychology for Evaluation/Special test
    const defaultPrice = type === 'Neuropsychology' ? 350 : settings.defaultPrice;
    const defaultDuration = type === 'Neuropsychology' ? 90 : settings.defaultDuration;
    setNewApp({ ...newApp, type, price: defaultPrice, duration: defaultDuration });
  };

  return (
    <div className="space-y-10 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Agenda Clínica</h2>
          <p className="text-slate-500 font-bold mt-2">Organize suas sessões de fonoaudiologia com precisão.</p>
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
                 <h3 className="text-xl font-black uppercase tracking-widest">Configurações Base</h3>
               </div>
               
               <div className="space-y-6">
                 <div>
                   <label className="text-[10px] font-black text-indigo-300 uppercase tracking-widest block mb-2">Valor da Sessão (R$)</label>
                   <div className="relative">
                     <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400" size={18} />
                     <input type="number" value={settings.defaultPrice} onChange={(e) => setSettings({...settings, defaultPrice: Number(e.target.value)})} className="w-full bg-white/10 border border-white/20 rounded-2xl py-4 pl-12 pr-6 font-black text-2xl outline-none focus:bg-white/20 transition-all" />
                   </div>
                 </div>
                 <div>
                   <label className="text-[10px] font-black text-indigo-300 uppercase tracking-widest block mb-2">Duração Padrão (min)</label>
                   <div className="relative">
                     <Timer className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400" size={18} />
                     <input type="number" value={settings.defaultDuration} onChange={(e) => setSettings({...settings, defaultDuration: Number(e.target.value)})} className="w-full bg-white/10 border border-white/20 rounded-2xl py-4 pl-12 pr-6 font-black text-2xl outline-none focus:bg-white/20 transition-all" />
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
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Hoje</p>
                 <p className="text-2xl font-black text-slate-800">
                    {appointments.filter(a => a.date === new Date().toISOString().split('T')[0]).length} Sessões
                 </p>
               </div>
             </div>
          </div>
        </div>

        {/* Schedule Grid */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <Clock size={20} className="text-indigo-600" />
            <h3 className="text-xl font-black text-slate-800">Próximos Atendimentos</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {appointments.sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time)).map(app => {
              const client = clients.find(c => c.id === app.clientId);
              return (
                <div key={app.id} className={`p-8 rounded-[2.5rem] border-2 transition-all ${app.status === 'completed' ? 'bg-slate-50 border-slate-100 opacity-60' : 'bg-white border-indigo-50 shadow-xl shadow-indigo-100/30'}`}>
                  <div className="flex justify-between items-start mb-6">
                    <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${app.type === 'Clinical' ? 'bg-indigo-100 text-indigo-700' : 'bg-sky-100 text-sky-700'}`}>
                      {app.type === 'Clinical' ? 'Terapia' : 'Avaliação'}
                    </div>
                    {app.status === 'scheduled' && (
                      <button onClick={() => markCompleted(app.id)} className="text-emerald-600 hover:bg-emerald-50 p-2.5 rounded-xl transition-all shadow-sm border border-emerald-100">
                        <Check size={20} />
                      </button>
                    )}
                  </div>
                  <h4 className="text-2xl font-black text-slate-900 mb-6 truncate">{client?.name || 'Paciente'}</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-slate-600 bg-slate-50 px-4 py-2 rounded-xl">
                        <CalendarIcon size={16} className="text-indigo-600" />
                        <span className="text-sm font-black">{new Date(app.date + 'T12:00:00').toLocaleDateString('pt-BR')}</span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-600 bg-slate-50 px-4 py-2 rounded-xl">
                        <Clock size={16} className="text-indigo-600" />
                        <span className="text-sm font-black">{app.time}</span>
                      </div>
                    </div>
                    
                    {app.meetLink && app.status === 'scheduled' && (
                       <a href={app.meetLink} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-3 text-white bg-indigo-600 py-5 rounded-2xl text-sm font-black hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                         <Video size={20} /> Iniciar Teleatendimento
                       </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white rounded-[3rem] shadow-3xl w-full max-w-xl overflow-hidden animate-scale-up">
            <div className="p-10 bg-indigo-600 text-white flex justify-between items-center">
              <div>
                <h3 className="text-3xl font-black tracking-tight">Novo Registro</h3>
                <p className="text-indigo-200 font-bold mt-1 uppercase text-xs tracking-widest">Agendamento Manual</p>
              </div>
              <button onClick={() => setShowModal(false)} className="bg-white/10 p-3 rounded-full hover:bg-white/20 transition-all">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleAddAppointment} className="p-10 space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Paciente</label>
                <select required value={newApp.clientId} onChange={(e) => setNewApp({...newApp, clientId: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 font-black focus:border-indigo-500 outline-none">
                  <option value="">Selecione o paciente</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Data</label>
                  <input type="date" required value={newApp.date} onChange={(e) => setNewApp({...newApp, date: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 font-black focus:border-indigo-500 outline-none" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Horário</label>
                  <input type="time" required value={newApp.time} onChange={(e) => setNewApp({...newApp, time: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 font-black focus:border-indigo-500 outline-none" />
                </div>
              </div>

              <div className="space-y-6">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tipo de Sessão</label>
                <div className="flex gap-4">
                  <label className="flex-1 cursor-pointer">
                    <input type="radio" name="type" className="hidden peer" checked={newApp.type === 'Clinical'} onChange={() => handleTypeChange('Clinical')} />
                    <div className="py-4 border-2 border-slate-100 rounded-2xl text-center peer-checked:bg-indigo-50 peer-checked:border-indigo-500 peer-checked:text-indigo-700 font-black transition-all">Terapia</div>
                  </label>
                  <label className="flex-1 cursor-pointer">
                    <input type="radio" name="type" className="hidden peer" checked={newApp.type === 'Neuropsychology'} onChange={() => handleTypeChange('Neuropsychology')} />
                    <div className="py-4 border-2 border-slate-100 rounded-2xl text-center peer-checked:bg-indigo-50 peer-checked:border-indigo-500 peer-checked:text-indigo-700 font-black transition-all">Avaliação</div>
                  </label>
                </div>
              </div>

              <button type="submit" className="w-full bg-indigo-600 text-white py-6 rounded-[2rem] font-black text-xl hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-100 active:scale-95">
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
