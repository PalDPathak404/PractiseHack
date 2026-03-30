import React from 'react';
import { useSocket } from '../context/SocketContext';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle, Clock, ShieldAlert, Cpu, ShieldCheck } from 'lucide-react';
import axios from 'axios';

const AlertCard = ({ alert, onResolve }) => {
  const severityColors = {
    critical: 'border-red-500/50 bg-red-500/5 text-red-500',
    high: 'border-orange-500/50 bg-orange-500/5 text-orange-500',
    medium: 'border-yellow-500/50 bg-yellow-500/5 text-yellow-500',
    low: 'border-blue-500/50 bg-blue-500/5 text-blue-500',
  };

  const handleResolve = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/alerts/${alert._id}/resolve`, 
        { status: 'resolved' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onResolve(alert._id);
    } catch (err) {
      console.error('Error resolving alert:', err);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className={`p-4 rounded-2xl border ${severityColors[alert.severity]} mb-3 group relative overflow-hidden`}
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-white/5 border border-white/10 mt-1">
          <ShieldAlert size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h4 className="font-bold text-sm tracking-tight truncate uppercase">{alert.title}</h4>
            <span className="text-[10px] font-mono opacity-60 flex items-center gap-1">
              <Clock size={10} />
              {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed mb-3">{alert.description}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2 py-0.5 bg-white/5 rounded text-[10px] font-mono border border-white/5 text-gray-400 uppercase tracking-tighter">
                <Cpu size={10} /> {alert.sourceId}
              </div>
            </div>
            {alert.status === 'active' && (
              <button
                onClick={handleResolve}
                className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg transition-all flex items-center gap-1.5 active:scale-95 text-white"
              >
                Resolve <CheckCircle size={10} />
              </button>
            )}
          </div>
        </div>
      </div>
      {/* Visual pulse for critical alerts */}
      {alert.severity === 'critical' && (
        <div className="absolute top-0 right-0 w-1.5 h-full bg-red-500 animate-pulse" />
      )}
    </motion.div>
  );
};

const AlertFeed = () => {
  const { alerts, resolveAlert } = useSocket();
  const activeAlerts = alerts.filter(a => a.status === 'active');

  return (
    <div className="h-full flex flex-col glass rounded-2xl border-white/5 overflow-hidden">
      <div className="p-5 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
        <div className="flex items-center gap-3">
          <AlertCircle size={20} className="text-primary" />
          <h2 className="text-lg font-bold">Threat Feed</h2>
        </div>
        <div className="px-3 py-0.5 bg-primary/10 rounded-full text-[10px] font-bold uppercase text-primary border border-primary/20">
          {activeAlerts.length} Active
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <AnimatePresence initial={false}>
          {activeAlerts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full flex flex-col items-center justify-center text-gray-500 gap-3 opacity-50"
            >
              <ShieldCheck size={48} strokeWidth={1} />
              <p className="text-xs font-mono tracking-widest uppercase">Grid Perimiter Secure</p>
            </motion.div>
          ) : (
            activeAlerts.map((alert) => (
              <AlertCard key={alert._id} alert={alert} onResolve={resolveAlert} />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AlertFeed;
