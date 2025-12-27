
import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, DollarSign, Columns, RefreshCw, LogOut, FileText } from 'lucide-react';

interface AdminLayoutProps {
  onLogout: () => void;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout();
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-slate-900 text-white flex flex-col shrink-0 shadow-2xl">
        <div className="p-10 border-b border-white/5">
          <h1 className="text-3xl font-black text-white tracking-tight leading-none">Kezya</h1>
          <p className="text-[9px] text-indigo-400 uppercase tracking-[0.4em] font-black mt-2">Fonoaudióloga</p>
        </div>
        
        <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
          <NavLink 
            to="/admin" 
            end
            className={({ isActive }) => `flex items-center gap-4 px-6 py-4 rounded-[1.5rem] transition-all font-black text-sm uppercase tracking-wider ${isActive ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-900/40' : 'text-slate-500 hover:bg-white/5 hover:text-white'}`}
          >
            <LayoutDashboard size={22} /> Dashboard
          </NavLink>
          <NavLink 
            to="/admin/clients" 
            className={({ isActive }) => `flex items-center gap-4 px-6 py-4 rounded-[1.5rem] transition-all font-black text-sm uppercase tracking-wider ${isActive ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-900/40' : 'text-slate-500 hover:bg-white/5 hover:text-white'}`}
          >
            <Users size={22} /> Pacientes
          </NavLink>
          <NavLink 
            to="/admin/schedule" 
            className={({ isActive }) => `flex items-center gap-4 px-6 py-4 rounded-[1.5rem] transition-all font-black text-sm uppercase tracking-wider ${isActive ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-900/40' : 'text-slate-500 hover:bg-white/5 hover:text-white'}`}
          >
            <Calendar size={22} /> Agenda
          </NavLink>
          <NavLink 
            to="/admin/reports" 
            className={({ isActive }) => `flex items-center gap-4 px-6 py-4 rounded-[1.5rem] transition-all font-black text-sm uppercase tracking-wider ${isActive ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-900/40' : 'text-slate-500 hover:bg-white/5 hover:text-white'}`}
          >
            <FileText size={22} /> Prontuários
          </NavLink>
          <NavLink 
            to="/admin/kanban" 
            className={({ isActive }) => `flex items-center gap-4 px-6 py-4 rounded-[1.5rem] transition-all font-black text-sm uppercase tracking-wider ${isActive ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-900/40' : 'text-slate-500 hover:bg-white/5 hover:text-white'}`}
          >
            <Columns size={22} /> Fluxo
          </NavLink>
          <NavLink 
            to="/admin/finance" 
            className={({ isActive }) => `flex items-center gap-4 px-6 py-4 rounded-[1.5rem] transition-all font-black text-sm uppercase tracking-wider ${isActive ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-900/40' : 'text-slate-500 hover:bg-white/5 hover:text-white'}`}
          >
            <DollarSign size={22} /> Financeiro
          </NavLink>
          <NavLink 
            to="/admin/retention" 
            className={({ isActive }) => `flex items-center gap-4 px-6 py-4 rounded-[1.5rem] transition-all font-black text-sm uppercase tracking-wider ${isActive ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-900/40' : 'text-slate-500 hover:bg-white/5 hover:text-white'}`}
          >
            <RefreshCw size={22} /> Retenção
          </NavLink>
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
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Painel de Controle <span className="text-indigo-600 italic">Kezya Rodrigues</span></h2>
          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <p className="text-lg font-black text-slate-900 leading-none">Fga. Kezya Rodrigues</p>
              <p className="text-[10px] text-indigo-600 font-black uppercase tracking-[0.2em] mt-1">Especialista em Comunicação</p>
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
        <div className="p-12 max-w-[1700px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
