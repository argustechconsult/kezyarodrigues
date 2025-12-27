'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Calendar,
  DollarSign,
  Columns,
  RefreshCw,
  LogOut,
  FileText,
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { logout, isAuthenticated, isLoading } = useAppContext();
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-indigo-600 font-bold text-xl animate-pulse">
          Carregando sistema...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const handleLogoutClick = () => {
    logout();
    router.push('/');
  };

  const isActive = (path: string) => {
    if (path === '/admin' && pathname === '/admin') return true;
    if (path !== '/admin' && pathname?.startsWith(path)) return true;
    return false;
  };

  const getLinkClass = (path: string) =>
    `flex items-center gap-4 px-6 py-4 rounded-[1.5rem] transition-all font-black text-sm uppercase tracking-wider ${
      isActive(path)
        ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-900/40'
        : 'text-slate-500 hover:bg-white/5 hover:text-white'
    }`;

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-slate-900 text-white flex flex-col shrink-0 shadow-2xl">
        <div className="p-10 border-b border-white/5">
          <h1 className="text-3xl font-black text-white tracking-tight leading-none">
            Kezya
          </h1>
          <p className="text-[9px] text-indigo-400 uppercase tracking-[0.4em] font-black mt-2">
            Fonoaudióloga
          </p>
        </div>

        <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
          <Link href="/admin" className={getLinkClass('/admin')}>
            <LayoutDashboard size={22} /> Dashboard
          </Link>
          <Link
            href="/admin/clients"
            className={getLinkClass('/admin/clients')}
          >
            <Users size={22} /> Pacientes
          </Link>
          <Link
            href="/admin/schedule"
            className={getLinkClass('/admin/schedule')}
          >
            <Calendar size={22} /> Agenda
          </Link>
          <Link
            href="/admin/reports"
            className={getLinkClass('/admin/reports')}
          >
            <FileText size={22} /> Prontuários
          </Link>
          <Link href="/admin/kanban" className={getLinkClass('/admin/kanban')}>
            <Columns size={22} /> Fluxo
          </Link>
          <Link
            href="/admin/finance"
            className={getLinkClass('/admin/finance')}
          >
            <DollarSign size={22} /> Financeiro
          </Link>
          <Link
            href="/admin/retention"
            className={getLinkClass('/admin/retention')}
          >
            <RefreshCw size={22} /> Retenção
          </Link>
        </nav>

        <div className="p-8 border-t border-white/5">
          <button
            onClick={handleLogoutClick}
            className="w-full flex items-center justify-center gap-3 px-6 py-5 text-red-400 hover:bg-red-500/10 rounded-3xl transition-all font-black border border-red-500/20"
          >
            <LogOut size={22} /> Sair do Sistema
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-slate-50">
        <header className="h-24 bg-white/80 backdrop-blur-md border-b border-slate-200 px-12 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">
            Painel de Controle{' '}
            <span className="text-indigo-600 italic">Kezya Rodrigues</span>
          </h2>
          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <p className="text-lg font-black text-slate-900 leading-none">
                Fga. Kezya Rodrigues
              </p>
              <p className="text-[10px] text-indigo-600 font-black uppercase tracking-[0.2em] mt-1">
                Especialista em Comunicação
              </p>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100"
                className="w-14 h-14 rounded-[1.5rem] border-4 border-white shadow-2xl object-cover"
                alt="Kezya"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-4 border-white rounded-full"></div>
            </div>
          </div>
        </header>
        <div className="p-12 max-w-[1700px] mx-auto">{children}</div>
      </main>
    </div>
  );
}
