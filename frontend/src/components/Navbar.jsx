import React from 'react';
import { Search, Bell, Menu, Cpu } from 'lucide-react';
import { useSocket } from '../context/SocketContext';

const Navbar = () => {
  const { alerts } = useSocket();
  const unreadCount = alerts.filter(a => a.status === 'active').length;

  return (
    <header className="h-16 flex items-center justify-between px-6 bg-card/50 backdrop-blur-md border-b border-card-border">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-full max-w-md group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search sensor, drone, or incident..."
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:bg-white/10 focus:border-primary outline-none transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
          <span className="text-[11px] font-mono font-medium text-green-500 uppercase tracking-wider">System Live</span>
        </div>

        <button className="relative p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
          <Bell size={20} className="text-gray-300" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-danger text-white text-[10px] flex items-center justify-center rounded-full border-2 border-background animate-bounce">
              {unreadCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};

export default Navbar;
