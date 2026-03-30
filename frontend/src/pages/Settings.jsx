import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Shield, Eye, Database, Cpu, Save, RefreshCw } from 'lucide-react';

const Settings = () => {
  const [notifications, setNotifications] = useState(true);
  const [sound, setSound] = useState(false);
  const [threshold, setThreshold] = useState(40);

  const SettingRow = ({ icon: Icon, title, description, children }) => (
    <div className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-2xl mb-4 group transition-all hover:bg-white/[0.04]">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-primary/10 rounded-xl text-primary border border-primary/20">
          <Icon size={20} />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-tight">{title}</h3>
          <p className="text-xs text-gray-500 mt-0.5">{description}</p>
        </div>
      </div>
      <div>{children}</div>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl flex flex-col gap-8"
    >
      <header>
        <h1 className="text-2xl font-black text-white tracking-tight uppercase">System Configuration</h1>
        <p className="text-sm text-gray-500 font-mono tracking-widest uppercase mt-1">Grid Operational Parameters</p>
      </header>

      <section>
        <h2 className="text-xs font-mono text-primary font-bold uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
          <Bell size={14} /> Alert Preferences
        </h2>
        
        <SettingRow 
          icon={Bell} 
          title="Push Notifications" 
          description="Receive real-time browser alerts for critical perimeter breaches."
        >
          <button 
            onClick={() => setNotifications(!notifications)}
            className={`w-12 h-6 rounded-full transition-colors relative ${notifications ? 'bg-primary' : 'bg-white/10'}`}
          >
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${notifications ? 'left-7' : 'left-1'}`} />
          </button>
        </SettingRow>

        <SettingRow 
          icon={Shield} 
          title="Audible Warnings" 
          description="Play a siren sound when heat or motion sensors trigger above threshold."
        >
          <button 
            onClick={() => setSound(!sound)}
            className={`w-12 h-6 rounded-full transition-colors relative ${sound ? 'bg-primary' : 'bg-white/10'}`}
          >
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${sound ? 'left-7' : 'left-1'}`} />
          </button>
        </SettingRow>
      </section>

      <section>
        <h2 className="text-xs font-mono text-primary font-bold uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
          <Cpu size={14} /> Global Thresholds
        </h2>
        
        <SettingRow 
          icon={Database} 
          title="Heat Trigger Sensitivity" 
          description={`Set the temperature threshold (°C) for threat generation. Current: ${threshold}°C`}
        >
          <div className="flex items-center gap-4">
             <input 
               type="range" 
               min="20" 
               max="80" 
               value={threshold} 
               onChange={(e) => setThreshold(e.target.value)}
               className="w-32 accent-primary" 
             />
             <span className="text-xs font-mono w-8">{threshold}°C</span>
          </div>
        </SettingRow>
      </section>

      <div className="flex items-center gap-4 pt-4">
         <button className="px-6 py-3 bg-primary text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-primary-hover shadow-lg flex items-center gap-2 transition-all active:scale-95">
            <Save size={16} /> Save Changes
         </button>
         <button className="px-6 py-3 bg-white/5 text-gray-400 text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-white/10 flex items-center gap-2 transition-all">
            <RefreshCw size={16} /> Reset Default
         </button>
      </div>

      <div className="glass p-6 rounded-2xl border-white/5 opacity-50 mt-4">
         <div className="flex items-center gap-3 mb-2">
            <Eye size={16} className="text-primary" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em]">Maintenance Mode</span>
         </div>
         <p className="text-[10px] text-gray-500 leading-relaxed">
            System build ver 2.5.4-SENTINEL. Current operator logs are encrypted with AES-256 and sent to the central command node every 15 minutes.
         </p>
      </div>
    </motion.div>
  );
};

export default Settings;
