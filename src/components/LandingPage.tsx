'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  User,
  BookOpen,
  MapPin,
  Phone,
  Mail,
  Instagram,
  CheckCircle,
  Clock,
  Video,
  Check,
  Sparkles,
  RefreshCw,
  Send,
  Menu,
  X as CloseIcon,
  Mic,
  Ear,
  MessageSquare,
  Baby,
} from 'lucide-react';
import { Appointment, GlobalSettings } from '../types/types';
import { generateConfirmationMessage } from '../services/geminiService';

interface LandingPageProps {
  onBookingComplete: (
    client: { name: string; email: string; phone: string },
    appointment: { date: string; time: string },
  ) => Appointment;
  settings: GlobalSettings;
  appointments: Appointment[];
}

const LandingPage: React.FC<LandingPageProps> = ({
  onBookingComplete,
  settings,
  appointments,
}) => {
  const [showBooking, setShowBooking] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [clientInfo, setClientInfo] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [finalAppointment, setFinalAppointment] = useState<Appointment | null>(
    null,
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  // ... existing code ...

  // ... further down ...
  // Link to="/login" -> Link href="/login"

  const getBrazilDateTime = () => {
    return new Date(
      new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }),
    );
  };

  const todayStr = useMemo(() => {
    const brDate = getBrazilDateTime();
    const year = brDate.getFullYear();
    const month = String(brDate.getMonth() + 1).padStart(2, '0');
    const day = String(brDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);

  const timeSlots = useMemo(() => {
    const slots = [];
    const duration = settings.defaultDuration || 40;
    let current = new Date();
    current.setHours(9, 0, 0, 0);
    const morningEnd = new Date();
    morningEnd.setHours(12, 0, 0, 0);
    while (current < morningEnd) {
      slots.push(
        current.toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      );
      current.setMinutes(current.getMinutes() + duration + 10);
    }
    current = new Date();
    current.setHours(13, 30, 0, 0);
    const afternoonEnd = new Date();
    afternoonEnd.setHours(19, 0, 0, 0);
    while (current < afternoonEnd) {
      slots.push(
        current.toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      );
      current.setMinutes(current.getMinutes() + duration + 10);
    }
    return slots;
  }, [settings.defaultDuration]);

  const availableTimeSlots = useMemo(() => {
    if (!selectedDate) return [];
    const brNow = getBrazilDateTime();
    const currentHour = brNow.getHours();
    const currentMinute = brNow.getMinutes();

    return timeSlots.filter((time) => {
      if (selectedDate === todayStr) {
        const [hour, minute] = time.split(':').map(Number);
        if (
          hour < currentHour ||
          (hour === currentHour && minute <= currentMinute)
        ) {
          return false;
        }
      }
      const isOccupied = appointments.some(
        (app) =>
          app.date === selectedDate &&
          app.time === time &&
          app.status !== 'cancelled',
      );
      return !isOccupied;
    });
  }, [selectedDate, todayStr, timeSlots, appointments]);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetId: string,
  ) => {
    e.preventDefault();
    setIsMenuOpen(false);
    const elementId = targetId.replace('#', '');
    const element = document.getElementById(elementId);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const app = onBookingComplete(clientInfo, {
        date: selectedDate,
        time: selectedTime,
      });
      const message = await generateConfirmationMessage(
        clientInfo.name,
        new Date(selectedDate + 'T12:00:00').toLocaleDateString('pt-BR'),
        selectedTime,
        app.meetLink || '',
      );
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setFinalAppointment(app);
      setBookingStep(3);
    } catch (error) {
      console.error('Erro ao processar agendamento:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const closeBooking = () => {
    setShowBooking(false);
    setBookingStep(1);
    setIsProcessing(false);
    setSelectedDate('');
    setSelectedTime('');
    setClientInfo({ name: '', email: '', phone: '' });
    setFinalAppointment(null);
  };

  return (
    <div className="min-h-screen scroll-smooth overflow-x-hidden font-sans bg-sky-50/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-lg z-50 border-b border-indigo-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div
            className="flex flex-col cursor-pointer group"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <span className="text-2xl font-black text-indigo-900 leading-tight group-hover:text-indigo-600 transition-colors">
              Kezya Rodrigues
            </span>
            <span className="text-[10px] text-indigo-500 font-black tracking-[0.2em] uppercase">
              Fonoaudióloga
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-10">
            <a
              href="#inicio"
              onClick={(e) => handleNavClick(e, '#inicio')}
              className="text-slate-600 hover:text-indigo-600 font-bold transition-colors"
            >
              Início
            </a>
            <a
              href="#sobre"
              onClick={(e) => handleNavClick(e, '#sobre')}
              className="text-slate-600 hover:text-indigo-600 font-bold transition-colors"
            >
              Sobre
            </a>
            <a
              href="#especialidades"
              onClick={(e) => handleNavClick(e, '#especialidades')}
              className="text-slate-600 hover:text-indigo-600 font-bold transition-colors"
            >
              Especialidades
            </a>
            <Link
              href="/login"
              className="text-indigo-700 font-black hover:text-indigo-900 transition-colors"
            >
              Acesso Restrito
            </Link>
            <button
              onClick={() => setShowBooking(true)}
              className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95"
            >
              Agendar Consulta
            </button>
          </div>

          <button
            className="md:hidden p-2 text-slate-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <CloseIcon size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-100 p-8 space-y-6 animate-fade-in shadow-2xl">
            <a
              href="#inicio"
              onClick={(e) => handleNavClick(e, '#inicio')}
              className="block text-lg text-slate-600 font-bold"
            >
              Início
            </a>
            <a
              href="#sobre"
              onClick={(e) => handleNavClick(e, '#sobre')}
              className="block text-lg text-slate-600 font-bold"
            >
              Sobre
            </a>
            <a
              href="#especialidades"
              onClick={(e) => handleNavClick(e, '#especialidades')}
              className="block text-lg text-slate-600 font-bold"
            >
              Especialidades
            </a>
            <Link
              href="/login"
              className="block text-lg text-indigo-700 font-black border-t border-slate-50 pt-6"
            >
              Acesso Restrito
            </Link>
            <button
              onClick={() => {
                setShowBooking(true);
                setIsMenuOpen(false);
              }}
              className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black shadow-lg"
            >
              Agendar Agora
            </button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section
        id="inicio"
        className="pt-40 pb-24 bg-gradient-to-b from-white via-indigo-50/30 to-sky-100/20 scroll-mt-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-10 text-center md:text-left animate-fade-in">
              <div className="inline-flex items-center px-5 py-2 rounded-full bg-indigo-100/50 border border-indigo-200 text-indigo-800 text-xs font-black tracking-widest uppercase">
                <Sparkles size={14} className="mr-2" /> Reabilitando Comunicação
                e Vida
              </div>
              <h1 className="text-5xl md:text-8xl font-black text-slate-900 leading-[1.05] tracking-tight">
                A voz que{' '}
                <span className="text-indigo-600 underline decoration-sky-300">
                  conecta
                </span>{' '}
                corações.
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed max-w-xl mx-auto md:mx-0 font-medium">
                Especialista em fonoaudiologia clínica, com foco em linguagem
                infantil, distúrbios de voz e motricidade orofacial. Um cuidado
                especializado para todas as idades.
              </p>
              <div className="flex flex-col sm:flex-row gap-5 justify-center md:justify-start">
                <button
                  onClick={() => setShowBooking(true)}
                  className="bg-indigo-600 text-white px-12 py-6 rounded-3xl font-black text-xl hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-200 active:scale-95"
                >
                  Agendar minha avaliação
                </button>
                <a
                  href="#sobre"
                  onClick={(e) => handleNavClick(e, '#sobre')}
                  className="px-12 py-6 rounded-3xl font-black text-xl text-slate-700 bg-white border-2 border-slate-100 hover:border-indigo-200 transition-all text-center flex items-center justify-center"
                >
                  Conhecer Kezya
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -top-10 -right-10 w-80 h-80 bg-sky-200/50 rounded-full blur-[100px] -z-10 animate-pulse"></div>
              <img
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=1000"
                alt="Fonoaudiologia"
                className="rounded-[4rem] shadow-3xl border-8 border-white object-cover aspect-[4/5] transform hover:rotate-1 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Specialties */}
      <section id="especialidades" className="py-32 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900">
              Nossas Áreas de Atuação
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">
              Soluções especializadas para que sua comunicação seja clara,
              fluida e saudável.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Baby size={36} />,
                title: 'Linguagem Infantil',
                desc: 'Acompanhamento do desenvolvimento da fala e linguagem em crianças.',
                color: 'bg-pink-50 text-pink-600',
              },
              {
                icon: <Mic size={36} />,
                title: 'Distúrbios da Voz',
                desc: 'Tratamento para rouquidão, cansaço vocal e profissionais da voz.',
                color: 'bg-indigo-50 text-indigo-600',
              },
              {
                icon: <MessageSquare size={36} />,
                title: 'Motricidade Orofacial',
                desc: 'Ajuste de funções como mastigação, deglutição e respiração.',
                color: 'bg-sky-50 text-sky-600',
              },
              {
                icon: <Ear size={36} />,
                title: 'Processamento Auditivo',
                desc: 'Melhoria na percepção e interpretação de sons e fala.',
                color: 'bg-emerald-50 text-emerald-600',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-10 rounded-[3rem] bg-slate-50/50 border border-slate-100 hover:bg-white hover:shadow-2xl transition-all group"
              >
                <div
                  className={`w-20 h-20 ${item.color} rounded-[2rem] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-sm`}
                >
                  {item.icon}
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">
                  {item.title}
                </h3>
                <p className="text-slate-500 font-medium leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section
        id="sobre"
        className="py-32 bg-indigo-900 text-white scroll-mt-20 overflow-hidden relative"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-[120px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <h2 className="text-5xl font-black tracking-tight leading-tight">
                Expertise em{' '}
                <span className="text-sky-400">Comunicação Humana</span>
              </h2>
              <div className="space-y-6 text-indigo-100 text-xl leading-relaxed font-medium">
                <p>
                  Kezya Rodrigues é Fonoaudióloga graduada com honras,
                  apaixonada por transformar vidas através da fala e audição.
                </p>
                <p>
                  Sua abordagem une a{' '}
                  <span className="text-white font-bold">
                    ciência baseada em evidências
                  </span>{' '}
                  com um acolhimento lúdico e humano, garantindo que cada
                  paciente alcance seu máximo potencial comunicativo.
                </p>
                <div className="grid grid-cols-2 gap-6 pt-6">
                  <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/10 backdrop-blur-md">
                    <p className="text-sky-400 font-black text-4xl mb-1">
                      Especialista
                    </p>
                    <p className="text-xs uppercase tracking-[0.3em] font-black opacity-60">
                      Linguagem e Voz
                    </p>
                  </div>
                  <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/10 backdrop-blur-md">
                    <p className="text-sky-400 font-black text-4xl mb-1">
                      CRFa
                    </p>
                    <p className="text-xs uppercase tracking-[0.3em] font-black opacity-60">
                      Conselho Federal
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white/10 p-4 rounded-[4rem] backdrop-blur-sm border border-white/20">
              <img
                src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=800"
                alt="Kezya Rodrigues"
                className="rounded-[3rem] w-full aspect-square object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-8">
          <div className="flex flex-col items-center">
            <span className="text-3xl font-black text-indigo-400">
              Kezya Rodrigues
            </span>
            <span className="text-[10px] text-indigo-600 font-black uppercase tracking-[0.4em] mt-2">
              Fonoaudióloga
            </span>
          </div>
          <div className="flex justify-center gap-10">
            <Instagram
              size={28}
              className="text-slate-500 hover:text-indigo-400 cursor-pointer transition-colors"
            />
            <Mail
              size={28}
              className="text-slate-500 hover:text-indigo-400 cursor-pointer transition-colors"
            />
            <Phone
              size={28}
              className="text-slate-500 hover:text-indigo-400 cursor-pointer transition-colors"
            />
          </div>
          <p className="text-slate-500 text-sm font-medium">
            © 2024 Kezya Rodrigues - Fonoaudiologia Clínica. Todos os direitos
            reservados.
          </p>
        </div>
      </footer>

      {/* Booking Modal */}
      {showBooking && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-xl overflow-hidden relative animate-scale-up">
            <button
              onClick={closeBooking}
              className="absolute top-8 right-8 text-slate-400 hover:text-slate-900 z-10 p-2 hover:bg-slate-50 rounded-full transition-all"
            >
              ✕
            </button>

            <div className="bg-indigo-600 p-12 text-white">
              <h3 className="text-4xl font-black mb-3">Agendamento</h3>
              <p className="text-indigo-100 font-bold opacity-80">
                Escolha seu horário preferencial
              </p>
              <div className="flex gap-4 mt-10">
                {[1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className={`h-2 flex-1 rounded-full transition-all duration-500 ${
                      bookingStep >= step ? 'bg-white' : 'bg-white/20'
                    }`}
                  ></div>
                ))}
              </div>
            </div>

            <div className="p-12">
              {isProcessing ? (
                <div className="py-24 flex flex-col items-center justify-center space-y-8 animate-pulse">
                  <div className="w-24 h-24 border-8 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                  <div className="text-center">
                    <p className="text-2xl font-black text-slate-800 tracking-tight">
                      Processando seu horário...
                    </p>
                    <p className="text-slate-400 font-bold mt-2">
                      Estamos gerando sua sala virtual de atendimento.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {bookingStep === 1 && (
                    <div className="space-y-10">
                      <div className="space-y-4">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          <Calendar size={18} className="text-indigo-600" />{' '}
                          Selecione a Data
                        </label>
                        <input
                          type="date"
                          min={todayStr}
                          value={selectedDate}
                          className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-5 px-6 outline-none font-black text-slate-800 focus:border-indigo-500 transition-all"
                          onChange={(e) => {
                            setSelectedDate(e.target.value);
                            setSelectedTime('');
                          }}
                        />
                      </div>
                      {selectedDate && (
                        <div className="space-y-6 animate-fade-in">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Clock size={18} className="text-indigo-600" />{' '}
                            Horários de Atendimento
                          </label>
                          <div className="grid grid-cols-3 gap-3 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
                            {availableTimeSlots.map((time) => (
                              <button
                                key={time}
                                onClick={() => setSelectedTime(time)}
                                className={`py-4 px-2 rounded-2xl border-2 font-black text-sm transition-all ${
                                  selectedTime === time
                                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg'
                                    : 'bg-white border-slate-100 text-slate-500 hover:border-indigo-200'
                                }`}
                              >
                                {time}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      <button
                        disabled={!selectedDate || !selectedTime}
                        onClick={() => setBookingStep(2)}
                        className="w-full bg-indigo-600 text-white py-6 rounded-3xl font-black text-xl disabled:opacity-30 shadow-2xl shadow-indigo-100 transition-all active:scale-95"
                      >
                        Continuar
                      </button>
                    </div>
                  )}

                  {bookingStep === 2 && (
                    <form onSubmit={handleBookingSubmit} className="space-y-8">
                      <div className="bg-indigo-50 p-8 rounded-[2.5rem] border-2 border-indigo-100 text-indigo-900">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600/60 mb-2">
                          Consulta Agendada para
                        </p>
                        <p className="font-black text-3xl">
                          {new Date(
                            selectedDate + 'T12:00:00',
                          ).toLocaleDateString('pt-BR')}{' '}
                          às {selectedTime}
                        </p>
                      </div>
                      <div className="space-y-5">
                        <input
                          type="text"
                          required
                          className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-5 px-6 font-black placeholder:text-slate-300 focus:border-indigo-500 outline-none"
                          value={clientInfo.name}
                          onChange={(e) =>
                            setClientInfo({
                              ...clientInfo,
                              name: e.target.value,
                            })
                          }
                          placeholder="Seu Nome Completo"
                        />
                        <input
                          type="tel"
                          required
                          className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-5 px-6 font-black placeholder:text-slate-300 focus:border-indigo-500 outline-none"
                          value={clientInfo.phone}
                          onChange={(e) =>
                            setClientInfo({
                              ...clientInfo,
                              phone: e.target.value,
                            })
                          }
                          placeholder="WhatsApp (DDD + Número)"
                        />
                        <input
                          type="email"
                          required
                          className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-5 px-6 font-black placeholder:text-slate-300 focus:border-indigo-500 outline-none"
                          value={clientInfo.email}
                          onChange={(e) =>
                            setClientInfo({
                              ...clientInfo,
                              email: e.target.value,
                            })
                          }
                          placeholder="Seu E-mail"
                        />
                      </div>
                      <div className="flex gap-4">
                        <button
                          type="button"
                          onClick={() => setBookingStep(1)}
                          className="flex-1 bg-slate-100 text-slate-500 py-6 rounded-3xl font-black hover:bg-slate-200"
                        >
                          Voltar
                        </button>
                        <button
                          type="submit"
                          className="flex-[2] bg-indigo-600 text-white py-6 rounded-3xl font-black text-xl flex items-center justify-center gap-3 hover:bg-indigo-700"
                        >
                          Confirmar <Send size={20} />
                        </button>
                      </div>
                    </form>
                  )}

                  {bookingStep === 3 && finalAppointment && (
                    <div className="text-center space-y-10 animate-fade-in py-6">
                      <div className="w-28 h-28 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                        <CheckCircle size={64} />
                      </div>
                      <div>
                        <h3 className="text-4xl font-black text-slate-900 tracking-tight">
                          Tudo Pronto!
                        </h3>
                        <p className="text-slate-500 font-bold text-lg mt-3">
                          Sua consulta foi agendada e os detalhes enviados.
                        </p>
                      </div>
                      <div className="bg-slate-900 rounded-[3rem] p-10 text-left text-white relative overflow-hidden">
                        <div className="flex items-center gap-6 border-b border-white/10 pb-8 mb-8">
                          <Video className="text-indigo-400" size={40} />
                          <div>
                            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">
                              Sala Virtual Kezya Rodrigues
                            </p>
                            <a
                              href={finalAppointment.meetLink}
                              target="_blank"
                              rel="noreferrer"
                              className="font-black text-xl break-all hover:text-sky-300 transition-colors"
                            >
                              Acessar Consulta Online
                            </a>
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 font-medium">
                          Lembre-se de testar seu áudio e vídeo alguns minutos
                          antes da sessão.
                        </p>
                      </div>
                      <button
                        onClick={closeBooking}
                        className="w-full bg-slate-100 text-slate-800 py-6 rounded-3xl font-black text-xl hover:bg-slate-200 transition-all"
                      >
                        Fechar
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
