import React from 'react';
import { NavLink } from 'react-router-dom';
import { Shield, LayoutDashboard, History, Settings, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SidebarLink = ({ to, icon: Icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
        isActive
          ? 'bg-primary/20 text-primary border-l-4 border-primary'
          : 'text-gray-400 hover:bg-white/5 hover:text-white'
      }`
    }
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </NavLink>
);

const Sidebar = () => {
  const { logout, user } = useAuth();

  return (
    <aside className="w-64 bg-card border-r border-card-border h-full flex flex-col p-4">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="p-2 bg-primary/20 rounded-xl text-primary">
          <Shield size={28} />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">SENTINEL</h1>
          <p className="text-[10px] text-primary font-mono tracking-widest uppercase">Grid Monitoring</p>
        </div>
      </div>

      <nav className="flex-1 flex flex-col gap-2">
        <SidebarLink to="/" icon={LayoutDashboard} label="Dashboard" />
        <SidebarLink to="/history" icon={History} label="Alert History" />
        <SidebarLink to="/settings" icon={Settings} label="Settings" />
      </nav>

      <div className="mt-auto pt-6 border-t border-white/5">
        <div className="flex items-center gap-3 px-4 py-4 mb-4 bg-white/5 rounded-xl">
          <div className="w-10 h-10 bg-primary/30 rounded-full flex items-center justify-center text-primary border border-primary/20">
            <User size={20} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
            <p className="text-[10px] text-gray-500 font-mono truncate">{user?.role}</p>
          </div>
        </div>
        
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors group"
        >
          <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
          <span className="font-medium text-sm text-red-500">Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
