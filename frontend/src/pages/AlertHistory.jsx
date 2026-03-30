import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Search, Filter, Download, Trash2, Calendar, MapPin, Tag } from 'lucide-react';

const AlertHistory = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchAlerts = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('http://localhost:5000/api/alerts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAlerts(data);
    } catch (err) {
      console.error('Error fetching alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleExportCSV = () => {
    if (alerts.length === 0) return;
    
    const headers = ['ID', 'Title', 'Severity', 'Source', 'Status', 'Timestamp', 'Lat', 'Lng'];
    const csvRows = [
      headers.join(','),
      ...alerts.map(row => [
        row._id,
        `"${row.title}"`,
        row.severity,
        row.sourceId,
        row.status,
        new Date(row.timestamp).toISOString(),
        row.location.latitude,
        row.location.longitude
      ].join(','))
    ];
    
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `sentinel_alerts_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDeleteAlert = async (id) => {
    if (window.confirm('Are you sure you want to delete this incident record?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/alerts/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAlerts(alerts.filter(a => a._id !== id));
      } catch (err) {
        console.error('Error deleting alert:', err);
      }
    }
  };

  const filteredAlerts = alerts.filter(alert => 
    alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alert.sourceId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSeverityStyle = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'high': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'medium': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      default: return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Incident Log</h1>
          <p className="text-sm text-gray-500">Historical archive of all security events and interventions.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleExportCSV}
            className="glass px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-white/10 transition-colors"
          >
            <Download size={16} /> Export CSV
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4">
        <div className="glass p-4 rounded-2xl border-white/5 flex items-center gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary" size={18} />
            <input 
              type="text" 
              placeholder="Filter by incident ID or source..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:bg-white/10 focus:border-primary outline-none transition-all"
            />
          </div>
          <button className="glass p-2 rounded-xl"><Filter size={18} /></button>
        </div>

        <div className="glass rounded-2xl border-white/5 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/5">
                <th className="px-6 py-4 text-[10px] font-mono uppercase tracking-wider text-gray-500">Event Info</th>
                <th className="px-6 py-4 text-[10px] font-mono uppercase tracking-wider text-gray-500">Location</th>
                <th className="px-6 py-4 text-[10px] font-mono uppercase tracking-wider text-gray-500">Severity</th>
                <th className="px-6 py-4 text-[10px] font-mono uppercase tracking-wider text-gray-500">Status</th>
                <th className="px-6 py-4 text-[10px] font-mono uppercase tracking-wider text-gray-500">Timestamp</th>
                <th className="px-6 py-4 text-[10px] font-mono uppercase tracking-wider text-gray-500 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                   <td colSpan="6" className="px-6 py-20 text-center text-gray-500 animate-pulse font-mono uppercase tracking-[0.2em] text-xs">Accessing Archives...</td>
                </tr>
              ) : filteredAlerts.length === 0 ? (
                <tr>
                   <td colSpan="6" className="px-6 py-20 text-center text-gray-500 opacity-50">No historical records found matching criteria.</td>
                </tr>
              ) : (
                filteredAlerts.map((alert) => (
                  <motion.tr 
                    key={alert._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-white group-hover:text-primary transition-colors">{alert.title}</span>
                        <span className="text-[10px] text-gray-500 font-mono">{alert.sourceId}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <MapPin size={12} className="text-primary/50" />
                        {alert.location.latitude.toFixed(4)}, {alert.location.longitude.toFixed(4)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getSeverityStyle(alert.severity)}`}>
                        {alert.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                       <span className={`text-xs ${alert.status === 'resolved' ? 'text-green-500' : 'text-danger'} font-medium capitalize flex items-center gap-1.5`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${alert.status === 'resolved' ? 'bg-green-500' : 'bg-danger'}`} />
                          {alert.status}
                       </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500 font-mono">
                      {new Date(alert.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                       <button className="p-2 text-gray-600 hover:text-red-500 transition-colors">
                          <Trash2 size={16} />
                       </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AlertHistory;
