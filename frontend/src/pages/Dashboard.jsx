import React, { useState, useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import DashboardMap from '../components/DashboardMap';
import AlertFeed from '../components/AlertFeed';
import { motion } from 'framer-motion';
import { Shield, Radio, Activity, Zap, Cpu, Battery } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, subValue, trend }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="glass p-5 rounded-3xl border-white/5 flex flex-col gap-4 relative overflow-hidden group shadow-lg"
  >
    <div className="flex items-center justify-between">
      <div className="p-3 bg-primary/10 rounded-2xl text-primary border border-primary/20 group-hover:bg-primary group-hover:text-white transition-colors">
        <Icon size={20} />
      </div>
      {trend && (
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${trend === 'up' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
          {trend === 'up' ? '+12%' : '-3%'}
        </span>
      )}
    </div>
    <div>
      <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-500 mb-1">{label}</p>
      <div className="flex items-baseline gap-2">
        <h3 className="text-2xl font-black text-white">{value}</h3>
        <span className="text-xs text-gray-400 font-medium">{subValue}</span>
      </div>
    </div>
    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all" />
  </motion.div>
);

const Dashboard = () => {
  const { alerts, droneData, socket } = useSocket();
  const [logs, setLogs] = useState([]);
  const dronesActive = Object.keys(droneData).length;
  const activeAlerts = alerts.filter(a => a.status === 'active');
  const criticalThreats = activeAlerts.filter(a => a.severity === 'critical').length;

  useEffect(() => {
    if (socket) {
      const handleAllEvents = (data) => {
        setLogs(prev => [
          {
            id: Date.now(),
            time: new Date().toLocaleTimeString(),
            msg: typeof data === 'object' ? JSON.stringify(data).substring(0, 60) + '...' : data
          },
          ...prev.slice(0, 19)
        ]);
      };

      socket.on('newAlert', (data) => handleAllEvents(`ALERT: ${data.title}`));
      socket.on('droneUpdate', (data) => handleAllEvents(`TELEM: ${data.droneId} updated`));
      socket.on('sensorUpdate', (data) => handleAllEvents(`SENSOR: ${data.sensorId} triggered`));

      return () => {
        socket.off('newAlert');
        socket.off('droneUpdate');
        socket.off('sensorUpdate');
      };
    }
  }, [socket]);

  const handlePing = (id) => {
    console.log(`Pinging asset: ${id}`);
    // Optional: socket.emit('pingTarget', { id });
  };

  return (
    <div className="h-full flex flex-col gap-6 font-sans overflow-hidden">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 flex-shrink-0">
        <StatCard 
          icon={Radio} 
          label="Signal Strength" 
          value="99.8" 
          subValue="ms Latency" 
          trend="up"
        />
        <StatCard 
          icon={Shield} 
          label="Active Perimeter" 
          value="32.1" 
          subValue="km Protected" 
        />
        <StatCard 
          icon={Cpu} 
          label="Drone Fleet" 
          value={dronesActive} 
          subValue="Assets Online" 
        />
        <StatCard 
          icon={Activity} 
          label="System Integrity" 
          value={criticalThreats === 0 ? "SECURE" : "BREACH"} 
          subValue={criticalThreats > 0 ? `${criticalThreats} Critical` : "No Active Breach"}
          trend={criticalThreats > 0 ? "down" : "up"}
        />
      </div>

      {/* Main Content Area: Map & Feed */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-4 gap-6 overflow-hidden">
        <div className="lg:col-span-2 relative h-full">
          <DashboardMap />
        </div>
        <div className="lg:col-span-2 h-full grid grid-rows-2 gap-6 overflow-hidden">
          <div className="h-full overflow-hidden">
            <AlertFeed />
          </div>
          <div className="h-full glass rounded-2xl border-white/5 p-4 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <h3 className="text-[10px] font-mono font-black uppercase tracking-widest text-primary">Live Command Log</h3>
              </div>
              <span className="text-[8px] font-mono text-gray-500 uppercase tracking-tighter">Encrypted Stream Layer-7</span>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar font-mono text-[9px] space-y-1.5 opacity-80">
              {logs.length === 0 ? (
                <p className="text-gray-600 animate-pulse">{'>>> ESTABLISHING HANDSHAKE...'}</p>
              ) : (
                logs.map(log => (
                  <div key={log.id} className="flex gap-3">
                    <span className="text-primary font-bold">[{log.time}]</span>
                    <span className="text-gray-400">{'>>>'} {log.msg}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Assets Overview Section */}
      <div className="h-44 flex-shrink-0 overflow-x-auto custom-scrollbar pb-2">
        <div className="flex gap-4 h-full">
          {Object.values(droneData).length === 0 ? (
            <div className="w-full flex items-center justify-center glass rounded-2xl border-white/5 opacity-30 italic text-xs font-mono">
              Waiting for drone telemetry...
            </div>
          ) : (
            Object.values(droneData).map((drone) => (
              <motion.div
                key={drone.droneId}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -5 }}
                className="glass p-4 rounded-2xl border-white/5 flex flex-col justify-between min-w-[200px]"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-primary font-bold">{drone.droneId}</span>
                  <div className="flex items-center gap-1.5 font-bold">
                     <span className="text-[10px] uppercase text-gray-400">Bat</span>
                     <span className="text-[10px]">{drone.battery}%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-2 mb-2">
                   <div className="flex items-center gap-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${drone.status === 'low_battery' ? 'bg-red-500' : 'bg-primary'}`} />
                      <span className="text-[10px] text-gray-400 capitalize font-medium">{drone.status}</span>
                   </div>
                   <button 
                     onClick={() => handlePing(drone.droneId)}
                     className="px-2 py-0.5 bg-primary/10 rounded border border-primary/20 text-[8px] font-bold uppercase text-primary hover:bg-primary hover:text-white transition-all active:scale-95"
                   >
                     Ping
                   </button>
                </div>
                <div className="mt-auto">
                  <div className="flex justify-between text-[8px] text-gray-500 mb-1 font-mono uppercase">
                    <span>Elevation</span>
                    <span>{drone.altitude?.toFixed(0)}m</span>
                  </div>
                  <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                    <motion.div 
                      className="bg-primary h-full shadow-[0_0_8px_rgba(99,102,241,0.5)]" 
                      initial={{ width: 0 }} 
                      animate={{ width: `${drone.battery}%` }} 
                    />
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
